import { describe, it, expect } from 'vitest'
import {
  DEPOSIT_DATA,
  THRESHOLDS,
  SPRING_COUNT,
  SCENARIOS,
  SENSITIVITY_TABLE,
  BATCHES,
  BENCHMARKS,
  RISKS,
  PILOT_PLANT_PERFORMANCE,
  STAKEHOLDER_REGISTER,
  REGULATORY_LOG,
  OFFTAKERS,
} from '../index'

describe('Domain data exports', () => {
  it('DEPOSIT_DATA is a non-empty array where each item has id and name', () => {
    expect(Array.isArray(DEPOSIT_DATA)).toBe(true)
    expect(DEPOSIT_DATA.length).toBeGreaterThan(0)
    for (const d of DEPOSIT_DATA) {
      expect(d).toHaveProperty('id')
      expect(d).toHaveProperty('name')
    }
  })

  it('THRESHOLDS has keys', () => {
    expect(Object.keys(THRESHOLDS).length).toBeGreaterThan(0)
  })

  it('SPRING_COUNT is a positive number', () => {
    expect(typeof SPRING_COUNT).toBe('number')
    expect(SPRING_COUNT).toBeGreaterThan(0)
  })

  it('SCENARIOS has at least one key', () => {
    expect(Object.keys(SCENARIOS).length).toBeGreaterThanOrEqual(1)
  })

  it('SENSITIVITY_TABLE is a non-empty array', () => {
    expect(Array.isArray(SENSITIVITY_TABLE)).toBe(true)
    expect(SENSITIVITY_TABLE.length).toBeGreaterThan(0)
  })

  it('BATCHES is a non-empty array where each item has batch_id', () => {
    expect(Array.isArray(BATCHES)).toBe(true)
    expect(BATCHES.length).toBeGreaterThan(0)
    for (const b of BATCHES) {
      expect(b).toHaveProperty('batch_id')
    }
  })

  it('BENCHMARKS is a non-empty array', () => {
    expect(Array.isArray(BENCHMARKS)).toBe(true)
    expect(BENCHMARKS.length).toBeGreaterThan(0)
  })

  it('RISKS is a non-empty array', () => {
    expect(Array.isArray(RISKS)).toBe(true)
    expect(RISKS.length).toBeGreaterThan(0)
  })

  it('PILOT_PLANT_PERFORMANCE is defined and non-null', () => {
    expect(PILOT_PLANT_PERFORMANCE).toBeDefined()
    expect(PILOT_PLANT_PERFORMANCE).not.toBeNull()
  })

  it('STAKEHOLDER_REGISTER is defined and non-empty', () => {
    expect(STAKEHOLDER_REGISTER).toBeDefined()
    expect(STAKEHOLDER_REGISTER).not.toBeNull()
  })

  it('REGULATORY_LOG is a non-empty array', () => {
    expect(Array.isArray(REGULATORY_LOG)).toBe(true)
    expect(REGULATORY_LOG.length).toBeGreaterThan(0)
  })

  it('OFFTAKERS is a non-empty array', () => {
    expect(Array.isArray(OFFTAKERS)).toBe(true)
    expect(OFFTAKERS.length).toBeGreaterThan(0)
  })
})
