import type { PlantTelemetry, EnvTelemetry, ComplianceLedger } from '../types/telemetry'

/* ─── Seed / Static Data ─────────────────────────────────────────────────── */

export const BATCHES: ComplianceLedger[] = [
  {
    batch_id: 'BATCH-MREC-8X9',
    batch_date: '2026-04-06T03:00:00Z',
    tonnage_kg: 487,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: true,
    carbon_intensity: {
      value: 2.14,
      tier: 'Premium',
      vs_chinese_baseline: 84,
    },
    molecular_timeline: [
      {
        step: 'Extraction',
        description: 'IAC ore excavated — Caldeira Site, Block 14-C, Poços de Caldas, MG, Brazil',
        timestamp: '2026-04-05T06:12:00Z',
        status: 'verified',
        coordinates: { lat: -21.795, lng: -46.567 },
        hash: '0x4f3a...d92c',
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.3. Recovery: 71% Magnetic REO',
        timestamp: '2026-04-05T09:45:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x7b1e...a3f1',
      },
      {
        step: 'Precipitation',
        description: 'Mixed Rare Earth Carbonate (MREC) precipitated. Grade >90% TREO, <2% impurity',
        timestamp: '2026-04-05T14:20:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x2c9d...e7b0',
      },
      {
        step: 'FJH Separation',
        description: 'Flash Joule Heating separation. 80%+ LREE removal. 81% Tb recovery.',
        timestamp: '2026-04-05T18:30:00Z',
        status: 'verified',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x9a4f...c21d',
      },
      {
        step: 'Quality Assurance',
        description: 'Inline XRF analysis. TREO grade: 91.4%. Certificate issued.',
        timestamp: '2026-04-05T21:00:00Z',
        status: 'active',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x1d8b...f49a',
      },
      {
        step: 'Export Logistics',
        description: 'Containerized MREC — Port of Santos, SP. MRS Logística rail connection.',
        timestamp: '2026-04-07T08:00:00Z',
        status: 'pending',
        coordinates: { lat: -23.960, lng: -46.333 },
      },
      {
        step: 'Ucore SMC Delivery',
        description: 'Louisiana Strategic Metals Complex — oxide production for US DoD supply chain.',
        timestamp: '2026-04-14T12:00:00Z',
        status: 'pending',
        coordinates: { lat: 30.391, lng: -91.028 },
      },
    ],
    offtake_destination: 'Ucore Rare Metals — Louisiana SMC, USA',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant', 'IRA Rule-of-Origin Certified'],
  },
  {
    batch_id: 'BATCH-MREC-7W2',
    batch_date: '2026-04-04T22:00:00Z',
    tonnage_kg: 512,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: true,
    carbon_intensity: {
      value: 2.08,
      tier: 'Premium',
      vs_chinese_baseline: 84,
    },
    molecular_timeline: [
      {
        step: 'Extraction',
        description: 'IAC ore excavated — Caldeira Site, Block 12-A',
        timestamp: '2026-04-03T07:00:00Z',
        status: 'verified',
        coordinates: { lat: -21.793, lng: -46.565 },
        hash: '0x5e2a...b11c',
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.5.',
        timestamp: '2026-04-03T11:00:00Z',
        status: 'verified',
        hash: '0x8c4d...e29f',
      },
      {
        step: 'Precipitation',
        description: 'MREC precipitated. Grade 90.8% TREO.',
        timestamp: '2026-04-03T15:30:00Z',
        status: 'verified',
        hash: '0x3f7b...a80d',
      },
      {
        step: 'FJH Separation',
        description: 'FJH cycle complete. Tb recovery: 79%.',
        timestamp: '2026-04-03T20:00:00Z',
        status: 'verified',
        hash: '0xb2c1...d44e',
      },
      {
        step: 'Quality Assurance',
        description: 'TREO grade: 90.8%. Certificate issued.',
        timestamp: '2026-04-03T23:00:00Z',
        status: 'verified',
        hash: '0x6a9e...f73b',
      },
      {
        step: 'Export Logistics',
        description: 'Shipped to Neo Performance Materials — Estonia, EU.',
        timestamp: '2026-04-05T06:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xd4f0...9c1a',
      },
      {
        step: 'EU DBP Issued',
        description: 'Digital Battery Passport issued. QR linked. Catena-X registered.',
        timestamp: '2026-04-06T00:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xe7c3...2b5f',
      },
    ],
    offtake_destination: 'Neo Performance Materials — Narva, Estonia (EU)',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'EU DBP Reg 2023/1542', 'Catena-X Registered'],
  },
]

