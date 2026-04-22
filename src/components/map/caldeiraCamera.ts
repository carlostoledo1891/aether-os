import type maplibregl from 'maplibre-gl'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'

export const CALDEIRA_BBOX: [[number, number], [number, number]] = CALDEIRA_GEO.bbox

export const CALDEIRA_FIT_PADDING = {
  top: 24,
  bottom: 112,
  left: 24,
  right: 24,
} as const

export function fitMapToCaldeira(
  map: maplibregl.Map,
  options?: Pick<maplibregl.FitBoundsOptions, 'duration'>,
) {
  map.fitBounds(CALDEIRA_BBOX, {
    padding: CALDEIRA_FIT_PADDING,
    pitch: 0,
    bearing: 0,
    duration: options?.duration ?? 0,
  })
}
