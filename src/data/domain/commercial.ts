import type {
  OfftakerRecord,
  CapitalSnapshot,
  DSCRProjection,
  DrawdownMilestone,
  PricingModel,
  MarketSizing,
  DFSWorkstream,
  RegulatoryEntry,
} from '../../services/dataService'

export const OFFTAKERS: OfftakerRecord[] = [
  { id: 'ucore', name: 'Ucore Rare Metals', location: 'Louisiana SMC, USA', stage: 'binding', volumeCommitment: '2,000 tpa TREO', qualificationStatus: 'Qualification samples delivered — metallurgical testing in progress', deliverySchedule: 'H2 2028 (aligned with first production)', product: 'MREC (Mixed Rare Earth Carbonate)', notes: 'Strategic partner for US DoD supply chain. EXIM-backed facility.' },
  { id: 'neo', name: 'Neo Performance Materials', location: 'Narva, Estonia (EU)', stage: 'loi', volumeCommitment: '1,500 tpa TREO', qualificationStatus: 'LOI executed — awaiting DFS completion for binding terms', deliverySchedule: 'H1 2029', product: 'MREC → separated oxides', notes: 'EU Digital Battery Passport integration active. Catena-X registered.' },
]

export const CAPITAL: CapitalSnapshot = {
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

export const PRICING_MODEL: PricingModel = {
  model_type: 'Per-project SaaS + metered AI',
  tiers: [
    { name: 'Pilot', price_usd_mo: 2500, includes: '1 project, 5 users, 10k AI queries/mo, standard map tiles, email support', target: 'PFS-stage explorers, junior miners evaluating digital twin' },
    { name: 'Growth', price_usd_mo: 8500, includes: '3 projects, 25 users, 50k AI queries/mo, premium map tiles, priority support, API access', target: 'DFS-through-construction operators with multiple stakeholders' },
    { name: 'Enterprise', price_usd_mo: null, includes: 'Unlimited projects/users, custom AI model tuning, SSO/RBAC, dedicated CSM, SLA 99.9%', target: 'Multi-asset operators, ECA/DFI compliance mandates' },
  ],
  cost_components: [
    { component: 'Hosting (Vercel + Railway)', est_mo: 340, notes: 'Pro tiers, scales with traffic' },
    { component: 'AI tokens (LLM provider)', est_mo: 280, notes: '~40k queries × $7/M tokens' },
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

export const MARKET_SIZING: MarketSizing = {
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

export const DSCR_PROJECTIONS: DSCRProjection[] = [
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

export const DRAWDOWN_SCHEDULE: DrawdownMilestone[] = [
  { milestone: 'DFS Completion', target_date: '2026-06-30', amount_m: 15, cumulative_m: 28, status: 'in_progress', cp_ref: 'CP-01' },
  { milestone: 'FID Approved', target_date: '2026-09-30', amount_m: 50, cumulative_m: 78, status: 'pending', cp_ref: 'CP-03' },
  { milestone: 'Construction Start', target_date: '2027-01-01', amount_m: 120, cumulative_m: 198, status: 'pending', cp_ref: null },
  { milestone: 'Equipment Procurement', target_date: '2027-06-01', amount_m: 95, cumulative_m: 293, status: 'pending', cp_ref: null },
  { milestone: 'Commissioning', target_date: '2027-10-01', amount_m: 80, cumulative_m: 373, status: 'pending', cp_ref: null },
  { milestone: 'First Ore', target_date: '2028-01-01', amount_m: 50, cumulative_m: 423, status: 'pending', cp_ref: null },
  { milestone: 'Ramp-up Reserve', target_date: '2028-06-01', amount_m: 20, cumulative_m: 443, status: 'pending', cp_ref: null },
]

export const DFS_WORKSTREAMS: DFSWorkstream[] = [
  { id: 'DFS-01', name: 'Mining & Reserves', lead: 'Ausenco', progress_pct: 85, status: 'on_track', target_date: '2026-05-15' },
  { id: 'DFS-02', name: 'Process Engineering', lead: 'Ausenco / Meteoric', progress_pct: 72, status: 'on_track', target_date: '2026-05-30' },
  { id: 'DFS-03', name: 'Infrastructure & Logistics', lead: 'Ausenco', progress_pct: 60, status: 'at_risk', target_date: '2026-06-15' },
  { id: 'DFS-04', name: 'Environmental & Permitting', lead: 'Meteoric / FEAM', progress_pct: 55, status: 'at_risk', target_date: '2026-06-30' },
  { id: 'DFS-05', name: 'Financial Model', lead: 'Ausenco / CFO', progress_pct: 45, status: 'on_track', target_date: '2026-06-30' },
]

export const REGULATORY_LOG: RegulatoryEntry[] = [
  { id: 'REG-01', body: 'COPAM', type: 'LP Hearing', date: '2025-12-19', status: 'approved', detail: 'Unanimous approval of Preliminary License. No restrictions imposed.', evidenceDocId: 'DOC-COPAM-LP-2025-12' },
  { id: 'REG-02', body: 'SUPRAM', type: 'LI Application', date: '2026-02-14', status: 'submitted', detail: 'Installation License application lodged. FEAM technical review initiated.', evidenceDocId: 'PORTAL-SUPRAM-LI-2026-0214', nextMilestone: 'FEAM technical opinion (target 45 days)' },
  { id: 'REG-03', body: 'FEAM', type: 'Technical Review', date: '2026-03-20', status: 'in_review', detail: 'Environmental conditions review. Additional hydrological data requested — submitted Apr 1.', evidenceDocId: 'DOC-FEAM-HYDRO-2026-Q1', nextMilestone: 'Close data request loop — see AUD-010' },
  { id: 'REG-04', body: 'MPF', type: 'Cumulative EIA Request', date: '2026-01-15', status: 'in_review', detail: 'Federal prosecutor requested cumulative environmental impact assessment for plateau-wide operations.', evidenceDocId: 'MPF-OFF-2026-0115-CUM-EIA', nextMilestone: 'Issuer response package + hydro annex (illustrative UI until filed)' },
  { id: 'REG-05', body: 'INB/CNEN', type: 'Radiation Clearance', date: '2026-03-01', status: 'approved', detail: 'UDC legacy site monitoring protocol accepted. Operational clearance for 3 km buffer.', evidenceDocId: 'CNEN-PROT-UDC-2026-03' },
  { id: 'REG-06', body: 'IBAMA', type: 'APA Consultation', date: '2026-04-02', status: 'pending', detail: 'APA Pedra Branca buffer zone consultation scheduled. Pre-submission completed.', evidenceDocId: 'IBAMA-APA-PB-PRESUB-2026-04', nextMilestone: 'Formal consultation session' },
]
