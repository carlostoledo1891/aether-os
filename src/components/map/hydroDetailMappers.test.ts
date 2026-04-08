import { describe, it, expect } from 'vitest'
import { tierShort, toSpringDetail, toHydroNodeDetail } from './hydroDetailMappers'
import type { SpringTelemetry } from '../../types/telemetry'

describe('hydroDetailMappers', () => {
  it('tierShort maps monitoring tiers', () => {
    expect(tierShort('direct')).toBe('Direct')
    expect(tierShort('sentinel_proxy')).toBe('Sentinel')
    expect(tierShort('modeled_inferred')).toBe('Inferred')
  })

  it('toSpringDetail returns null without string id', () => {
    expect(toSpringDetail({}, [-46, -21], undefined)).toBeNull()
  })

  it('toSpringDetail merges telem and properties', () => {
    const telem: SpringTelemetry = {
      id: 's1',
      status: 'Reduced',
      monitoring_tier: 'direct',
      method: 'field_gauge',
      last_field_visit: '2026-01-15',
      linked_sensor_id: 'pz-1',
      data_sources: ['a', 'b'],
    }
    const d = toSpringDetail(
      { id: 's1', name: 'Spring A', municipio: 'X', car_registered: true },
      [-46.1, -21.2],
      telem,
    )
    expect(d).toMatchObject({
      id: 's1',
      label: 'Spring A',
      nodeType: 'spring',
      statusLabel: 'Reduced',
      monitoringTier: 'direct',
      method: 'field_gauge',
      coordinates: [-46.1, -21.2],
    })
    expect(d?.metric).toContain('Direct')
  })

  it('toHydroNodeDetail maps node properties', () => {
    const d = toHydroNodeDetail(
      {
        id: 'n1',
        label: 'Piezo 1',
        sublabel: 'Deep',
        nodeType: 'piezometer',
        metric: '1.2 m',
        statusLabel: 'Normal',
      },
      [-46, -21],
    )
    expect(d).toMatchObject({
      id: 'n1',
      label: 'Piezo 1',
      nodeType: 'piezometer',
      coordinates: [-46, -21],
    })
  })
})
