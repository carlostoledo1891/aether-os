import type { PlantTelemetry } from './types.js'

function drift(value: number, variance: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * variance
  return Math.max(min, Math.min(max, value + delta))
}

export function generatePlantTelemetry(prev: PlantTelemetry, scale = 1): PlantTelemetry {
  const recirc = drift(prev.flow_metrics.recirculation_pct, 0.3 * scale, 93.0, 98.5)
  const ph = drift(prev.leaching_circuit.ph_level, 0.05 * scale, 3.8, 5.4)
  const amSulf = drift(prev.leaching_circuit.ammonium_sulfate_ml_min, 4 * scale, 260, 310)
  const fjhPower = drift(prev.fjh_separation.power_draw_kw, 0.3 * scale, 17.0, 20.5)
  const treo = drift(prev.output.treo_grade_pct, 0.1 * scale, 89.5, 93.0)
  const mrec = drift(prev.output.mrec_kg_hr, 1 * scale, 58, 67)
  const inFlow = drift(prev.flow_metrics.in_liters_sec, 2 * scale, 130, 155)

  return {
    timestamp: new Date().toISOString(),
    flow_metrics: {
      in_liters_sec: inFlow,
      out_liters_sec: inFlow * (1 - recirc / 100),
      recirculation_pct: recirc,
    },
    leaching_circuit: { ph_level: ph, ammonium_sulfate_ml_min: amSulf },
    fjh_separation: {
      power_draw_kw: fjhPower,
      energy_savings_pct: drift(prev.fjh_separation.energy_savings_pct, 0.2 * scale, 85, 89),
    },
    output: {
      treo_grade_pct: treo,
      mrec_kg_hr: mrec,
      ndpr_ratio_pct: drift(prev.output.ndpr_ratio_pct, 0.1 * scale, 21.5, 23.5),
    },
  }
}

export const INITIAL_PLANT: PlantTelemetry = {
  timestamp: new Date().toISOString(),
  flow_metrics: { in_liters_sec: 142, out_liters_sec: 6.8, recirculation_pct: 95.2 },
  leaching_circuit: { ph_level: 4.3, ammonium_sulfate_ml_min: 285 },
  fjh_separation: { power_draw_kw: 18.7, energy_savings_pct: 87 },
  output: { treo_grade_pct: 91.2, mrec_kg_hr: 62, ndpr_ratio_pct: 22.4 },
}
