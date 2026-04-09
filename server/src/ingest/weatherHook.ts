import type { FastifyInstance } from 'fastify'
import { upsertWeather } from '../store/db.js'
import type { WeatherIngestPayload } from '../types/shared.js'

export async function weatherIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: WeatherIngestPayload }>('/ingest/weather', {
    schema: { tags: ['ingest'], summary: 'Ingest weather data from Open-Meteo enricher', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.series || typeof payload.precipMm !== 'number') {
      return reply.code(400).send({ error: 'Missing series or precipMm' })
    }
    upsertWeather(payload)
    return { ok: true, receivedAt: new Date().toISOString() }
  })
}
