/**
 * Map Presets — "Come dressed this way."
 *
 * Every map consumer picks a preset instead of hand-wiring 20-40 lines of
 * overlay imports, camera configuration, and interactivity flags.
 *
 * Usage:
 *   const preset = useMapPreset('deck-geology')
 *   <MapBase {...preset.viewProps} />
 */

import { useMemo } from 'react'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'

export type MapStyleId = 'satellite' | 'operations' | 'topo'

export type MapPresetKey =
  | 'field-ops'
  | 'field-env'
  | 'buyer'
  | 'deck-cover'
  | 'deck-geology'
  | 'deck-hydro'
  | 'story-map'
  | 'traceability'

import type { LayerId } from './layerRegistry'

/**
 * Presets now describe only the starting layer composition for a surface.
 */
export type OverlayKey = LayerId

export interface MapPresetViewProps {
  initialViewState: {
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
  }
  interactive: boolean
  disableZoomControls: boolean
  hideControls: boolean
  highlightWater: boolean
  forceStyle?: MapStyleId
}

export interface MapPreset {
  viewProps: MapPresetViewProps
  layerIds: LayerId[]
  showLayerPicker: boolean
}

const C = CALDEIRA_GEO

const SITE_VIEW = {
  longitude: C.center[0],
  latitude: C.center[1],
  zoom: C.defaultZoom,
  pitch: C.defaultPitch,
  bearing: C.defaultBearing,
}

const PRESETS: Record<MapPresetKey, MapPreset> = {
  'field-ops': {
    viewProps: {
      initialViewState: SITE_VIEW,
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: undefined,
    },
    layerIds: ['boundary', 'licenses', 'apa', 'pfs', 'drillholes', 'plantSites', 'infra'],
    showLayerPicker: true,
  },

  'field-env': {
    viewProps: {
      initialViewState: SITE_VIEW,
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: true,
      forceStyle: undefined,
    },
    layerIds: ['boundary', 'licenses', 'apa', 'hydroSprings'],
    showLayerPicker: true,
  },

  buyer: {
    viewProps: {
      initialViewState: SITE_VIEW,
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: undefined,
    },
    layerIds: ['boundary', 'licenses', 'drillholes', 'apa'],
    showLayerPicker: true,
  },

  'deck-cover': {
    viewProps: {
      initialViewState: { ...SITE_VIEW, zoom: 11.5, pitch: 50, bearing: -15 },
      interactive: false,
      disableZoomControls: true,
      hideControls: true,
      highlightWater: false,
      forceStyle: 'satellite',
    },
    layerIds: [],
    showLayerPicker: false,
  },

  'deck-geology': {
    viewProps: {
      initialViewState: { ...SITE_VIEW, zoom: 10.5, pitch: 40, bearing: 0 },
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: 'satellite',
    },
    layerIds: ['boundary', 'licenses', 'apa', 'drillholes', 'geosgbGeology'],
    showLayerPicker: true,
  },

  'deck-hydro': {
    viewProps: {
      initialViewState: { ...SITE_VIEW, zoom: 11, pitch: 30, bearing: 10 },
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: 'satellite',
    },
    layerIds: ['boundary', 'licenses', 'apa', 'hydroSprings'],
    showLayerPicker: true,
  },

  'story-map': {
    viewProps: {
      initialViewState: { ...SITE_VIEW, pitch: 30, bearing: 0 },
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: undefined,
    },
    layerIds: ['boundary', 'licenses', 'apa', 'plantSites'],
    showLayerPicker: false,
  },

  traceability: {
    viewProps: {
      initialViewState: { longitude: 40, latitude: 5, zoom: 1.5, pitch: 0, bearing: 0 },
      interactive: true,
      disableZoomControls: false,
      hideControls: false,
      highlightWater: false,
      forceStyle: 'satellite',
    },
    layerIds: [],
    showLayerPicker: false,
  },
}

export function useMapPreset(
  key: MapPresetKey,
  overrides?: Partial<MapPreset>,
): MapPreset {
  return useMemo(() => {
    const base = PRESETS[key]
    if (!overrides) return base
    return {
      viewProps: { ...base.viewProps, ...overrides.viewProps },
      layerIds: overrides.layerIds ?? base.layerIds,
      showLayerPicker: overrides.showLayerPicker ?? base.showLayerPicker,
    }
  }, [key, overrides])
}

export { PRESETS as MAP_PRESETS }
