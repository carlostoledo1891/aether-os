import type { PlantTelemetry, EnvTelemetry, ComplianceLedger, SpringTelemetry, SpringEvent } from '../types/telemetry'

export const SPRING_COUNT = 1092

/* ─── Domain Thresholds (single source of truth for alerts, ESG, and UI) ── */
export const THRESHOLDS = {
  sulfate_warning_ppm: 250,
  nitrate_warning_ppm: 50,
  radiation_critical_usv_h: 0.18,
  ph_low: 3.9,
  ph_high: 5.1,
  recirculation_warning_pct: 94,
} as const

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
        hash: '0x4f3a7c91b28e6d054a1f8c93d720eb4561cf9da8b53e271094f6a8d2e3c0d92c',
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.3. Recovery: 71% Magnetic REO',
        timestamp: '2026-04-05T09:45:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x7b1e4d9f2a8c63057e1b94a0d5f2c87136ea4b9d82c0f61573e9a4d8b2a3f1e0',
      },
      {
        step: 'Precipitation',
        description: 'Mixed Rare Earth Carbonate (MREC) precipitated. Grade >90% TREO, <2% impurity',
        timestamp: '2026-04-05T14:20:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x2c9d5e84f1a3b7602d4e91c8a6f0d35724be8c19f73a0652e4d1b98ca7f0e7b0',
      },
      {
        step: 'FJH Separation',
        description: 'Flash Joule Heating separation. 80%+ LREE removal. 81% Tb recovery.',
        timestamp: '2026-04-05T18:30:00Z',
        status: 'verified',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x9a4f1b7e3d2c86a0594e1f8b27d3c96041ea5f8b29d7c31a064e8f2b1a9fc21d',
      },
      {
        step: 'Quality Assurance',
        description: 'Inline XRF analysis. TREO grade: 91.4%. Certificate issued.',
        timestamp: '2026-04-05T21:00:00Z',
        status: 'active',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x1d8b3f6a2e7c940518d2b4a9c6e1f07835da9c2b4f6e180a73d5b92c4e8af49a',
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
        hash: '0x5e2a8b6c4d1f937028e4a9c1d3b7f06542ae8d1c9f3b7042e6d5a81b94c3b11c',
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.5.',
        timestamp: '2026-04-03T11:00:00Z',
        status: 'verified',
        hash: '0x8c4d2f1a6e9b73058d2c4a1f7e0b93d64528cf1a9e7b340862d5f18c4a7be29f',
      },
      {
        step: 'Precipitation',
        description: 'MREC precipitated. Grade 90.8% TREO.',
        timestamp: '2026-04-03T15:30:00Z',
        status: 'verified',
        hash: '0x3f7b9c2e1d4a860573e1f4b8a2c9d60741fe3b8c2d9a47061e5d4b28a9c1a80d',
      },
      {
        step: 'FJH Separation',
        description: 'FJH cycle complete. Tb recovery: 79%.',
        timestamp: '2026-04-03T20:00:00Z',
        status: 'verified',
        hash: '0xb2c14e8f3a7d960524e1b9f4c8d2a37061fb4e9c2a8d370615e4c1b8f29ad44e',
      },
      {
        step: 'Quality Assurance',
        description: 'TREO grade: 90.8%. Certificate issued.',
        timestamp: '2026-04-03T23:00:00Z',
        status: 'verified',
        hash: '0x6a9e1c4b2f8d7305a4e1c9b3d7f2a06841ec5b9a2d8f430716e5a4c1b39ef73b',
      },
      {
        step: 'Export Logistics',
        description: 'Shipped to Neo Performance Materials — Estonia, EU.',
        timestamp: '2026-04-05T06:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xd4f02e9c1a7b83064d2e1f9b4a8c73052e1da9c4b7f380261d5e4a9c8b1f9c1a',
      },
      {
        step: 'EU DBP Issued',
        description: 'Digital Battery Passport issued. QR linked. Catena-X registered.',
        timestamp: '2026-04-06T00:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xe7c31d4a2b9f86057e2c1a4d8b3f970624ae1c5d9b7f28031e4d5a2c8f912b5f',
      },
    ],
    offtake_destination: 'Neo Performance Materials — Narva, Estonia (EU)',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'EU DBP Reg 2023/1542', 'Catena-X Registered'],
  },
  {
    batch_id: 'BATCH-MREC-4K1',
    batch_date: '2026-03-10T08:00:00Z',
    tonnage_kg: 1850,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: false,
    carbon_intensity: {
      value: 3.1,
      tier: 'Premium',
      vs_chinese_baseline: 77,
    },
    molecular_timeline: [
      { step: 'Production', description: 'NdPr Oxide produced — Caldeira Plant, MG', timestamp: '2026-03-10T08:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 }, hash: '0xa3c9f17e8b2d4605913c8a4f7e2b0d96341ef5c8a2b9d7604e1f3a8c5d2be742' },
      { step: 'Quality Certified', description: 'Inline XRF + ICP-MS analysis. NdPr oxide grade certified.', timestamp: '2026-03-11T10:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 }, hash: '0xb7d2e84c1f9a730582e4d1b6a3c8f05927de1a4b8c9f370641e5d2a8c4b39f31' },
      { step: 'Export Cleared', description: 'Santos Port — export documentation filed and cleared.', timestamp: '2026-03-12T06:00:00Z', status: 'verified', coordinates: { lat: -23.95, lng: -46.33 }, hash: '0xc1a4b67e2d8f930541e3c9a8d5f2b074163ea8c5b2d9f71034e4a1c7b6f82d85' },
      { step: 'In Transit', description: 'Pacific crossing — container vessel en route to Japan.', timestamp: '2026-03-18T00:00:00Z', status: 'active', coordinates: { lat: 5.0, lng: -160.0 }, hash: '0xd9e7c34a1b8f620593e2d4c1a7f0b835264ea9c1b5d8f4071e3a2c9d6b854a12' },
      { step: 'ETA Destination', description: 'Shin-Etsu Chemical — Takefu, Japan. Final delivery.', timestamp: '2026-04-28T00:00:00Z', status: 'pending', coordinates: { lat: 35.90, lng: 136.17 } },
    ],
    offtake_destination: 'Shin-Etsu Chemical — Takefu, Japan',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant'],
  },
  {
    batch_id: 'BATCH-MREC-2A7',
    batch_date: '2026-02-03T08:00:00Z',
    tonnage_kg: 920,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: false,
    carbon_intensity: {
      value: 3.4,
      tier: 'Premium',
      vs_chinese_baseline: 75,
    },
    molecular_timeline: [
      { step: 'Production', description: 'Mixed REO produced — Caldeira Plant, MG', timestamp: '2026-02-03T08:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 }, hash: '0xe5f8a27c1d4b930682e1c9a3f7d2b06845ea1f8c2b9d47036e5a4c1d8b321b73' },
      { step: 'Quality Certified', description: 'Inline XRF analysis. Mixed REO grade certified.', timestamp: '2026-02-04T10:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 }, hash: '0xf2c9d74e1a3b860592e4c1d8a7f0b25736ea5c1b9d8f42071e3a4c2d6b978e46' },
      { step: 'Export Cleared', description: 'Santos Port — export documentation filed and cleared.', timestamp: '2026-02-05T06:00:00Z', status: 'verified', coordinates: { lat: -23.95, lng: -46.33 }, hash: '0xa8b1e47c2d9f530641e3c8a1d5f4b073862ea9c4b1d7f80531e2a3c9d6f85c29' },
      { step: 'Customs Cleared', description: 'Long Beach, CA — US customs clearance completed.', timestamp: '2026-02-20T12:00:00Z', status: 'verified', coordinates: { lat: 33.76, lng: -118.19 }, hash: '0xb3d6f91e4a7c820563e2d1c8a9f0b47531ea4c2b5d8f71093e1a3c4d6b297a51' },
      { step: 'Delivered', description: 'MP Materials — Mountain Pass, NV. Delivery confirmed.', timestamp: '2026-02-28T14:00:00Z', status: 'verified', coordinates: { lat: 35.47, lng: -115.53 }, hash: '0xc7e2a84b1d9f630582e3c4a1d7f0b96435ea1c8b2d5f49071e4a2c3d8b563d64' },
    ],
    offtake_destination: 'MP Materials — Mountain Pass, USA',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant', 'IRA Rule-of-Origin Certified'],
  },
]

const DEFAULT_SPRING_META = {
  monitoring_tier: 'modeled_inferred' as const,
  method: 'hydro_model_v1',
  data_sources: ['inferred'] as string[],
}

function springIdFromIndex(i: number): string {
  return `spring-${String(i + 1).padStart(4, '0')}`
}

/** Rich metadata for sentinel springs (GeoJSON ids); bulk springs use DEFAULT_SPRING_META */
const SENTINEL_SPRING_OVERRIDES: Record<string, Partial<Pick<SpringTelemetry, 'monitoring_tier' | 'method' | 'data_sources' | 'last_field_visit' | 'linked_sensor_id'>>> = {
  'spring-0001': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log', 'telemetry'], last_field_visit: '2026-03-18T14:00:00Z' },
  'spring-0002': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-N01', data_sources: ['telemetry', 'inferred'], linked_sensor_id: 'PIZ-N01' },
  'spring-0003': { monitoring_tier: 'direct', method: 'field_monthly_photo', data_sources: ['field_log'], last_field_visit: '2026-04-01T11:30:00Z' },
  'spring-0004': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-C02', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-C02' },
  'spring-0005': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-S03', data_sources: ['telemetry', 'field_log'], linked_sensor_id: 'PIZ-S03', last_field_visit: '2026-03-22T09:00:00Z' },
  'spring-0006': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-E04', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-E04' },
  'spring-0007': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log', 'telemetry'], last_field_visit: '2026-03-25T16:45:00Z' },
  'spring-0008': { monitoring_tier: 'modeled_inferred', method: 'hydro_model_v1+open_meteo_context', data_sources: ['inferred', 'open_meteo'] },
  'spring-0009': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-N01', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-N01' },
  'spring-0010': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log'], last_field_visit: '2026-03-28T13:20:00Z' },
  'spring-0011': { monitoring_tier: 'modeled_inferred', method: 'regional_baseflow_v2', data_sources: ['inferred'] },
  'spring-0012': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-C02', data_sources: ['telemetry', 'inferred'], linked_sensor_id: 'PIZ-C02' },
  'spring-0013': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log', 'telemetry'], last_field_visit: '2026-04-02T08:15:00Z' },
  'spring-0014': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-E04', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-E04' },
  'spring-0015': { monitoring_tier: 'modeled_inferred', method: 'hydro_model_v1', data_sources: ['inferred'] },
  'spring-0016': { monitoring_tier: 'direct', method: 'field_monthly_photo', data_sources: ['field_log'], last_field_visit: '2026-03-15T10:00:00Z' },
  'spring-0017': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-S03', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-S03' },
  'spring-0018': { monitoring_tier: 'modeled_inferred', method: 'hydro_model_v1+open_meteo_context', data_sources: ['inferred', 'open_meteo'] },
  'spring-0019': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log', 'telemetry'], last_field_visit: '2026-03-30T12:00:00Z' },
  'spring-0020': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-N01', data_sources: ['telemetry', 'field_log'], linked_sensor_id: 'PIZ-N01', last_field_visit: '2026-03-27T15:30:00Z' },
  'spring-0021': { monitoring_tier: 'modeled_inferred', method: 'regional_baseflow_v2', data_sources: ['inferred'] },
  'spring-0022': { monitoring_tier: 'direct', method: 'field_quarterly_orifice', data_sources: ['field_log'], last_field_visit: '2026-04-04T09:45:00Z' },
  'spring-0023': { monitoring_tier: 'sentinel_proxy', method: 'piezo_proxy:PIZ-C02', data_sources: ['telemetry'], linked_sensor_id: 'PIZ-C02' },
  'spring-0024': { monitoring_tier: 'modeled_inferred', method: 'hydro_model_v1', data_sources: ['inferred', 'telemetry'] },
}

