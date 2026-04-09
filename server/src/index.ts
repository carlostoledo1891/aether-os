import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { healthRoutes } from './routes/health.js'
import { telemetryRoutes } from './routes/telemetry.js'
import { domainRoutes } from './routes/domain.js'
import { telemetryIngestRoutes } from './ingest/telemetryHook.js'
import { weatherIngestRoutes } from './ingest/weatherHook.js'
import { marketIngestRoutes } from './ingest/marketHook.js'
import { lapocIngestRoutes } from './ingest/lapocHook.js'
import { telemetryWsRoutes } from './ws/telemetryChannel.js'
import multipart from '@fastify/multipart'
import { chatRoutes } from './routes/chat.js'
import { chatUploadRoutes } from './routes/chatUpload.js'
import { seedIfNeeded } from './seed.js'
import { getDb } from './store/db.js'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? true
const INGEST_API_KEY = process.env.INGEST_API_KEY ?? ''

export async function buildApp(opts: { logger?: boolean } = {}) {
  const app = Fastify({ logger: opts.logger ?? true })

  await app.register(cors, { origin: CORS_ORIGIN })
  await app.register(websocket)
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } })

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Vero API',
        version: '0.1.0',
        description:
          'REST + WebSocket API for the Vero critical-minerals supply-chain platform. ' +
          'Serves domain data, telemetry, enricher outputs, and ingest endpoints for the simulation engine.',
        contact: { name: 'Vero', url: 'https://vero.earth' },
        license: { name: 'Proprietary' },
      },
      tags: [
        { name: 'health', description: 'Server health and uptime' },
        { name: 'telemetry', description: 'Real-time and historical telemetry' },
        { name: 'domain', description: 'Seeded domain data (financials, risks, batches, etc.)' },
        { name: 'project', description: 'Project-level static data (deposits, resources, hydrology)' },
        { name: 'enrichers', description: 'Weather, market, seismic, and LAPOC data from external sources' },
        { name: 'ingest', description: 'Engine → API data ingestion (requires x-api-key)' },
        { name: 'export', description: 'Regulatory and DPP export bundles' },
        { name: 'alerts', description: 'Alert management (requires x-api-key)' },
        { name: 'ai', description: 'AI analyst chat (streaming, requires GOOGLE_GENERATIVE_AI_API_KEY)' },
      ],
      components: {
        securitySchemes: {
          apiKey: { type: 'apiKey', name: 'x-api-key', in: 'header' },
        },
      },
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  })

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
  await app.register(chatRoutes)
  await app.register(chatUploadRoutes)

  return app
}

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    setupGracefulShutdown(app)
    console.log(`\n  Vero API running at http://${HOST}:${PORT}`)
    console.log(`  WebSocket at ws://${HOST}:${PORT}/ws/telemetry`)
    console.log(`  Health check: http://localhost:${PORT}/api/health\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

function setupGracefulShutdown(app: Awaited<ReturnType<typeof buildApp>>) {
  const shutdown = async () => {
    console.log('\n[server] Shutting down gracefully...')
    await app.close()
    try { getDb().close() } catch { /* already closed */ }
    process.exit(0)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

const isDirectRun = process.argv[1]?.endsWith('index.js') || process.argv[1]?.endsWith('index.ts')
if (isDirectRun) {
  main()
}
