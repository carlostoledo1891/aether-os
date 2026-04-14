import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createLiveDataService, onConnectionStatusChange } from './liveDataService'

describe('createLiveDataService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes live mode in data context', () => {
    const svc = createLiveDataService()
    const ctx = svc.getDataContext()
    expect(ctx.mode).toBe('live')
    expect(typeof ctx.presentationMode).toBe('boolean')
    expect(typeof ctx.disclosureMode).toBe('boolean')
    expect(ctx.bannerLabel).toMatch(/Live|Stakeholder|Disclosure/i)
    expect(ctx.detail.length).toBeGreaterThan(0)
  })

  it('subscribeTelemetry returns an unsubscribe function', () => {
    const svc = createLiveDataService()
    const unsub = svc.subscribeTelemetry(() => {})
    expect(typeof unsub).toBe('function')
    unsub()
  })

  it('has all AetherDataService methods', () => {
    const svc = createLiveDataService()
    const expectedMethods = [
      'subscribeTelemetry', 'getHistory',
      'getBatches', 'getBatch',
      'getFinancialScenario', 'getSensitivityTable',
      'getRiskRegister', 'getIncidentLog',
      'getOfftakerPipeline', 'getCapitalSnapshot',
      'getDFSWorkstreams', 'getRegulatoryLog',
      'getBenchmarks', 'getAuditTrail', 'getESGFrameworks',
      'getProjectFinancials', 'getMarketPrices', 'getProjectTimeline',
      'getDepositData', 'getResourceClassification',
      'getHydrologyScenarios', 'getScaleUpPathway',
      'getPlantPerformance', 'getHardwareSensors',
      'getCyberPillars', 'getApiHandoffs',
      'getUThSafety', 'getScope3Tracking',
      'getSpringCount', 'getThresholds',
      'getDataContext', 'getProvenanceProfile',
      'getRegulatoryExportBundle', 'getSpringHistory',
      'getIssuerSnapshot', 'getSpatialInsights',
      'dismissAlert', 'dismissAllAlerts',
    ]
    for (const method of expectedMethods) {
      expect(typeof (svc as unknown as Record<string, unknown>)[method]).toBe('function')
    }
  })
})

describe('liveDataService — api() cache + connection status', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('transitions to degraded when fetch fails but cache exists', async () => {
    const svc = createLiveDataService()
    const statuses: string[] = []
    onConnectionStatusChange(s => statuses.push(s))

    // getProjectFinancials uses TTL=0 (NO_CACHE), so every call hits network
    const mockFinancials = { npv: 821 }
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify(mockFinancials), { status: 200 }))
      .mockRejectedValueOnce(new Error('Network error'))

    const first = await svc.getProjectFinancials()
    expect(first).toEqual(mockFinancials)

    const second = await svc.getProjectFinancials()
    expect(second).toEqual(mockFinancials)
    expect(statuses).toContain('degraded')
  })

  it('transitions to offline when fetch fails with no cache', async () => {
    const svc = createLiveDataService()
    const statuses: string[] = []
    onConnectionStatusChange(s => statuses.push(s))

    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    await expect(svc.getHydrologyScenarios()).rejects.toThrow('Network error')
    expect(statuses).toContain('offline')
  })

  it('returns to connected after successful fetch following degraded state', async () => {
    const svc = createLiveDataService()
    const statuses: string[] = []
    onConnectionStatusChange(s => statuses.push(s))

    // Use NO_CACHE endpoints so cache TTL doesn't interfere
    const mockData = { npv: 100 }
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify(mockData), { status: 200 }))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockData), { status: 200 }))

    await svc.getMarketPrices()
    await svc.getMarketPrices()
    await svc.getMarketPrices()
    expect(statuses).toContain('degraded')
    expect(statuses).toContain('connected')
  })

  it('treats non-200 response as error', async () => {
    const svc = createLiveDataService()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 500 }))

    await expect(svc.getDepositData()).rejects.toThrow(/API 500/)
  })

  it('uses VITE_API_BASE_URL when fetching live endpoints', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://staging-api.example.com/')
    const svc = createLiveDataService()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: 'risk-1' }]), { status: 200 }),
    )

    await svc.getRiskRegister()

    expect(fetchSpy).toHaveBeenCalledWith('https://staging-api.example.com/api/risks')
  })
})
