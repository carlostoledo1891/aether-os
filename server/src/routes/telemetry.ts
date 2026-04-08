import type { FastifyInstance } from 'fastify'
import { getLatestTelemetry, getTelemetryHistory } from '../store/db.js'
import type { TimeRangeKey } from '../types/shared.js'

const VALID_RANGES = new Set<TimeRangeKey>(['24h', '7d', '30d'])

export async function telemetryRoutes(app: FastifyInstance) {
  app.get('/api/telemetry/current', async (_req, reply) => {
    const latest = getLatestTelemetry()
    if (!latest) {
      return reply.code(503).send({ error: 'No telemetry ingested yet' })
    }
    return {
      plant: latest.plant,
      env: latest.env,
      esg: latest.esg,
      alerts: latest.alerts.filter(a => !a.dismissed),
      source: latest.source,
      updatedAt: latest.updated_at,
    }
  })

  app.get<{ Querystring: { range?: string } }>('/api/telemetry/history', async (req, reply) => {
    const range = (req.query.range ?? '24h') as TimeRangeKey
    if (!VALID_RANGES.has(range)) {
      return reply.code(400).send({ error: `Invalid range. Use: ${[...VALID_RANGES].join(', ')}` })
    }
    return getTelemetryHistory(range)
  })
}
