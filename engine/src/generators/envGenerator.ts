import type { EnvTelemetry, SpringTelemetry } from './types.js'

const THRESHOLDS = {
  sulfate_warning_ppm: 250,
  nitrate_warning_ppm: 50,
  radiation_critical_usv_h: 0.18,
}

function drift(value: number, variance: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * variance
  return Math.max(min, Math.min(max, value + delta))
}

export function generateEnvTelemetry(prev: EnvTelemetry, scale = 1, precipStress?: number): EnvTelemetry {
  const sulfate = drift(prev.water_quality.sulfate_ppm, 3 * scale, 110, 260)
  const nitrate = drift(prev.water_quality.nitrate_ppm, 1 * scale, 18, 55)
  const radiation = drift(prev.legacy_infrastructure.radiation_usv_h, 0.003 * scale, 0.10, 0.22)

  const nextSensors = prev.aquifer.sensors.map(s => {
    const depth = drift(s.depth_meters, 0.05 * scale, s.baseline_meters - 2, s.baseline_meters + 3)
    const delta = depth - s.baseline_meters
    const status: 'Normal' | 'Warning' | 'Critical' =
      delta > 2.0 ? 'Critical' : delta > 0.8 ? 'Warning' : 'Normal'
    return { ...s, depth_meters: depth, status }
  })

  const sensorById = new Map(nextSensors.map(s => [s.sensor_id, s]))

  const springs: SpringTelemetry[] = prev.springs.map((s) => {
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

  return {
    timestamp: new Date().toISOString(),
    aquifer: { sensors: nextSensors },
    water_quality: {
      sulfate_ppm: sulfate,
      nitrate_ppm: nitrate,
      ph_groundwater: drift(prev.water_quality.ph_groundwater, 0.02 * scale, 6.8, 7.8),
    },
    legacy_infrastructure: {
      radiation_usv_h: radiation,
      udc_status: radiation > THRESHOLDS.radiation_critical_usv_h + 0.02 ? 'Alert'
        : radiation > THRESHOLDS.radiation_critical_usv_h ? 'Elevated' : 'Normal',
    },
    springs,
  }
}

export const INITIAL_ENV: EnvTelemetry = {
  timestamp: new Date().toISOString(),
  aquifer: {
    sensors: [
      { sensor_id: 'PIZ-N01', label: 'North Margin', depth_meters: 45.2, baseline_meters: 45.0, status: 'Normal', lat: -21.770, lng: -46.560 },
      { sensor_id: 'PIZ-S02', label: 'South Margin', depth_meters: 38.8, baseline_meters: 38.5, status: 'Normal', lat: -21.830, lng: -46.590 },
      { sensor_id: 'PIZ-W03', label: 'West Margin', depth_meters: 52.1, baseline_meters: 52.0, status: 'Normal', lat: -21.800, lng: -46.620 },
      { sensor_id: 'PIZ-E04', label: 'East Margin', depth_meters: 41.5, baseline_meters: 41.0, status: 'Normal', lat: -21.800, lng: -46.540 },
    ],
  },
  water_quality: { sulfate_ppm: 180, nitrate_ppm: 32, ph_groundwater: 7.2 },
  legacy_infrastructure: { radiation_usv_h: 0.14, udc_status: 'Normal' },
  springs: [],
}
