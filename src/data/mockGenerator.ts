import type { PlantTelemetry, EnvTelemetry, EsgScore, AlertItem } from '../types/telemetry'
import { INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY, THRESHOLDS } from './mockData'

/* ─── Realistic drift helper ─────────────────────────────────────────────── */
function drift(value: number, variance: number, min: number, max: number, index?: number): number {
  const base = (Math.random() - 0.5) * 2 * variance
  const sine = Math.sin((index ?? 0) * 0.31) * variance * 0.4
  const step = Math.random() < 0.05 ? (Math.random() - 0.5) * variance * 3 : 0
  return Math.max(min, Math.min(max, value + base + sine + step))
}

/* ─── Plant telemetry generator ──────────────────────────────────────────── */
export function generatePlantTelemetry(prev: PlantTelemetry, scale = 1, index?: number): PlantTelemetry {
  const recirc = drift(prev.flow_metrics.recirculation_pct, 0.3 * scale, 93.0, 98.5, index)
  const ph = drift(prev.leaching_circuit.ph_level, 0.05 * scale, 3.8, 5.4, index)
  const amSulf = drift(prev.leaching_circuit.ammonium_sulfate_ml_min, 4 * scale, 260, 310, index)
  const fjhPower = drift(prev.fjh_separation.power_draw_kw, 0.3 * scale, 17.0, 20.5, index)
  const treo = drift(prev.output.treo_grade_pct, 0.1 * scale, 89.5, 93.0, index)
  const mrec = drift(prev.output.mrec_kg_hr, 1 * scale, 58, 67, index)
  const inFlow = drift(prev.flow_metrics.in_liters_sec, 2 * scale, 130, 155, index)

  return {
    timestamp: new Date().toISOString(),
    flow_metrics: {
      in_liters_sec: inFlow,
      out_liters_sec: inFlow * (1 - recirc / 100),
      recirculation_pct: recirc,
    },
    leaching_circuit: {
      ph_level: ph,
      ammonium_sulfate_ml_min: amSulf,
    },
    fjh_separation: {
      power_draw_kw: fjhPower,
      energy_savings_pct: drift(prev.fjh_separation.energy_savings_pct, 0.2 * scale, 85, 89, index),
    },
    output: {
      treo_grade_pct: treo,
      mrec_kg_hr: mrec,
      ndpr_ratio_pct: drift(prev.output.ndpr_ratio_pct, 0.1 * scale, 21.5, 23.5, index),
    },
  }
}

interface GenerateEnvTelemetryOptions {
  /** 0–1 dryness signal; nudges modeled_inferred springs when > ~0.4 (demo cross-data) */
  precipStress?: number
}

/* ─── Environmental telemetry generator ─────────────────────────────────── */
export function generateEnvTelemetry(prev: EnvTelemetry, scale = 1, options?: GenerateEnvTelemetryOptions, index?: number): EnvTelemetry {
  const sulfate = drift(prev.water_quality.sulfate_ppm, 3 * scale, 110, 260, index)
  const nitrate = drift(prev.water_quality.nitrate_ppm, 1 * scale, 18, 55, index)
  const radiation = drift(prev.legacy_infrastructure.radiation_usv_h, 0.003 * scale, 0.10, 0.22, index)

  const nextSensors = prev.aquifer.sensors.map(s => {
    const depth = drift(s.depth_meters, 0.05 * scale, s.baseline_meters - 2, s.baseline_meters + 3, index)
    const delta = depth - s.baseline_meters
    const status: 'Normal' | 'Warning' | 'Critical' =
      delta > 2.0 ? 'Critical' : delta > 0.8 ? 'Warning' : 'Normal'
    return { ...s, depth_meters: depth, status }
  })
  const sensorById = new Map(nextSensors.map(s => [s.sensor_id, s]))
  const precipStress = options?.precipStress

  const springs = prev.springs.map((s) => {
    let status = s.status
    if (s.linked_sensor_id) {
      const sen = sensorById.get(s.linked_sensor_id)
      if (sen?.status === 'Critical' && status === 'Active') status = 'Reduced'
      else if (sen?.status === 'Warning' && status === 'Active') status = 'Reduced'
    }
    if (precipStress != null && precipStress > 0.4 && s.monitoring_tier === 'modeled_inferred' && status === 'Active') {
      if (Math.random() < 0.012 * precipStress) status = 'Reduced'
    }
    return status === s.status ? s : { ...s, status }
  })
  const springsUnchanged = springs.every((spr, i) => spr === prev.springs[i])

  return {
    timestamp: new Date().toISOString(),
    aquifer: {
      sensors: nextSensors,
    },
    water_quality: {
      sulfate_ppm: sulfate,
      nitrate_ppm: nitrate,
      ph_groundwater: drift(prev.water_quality.ph_groundwater, 0.02 * scale, 6.8, 7.8, index),
    },
    legacy_infrastructure: {
      radiation_usv_h: radiation,
      udc_status: radiation > THRESHOLDS.radiation_critical_usv_h + 0.02 ? 'Alert' : radiation > THRESHOLDS.radiation_critical_usv_h ? 'Elevated' : 'Normal',
    },
    springs: springsUnchanged ? prev.springs : springs,
    springEvents: prev.springEvents,
  }
}

