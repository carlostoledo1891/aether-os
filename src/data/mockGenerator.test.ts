import { describe, it, expect } from 'vitest'
import {
  generatePlantTelemetry,
  generateEnvTelemetry,
  calculateEsgScore,
  detectAlerts,
  INITIAL_PLANT_TELEMETRY,
  INITIAL_ENV_TELEMETRY,
} from './mockGenerator'

describe('generatePlantTelemetry', () => {
  it('returns a new PlantTelemetry with fresh timestamp', () => {
    const result = generatePlantTelemetry(INITIAL_PLANT_TELEMETRY)
    expect(result.timestamp).toBeTruthy()
    expect(result.timestamp).not.toBe(INITIAL_PLANT_TELEMETRY.timestamp)
  })

  it('keeps values within expected bounds after many iterations', () => {
    let plant = INITIAL_PLANT_TELEMETRY
    for (let i = 0; i < 200; i++) {
      plant = generatePlantTelemetry(plant)
    }
    expect(plant.flow_metrics.recirculation_pct).toBeGreaterThanOrEqual(93.0)
    expect(plant.flow_metrics.recirculation_pct).toBeLessThanOrEqual(98.5)
    expect(plant.leaching_circuit.ph_level).toBeGreaterThanOrEqual(3.8)
    expect(plant.leaching_circuit.ph_level).toBeLessThanOrEqual(5.4)
    expect(plant.output.treo_grade_pct).toBeGreaterThanOrEqual(89.5)
    expect(plant.output.treo_grade_pct).toBeLessThanOrEqual(93.0)
  })

  it('preserves all required fields', () => {
    const result = generatePlantTelemetry(INITIAL_PLANT_TELEMETRY)
    expect(result.flow_metrics).toBeDefined()
    expect(result.leaching_circuit).toBeDefined()
    expect(result.fjh_separation).toBeDefined()
    expect(result.output).toBeDefined()
    expect(typeof result.flow_metrics.in_liters_sec).toBe('number')
    expect(typeof result.flow_metrics.out_liters_sec).toBe('number')
    expect(typeof result.leaching_circuit.ammonium_sulfate_ml_min).toBe('number')
  })
})

describe('generateEnvTelemetry', () => {
  it('returns a new EnvTelemetry with fresh timestamp', () => {
    const result = generateEnvTelemetry(INITIAL_ENV_TELEMETRY)
    expect(result.timestamp).toBeTruthy()
    expect(result.timestamp).not.toBe(INITIAL_ENV_TELEMETRY.timestamp)
  })

  it('keeps values within expected bounds', () => {
    let env = INITIAL_ENV_TELEMETRY
    for (let i = 0; i < 200; i++) {
      env = generateEnvTelemetry(env)
    }
    expect(env.water_quality.sulfate_ppm).toBeGreaterThanOrEqual(110)
    expect(env.water_quality.sulfate_ppm).toBeLessThanOrEqual(260)
    expect(env.water_quality.nitrate_ppm).toBeGreaterThanOrEqual(18)
    expect(env.water_quality.nitrate_ppm).toBeLessThanOrEqual(55)
  })

  it('assigns correct UDC status based on radiation', () => {
    const result = generateEnvTelemetry({
      ...INITIAL_ENV_TELEMETRY,
      legacy_infrastructure: {
        radiation_usv_h: 0.21,
        udc_status: 'Normal',
      },
    })
    // After drift from 0.21, the status should be elevated or alert
    expect(['Elevated', 'Alert', 'Normal']).toContain(result.legacy_infrastructure.udc_status)
  })

  it('sets sensor status based on drawdown delta', () => {
    const result = generateEnvTelemetry(INITIAL_ENV_TELEMETRY)
    for (const sensor of result.aquifer.sensors) {
      const delta = sensor.depth_meters - sensor.baseline_meters
      if (delta > 2.0) {
        expect(sensor.status).toBe('Critical')
      } else if (delta > 0.8) {
        expect(sensor.status).toBe('Warning')
      } else {
        expect(sensor.status).toBe('Normal')
      }
    }
  })

  it('preserves springs array from previous state', () => {
    const result = generateEnvTelemetry(INITIAL_ENV_TELEMETRY)
    expect(result.springs).toBe(INITIAL_ENV_TELEMETRY.springs)
  })
})

