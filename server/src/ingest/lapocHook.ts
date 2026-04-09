import type { FastifyInstance } from 'fastify'
import { setDomainState } from '../store/db.js'

interface LapocPayload {
  source: string
  provenance: string
  timestamp: string
  piezometer_readings: Array<{
    sensor_id: string; timestamp: string; depth_meters: number
    temperature_c: number; conductivity_us_cm: number
  }>
  water_quality_samples: Array<{
    sample_id: string; timestamp: string; location: string
    ph: number; sulfate_ppm: number; nitrate_ppm: number
    iron_ppm: number; manganese_ppm: number; turbidity_ntu: number
  }>
  field_observations: Array<{
    observer: string; timestamp: string; spring_id: string
    flow_status: string; photo_ref?: string; notes: string
  }>
}

export async function lapocIngestRoutes(app: FastifyInstance) {
  app.post<{ Body: LapocPayload }>('/ingest/lapoc', {
    schema: { tags: ['ingest'], summary: 'Ingest LAPOC field instrument data', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    const payload = req.body
    if (!payload.piezometer_readings && !payload.water_quality_samples) {
      return reply.code(400).send({ error: 'Missing piezometer_readings or water_quality_samples' })
    }

    setDomainState('lapoc_latest', {
      source: payload.source,
      provenance: payload.provenance,
      timestamp: payload.timestamp,
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
