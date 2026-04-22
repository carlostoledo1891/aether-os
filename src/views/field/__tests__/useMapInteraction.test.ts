import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { getUnitLookupCandidate, useMapInteraction } from '../useMapInteraction'
import { OPS_PLANT_SITE_CORE_LAYER_ID } from '../../../components/map/OpsPlantSitesOverlay'
import { HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID } from '../../../components/map/hydroLayerIds'
import { DRILL_LAYER_ID } from '../../../components/map/DrillHoleOverlay'
import { CALDEIRA_BOUNDARY_LAYER_ID } from '../../../components/map/CaldeiraBoundary'
import { ENV_APA_FILL_LAYER_ID } from '../../../components/map/EnvironmentalOverlay'
import type { MapSurface } from '../constants'

vi.mock('react-map-gl/maplibre', () => ({
  default: () => null,
  Map: () => null,
  Source: () => null,
  Layer: () => null,
  useMap: () => ({ current: null }),
}))

const DEFAULT_LAYERS = {
  deposits: true,
  drillHoles: true,
  holeTypeFilter: 'all' as const,
  plantSites: true,
  pfsEngineering: true,
  infra: true,
  accessRoutes: true,
  licenceEnvelope: true,
  neighbors: true,
  apa: true,
}

function makeFeat(layerId: string, id: string) {
  return {
    layer: { id: layerId },
    properties: { id, name: `Feature ${id}` },
    geometry: { type: 'Point' as const, coordinates: [-46.5, -21.9] },
  }
}

function makeEvent(features: ReturnType<typeof makeFeat>[]) {
  return {
    features,
    point: { x: 100, y: 100 },
    lngLat: { lng: -46.5, lat: -21.9 },
  }
}

describe('useMapInteraction', () => {
  const springsRef = { current: [] }

  it('initializes with null state values', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'operations' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )
    expect(result.current.hoveredNodeId).toBeNull()
    expect(result.current.mapHoverHint).toBeNull()
    expect(result.current.popupData).toBeNull()
    expect(result.current.selectedHydroNode).toBeNull()
    expect(result.current.geoSelection).toBeNull()
  })

  it('prioritizes point layers over polygons on operations tab', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'operations' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )

    act(() => {
      result.current.handleMouseEnter(
        makeEvent([
          makeFeat(OPS_PLANT_SITE_CORE_LAYER_ID, 'plant-1'),
        ]) as never,
      )
    })

    expect(result.current.hoveredNodeId).toBe('plant-1')
  })

  it('prioritizes hydro springs on environment tab', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'environment' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )

    act(() => {
      result.current.handleMouseEnter(
        makeEvent([
          makeFeat(HYDRO_NODE_LAYER_ID, 'hydro-1'),
          makeFeat(HYDRO_SPRING_LAYER_ID, 'spring-1'),
        ]) as never,
      )
    })

    expect(result.current.hoveredNodeId).toBe('spring-1')
  })

  it('clears hover on handleMouseLeave', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'operations' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )

    act(() => {
      result.current.handleMouseEnter(
        makeEvent([makeFeat(OPS_PLANT_SITE_CORE_LAYER_ID, 'site-1')]) as never,
      )
    })
    expect(result.current.hoveredNodeId).toBe('site-1')

    act(() => {
      result.current.handleMouseLeave()
    })
    expect(result.current.hoveredNodeId).toBeNull()
    expect(result.current.mapHoverHint).toBeNull()
    expect(result.current.popupData).toBeNull()
  })

  it('skips boundary layer when other features are present', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'operations' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )

    act(() => {
      result.current.handleMouseEnter(
        makeEvent([
          makeFeat(CALDEIRA_BOUNDARY_LAYER_ID, 'boundary'),
          makeFeat(OPS_PLANT_SITE_CORE_LAYER_ID, 'ops-site'),
        ]) as never,
      )
    })

    expect(result.current.hoveredNodeId).toBe('ops-site')
  })

  it('handles mouse move and sets hover state immediately', () => {
    const { result } = renderHook(() =>
      useMapInteraction({
        mapTab: 'operations' as MapSurface,
        opsMapLayers: DEFAULT_LAYERS,
        springsRef: springsRef as React.RefObject<never[]>,
        visibleLayerIds: [],
      }),
    )

    act(() => {
      result.current.handleMouseMove(
        makeEvent([makeFeat(DRILL_LAYER_ID, 'drill-1')]) as never,
      )
    })

    expect(result.current.popupData).not.toBeNull()
    expect(result.current.popupData?.data.title).toContain('drill-1')
  })
})

describe('getUnitLookupCandidate', () => {
  it('prefers the highest-priority unit-capable feature on operations map', () => {
    const candidate = getUnitLookupCandidate(
      [
        makeFeat(OPS_PLANT_SITE_CORE_LAYER_ID, 'PLANT-PILOT-01'),
        makeFeat(ENV_APA_FILL_LAYER_ID, 'ENV-APA-01'),
        makeFeat(DRILL_LAYER_ID, 'AGOAC0105'),
      ] as never,
      'operations',
    )

    expect(candidate).toEqual({
      placeId: 'AGOAC0105',
      layerId: DRILL_LAYER_ID,
    })
  })

  it('ignores non-unit-capable operations layers', () => {
    const candidate = getUnitLookupCandidate(
      [makeFeat(OPS_PLANT_SITE_CORE_LAYER_ID, 'PLANT-PILOT-01')] as never,
      'operations',
    )

    expect(candidate).toBeNull()
  })

  it('only resolves hydro nodes for piezometers', () => {
    const piezoCandidate = getUnitLookupCandidate(
      [{
        layer: { id: HYDRO_NODE_LAYER_ID },
        properties: { id: 'PIZ-N01', nodeType: 'piezometer' },
        geometry: { type: 'Point' as const, coordinates: [-46.5, -21.9] },
      }] as never,
      'environment',
    )
    const plantCandidate = getUnitLookupCandidate(
      [{
        layer: { id: HYDRO_NODE_LAYER_ID },
        properties: { id: 'CIP', nodeType: 'plant' },
        geometry: { type: 'Point' as const, coordinates: [-46.5, -21.9] },
      }] as never,
      'environment',
    )

    expect(piezoCandidate).toEqual({
      placeId: 'PIZ-N01',
      layerId: HYDRO_NODE_LAYER_ID,
    })
    expect(plantCandidate).toBeNull()
  })
})