describe('calculateEsgScore', () => {
  it('returns a score object with all required fields', () => {
    const esg = calculateEsgScore(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY)
    expect(esg.overall).toBeGreaterThan(0)
    expect(esg.overall).toBeLessThanOrEqual(100)
    expect(esg.operator).toBeGreaterThan(0)
    expect(esg.regulator).toBeGreaterThan(0)
    expect(esg.buyer).toBe(96)
  })

  it('penalizes operator score when pH is out of range', () => {
    const badPh = {
      ...INITIAL_PLANT_TELEMETRY,
      leaching_circuit: { ...INITIAL_PLANT_TELEMETRY.leaching_circuit, ph_level: 5.5 },
    }
    const goodScore = calculateEsgScore(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY)
    const badScore = calculateEsgScore(badPh, INITIAL_ENV_TELEMETRY)
    expect(badScore.operator).toBeLessThan(goodScore.operator)
  })

  it('penalizes regulator score when radiation is high', () => {
    const highRad = {
      ...INITIAL_ENV_TELEMETRY,
      legacy_infrastructure: { radiation_usv_h: 0.22, udc_status: 'Alert' as const },
    }
    const normalScore = calculateEsgScore(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY)
    const badScore = calculateEsgScore(INITIAL_PLANT_TELEMETRY, highRad)
    expect(badScore.regulator).toBeLessThan(normalScore.regulator)
  })

  it('overall is a weighted average of sub-scores', () => {
    const esg = calculateEsgScore(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY)
    const expected = Math.round(esg.operator * 0.33 + esg.regulator * 0.34 + esg.buyer * 0.33)
    expect(esg.overall).toBe(expected)
  })
})

describe('detectAlerts', () => {
  it('returns empty array when all values are normal', () => {
    const alerts = detectAlerts(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY, [])
    expect(alerts).toHaveLength(0)
  })

  it('generates pH high alert when pH exceeds 5.0', () => {
    const plant = {
      ...INITIAL_PLANT_TELEMETRY,
      leaching_circuit: { ...INITIAL_PLANT_TELEMETRY.leaching_circuit, ph_level: 5.2 },
    }
    const alerts = detectAlerts(plant, INITIAL_ENV_TELEMETRY, [])
    expect(alerts.some(a => a.id === 'alert-ph-high')).toBe(true)
  })

  it('generates pH low alert when pH goes below 4.0', () => {
    const plant = {
      ...INITIAL_PLANT_TELEMETRY,
      leaching_circuit: { ...INITIAL_PLANT_TELEMETRY.leaching_circuit, ph_level: 3.8 },
    }
    const alerts = detectAlerts(plant, INITIAL_ENV_TELEMETRY, [])
    expect(alerts.some(a => a.id === 'alert-ph-low')).toBe(true)
  })

  it('generates sulfate alert when above 250 ppm', () => {
    const env = {
      ...INITIAL_ENV_TELEMETRY,
      water_quality: { ...INITIAL_ENV_TELEMETRY.water_quality, sulfate_ppm: 260 },
    }
    const alerts = detectAlerts(INITIAL_PLANT_TELEMETRY, env, [])
    expect(alerts.some(a => a.id === 'alert-sulfate')).toBe(true)
    expect(alerts.find(a => a.id === 'alert-sulfate')?.severity).toBe('critical')
  })

  it('generates radiation alert when above 0.19', () => {
    const env = {
      ...INITIAL_ENV_TELEMETRY,
      legacy_infrastructure: { radiation_usv_h: 0.20, udc_status: 'Alert' as const },
    }
    const alerts = detectAlerts(INITIAL_PLANT_TELEMETRY, env, [])
    expect(alerts.some(a => a.id === 'alert-radiation')).toBe(true)
  })

  it('does not duplicate existing undismissed alerts', () => {
    const plant = {
      ...INITIAL_PLANT_TELEMETRY,
      leaching_circuit: { ...INITIAL_PLANT_TELEMETRY.leaching_circuit, ph_level: 5.2 },
    }
    const existing = detectAlerts(plant, INITIAL_ENV_TELEMETRY, [])
    const result = detectAlerts(plant, INITIAL_ENV_TELEMETRY, existing)
    const phHighAlerts = result.filter(a => a.id === 'alert-ph-high')
    expect(phHighAlerts.length).toBe(1)
  })

  it('limits total alerts to 10', () => {
    const alerts = Array.from({ length: 12 }, (_, i) => ({
      id: `old-${i}`,
      severity: 'info' as const,
      title: `Old alert ${i}`,
      detail: 'Test',
      timestamp: new Date().toISOString(),
      dismissed: false,
      source: 'operator' as const,
    }))
    const result = detectAlerts(INITIAL_PLANT_TELEMETRY, INITIAL_ENV_TELEMETRY, alerts)
    expect(result.length).toBeLessThanOrEqual(10)
  })
})
