/**
 * MaritimeVesselOverlay — animated AIS-style vessel positions on top
 * of the maritime workspace map. Uses the same Source/Layer pattern as
 * the AOI / sensor overlays. Animation is driven by the existing
 * `useAnimatedMaritimeVessels()` hook (`src/services/maritimeMockDataService.ts`),
 * which polls a setInterval — same pattern as the Caldeira mock telemetry.
 *
 * Dark vessels render with a distinct color and a solid stroke so the
 * eye picks them out immediately. AIS-tracked vessels render with a
 * type-keyed fill.
 */

import { memo, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { useAnimatedMaritimeVessels } from '../../services/maritimeMockDataService'
import type { VesselRecord, VesselType } from '../../data/maritime/types'

const TYPE_COLORS: Record<VesselType, string> = {
  cargo: '#38BDF8',
  tanker: '#0EA5E9',
  fishing: '#22D3EE',
  passenger: '#A78BFA',
  patrol: '#22C55E',
  unknown: '#94A3B8',
}

const DARK_COLOR = '#F43F5E'

function vesselsToFeatureCollection(vessels: VesselRecord[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: vessels
      .filter(v => v.track.length > 0)
      .map(v => {
        const last = v.track[v.track.length - 1]
        const isDark = !!v.flaggedDark
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [last.lng, last.lat] },
          properties: {
            id: v.id,
            mmsi: v.mmsi,
            name: v.name,
            flag: v.flag,
            type: v.type,
            heading: last.heading,
            speed: last.speed,
            isDark,
            color: isDark ? DARK_COLOR : TYPE_COLORS[v.type],
          },
        } satisfies GeoJSON.Feature
      }),
  }
}

export const MaritimeVesselOverlay = memo(function MaritimeVesselOverlay() {
  const vessels = useAnimatedMaritimeVessels()
  const data = useMemo(() => vesselsToFeatureCollection(vessels), [vessels])

  return (
    <Source id="maritime-vessels" type="geojson" data={data}>
      <Layer
        id="maritime-vessel-glow"
        type="circle"
        filter={['==', ['get', 'isDark'], true]}
        paint={{
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            5, 6,
            10, 14,
          ],
          'circle-color': DARK_COLOR,
          'circle-opacity': 0.18,
          'circle-blur': 0.6,
        }}
      />
      <Layer
        id="maritime-vessel-marker"
        type="circle"
        paint={{
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            5, 2.5,
            8, 4,
            12, 6,
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.95,
          'circle-stroke-color': [
            'case', ['==', ['get', 'isDark'], true],
            '#FECDD3',
            'rgba(15,23,42,0.85)',
          ],
          'circle-stroke-width': [
            'case', ['==', ['get', 'isDark'], true], 1.5, 0.8,
          ],
        }}
      />
    </Source>
  )
})
