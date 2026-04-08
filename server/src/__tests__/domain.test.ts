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

  it('GET /api/audit returns audit events', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
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
