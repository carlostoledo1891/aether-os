import { describe, it, expect } from 'vitest'
import { registerWidget, getWidget, listWidgets } from '../WidgetRegistry'

describe('WidgetRegistry', () => {
  it('registerWidget + getWidget round-trips', () => {
    const Dummy = () => null
    registerWidget('test-dummy', Dummy)
    expect(getWidget('test-dummy')).toBe(Dummy)
  })

  it('getWidget returns undefined for unknown type', () => {
    expect(getWidget('does-not-exist-xyz')).toBeUndefined()
  })

  it('listWidgets returns all registered keys', () => {
    const keys = listWidgets()
    expect(Array.isArray(keys)).toBe(true)
    expect(keys.length).toBeGreaterThan(0)
    expect(keys).toContain('metric-card')
  })

  describe('default registrations', () => {
    const expected = [
      'metric-card',
      'metric-display',
      'glass-card',
      'section-block',
      'data-grid',
      'status-chip',
      'spark-line',
      'gauge-chart',
      'bar-comparison',
    ]

    it.each(expected)('has "%s" registered', (type) => {
      expect(getWidget(type)).toBeDefined()
    })

    it('has all 9 default registrations', () => {
      const keys = listWidgets()
      for (const type of expected) {
        expect(keys).toContain(type)
      }
    })
  })
})
