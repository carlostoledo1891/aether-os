import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockDataService } from './mockDataService'
import type { AetherDataService } from './dataService'

/**
 * Helper to call mock service methods and narrow the MaybeAsync<T> to T.
 * Mock service is always synchronous, so we can safely cast.
 */
function sync<T>(val: T | Promise<T>): T {
  if (val instanceof Promise) throw new Error('Expected sync value from mock service')
  return val
}

describe('createMockDataService', () => {
  let svc: AetherDataService

  beforeEach(() => {
    vi.useFakeTimers()
    svc = createMockDataService()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns an object implementing all AetherDataService methods', () => {
    const requiredMethods: (keyof AetherDataService)[] = [
      'subscribeTelemetry', 'getHistory',
      'getBatches', 'getBatch',
      'getFinancialScenario', 'getSensitivityTable',
      'getRiskRegister', 'getIncidentLog',
      'getOfftakerPipeline', 'getCapitalSnapshot',
      'getDFSWorkstreams', 'getRegulatoryLog',
      'getBenchmarks',
      'getAuditTrail', 'getESGFrameworks',
      'getProjectFinancials', 'getMarketPrices',
      'getProjectTimeline', 'getDepositData',
      'getResourceClassification', 'getHydrologyScenarios',
      'getScaleUpPathway', 'getPlantPerformance',
      'getHardwareSensors', 'getCyberPillars',
      'getApiHandoffs', 'getUThSafety',
      'getScope3Tracking', 'getSpringCount',
      'getThresholds', 'getDataContext', 'getProvenanceProfile', 'getRegulatoryExportBundle', 'getSpringHistory',
      'getIssuerSnapshot', 'getSpatialInsights',
      'dismissAlert', 'dismissAllAlerts',
    ]
    for (const m of requiredMethods) {
      expect(typeof svc[m]).toBe('function')
    }
  })

  it('subscribeTelemetry fires immediately with initial data', () => {
    const cb = vi.fn()
    svc.subscribeTelemetry(cb)
    expect(cb).toHaveBeenCalledTimes(1)
    const tick = cb.mock.calls[0][0]
    expect(tick.plant).toBeDefined()
    expect(tick.env).toBeDefined()
    expect(tick.esg).toBeDefined()
    expect(tick.esg.overall).toBeGreaterThan(0)
    expect(Array.isArray(tick.alerts)).toBe(true)
  })

  it('subscribeTelemetry fires on interval after subscribing', () => {
    const cb = vi.fn()
    svc.subscribeTelemetry(cb)
    expect(cb).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(2000)
    expect(cb).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(2000)
    expect(cb).toHaveBeenCalledTimes(3)
  })

  it('unsubscribe stops interval when last subscriber leaves', () => {
    const cb = vi.fn()
    const unsub = svc.subscribeTelemetry(cb)
    expect(cb).toHaveBeenCalledTimes(1)
    unsub()
    vi.advanceTimersByTime(4000)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('getSpringHistory returns events for a spring id', () => {
    const ev = sync(svc.getSpringHistory('spring-0001'))
    expect(ev.length).toBeGreaterThan(0)
    expect(ev.every((e: { springId: string }) => e.springId === 'spring-0001')).toBe(true)
  })

  it('getHistory returns arrays of correct length for each range', () => {
    const h24 = sync(svc.getHistory('24h'))
    const h7d = sync(svc.getHistory('7d'))
    const h30d = sync(svc.getHistory('30d'))
    expect(h24.plantHistory.length).toBe(60)
    expect(h24.envHistory.length).toBe(60)
    expect(h24.precipMmSeries.length).toBe(60)
    expect(h7d.plantHistory.length).toBe(120)
    expect(h7d.precipMmSeries.length).toBe(120)
    expect(h30d.plantHistory.length).toBe(200)
    expect(h30d.precipMmSeries.length).toBe(200)
  })

  it('getBatches returns non-empty array of ComplianceLedger', () => {
    const batches = sync(svc.getBatches())
    expect(batches.length).toBeGreaterThan(0)
    expect(batches[0].batch_id).toBeDefined()
  })

  it('getBatch finds by id', () => {
    const batches = sync(svc.getBatches())
    const found = sync(svc.getBatch(batches[0].batch_id))
    expect(found).toBeDefined()
    expect(found!.batch_id).toBe(batches[0].batch_id)
  })

  it('getFinancialScenario returns valid scenario data', () => {
    for (const key of ['consensus', 'bull', 'bear'] as const) {
      const s = sync(svc.getFinancialScenario(key))
      expect(s.key).toBe(key)
      expect(s.npv_pretax_m).toBeGreaterThan(0)
      expect(s.irr_pretax_pct).toBeGreaterThan(0)
    }
  })

  it('getSensitivityTable returns array of points', () => {
    const table = sync(svc.getSensitivityTable())
    expect(table.length).toBeGreaterThan(0)
    expect(table[0].ndpr_price).toBeDefined()
    expect(table[0].npv_pretax_m).toBeDefined()
  })

  it('getRiskRegister returns array with required fields', () => {
    const risks = sync(svc.getRiskRegister())
    expect(risks.length).toBeGreaterThan(0)
    expect(risks[0].score).toBe(risks[0].likelihood * risks[0].impact)
  })

  it('getOfftakerPipeline returns records', () => {
    const offtakers = sync(svc.getOfftakerPipeline())
    expect(offtakers.length).toBeGreaterThan(0)
    expect(offtakers[0].name).toBeDefined()
    expect(offtakers[0].stage).toBeDefined()
  })

  it('getCapitalSnapshot has funding sources and monthly spend', () => {
    const capital = sync(svc.getCapitalSnapshot())
    expect(capital.total_capex_m).toBeGreaterThan(0)
    expect(capital.funding_sources.length).toBeGreaterThan(0)
    expect(capital.monthly_spend.length).toBeGreaterThan(0)
    expect(capital.conditions_precedent.length).toBeGreaterThan(0)
  })

  it('getAuditTrail returns events with hashes', () => {
    const trail = sync(svc.getAuditTrail())
    expect(trail.length).toBeGreaterThan(0)
    expect(trail[0].hash.length).toBe(64)
  })

  it('getESGFrameworks returns frameworks with metrics', () => {
    const frameworks = sync(svc.getESGFrameworks())
    expect(frameworks.length).toBeGreaterThan(0)
    expect(frameworks[0].metrics.length).toBeGreaterThan(0)
  })

  it('static domain getters return valid data', () => {
    expect(sync(svc.getProjectFinancials()).capex_m).toBeGreaterThan(0)
    expect(sync(svc.getMarketPrices()).spot_ndpr_kg).toBeGreaterThan(0)
    expect(sync(svc.getProjectTimeline()).length).toBeGreaterThan(0)
    expect(sync(svc.getDepositData()).length).toBeGreaterThan(0)
    expect(sync(svc.getResourceClassification()).global_bt).toBeGreaterThan(0)
    expect(sync(svc.getHydrologyScenarios()).length).toBe(3)
    expect(sync(svc.getScaleUpPathway()).springs_monitored).toBe(1092)
    expect(sync(svc.getPlantPerformance()).nameplate_kg_day).toBeGreaterThan(0)
    expect(sync(svc.getHardwareSensors()).length).toBeGreaterThan(0)
    expect(sync(svc.getCyberPillars()).length).toBe(4)
    expect(sync(svc.getApiHandoffs()).length).toBeGreaterThan(0)
    expect(sync(svc.getUThSafety()).radioactive_tailings).toBe(false)
    expect(sync(svc.getScope3Tracking()).supply_chain.length).toBeGreaterThan(0)
    expect(sync(svc.getSpringCount())).toBe(1092)
  })

  it('getThresholds returns domain thresholds', () => {
    const t = sync(svc.getThresholds())
    expect(t.sulfate_warning_ppm).toBe(250)
    expect(t.nitrate_warning_ppm).toBe(50)
  })

  it('getDataContext returns honesty metadata', () => {
    const ctx = svc.getDataContext()
    expect(ctx.telemetry).toBe('simulated')
    expect(typeof ctx.presentationMode).toBe('boolean')
    expect(ctx.bannerLabel.length).toBeGreaterThan(0)
    expect(ctx.detail.length).toBeGreaterThan(20)
    expect(['mock', 'live']).toContain(ctx.mode)
  })

  it('getProvenanceProfile returns section kinds', () => {
    const p = sync(svc.getProvenanceProfile())
    expect(p.sections.hydro_spring_geometry?.kind).toBe('from_public_record')
    expect(p.sections.plant_telemetry?.kind).toBe('simulated')
    expect(p.sections.map_geometry?.kind).toBe('illustrative')
  })

  it('getIssuerSnapshot returns resource and citations', () => {
    const s = sync(svc.getIssuerSnapshot())
    expect(s.as_of.length).toBeGreaterThan(0)
    expect(s.resource.global_bt).toBeGreaterThan(0)
    expect(s.resource.citation.label.length).toBeGreaterThan(10)
  })

  it('getSpatialInsights returns pilot distance and APA heuristic', () => {
    const sp = sync(svc.getSpatialInsights())
    expect(sp.pilotToPfsPlantKm).toBeGreaterThan(0)
    expect(typeof sp.licenceZonesInApaBuffer).toBe('number')
    expect(sp.summary.length).toBeGreaterThan(20)
    expect(sp.apaHeuristicNote.length).toBeGreaterThan(10)
  })

  it('getRegulatoryExportBundle includes regulatory log and permitting risks', () => {
    const b = sync(svc.getRegulatoryExportBundle())
    expect(b.regulatoryLog.some((r: { id: string }) => r.id === 'REG-04')).toBe(true)
    expect(b.permittingRisks.some((r: { id: string }) => r.id === 'R01')).toBe(true)
    expect(b.auditEvents.some((e: { id: string }) => e.id === 'AUD-010')).toBe(true)
  })

  it('dismissAlert marks alert as dismissed', () => {
    const cb = vi.fn()
    svc.subscribeTelemetry(cb)
    vi.advanceTimersByTime(60000)
    const lastTick = cb.mock.calls[cb.mock.calls.length - 1][0]
    if (lastTick.alerts.length > 0) {
      const id = lastTick.alerts[0].id
      svc.dismissAlert(id)
      const afterDismiss = cb.mock.calls[cb.mock.calls.length - 1][0]
      expect(afterDismiss.alerts.find((a: { id: string }) => a.id === id)).toBeUndefined()
    }
  })

  it('dismissAllAlerts clears all alerts', () => {
    const cb = vi.fn()
    svc.subscribeTelemetry(cb)
    vi.advanceTimersByTime(60000)
    svc.dismissAllAlerts()
    const afterDismiss = cb.mock.calls[cb.mock.calls.length - 1][0]
    expect(afterDismiss.alerts.length).toBe(0)
  })

  it('7d and 30d histories retain distinct variance patterns', () => {
    const cb = vi.fn()
    svc.subscribeTelemetry(cb)
    vi.advanceTimersByTime(10000)

    const h24 = sync(svc.getHistory('24h'))
    const h7d = sync(svc.getHistory('7d'))
    const h30d = sync(svc.getHistory('30d'))

    const recircValues24 = h24.plantHistory.map((p: { flow_metrics: { recirculation_pct: number } }) => p.flow_metrics.recirculation_pct)
    const recircValues7d = h7d.plantHistory.map((p: { flow_metrics: { recirculation_pct: number } }) => p.flow_metrics.recirculation_pct)
    const recircValues30d = h30d.plantHistory.map((p: { flow_metrics: { recirculation_pct: number } }) => p.flow_metrics.recirculation_pct)

    const std = (arr: number[]) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length
      return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length)
    }

    expect(std(recircValues7d)).toBeGreaterThan(std(recircValues24) * 0.5)
    expect(std(recircValues30d)).toBeGreaterThan(std(recircValues7d) * 0.5)
  })
})
