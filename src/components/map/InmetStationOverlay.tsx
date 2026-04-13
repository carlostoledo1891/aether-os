/**
 * InmetStationOverlay — INMET automatic weather station markers near Caldeira.
 *
 * Shows official Brazilian National Meteorological Institute stations in
 * the Poços de Caldas region as vector markers.  Station catalogue sourced
 * from INMET's public CSV (portal.inmet.gov.br/paginas/catalogoaut).
 *
 * Static GeoJSON avoids CORS / HTTP-only issues with the live WIS2 API.
 */

import { memo, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

export const INMET_STATION_LAYER_ID = 'inmet-station-circle'
const INMET_LABEL_LAYER_ID = 'inmet-station-label'

interface Station {
  code: string
  name: string
  lat: number
  lng: number
  altitude: number
  type: 'automatic' | 'conventional'
}

const NEARBY_STATIONS: Station[] = [
  { code: 'A862', name: 'Caldas',          lat: -21.917, lng: -46.383, altitude: 1150, type: 'automatic' },
  { code: 'A866', name: 'Machado',         lat: -21.680, lng: -45.920, altitude: 870,  type: 'automatic' },
  { code: 'A515', name: 'Poços de Caldas', lat: -21.842, lng: -46.540, altitude: 1260, type: 'automatic' },
  { code: 'A867', name: 'Alfenas',         lat: -21.428, lng: -45.947, altitude: 810,  type: 'automatic' },
  { code: 'A519', name: 'São Lourenço',    lat: -22.105, lng: -45.028, altitude: 930,  type: 'automatic' },
  { code: 'A514', name: 'Varginha',        lat: -21.551, lng: -45.430, altitude: 920,  type: 'automatic' },
]

function buildGeoJSON(stations: Station[]) {
  return {
    type: 'FeatureCollection' as const,
    features: stations.map(s => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] },
      properties: {
        code: s.code,
        name: s.name,
        altitude: s.altitude,
        type: s.type,
        label: `${s.code} · ${s.name}`,
      },
    })),
  }
}

export const InmetStationOverlay = memo(function InmetStationOverlay() {
  const geojson = useMemo(() => buildGeoJSON(NEARBY_STATIONS), [])

  return (
    <Source
      id="inmet-stations"
      type="geojson"
      data={geojson}
      attribution="Fonte: INMET – Rede de Estações Automáticas"
    >
      <Layer
        id={INMET_STATION_LAYER_ID}
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': '#06b6d4',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        }}
      />
      <Layer
        id={INMET_LABEL_LAYER_ID}
        type="symbol"
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 10,
          'text-offset': [0, 1.6],
          'text-anchor': 'top',
          'text-font': ['Open Sans Semibold'],
          'text-max-width': 12,
        }}
        paint={{
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        }}
      />
    </Source>
  )
})
