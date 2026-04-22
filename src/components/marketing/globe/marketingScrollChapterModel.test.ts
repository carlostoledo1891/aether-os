import { describe, expect, it } from 'vitest'
import {
  getMarketingBeatCount,
  getMarketingBeatIndexForProgress,
  getMarketingProgressForBeatMid,
} from './marketingScrollChapterModel'

describe('marketingScrollChapterModel', () => {
  it('exports six chapters', () => {
    expect(getMarketingBeatCount()).toBe(6)
  })

  it('maps progress to beat index including fly gaps', () => {
    expect(getMarketingBeatIndexForProgress(0)).toBe(0)
    expect(getMarketingBeatIndexForProgress(0.08)).toBe(0)
    // Gap after thesis (0.16–0.19): still "previous" beat for orientation
    expect(getMarketingBeatIndexForProgress(0.17)).toBe(0)
    expect(getMarketingBeatIndexForProgress(0.2)).toBe(1)
    expect(getMarketingBeatIndexForProgress(0.5)).toBe(2)
    expect(getMarketingBeatIndexForProgress(1)).toBe(5)
  })

  it('clamps progress', () => {
    expect(getMarketingBeatIndexForProgress(-0.5)).toBe(0)
    expect(getMarketingBeatIndexForProgress(2)).toBe(5)
  })

  it('returns midpoints for chapter navigation', () => {
    expect(getMarketingProgressForBeatMid(0)).toBeCloseTo(0.08, 5)
    expect(getMarketingProgressForBeatMid(5)).toBeCloseTo(0.935, 5)
  })
})
