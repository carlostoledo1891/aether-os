import type { AlertItem, ComplianceLedger } from '../types/telemetry'
import {
  INITIAL_PLANT_TELEMETRY,
  INITIAL_ENV_TELEMETRY,
  generatePlantTelemetry,
  generateEnvTelemetry,
  calculateEsgScore,
  detectAlerts,
} from '../data/mockGenerator'
import {
  RESOURCE_CLASSIFICATION, CYBER_TRUST_PILLARS, API_HANDOFFS,
  U_TH_SAFETY, SCOPE_3_TRACKING, MOCK_SPRING_EVENTS,
} from '../data/mockData'
import {
  SPRING_COUNT, THRESHOLDS,
  BATCHES, BENCHMARKS, AUDIT_TRAIL, ESG_FRAMEWORKS,
  BATCH_LICENSE_MAP, LICENSE_DEPOSIT_MAP, sha256Stub,
  PROJECT_FINANCIALS, MARKET_PRICES, PROJECT_TIMELINE,
  SCENARIOS, SENSITIVITY_TABLE,
  DEPOSIT_DATA,
  PREDICTIVE_HYDROLOGY_SCENARIOS, SCALE_UP_PATHWAY,
  PILOT_PLANT_PERFORMANCE, HARDWARE_SENSORS, LITHOLOGY_SUMMARY,
  RISKS, INCIDENT_LOG,
  OFFTAKERS, CAPITAL, PRICING_MODEL, MARKET_SIZING,
  DSCR_PROJECTIONS, DRAWDOWN_SCHEDULE, DFS_WORKSTREAMS, REGULATORY_LOG,
  STAKEHOLDER_REGISTER,
} from '../data/domain'
import { GEO } from '../data/geo/registry'
import { CALDEIRA_ISSUER_SNAPSHOT } from '../data/caldeira/issuerSnapshot'
import { SPATIAL_INSIGHTS, getSpatialInsightsSummary } from '../data/caldeira/spatialInsights'
import { getDataMode, getPresentationMode, getDisclosureMode } from '../config/env'
import type {
  AetherDataService,
  DataContext,
  ProvenanceProfile,
  RegulatoryExportBundle,
  TelemetryCallback,
  TimeRangeKey,
  HistoricalTelemetry,
  ScenarioKey,
} from './dataService'

const TICK_MS = 2000
const HISTORY_LENGTHS: Record<TimeRangeKey, number> = { '24h': 60, '7d': 120, '30d': 200 }

function buildDataContext(): DataContext {
  const presentationMode = getPresentationMode()
  const disclosureMode = getDisclosureMode()
  const mode = getDataMode()

  if (disclosureMode) {
    return {
      mode,
      telemetry: 'simulated',
      presentationMode,
      disclosureMode: true,
      bannerLabel: 'Disclosure mode — board-approved facts only',
      detail: 'Simulated telemetry, sparklines, and alert panels are hidden. Showing resource classification, financial scenarios, risk register, audit trail, and ESG frameworks aligned to public disclosure materials.',
    }
  }

  if (mode === 'live') {
    return {
      mode: 'live',
      telemetry: 'simulated',
      presentationMode,
      disclosureMode: false,
      bannerLabel: presentationMode ? 'Stakeholder session — mixed illustrative data' : 'Live — backend not connected',
      detail: presentationMode
        ? 'Presentation mode: plant/env streams remain illustrative until API ingestion. GeoJSON springs use public reference geometry; regulatory rows mirror structured issuer records for rehearsal.'
        : 'VITE_DATA_MODE=live is set, but telemetry still uses the mock pipeline until LiveDataService is implemented. Map layers use bundled GeoJSON (e.g. springs from public FBDS/CAR reference data).',
    }
  }
  return {
    mode: 'mock',
    telemetry: 'simulated',
    presentationMode,
    disclosureMode: false,
    bannerLabel: presentationMode ? 'Stakeholder session — illustrative run' : 'Demo data',
    detail: presentationMode
      ? 'Presentation mode: time series and alerts are illustrative. Springs/boundary GeoJSON and regulatory log rows are structured for agency briefing — replace with instrumented feeds and filed documents for production.'
      : 'Plant and environment time series are simulated. Map layers use bundled GeoJSON (springs: public FBDS/CAR points inside Caldeira; boundary and deposits as project reference geometry).',
  }
}