export const INITIAL_PLANT_TELEMETRY: PlantTelemetry = {
  timestamp: new Date().toISOString(),
  flow_metrics: {
    in_liters_sec: 142.3,
    out_liters_sec: 7.1,
    recirculation_pct: 95.8,
  },
  leaching_circuit: {
    ph_level: 4.41,
    ammonium_sulfate_ml_min: 284,
  },
  fjh_separation: {
    power_draw_kw: 18.4,
    energy_savings_pct: 87,
  },
  output: {
    treo_grade_pct: 91.4,
    mrec_kg_hr: 62.5,
    ndpr_ratio_pct: 22.5,
  },
}

export const INITIAL_ENV_TELEMETRY: EnvTelemetry = {
  timestamp: new Date().toISOString(),
  aquifer: {
    sensors: [
      { sensor_id: 'PIZ-N01', label: 'North Sector', depth_meters: 18.4, baseline_meters: 18.2, status: 'Normal', lat: -21.780, lng: -46.560 },
      { sensor_id: 'PIZ-C02', label: 'Central Site', depth_meters: 21.7, baseline_meters: 21.5, status: 'Normal', lat: -21.797, lng: -46.568 },
      { sensor_id: 'PIZ-S03', label: 'South Border', depth_meters: 16.2, baseline_meters: 16.1, status: 'Normal', lat: -21.815, lng: -46.575 },
      { sensor_id: 'PIZ-E04', label: 'East Margin',  depth_meters: 19.8, baseline_meters: 19.2, status: 'Warning', lat: -21.790, lng: -46.545 },
    ],
  },
  water_quality: {
    sulfate_ppm: 142,
    nitrate_ppm: 28,
    ph_groundwater: 7.2,
  },
  legacy_infrastructure: {
    radiation_usv_h: 0.14,
    udc_status: 'Normal',
  },
  springs: Array.from({ length: 98 }, (_, i) => ({
    id: `SPR-${String(i + 1).padStart(3, '0')}`,
    status: i < 82 ? 'Active' : i < 94 ? 'Reduced' : 'Suppressed',
  })) as EnvTelemetry['springs'],
}

/* ─── Financial data for Executive view ─────────────────────────────────── */
export const PROJECT_FINANCIALS = {
  npv_pretax_consensus_m: 821,
  npv_pretax_forecast_m: 1985,
  npv_posttax_consensus_m: 488,
  npv_posttax_forecast_m: 1256,
  irr_pretax_consensus_pct: 28,
  irr_pretax_forecast_pct: 39,
  irr_posttax_consensus_pct: 21,
  irr_posttax_forecast_pct: 31,
  capex_m: 443,
  payback_yrs: 3,
  lom_fcf_m: 2000,
  opex_per_kg: 8.91,
  ndpr_opex: 21.80,
  annual_treo_t: 13584,
  annual_ndpr_t: 4228,
  annual_dytb_t: 130,
  lom_treo_t: 271687,
  mine_life_years: 20,
  throughput_mtpa: 6.0,
  exim_usd_m: 350,
  efa_aud_m: 70,
  /* Legacy convenience aliases for backward compatibility */
  npv_low_m: 821,
  npv_high_m: 1300,
  irr_pct: 36,
}

export const MARKET_PRICES = {
  spot_ndpr_kg:    65,
  green_ndpr_kg:   94,
  spot_dytb_kg:   850,
  green_dytb_kg: 1180,
}

export const BOARD_VALUE_AT_RISK = [
  {
    label: 'Value At Risk',
    value: '$2.0B',
    sub: 'LOM free cash flow exposed to permitting and trade-compliance friction',
    color: '#FF4D4D',
  },
  {
    label: 'Permitting Bottleneck',
    value: 'LI 2026',
    sub: 'Installation license readiness hinges on cumulative plateau impact evidence',
    color: '#F5A623',
  },
  {
    label: 'Offtake Conversion',
    value: '2 anchors',
    sub: 'Ucore and Neo require trusted, machine-readable compliance proof',
    color: '#00D4C8',
  },
  {
    label: 'Pilot To Scale',
    value: '25 kg/h -> 6.0 Mtpa',
    sub: 'Board needs a visible digital path from pilot credibility to commercial scale',
    color: '#7C5CFC',
  },
] as const

