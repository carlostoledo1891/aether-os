import { describe, it, expect, afterAll } from 'vitest'
import { createTestApp } from './helpers.js'

const app = await createTestApp()
afterAll(() => app.close())

describe('domain endpoints (seeded data)', () => {
  it('GET /api/risks returns an array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/risks' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  it('GET /api/batches returns an array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/batches' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('GET /api/financials/scenario/consensus returns scenario data', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/financials/scenario/consensus' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.npv_pretax_m).toBeDefined()
  })

  it('GET /api/financials/scenario/unknown returns 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/financials/scenario/unknown' })
    expect(res.statusCode).toBe(404)
  })

  it('GET /api/financials/sensitivity returns an array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/financials/sensitivity' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('GET /api/audit returns chain-linked audit events', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThanOrEqual(15)
    expect(body[0].chain_hash).toBeDefined()
    expect(body[0].payload_hash).toBeDefined()
    expect(body[0].prev_hash).toBeDefined()
    expect(body[0].sequence).toBeDefined()
  })

  it('GET /api/audit?type=batch_created filters by type', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit?type=batch_created' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.length).toBe(2)
    expect(body.every((e: { type: string }) => e.type === 'batch_created')).toBe(true)
  })

  it('GET /api/audit/verify-chain returns valid', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit/verify-chain' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.valid).toBe(true)
    expect(body.length).toBeGreaterThanOrEqual(15)
  })

  it('GET /api/audit/:eventId returns a single event', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit/AUD-001' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe('AUD-001')
    expect(body.chain_hash).toBeDefined()
  })

  it('GET /api/audit/:eventId returns 404 for unknown', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit/NOPE' })
    expect(res.statusCode).toBe(404)
  })

  it('GET /api/esg returns ESG frameworks', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/esg' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('GET /api/project/financials returns project financials', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/project/financials' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.npv_pretax_consensus_m).toBeDefined()
  })

  it('GET /api/project/springs/count returns a number', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/project/springs/count' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.count).toBe(1092)
  })

  it('GET /api/context returns data context', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/context' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.mode).toBeDefined()
  })

  it('GET /api/provenance returns provenance profile', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/provenance' })
    expect(res.statusCode).toBe(200)
  })
})

describe('enricher endpoints — API shape contracts', () => {
  it('GET /api/seismic/recent returns 200 with SeismicSnapshot envelope', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/seismic/recent' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    // Shape contract: must be an object with events array, not a bare array
    expect(Array.isArray(body)).toBe(false)
    expect(Array.isArray(body.events)).toBe(true)
    expect(typeof body.source).toBe('string')
    expect(typeof body.updated_at).toBe('string')
    // Each event must have the fields that SeismicActivityCard reads
    for (const event of body.events) {
      expect(typeof event.id).toBe('string')
      expect(typeof event.magnitude).toBe('number')
      expect(typeof event.depth_km).toBe('number')
      expect(typeof event.place).toBe('string')
    }
  })

  it('GET /api/weather/historical returns 200 or 503', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/weather/historical' })
    expect([200, 503]).toContain(res.statusCode)
    if (res.statusCode === 200) {
      const body = res.json()
      expect(body.series).toBeDefined()
      expect(typeof body.dayCount).toBe('number')
      expect(typeof body.updated_at).toBe('string')
    }
  })

  it('GET /api/market/fx returns 200 or 503', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/market/fx' })
    expect([200, 503]).toContain(res.statusCode)
    if (res.statusCode === 200) {
      const body = res.json()
      expect(typeof body.rate).toBe('number')
      expect(typeof body.updated_at).toBe('string')
    }
  })

  it('GET /api/market/stock returns 200 or 503', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/market/stock' })
    expect([200, 503]).toContain(res.statusCode)
    if (res.statusCode === 200) {
      const body = res.json()
      expect(typeof body.price).toBe('number')
      expect(typeof body.updated_at).toBe('string')
    }
  })

  it('GET /api/lapoc/latest returns 200 or 503', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/lapoc/latest' })
    expect([200, 503]).toContain(res.statusCode)
  })
})
