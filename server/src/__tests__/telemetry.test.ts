import { describe, it, expect, afterAll } from 'vitest'
import { createTestApp } from './helpers.js'

const app = await createTestApp()
afterAll(() => app.close())
const ingestHeaders = process.env.INGEST_API_KEY
  ? { 'x-api-key': process.env.INGEST_API_KEY }
  : undefined

const MOCK_TICK = {
  source: 'test-engine',
  provenance: 'simulated',
  timestamp: new Date().toISOString(),
  plant: {
    flow_metrics: { feed_rate_tph: 120, recirculation_pct: 96.5 },
    leaching_circuit: { ph_level: 4.2, temperature_c: 35, retention_hours: 2.1 },
    precipitation: { reagent_flow_lph: 45, crystal_density_gl: 12 },
    cip_adsorption: { carbon_activity_pct: 88, gold_loading_gt: 0 },
    fjh_separation: { temperature_c: 280, energy_savings_pct: 87 },
    output: { treo_grade_pct: 92, daily_output_kg: 38, running: true },
  },
  env: {
    water_quality: { ph: 7.1, sulfate_ppm: 180, nitrate_ppm: 22, dissolved_oxygen_ppm: 6.5 },
    aquifer: { depth_m: 25, recharge_rate_mm_day: 1.2, sensors: [] },
    legacy_infrastructure: { radiation_usv_h: 0.12, containment_status: 'intact' as const },
    precip_mm_hr: 2.4,
  },
  esg: { overall: 82, environment: 85, social: 78, governance: 83 },
  alerts: [],
}

describe('telemetry round-trip', () => {
  it('returns 503 before any ingest', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/telemetry/current' })
    expect([200, 503]).toContain(res.statusCode)
  })

  it('POST /ingest/telemetry accepts valid payload', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/telemetry',
      payload: MOCK_TICK,
      headers: ingestHeaders,
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.ok).toBe(true)
  })

  it('GET /api/telemetry/current returns ingested data', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/telemetry/current' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.plant).toBeDefined()
    expect(body.env).toBeDefined()
    expect(body.esg).toBeDefined()
    expect(body.source).toBe('test-engine')
  })

  it('GET /api/telemetry/history returns array data', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/telemetry/history?range=24h' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body.plantHistory)).toBe(true)
    expect(Array.isArray(body.envHistory)).toBe(true)
  })

  it('rejects invalid range parameter', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/telemetry/history?range=1y' })
    expect(res.statusCode).toBe(400)
  })

  it('rejects ingest with missing fields', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/telemetry',
      payload: { source: 'bad', timestamp: new Date().toISOString() },
      headers: ingestHeaders,
    })
    expect(res.statusCode).toBe(400)
  })
})