export const PREDICTIVE_HYDROLOGY_SCENARIOS = [
  {
    horizon: '2030 drought case',
    drought_index: 0.42,
    recirculation_pct: 95.2,
    spring_preservation_pct: 97,
    active_springs: 95,
    sulfate_guardband_ppm: 78,
    permitting_signal: 'Copam-ready',
    recommendation: 'Maintain dry-stacking and current drawdown caps.',
    status: 'stable',
  },
  {
    horizon: '2040 severe dry cycle',
    drought_index: 0.58,
    recirculation_pct: 95.8,
    spring_preservation_pct: 95,
    active_springs: 93,
    sulfate_guardband_ppm: 61,
    permitting_signal: 'Monitor closely',
    recommendation: 'Add contingency wells and seasonal pumping throttles.',
    status: 'watch',
  },
  {
    horizon: '2050 plateau stress test',
    drought_index: 0.71,
    recirculation_pct: 96.4,
    spring_preservation_pct: 93,
    active_springs: 91,
    sulfate_guardband_ppm: 44,
    permitting_signal: 'Needs mitigation package',
    recommendation: 'Pre-negotiate adaptive operating envelope before LI hearing.',
    status: 'action',
  },
] as const

export const SCALE_UP_PATHWAY = {
  pilot_name: 'CIP pilot circuit',
  pilot_throughput_kg_hr: 25,
  current_digital_coverage_pct: 91,
  commercial_target_mtpa: 6.0,
  water_recirculation_target_pct: 95,
  springs_monitored: 98,
  board_message: 'Use pilot telemetry and mocked predictive scenarios to prove Caldeira can scale without losing environmental legitimacy.',
}

export const REAGENT_PROVENANCE = {
  material: 'Ammonium sulfate',
  supplier: 'AdvanSix / Allied Sulfates Desk',
  origin_country: 'United States',
  export_port: 'Houston',
  incoterm: 'FOB Santos',
  lot_id: 'AS-ALLY-0426-17',
  shipment_mode: 'Bulk vessel -> Santos -> bonded truck',
  carbon_intensity_kg: 0.94,
  sanctions_screening: 'Clear',
  sovereign_alignment: 'Allied origin',
  traceability_status: 'Verified',
  board_risk: 'Input provenance can preserve or destroy the green premium before ore ever leaves Caldeira.',
}

export const API_HANDOFFS = [
  {
    system: 'US CBP Filing',
    endpoint: 'POST /v1/customs/us-cbp/attestations',
    payload: 'Digital origin affidavit + FEOC score + carbon intensity',
    status: 'delivered',
    latency_ms: 420,
    last_sync: '2026-04-06T03:14:00Z',
  },
  {
    system: 'Ucore SAP SMC',
    endpoint: 'POST /v1/partners/ucore/sap-batch-ledger',
    payload: 'Batch passport + assay + chain-of-custody hash',
    status: 'delivered',
    latency_ms: 610,
    last_sync: '2026-04-06T03:15:26Z',
  },
  {
    system: 'Neo Passport Inbox',
    endpoint: 'POST /v1/partners/neo/eu-dbp',
    payload: 'QR-ready battery passport bundle',
    status: 'queued',
    latency_ms: 890,
    last_sync: '2026-04-06T03:17:12Z',
  },
  {
    system: 'Board Audit Vault',
    endpoint: 'GET /v1/audit/caldera-risk-room',
    payload: 'Permit pack + hydrology scenarios + immutable event log',
    status: 'verified',
    latency_ms: 180,
    last_sync: '2026-04-06T03:18:40Z',
  },
] as const

export const CYBER_TRUST_PILLARS = [
  {
    title: 'Zero-trust edge boundary',
    detail: 'Plant gateways sign sensor payloads before forwarding any telemetry into the trust layer.',
    status: 'Ready for pilot',
  },
  {
    title: 'Immutable event lineage',
    detail: 'Every passport event, assay update, and API handoff is anchored to a tamper-evident chain.',
    status: 'Board-safe narrative',
  },
  {
    title: 'Jurisdictional sovereignty',
    detail: 'Prototype story assumes allied-region hosting and customer-controlled export domains.',
    status: 'Hosting policy defined',
  },
  {
    title: 'Audit-ready controls',
    detail: 'Role-based access, signed webhooks, and retention logs map to SOC 2 style control language.',
    status: 'Mock brief complete',
  },
] as const