/* ─── ESG score calculator ───────────────────────────────────────────────── */
export function calculateEsgScore(plant: PlantTelemetry, env: EnvTelemetry): EsgScore {
  // Operator: recirculation, pH in range, TREO grade
  const recirc = Math.min(100, (plant.flow_metrics.recirculation_pct / 98.5) * 100)
  const phOk = plant.leaching_circuit.ph_level >= THRESHOLDS.ph_low && plant.leaching_circuit.ph_level <= THRESHOLDS.ph_high ? 100 : 60
  const treoScore = Math.min(100, (plant.output.treo_grade_pct / 93) * 100)
  const operator = Math.round((recirc * 0.4 + phOk * 0.3 + treoScore * 0.3))

  // Regulator: aquifer status, sulfate/nitrate, radiation
  const aquiferOk = env.aquifer.sensors.length > 0
    ? env.aquifer.sensors.filter(s => s.status === 'Normal').length / env.aquifer.sensors.length
    : 1
  const sulfateOk = Math.max(0, 100 - Math.max(0, env.water_quality.sulfate_ppm - THRESHOLDS.sulfate_warning_ppm) * 2)
  const nitrateOk = Math.max(0, 100 - Math.max(0, env.water_quality.nitrate_ppm - THRESHOLDS.nitrate_warning_ppm) * 5)
  const radOk = env.legacy_infrastructure.radiation_usv_h < THRESHOLDS.radiation_critical_usv_h ? 100 : 70
  const regulator = Math.round(aquiferOk * 25 + sulfateOk * 0.25 + nitrateOk * 0.25 + radOk * 0.25)

  // Buyer: fixed at 96 (compliance ledger doesn't change in demo)
  const buyer = 96

  const overall = Math.round((operator * 0.33 + regulator * 0.34 + buyer * 0.33))
  return { overall, operator, regulator, buyer }
}

/* ─── Alert generator ────────────────────────────────────────────────────── */
export function detectAlerts(
  plant: PlantTelemetry,
  env: EnvTelemetry,
  existing: AlertItem[]
): AlertItem[] {
  const alerts: AlertItem[] = [...existing]
  const now = new Date().toISOString()

  function hasAlert(id: string) { return alerts.some(a => a.id === id && !a.dismissed) }

  if (plant.leaching_circuit.ph_level > THRESHOLDS.ph_high && !hasAlert('alert-ph-high')) {
    alerts.push({ id: 'alert-ph-high', severity: 'warning', title: 'pH Level Elevated', detail: `Leach circuit pH at ${plant.leaching_circuit.ph_level.toFixed(2)} — above ${THRESHOLDS.ph_high} threshold. Check ammonium sulfate feed.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (plant.leaching_circuit.ph_level < THRESHOLDS.ph_low && !hasAlert('alert-ph-low')) {
    alerts.push({ id: 'alert-ph-low', severity: 'critical', title: 'pH Level Critical Low', detail: `Leach circuit pH at ${plant.leaching_circuit.ph_level.toFixed(2)} — below ${THRESHOLDS.ph_low} safe minimum.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (plant.flow_metrics.recirculation_pct < THRESHOLDS.recirculation_warning_pct && !hasAlert('alert-recirc')) {
    alerts.push({ id: 'alert-recirc', severity: 'warning', title: 'Water Recirculation Below Target', detail: `Recirculation at ${plant.flow_metrics.recirculation_pct.toFixed(1)}% — target is >95%. Check filtration circuit.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.water_quality.sulfate_ppm > THRESHOLDS.sulfate_warning_ppm && !hasAlert('alert-sulfate')) {
    alerts.push({ id: 'alert-sulfate', severity: 'critical', title: 'Sulfate Containment Breach', detail: `Sulfate at ${env.water_quality.sulfate_ppm.toFixed(0)} ppm — exceeds ${THRESHOLDS.sulfate_warning_ppm} ppm regulatory limit. Immediate review required.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.legacy_infrastructure.radiation_usv_h > THRESHOLDS.radiation_critical_usv_h && !hasAlert('alert-radiation')) {
    alerts.push({ id: 'alert-radiation', severity: 'critical', title: 'UDC Radiation Spike', detail: `Radiation at ${env.legacy_infrastructure.radiation_usv_h.toFixed(3)} μSv/h — above ${THRESHOLDS.radiation_critical_usv_h} μSv/h threshold. UDC proximity review.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.aquifer.sensors.some(s => s.status === 'Critical') && !hasAlert('alert-aquifer')) {
    alerts.push({ id: 'alert-aquifer', severity: 'critical', title: 'Aquifer Depth Critical', detail: 'Piezometer reading exceeds safe drawdown threshold. Hydrologist notification triggered.', timestamp: now, dismissed: false, source: 'operator' })
  }

  return alerts.slice(-10)
}

export { INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY }
