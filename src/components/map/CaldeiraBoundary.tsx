import { Layer, Source } from 'react-map-gl/maplibre'
import { useGeoJsonFeatureCollection } from './geojson'
import caldeiraBoundaryUrl from '../../data/geojson/caldeira-boundary.geojson?url'

/**
 * Renders the outer limit of the Caldeira Project Area as a MapLibre polygon.
 * Three stacked layers (outermost → innermost):
 *   1. fill         – very faint violet tint for area awareness
 *   2. line (glow)  – wide, low-opacity cyan line for a soft halo effect
 *   3. line (edge)  – crisp dashed border
 *
 * Rendered first inside <MapBase> so it sits below all node/edge overlays.
 */
export function CaldeiraBoundary() {
  const data = useGeoJsonFeatureCollection(caldeiraBoundaryUrl)
  if (!data) return null

  return (
    <Source id="caldeira-boundary" type="geojson" data={data}>
      {/* Subtle fill */}
      <Layer
        id="caldeira-boundary-fill"
        type="fill"
        paint={{
          'fill-color': '#7C5CFC',
          'fill-opacity': 0.04,
        }}
      />

      {/* Outer glow halo — wide, soft, low opacity */}
      <Layer
        id="caldeira-boundary-glow"
        type="line"
        paint={{
          'line-color': '#00D4C8',
          'line-width': 6,
          'line-opacity': 0.10,
          'line-blur': 4,
        }}
      />

      {/* Crisp dashed border */}
      <Layer
        id="caldeira-boundary-line"
        type="line"
        paint={{
          'line-color': '#9D80FF',
          'line-width': 1.5,
          'line-opacity': 0.55,
          'line-dasharray': [6, 4],
        }}
      />
    </Source>
  )
}
