import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
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
import { forecastIngestRoutes } from './ingest/forecastHook.js'
import { historicalWeatherIngestRoutes } from './ingest/historicalWeatherHook.js'
import { telemetryWsRoutes } from './ws/telemetryChannel.js'
import multipart from '@fastify/multipart'
import { chatRoutes } from './routes/chat.js'
import { chatUploadRoutes } from './routes/chatUpload.js'
import { seedIfNeeded } from './seed.js'
import { getDb } from './store/db.js'

const ENV_HINTS: Array<[string, string]> = [
  ['GOOGLE_GENERATIVE_AI_API_KEY', 'AI chat will return 501. Get a key at https://aistudio.google.com/apikey'],
]
for (const [key, hint] of ENV_HINTS) {
  if (!process.env[key]) console.warn(`\u26A0 ${key} not set \u2014 ${hint}`)
}

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

export async function buildApp(opts: { logger?: boolean } = {}) {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production'
  const DEFAULT_ORIGINS = ['http://localhost:5175', 'http://localhost:5173']
  const CORS_ORIGIN: string[] | string = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : (IS_PRODUCTION ? DEFAULT_ORIGINS : '*' as unknown as string)
  const INGEST_API_KEY = process.env.INGEST_API_KEY ?? ''
  const CHAT_API_KEY = process.env.CHAT_API_KEY ?? ''

  const app = Fastify({ logger: opts.logger ?? true })

  await app.register(cors, { origin: CORS_ORIGIN as string | string[] })
  await app.register(rateLimit, { global: true, max: 120, timeWindow: '1 minute' })
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
        { name: 'integrity', description: 'Audit chain integrity and verification' },
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

  app.setErrorHandler((error: { statusCode?: number; message?: string; stack?: string }, _req, reply) => {
    const status = error.statusCode ?? 500
    if (IS_PRODUCTION && status >= 500) {
      reply.code(status).send({ error: 'Internal Server Error' })
    } else {
      reply.code(status).send({ error: error.message, ...(error.statusCode ? {} : { stack: error.stack }) })
    }
  })

  seedIfNeeded()

  app.addHook('onRequest', async (req, reply) => {
    if (req.url.startsWith('/ingest/')) {
      if (!INGEST_API_KEY) {
        if (IS_PRODUCTION) {
          return reply.code(503).send({ error: 'Ingest disabled — INGEST_API_KEY not configured' })
        }
        return
      }
      const key = req.headers['x-api-key']
      if (key !== INGEST_API_KEY) {
        return reply.code(401).send({ error: 'Invalid or missing API key' })
      }
    }

    if (req.url.startsWith('/api/chat')) {
      if (!CHAT_API_KEY) {
        if (!IS_PRODUCTION) return
      }
      const key = req.headers['x-api-key']
      if (key !== CHAT_API_KEY) {
        return reply.code(401).send({ error: 'Invalid or missing API key' })
      }
    }
  })

  await app.register(healthRoutes)
  await app.register(telemetryRoutes)
  await app.register(domainRoutes)
  await app.register(telemetryIngestRoutes)
  await app.register(weatherIngestRoutes)
  await app.register(forecastIngestRoutes)
  await app.register(historicalWeatherIngestRoutes)
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
