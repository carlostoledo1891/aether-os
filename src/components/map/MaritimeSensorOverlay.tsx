/**
 * MaritimeSensorOverlay — renders coverage halos and anchor points for
 * shore radars, satellite-pass centroids, and drone orbit centres.
 * Halo radius scales with the sensor station's `range_km` value;
 * smaller anchor symbol marks the source.
 *
 * Composition only: same Source/Layer pattern as the other overlays.
 */

import { memo, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { MARITIME_SENSOR_STATIONS } from '../../data/maritime/fixtures/sensorStations'
import type { SensorKind, SensorStation } from '../../data/maritime/types'

const SENSOR_COLORS: Record<SensorKind, string> = {
  shore_radar: '#A78BFA',
  satellite_pass: '#22D3EE',
  drone_orbit: '#FBBF24',
}

function sensorsToFeatureCollection(sensors: SensorStation[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: sensors.map(s => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: s.coordinates },
      properties: {
        id: s.id,
        name: s.name,
        kind: s.kind,
        range_km: s.range_km,
        // Convert km to a *visual* radius in meters for circle-radius
        // pixel scaling. MapLibre `circle-radius` is in pixels — we map
        // range_km to a base 6px and scale linearly.
        anchor_color: SENSOR_COLORS[s.kind],
      },
    })),
  }
}

export const MaritimeSensorOverlay = memo(function MaritimeSensorOverlay() {
  const data = useMemo(() => sensorsToFeatureCollection(MARITIME_SENSOR_STATIONS), [])

  return (
    <Source id="maritime-sensors" type="geojson" data={data}>
      <Layer
        id="maritime-sensor-halo"
        type="circle"
        paint={{
          // Coverage halo — scales with zoom and a tunable factor.
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            5, ['/', ['get', 'range_km'], 4],
            8, ['/', ['get', 'range_km'], 1.5],
            10, ['*', ['get', 'range_km'], 1.0],
          ],
          'circle-color': ['get', 'anchor_color'],
          'circle-opacity': 0.06,
          'circle-stroke-color': ['get', 'anchor_color'],
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.45,
        }}
      />
      <Layer
        id="maritime-sensor-anchor"
        type="circle"
        paint={{
          'circle-radius': 4,
          'circle-color': ['get', 'anchor_color'],
          'circle-opacity': 0.95,
          'circle-stroke-color': '#0B1120',
          'circle-stroke-width': 1.2,
        }}
      />
    </Source>
  )
})
