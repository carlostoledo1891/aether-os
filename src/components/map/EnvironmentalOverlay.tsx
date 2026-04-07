import { Layer, Source } from 'react-map-gl/maplibre'
import { useGeoJsonFeatureCollection } from './geojson'
import envUrl from '../../data/geojson/caldeira-environmental.geojson?url'

export function EnvironmentalOverlay() {
  const data = useGeoJsonFeatureCollection(envUrl)
  if (!data) return null

  return (
    <Source id="caldeira-env" type="geojson" data={data}>
      {/* APA Pedra Branca — protected area fill */}
      <Layer
        id="env-apa-fill"
        type="fill"
        filter={['==', ['get', 'kind'], 'protected-area']}
        paint={{
          'fill-color': '#22D68A',
          'fill-opacity': 0.06,
        }}
      />
      <Layer
        id="env-apa-line"
        type="line"
        filter={['==', ['get', 'kind'], 'protected-area']}
        paint={{
          'line-color': '#22D68A',
          'line-width': 1.8,
          'line-opacity': 0.55,
          'line-dasharray': [4, 3],
        }}
      />
      <Layer
        id="env-apa-label"
        type="symbol"
        filter={['==', ['get', 'kind'], 'protected-area']}
        layout={{
          'text-field': ['get', 'label'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 10,
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': 'rgba(34,214,138,0.75)',
          'text-halo-color': 'rgba(6,6,16,0.95)',
          'text-halo-width': 1.2,
        }}
      />

      {/* 3 km buffer zone — dashed outline */}
      <Layer
        id="env-buffer-fill"
        type="fill"
        filter={['==', ['get', 'kind'], 'buffer-zone']}
        paint={{
          'fill-color': '#F5A623',
          'fill-opacity': 0.04,
        }}
      />
      <Layer
        id="env-buffer-line"
        type="line"
        filter={['==', ['get', 'kind'], 'buffer-zone']}
        paint={{
          'line-color': '#F5A623',
          'line-width': 1.4,
          'line-opacity': 0.45,
          'line-dasharray': [6, 4],
        }}
      />

      {/* Water monitoring zone — cyan fill */}
      <Layer
        id="env-monitoring-fill"
        type="fill"
        filter={['==', ['get', 'kind'], 'monitoring-zone']}
        paint={{
          'fill-color': '#00D4C8',
          'fill-opacity': 0.06,
        }}
      />
      <Layer
        id="env-monitoring-line"
        type="line"
        filter={['==', ['get', 'kind'], 'monitoring-zone']}
        paint={{
          'line-color': '#00D4C8',
          'line-width': 1.2,
          'line-opacity': 0.50,
          'line-dasharray': [3, 2.5],
        }}
      />
    </Source>
  )
}
