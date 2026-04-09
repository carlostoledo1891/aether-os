import type { FastifyInstance } from 'fastify'
import { upsertMarket, upsertSeismic } from '../store/db.js'
import type { MarketIngestPayload, SeismicIngestPayload } from '../types/shared.js'

export async function marketIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: MarketIngestPayload }>('/ingest/market', {
    schema: { tags: ['ingest'], summary: 'Ingest market data (FX or stock)', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.symbol || typeof payload.value !== 'number') {
      return reply.code(400).send({ error: 'Missing symbol or value' })
    }
    upsertMarket(payload)
    return { ok: true, receivedAt: new Date().toISOString() }
  })

  app.post<{ Body: SeismicIngestPayload }>('/ingest/seismic', {
    schema: { tags: ['ingest'], summary: 'Ingest seismic events (USGS)', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.events || !Array.isArray(payload.events)) {
      return reply.code(400).send({ error: 'Missing events array' })
    }
    upsertSeismic(payload)
    return { ok: true, count: payload.events.length, receivedAt: new Date().toISOString() }
  })
}
