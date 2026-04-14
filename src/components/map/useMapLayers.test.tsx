import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLayerSurface } from './useMapLayers'
import {
  DEFAULT_FIELD_ENV_LAYERS,
  DEFAULT_FIELD_OPS_LAYERS,
  sharedLayerStore,
} from '../../views/field/fieldMapLayers'

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
      result.current.toggle('licenses')
    })

    expect(result.current.visibleLayerIds).toEqual(['boundary', 'licenses', 'apa'])

    act(() => {
      result.current.setActiveGroups(['base'])
    })

    expect(result.current.visibleLayerIds).toEqual(['boundary', 'licenses'])
  })

  it('uses the shared field store for shared-store bound layers', () => {
    const { result } = renderHook(() =>
      useLayerSurface({ mode: 'shared-field' }),
    )

    expect(result.current.visibleLayerIds).toEqual(
      expect.arrayContaining(['licenses', 'apa']),
    )
    expect(result.current.visibleLayerIds).not.toContain('drillholes')
    expect(result.current.visibleLayerIds).not.toContain('buffer')

    act(() => {
      result.current.toggle('drillholes')
      result.current.toggle('buffer')
    })

    expect(sharedLayerStore.getOps().drillHoles).toBe(true)
    expect(sharedLayerStore.getEnv().buffer).toBe(true)
    expect(result.current.visibleLayerIds).toEqual(
      expect.arrayContaining(['drillholes', 'buffer']),
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
