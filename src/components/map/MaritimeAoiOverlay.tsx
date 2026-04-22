/**
 * MaritimeAoiOverlay — renders the Atlantic Maritime Areas of Interest
 * as a fill+line layer using the same react-map-gl/maplibre Source/Layer
 * pattern as `EnvironmentalOverlay` (Caldeira). No new map primitives.
 */

import { memo, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { MARITIME_AOIS } from '../../data/maritime/fixtures/aois'
import type { AoiClassification, MaritimeAoi } from '../../data/maritime/types'

const CLASSIFICATION_COLORS: Record<AoiClassification, string> = {
  patrol: '#38BDF8',
  restricted: '#F43F5E',
  commercial_lane: '#A78BFA',
  environmental: '#22C55E',
}

function aoisToFeatureCollection(aois: MaritimeAoi[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: aois.map(a => ({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [a.ring] },
      properties: {
        id: a.id,
        name: a.name,
        classification: a.classification,
        color: CLASSIFICATION_COLORS[a.classification],
      },
    })),
  }
}

export const MaritimeAoiOverlay = memo(function MaritimeAoiOverlay() {
  const data = useMemo(() => aoisToFeatureCollection(MARITIME_AOIS), [])

  return (
    <Source id="maritime-aois" type="geojson" data={data}>
      <Layer
        id="maritime-aoi-fill"
        type="fill"
        paint={{
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.08,
        }}
      />
      <Layer
        id="maritime-aoi-line"
        type="line"
        paint={{
          'line-color': ['get', 'color'],
          'line-width': 1.4,
          'line-opacity': 0.75,
          'line-dasharray': [2, 2],
        }}
      />
      <Layer
        id="maritime-aoi-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 11,
          'text-allow-overlap': false,
          'text-offset': [0, 0.5],
        }}
        paint={{
          'text-color': '#E2E8F0',
          'text-halo-color': 'rgba(2,6,18,0.92)',
          'text-halo-width': 1.4,
        }}
      />
    </Source>
  )
})
