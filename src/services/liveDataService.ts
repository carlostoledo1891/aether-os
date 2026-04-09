import { getPresentationMode, getDisclosureMode, getWsUrl } from '../config/env'
import type {
  AetherDataService, DataContext, ConnectionStatus, ProvenanceProfile, RegulatoryExportBundle,
  TelemetryCallback, Unsubscribe, TimeRangeKey, HistoricalTelemetry,
  ScenarioKey, FinancialScenario, SensitivityPoint,
  RiskItem, IncidentRecord, OfftakerRecord, CapitalSnapshot,
  DFSWorkstream, RegulatoryEntry, BenchmarkOperator, AuditEvent, ESGFramework,
  ProjectFinancials, MarketPrices, ProjectMilestone, HydrologyScenario,
  ScaleUpPathway, PilotPlantPerformance, HardwareSensorCategory,
  CyberTrustPillar, ApiHandoff, UThSafety, Scope3Tracking,
  DomainThresholds, ResourceClassification, SpatialInsightBundle,
  TelemetryTick,
} from './dataService'
import type { DepositRecord } from '../data/mockData'
import type { ComplianceLedger, SpringEvent } from '../types/telemetry'
import type { IssuerSnapshot } from '../data/caldeira/issuerSnapshot'

const BASE = ''

/* ─── Connection status tracking ───────────────────────────────────────── */
let _connectionStatus: ConnectionStatus = 'connected'
const _statusListeners = new Set<(s: ConnectionStatus) => void>()

function setConnectionStatus(s: ConnectionStatus) {
  if (s === _connectionStatus) return
  _connectionStatus = s
  _statusListeners.forEach(fn => fn(s))
}

export function getConnectionStatus(): ConnectionStatus { return _connectionStatus }
export function onConnectionStatusChange(fn: (s: ConnectionStatus) => void): () => void {
  _statusListeners.add(fn)
  return () => { _statusListeners.delete(fn) }
}

/* ─── Tiny fetch+cache helper ───────────────────────────────────────────── */
/**
 * Layer 1 cache — authoritative staleness boundary.
 * useServiceQuery (Layer 2) is a 200ms dedup window only; it defers to
 * this layer for freshness decisions.
 *
 * TTL per endpoint:
 *  - Default: 30s  (static domain data that changes infrequently)
 *  - History: 5s   (telemetry time-series)
 *  - Geology / financial / resource: 0  (De Carvalho: "Never show a stale
 *    number for geology." These endpoints always hit the network.)
 */
const cache = new Map<string, { data: unknown; at: number }>()
const TTL_MS = 30_000
const NO_CACHE = 0

async function api<T>(path: string, ttl = TTL_MS): Promise<T> {
  const url = `${BASE}${path}`
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < ttl) return hit.data as T

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API ${res.status}: ${url}`)
    const data = await res.json() as T
    cache.set(url, { data, at: Date.now() })
    setConnectionStatus('connected')
    return data
  } catch (err) {
    const stale = cache.get(url)
    if (stale) {
      setConnectionStatus('degraded')
      return stale.data as T
    }
    setConnectionStatus('offline')
    throw err
  }
}

/* ─── WebSocket telemetry subscription ──────────────────────────────────── */
function createWsTelemetryStream() {
  const subscribers = new Set<TelemetryCallback>()
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let lastTick: TelemetryTick | null = null
  let retryCount = 0

  function buildWsUrl(): string {
    const envWs = getWsUrl()
    if (envWs) {
      const base = envWs.replace(/\/+$/, '')
      return base.endsWith('/ws') ? `${base}/telemetry` : `${base}/ws/telemetry`
    }
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${location.host}/ws/telemetry`
  }

  function nextRetryMs(): number {
    const base = Math.min(1000 * Math.pow(2, retryCount), 30_000)
    return Math.round(base * (0.5 + Math.random() * 0.5))
  }

  function connect() {
    ws = new WebSocket(buildWsUrl())

    ws.onopen = () => {
      retryCount = 0
      setConnectionStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const tick = JSON.parse(event.data as string) as TelemetryTick
        lastTick = tick
        subscribers.forEach(cb => cb(tick))
      } catch { /* malformed message */ }
    }

    ws.onclose = () => {
      ws = null
      if (subscribers.size > 0) {
        reconnectTimer = setTimeout(connect, nextRetryMs())
        retryCount++
      }
    }

    ws.onerror = () => ws?.close()
  }

  function subscribe(cb: TelemetryCallback): Unsubscribe {
    subscribers.add(cb)

    if (lastTick) cb(lastTick)

    if (!ws && !reconnectTimer) connect()

    return () => {
      subscribers.delete(cb)
      if (subscribers.size === 0) {
        if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
        retryCount = 0
        ws?.close()
        ws = null
      }
    }
  }

  return { subscribe }
}

