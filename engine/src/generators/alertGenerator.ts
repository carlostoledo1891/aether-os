import type { PlantTelemetry, EnvTelemetry, AlertItem, DomainThresholds } from './types.js'

const THRESHOLDS: DomainThresholds = {
  sulfate_warning_ppm: 250,
  nitrate_warning_ppm: 50,
  radiation_critical_usv_h: 0.18,
  ph_low: 3.9,
  ph_high: 5.1,
  recirculation_warning_pct: 94,
}

export function detectAlerts(
  plant: PlantTelemetry,
  env: EnvTelemetry,
  existing: AlertItem[],
): AlertItem[] {
  const alerts: AlertItem[] = [...existing]
  const now = new Date().toISOString()

  function hasAlert(id: string) { return alerts.some(a => a.id === id && !a.dismissed) }

  if (plant.leaching_circuit.ph_level > THRESHOLDS.ph_high && !hasAlert('alert-ph-high')) {
    alerts.push({ id: 'alert-ph-high', severity: 'warning', title: 'pH Level Elevated', detail: `Leach circuit pH at ${plant.leaching_circuit.ph_level.toFixed(2)} — above ${THRESHOLDS.ph_high} threshold.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (plant.leaching_circuit.ph_level < THRESHOLDS.ph_low && !hasAlert('alert-ph-low')) {
    alerts.push({ id: 'alert-ph-low', severity: 'critical', title: 'pH Level Critical Low', detail: `Leach circuit pH at ${plant.leaching_circuit.ph_level.toFixed(2)} — below ${THRESHOLDS.ph_low} safe minimum.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (plant.flow_metrics.recirculation_pct < THRESHOLDS.recirculation_warning_pct && !hasAlert('alert-recirc')) {
    alerts.push({ id: 'alert-recirc', severity: 'warning', title: 'Water Recirculation Below Target', detail: `Recirculation at ${plant.flow_metrics.recirculation_pct.toFixed(1)}% — target is >95%.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.water_quality.sulfate_ppm > THRESHOLDS.sulfate_warning_ppm && !hasAlert('alert-sulfate')) {
    alerts.push({ id: 'alert-sulfate', severity: 'critical', title: 'Sulfate Containment Breach', detail: `Sulfate at ${env.water_quality.sulfate_ppm.toFixed(0)} ppm — exceeds ${THRESHOLDS.sulfate_warning_ppm} ppm limit.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.legacy_infrastructure.radiation_usv_h > THRESHOLDS.radiation_critical_usv_h && !hasAlert('alert-radiation')) {
    alerts.push({ id: 'alert-radiation', severity: 'critical', title: 'UDC Radiation Spike', detail: `Radiation at ${env.legacy_infrastructure.radiation_usv_h.toFixed(3)} μSv/h — above threshold.`, timestamp: now, dismissed: false, source: 'operator' })
  }
  if (env.aquifer.sensors.some(s => s.status === 'Critical') && !hasAlert('alert-aquifer')) {
    alerts.push({ id: 'alert-aquifer', severity: 'critical', title: 'Aquifer Depth Critical', detail: 'Piezometer reading exceeds safe drawdown threshold.', timestamp: now, dismissed: false, source: 'operator' })
  }

  return alerts.slice(-10)
}

export function calculateEsgScore(plant: PlantTelemetry, env: EnvTelemetry) {
  const recirc = Math.min(100, (plant.flow_metrics.recirculation_pct / 98.5) * 100)
  const phOk = plant.leaching_circuit.ph_level >= THRESHOLDS.ph_low && plant.leaching_circuit.ph_level <= THRESHOLDS.ph_high ? 100 : 60
  const treoScore = Math.min(100, (plant.output.treo_grade_pct / 93) * 100)
  const operator = Math.round((recirc * 0.4 + phOk * 0.3 + treoScore * 0.3))

  const aquiferOk = env.aquifer.sensors.length > 0
    ? env.aquifer.sensors.filter(s => s.status === 'Normal').length / env.aquifer.sensors.length : 1
  const sulfateOk = Math.max(0, 100 - Math.max(0, env.water_quality.sulfate_ppm - THRESHOLDS.sulfate_warning_ppm) * 2)
  const nitrateOk = Math.max(0, 100 - Math.max(0, env.water_quality.nitrate_ppm - THRESHOLDS.nitrate_warning_ppm) * 5)
  const radOk = env.legacy_infrastructure.radiation_usv_h < THRESHOLDS.radiation_critical_usv_h ? 100 : 70
  const regulator = Math.round(aquiferOk * 25 + sulfateOk * 0.25 + nitrateOk * 0.25 + radOk * 0.25)

  const buyer = 96
  const overall = Math.round((operator * 0.33 + regulator * 0.34 + buyer * 0.33))
  return { overall, operator, regulator, buyer }
}
