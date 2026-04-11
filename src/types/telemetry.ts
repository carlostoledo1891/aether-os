/* ─── Aether OS Telemetry Types ──────────────────────────────────────────── */

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

export interface ChannelMeta {
  unit: string
  precision: number
  sample_rate_hz: number
  staleness_threshold_ms: number
}

export interface PlantTelemetry {
  timestamp: string
  flow_metrics: {
    in_liters_sec: number
    out_liters_sec: number
    recirculation_pct: number  // Target: > 95.0
  }
  leaching_circuit: {
    ph_level: number           // Target: 4.0 - 5.0
    ammonium_sulfate_ml_min: number
  }
  fjh_separation: {
    power_draw_kw: number
    energy_savings_pct: number // vs traditional SX
  }
  output: {
    treo_grade_pct: number     // Inline XRF
    mrec_kg_hr: number
    ndpr_ratio_pct: number
  }
  channel_meta?: Record<string, ChannelMeta>
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
    sulfate_ppm: number    // ISE Sensor — threshold: 250
    nitrate_ppm: number    // ISE Sensor — threshold: 50
    ph_groundwater: number
  }
  legacy_infrastructure: {
    radiation_usv_h: number  // Target: ~0.14
    udc_status: 'Normal' | 'Elevated' | 'Alert'
  }
  springs: SpringTelemetry[]
  /** Sparse audit-style events for spring monitoring (demo) */
  springEvents?: SpringEvent[]
}

export interface ComplianceLedger {
  batch_id: string           // e.g., "BATCH-MREC-8X9"
  batch_date: string
  tonnage_kg: number
  feoc_percentage: number    // Must be 0.00
  ira_compliant: boolean
  eu_dbp_ready: boolean
  carbon_intensity: {
    value: number            // kg CO2e / kg TREO
    tier: 'Premium' | 'Standard' | 'High'
    vs_chinese_baseline: number  // % reduction
  }
  molecular_timeline: Array<{
    step: string
    description: string
    timestamp: string
    status: 'verified' | 'active' | 'pending'
    coordinates?: { lat: number; lng: number }
    hash?: string
    linked_drills?: string[]
    entity?: string
  }>
  offtake_destination: string
  certificates: string[]
}

export type ViewMode = 'operator' | 'buyer' | 'executive'

export type ReportType = 'environment' | 'operations' | 'drill-tests'

export interface AlertItem {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  timestamp: string
  dismissed: boolean
  source: ViewMode
}

export interface SimulationMode {
  type: 'live' | 'playback'
  playbackStep?: number
}

export interface EsgScore {
  overall: number
  operator: number
  regulator: number
  buyer: number
}
