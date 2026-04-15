import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'

const ORIGINAL_ENV = { ...process.env }

async function createProdApp(overrides: Record<string, string | undefined> = {}) {
  process.env = { ...ORIGINAL_ENV }
  process.env.NODE_ENV = 'production'
  process.env.DB_PATH = ':memory:'
  process.env.INGEST_API_KEY = 'test-ingest-key'
  process.env.CHAT_API_KEY = 'test-chat-key'

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }

  vi.resetModules()
  const { buildApp } = await import('../index.js')
  const app = await buildApp({ logger: false })
  await app.ready()
  return app
}

async function expectCorsFor(app: FastifyInstance, url: string, expectedStatuses: number[] = [200]) {
  const res = await app.inject({
    method: 'GET',
    url,
    headers: { origin: 'https://verochain.co' },
  })
  expect(expectedStatuses).toContain(res.statusCode)
  expect(res.headers['access-control-allow-origin']).toBe('https://verochain.co')
}

let app: FastifyInstance | null = null

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

afterEach(async () => {
  if (app) {
    await app.close()
    app = null
  }
  process.env = { ...ORIGINAL_ENV }
})

describe.sequential('production CORS allowlist', () => {
  it('allows the canonical production origin even if CORS_ORIGIN is stale', async () => {
    app = await createProdApp({ CORS_ORIGIN: 'https://stale-preview.example.com' })

    await expectCorsFor(app, '/api/project/hydrology')
    await expectCorsFor(app, '/api/project/plant-performance')
    await expectCorsFor(app, '/api/project/springs/count')
    await expectCorsFor(app, '/api/provenance')
    await expectCorsFor(app, '/api/telemetry/history?range=24h')
    await expectCorsFor(app, '/api/market/stock', [200, 503])
  })

  it('falls back to canonical production origins when CORS_ORIGIN is unset', async () => {
    app = await createProdApp({ CORS_ORIGIN: undefined })

    const res = await app.inject({
      method: 'GET',
      url: '/api/project/hydrology',
      headers: { origin: 'https://verochain.co' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe('https://verochain.co')
  })

  it('does not allow unrelated origins', async () => {
    app = await createProdApp({ CORS_ORIGIN: undefined })

    const res = await app.inject({
      method: 'GET',
      url: '/api/project/hydrology',
      headers: { origin: 'https://evil.example.com' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBeUndefined()
  })

  it('keeps CORS headers on chat auth failures in production', async () => {
    app = await createProdApp({ CORS_ORIGIN: 'https://stale-preview.example.com' })

    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      headers: {
        origin: 'https://verochain.co',
        'content-type': 'application/json',
      },
      payload: { messages: [{ role: 'user', content: 'Hello' }] },
    })

    expect(res.statusCode).toBe(401)
    expect(res.headers['access-control-allow-origin']).toBe('https://verochain.co')
  })
})
