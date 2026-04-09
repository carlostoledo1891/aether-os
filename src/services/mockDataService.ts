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
  DSCRProjection,
  DrawdownMilestone,
  PricingModel,
  MarketSizing,
  DFSWorkstream,
  RegulatoryEntry,
  BenchmarkOperator,
  AuditEvent,
  ESGFramework,
  LithologySummary,
  StakeholderRegister,
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
        hint: 'Open-Meteo public weather API (ERA5 reanalysis)',
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

/* ─── Pricing Model ────────────────────────────────────────────────────── */
const PRICING_MODEL: PricingModel = {
  model_type: 'Per-project SaaS + metered AI',
  tiers: [
    { name: 'Pilot', price_usd_mo: 2500, includes: '1 project, 5 users, 10k AI queries/mo, standard map tiles, email support', target: 'PFS-stage explorers, junior miners evaluating digital twin' },
    { name: 'Growth', price_usd_mo: 8500, includes: '3 projects, 25 users, 50k AI queries/mo, premium map tiles, priority support, API access', target: 'DFS-through-construction operators with multiple stakeholders' },
    { name: 'Enterprise', price_usd_mo: null, includes: 'Unlimited projects/users, custom AI model tuning, SSO/RBAC, dedicated CSM, SLA 99.9%', target: 'Multi-asset operators, ECA/DFI compliance mandates' },
  ],
  cost_components: [
    { component: 'Hosting (Vercel + Railway)', est_mo: 340, notes: 'Pro tiers, scales with traffic' },
    { component: 'AI tokens (Google Gemini)', est_mo: 280, notes: '~40k queries × $7/M tokens' },
    { component: 'Map tiles (MapTiler)', est_mo: 120, notes: 'Satellite + topo layers, usage-based' },
    { component: 'Data integration (API + enrichers)', est_mo: 0, notes: 'Included in platform; LAPOC/OPC-UA custom' },
    { component: 'Support & maintenance', est_mo: 500, notes: 'Prorated across customer base' },
  ],
  tco_year1: {
    pilot_usd: 30000,
    growth_usd: 102000,
    enterprise_usd: 'Custom — typically $180k-$350k based on scope',
    note: 'Excludes one-time onboarding ($5k-$15k) and custom integration work',
  },
}

/* ─── Market Sizing ────────────────────────────────────────────────────── */
const MARKET_SIZING: MarketSizing = {
  tam: {
    label: 'Global Digital Mining & Smart Mining Technology',
    value_usd_b: 18.8, year: 2026, forecast_usd_b: 31.9, forecast_year: 2031, cagr_pct: 11.2,
    source: 'Mordor Intelligence "Smart Mining Market" (2026 $18.77B → 2031 $31.86B, CAGR 11.16%); Grand View Research "Digital Mining Market" (2024 $9.39B → 2030 $18.11B, CAGR 9.8%)',
    report_date: '2025', methodology: 'Composite of smart mining and digital mining forecasts covering automation, analytics, digital twins, cybersecurity, and AI.',
  },
  sam: {
    label: 'Critical Minerals Compliance & Traceability SaaS',
    value_usd_b: 1.6, year: 2025, forecast_usd_b: 5.2, forecast_year: 2033, cagr_pct: 14.2,
    source: 'Dataintelo "Critical Mineral Traceability Market" ($3.8B total, software 42.5%); Growth Market Reports "Conflict Minerals Compliance Software" ($1.21B → $2.51B, CAGR 8.7%)',
    report_date: '2025', methodology: 'Software component of critical mineral traceability market, cross-referenced with conflict minerals compliance software.',
  },
  som: {
    label: 'REE Projects in Allied Jurisdictions with Active Compliance Requirements',
    value_usd_m: 15, year: 2026, forecast_usd_m: 45, forecast_year: 2030,
    source: 'Bottom-up: 15 identified REE projects (Brazil, Australia, USA, Canada) × Vero Growth tier pricing ($102k/yr)',
    report_date: '2026-Q2', methodology: 'Bottom-up from public project databases (ASX, TSX, SEC filings). Targets operators with active FEOC/IRA/EU DBP compliance.',
  },
}

