import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMapCommands } from './useMapCommands'
import { mapCommandBus } from './mapCommandBus'
import { mapCommandStatusBus } from './mapCommandStatusBus'

const fieldFlyTo = vi.fn()
const fieldFitBounds = vi.fn()
const buyerFlyTo = vi.fn()
const buyerFitBounds = vi.fn()

vi.mock('react-map-gl/maplibre', () => ({
  useMap: () => ({
    current: {
      getMap: () => ({
        flyTo: fieldFlyTo,
        fitBounds: fieldFitBounds,
        getPitch: () => 4,
        getBearing: () => 8,
      }),
    },
    aetherField: {
      getMap: () => ({
        flyTo: fieldFlyTo,
        fitBounds: fieldFitBounds,
        getPitch: () => 4,
        getBearing: () => 8,
      }),
    },
    buyerField: {
      getMap: () => ({
        flyTo: buyerFlyTo,
        fitBounds: buyerFitBounds,
        getPitch: () => 0,
        getBearing: () => 12,
      }),
    },
  }),
}))

describe('useMapCommands', () => {
  beforeEach(() => {
    fieldFlyTo.mockClear()
    fieldFitBounds.mockClear()
    buyerFlyTo.mockClear()
    buyerFitBounds.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('targets the configured map id for bookmark and flyTo commands', () => {
    const { unmount } = renderHook(() =>
      useMapCommands({ mapId: 'buyerField' }),
    )

    act(() => {
      mapCommandBus.dispatch({ type: 'bookmark', bookmarkId: 'pilotPlant' })
      mapCommandBus.dispatch({
        type: 'flyTo',
        center: { lng: -46.55, lat: -21.88 },
        zoom: 11,
      })
    })

    expect(buyerFlyTo).toHaveBeenCalledTimes(2)
    expect(fieldFlyTo).not.toHaveBeenCalled()
    expect(buyerFlyTo).toHaveBeenNthCalledWith(1, expect.objectContaining({
      center: [-46.575, -21.8],
      zoom: 13.4,
    }))
    expect(buyerFlyTo).toHaveBeenNthCalledWith(2, expect.objectContaining({
      center: [-46.55, -21.88],
      zoom: 11,
    }))

    unmount()
  })

  it('ignores commands targeted to a different workspace map', () => {
    const { unmount } = renderHook(() =>
      useMapCommands({ mapId: 'aetherField' }),
    )

    act(() => {
      mapCommandBus.dispatch({
        type: 'flyTo',
        center: { lng: -46.55, lat: -21.88 },
        zoom: 11,
      }, { targetMapId: 'buyerField' })
    })

    expect(fieldFlyTo).not.toHaveBeenCalled()
    unmount()
  })

  it('forwards explicit layer visibility to the active view handler', () => {
    const onSetLayerVisibility = vi.fn(() => true)
    const { unmount } = renderHook(() =>
      useMapCommands({ onSetLayerVisibility }),
    )

    act(() => {
      mapCommandBus.dispatch({ type: 'toggleLayer', layerId: 'sigmine', visible: true })
    })

    expect(onSetLayerVisibility).toHaveBeenCalledWith('sigmine', true)
    unmount()
  })

  it('converts object bbox payloads for fitBounds and forwards highlights', () => {
    const onHighlight = vi.fn()
    const { unmount } = renderHook(() =>
      useMapCommands({ mapId: 'aetherField', onHighlight }),
    )

    act(() => {
      mapCommandBus.dispatch({
        type: 'fitBounds',
        bbox: { west: -46.7, south: -22.0, east: -46.4, north: -21.7 },
      })
      mapCommandBus.dispatch({ type: 'highlight', featureId: 'AGOAC0001' })
      mapCommandBus.dispatch({ type: 'clearHighlight' })
    })

    expect(fieldFitBounds).toHaveBeenCalledWith([[-46.7, -22], [-46.4, -21.7]], expect.any(Object))
    expect(onHighlight).toHaveBeenNthCalledWith(1, 'AGOAC0001')
    expect(onHighlight).toHaveBeenNthCalledWith(2, null)

    unmount()
  })

  it('publishes user-visible errors for unsupported commands', () => {
    const publishSpy = vi.spyOn(mapCommandStatusBus, 'publish')
    const onCommandError = vi.fn()
    const { unmount } = renderHook(() =>
      useMapCommands({ mapId: 'buyerField', onCommandError }),
    )

    act(() => {
      mapCommandBus.dispatch({ type: 'toggleLayer', layerId: 'sigmine', visible: true }, { targetMapId: 'buyerField' })
    })

    expect(onCommandError).toHaveBeenCalledWith('Layer "sigmine" is not available in the active workspace view.')
    expect(publishSpy).toHaveBeenCalledWith({
      level: 'error',
      message: 'Layer "sigmine" is not available in the active workspace view.',
      targetMapId: 'buyerField',
    })

    unmount()
    publishSpy.mockRestore()
  })
})
