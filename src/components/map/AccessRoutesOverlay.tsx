import { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import { GEO } from '../../data/geo/registry'

export const ACCESS_ROUTE_LINE_LAYER_ID = 'access-route-line'

export const AccessRoutesOverlay = memo(function AccessRoutesOverlay() {
  const data = useGeoJsonFeatureCollection(GEO.routes.url)
  if (!data) return null

  return (
    <Source id="access-routes-source" type="geojson" data={data}>
      <Layer
        id={ACCESS_ROUTE_LINE_LAYER_ID}
        type="line"
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': W.textInverse,
          'line-width': 2,
          'line-opacity': 0.1925,
          'line-dasharray': [4, 3],
        }}
      />
    </Source>
  )
})
