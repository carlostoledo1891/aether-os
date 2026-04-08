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
  BATCHES, PROJECT_FINANCIALS, MARKET_PRICES, PROJECT_TIMELINE,
  DEPOSIT_DATA, RESOURCE_CLASSIFICATION, PREDICTIVE_HYDROLOGY_SCENARIOS,
  SCALE_UP_PATHWAY, PILOT_PLANT_PERFORMANCE, HARDWARE_SENSORS,
  CYBER_TRUST_PILLARS, API_HANDOFFS, U_TH_SAFETY, SCOPE_3_TRACKING,
  SPRING_COUNT, THRESHOLDS, MOCK_SPRING_EVENTS,
} from '../data/mockData'
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
  FinancialScenario,
  SensitivityPoint,
  RiskItem,
  IncidentRecord,
  OfftakerRecord,
  CapitalSnapshot,
  DFSWorkstream,
  RegulatoryEntry,
  BenchmarkOperator,
  AuditEvent,
  ESGFramework,
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
        kind: 'illustrative',
        hint: 'Open-Meteo optional; otherwise deterministic mock precip for same window',
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
        kind: 'illustrative',
        hint: 'Bundled GeoJSON for Caldeira — each feature carries source_ref; see docs/data/caldeira/DATA_SOURCES.md. Not cadastral survey.',
      },
    },
  }
}

