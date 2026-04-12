/**
 * Map Presets — "Come dressed this way."
 *
 * Every map consumer picks a preset instead of hand-wiring 20-40 lines of
 * overlay imports, camera configuration, and interactivity flags.
 *
 * Usage:
 *   const preset = useMapPreset('deck-geology')
 *   <MapBase {...preset.viewProps}>
 *     <MapOverlays layers={preset.overlays} />
 *   </MapBase>
 */

import { useMemo } from 'react'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'

import { CALDEIRA_BOUNDARY_LAYER_ID } from './CaldeiraBoundary'
import { LICENSE_LAYER_ID } from './LicenseOverlay'
import { DRILL_LAYER_ID } from './DrillHoleOverlay'
import { SPRING_PIN_LAYER_ID } from './SpringPinsOverlay'
import { ENV_APA_FILL_LAYER_ID } from './EnvironmentalOverlay'
import { PFS_ENGINEERING_FILL_LAYER_ID } from './PfsEngineeringOverlay'
import { INFRA_POINT_CORE_LAYER_ID } from './InfraOverlay'
import { OPS_PLANT_SITE_CORE_LAYER_ID } from './OpsPlantSitesOverlay'
import { HYDRO_NODE_LAYER_ID } from './hydroLayerIds'

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

export type OverlayKey =
  | 'boundary'
  | 'licenses'
  | 'drillholes'
  | 'pfs'
  | 'environmental'
  | 'hydroSprings'
  | 'hydroNodes'
  | 'infra'
  | 'plantSites'
  | 'weather'

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
  overlays: OverlayKey[]
  interactiveLayerIds: string[]
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
    overlays: ['boundary', 'licenses', 'pfs', 'drillholes', 'plantSites', 'infra'],
    interactiveLayerIds: [
      DRILL_LAYER_ID,
      LICENSE_LAYER_ID,
      PFS_ENGINEERING_FILL_LAYER_ID,
      OPS_PLANT_SITE_CORE_LAYER_ID,
      INFRA_POINT_CORE_LAYER_ID,
      CALDEIRA_BOUNDARY_LAYER_ID,
    ],
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
    overlays: ['boundary', 'licenses', 'environmental', 'hydroSprings', 'hydroNodes', 'weather'],
    interactiveLayerIds: [
      SPRING_PIN_LAYER_ID,
      HYDRO_NODE_LAYER_ID,
      ENV_APA_FILL_LAYER_ID,
      LICENSE_LAYER_ID,
      CALDEIRA_BOUNDARY_LAYER_ID,
    ],
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
    overlays: ['boundary', 'licenses', 'drillholes', 'environmental'],
    interactiveLayerIds: [
      LICENSE_LAYER_ID,
      ENV_APA_FILL_LAYER_ID,
      DRILL_LAYER_ID,
    ],
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
    overlays: [],
    interactiveLayerIds: [],
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
    overlays: ['boundary', 'licenses', 'drillholes'],
    interactiveLayerIds: [
      DRILL_LAYER_ID,
      LICENSE_LAYER_ID,
      CALDEIRA_BOUNDARY_LAYER_ID,
    ],
    showLayerPicker: false,
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
    overlays: ['boundary', 'environmental', 'hydroSprings', 'weather'],
    interactiveLayerIds: [
      SPRING_PIN_LAYER_ID,
      ENV_APA_FILL_LAYER_ID,
      CALDEIRA_BOUNDARY_LAYER_ID,
    ],
    showLayerPicker: false,
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
    overlays: ['boundary', 'licenses', 'environmental', 'plantSites'],
    interactiveLayerIds: [],
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
    overlays: [],
    interactiveLayerIds: [],
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
      overlays: overrides.overlays ?? base.overlays,
      interactiveLayerIds: overrides.interactiveLayerIds ?? base.interactiveLayerIds,
      showLayerPicker: overrides.showLayerPicker ?? base.showLayerPicker,
    }
  }, [key, overrides])
}

export { PRESETS as MAP_PRESETS }