export const DEAL_SCENARIOS = [
  {
    title: 'Paid Pilot -> Enterprise SaaS',
    tag: 'Recommended starting ask',
    economics: '$10k setup + 90-day pilot + 3-year platform conversion',
    rationale: 'Meteoric buys commodity hardware, Aether supplies the trust and automation layer.',
    board_outcome: 'Fastest path to validate value without cap-table change.',
    status: 'low-friction',
  },
  {
    title: 'Strategic Investment',
    tag: 'Partnership route',
    economics: '$500k-$1M seed check for 10-20% equity + pilot funding',
    rationale: 'Meteoric secures preferred pricing, exclusivity in Minas, and upside in the platform valuation.',
    board_outcome: 'Aligns incentives while keeping optionality open.',
    status: 'strategic',
  },
  {
    title: 'Full Acquisition',
    tag: 'Moat route',
    economics: 'Acquire team + IP as internal digital compliance division',
    rationale: 'Locks the trade-compliance moat inside Caldeira and keeps rivals from accessing the stack.',
    board_outcome: 'Highest control, highest commitment.',
    status: 'transformational',
  },
] as const

export const BOARD_NARRATIVE = {
  board_prompt: 'Can Meteoric convert pilot metallurgy into licensable, exportable, board-defensible cash flow before 2027?',
  partnership_prompt: 'Pilot, invest, or acquire: choose the structure that turns compliance into a moat.',
}

/* ─── Pilot Plant Performance (Feb 2026 results) ──────────────────────── */
export const PILOT_PLANT_PERFORMANCE = {
  nameplate_kg_day: 2.0,
  peak_kg_day: 2.6,
  mrec_mreo_pct: 32.7,
  mrec_dytb_pct: 1.0,
  recoveries: [
    { element: 'Nd', pilot_pct: 70, ansto_pct: 70 },
    { element: 'Pr', pilot_pct: 71, ansto_pct: 71 },
    { element: 'Tb', pilot_pct: 61, ansto_pct: 57 },
    { element: 'Dy', pilot_pct: 56, ansto_pct: 49 },
  ],
  avg_magnet_recovery_pct: 70,
  status: 'Operational — providing samples to offtake partners for product qualification',
} as const

/* ─── Uranium & Thorium Safety ─────────────────────────────────────────── */
export const U_TH_SAFETY = {
  primary_mineral: 'Bastnaesite (REE)CO₃F',
  u_th_profile: 'Very low — bastnaesite structure contains minimal U/Th',
  solubilization: 'U/Th do not solubilize at pH 4.0 salt-wash process',
  mrec_classification: 'Safe for international transport and handling',
  radioactive_tailings: false,
  advantage_vs_hardrock: 'No acid baking or caustic cracking required — avoids radioactive concentrate issues common in monazite/bastnäsite hard-rock deposits',
} as const

/* ─── Project Timeline / Milestones ────────────────────────────────────── */
export const PROJECT_TIMELINE = [
  { milestone: 'LP Approved', date: 'Dec 2025', status: 'completed' as const, detail: 'Unanimous COPAM vote Dec 19, 2025' },
  { milestone: 'Pilot Plant Online', date: 'Dec 2025', status: 'completed' as const, detail: 'Innovation & Research Center, Poços de Caldas' },
  { milestone: 'LI Application', date: 'Q1 2026', status: 'active' as const, detail: 'Installation license lodged with SUPRAM' },
  { milestone: 'DFS Completion', date: 'Mid 2026', status: 'pending' as const, detail: 'Ausenco-led Definitive Feasibility Study' },
  { milestone: 'LI Approval', date: 'Jun 2026', status: 'pending' as const, detail: 'Construction clearance target' },
  { milestone: 'Final Investment Decision', date: 'H2 2026', status: 'pending' as const, detail: 'Board FID following DFS and LI' },
  { milestone: 'Construction Start', date: '2027', status: 'pending' as const, detail: 'EXIM US$350M + EFA A$70M funding secured' },
  { milestone: 'First Production', date: '2028', status: 'pending' as const, detail: '6.0 Mtpa throughput · 13,584 tpa TREO' },
] as const

/* ─── Resource Classification Breakdown ────────────────────────────────── */
export const RESOURCE_CLASSIFICATION = {
  global_bt: 1.5,
  global_treo_ppm: 2359,
  measured_mt: 37,
  measured_treo_ppm: 2983,
  mi_mt: 666,
  mi_treo_ppm: 2685,
  inferred_mt: 834,
  mreo_avg_pct: 24,
  deposits_count: 7,
  drill_holes_total: 750,
} as const

