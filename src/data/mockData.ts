import type { PlantTelemetry, EnvTelemetry, SpringTelemetry, SpringEvent } from '../types/telemetry'

/* ─── Re-exports from domain modules (single source of truth) ──────────── */
export { SPRING_COUNT, THRESHOLDS } from './domain/thresholds'
export { RESOURCE_CLASSIFICATION } from './domain/deposits'
export type { DepositDetail } from './domain/deposits'

/* ─── Import for local use ─────────────────────────────────────────────── */
import { SPRING_COUNT } from './domain/thresholds'

/* ─── Generator-specific seed data (not domain data) ───────────────────── */

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

/* ─── Static data that remains in mockData (not domain-level) ──────────── */

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

export const U_TH_SAFETY = {
  primary_mineral: 'Ionic adsorption clay (IAC) — REE adsorbed on halloysite/kaolinite',
  u_th_profile: 'Very low — ionic clay host contains minimal U/Th (not locked in primary mineral lattice)',
  solubilization: 'U/Th do not solubilize at pH 4.0 ammonium sulfate ion-exchange process',
  mrec_classification: 'Safe for international transport and handling',
  radioactive_tailings: false,
  advantage_vs_hardrock: 'No acid baking or caustic cracking required — avoids radioactive concentrate issues common in monazite/bastnäsite hard-rock deposits',
} as const
