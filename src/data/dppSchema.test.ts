import { describe, it, expect } from 'vitest'
import { validateDppExport, getDppCoverage, buildDppExport, DPP_FIELD_MAPPINGS } from './dppSchema'

describe('DPP Schema Validation', () => {
  it('returns correct coverage stats for empty export', () => {
    const result = validateDppExport({})
    expect(result.coverage_pct).toBeGreaterThan(0)
    expect(result.field_count.total).toBe(22)
    expect(result.field_count.mapped + result.field_count.stub + result.field_count.pending).toBe(22)
  })

  it('marks empty export as valid (no pending Identification fields)', () => {
    const result = validateDppExport({})
    expect(result.errors).toHaveLength(0)
    expect(result.valid).toBe(true)
  })

  it('warns about mapped-but-missing required fields in empty export', () => {
    const result = validateDppExport({})
    const mappedButMissing = result.warnings.filter(w => w.includes('mapped but value not provided'))
    expect(mappedButMissing.length).toBe(4)
  })

  it('warns about stub fields needing review', () => {
    const result = validateDppExport({})
    const stubWarnings = result.warnings.filter(w => w.includes('stub implementation'))
    const stubCount = DPP_FIELD_MAPPINGS.filter(f => f.status === 'stub').length
    expect(stubWarnings).toHaveLength(stubCount)
  })

  it('warns about missing schema_version and regulation_ref', () => {
    const result = validateDppExport({})
    expect(result.warnings.some(w => w.includes('schema_version'))).toBe(true)
    expect(result.warnings.some(w => w.includes('regulation_ref'))).toBe(true)
  })

  it('suppresses schema_version warning when provided', () => {
    const result = validateDppExport({ schema_version: '0.1.0-draft' })
    expect(result.warnings.some(w => w.includes('schema_version'))).toBe(false)
  })
})

describe('getDppCoverage', () => {
  it('returns expected structure', () => {
    const cov = getDppCoverage()
    expect(cov.total).toBe(22)
    expect(cov.pct).toBeGreaterThanOrEqual(0)
    expect(cov.pct).toBeLessThanOrEqual(100)
  })

  it('sums mapped + stub + pending to total', () => {
    const cov = getDppCoverage()
    expect(cov.mapped + cov.stub + cov.pending).toBe(cov.total)
  })

  it('computes pct as rounded mapped/total ratio', () => {
    const cov = getDppCoverage()
    expect(cov.pct).toBe(Math.round((cov.mapped / cov.total) * 100))
  })
})

describe('buildDppExport', () => {
  const sampleBatch = {
    batch_id: 'CAL-2026-042',
    batch_date: '2026-03-15',
    tonnage_kg: 18500,
    feoc_percentage: 0,
    ira_compliant: true,
    carbon_intensity: { value: 3.2, tier: 'Premium', vs_chinese_baseline: -68 },
  }

  it('produces a valid DPP export with all required top-level fields', () => {
    const dpp = buildDppExport(sampleBatch, null)
    expect(dpp.schema_version).toBe('0.1.0-draft')
    expect(dpp.regulation_ref).toBe('EU 2023/1542 Annex VI')
    expect(dpp.batch_id).toBe('CAL-2026-042')
    expect(dpp.export_timestamp).toBeTruthy()
    expect(dpp.coverage.total).toBe(22)
  })

  it('maps batch values into DPP fields', () => {
    const dpp = buildDppExport(sampleBatch, null)
    expect(dpp.fields.unique_battery_identifier.value).toBe('CAL-2026-042')
    expect(dpp.fields.batch_weight_kg.value).toBe(18500)
    expect(dpp.fields.carbon_footprint_total.value).toBe(3.2)
    expect(dpp.fields.carbon_footprint_class.value).toBe('Premium')
  })

  it('marks pending fields with null value', () => {
    const dpp = buildDppExport(sampleBatch, null)
    expect(dpp.fields.rated_capacity.value).toBeNull()
    expect(dpp.fields.rated_capacity.status).toBe('pending')
  })

  it('incorporates U/Th safety data when provided', () => {
    const safety = { primary_mineral: 'halloysite', u_th_profile: '<2 ppm eU' }
    const dpp = buildDppExport(sampleBatch, safety)
    expect(dpp.fields.hazardous_substances.status).toBe('mapped')
    expect(dpp.fields.hazardous_substances.value).toContain('halloysite')
  })

  it('falls back to stub when U/Th safety is null', () => {
    const dpp = buildDppExport(sampleBatch, null)
    expect(dpp.fields.hazardous_substances.status).toBe('stub')
    expect(dpp.fields.hazardous_substances.value).toBeNull()
  })

  it('includes FEOC compliance data', () => {
    const dpp = buildDppExport(sampleBatch, null)
    expect(dpp.fields.feoc_compliance.value).toEqual({ feoc_pct: 0, ira_compliant: true })
    expect(dpp.fields.feoc_compliance.status).toBe('mapped')
  })
})