/* ─── DSCR Projections ─────────────────────────────────────────────────── */
const DSCR_PROJECTIONS: DSCRProjection[] = [
  { year: 1, bear: 0.8, consensus: 1.2, bull: 1.8 },
  { year: 2, bear: 1.0, consensus: 1.5, bull: 2.3 },
  { year: 3, bear: 1.2, consensus: 1.9, bull: 2.8 },
  { year: 4, bear: 1.3, consensus: 2.1, bull: 3.1 },
  { year: 5, bear: 1.4, consensus: 2.3, bull: 3.4 },
  { year: 6, bear: 1.5, consensus: 2.4, bull: 3.5 },
  { year: 7, bear: 1.5, consensus: 2.5, bull: 3.6 },
  { year: 8, bear: 1.6, consensus: 2.5, bull: 3.7 },
  { year: 9, bear: 1.6, consensus: 2.6, bull: 3.7 },
  { year: 10, bear: 1.7, consensus: 2.6, bull: 3.8 },
]

/* ─── Drawdown Schedule ────────────────────────────────────────────────── */
const DRAWDOWN_SCHEDULE: DrawdownMilestone[] = [
  { milestone: 'DFS Completion', target_date: '2026-06-30', amount_m: 15, cumulative_m: 28, status: 'in_progress', cp_ref: 'CP-01' },
  { milestone: 'FID Approved', target_date: '2026-09-30', amount_m: 50, cumulative_m: 78, status: 'pending', cp_ref: 'CP-03' },
  { milestone: 'Construction Start', target_date: '2027-01-01', amount_m: 120, cumulative_m: 198, status: 'pending', cp_ref: null },
  { milestone: 'Equipment Procurement', target_date: '2027-06-01', amount_m: 95, cumulative_m: 293, status: 'pending', cp_ref: null },
  { milestone: 'Commissioning', target_date: '2027-10-01', amount_m: 80, cumulative_m: 373, status: 'pending', cp_ref: null },
  { milestone: 'First Ore', target_date: '2028-01-01', amount_m: 50, cumulative_m: 423, status: 'pending', cp_ref: null },
  { milestone: 'Ramp-up Reserve', target_date: '2028-06-01', amount_m: 20, cumulative_m: 443, status: 'pending', cp_ref: null },
]

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
  { id: 'AUD-001', timestamp: '2026-04-06T08:00:00Z', type: 'system_event', actor: 'System', action: 'Vero instance started', detail: 'Production environment boot — all sensor feeds connected. Firmware v2.4.1.', hash: sha256Stub('AUD-001-system-start') },
  { id: 'AUD-002', timestamp: '2026-04-06T08:02:14Z', type: 'compliance_check', actor: 'System', action: 'FEOC compliance sweep completed', detail: 'Full supply chain re-verified against FEOC database v2026-04-05. 0 flagged entities. 47 suppliers checked.', hash: sha256Stub('AUD-002-feoc-sweep') },
  { id: 'AUD-003', timestamp: '2026-04-05T16:30:00Z', type: 'batch_created', actor: 'J. Santos (Process Eng.)', action: 'Batch BATCH-MREC-8X9 initiated', detail: 'MREC precipitation run started. Feed material from Capão do Mel pit. Target: 142 kg MREC.', hash: sha256Stub('AUD-003-batch-create'), relatedEntityId: 'BATCH-MREC-8X9' },
  { id: 'AUD-004', timestamp: '2026-04-05T14:12:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'pH exceedance alert triggered', detail: 'Leach circuit pH rose to 5.12, exceeding 5.0 threshold. Alert dispatched to on-call process engineer.', hash: sha256Stub('AUD-004-alert-ph'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-005', timestamp: '2026-04-05T14:58:00Z', type: 'alert_resolved', actor: 'J. Santos (Process Eng.)', action: 'pH exceedance alert resolved', detail: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4. Total response time: 46 min.', hash: sha256Stub('AUD-005-alert-resolve'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-006', timestamp: '2026-04-04T10:00:00Z', type: 'passport_issued', actor: 'Vero', action: 'Digital Battery Passport DBP-2026-0042 issued', detail: 'EU-compliant DBP JSON payload generated for batch BATCH-MREC-7W2. Hash anchored to permissioned ledger.', hash: sha256Stub('AUD-006-dbp-issue'), relatedEntityId: 'BATCH-MREC-7W2' },
  { id: 'AUD-007', timestamp: '2026-04-04T10:05:00Z', type: 'api_handoff', actor: 'Vero', action: 'DBP payload pushed to Ucore SAP', detail: 'Automated ABI pre-filing to US CBP. Digital Battery Passport synchronized to Ucore ERP via REST API. HTTP 200.', hash: sha256Stub('AUD-007-api-push'), relatedEntityId: 'ucore' },
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

