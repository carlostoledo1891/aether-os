import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { createTestApp } from './helpers.js'

const INGEST_KEY = 'test-secret-key-123'

let app: FastifyInstance

beforeAll(async () => {
  process.env.INGEST_API_KEY = INGEST_KEY
  app = await createTestApp()
})

afterAll(async () => {
  delete process.env.INGEST_API_KEY
  await app.close()
})

const VALID_PAYLOAD = {
  source: 'guard-test',
  provenance: 'simulated',
  timestamp: new Date().toISOString(),
  plant: {
    flow_metrics: { feed_rate_tph: 100, recirculation_pct: 95 },
    leaching_circuit: { ph_level: 4.0, temperature_c: 30, retention_hours: 2 },
    precipitation: { reagent_flow_lph: 40, crystal_density_gl: 10 },
    cip_adsorption: { carbon_activity_pct: 85, gold_loading_gt: 0 },
    fjh_separation: { temperature_c: 270, energy_savings_pct: 85 },
    output: { treo_grade_pct: 90, daily_output_kg: 35, running: true },
  },
  env: {
    water_quality: { ph: 7.0, sulfate_ppm: 150, nitrate_ppm: 20, dissolved_oxygen_ppm: 6 },
    aquifer: { depth_m: 20, recharge_rate_mm_day: 1.0, sensors: [] },
    legacy_infrastructure: { radiation_usv_h: 0.1, containment_status: 'intact' as const },
    precip_mm_hr: 1.5,
  },
  esg: { overall: 80, environment: 82, social: 76, governance: 80 },
  alerts: [],
}

describe('ingest API key guard', () => {
  it('rejects ingest without API key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/telemetry',
      payload: VALID_PAYLOAD,
    })
    expect(res.statusCode).toBe(401)
    expect(res.json().error).toMatch(/API key/i)
  })

  it('rejects ingest with wrong API key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/telemetry',
      payload: VALID_PAYLOAD,
      headers: { 'x-api-key': 'wrong-key' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('accepts ingest with correct API key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/telemetry',
      payload: VALID_PAYLOAD,
      headers: { 'x-api-key': INGEST_KEY },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().ok).toBe(true)
  })
})
