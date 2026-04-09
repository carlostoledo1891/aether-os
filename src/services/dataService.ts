import type { PlantTelemetry, EnvTelemetry, EsgScore, AlertItem, ComplianceLedger, SpringEvent } from '../types/telemetry'
import type { DepositRecord, DepositStatus } from '../data/mockData'
import type { IssuerSnapshot } from '../data/caldeira/issuerSnapshot'

export type { DepositRecord, DepositStatus }

/* ─── Time Range ────────────────────────────────────────────────────────── */
export type TimeRangeKey = '24h' | '7d' | '30d'

/* ─── Financial Scenarios ───────────────────────────────────────────────── */
export type ScenarioKey = 'consensus' | 'bull' | 'bear'

export interface FinancialScenario {
  key: ScenarioKey
  label: string
  ndpr_price_kg: number
  dytb_price_kg: number
  npv_pretax_m: number
  npv_posttax_m: number
  irr_pretax_pct: number
  irr_posttax_pct: number
  payback_yrs: number
  annual_revenue_m: number
  opex_per_kg: number
  breakeven_ndpr_kg: number
}

export interface SensitivityPoint {
  ndpr_price: number
  npv_pretax_m: number
  npv_posttax_m: number
}

/* ─── Risk Register ─────────────────────────────────────────────────────── */
export type RiskCategory = 'permitting' | 'market' | 'technical' | 'geopolitical' | 'environmental' | 'operational'

export interface RiskItem {
  id: string
  title: string
  category: RiskCategory
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  score: number
  mitigation: string
  status: 'open' | 'mitigating' | 'accepted' | 'closed'
  owner: string
  /** Cross-links to regulatory log row ids (e.g. REG-04) */
  relatedRegulatoryIds?: string[]
  /** Cross-links to audit event ids (e.g. AUD-010) */
  relatedAuditIds?: string[]
}

/* ─── Incident Log ──────────────────────────────────────────────────────── */
export type IncidentStatus = 'triggered' | 'acknowledged' | 'investigating' | 'resolved'

export interface IncidentRecord {
  id: string
  alertId: string
  title: string
  severity: 'critical' | 'warning' | 'info'
  triggeredAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  status: IncidentStatus
  assignee: string
  responseNote: string
  slaMinutes: number
}

/* ─── Off-taker Pipeline ────────────────────────────────────────────────── */
export type ContractStage = 'prospecting' | 'loi' | 'binding' | 'active'

export interface OfftakerRecord {
  id: string
  name: string
  location: string
  stage: ContractStage
  volumeCommitment: string
  qualificationStatus: string
  deliverySchedule: string
  product: string
  notes: string
}

/* ─── Capital Tracker ───────────────────────────────────────────────────── */
export interface ConditionPrecedent {
  id: string
  description: string
  status: 'met' | 'in_progress' | 'pending'
  target_date: string
}

export interface CapitalSnapshot {
  total_capex_m: number
  funded_m: number
  drawn_m: number
  remaining_m: number
  funding_sources: { name: string; committed_m: number; drawn_m: number; currency: string }[]
  conditions_precedent: ConditionPrecedent[]
  monthly_spend: { month: string; budget_m: number; actual_m: number }[]
}

/* ─── Market Sizing ────────────────────────────────────────────────────── */
export interface MarketSizingTier {
  label: string
  value_usd_b?: number
  value_usd_m?: number
  year: number
  forecast_usd_b?: number
  forecast_usd_m?: number
  forecast_year: number
  cagr_pct?: number
  source: string
  report_date: string
  methodology: string
}

export interface MarketSizing {
  tam: MarketSizingTier
  sam: MarketSizingTier
  som: MarketSizingTier
}

/* ─── Pricing Model ────────────────────────────────────────────────────── */
export interface PricingTier {
  name: string
  price_usd_mo: number | null
  includes: string
  target: string
}

export interface CostComponent {
  component: string
  est_mo: number
  notes: string
}