/* ─── Create the live data service ──────────────────────────────────────── */
export function createLiveDataService(): AetherDataService {
  const telemetryStream = createWsTelemetryStream()

  return {
    subscribeTelemetry(cb: TelemetryCallback): Unsubscribe {
      return telemetryStream.subscribe(cb)
    },

    getHistory(range: TimeRangeKey) {
      return api<HistoricalTelemetry>(`/api/telemetry/history?range=${range}`, 5000)
    },

    getBatches() { return api<ComplianceLedger[]>('/api/batches') },
    getBatch(id: string) { return api<ComplianceLedger | undefined>(`/api/batches/${id}`) },

    getFinancialScenario(key: ScenarioKey) { return api<FinancialScenario>(`/api/financials/scenario/${key}`, NO_CACHE) },
    getSensitivityTable() { return api<SensitivityPoint[]>('/api/financials/sensitivity', NO_CACHE) },

    getRiskRegister() { return api<RiskItem[]>('/api/risks') },
    getIncidentLog() { return api<IncidentRecord[]>('/api/incidents') },

    getOfftakerPipeline() { return api<OfftakerRecord[]>('/api/offtakers') },
    getCapitalSnapshot() { return api<CapitalSnapshot>('/api/capital') },
    getDFSWorkstreams() { return api<DFSWorkstream[]>('/api/dfs/workstreams') },
    getRegulatoryLog() { return api<RegulatoryEntry[]>('/api/regulatory') },

    getBenchmarks() { return api<BenchmarkOperator[]>('/api/benchmarks') },
    getAuditTrail() { return api<AuditEvent[]>('/api/audit') },
    getESGFrameworks() { return api<ESGFramework[]>('/api/esg') },

    getProjectFinancials() { return api<ProjectFinancials>('/api/project/financials', NO_CACHE) },
    getMarketPrices() { return api<MarketPrices>('/api/project/market-prices', NO_CACHE) },
    getProjectTimeline() { return api<readonly ProjectMilestone[]>('/api/project/timeline') },
    getDepositData() { return api<DepositRecord[]>('/api/project/deposits', NO_CACHE) },
    getResourceClassification() { return api<ResourceClassification>('/api/project/resources', NO_CACHE) },
    getHydrologyScenarios() { return api<readonly HydrologyScenario[]>('/api/project/hydrology', NO_CACHE) },
    getScaleUpPathway() { return api<ScaleUpPathway>('/api/project/scale-up') },
    getPlantPerformance() { return api<PilotPlantPerformance>('/api/project/plant-performance') },
    getHardwareSensors() { return api<readonly HardwareSensorCategory[]>('/api/project/hardware-sensors') },
    getCyberPillars() { return api<readonly CyberTrustPillar[]>('/api/project/cyber-pillars') },
    getApiHandoffs() { return api<readonly ApiHandoff[]>('/api/project/api-handoffs') },
    getUThSafety() { return api<UThSafety>('/api/project/safety') },
    getScope3Tracking() { return api<Scope3Tracking>('/api/project/scope3') },
    getSpringCount() { return api<{ count: number }>('/api/project/springs/count').then(r => r.count) },
    getThresholds() { return api<DomainThresholds>('/api/project/thresholds') },

    getDataContext(): DataContext {
      const presentationMode = getPresentationMode()
      const disclosureMode = getDisclosureMode()
      const connectionStatus = _connectionStatus

      if (disclosureMode) {
        return {
          mode: 'live',
          telemetry: 'simulated',
          presentationMode,
          disclosureMode: true,
          bannerLabel: 'Disclosure mode — board-approved facts only',
          detail: 'Live pipeline active. Simulated telemetry hidden. Showing board-approved data only.',
          connectionStatus,
        }
      }

      if (presentationMode) {
        return {
          mode: 'live',
          telemetry: 'simulated',
          presentationMode: true,
          disclosureMode: false,
          bannerLabel: 'Live pipeline — Aether Simulation Engine (presentation)',
          detail: 'Telemetry flows through the Aether API via the simulation engine. Plant/env streams are synthetic. Weather and FX enrichers may be active.',
          connectionStatus,
        }
      }

      return {
        mode: 'live',
        telemetry: 'simulated',
        presentationMode: false,
        disclosureMode: false,
        bannerLabel: 'Live pipeline — Aether Simulation Engine',
        detail: 'Telemetry flows through the Aether API via the simulation engine. Weather from Open-Meteo, FX from BCB. Plant/env streams are synthetic until LAPOC instruments connect.',
        connectionStatus,
      }
    },

    getProvenanceProfile() {
      return api<ProvenanceProfile>('/api/provenance')
    },

    getRegulatoryExportBundle() {
      return api<RegulatoryExportBundle>('/api/export/regulatory')
    },

    getSpringHistory(springId: string) {
      return api<SpringEvent[]>(`/api/springs/${springId}/history`)
    },

    getIssuerSnapshot() {
      return api<IssuerSnapshot>('/api/issuer-snapshot')
    },

    getSpatialInsights() {
      return api<SpatialInsightBundle>('/api/spatial-insights')
    },

    dismissAlert(id: string) {
      fetch(`${BASE}/api/alerts/dismiss/${id}`, { method: 'POST' }).catch(() => {})
    },

    dismissAllAlerts() {
      fetch(`${BASE}/api/alerts/dismiss-all`, { method: 'POST' }).catch(() => {})
    },
  }
}
