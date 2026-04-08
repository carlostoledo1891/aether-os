import { describe, it, expect, vi, afterEach } from 'vitest'
import { createLiveDataService } from './liveDataService'

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
