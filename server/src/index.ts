import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import { healthRoutes } from './routes/health.js'
import { telemetryRoutes } from './routes/telemetry.js'
import { domainRoutes } from './routes/domain.js'
import { telemetryIngestRoutes } from './ingest/telemetryHook.js'
import { weatherIngestRoutes } from './ingest/weatherHook.js'
import { marketIngestRoutes } from './ingest/marketHook.js'
import { lapocIngestRoutes } from './ingest/lapocHook.js'
import { telemetryWsRoutes } from './ws/telemetryChannel.js'
import { seedIfNeeded } from './seed.js'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? true
const INGEST_API_KEY = process.env.INGEST_API_KEY ?? ''

export async function buildApp(opts: { logger?: boolean } = {}) {
  const app = Fastify({ logger: opts.logger ?? true })

  await app.register(cors, { origin: CORS_ORIGIN })
  await app.register(websocket)

  seedIfNeeded()

  if (INGEST_API_KEY) {
    app.addHook('onRequest', async (req, reply) => {
      if (req.url.startsWith('/ingest/')) {
        const key = req.headers['x-api-key']
        if (key !== INGEST_API_KEY) {
          return reply.code(401).send({ error: 'Invalid or missing API key' })
        }
      }
    })
  }

  await app.register(healthRoutes)
  await app.register(telemetryRoutes)
  await app.register(domainRoutes)
  await app.register(telemetryIngestRoutes)
  await app.register(weatherIngestRoutes)
  await app.register(marketIngestRoutes)
  await app.register(lapocIngestRoutes)
  await app.register(telemetryWsRoutes)

  return app
}

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`\n  Aether API running at http://${HOST}:${PORT}`)
    console.log(`  WebSocket at ws://${HOST}:${PORT}/ws/telemetry`)
    console.log(`  Health check: http://localhost:${PORT}/api/health\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

const isDirectRun = process.argv[1]?.endsWith('index.js') || process.argv[1]?.endsWith('index.ts')
if (isDirectRun) {
  main()
}