export type DepositStatus = 'measured' | 'indicated' | 'inferred' | 'exploration'

export interface DepositRecord {
  id: string
  name: string
  status: DepositStatus
  treo_ppm: number
  mreo_pct: number
  tonnage_mt: number
  clay_depth_avg_m: number
  clay_depth_max_m: number
  area_km2: number
  dimensions: string
  orientation: string
  resource_note: string
  /** Center coordinates [lon, lat] for map fly-to */
  center: [number, number]
}

export const DEPOSIT_DATA: DepositRecord[] = [
  {
    id: 'capao-do-mel',
    name: 'Capão do Mel',
    status: 'measured',
    treo_ppm: 3034,
    mreo_pct: 24,
    tonnage_mt: 85,
    clay_depth_avg_m: 23.4,
    clay_depth_max_m: 50,
    area_km2: 9.9,
    dimensions: '2,600 × 3,800 m',
    orientation: 'NE-SW',
    resource_note: 'High-grade core 36 Mt @ 4,345 ppm TREO. First mining area in PFS 20-yr plan.',
    center: [-46.565, -21.848],
  },
  {
    id: 'soberbo',
    name: 'Soberbo',
    status: 'indicated',
    treo_ppm: 2601,
    mreo_pct: 26,
    tonnage_mt: 229,
    clay_depth_avg_m: 16.9,
    clay_depth_max_m: 77.4,
    area_km2: 9.9,
    dimensions: '2,600 × 3,800 m',
    orientation: 'NE-SW',
    resource_note: 'Highest-grade hub: 229 Mt @ 2,601 ppm TREO. MREO above 24% project average. Shallow depth favourable for OpEx.',
    center: [-46.615, -21.882],
  },
  {
    id: 'figueira',
    name: 'Figueira',
    status: 'indicated',
    treo_ppm: 2480,
    mreo_pct: 23,
    tonnage_mt: 44,
    clay_depth_avg_m: 28.2,
    clay_depth_max_m: 62.5,
    area_km2: 3.1,
    dimensions: '2,600 × 1,200 m',
    orientation: 'N-S',
    resource_note: 'Included in 20-year mine plan. Updated resources improve DFS financial metrics.',
    center: [-46.590, -21.818],
  },
  {
    id: 'barra-do-pacu',
    name: 'Barra do Pacu',
    status: 'indicated',
    treo_ppm: 2204,
    mreo_pct: 22,
    tonnage_mt: 389,
    clay_depth_avg_m: 29.2,
    clay_depth_max_m: 50,
    area_km2: 7.6,
    dimensions: '1,900 × 4,000 m',
    orientation: 'N-S',
    resource_note: 'Maiden resource Apr 2025. Southern extension of Capão do Mel. High-grade: 32 Mt @ 4,130 ppm.',
    center: [-46.555, -21.878],
  },
  {
    id: 'agostinho',
    name: 'Agostinho',
    status: 'exploration',
    treo_ppm: 5200,
    mreo_pct: 30,
    tonnage_mt: 0,
    clay_depth_avg_m: 0,
    clay_depth_max_m: 24,
    area_km2: 5.0,
    dimensions: '~2,000 × 2,500 m',
    orientation: 'N-S',
    resource_note: '116 holes. Peak 19,183 ppm TREO. MREO up to 38% — highest in project. MRE pending.',
    center: [-46.520, -21.778],
  },
  {
    id: 'cupim-vermelho-norte',
    name: 'Cupim Vermelho Norte',
    status: 'inferred',
    treo_ppm: 2200,
    mreo_pct: 24,
    tonnage_mt: 340,
    clay_depth_avg_m: 20,
    clay_depth_max_m: 55,
    area_km2: 13.0,
    dimensions: '2,600 × 5,000 m',
    orientation: 'NW-SE',
    resource_note: 'Largest resource block by area. Part of 566 Mt northern resource @ 2,200 ppm TREO.',
    center: [-46.5855, -21.7229],
  },
  {
    id: 'dona-maria',
    name: 'Dona Maria 1 & 2',
    status: 'inferred',
    treo_ppm: 2100,
    mreo_pct: 23,
    tonnage_mt: 226,
    clay_depth_avg_m: 18,
    clay_depth_max_m: 45,
    area_km2: 2.4,
    dimensions: '500 × 4,800 m',
    orientation: 'E-W',
    resource_note: 'Narrow high-grade corridor. Part of 566 Mt northern resource. Near-term operations potential.',
    center: [-46.546, -21.7485],
  },
]
