import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('ENGINE_CONFIG', () => {
  beforeEach(() => {
    delete process.env.AETHER_API_URL
    delete process.env.TICK_MS
    delete process.env.INGEST_API_KEY
    delete process.env.ENRICHER_OPENMETEO
    delete process.env.ENRICHER_BCB
    delete process.env.ENRICHER_USGS
    delete process.env.ALPHA_VANTAGE_KEY
    delete process.env.ENRICHER_FORECAST
    delete process.env.ENRICHER_ARCHIVE
    delete process.env.SITE_LAT
    delete process.env.SITE_LNG
  })

  async function loadFresh() {
    const mod = await import('../config.js')
    return mod
  }

  it('has all required top-level fields', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG).toHaveProperty('apiBaseUrl')
    expect(ENGINE_CONFIG).toHaveProperty('tickMs')
    expect(ENGINE_CONFIG).toHaveProperty('source')
    expect(ENGINE_CONFIG).toHaveProperty('ingestApiKey')
  })

  it('has all enricher sub-configs', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    for (const key of ['openMeteo', 'bcb', 'usgs', 'alphaVantage', 'forecast', 'archive'] as const) {
      expect(ENGINE_CONFIG).toHaveProperty(key)
      expect(ENGINE_CONFIG[key]).toHaveProperty('enabled')
    }
  })

  it('defaults apiBaseUrl to localhost:3001', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG.apiBaseUrl).toBe('http://localhost:3001')
  })

  it('defaults tickMs to 2000', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG.tickMs).toBe(2000)
  })

  it('openMeteo interval configs are positive numbers', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG.openMeteo.intervalMs).toBeGreaterThan(0)
    expect(ENGINE_CONFIG.openMeteo.latitude).toBeTypeOf('number')
    expect(ENGINE_CONFIG.openMeteo.longitude).toBeTypeOf('number')
    expect(ENGINE_CONFIG.openMeteo.pastDays).toBeGreaterThan(0)
  })

  it('usgs config has valid radiusKm', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG.usgs.radiusKm).toBeGreaterThan(0)
    expect(ENGINE_CONFIG.usgs.intervalMs).toBeGreaterThan(0)
  })

  it('alphaVantage is disabled by default (no API key)', async () => {
    const { ENGINE_CONFIG } = await loadFresh()
    expect(ENGINE_CONFIG.alphaVantage.enabled).toBe(false)
    expect(ENGINE_CONFIG.alphaVantage.symbol).toBe('MEI.AX')
  })
})

describe('ingestHeaders', () => {
  afterEach(() => {
    delete process.env.INGEST_API_KEY
  })

  async function loadFresh() {
    const mod = await import('../config.js')
    return mod
  }

  it('always includes Content-Type json header', async () => {
    const { ingestHeaders } = await loadFresh()
    const headers = ingestHeaders()
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('omits x-api-key when INGEST_API_KEY is empty', async () => {
    const { ingestHeaders } = await loadFresh()
    const headers = ingestHeaders()
    expect(headers).not.toHaveProperty('x-api-key')
  })
})