function buildProvenanceProfile(): ProvenanceProfile {
  const presentationMode = getPresentationMode()
  return {
    presentationMode,
    sections: {
      hydro_spring_geometry: {
        kind: 'from_public_record',
        hint: 'Spring locations from FBDS/CAR-derived GeoJSON inside Caldeira boundary',
      },
      hydro_spring_status: {
        kind: 'modeled',
        hint: 'Active/Reduced/Suppressed overlay from demo hydrology model — not field-verified',
      },
      hydro_piezo_telemetry: {
        kind: 'simulated',
        hint: 'Aquifer/piezo metrics from pilot simulation — swap for historian when wired',
      },
      plant_telemetry: { kind: 'simulated', hint: 'Pilot plant channels simulated for UI rehearsal' },
      precip_field: {
        kind: 'from_public_record',
        hint: 'Open-Meteo public weather API — recent observed precipitation',
      },
      regulatory_log: {
        kind: 'issuer_attested',
        hint: 'Structured engagement log for rehearsal — align dates/refs with counsel before external use',
      },
      audit_ledger: {
        kind: 'illustrative',
        hint: 'Demonstration event log with stub hashes — not a controlled legal record',
      },
      map_geometry: {
        kind: 'from_public_record',
        hint: 'DNPM/SIGMINE public licence and environmental boundaries',
      },
      drill_collars: {
        kind: 'issuer_attested',
        hint: 'ASX-disclosed drill collar coordinates and assay appendices',
      },
      licence_areas: {
        kind: 'from_public_record',
        hint: 'DNPM/SIGMINE public mining licence boundaries',
      },
      apa_buffer: {
        kind: 'from_public_record',
        hint: 'ICMBio/IEF public environmental protection area boundaries',
      },
      weather_forecast: {
        kind: 'modeled',
        hint: 'Open-Meteo 16-day forecast — numerical weather prediction model output, not observed data',
      },
      climate_baseline: {
        kind: 'from_public_record',
        hint: 'ECMWF ERA5 reanalysis — 5-year historical climate baseline via Open-Meteo Archive API (public scientific dataset)',
      },
      spring_health_prediction: {
        kind: 'ai_predicted',
        hint: 'Spring health forecast based on predicted precipitation and historical ERA5 correlation — indicative only',
      },
    },
  }
}

/* ─── Synthetic History Generator ───────────────────────────────────────── */
const DRIFT_SCALE: Record<TimeRangeKey, number> = { '24h': 1, '7d': 4, '30d': 8 }

function syntheticPrecipMmForIndex(i: number, range: TimeRangeKey): number {
  const mul = range === '24h' ? 0.32 : range === '7d' ? 1 : 1.15
  return Math.max(0, (2.6 + Math.sin(i * 0.41) * 2.1 + (i % 7) * 0.18) * mul)
}

function generateSyntheticHistory(length: number, range: TimeRangeKey) {
  const scale = DRIFT_SCALE[range]
  const plantHistory = [INITIAL_PLANT_TELEMETRY]
  const envHistory = [INITIAL_ENV_TELEMETRY]
  const precipMmSeries = [syntheticPrecipMmForIndex(0, range)]
  for (let i = 1; i < length; i++) {
    plantHistory.push(generatePlantTelemetry(plantHistory[i - 1], scale, i))
    envHistory.push(generateEnvTelemetry(envHistory[i - 1], scale, undefined, i))
    precipMmSeries.push(syntheticPrecipMmForIndex(i, range))
  }
  return { plantHistory, envHistory, precipMmSeries }
}

/* ─── Extraction Step Enrichment ────────────────────────────────────────── */

type DrillFeature = { properties: { id: string; deposit: string } }
let drillFeatures: DrillFeature[] | null = null
let drillFetchPromise: Promise<void> | null = null

function loadDrillFeatures(): Promise<void> {
  if (drillFeatures) return Promise.resolve()
  if (!drillFetchPromise) {
    drillFetchPromise = fetch(GEO.drillholes.url)
      .then(r => r.json())
      .then((geo: { features: DrillFeature[] }) => { drillFeatures = geo.features })
      .catch(() => { drillFeatures = [] })
  }
  return drillFetchPromise
}

