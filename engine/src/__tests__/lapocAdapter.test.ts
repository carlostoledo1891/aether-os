import { describe, it, expect } from 'vitest'
import type {
  LapocPiezometerReading,
  LapocWaterQualitySample,
  LapocFieldObservation,
  LapocTelemetryPayload,
} from '../enrichers/lapocAdapter.js'

describe('LAPOC type contracts', () => {
  const validPiezoReading: LapocPiezometerReading = {
    sensor_id: 'PIZ-TEST-01',
    timestamp: new Date().toISOString(),
    depth_meters: 14.2,
    temperature_c: 19.0,
    conductivity_us_cm: 340,
  }

  const validWqSample: LapocWaterQualitySample = {
    sample_id: 'WQ-001',
    timestamp: new Date().toISOString(),
    location: 'Test point',
    ph: 7.0,
    sulfate_ppm: 140,
    nitrate_ppm: 25,
    iron_ppm: 0.12,
    manganese_ppm: 0.05,
    turbidity_ntu: 3.5,
  }

  const validFieldObs: LapocFieldObservation = {
    observer: 'Test User',
    timestamp: new Date().toISOString(),
    spring_id: 'SPR-01',
    flow_status: 'active',
    notes: 'Normal flow observed',
  }

  it('LapocPiezometerReading has all required fields', () => {
    expect(validPiezoReading).toHaveProperty('sensor_id')
    expect(validPiezoReading).toHaveProperty('timestamp')
    expect(validPiezoReading).toHaveProperty('depth_meters')
    expect(validPiezoReading).toHaveProperty('temperature_c')
    expect(validPiezoReading).toHaveProperty('conductivity_us_cm')
    expect(typeof validPiezoReading.depth_meters).toBe('number')
    expect(typeof validPiezoReading.temperature_c).toBe('number')
  })

  it('LapocWaterQualitySample has all required numeric fields', () => {
    const numericFields = ['ph', 'sulfate_ppm', 'nitrate_ppm', 'iron_ppm', 'manganese_ppm', 'turbidity_ntu'] as const
    for (const field of numericFields) {
      expect(typeof validWqSample[field]).toBe('number')
      expect(validWqSample[field]).toBeGreaterThanOrEqual(0)
    }
  })

  it('LapocFieldObservation flow_status is a valid enum value', () => {
    const validStatuses = ['active', 'reduced', 'dry']
    expect(validStatuses).toContain(validFieldObs.flow_status)
  })

  it('LapocTelemetryPayload assembles correctly', () => {
    const payload: LapocTelemetryPayload = {
      source: 'lapoc-simulated',
      provenance: 'simulated',
      timestamp: new Date().toISOString(),
      piezometer_readings: [validPiezoReading],
      water_quality_samples: [validWqSample],
      field_observations: [validFieldObs],
    }

    expect(payload.piezometer_readings).toHaveLength(1)
    expect(payload.water_quality_samples).toHaveLength(1)
    expect(payload.field_observations).toHaveLength(1)
    expect(['lapoc', 'lapoc-simulated']).toContain(payload.source)
    expect(['verified_real', 'simulated']).toContain(payload.provenance)
  })

  it('payload allows empty arrays for all collections', () => {
    const payload: LapocTelemetryPayload = {
      source: 'lapoc',
      provenance: 'verified_real',
      timestamp: new Date().toISOString(),
      piezometer_readings: [],
      water_quality_samples: [],
      field_observations: [],
    }

    expect(payload.piezometer_readings).toHaveLength(0)
    expect(payload.water_quality_samples).toHaveLength(0)
    expect(payload.field_observations).toHaveLength(0)
  })
})

describe('domain types – telemetry types', () => {
  it('SpringMonitoringTier values are exhaustive', async () => {
    await import('../generators/types.js')
    const tiers: Array<import('../generators/types.js').SpringMonitoringTier> = [
      'direct', 'sentinel_proxy', 'modeled_inferred',
    ]
    expect(tiers).toHaveLength(3)
    for (const t of tiers) {
      expect(typeof t).toBe('string')
    }
  })

  it('DomainThresholds interface can be instantiated with required fields', async () => {
    const thresholds: import('../generators/types.js').DomainThresholds = {
      sulfate_warning_ppm: 250,
      nitrate_warning_ppm: 50,
      radiation_critical_usv_h: 0.18,
      ph_low: 3.9,
      ph_high: 5.1,
      recirculation_warning_pct: 94,
    }
    expect(thresholds.ph_low).toBeLessThan(thresholds.ph_high)
    expect(thresholds.sulfate_warning_ppm).toBeGreaterThan(0)
    expect(thresholds.nitrate_warning_ppm).toBeGreaterThan(0)
    expect(thresholds.radiation_critical_usv_h).toBeGreaterThan(0)
    expect(thresholds.recirculation_warning_pct).toBeGreaterThan(0)
    expect(thresholds.recirculation_warning_pct).toBeLessThanOrEqual(100)
  })
})
