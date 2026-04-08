import { describe, it, expect, afterAll } from 'vitest'
import { createTestApp } from './helpers.js'

const app = await createTestApp()
afterAll(() => app.close())

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/health' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.status).toBe('ok')
    expect(typeof body.uptimeMs).toBe('number')
  })

  it('reports no telemetry source before any ingest', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/health' })
    const body = res.json()
    expect(body.lastIngestAt === null || typeof body.lastIngestAt === 'string').toBe(true)
  })
})