// Kick off fetch immediately so it's ready by the time the UI needs batches
loadDrillFeatures()

function pickRandomDrills(depositId: string, count: number): string[] {
  if (!drillFeatures) return []
  const pool = drillFeatures.filter(f => f.properties.deposit === depositId)
  if (pool.length === 0) return []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, pool.length)).map(f => f.properties.id)
}

function enrichBatch(batch: ComplianceLedger): ComplianceLedger {
  const licenseId = BATCH_LICENSE_MAP[batch.batch_id]
  const depositId = licenseId ? LICENSE_DEPOSIT_MAP[licenseId] : undefined
  const deposit = depositId ? DEPOSIT_DATA.find(d => d.id === depositId) : undefined

  const timeline = batch.molecular_timeline.map(step => {
    let stepCoordinates = step.coordinates
    let stepLinkedDrills = step.linked_drills

    if (step.step === 'Extraction' && deposit) {
      stepCoordinates = stepCoordinates ?? { lng: deposit.center[0], lat: deposit.center[1] }
      stepLinkedDrills = stepLinkedDrills ?? pickRandomDrills(deposit.id, 3 + Math.floor(Math.random() * 2))
    }

    let hash = step.hash
    if (step.status === 'verified' || step.status === 'active') {
      hash = '0x' + sha256Stub(`${batch.batch_id}-${step.step}-${step.timestamp}`)
    }

    return {
      ...step,
      coordinates: stepCoordinates,
      linked_drills: stepLinkedDrills,
      hash,
    }
  })

  return { ...batch, molecular_timeline: timeline }
}

function getEnrichedBatches(): ComplianceLedger[] {
  return BATCHES.map(enrichBatch)
}

