import type { FastifyInstance } from 'fastify'
import { upsertTelemetry } from '../store/db.js'
import type { IngestPayload } from '../types/shared.js'
import { broadcastTelemetry } from '../ws/telemetryChannel.js'

export async function telemetryIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: IngestPayload }>('/ingest/telemetry', {
    schema: { tags: ['ingest'], summary: 'Ingest telemetry tick from engine', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.plant || !payload.env || !payload.esg) {
      return reply.code(400).send({ error: 'Missing plant, env, or esg in payload' })
    }

    const tick = {
      plant: payload.plant,
      env: payload.env,
      esg: payload.esg,
      alerts: payload.alerts ?? [],
    }

    upsertTelemetry(tick, payload.source ?? 'unknown')

    broadcastTelemetry({
      ...tick,
      alerts: tick.alerts.filter(a => !a.dismissed),
    })

    return { ok: true, receivedAt: new Date().toISOString() }
  })
}