export interface PricingModel {
  model_type: string
  tiers: PricingTier[]
  cost_components: CostComponent[]
  tco_year1: {
    pilot_usd: number
    growth_usd: number
    enterprise_usd: string
    note: string
  }
}

/* ─── DSCR & Drawdown ──────────────────────────────────────────────────── */
export interface DSCRProjection {
  year: number
  bear: number
  consensus: number
  bull: number
}

export interface DrawdownMilestone {
  milestone: string
  target_date: string
  amount_m: number
  cumulative_m: number
  status: 'completed' | 'in_progress' | 'pending'
  cp_ref: string | null
}

/* ─── DFS & Regulatory ──────────────────────────────────────────────────── */
export interface DFSWorkstream {
  id: string
  name: string
  lead: string
  progress_pct: number
  status: 'on_track' | 'at_risk' | 'delayed' | 'complete'
  target_date: string
}

export interface RegulatoryEntry {
  id: string
  body: string
  type: string
  date: string
  status: 'submitted' | 'approved' | 'pending' | 'in_review'
  detail: string
  /** Placeholder doc / portal reference for administrative record */
  evidenceDocId?: string
  /** Next expected agency milestone (demo placeholder) */
  nextMilestone?: string
}

/* ─── Benchmarks ────────────────────────────────────────────────────────── */
export interface BenchmarkOperator {
  name: string
  carbon_intensity: number
  water_l_per_t: number
  feoc_pct: number
  cost_per_kg: number
  location: string
}

/* ─── Audit Trail ───────────────────────────────────────────────────────── */
export type AuditEventType =
  | 'batch_created'
  | 'passport_issued'
  | 'api_handoff'
  | 'alert_triggered'
  | 'alert_resolved'
  | 'compliance_check'
  | 'user_action'
  | 'system_event'
  | 'regulatory_submission'
  | 'offtake_update'

export interface AuditEvent {
  id: string
  timestamp: string
  type: AuditEventType
  actor: string
  action: string
  detail: string
  hash: string
  relatedEntityId?: string
}

/* ─── ESG Framework Alignment ───────────────────────────────────────────── */
export interface ESGFramework {
  id: string
  name: string
  standard: string
  category: 'water' | 'waste' | 'climate' | 'governance' | 'social'
  coverage_pct: number
  metrics: { metric: string; dashboardSource: string; status: 'mapped' | 'partial' | 'pending' }[]
}

/* ─── Telemetry Callback ────────────────────────────────────────────────── */
export interface TelemetryTick {
  plant: PlantTelemetry
  env: EnvTelemetry
  esg: EsgScore
  alerts: AlertItem[]
}

export type TelemetryCallback = (tick: TelemetryTick) => void
export type Unsubscribe = () => void

/* ─── Historical Telemetry ──────────────────────────────────────────────── */
export interface HistoricalTelemetry {
  plantHistory: PlantTelemetry[]
  envHistory: EnvTelemetry[]
  /** Same length as envHistory — synthetic daily precip (mm) for WQ correlation in demo */
  precipMmSeries: number[]
}

/* ─── Static Domain Data (project-level, not live telemetry) ────────────── */
export interface ProjectFinancials {
  npv_pretax_consensus_m: number; npv_pretax_forecast_m: number
  npv_posttax_consensus_m: number; npv_posttax_forecast_m: number
  irr_pretax_consensus_pct: number; irr_pretax_forecast_pct: number
  irr_posttax_consensus_pct: number; irr_posttax_forecast_pct: number
  capex_m: number; payback_yrs: number; lom_fcf_m: number
  opex_per_kg: number; ndpr_opex: number
  annual_treo_t: number; annual_ndpr_t: number; annual_dytb_t: number
  lom_treo_t: number; mine_life_years: number; throughput_mtpa: number
  exim_usd_m: number; efa_aud_m: number
}

export interface MarketPrices {
  spot_ndpr_kg: number; green_ndpr_kg: number
  spot_dytb_kg: number; green_dytb_kg: number
}