export function buildInitialSprings(): SpringTelemetry[] {
  return Array.from({ length: SPRING_COUNT }, (_, i) => {
    const id = springIdFromIndex(i)
    const status: SpringTelemetry['status'] =
      i < 917 ? 'Active' : i < 1048 ? 'Reduced' : 'Suppressed'
    const ov = SENTINEL_SPRING_OVERRIDES[id]
    return {
      id,
      status,
      monitoring_tier: ov?.monitoring_tier ?? DEFAULT_SPRING_META.monitoring_tier,
      method: ov?.method ?? DEFAULT_SPRING_META.method,
      data_sources: ov?.data_sources ? [...ov.data_sources] : [...DEFAULT_SPRING_META.data_sources],
      last_field_visit: ov?.last_field_visit,
      linked_sensor_id: ov?.linked_sensor_id,
    }
  })
}

export const MOCK_SPRING_EVENTS: SpringEvent[] = [
  { springId: 'spring-0001', ts: '2026-03-18T14:00:00Z', type: 'field_visit', note: 'Quarterly flow — within seasonal band' },
  { springId: 'spring-0006', ts: '2026-03-25T08:00:00Z', type: 'sensor_proxy', note: 'PIZ-E04 drawdown correlated; spring class held Active→watch' },
  { springId: 'spring-0014', ts: '2026-03-24T11:00:00Z', type: 'model_refresh', note: 'Twin recalibrated after east-margin piezo stress' },
  { springId: 'spring-0002', ts: '2026-03-20T09:00:00Z', type: 'audit_note', note: 'CAR geometry verified against FBDS point' },
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
  springs: buildInitialSprings(),
  springEvents: MOCK_SPRING_EVENTS,
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
  ndpr_opex: 22,
  annual_treo_t: 13584,
  annual_ndpr_t: 4228,
  annual_dytb_t: 130,
  lom_treo_t: 271687,
  mine_life_years: 20,
  throughput_mtpa: 6.0,
  exim_usd_m: 350,
  efa_aud_m: 70,
}

