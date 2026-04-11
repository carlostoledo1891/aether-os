import type { FastifyInstance } from 'fastify'
import { setDomainState, upsertLapoc, type LapocIngestPayload } from '../store/db.js'

export async function lapocIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: LapocIngestPayload }>('/ingest/lapoc', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    schema: { tags: ['ingest'], summary: 'Ingest LAPOC field instrument data', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.piezometer_readings && !payload.water_quality_samples) {
      return reply.code(400).send({ error: 'Missing piezometer_readings or water_quality_samples' })
    }

    // Keep backwards compatibility for any components fetching from domain_state
    setDomainState('lapoc_latest', {
      source: payload.source,
      provenance: payload.provenance,
      timestamp: payload.timestamp,
      piezometer_readings: payload.piezometer_readings ?? [],
      water_quality_samples: payload.water_quality_samples ?? [],
      field_observations: payload.field_observations ?? [],
    })

    // Store structurally in DB
    upsertLapoc({
      ...payload,
      piezometer_readings: payload.piezometer_readings ?? [],
      water_quality_samples: payload.water_quality_samples ?? [],
      field_observations: payload.field_observations ?? [],
    })

    return {
      ok: true,
      receivedAt: new Date().toISOString(),
      piezoCount: payload.piezometer_readings?.length ?? 0,
      wqCount: payload.water_quality_samples?.length ?? 0,
    }
  })
}
