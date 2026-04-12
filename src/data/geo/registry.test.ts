import { describe, it, expect } from 'vitest'
import { GEO } from './registry'

const entries = Object.values(GEO)

describe('GEO registry', () => {
  it('every entry has a non-empty id string', () => {
    for (const entry of entries) {
      expect(typeof entry.id).toBe('string')
      expect(entry.id.length).toBeGreaterThan(0)
    }
  })

  it('every entry has a non-empty url string', () => {
    for (const entry of entries) {
      expect(typeof entry.url).toBe('string')
      expect(entry.url.length).toBeGreaterThan(0)
    }
  })

  it('every kind is one of polygon, point, line', () => {
    const validKinds = new Set(['polygon', 'point', 'line'])
    for (const entry of entries) {
      expect(validKinds.has(entry.kind)).toBe(true)
    }
  })

  it('all IDs are unique', () => {
    const ids = entries.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  describe('renderOrder conventions', () => {
    it('all polygon entries have renderOrder < 20', () => {
      for (const entry of entries.filter((e) => e.kind === 'polygon')) {
        expect((entry as any).renderOrder).toBeLessThan(20)
      }
    })

    it('all line entries have 20 <= renderOrder < 30', () => {
      for (const entry of entries.filter((e) => (e.kind as string) === 'line')) {
        expect((entry as any).renderOrder).toBeGreaterThanOrEqual(20)
        expect((entry as any).renderOrder).toBeLessThan(30)
      }
    })

    it('all point entries have renderOrder >= 30', () => {
      for (const entry of entries.filter((e) => e.kind === 'point')) {
        expect((entry as any).renderOrder).toBeGreaterThanOrEqual(30)
      }
    })
  })

  it('has at least 10 entries', () => {
    expect(entries.length).toBeGreaterThanOrEqual(10)
  })
})
