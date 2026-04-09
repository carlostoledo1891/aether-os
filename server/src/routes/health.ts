import type { FastifyInstance } from 'fastify'
import { getLatestTelemetry } from '../store/db.js'

const startedAt = Date.now()

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/health', {
    schema: {
      tags: ['health'],
      summary: 'Server health check',
      description: 'Returns uptime, last ingest timestamp, and source of last telemetry tick.',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok'] },
            uptimeMs: { type: 'number' },
            lastIngestAt: { type: ['string', 'null'] },
            source: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    const latest = getLatestTelemetry()
    return {
      status: 'ok',
      uptimeMs: Date.now() - startedAt,
      lastIngestAt: latest?.updated_at ?? null,
      source: latest?.source ?? 'none',
    }
  })
}