/* ─── Mock Service Implementation ───────────────────────────────────────── */
export function createMockDataService(): AetherDataService {
  let plant = INITIAL_PLANT_TELEMETRY
  let env = INITIAL_ENV_TELEMETRY
  let alerts: AlertItem[] = []
  const subscribers = new Set<TelemetryCallback>()
  let intervalId: ReturnType<typeof setInterval> | null = null

  const histories = {
    '24h': generateSyntheticHistory(HISTORY_LENGTHS['24h'], '24h'),
    '7d': generateSyntheticHistory(HISTORY_LENGTHS['7d'], '7d'),
    '30d': generateSyntheticHistory(HISTORY_LENGTHS['30d'], '30d'),
  }

  function tick() {
    plant = generatePlantTelemetry(plant)
    env = generateEnvTelemetry(env)
    const esg = calculateEsgScore(plant, env)
    alerts = detectAlerts(plant, env, alerts)

    const h24 = histories['24h']
    h24.plantHistory.push(plant)
    h24.envHistory.push(env)
    h24.precipMmSeries.push(syntheticPrecipMmForIndex(h24.envHistory.length - 1, '24h'))
    if (h24.plantHistory.length > HISTORY_LENGTHS['24h']) {
      h24.plantHistory.shift()
      h24.envHistory.shift()
      h24.precipMmSeries.shift()
    }

    for (const key of ['7d', '30d'] as TimeRangeKey[]) {
      const h = histories[key]
      const li = h.plantHistory.length - 1
      h.plantHistory[li] = plant
      h.envHistory[li] = env
      h.precipMmSeries[li] = syntheticPrecipMmForIndex(li, key)
    }

    const snapshot = { plant, env, esg, alerts: alerts.filter(a => !a.dismissed) }
    subscribers.forEach(cb => cb(snapshot))
  }

  function startIfNeeded() {
    if (!intervalId && subscribers.size > 0) {
      intervalId = setInterval(tick, TICK_MS)
    }
  }
  function stopIfEmpty() {
    if (intervalId && subscribers.size === 0) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    subscribeTelemetry(cb: TelemetryCallback) {
      subscribers.add(cb)
      const esg = calculateEsgScore(plant, env)
      cb({ plant, env, esg, alerts: alerts.filter(a => !a.dismissed) })
      startIfNeeded()
      return () => { subscribers.delete(cb); stopIfEmpty() }
    },

    getHistory(range: TimeRangeKey): HistoricalTelemetry {
      return histories[range]
    },

    getBatches(): ComplianceLedger[] { return getEnrichedBatches() },
    getBatch(id: string) { return getEnrichedBatches().find(b => b.batch_id === id) },

    getFinancialScenario(key: ScenarioKey) { return SCENARIOS[key] },
    getSensitivityTable() { return SENSITIVITY_TABLE },

    getRiskRegister() { return RISKS },
    getIncidentLog() { return INCIDENT_LOG },

    getOfftakerPipeline() { return OFFTAKERS },
    getCapitalSnapshot() { return CAPITAL },
    getDSCRProjections() { return DSCR_PROJECTIONS },
    getDrawdownSchedule() { return DRAWDOWN_SCHEDULE },
    getPricingModel() { return PRICING_MODEL },
    getMarketSizing() { return MARKET_SIZING },
    getDFSWorkstreams() { return DFS_WORKSTREAMS },
    getRegulatoryLog() { return REGULATORY_LOG },

    getBenchmarks() { return BENCHMARKS },

    getAuditTrail() { return AUDIT_TRAIL },
    getESGFrameworks() { return ESG_FRAMEWORKS },

    getProjectFinancials() { return PROJECT_FINANCIALS },
    getMarketPrices() { return MARKET_PRICES },
    getProjectTimeline() { return PROJECT_TIMELINE },
    getDepositData() { return DEPOSIT_DATA },
    getResourceClassification() { return RESOURCE_CLASSIFICATION },
    getHydrologyScenarios() { return PREDICTIVE_HYDROLOGY_SCENARIOS },
    getScaleUpPathway() { return SCALE_UP_PATHWAY },
    getPlantPerformance() { return PILOT_PLANT_PERFORMANCE },
    getHardwareSensors() { return HARDWARE_SENSORS },
    getCyberPillars() { return CYBER_TRUST_PILLARS },
    getApiHandoffs() { return API_HANDOFFS },
    getUThSafety() { return U_TH_SAFETY },
    getScope3Tracking() { return SCOPE_3_TRACKING },
    getSpringCount() { return SPRING_COUNT },
    getThresholds() { return THRESHOLDS },
    getDataContext() { return buildDataContext() },
    getProvenanceProfile() { return buildProvenanceProfile() },
    getRegulatoryExportBundle(): RegulatoryExportBundle {
      const ctx = buildDataContext()
      const auditSlice = AUDIT_TRAIL.filter(
        e => e.type === 'regulatory_submission' || e.id === 'AUD-008' || e.id === 'AUD-009' || e.id === 'AUD-010',
      )
      return {
        exportedAt: new Date().toISOString(),
        bannerNote: `${ctx.bannerLabel} — ${ctx.detail}`,
        regulatoryLog: [...REGULATORY_LOG],
        auditEvents: auditSlice,
        permittingRisks: RISKS.filter(r => r.category === 'permitting' || r.id === 'R01'),
        provenanceSummary: 'Illustrative bundle for briefing. Replace with signed PDFs and portal exports for official use.',
      }
    },
    getSpringHistory(springId: string) {
      return MOCK_SPRING_EVENTS.filter(e => e.springId === springId)
    },

    getIssuerSnapshot() {
      return CALDEIRA_ISSUER_SNAPSHOT
    },

    getSpatialInsights() {
      return {
        pilotToPfsPlantKm: SPATIAL_INSIGHTS.pilot_to_pfs_plant_km,
        licenceZonesInApaBuffer: SPATIAL_INSIGHTS.licence_zones_in_apa_buffer,
        summary: getSpatialInsightsSummary(),
        apaHeuristicNote: SPATIAL_INSIGHTS.apa_buffer_note,
      }
    },

    getLithologySummary() { return LITHOLOGY_SUMMARY },

    getStakeholderRegister() { return STAKEHOLDER_REGISTER },

    dismissAlert(id: string) {
      alerts = alerts.map(a => a.id === id ? { ...a, dismissed: true } : a)
      const esg = calculateEsgScore(plant, env)
      const snapshot = { plant, env, esg, alerts: alerts.filter(a => !a.dismissed) }
      subscribers.forEach(cb => cb(snapshot))
    },

    dismissAllAlerts() {
      alerts = alerts.map(a => ({ ...a, dismissed: true }))
      const esg = calculateEsgScore(plant, env)
      const snapshot = { plant, env, esg, alerts: [] }
      subscribers.forEach(cb => cb(snapshot))
    },
  }
}