export const MARKET_PRICES = {
  spot_ndpr_kg:    67,
  green_ndpr_kg:  135,
  spot_dytb_kg:   350,
  green_dytb_kg:  680,
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
    active_springs: 1059,
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
    active_springs: 1037,
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
    active_springs: 1016,
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
  springs_monitored: SPRING_COUNT,
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
    title: 'Zero-Trust Edge Gateways',
    detail: 'IoT gateways at Poços de Caldas utilize hardware-based Trusted Execution Environments (TEEs) to encrypt data before it leaves the sensor array.',
    status: 'Active',
    protocol: 'TEE + mTLS',
  },
  {
    title: 'Data Sovereignty',
    detail: 'All servers processing defense-bound material localized in allied jurisdictions (AWS GovCloud / Brazilian enterprise servers). Data never routes through hostile infrastructure.',
    status: 'Enforced',
    protocol: 'Geo-fenced routing',
  },
  {
    title: 'SOC 2 Type II Compliance',
    detail: 'Continuous automated auditing proving data security, availability, and processing integrity to the Board and external auditors.',
    status: 'Compliant',
    protocol: 'Automated audit trail',
  },
  {
    title: 'Immutable Ledger',
    detail: 'Molecular-to-Magnet timeline hashed onto permissioned enterprise blockchain. Post-extraction tampering mathematically impossible.',
    status: 'Active',
    protocol: 'Permissioned blockchain',
  },
] as const

