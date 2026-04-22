import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLayerSurface } from './useMapLayers'
import {
  DEFAULT_FIELD_ENV_LAYERS,
  DEFAULT_FIELD_OPS_LAYERS,
  sharedLayerStore,
} from './sharedLayerStore'

vi.mock('react-map-gl/maplibre', () => ({
  default: () => null,
  Map: () => null,
  Source: () => null,
  Layer: () => null,
  useMap: () => ({ current: null }),
}))

function resetSharedLayerStore() {
  sharedLayerStore.setOps(() => ({ ...DEFAULT_FIELD_OPS_LAYERS }))
  sharedLayerStore.setEnv(() => ({ ...DEFAULT_FIELD_ENV_LAYERS }))
}

describe('useLayerSurface', () => {
  beforeEach(() => {
    resetSharedLayerStore()
  })

  it('derives visible and interactive layers from local preset ids', () => {
    const { result } = renderHook(() =>
      useLayerSurface({ mode: 'local', initialLayerIds: ['boundary', 'apa'] }),
    )

    expect(result.current.visibleLayerIds).toEqual(['boundary', 'apa'])
    expect(result.current.interactiveLayerIds).toEqual(
      expect.arrayContaining(['caldeira-boundary-line', 'env-apa-fill', 'env-apa-label']),
    )

    act(() => {
      result.current.toggle('terrain')
    })

    expect(result.current.visibleLayerIds).toEqual(['boundary', 'apa', 'terrain'])

    act(() => {
      result.current.setActiveGroups(['terrain'])
    })

    expect(result.current.visibleLayerIds).toEqual(['terrain'])
  })

  it('uses the shared field store for shared-store bound layers', () => {
    const { result } = renderHook(() =>
      useLayerSurface({ mode: 'shared-field' }),
    )

    expect(result.current.visibleLayerIds).toEqual(
      expect.arrayContaining(['apa', 'drillholes']),
    )
    expect(result.current.visibleLayerIds).not.toContain('plantSites')
    expect(result.current.visibleLayerIds).not.toContain('buffer')

    act(() => {
      result.current.toggle('plantSites')
      result.current.toggle('buffer')
    })

    expect(sharedLayerStore.getOps().plantSites).toBe(true)
    expect(sharedLayerStore.getEnv().buffer).toBe(true)
    expect(result.current.visibleLayerIds).toEqual(
      expect.arrayContaining(['plantSites', 'buffer']),
    )
  })

  it('keeps local-only terrain toggles local in shared-field mode', () => {
    const { result } = renderHook(() =>
      useLayerSurface({ mode: 'shared-field' }),
    )

    act(() => {
      result.current.toggle('terrain')
    })

    expect(result.current.visibleLayerIds).toContain('terrain')
    expect(sharedLayerStore.getOps()).toEqual(DEFAULT_FIELD_OPS_LAYERS)
    expect(sharedLayerStore.getEnv()).toEqual(DEFAULT_FIELD_ENV_LAYERS)
  })
})
