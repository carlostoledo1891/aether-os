import { getPresentationMode, getDisclosureMode, getApiBaseUrl, getWsUrl } from '../config/env'
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

const BASE = getApiBaseUrl() ?? ''

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
const cache = new Map<string, { data: unknown; at: number }>()
const TTL_MS = 30_000

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
    if (envWs) return `${envWs}/telemetry`
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
      return api<HistoricalTelemetry>(`/api/telemetry/history?range=${range}`, 5000) as unknown as HistoricalTelemetry
    },

    getBatches() { return api<ComplianceLedger[]>('/api/batches') as unknown as ComplianceLedger[] },
    getBatch(id: string) { return api<ComplianceLedger | undefined>(`/api/batches/${id}`) as unknown as ComplianceLedger | undefined },

    getFinancialScenario(key: ScenarioKey) { return api<FinancialScenario>(`/api/financials/scenario/${key}`) as unknown as FinancialScenario },
    getSensitivityTable() { return api<SensitivityPoint[]>('/api/financials/sensitivity') as unknown as SensitivityPoint[] },

    getRiskRegister() { return api<RiskItem[]>('/api/risks') as unknown as RiskItem[] },
    getIncidentLog() { return api<IncidentRecord[]>('/api/incidents') as unknown as IncidentRecord[] },

    getOfftakerPipeline() { return api<OfftakerRecord[]>('/api/offtakers') as unknown as OfftakerRecord[] },
    getCapitalSnapshot() { return api<CapitalSnapshot>('/api/capital') as unknown as CapitalSnapshot },
    getDFSWorkstreams() { return api<DFSWorkstream[]>('/api/dfs/workstreams') as unknown as DFSWorkstream[] },
    getRegulatoryLog() { return api<RegulatoryEntry[]>('/api/regulatory') as unknown as RegulatoryEntry[] },

    getBenchmarks() { return api<BenchmarkOperator[]>('/api/benchmarks') as unknown as BenchmarkOperator[] },
    getAuditTrail() { return api<AuditEvent[]>('/api/audit') as unknown as AuditEvent[] },
    getESGFrameworks() { return api<ESGFramework[]>('/api/esg') as unknown as ESGFramework[] },

    getProjectFinancials() { return api<ProjectFinancials>('/api/project/financials') as unknown as ProjectFinancials },
    getMarketPrices() { return api<MarketPrices>('/api/project/market-prices') as unknown as MarketPrices },
    getProjectTimeline() { return api<readonly ProjectMilestone[]>('/api/project/timeline') as unknown as readonly ProjectMilestone[] },
    getDepositData() { return api<DepositRecord[]>('/api/project/deposits') as unknown as DepositRecord[] },
    getResourceClassification() { return api<ResourceClassification>('/api/project/resources') as unknown as ResourceClassification },
    getHydrologyScenarios() { return api<readonly HydrologyScenario[]>('/api/project/hydrology') as unknown as readonly HydrologyScenario[] },
    getScaleUpPathway() { return api<ScaleUpPathway>('/api/project/scale-up') as unknown as ScaleUpPathway },
    getPlantPerformance() { return api<PilotPlantPerformance>('/api/project/plant-performance') as unknown as PilotPlantPerformance },
    getHardwareSensors() { return api<readonly HardwareSensorCategory[]>('/api/project/hardware-sensors') as unknown as readonly HardwareSensorCategory[] },
    getCyberPillars() { return api<readonly CyberTrustPillar[]>('/api/project/cyber-pillars') as unknown as readonly CyberTrustPillar[] },
    getApiHandoffs() { return api<readonly ApiHandoff[]>('/api/project/api-handoffs') as unknown as readonly ApiHandoff[] },
    getUThSafety() { return api<UThSafety>('/api/project/safety') as unknown as UThSafety },
    getScope3Tracking() { return api<Scope3Tracking>('/api/project/scope3') as unknown as Scope3Tracking },
    getSpringCount() { return api<{ count: number }>('/api/project/springs/count').then(r => r.count) as unknown as number },
    getThresholds() { return api<DomainThresholds>('/api/project/thresholds') as unknown as DomainThresholds },

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

    getProvenanceProfile(): ProvenanceProfile {
      return api<ProvenanceProfile>('/api/provenance') as unknown as ProvenanceProfile
    },

    getRegulatoryExportBundle(): RegulatoryExportBundle {
      return api<RegulatoryExportBundle>('/api/export/regulatory') as unknown as RegulatoryExportBundle
    },

    getSpringHistory(springId: string): SpringEvent[] {
      return api<SpringEvent[]>(`/api/springs/${springId}/history`) as unknown as SpringEvent[]
    },

    getIssuerSnapshot() {
      return api<IssuerSnapshot>('/api/issuer-snapshot') as unknown as IssuerSnapshot
    },

    getSpatialInsights() {
      return api<SpatialInsightBundle>('/api/spatial-insights') as unknown as SpatialInsightBundle
    },

    dismissAlert(id: string) {
      fetch(`${BASE}/api/alerts/dismiss/${id}`, { method: 'POST' }).catch(() => {})
    },

    dismissAllAlerts() {
      fetch(`${BASE}/api/alerts/dismiss-all`, { method: 'POST' }).catch(() => {})
    },
  }
}