/* ─── Financial Scenarios (aligned to PFS July 2025 sensitivity table) ── */
const SCENARIOS: Record<ScenarioKey, FinancialScenario> = {
  consensus: {
    key: 'consensus', label: 'Consensus', ndpr_price_kg: 86, dytb_price_kg: 480,
    npv_pretax_m: 821, npv_posttax_m: 488, irr_pretax_pct: 28, irr_posttax_pct: 21,
    payback_yrs: 3, annual_revenue_m: 315, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
  bull: {
    key: 'bull', label: 'Bull (Forecast)', ndpr_price_kg: 135, dytb_price_kg: 680,
    npv_pretax_m: 1985, npv_posttax_m: 1256, irr_pretax_pct: 39, irr_posttax_pct: 31,
    payback_yrs: 2, annual_revenue_m: 485, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
  bear: {
    key: 'bear', label: 'Bear (Spot)', ndpr_price_kg: 67, dytb_price_kg: 350,
    npv_pretax_m: 251, npv_posttax_m: 109, irr_pretax_pct: 15, irr_posttax_pct: 11,
    payback_yrs: 5, annual_revenue_m: 245, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
}

const SENSITIVITY_TABLE: SensitivityPoint[] = [
  { ndpr_price: 50, npv_pretax_m: 48, npv_posttax_m: -15 },
  { ndpr_price: 67, npv_pretax_m: 251, npv_posttax_m: 109 },
  { ndpr_price: 86, npv_pretax_m: 821, npv_posttax_m: 488 },
  { ndpr_price: 100, npv_pretax_m: 1130, npv_posttax_m: 695 },
  { ndpr_price: 110, npv_pretax_m: 1347, npv_posttax_m: 835 },
  { ndpr_price: 120, npv_pretax_m: 1620, npv_posttax_m: 1020 },
  { ndpr_price: 135, npv_pretax_m: 1985, npv_posttax_m: 1256 },
]

/* ─── Risk Register ─────────────────────────────────────────────────────── */
const RISKS: RiskItem[] = [
  {
    id: 'R01',
    title: 'MPF cumulative EIA objection blocks LI',
    category: 'permitting',
    likelihood: 3,
    impact: 5,
    score: 15,
    mitigation: `Hydro digital twin + ${SPRING_COUNT} spring reference points (public FBDS/CAR geometry) + illustrative monitoring narrative for permitting dialogue.`,
    status: 'mitigating',
    owner: 'VP Environment',
    relatedRegulatoryIds: ['REG-04'],
    relatedAuditIds: ['AUD-010'],
  },
  { id: 'R02', title: 'NdPr price decline below breakeven', category: 'market', likelihood: 2, impact: 5, score: 10, mitigation: 'Green premium offtakes with floor price clauses; diversified DyTb revenue stream', status: 'mitigating', owner: 'CFO' },
  { id: 'R03', title: 'FEOC policy change expands restricted entities', category: 'geopolitical', likelihood: 2, impact: 4, score: 8, mitigation: 'Full Scope 3 reagent provenance tracking; allied-only supply chain architecture', status: 'mitigating', owner: 'VP Compliance' },
  { id: 'R04', title: 'DFS completion delayed beyond mid-2026', category: 'technical', likelihood: 3, impact: 4, score: 12, mitigation: 'Ausenco acceleration package; parallel workstreams; weekly progress tracking', status: 'mitigating', owner: 'Project Director' },
  { id: 'R05', title: 'Water quality exceedance at discharge point', category: 'environmental', likelihood: 2, impact: 4, score: 8, mitigation: 'ISE real-time monitoring; automated throttle at 200 ppm sulfate; contingency treatment', status: 'mitigating', owner: 'Environmental Manager' },
  { id: 'R06', title: 'UDC legacy radiation above background', category: 'environmental', likelihood: 2, impact: 3, score: 6, mitigation: 'Continuous scintillation monitoring; 3 km exclusion buffer; INB/CNEN compliance', status: 'accepted', owner: 'HSE Director' },
  { id: 'R07', title: 'Ammonium sulfate supply chain disruption', category: 'operational', likelihood: 2, impact: 3, score: 6, mitigation: 'Dual-supplier qualification (AdvanSix + backup); 90-day strategic inventory', status: 'mitigating', owner: 'Supply Chain Manager' },
  { id: 'R08', title: 'Key personnel retention during scale-up', category: 'operational', likelihood: 3, impact: 3, score: 9, mitigation: 'Long-term incentive plans; knowledge transfer protocols; deputy role assignments', status: 'open', owner: 'CHRO' },
  { id: 'R09', title: 'BRL/USD FX exposure on operating costs', category: 'market', likelihood: 3, impact: 3, score: 9, mitigation: 'Natural hedge (USD revenue / BRL costs); rolling 12-month hedging policy', status: 'mitigating', owner: 'Treasury' },
  { id: 'R10', title: 'Community opposition to mine expansion', category: 'permitting', likelihood: 2, impact: 4, score: 8, mitigation: 'Community liaison program; local employment commitment; environmental offset fund', status: 'mitigating', owner: 'Community Relations' },
]

/* ─── Incident Log ──────────────────────────────────────────────────────── */
const INCIDENT_LOG: IncidentRecord[] = [
  { id: 'INC-001', alertId: 'alert-ph-high', title: 'pH Level Elevated — Leach Circuit', severity: 'warning', triggeredAt: '2026-04-04T14:22:00Z', acknowledgedAt: '2026-04-04T14:25:00Z', resolvedAt: '2026-04-04T14:58:00Z', status: 'resolved', assignee: 'J. Santos (Process Eng.)', responseNote: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4 within 36 minutes.', slaMinutes: 30 },
  { id: 'INC-002', alertId: 'alert-sulfate', title: 'Sulfate Containment Near Threshold', severity: 'critical', triggeredAt: '2026-04-03T09:10:00Z', acknowledgedAt: '2026-04-03T09:12:00Z', resolvedAt: '2026-04-03T10:45:00Z', status: 'resolved', assignee: 'M. Costa (Env. Manager)', responseNote: 'Discharge flow reduced 30%. Activated contingency filtration. Sulfate dropped to 218 ppm.', slaMinutes: 15 },
  { id: 'INC-003', alertId: 'alert-recirc', title: 'Water Recirculation Below Target', severity: 'warning', triggeredAt: '2026-04-02T16:44:00Z', acknowledgedAt: '2026-04-02T16:50:00Z', resolvedAt: '2026-04-02T17:30:00Z', status: 'resolved', assignee: 'A. Lima (Operations)', responseNote: 'Filter blockage cleared. Recirculation recovered to 95.6% within 46 minutes.', slaMinutes: 30 },
  { id: 'INC-004', alertId: 'alert-radiation', title: 'UDC Radiation Elevated', severity: 'critical', triggeredAt: '2026-03-28T11:05:00Z', acknowledgedAt: '2026-03-28T11:08:00Z', resolvedAt: '2026-03-28T12:20:00Z', status: 'resolved', assignee: 'R. Ferreira (HSE)', responseNote: 'Wind-carried particulate event. Personnel evacuated from 500m zone. Levels normalized after 75 min.', slaMinutes: 15 },
  { id: 'INC-005', alertId: 'alert-aquifer', title: 'Aquifer Depth Critical — PIZ-E04', severity: 'critical', triggeredAt: '2026-03-25T08:30:00Z', acknowledgedAt: '2026-03-25T08:33:00Z', resolvedAt: '2026-03-25T11:00:00Z', status: 'resolved', assignee: 'Dr. L. Oliveira (Hydro.)', responseNote: 'Seasonal drawdown event. Pumping throttled 20%. East margin piezometer stabilized at +1.8m delta.', slaMinutes: 15 },
]

/* ─── Off-taker Pipeline ────────────────────────────────────────────────── */
const OFFTAKERS: OfftakerRecord[] = [
  { id: 'ucore', name: 'Ucore Rare Metals', location: 'Louisiana SMC, USA', stage: 'binding', volumeCommitment: '2,000 tpa TREO', qualificationStatus: 'Qualification samples delivered — metallurgical testing in progress', deliverySchedule: 'H2 2028 (aligned with first production)', product: 'MREC (Mixed Rare Earth Carbonate)', notes: 'Strategic partner for US DoD supply chain. EXIM-backed facility.' },
  { id: 'neo', name: 'Neo Performance Materials', location: 'Narva, Estonia (EU)', stage: 'loi', volumeCommitment: '1,500 tpa TREO', qualificationStatus: 'LOI executed — awaiting DFS completion for binding terms', deliverySchedule: 'H1 2029', product: 'MREC → separated oxides', notes: 'EU Digital Battery Passport integration active. Catena-X registered.' },
]

/* ─── Capital Tracker ───────────────────────────────────────────────────── */
const CAPITAL: CapitalSnapshot = {
  total_capex_m: 443,
  funded_m: 443,
  drawn_m: 28,
  remaining_m: 415,
  funding_sources: [
    { name: 'US EXIM Bank', committed_m: 350, drawn_m: 15, currency: 'USD' },
    { name: 'Export Finance Australia', committed_m: 70, drawn_m: 8, currency: 'AUD' },
    { name: 'Equity / Working Capital', committed_m: 23, drawn_m: 5, currency: 'AUD' },
  ],
  conditions_precedent: [
    { id: 'CP-01', description: 'DFS completion and Board approval', status: 'in_progress', target_date: '2026-06-30' },
    { id: 'CP-02', description: 'Installation License (LI) granted', status: 'pending', target_date: '2026-06-30' },
    { id: 'CP-03', description: 'Final Investment Decision (FID)', status: 'pending', target_date: '2026-09-30' },
    { id: 'CP-04', description: 'Environmental bond posted', status: 'met', target_date: '2026-03-31' },
    { id: 'CP-05', description: 'Binding offtake agreements', status: 'in_progress', target_date: '2026-08-31' },
  ],
  monthly_spend: [
    { month: 'Jan 2026', budget_m: 2.1, actual_m: 1.8 },
    { month: 'Feb 2026', budget_m: 2.4, actual_m: 2.6 },
    { month: 'Mar 2026', budget_m: 3.0, actual_m: 2.9 },
    { month: 'Apr 2026', budget_m: 3.5, actual_m: 3.2 },
    { month: 'May 2026', budget_m: 4.0, actual_m: 0 },
    { month: 'Jun 2026', budget_m: 5.2, actual_m: 0 },
  ],
}

/* ─── DFS & Regulatory ──────────────────────────────────────────────────── */
const DFS_WORKSTREAMS: DFSWorkstream[] = [
  { id: 'DFS-01', name: 'Mining & Reserves', lead: 'Ausenco', progress_pct: 85, status: 'on_track', target_date: '2026-05-15' },
  { id: 'DFS-02', name: 'Process Engineering', lead: 'Ausenco / Meteoric', progress_pct: 72, status: 'on_track', target_date: '2026-05-30' },
  { id: 'DFS-03', name: 'Infrastructure & Logistics', lead: 'Ausenco', progress_pct: 60, status: 'at_risk', target_date: '2026-06-15' },
  { id: 'DFS-04', name: 'Environmental & Permitting', lead: 'Meteoric / FEAM', progress_pct: 55, status: 'at_risk', target_date: '2026-06-30' },
  { id: 'DFS-05', name: 'Financial Model', lead: 'Ausenco / CFO', progress_pct: 45, status: 'on_track', target_date: '2026-06-30' },
]

const REGULATORY_LOG: RegulatoryEntry[] = [
  { id: 'REG-01', body: 'COPAM', type: 'LP Hearing', date: '2025-12-19', status: 'approved', detail: 'Unanimous approval of Preliminary License. No restrictions imposed.', evidenceDocId: 'DOC-COPAM-LP-2025-12' },
  { id: 'REG-02', body: 'SUPRAM', type: 'LI Application', date: '2026-02-14', status: 'submitted', detail: 'Installation License application lodged. FEAM technical review initiated.', evidenceDocId: 'PORTAL-SUPRAM-LI-2026-0214', nextMilestone: 'FEAM technical opinion (target 45 days)' },
  { id: 'REG-03', body: 'FEAM', type: 'Technical Review', date: '2026-03-20', status: 'in_review', detail: 'Environmental conditions review. Additional hydrological data requested — submitted Apr 1.', evidenceDocId: 'DOC-FEAM-HYDRO-2026-Q1', nextMilestone: 'Close data request loop — see AUD-010' },
  { id: 'REG-04', body: 'MPF', type: 'Cumulative EIA Request', date: '2026-01-15', status: 'in_review', detail: 'Federal prosecutor requested cumulative environmental impact assessment for plateau-wide operations.', evidenceDocId: 'MPF-OFF-2026-0115-CUM-EIA', nextMilestone: 'Issuer response package + hydro annex (illustrative UI until filed)' },
  { id: 'REG-05', body: 'INB/CNEN', type: 'Radiation Clearance', date: '2026-03-01', status: 'approved', detail: 'UDC legacy site monitoring protocol accepted. Operational clearance for 3 km buffer.', evidenceDocId: 'CNEN-PROT-UDC-2026-03' },
  { id: 'REG-06', body: 'IBAMA', type: 'APA Consultation', date: '2026-04-02', status: 'pending', detail: 'APA Pedra Branca buffer zone consultation scheduled. Pre-submission completed.', evidenceDocId: 'IBAMA-APA-PB-PRESUB-2026-04', nextMilestone: 'Formal consultation session' },
]

/* ─── Benchmarks ────────────────────────────────────────────────────────── */
const BENCHMARKS: BenchmarkOperator[] = [
  { name: 'Caldeira (Meteoric)', carbon_intensity: 2.14, water_l_per_t: 50, feoc_pct: 0, cost_per_kg: 8.91, location: 'Brazil' },
  { name: 'Mt. Weld (Lynas)', carbon_intensity: 8.5, water_l_per_t: 320, feoc_pct: 0, cost_per_kg: 12.40, location: 'Australia' },
  { name: 'Mountain Pass (MP)', carbon_intensity: 11.2, water_l_per_t: 480, feoc_pct: 0, cost_per_kg: 14.80, location: 'USA' },
  { name: 'Chinese Hard-Rock Avg', carbon_intensity: 13.4, water_l_per_t: 850, feoc_pct: 100, cost_per_kg: 7.20, location: 'China' },
]

/* ─── Audit Trail ───────────────────────────────────────────────────────── */
function sha256Stub(input: string): string {
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    h0 = (h0 ^ (c * 0x01000193)) >>> 0
    h1 = (h1 ^ ((c << 8) * 0x01000193)) >>> 0
    h2 = (h2 ^ ((c << 16) * 0x811c9dc5)) >>> 0
    h3 = (h3 ^ ((c << 24) * 0x01000193)) >>> 0
    h4 = ((h4 << 5) - h4 + c) >>> 0
    h5 = ((h5 << 7) ^ (c * 0x5bd1e995)) >>> 0
    h6 = ((h6 >>> 3) ^ (c * 0x1b873593)) >>> 0
    h7 = ((h7 << 11) ^ (c * 0xcc9e2d51)) >>> 0
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map(v => v.toString(16).padStart(8, '0')).join('')
}

const AUDIT_TRAIL: AuditEvent[] = [
  { id: 'AUD-001', timestamp: '2026-04-06T08:00:00Z', type: 'system_event', actor: 'System', action: 'Aether OS instance started', detail: 'Production environment boot — all sensor feeds connected. Firmware v2.4.1.', hash: sha256Stub('AUD-001-system-start') },
  { id: 'AUD-002', timestamp: '2026-04-06T08:02:14Z', type: 'compliance_check', actor: 'System', action: 'FEOC compliance sweep completed', detail: 'Full supply chain re-verified against FEOC database v2026-04-05. 0 flagged entities. 47 suppliers checked.', hash: sha256Stub('AUD-002-feoc-sweep') },
  { id: 'AUD-003', timestamp: '2026-04-05T16:30:00Z', type: 'batch_created', actor: 'J. Santos (Process Eng.)', action: 'Batch BATCH-MREC-8X9 initiated', detail: 'MREC precipitation run started. Feed material from Capão do Mel pit. Target: 142 kg MREC.', hash: sha256Stub('AUD-003-batch-create'), relatedEntityId: 'BATCH-MREC-8X9' },
  { id: 'AUD-004', timestamp: '2026-04-05T14:12:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'pH exceedance alert triggered', detail: 'Leach circuit pH rose to 5.12, exceeding 5.0 threshold. Alert dispatched to on-call process engineer.', hash: sha256Stub('AUD-004-alert-ph'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-005', timestamp: '2026-04-05T14:58:00Z', type: 'alert_resolved', actor: 'J. Santos (Process Eng.)', action: 'pH exceedance alert resolved', detail: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4. Total response time: 46 min.', hash: sha256Stub('AUD-005-alert-resolve'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-006', timestamp: '2026-04-04T10:00:00Z', type: 'passport_issued', actor: 'Aether OS', action: 'Digital Battery Passport DBP-2026-0042 issued', detail: 'EU-compliant DBP JSON payload generated for batch BATCH-MREC-7W2. Hash anchored to permissioned ledger.', hash: sha256Stub('AUD-006-dbp-issue'), relatedEntityId: 'BATCH-MREC-7W2' },
  { id: 'AUD-007', timestamp: '2026-04-04T10:05:00Z', type: 'api_handoff', actor: 'Aether OS', action: 'DBP payload pushed to Ucore SAP', detail: 'Automated ABI pre-filing to US CBP. Digital Battery Passport synchronized to Ucore ERP via REST API. HTTP 200.', hash: sha256Stub('AUD-007-api-push'), relatedEntityId: 'ucore' },
  { id: 'AUD-008', timestamp: '2026-04-03T09:10:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'Sulfate containment critical alert', detail: 'Discharge sulfate reached 247 ppm, approaching 250 ppm regulatory limit. Automatic flow reduction triggered.', hash: sha256Stub('AUD-008-sulfate-alert') },
  { id: 'AUD-009', timestamp: '2026-04-03T10:45:00Z', type: 'alert_resolved', actor: 'M. Costa (Env. Manager)', action: 'Sulfate containment resolved', detail: 'Discharge flow reduced 30%. Contingency filtration activated. Sulfate dropped to 218 ppm. FEAM notified.', hash: sha256Stub('AUD-009-sulfate-resolve') },
  { id: 'AUD-010', timestamp: '2026-04-02T11:30:00Z', type: 'regulatory_submission', actor: 'VP Environment', action: 'Additional hydrological data submitted to FEAM', detail: 'Piezometer data package (Q1 2026) and updated hydrological model delivered to FEAM via SUPRAM portal.', hash: sha256Stub('AUD-010-feam-submit'), relatedEntityId: 'REG-03' },
  { id: 'AUD-011', timestamp: '2026-04-01T09:00:00Z', type: 'compliance_check', actor: 'System', action: 'SOC 2 Type II automated audit cycle', detail: 'Continuous compliance checks passed. Data security, availability, and processing integrity validated. 0 findings.', hash: sha256Stub('AUD-011-soc2-audit') },
  { id: 'AUD-012', timestamp: '2026-03-28T12:20:00Z', type: 'alert_resolved', actor: 'R. Ferreira (HSE)', action: 'UDC radiation event resolved', detail: 'Wind-carried particulate event. Personnel evacuated from 500m zone. Levels normalized after 75 min. CNEN incident form filed.', hash: sha256Stub('AUD-012-radiation-resolve') },
  { id: 'AUD-013', timestamp: '2026-03-25T08:33:00Z', type: 'user_action', actor: 'Dr. L. Oliveira (Hydro.)', action: 'Pumping throttle applied — PIZ-E04', detail: 'Seasonal drawdown event. East margin piezometer critical. Pumping reduced 20%. Aquifer stabilized at +1.8m delta.', hash: sha256Stub('AUD-013-pump-throttle') },
  { id: 'AUD-014', timestamp: '2026-03-20T15:00:00Z', type: 'offtake_update', actor: 'VP Commercial', action: 'Neo Performance LOI executed', detail: 'Letter of Intent signed for 1,500 tpa TREO. Binding terms contingent on DFS completion.', hash: sha256Stub('AUD-014-neo-loi'), relatedEntityId: 'neo' },
  { id: 'AUD-015', timestamp: '2026-03-15T10:00:00Z', type: 'batch_created', actor: 'A. Lima (Operations)', action: 'Batch BATCH-MREC-7W2 initiated', detail: 'MREC precipitation run started. Feed material from Soberbo pit. Target: 155 kg MREC.', hash: sha256Stub('AUD-015-batch-create'), relatedEntityId: 'BATCH-MREC-7W2' },
]

/* ─── ESG Framework Alignment ───────────────────────────────────────────── */
const ESG_FRAMEWORKS: ESGFramework[] = [
  {
    id: 'gri-303', name: 'GRI 303: Water & Effluents', standard: 'GRI', category: 'water', coverage_pct: 92,
    metrics: [
      { metric: 'Water withdrawal by source', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Water recycled and reused', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Water discharge quality', dashboardSource: 'FieldView → Hydro Twin → Sulfate/Nitrate ppm', status: 'mapped' },
      { metric: 'Water stress area assessment', dashboardSource: `FieldView → Hydro Twin → ${SPRING_COUNT} Springs Monitor`, status: 'mapped' },
    ],
  },
  {
    id: 'gri-306', name: 'GRI 306: Waste', standard: 'GRI', category: 'waste', coverage_pct: 78,
    metrics: [
      { metric: 'Waste generated', dashboardSource: 'FieldView → Operations → Dry-stack tailings volume', status: 'mapped' },
      { metric: 'Waste diverted from disposal', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Significant spills', dashboardSource: 'Alert Panel → Incident Log', status: 'mapped' },
      { metric: 'Hazardous waste transport', dashboardSource: 'Not applicable (ionic clay — no hazardous waste)', status: 'partial' },
    ],
  },
  {
    id: 'sasb-em-mm', name: 'SASB EM-MM: Metals & Mining', standard: 'SASB', category: 'governance', coverage_pct: 85,
    metrics: [
      { metric: 'GHG Scope 1 + 2 emissions', dashboardSource: 'BuyerView → Green Premium → Carbon Intensity', status: 'mapped' },
      { metric: 'Total fresh water withdrawn', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Community engagement & permits', dashboardSource: 'ExecutiveView → DFS → Regulatory Log', status: 'mapped' },
      { metric: 'Workforce health & safety', dashboardSource: 'Alert Panel → Incident Log → SLA Metrics', status: 'partial' },
      { metric: 'Reserves & resource estimation', dashboardSource: 'ExecutiveView → Assets → Geology Panel', status: 'mapped' },
    ],
  },
  {
    id: 'tcfd', name: 'TCFD: Climate-Related Disclosures', standard: 'TCFD', category: 'climate', coverage_pct: 70,
    metrics: [
      { metric: 'Governance: Board oversight of climate risks', dashboardSource: 'ExecutiveView → Risk Register', status: 'mapped' },
      { metric: 'Strategy: Climate scenario analysis', dashboardSource: 'FieldView → Hydro Twin → Predictive Modeling (drought)', status: 'mapped' },
      { metric: 'Risk management: Integration of climate risk', dashboardSource: 'ExecutiveView → Risk Register → Environmental', status: 'mapped' },
      { metric: 'Metrics: Scope 3 emissions tracking', dashboardSource: 'BuyerView → Scope 3 Reagent Provenance', status: 'partial' },
    ],
  },
  {
    id: 'issb-s2', name: 'ISSB S2: Climate Disclosures', standard: 'ISSB', category: 'climate', coverage_pct: 62,
    metrics: [
      { metric: 'Physical climate risk assessment', dashboardSource: 'FieldView → Hydro Twin → Drought Forecast 2030–2050', status: 'mapped' },
      { metric: 'Transition risk: Commodity price sensitivity', dashboardSource: 'ExecutiveView → Financials → Sensitivity Table', status: 'mapped' },
      { metric: 'Cross-industry emissions metrics', dashboardSource: 'BuyerView → Competitive Benchmarks → CO₂/t', status: 'mapped' },
      { metric: 'Financed emissions', dashboardSource: 'Not yet tracked — requires EXIM/EFA integration', status: 'pending' },
    ],
  },
]

/* ─── Synthetic History Generator ───────────────────────────────────────── */
const DRIFT_SCALE: Record<TimeRangeKey, number> = { '24h': 1, '7d': 2.5, '30d': 5 }

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
    plantHistory.push(generatePlantTelemetry(plantHistory[i - 1], scale))
    envHistory.push(generateEnvTelemetry(envHistory[i - 1], scale))
    precipMmSeries.push(syntheticPrecipMmForIndex(i, range))
  }
  return { plantHistory, envHistory, precipMmSeries }
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

    getBatches(): ComplianceLedger[] { return BATCHES },
    getBatch(id: string) { return BATCHES.find(b => b.batch_id === id) },

    getFinancialScenario(key: ScenarioKey) { return SCENARIOS[key] },
    getSensitivityTable() { return SENSITIVITY_TABLE },

    getRiskRegister() { return RISKS },
    getIncidentLog() { return INCIDENT_LOG },

    getOfftakerPipeline() { return OFFTAKERS },
    getCapitalSnapshot() { return CAPITAL },
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
