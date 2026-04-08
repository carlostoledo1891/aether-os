import type { FastifyInstance } from 'fastify'
import { getLatestTelemetry } from '../store/db.js'

const startedAt = Date.now()

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/health', async () => {
    const latest = getLatestTelemetry()
    return {
      status: 'ok',
      uptimeMs: Date.now() - startedAt,
      lastIngestAt: latest?.updated_at ?? null,
      source: latest?.source ?? 'none',
    }
  })
}
