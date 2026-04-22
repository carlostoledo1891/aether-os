import { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import { GEO } from '../../data/geo/registry'

export const CALDEIRA_BOUNDARY_LAYER_ID = 'caldeira-boundary-line'

/**
 * Renders the outer limit of the Caldeira Project Area as a MapLibre polygon.
 * Three stacked layers (outermost → innermost):
 *   1. fill         – very faint violet tint for area awareness
 *   2. line (glow)  – wide, low-opacity cyan line for a soft halo effect
 *   3. line (edge)  – crisp dashed border
 *
 * Rendered first inside <MapBase> so it sits below all node/edge overlays.
 */
export const CaldeiraBoundary = memo(function CaldeiraBoundary() {
  const { data } = useGeoJsonFeatureCollection(GEO.boundary.url)
  if (!data) return null

  return (
    <Source id="caldeira-boundary" type="geojson" data={data}>
      {/* Subtle fill — low enough to avoid masking small pins/circles */}
      <Layer
        id="caldeira-boundary-fill"
        type="fill"
        paint={{
          'fill-color': W.violet,
          'fill-opacity': 0.02,
        }}
      />

      {/* Outer glow halo — APA-matched stroke width with soft blur */}
      <Layer
        id="caldeira-boundary-glow"
        type="line"
        paint={{
          'line-color': W.violet,
          'line-width': 1,
          'line-opacity': 0.12,
          'line-blur': 4,
        }}
      />

      {/* Solid border — APA-matched stroke width */}
      <Layer
        id="caldeira-boundary-line"
        type="line"
        paint={{
          'line-color': W.violet,
          'line-width': 1,
          'line-opacity': 1.0,
        }}
      />
    </Source>
  )
})