export interface ResourceClassification {
  global_bt: number; global_treo_ppm: number
  measured_mt: number; measured_treo_ppm: number
  mi_mt: number; mi_treo_ppm: number; inferred_mt: number
  mreo_avg_pct: number; deposits_count: number; drill_holes_total: number
}

export interface PilotPlantPerformance {
  nameplate_kg_day: number; peak_kg_day: number
  mrec_mreo_pct: number; mrec_dytb_pct: number
  recoveries: readonly { element: string; pilot_pct: number; ansto_pct: number }[]
  avg_magnet_recovery_pct: number; status: string
}

export interface HydrologyScenario {
  horizon: string; drought_index: number; recirculation_pct: number
  spring_preservation_pct: number; active_springs: number
  sulfate_guardband_ppm: number; permitting_signal: string
  recommendation: string; status: string
}

export interface ProjectMilestone {
  milestone: string; date: string; status: 'completed' | 'active' | 'pending'; detail: string
}

export interface CyberTrustPillar {
  title: string; detail: string; status: string; protocol: string
}

export interface HardwareSensorCategory {
  category: string
  items: readonly { name: string; location: string; measures: string; frequency: string }[]
}

export interface ApiHandoff {
  system: string; endpoint: string; payload: string
  status: string; latency_ms: number; last_sync: string
}

export interface UThSafety {
  primary_mineral: string; u_th_profile: string; solubilization: string
  mrec_classification: string; radioactive_tailings: boolean; advantage_vs_hardrock: string
}

export interface Scope3Tracking {
  reagent: string; supplier: string; supplier_origin: string
  feoc_status: string; verification_method: string; carbon_footprint_kg: number
  sanctions_check: string; risk_note: string
  supply_chain: readonly { step: string; entity: string; status: 'verified' | 'active' }[]
}

export interface ScaleUpPathway {
  pilot_name: string; pilot_throughput_kg_hr: number
  current_digital_coverage_pct: number; commercial_target_mtpa: number
  water_recirculation_target_pct: number; springs_monitored: number; board_message: string
}

export interface DomainThresholds {
  sulfate_warning_ppm: number; nitrate_warning_ppm: number
  radiation_critical_usv_h: number
  ph_low: number; ph_high: number; recirculation_warning_pct: number
}

/** Plant/env time series truth — stays simulated until a live backend is wired */
export type TelemetryTruth = 'simulated' | 'live'

/** What the UI should show for data honesty (banner + tooltips) */
export type ConnectionStatus = 'connected' | 'degraded' | 'offline'

export interface DataContext {
  mode: 'mock' | 'live'
  telemetry: TelemetryTruth
  /** Stakeholder / mixed mock+real demo mode (VITE_PRESENTATION_MODE) */
  presentationMode: boolean
  /** IR disclosure mode: hides simulated panels, shows board-approved facts only */
  disclosureMode: boolean
  bannerLabel: string
  detail: string
  /** Backend connection health (live mode only) */
  connectionStatus?: ConnectionStatus
}

/** Provenance vocabulary for issuer / regulator surfaces */
export type DataProvenanceKind =
  | 'verified_real'
  | 'from_public_record'
  | 'issuer_attested'
  | 'modeled'
  | 'illustrative'
  | 'simulated'

export interface ProvenanceSection {
  kind: DataProvenanceKind
  hint?: string
}

export interface ProvenanceProfile {
  presentationMode: boolean
  sections: Record<string, ProvenanceSection>
}

/** Human-readable short labels for provenance badges */
export const PROVENANCE_SHORT_LABEL: Record<DataProvenanceKind, string> = {
  verified_real: 'Live feed',
  from_public_record: 'Public record',
  issuer_attested: 'Issuer record',
  modeled: 'Modeled',
  illustrative: 'Illustrative',
  simulated: 'Simulated',
}

export interface RegulatoryExportBundle {
  exportedAt: string
  bannerNote: string
  regulatoryLog: RegulatoryEntry[]
  auditEvents: AuditEvent[]
  permittingRisks: RiskItem[]
  provenanceSummary: string
}

