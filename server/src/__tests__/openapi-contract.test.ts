import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../index.js'

let app: Awaited<ReturnType<typeof buildApp>>

beforeAll(async () => {
  app = await buildApp({ logger: false })
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('OpenAPI contract', () => {
  it('serves OpenAPI spec at /api/docs/json', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    expect(res.statusCode).toBe(200)
    const spec = JSON.parse(res.payload)
    expect(spec.openapi).toBe('3.1.0')
    expect(spec.info.title).toBe('Vero API')
  })

  it('declares expected tags', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    const tagNames = spec.tags.map((t: { name: string }) => t.name)

    const requiredTags = ['health', 'telemetry', 'domain', 'project', 'enrichers', 'ingest', 'integrity', 'export', 'alerts', 'ai']
    for (const tag of requiredTags) {
      expect(tagNames).toContain(tag)
    }
  })

  it('declares apiKey security scheme', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    expect(spec.components.securitySchemes.apiKey).toBeDefined()
    expect(spec.components.securitySchemes.apiKey.type).toBe('apiKey')
    expect(spec.components.securitySchemes.apiKey.name).toBe('x-api-key')
  })

  it('exposes critical domain routes', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    const paths = Object.keys(spec.paths)

    const requiredPaths = [
      '/api/health',
      '/api/batches',
      '/api/risks',
      '/api/regulatory',
      '/api/esg',
      '/api/audit',
      '/api/audit/verify-chain',
      '/api/context',
      '/api/provenance',
      '/api/security/sbom-summary',
      '/api/weather/current',
      '/api/weather/forecast',
      '/api/weather/historical',
      '/api/project/financials',
      '/api/project/deposits',
      '/api/project/resources',
    ]

    for (const path of requiredPaths) {
      expect(paths, `Missing route: ${path}`).toContain(path)
    }
  })

  it('exposes export routes for DPP and regulatory', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    const paths = Object.keys(spec.paths)

    expect(paths).toContain('/api/export/regulatory')
    expect(paths.some(p => p.includes('/api/export/dpp/'))).toBe(true)
    expect(paths).toContain('/api/dpp/validate')
  })

  it('exposes alert mutation routes with security', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    const paths = Object.keys(spec.paths)

    expect(paths.some(p => p.includes('/api/alerts/dismiss'))).toBe(true)
  })

  it('total route count exceeds minimum threshold', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/docs/json' })
    const spec = JSON.parse(res.payload)
    const pathCount = Object.keys(spec.paths).length
    expect(pathCount).toBeGreaterThanOrEqual(35)
  })
})
