import { describe, it, expect } from 'vitest'
import {
  SPRING_COUNT,
  buildInitialSprings,
  DEPOSIT_DATA,
  THRESHOLDS,
  BATCHES,
} from './mockData'

describe('mockData static domain', () => {
  it('buildInitialSprings returns SPRING_COUNT springs', () => {
    const springs = buildInitialSprings()
    expect(springs).toHaveLength(SPRING_COUNT)
    expect(SPRING_COUNT).toBe(1092)
  })

  it('DEPOSIT_DATA has seven deposits with required fields', () => {
    expect(DEPOSIT_DATA).toHaveLength(7)
    for (const d of DEPOSIT_DATA) {
      expect(typeof d.id).toBe('string')
      expect(d.id.length).toBeGreaterThan(0)
      expect(typeof d.name).toBe('string')
      expect(typeof d.treo_ppm).toBe('number')
      expect(Number.isFinite(d.treo_ppm)).toBe(true)
      expect(typeof d.tonnage_mt).toBe('number')
      expect(Number.isFinite(d.tonnage_mt)).toBe(true)
      expect(['measured', 'indicated', 'inferred', 'exploration']).toContain(d.status)
    }
  })

  it('THRESHOLDS are internally consistent', () => {
    expect(THRESHOLDS.ph_low).toBeLessThan(THRESHOLDS.ph_high)
    expect(THRESHOLDS.radiation_critical_usv_h).toBeGreaterThan(0)
    expect(THRESHOLDS.sulfate_warning_ppm).toBeGreaterThan(0)
    expect(THRESHOLDS.nitrate_warning_ppm).toBeGreaterThan(0)
    expect(THRESHOLDS.recirculation_warning_pct).toBeGreaterThan(0)
    expect(THRESHOLDS.recirculation_warning_pct).toBeLessThanOrEqual(100)
  })

  it('BATCHES has at least one batch with required fields', () => {
    expect(BATCHES.length).toBeGreaterThan(0)
    const b = BATCHES[0]
    expect(typeof b.batch_id).toBe('string')
    expect(b.batch_id.length).toBeGreaterThan(0)
    expect(typeof b.batch_date).toBe('string')
    expect(typeof b.tonnage_kg).toBe('number')
    expect(Array.isArray(b.molecular_timeline)).toBe(true)
    expect(b.molecular_timeline.length).toBeGreaterThan(0)
  })
})