/** Cross-layer metrics for executive / field copy — heuristic until turf runtime joins */
export interface SpatialInsightBundle {
  pilotToPfsPlantKm: number
  licenceZonesInApaBuffer: number
  summary: string
  apaHeuristicNote: string
}

export type { IssuerSnapshot }

/* ─── The Service Contract ──────────────────────────────────────────────── */

/** Return type that honestly represents sync (mock) or async (live) results. */
export type MaybeAsync<T> = T | Promise<T>

export interface AetherDataService {
  subscribeTelemetry(cb: TelemetryCallback): Unsubscribe
  getHistory(range: TimeRangeKey): MaybeAsync<HistoricalTelemetry>

  getBatches(): MaybeAsync<ComplianceLedger[]>
  getBatch(id: string): MaybeAsync<ComplianceLedger | undefined>

  getFinancialScenario(key: ScenarioKey): MaybeAsync<FinancialScenario>
  getSensitivityTable(): MaybeAsync<SensitivityPoint[]>

  getRiskRegister(): MaybeAsync<RiskItem[]>
  getIncidentLog(): MaybeAsync<IncidentRecord[]>

  getOfftakerPipeline(): MaybeAsync<OfftakerRecord[]>
  getCapitalSnapshot(): MaybeAsync<CapitalSnapshot>
  getDSCRProjections(): MaybeAsync<DSCRProjection[]>
  getDrawdownSchedule(): MaybeAsync<DrawdownMilestone[]>
  getPricingModel(): MaybeAsync<PricingModel>
  getMarketSizing(): MaybeAsync<MarketSizing>
  getDFSWorkstreams(): MaybeAsync<DFSWorkstream[]>
  getRegulatoryLog(): MaybeAsync<RegulatoryEntry[]>

  getBenchmarks(): MaybeAsync<BenchmarkOperator[]>

  getAuditTrail(): MaybeAsync<AuditEvent[]>
  getESGFrameworks(): MaybeAsync<ESGFramework[]>

  getProjectFinancials(): MaybeAsync<ProjectFinancials>
  getMarketPrices(): MaybeAsync<MarketPrices>
  getProjectTimeline(): MaybeAsync<readonly ProjectMilestone[]>
  getDepositData(): MaybeAsync<DepositRecord[]>
  getResourceClassification(): MaybeAsync<ResourceClassification>
  getHydrologyScenarios(): MaybeAsync<readonly HydrologyScenario[]>
  getScaleUpPathway(): MaybeAsync<ScaleUpPathway>
  getPlantPerformance(): MaybeAsync<PilotPlantPerformance>
  getHardwareSensors(): MaybeAsync<readonly HardwareSensorCategory[]>
  getCyberPillars(): MaybeAsync<readonly CyberTrustPillar[]>
  getApiHandoffs(): MaybeAsync<readonly ApiHandoff[]>
  getUThSafety(): MaybeAsync<UThSafety>
  getScope3Tracking(): MaybeAsync<Scope3Tracking>
  getSpringCount(): MaybeAsync<number>
  getThresholds(): MaybeAsync<DomainThresholds>
  getDataContext(): DataContext
  /** Per-area provenance for badges (hydro, plant, regulatory narrative, etc.) */
  getProvenanceProfile(): MaybeAsync<ProvenanceProfile>
  /** Pack for JSON/CSV export — regulatory + audit slice + permitting risks */
  getRegulatoryExportBundle(): MaybeAsync<RegulatoryExportBundle>
  getSpringHistory(springId: string): MaybeAsync<SpringEvent[]>

  /** Citations + public narrative for executive disclaimers */
  getIssuerSnapshot(): MaybeAsync<IssuerSnapshot>
  /** Pilot ↔ PFS / APA buffer heuristics */
  getSpatialInsights(): MaybeAsync<SpatialInsightBundle>

  dismissAlert(id: string): void
  dismissAllAlerts(): void
}
