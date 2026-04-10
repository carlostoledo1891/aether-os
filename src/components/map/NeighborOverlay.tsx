import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import { GEO } from '../../data/geo/registry'

export function NeighborOverlay() {
  const data = useGeoJsonFeatureCollection(GEO.neighbors.url)
  if (!data) return null

  return (
    <Source id="caldeira-neighbors" type="geojson" data={data}>
      <Layer
        id="neighbor-fill"
        type="fill"
        paint={{
          'fill-color': W.border3,
          'fill-opacity': 0.05,
        }}
      />
      <Layer
        id="neighbor-line"
        type="line"
        paint={{
          'line-color': W.border3,
          'line-width': 1.2,
          'line-opacity': 0.35,
          'line-dasharray': [5, 4],
        }}
      />
      <Layer
        id="neighbor-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-size': 9,
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': 'rgba(72,72,112,0.60)',
          'text-halo-color': 'rgba(6,6,16,0.90)',
          'text-halo-width': 1.0,
        }}
      />
    </Source>
  )
}
