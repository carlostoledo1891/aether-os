import { memo, useMemo } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { Layer, Source } from 'react-map-gl/maplibre'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureProperties,
  type PointGeometry,
  type LineStringGeometry,
} from './geojson'
import { GEO } from '../../data/geo/registry'

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

/** Interactive hit target for infrastructure points (pilot, office, etc.) */
export const INFRA_POINT_CORE_LAYER_ID = 'infra-point-core'

interface InfraOverlayProps {
  /** `Map` id from MapBase */
  mapId?: string
  /** Highlight a specific infrastructure point */
  highlightId?: string | null
}

export const InfraOverlay = memo(function InfraOverlay({ highlightId = null }: InfraOverlayProps) {
  const raw = useGeoJsonFeatureCollection(GEO.infra.url)

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
      .filter(f => f.geometry.type === 'LineString' && f.properties.kind !== 'supply-chain')
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          lineColor: kindColor(f.properties.kind as InfraKind),
          lineWidth: 1.5,
          lineDash: f.properties.status === 'planned' ? 1 : 0,
        },
      }))
    return { type: 'FeatureCollection' as const, features }
  }, [raw])

  const pilotPulse = useMemo(() => {
    if (!raw) return null
    const features = (raw.features as InfraPointFeature[])
      .filter(f => f.geometry.type === 'Point' && f.properties.id === 'PILOT-PLANT')
    return { type: 'FeatureCollection' as const, features }
  }, [raw])

  return (
    <>
      {lines && (
        <Source id="infra-lines-source" type="geojson" data={lines}>
          {/* Roads & mine access */}
          <Layer
            id="infra-line"
            type="line"
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
})
