import { describe, it, expect, afterAll } from 'vitest'
import { createTestApp } from './helpers.js'

const app = await createTestApp()
afterAll(() => app.close())

describe('unit-types endpoints', () => {
  it('GET /api/unit-types returns 20 type definitions (mining + maritime)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/unit-types' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    // 15 mining (Caldeira) + 5 maritime
    expect(body.length).toBe(20)
    expect(body[0].id).toBeDefined()
    expect(body[0].states).toBeDefined()
  })

  it('GET /api/unit-types/:id returns a single type', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/unit-types/deposit' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe('deposit')
    expect(body.transitions.length).toBeGreaterThan(0)
  })

  it('GET /api/unit-types/:id returns 404 for unknown type', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/unit-types/nonexistent' })
    expect(res.statusCode).toBe(404)
  })
})

describe('units endpoints', () => {
  it('GET /api/units returns seeded units', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(100)
  })

  it('GET /api/units?type=deposit filters by type', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units?type=deposit' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.length).toBe(7)
    for (const u of body) expect(u.typeId).toBe('deposit')
  })

  it('GET /api/units/:id returns unit detail', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/DEP-capao-do-mel' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe('DEP-capao-do-mel')
    expect(body.typeDef).toBeDefined()
    expect(body.data.treo_ppm).toBe(3034)
  })

  it('GET /api/units/:id returns 404 for unknown unit', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/NONEXISTENT' })
    expect(res.statusCode).toBe(404)
  })

  it('GET /api/units/stats returns grouped counts', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/stats' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.deposit).toBeDefined()
    expect(body.spring).toBeDefined()
  })

  it('GET /api/units/by-place/:placeId resolves a unit', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/by-place/capao-do-mel' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe('DEP-capao-do-mel')
  })

  it('GET /api/units/by-place/:placeId returns 404 for unknown place', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/by-place/nowhere' })
    expect(res.statusCode).toBe(404)
  })
})

describe('transition endpoints', () => {
  it('POST /api/units/:id/transition performs a valid transition', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/units/RISK-R08/transition',
      payload: { toState: 'mitigating', actor: 'Test User', reason: 'Begin mitigation' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.fromState).toBe('open')
    expect(body.toState).toBe('mitigating')
  })

  it('POST /api/units/:id/transition rejects illegal transition', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/units/RISK-R08/transition',
      payload: { toState: 'open', actor: 'Test User' },
    })
    expect(res.statusCode).toBe(400)
    expect(res.json().error).toContain('No transition')
  })

  it('GET /api/units/:id/transitions returns history', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/RISK-R08/transitions' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThanOrEqual(1)
  })
})

describe('evidence endpoints', () => {
  it('POST /api/units/:id/evidence attaches evidence', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/units/DEP-capao-do-mel/evidence',
      payload: { docType: 'mre_report', docId: 'MRE-2026-01', label: 'Mineral Resource Estimate Q1 2026' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.docType).toBe('mre_report')
  })

  it('GET /api/units/:id/evidence returns evidence list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/DEP-capao-do-mel/evidence' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.length).toBeGreaterThanOrEqual(1)
  })
})

describe('edges and graph endpoints', () => {
  it('GET /api/units/:id/edges returns incoming and outgoing', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/DEP-capao-do-mel/edges' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.incoming).toBeDefined()
    expect(body.outgoing).toBeDefined()
  })

  it('GET /api/units/:id/consequences returns graph', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/units/SITE-CALDEIRA/consequences?maxDepth=2' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })
})

