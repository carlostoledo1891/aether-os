import { describe, it, expect } from 'vitest'
import { generatePlantTelemetry, INITIAL_PLANT } from '../generators/plantGenerator.js'
import { generateEnvTelemetry, INITIAL_ENV } from '../generators/envGenerator.js'
import { detectAlerts, calculateEsgScore } from '../generators/alertGenerator.js'
import type { AlertItem } from '../generators/types.js'

describe('plantGenerator', () => {
  it('INITIAL_PLANT has expected shape', () => {
    expect(INITIAL_PLANT.flow_metrics.recirculation_pct).toBeGreaterThan(90)
    expect(INITIAL_PLANT.leaching_circuit.ph_level).toBeGreaterThan(3)
    expect(INITIAL_PLANT.output.treo_grade_pct).toBeGreaterThan(80)
    expect(typeof INITIAL_PLANT.timestamp).toBe('string')
  })

  it('generatePlantTelemetry drifts values within bounds', () => {
    let plant = INITIAL_PLANT
    for (let i = 0; i < 100; i++) {
      plant = generatePlantTelemetry(plant)
    }
    expect(plant.flow_metrics.recirculation_pct).toBeGreaterThanOrEqual(93)
    expect(plant.flow_metrics.recirculation_pct).toBeLessThanOrEqual(98.5)
    expect(plant.leaching_circuit.ph_level).toBeGreaterThanOrEqual(3.8)
    expect(plant.leaching_circuit.ph_level).toBeLessThanOrEqual(5.4)
    expect(plant.output.treo_grade_pct).toBeGreaterThanOrEqual(89.5)
    expect(plant.output.treo_grade_pct).toBeLessThanOrEqual(93.0)
  })

  it('out_liters_sec is derived from in_liters_sec and recirculation', () => {
    const plant = generatePlantTelemetry(INITIAL_PLANT)
    const expected = plant.flow_metrics.in_liters_sec * (1 - plant.flow_metrics.recirculation_pct / 100)
    expect(plant.flow_metrics.out_liters_sec).toBeCloseTo(expected, 5)
  })

  it('respects scale parameter', () => {
    const deviations: number[] = []
    for (let i = 0; i < 200; i++) {
      const lowScale = generatePlantTelemetry(INITIAL_PLANT, 0.01)
      deviations.push(Math.abs(lowScale.leaching_circuit.ph_level - INITIAL_PLANT.leaching_circuit.ph_level))
    }
    const avgDev = deviations.reduce((a, b) => a + b, 0) / deviations.length
    expect(avgDev).toBeLessThan(0.01)
  })
})

describe('envGenerator', () => {
  it('INITIAL_ENV has expected shape', () => {
    expect(INITIAL_ENV.water_quality.sulfate_ppm).toBeLessThan(250)
    expect(INITIAL_ENV.aquifer.sensors.length).toBe(4)
    expect(typeof INITIAL_ENV.timestamp).toBe('string')
  })

  it('generateEnvTelemetry drifts values within bounds', () => {
    let env = INITIAL_ENV
    for (let i = 0; i < 100; i++) {
      env = generateEnvTelemetry(env)
    }
    expect(env.water_quality.sulfate_ppm).toBeGreaterThanOrEqual(110)
    expect(env.water_quality.sulfate_ppm).toBeLessThanOrEqual(260)
    expect(env.water_quality.nitrate_ppm).toBeGreaterThanOrEqual(18)
    expect(env.water_quality.nitrate_ppm).toBeLessThanOrEqual(55)
  })

  it('sensor status reflects depth delta', () => {
    const criticalEnv = {
      ...INITIAL_ENV,
      aquifer: {
        sensors: INITIAL_ENV.aquifer.sensors.map(s => ({
          ...s,
          depth_meters: s.baseline_meters + 3,
        })),
      },
    }
    const result = generateEnvTelemetry(criticalEnv)
    const hasCritical = result.aquifer.sensors.some(s => s.status === 'Critical' || s.status === 'Warning')
    expect(hasCritical).toBe(true)
  })

  it('UDC status reflects radiation level', () => {
    const highRad = {
      ...INITIAL_ENV,
      legacy_infrastructure: { radiation_usv_h: 0.21, udc_status: 'Alert' as const },
    }
    const result = generateEnvTelemetry(highRad, 0.001)
    expect(['Elevated', 'Alert']).toContain(result.legacy_infrastructure.udc_status)
  })
})

describe('alertGenerator', () => {
  it('detectAlerts returns alerts for critical thresholds', () => {
    const criticalPlant = {
      ...INITIAL_PLANT,
      leaching_circuit: { ...INITIAL_PLANT.leaching_circuit, ph_level: 3.5 },
    }
    const alerts = detectAlerts(criticalPlant, INITIAL_ENV, [])
    expect(alerts.some(a => a.id === 'alert-ph-low')).toBe(true)
  })

  it('detectAlerts does not duplicate existing alerts', () => {
    const criticalPlant = {
      ...INITIAL_PLANT,
      leaching_circuit: { ...INITIAL_PLANT.leaching_circuit, ph_level: 3.5 },
    }
    const existing: AlertItem[] = [
      { id: 'alert-ph-low', severity: 'critical', title: 'pH Low', detail: '', timestamp: '', dismissed: false, source: 'operator' },
    ]
    const alerts = detectAlerts(criticalPlant, INITIAL_ENV, existing)
    expect(alerts.filter(a => a.id === 'alert-ph-low').length).toBe(1)
  })

  it('detectAlerts fires sulfate alert above threshold', () => {
    const highSulfate = {
      ...INITIAL_ENV,
      water_quality: { ...INITIAL_ENV.water_quality, sulfate_ppm: 260 },
    }
    const alerts = detectAlerts(INITIAL_PLANT, highSulfate, [])
    expect(alerts.some(a => a.id === 'alert-sulfate')).toBe(true)
  })

  it('detectAlerts caps at 10 alerts', () => {
    const manyAlerts: AlertItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: `test-${i}`, severity: 'warning' as const, title: `Alert ${i}`,
      detail: '', timestamp: '', dismissed: false, source: 'operator' as const,
    }))
    const alerts = detectAlerts(INITIAL_PLANT, INITIAL_ENV, manyAlerts)
    expect(alerts.length).toBeLessThanOrEqual(10)
  })

  it('calculateEsgScore returns scores in 0-100 range', () => {
    const esg = calculateEsgScore(INITIAL_PLANT, INITIAL_ENV)
    expect(esg.overall).toBeGreaterThanOrEqual(0)
    expect(esg.overall).toBeLessThanOrEqual(100)
    expect(esg.operator).toBeGreaterThanOrEqual(0)
    expect(esg.buyer).toBeGreaterThanOrEqual(0)
    expect(esg.regulator).toBeGreaterThanOrEqual(0)
  })
})
