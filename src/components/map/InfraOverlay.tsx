import { useEffect, useMemo, useRef } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import type { Map } from 'maplibre-gl'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureProperties,
  type PointGeometry,
  type LineStringGeometry,
} from './geojson'
import infraUrl from '../../data/geojson/caldeira-infrastructure.geojson?url'

type InfraKind = 'plant' | 'office' | 'power' | 'port' | 'road' | 'supply-chain'

interface InfraProperties extends FeatureProperties {
  id: string
  label: string
  sublabel: string
  kind: InfraKind
  status: string
}

type InfraPointFeature = Feature<InfraProperties, PointGeometry>

function kindColor(kind: InfraKind): string {
  switch (kind) {
    case 'plant':        return W.green
    case 'office':       return W.violet
    case 'power':        return W.amber
    case 'port':         return W.cyan
    case 'road':         return 'rgba(255,255,255,0.30)'
    case 'supply-chain': return W.cyan
  }
}

function kindRadius(kind: InfraKind): number {
  switch (kind) {
    case 'plant':  return 10
    case 'office': return 7
    case 'power':  return 7
    case 'port':   return 12
    default:       return 6
  }
}

/**
 * Even-length line-dasharray; dash grows / gap shrinks monotonically then loops
 * (forward flow only — no symmetric ping-pong).
 */
