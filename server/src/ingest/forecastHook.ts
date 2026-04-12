import type { FastifyInstance } from 'fastify'
import { upsertForecast } from '../store/db.js'
import type { ForecastIngestPayload } from '../types/shared.js'

export async function forecastIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: ForecastIngestPayload }>('/ingest/forecast', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    schema: { tags: ['ingest'], summary: 'Ingest 16-day weather forecast from Open-Meteo', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.series || typeof payload.totalPrecipMm !== 'number') {
      return reply.code(400).send({ error: 'Missing series or totalPrecipMm' })
    }
    upsertForecast(payload)
    return { ok: true, forecastDays: payload.forecastDays, receivedAt: new Date().toISOString() }
  })
}
