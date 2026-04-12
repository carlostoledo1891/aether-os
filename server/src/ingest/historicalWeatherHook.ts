import type { FastifyInstance } from 'fastify'
import { upsertHistoricalWeather } from '../store/db.js'
import type { HistoricalWeatherIngestPayload } from '../types/shared.js'

export async function historicalWeatherIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: HistoricalWeatherIngestPayload }>('/ingest/historical-weather', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['ingest'], summary: 'Ingest historical weather archive (ERA5 via Open-Meteo)', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.series || typeof payload.dayCount !== 'number') {
      return reply.code(400).send({ error: 'Missing series or dayCount' })
    }
    upsertHistoricalWeather(payload)
    return { ok: true, dayCount: payload.dayCount, receivedAt: new Date().toISOString() }
  })
}