describe('bundle endpoints', () => {
  let bundleId: string

  it('POST /api/bundles creates a bundle', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles',
      payload: { rootUnitId: 'BATCH-BATCH-MREC-8X9', claim: 'This batch meets IRA compliance.' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBeTruthy()
    expect(body.narrative).toBeTruthy()
    bundleId = body.id
  })

  it('GET /api/bundles/:id returns the bundle', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/bundles/${bundleId}` })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.rootUnitId).toBe('BATCH-BATCH-MREC-8X9')
  })

  it('GET /api/bundles/:id/verify verifies the bundle', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/bundles/${bundleId}/verify` })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.verificationStatus).toBe('valid')
  })

  it('GET /api/bundles/NONEXISTENT returns 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/bundles/NONEXISTENT' })
    expect(res.statusCode).toBe(404)
  })

  it('POST /api/bundles/preset with preset=boardPack creates a site-rooted bundle', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'boardPack' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBeTruthy()
    expect(body.rootUnitId).toBe('SITE-CALDEIRA')
    expect(body.claim).toContain('Caldeira')
    expect(body.narrative).toBeTruthy()
  })

  it('POST /api/bundles/preset accepts custom claim override', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'boardPack', claim: 'Custom board claim for April review.' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.claim).toBe('Custom board claim for April review.')
  })

  it('POST /api/bundles/preset rejects unknown preset', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'doesNotExist' },
    })
    expect(res.statusCode).toBe(400)
    expect(res.json().error).toContain('Unknown preset')
  })

  it('POST /api/bundles/preset { preset: "maritimeIsr" } yields a real chain_hash rooted at SITE-MARITIME', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'maritimeIsr' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBeTruthy()
    expect(body.claim).toContain('Atlantic Maritime ISR')
    expect(body.chainProof.endHash).toMatch(/^[0-9a-f]{64}$/)
    // Bundle should reach maritime AOIs, vessels, sensors, alerts, and ISR products.
    const unitIds = Object.keys(body.snapshot?.units ?? {})
    expect(unitIds).toContain('SITE-MARITIME')
    // At least one of each maritime unit type should be in the bundle.
    const types = new Set(unitIds.map(id => body.snapshot.units[id].typeId as string))
    expect(types.has('maritime_aoi')).toBe(true)
    expect(types.has('vessel')).toBe(true)
    expect(types.has('sensor_station')).toBe(true)
    expect(types.has('incident_alert')).toBe(true)
    expect(types.has('isr_product')).toBe(true)
  })
})

