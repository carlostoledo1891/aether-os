import { memo, useEffect, useMemo, useRef } from 'react'
import type { Map } from 'maplibre-gl'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import type { ComplianceLedger } from '../../types/telemetry'

interface TraceRouteOverlayProps {
  timeline: ComplianceLedger['molecular_timeline']
  mapId?: string
  selectedStepIndex?: number | null
}

const DASH_SEQUENCE: [number, number][] = [
  [0.25, 4.75],
  [0.5, 4.5],
  [0.75, 4.25],
  [1, 4],
  [1.25, 3.75],
  [1.5, 3.5],
  [1.75, 3.25],
  [2, 3],
  [2.25, 2.75],
  [2.5, 2.5],
  [2.75, 2.25],
  [3, 2],
  [3.25, 1.75],
  [3.5, 1.5],
  [3.75, 1.25],
  [4, 1],
  [4.25, 0.75],
  [4.5, 0.5],
]

const DASH_LAYER_ID = 'trace-route-dash'

export const TraceRouteOverlay = memo(function TraceRouteOverlay({ timeline, mapId = 'buyerField' }: TraceRouteOverlayProps) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const stepRef = useRef(0)

  const lineGeoJson = useMemo(() => {
    const coords = timeline
      .filter(step => step.coordinates != null)
      .map(step => [step.coordinates?.lng ?? 0, step.coordinates?.lat ?? 0] as [number, number])

    if (coords.length < 2) return null

    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: coords,
          }
        }
      ]
    }
  }, [timeline])

  useEffect(() => {
    if (!mapRef || !lineGeoJson) return
    const map = (mapRef as { getMap: () => Map }).getMap()
    let raf = 0

    const tick = (t: number) => {
      const step = Math.floor(t / 48) % DASH_SEQUENCE.length
      if (step !== stepRef.current) {
        stepRef.current = step
        try {
          if (map.getLayer(DASH_LAYER_ID)) {
            map.setPaintProperty(DASH_LAYER_ID, 'line-dasharray', DASH_SEQUENCE[step])
          }
        } catch {
          /* style swapping / layer not ready */
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mapRef, lineGeoJson])

  if (!lineGeoJson) return null

  return (
    <Source id="trace-route-source" type="geojson" data={lineGeoJson as never}>
      <Layer
        id="trace-route-base"
        type="line"
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': W.cyan,
          'line-width': 1.5,
          'line-opacity': 0.28,
        }}
      />
      <Layer
        id={DASH_LAYER_ID}
        type="line"
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': W.cyan,
          'line-width': 1,
          'line-opacity': 0.88,
          'line-dasharray': [0.25, 4.75],
        }}
      />
    </Source>
  )
})