/* ─── Lithology Summary ────────────────────────────────────────────────── */
const LITHOLOGY_SUMMARY: LithologySummary = {
  deposits: [
    { deposit: 'agostinho', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 14.5, total_holes: 121 },
    { deposit: 'soberbo', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.8, avg_saprolite_depth_m: 12.0, total_holes: 11 },
    { deposit: 'capao-do-mel', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.2, total_holes: 13 },
    { deposit: 'figueira', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 11.8, total_holes: 9 },
    { deposit: 'barra-do-pacu', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 14.0, total_holes: 6 },
    { deposit: 'cupim-vermelho-norte', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.3, avg_saprolite_depth_m: 15.1, total_holes: 5 },
    { deposit: 'cupim-vermelho-sul', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.8, total_holes: 5 },
    { deposit: 'dona-maria-1', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.7, avg_saprolite_depth_m: 12.4, total_holes: 7 },
    { deposit: 'dona-maria-2', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 14.2, total_holes: 4 },
    { deposit: 'cercado', dominant_lithology: 'fresh_phonolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 12.6, total_holes: 5 },
    { deposit: 'piao', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 13.5, total_holes: 5 },
    { deposit: 'coqueirinho', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.4, avg_saprolite_depth_m: 14.8, total_holes: 3 },
    { deposit: 'tamandua', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.0, total_holes: 3 },
    { deposit: 'fazenda-limoeiro', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 14.4, total_holes: 2 },
    { deposit: 'cipo', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.8, avg_saprolite_depth_m: 11.5, total_holes: 1 },
    { deposit: 'cipo-3', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.5, avg_saprolite_depth_m: 15.0, total_holes: 1 },
    { deposit: 'donana', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 12.8, total_holes: 1 },
    { deposit: 'pinheiro', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 13.6, total_holes: 1 },
    { deposit: 'pitangueira', dominant_lithology: 'saprolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 12.2, total_holes: 1 },
    { deposit: 'tatu', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.3, avg_saprolite_depth_m: 14.0, total_holes: 1 },
  ],
  lithology_types: ['laterite', 'saprolite', 'weathered_phonolite', 'fresh_phonolite', 'tinguaite', 'nepheline_syenite', 'alluvium'],
  stratigraphy_note: 'Caldeira alkaline complex: laterite cap → saprolite → weathered phonolite → fresh phonolite/nepheline syenite. Tinguaite dykes intersect locally.',
}

/* ─── Stakeholder Register ──────────────────────────────────────────────── */
const STAKEHOLDER_REGISTER: StakeholderRegister = {
  groups: [
    {
      group: 'Community',
      status: 'neutral',
      summary: 'Engagement active, LAPOC pending',
      items: [
        { label: 'Grievances', status: 'green', detail: '0 open / 3 total' },
        { label: 'Spring monitoring', status: 'amber', detail: 'Modeled' },
        { label: 'LAPOC status', status: 'amber', detail: 'Integration pending' },
        { label: 'Last community brief', status: 'green', detail: '2026-03-15', date: '2026-03-15' },
      ],
    },
    {
      group: 'Regulatory',
      status: 'neutral',
      summary: 'Mixed agency posture',
      items: [
        { label: 'FEAM', status: 'green', detail: 'Approved', date: '2025-12-01' },
        { label: 'MPF', status: 'amber', detail: 'EIA challenged', date: '2025-06-15' },
        { label: 'IGAM', status: 'violet', detail: 'Submitted', date: '2025-10-20' },
        { label: 'COPAM', status: 'muted', detail: 'Awaiting review', date: '2025-11-01' },
      ],
    },
    {
      group: 'Commercial',
      status: 'positive',
      summary: 'Pipeline active',
      items: [
        { label: 'Ucore', status: 'green', detail: '12,000 t/yr' },
        { label: 'Neo Performance', status: 'amber', detail: '8,000 t/yr' },
        { label: 'Toyota Tsusho', status: 'muted', detail: 'TBD' },
      ],
    },
    {
      group: 'ESG & Media',
      status: 'positive',
      summary: 'Readiness high',
      items: [
        { label: 'ESG coverage', status: 'green', detail: '77%' },
        { label: 'Provenance', status: 'green', detail: 'All data areas labeled' },
        { label: 'Demo readiness', status: 'green', detail: 'Disclaimers active · Hallucination tests passing' },
      ],
    },
  ],
  last_updated: '2026-04-09',
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
