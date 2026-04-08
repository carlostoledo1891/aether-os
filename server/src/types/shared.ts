/* Shared types between server and engine — mirrors frontend telemetry types */

export type SpringMonitoringTier = 'direct' | 'sentinel_proxy' | 'modeled_inferred'

export interface SpringTelemetry {
  id: string
  status: 'Active' | 'Reduced' | 'Suppressed'
  monitoring_tier: SpringMonitoringTier
  method: string
  data_sources: string[]
  last_field_visit?: string
  linked_sensor_id?: string
}

export interface SpringEvent {
  springId: string
  ts: string
  type: 'field_visit' | 'sensor_proxy' | 'model_refresh' | 'audit_note'
  note: string
}

export interface PlantTelemetry {
  timestamp: string
  flow_metrics: {
    in_liters_sec: number
    out_liters_sec: number
    recirculation_pct: number
  }
  leaching_circuit: {
    ph_level: number
    ammonium_sulfate_ml_min: number
  }
  fjh_separation: {
    power_draw_kw: number
    energy_savings_pct: number
  }
  output: {
    treo_grade_pct: number
    mrec_kg_hr: number
    ndpr_ratio_pct: number
  }
}

export interface EnvTelemetry {
  timestamp: string
  aquifer: {
    sensors: Array<{
      sensor_id: string
      label: string
      depth_meters: number
      baseline_meters: number
      status: 'Normal' | 'Warning' | 'Critical'
      lat: number
      lng: number
    }>
  }
  water_quality: {
    sulfate_ppm: number
    nitrate_ppm: number
    ph_groundwater: number
  }
  legacy_infrastructure: {
    radiation_usv_h: number
    udc_status: 'Normal' | 'Elevated' | 'Alert'
  }
  springs: SpringTelemetry[]
  springEvents?: SpringEvent[]
}

export interface EsgScore {
  overall: number
  operator: number
  regulator: number
  buyer: number
}

export interface AlertItem {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  timestamp: string
  dismissed: boolean
  source: 'operator' | 'buyer' | 'executive'
}

export interface TelemetryTick {
  plant: PlantTelemetry
  env: EnvTelemetry
  esg: EsgScore
  alerts: AlertItem[]
}

export type TimeRangeKey = '24h' | '7d' | '30d'

export interface HistoricalTelemetry {
  plantHistory: PlantTelemetry[]
  envHistory: EnvTelemetry[]
  precipMmSeries: number[]
}

export type DataProvenanceKind =
  | 'verified_real'
  | 'from_public_record'
  | 'issuer_attested'
  | 'modeled'
  | 'illustrative'
  | 'simulated'

export interface IngestPayload {
  source: string
  provenance: DataProvenanceKind
  timestamp: string
  plant: PlantTelemetry
  env: EnvTelemetry
  esg: EsgScore
  alerts: AlertItem[]
}

export interface WeatherIngestPayload {
  source: string
  provenance: DataProvenanceKind
  timestamp: string
  latitude: number
  longitude: number
  precipMm: number
  series: { time: string[]; precipitation_sum: number[] }
}

export interface MarketIngestPayload {
  source: string
  provenance: DataProvenanceKind
  timestamp: string
  kind: 'fx' | 'stock' | 'commodity'
  symbol: string
  value: number
  currency: string
  detail?: Record<string, unknown>
}

export interface SeismicIngestPayload {
  source: string
  provenance: DataProvenanceKind
  timestamp: string
  events: Array<{
    id: string
    magnitude: number
    place: string
    time: string
    latitude: number
    longitude: number
    depth_km: number
  }>
}
