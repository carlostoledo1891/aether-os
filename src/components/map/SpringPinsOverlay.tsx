import { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { useGeoJsonFeatureCollection } from './geojson'
import { GEO } from '../../data/geo/registry'

export const SPRING_PIN_LAYER_ID = 'spring-pins-core'

/**
 * Lightweight spring pin overlay for deck/presentation context.
 * Renders all springs from hydro-springs.geojson as small cyan circles
 * without requiring live EnvTelemetry data.
 */
export const SpringPinsOverlay = memo(function SpringPinsOverlay() {
  const { data } = useGeoJsonFeatureCollection(GEO.hydroSprings.url)
  if (!data) return null

  return (
    <Source id="spring-pins-source" type="geojson" data={data}>
      <Layer
        id="spring-pins-glow"
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': W.cyan,
          'circle-opacity': 0.10,
          'circle-blur': 0.8,
        }}
      />
      <Layer
        id={SPRING_PIN_LAYER_ID}
        type="circle"
        paint={{
          'circle-radius': 3,
          'circle-color': W.cyan,
          'circle-opacity': 0.72,
          'circle-stroke-color': W.overlay88,
          'circle-stroke-width': 0.6,
        }}
      />
    </Source>
  )
})