const SUPPLY_DASH_SEQUENCE: [number, number][] = [
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

const SUPPLY_DASH_LAYER_ID = 'infra-supply-line-dash'

/** Interactive hit target for infrastructure points (pilot, office, etc.) */
export const INFRA_POINT_CORE_LAYER_ID = 'infra-point-core'

function SupplyRouteDashAnimator({
  mapId,
  enabled,
}: {
  mapId: string
  enabled: boolean
}) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const stepRef = useRef(0)

  useEffect(() => {
    if (!enabled || !mapRef) return
    const map = (mapRef as { getMap: () => Map }).getMap()
    let raf = 0

    const tick = (t: number) => {
      const step = Math.floor(t / 48) % SUPPLY_DASH_SEQUENCE.length
      if (step !== stepRef.current) {
        stepRef.current = step
        try {
          if (map.getLayer(SUPPLY_DASH_LAYER_ID)) {
            map.setPaintProperty(SUPPLY_DASH_LAYER_ID, 'line-dasharray', SUPPLY_DASH_SEQUENCE[step])
          }
        } catch {
          /* style swapping / layer not ready */
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mapRef, enabled])

  return null
}

interface InfraOverlayProps {
  /** Show the full supply-chain route (for BuyerView) */
  showRoute?: boolean
  /** `Map` id from MapBase — required for supply-route dash animation when `showRoute` */
  mapId?: string
  /** Highlight a specific infrastructure point */
  highlightId?: string | null
}

export function InfraOverlay({ showRoute = false, mapId = 'aetherField', highlightId = null }: InfraOverlayProps) {
  const raw = useGeoJsonFeatureCollection(infraUrl)

  const points = useMemo(() => {
    if (!raw) return null
    const features = (raw.features as Feature<InfraProperties, PointGeometry>[])
      .filter(f => f.geometry.type === 'Point')
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          dotColor: kindColor(f.properties.kind as InfraKind),
          dotRadius: kindRadius(f.properties.kind as InfraKind),
          dotOpacity: highlightId && highlightId !== f.properties.id ? 0.4 : 1,
        },
      }))
    return { type: 'FeatureCollection' as const, features }
  }, [raw, highlightId])

  const lines = useMemo(() => {
    if (!raw) return null
    const features = (raw.features as Feature<InfraProperties, LineStringGeometry>[])
      .filter(f => {
        if (f.geometry.type !== 'LineString') return false
        if (f.properties.kind === 'supply-chain') return showRoute
        return true
      })
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          lineColor: kindColor(f.properties.kind as InfraKind),
          lineWidth: f.properties.kind === 'supply-chain' ? 2 : 1.5,
          lineDash: f.properties.kind === 'supply-chain' ? 1 : (f.properties.status === 'planned' ? 1 : 0),
        },
      }))
    return { type: 'FeatureCollection' as const, features }
  }, [raw, showRoute])

  const pilotPulse = useMemo(() => {
    if (!raw) return null
    const features = (raw.features as InfraPointFeature[])
      .filter(f => f.geometry.type === 'Point' && f.properties.id === 'PILOT-PLANT')
    return { type: 'FeatureCollection' as const, features }
  }, [raw])

  return (
    <>
      {showRoute && <SupplyRouteDashAnimator mapId={mapId} enabled />}
      {lines && (
        <Source id="infra-lines-source" type="geojson" data={lines}>
          {/* Roads & mine access — excludes export corridor (drawn below when showRoute) */}
          <Layer
            id="infra-line"
            type="line"
            filter={showRoute ? ['!=', ['get', 'kind'], 'supply-chain'] : undefined}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{
              'line-color': ['get', 'lineColor'],
              'line-width': ['get', 'lineWidth'],
              'line-opacity': 0.6,
              'line-dasharray': [
                'case',
                ['==', ['get', 'lineDash'], 1],
                ['literal', [5, 3]],
                ['literal', [1, 0]],
              ],
            }}
          />
          {/* Must be direct children of Source (no Fragment): react-map-gl injects `source` via cloneElement */}
          {showRoute ? (
            <Layer
              id="infra-supply-line-base"
              type="line"
              filter={['==', ['get', 'kind'], 'supply-chain']}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': ['get', 'lineColor'],
                'line-width': 3,
                'line-opacity': 0.28,
              }}
            />
          ) : null}
          {showRoute ? (
            <Layer
              id={SUPPLY_DASH_LAYER_ID}
              type="line"
              filter={['==', ['get', 'kind'], 'supply-chain']}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': ['get', 'lineColor'],
                'line-width': 2,
                'line-opacity': 0.88,
                  'line-dasharray': [0.25, 4.75],
              }}
            />
          ) : null}
        </Source>
      )}

      {pilotPulse && (
        <Source id="infra-pilot-pulse-source" type="geojson" data={pilotPulse}>
          {/* Animated outer ring for the operational pilot plant */}
          <Layer
            id="infra-pilot-pulse"
            type="circle"
            paint={{
              'circle-color': W.green,
              'circle-radius': 18,
              'circle-opacity': 0.08,
              'circle-stroke-color': W.green,
              'circle-stroke-width': 1,
              'circle-stroke-opacity': 0.25,
            }}
          />
        </Source>
      )}

      {points && (
        <Source id="infra-points-source" type="geojson" data={points}>
          <Layer
            id="infra-point-glow"
            type="circle"
            paint={{
              'circle-color': ['get', 'dotColor'],
              'circle-radius': ['*', ['get', 'dotRadius'], 2],
              'circle-opacity': 0.12,
              'circle-blur': 1,
            }}
          />
          <Layer
            id={INFRA_POINT_CORE_LAYER_ID}
            type="circle"
            paint={{
              'circle-color': ['get', 'dotColor'],
              'circle-radius': ['get', 'dotRadius'],
              'circle-opacity': ['get', 'dotOpacity'],
              'circle-stroke-color': W.mapHalo,
              'circle-stroke-width': 1.5,
            }}
          />
          <Layer
            id="infra-point-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'label'],
              'text-size': 10,
              'text-font': ['Open Sans Regular'],
              'text-anchor': 'top',
              'text-offset': [0, 0.9],
              'text-allow-overlap': false,
            }}
            paint={{
              'text-color': ['get', 'dotColor'],
              'text-halo-color': W.mapHalo,
              'text-halo-width': 1.5,
              'text-opacity': 0.9,
            }}
          />
        </Source>
      )}
    </>
  )
}