export const HARDWARE_SENSORS = [
  {
    category: 'Core Process Sensors',
    items: [
      { name: 'Ultrasonic Flow Meters', location: 'Clamped onto exterior of water intake/outflow pipes', measures: '95% water recirculation', frequency: '2s' },
      { name: 'Industrial pH & ORP Probes', location: 'Dropped directly into leaching vats', measures: 'pH 4.0–5.0 maintenance', frequency: '2s' },
      { name: 'Inline XRF Analyzers', location: 'MREC precipitation output', measures: '>90% TREO grade', frequency: 'Per batch' },
    ],
  },
  {
    category: 'Environmental & Regulator (MPF)',
    items: [
      { name: 'Ion-Selective Electrodes', location: 'Wastewater discharge', measures: 'Trace nitrates + sulfates', frequency: '10s' },
      { name: 'Telemetry Piezometers', location: 'Groundwater monitoring wells', measures: 'Hydrostatic pressure', frequency: '10s' },
      { name: 'Scintillation Detectors', location: 'UDC legacy site perimeter', measures: 'Gamma radiation (μSv/h)', frequency: '10s' },
    ],
  },
] as const

export const SCOPE_3_TRACKING = {
  reagent: 'Ammonium Sulfate (NH₄)₂SO₄',
  supplier: 'AdvanSix Inc.',
  supplier_origin: 'Hopewell, Virginia, USA',
  feoc_status: 'Clear — no FEOC-flagged entities in ownership chain',
  verification_method: 'EDI/API integration with supplier ERP systems',
  carbon_footprint_kg: 0.94,
  sanctions_check: 'Cross-referenced against U.S. FEOC database',
  risk_note: 'If (NH₄)₂SO₄ is sourced from a FEOC-flagged supplier, the green premium is destroyed regardless of ore origin.',
  supply_chain: [
    { step: 'Manufacture', entity: 'AdvanSix · Hopewell, VA', status: 'verified' as const },
    { step: 'Shipping', entity: 'FOB Houston → Santos port', status: 'verified' as const },
    { step: 'Inland transport', entity: 'Bonded truck → Poços de Caldas', status: 'verified' as const },
    { step: 'Plant intake', entity: 'CIP Pilot Circuit · leach vats', status: 'active' as const },
  ],
} as const

export const DEAL_SCENARIOS = [
  {
    title: 'Paid Pilot -> Enterprise SaaS',
    tag: 'Recommended starting ask',
    economics: '$10k setup + 90-day pilot + 3-year platform conversion',
    rationale: 'Meteoric buys commodity hardware, Vero supplies the trust and automation layer.',
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
  primary_mineral: 'Ionic adsorption clay (IAC) — REE adsorbed on halloysite/kaolinite',
  u_th_profile: 'Very low — ionic clay host contains minimal U/Th (not locked in primary mineral lattice)',
  solubilization: 'U/Th do not solubilize at pH 4.0 ammonium sulfate ion-exchange process',
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
  global_bt: 1.537,
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
    resource_note: 'Total 85 Mt. High-grade core 36 Mt @ 4,345 ppm TREO. First mining area in PFS 20-yr plan.',
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
    resource_note: 'Maiden resource Apr 2025 (389 Mt total). Southern extension of Capão do Mel. High-grade subset: 32 Mt @ 4,130 ppm.',
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
