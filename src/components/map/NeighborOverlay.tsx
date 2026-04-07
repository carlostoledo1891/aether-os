import { Layer, Source } from 'react-map-gl/maplibre'
import { useGeoJsonFeatureCollection } from './geojson'
import neighborsUrl from '../../data/geojson/caldeira-neighbors.geojson?url'

export function NeighborOverlay() {
  const data = useGeoJsonFeatureCollection(neighborsUrl)
  if (!data) return null

  return (
    <Source id="caldeira-neighbors" type="geojson" data={data}>
      <Layer
        id="neighbor-fill"
        type="fill"
        paint={{
          'fill-color': '#484870',
          'fill-opacity': 0.05,
        }}
      />
      <Layer
        id="neighbor-line"
        type="line"
        paint={{
          'line-color': '#484870',
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