describe('public verifier endpoints', () => {
  let bundleId: string
  let chainHash: string

  it('POST /api/bundles seeds a bundle for the public verifier', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'boardPack' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    bundleId = body.id
    chainHash = body.chainProof.endHash
    expect(chainHash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('GET /api/public/bundles/by-hash/:hash returns bundle with embedded events', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/public/bundles/by-hash/${chainHash}` })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe(bundleId)
    expect(Array.isArray(body.events)).toBe(true)
    // Embedded events span the FULL chain segment from startSequence to
    // endSequence inclusive (so the browser can reproduce every chain_hash
    // link). chainProof.eventCount counts only the bundle's unit-related
    // events, which is a subset of the segment.
    const expectedSegmentLength = body.chainProof.endSequence - body.chainProof.startSequence + 1
    expect(body.events.length).toBe(expectedSegmentLength)
    expect(body.events.length).toBeGreaterThanOrEqual(body.chainProof.eventCount)
    for (const ev of body.events) {
      expect(ev.payload_hash).toMatch(/^[0-9a-f]{64}$/)
      expect(ev.chain_hash).toMatch(/^[0-9a-f]{64}$/)
      expect(ev.prev_hash).toMatch(/^[0-9a-f]{64}$/)
    }
    expect(body.events[0].chain_hash).toBe(body.chainProof.startHash)
    expect(body.events[body.events.length - 1].chain_hash).toBe(body.chainProof.endHash)
  })

  it('GET /api/public/bundles/by-hash/:hash returns 404 for unknown hash', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/public/bundles/by-hash/${'0'.repeat(64)}` })
    expect(res.statusCode).toBe(404)
  })

  it('GET /api/public/bundles/by-hash/:hash returns 404 for malformed hash', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/public/bundles/by-hash/not-a-hash' })
    expect(res.statusCode).toBe(404)
  })

  it('GET /api/public/bundles/:id 302-redirects to canonical hash URL', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/public/bundles/${bundleId}` })
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe(`/api/public/bundles/by-hash/${chainHash}`)
  })

  it('GET /api/public/bundles/:id returns 404 for unknown id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/public/bundles/NOPE' })
    expect(res.statusCode).toBe(404)
  })
})

describe('public verifier endpoints — live-mode-only guard', () => {
  // Wave 1 final-sprint § 2.2: any bundle generated while
  // AETHER_DATA_MODE=mock must be rejected by the public route with a
  // 403 + 'mock_mode_bundle_not_publishable'. We force the env var,
  // create a bundle, then unset and verify the route refuses it.
  let mockBundleId: string
  let mockChainHash: string

  it('creates a mock-mode bundle when AETHER_DATA_MODE=mock', async () => {
    const prev = process.env.AETHER_DATA_MODE
    process.env.AETHER_DATA_MODE = 'mock'
    try {
      const res = await app.inject({
        method: 'POST',
        url: '/api/bundles/preset',
        payload: { preset: 'boardPack' },
      })
      expect(res.statusCode).toBe(200)
      const body = res.json()
      expect(body.dataMode).toBe('mock')
      mockBundleId = body.id
      mockChainHash = body.chainProof.endHash
    } finally {
      if (prev === undefined) delete process.env.AETHER_DATA_MODE
      else process.env.AETHER_DATA_MODE = prev
    }
  })

  it('GET /api/public/bundles/by-hash/:hash returns 403 for a mock-mode bundle', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/public/bundles/by-hash/${mockChainHash}`,
    })
    expect(res.statusCode).toBe(403)
    expect(res.json().error).toBe('mock_mode_bundle_not_publishable')
  })

  it('GET /api/public/bundles/:id returns 403 for a mock-mode bundle', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/public/bundles/${mockBundleId}`,
    })
    expect(res.statusCode).toBe(403)
    expect(res.json().error).toBe('mock_mode_bundle_not_publishable')
  })

  it('live-mode bundles are still publishable after a mock-mode bundle exists', async () => {
    // Sanity: the guard must not over-fire. Create a fresh live bundle
    // and confirm the public route returns 200.
    const created = await app.inject({
      method: 'POST',
      url: '/api/bundles/preset',
      payload: { preset: 'boardPack' },
    })
    expect(created.statusCode).toBe(200)
    const liveHash = created.json().chainProof.endHash as string
    const fetched = await app.inject({
      method: 'GET',
      url: `/api/public/bundles/by-hash/${liveHash}`,
    })
    expect(fetched.statusCode).toBe(200)
    expect(fetched.json().dataMode).toBe('live')
  })
})

describe('public verifier telemetry', () => {
  // Day-3 sprint § 3.2: anonymous client-side verify timings POST'd to
  // `/api/public/verifier-telemetry`. The endpoint must always 204 (so
  // hostile clients can't probe it), and the admin stats endpoint must
  // surface p50/p95 + a per-outcome histogram.
  const fakeHash = 'a'.repeat(64)

  it('POST /api/public/verifier-telemetry returns 204 for a well-formed payload', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/public/verifier-telemetry',
      payload: {
        chainHash: fakeHash,
        durationMs: 120,
        eventCount: 8,
        outcome: 'valid',
      },
      headers: { 'user-agent': 'Mozilla/5.0 (Macintosh) Chrome/120.0' },
    })
    expect(res.statusCode).toBe(204)
  })

  it('POST /api/public/verifier-telemetry returns 204 even for garbage payloads', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/public/verifier-telemetry',
      payload: { chainHash: 'not-a-hash', durationMs: -7, outcome: 'banana' },
    })
    // Telemetry must never leak validation state to the client.
    expect(res.statusCode).toBe(204)
  })

  it('GET /api/admin/verifier-stats surfaces p50/p95 from recorded samples', async () => {
    // Seed a deterministic distribution: 10 samples of 100ms, 95ms, ...
    // ranging from 10ms..100ms. p50 (nearest-rank, ceil) ≈ 50ms,
    // p95 ≈ 100ms. We post each one and then read the admin stats.
    const durations = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
    for (const d of durations) {
      await app.inject({
        method: 'POST',
        url: '/api/public/verifier-telemetry',
        payload: {
          chainHash: 'b'.repeat(64),
          durationMs: d,
          eventCount: 4,
          outcome: 'valid',
        },
        headers: { 'user-agent': 'Mozilla/5.0 (iPhone) Safari/605' },
      })
    }
    // One unavailable row that must NOT bias the percentile.
    await app.inject({
      method: 'POST',
      url: '/api/public/verifier-telemetry',
      payload: {
        chainHash: 'b'.repeat(64),
        durationMs: 0,
        eventCount: 4,
        outcome: 'unavailable',
      },
      headers: { 'user-agent': 'WebView' },
    })

    const res = await app.inject({ method: 'GET', url: '/api/admin/verifier-stats' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.telemetry).toBeDefined()
    expect(body.telemetry.sampleSize).toBeGreaterThanOrEqual(11)
    // Nearest-rank p50 over [10..100] step 10 = 50; p95 = 100.
    expect(body.telemetry.p50DurationMs).toBeGreaterThanOrEqual(40)
    expect(body.telemetry.p50DurationMs).toBeLessThanOrEqual(60)
    expect(body.telemetry.p95DurationMs).toBeGreaterThanOrEqual(90)
    // Loose upper bound: prior tests in this file may have recorded a
    // larger sample (e.g. 120ms) which legitimately raises p95.
    expect(body.telemetry.p95DurationMs).toBeLessThanOrEqual(200)
    expect(body.telemetry.outcomes.valid).toBeGreaterThanOrEqual(10)
    expect(body.telemetry.outcomes.unavailable).toBeGreaterThanOrEqual(1)
    // The Safari-bucketed user-agent above must show up in byUserAgent.
    expect(body.telemetry.byUserAgent.safari).toBeGreaterThanOrEqual(10)
  })
})
