import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
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
type InfraLineFeature = Feature<InfraProperties, LineStringGeometry>

function kindColor(kind: InfraKind): string {
  switch (kind) {
    case 'plant':        return '#22D68A'
    case 'office':       return '#7C5CFC'
    case 'power':        return '#F5A623'
    case 'port':         return '#00D4C8'
    case 'road':         return 'rgba(255,255,255,0.30)'
    case 'supply-chain': return '#00D4C8'
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

interface InfraOverlayProps {
  /** Show the full supply-chain route (for BuyerView) */
  showRoute?: boolean
  /** Highlight a specific infrastructure point */
  highlightId?: string | null
}

export function InfraOverlay({ showRoute = false, highlightId = null }: InfraOverlayProps) {
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
      {lines && (
        <Source id="infra-lines-source" type="geojson" data={lines}>
          <Layer
            id="infra-line"
            type="line"
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
              'circle-color': '#22D68A',
              'circle-radius': 18,
              'circle-opacity': 0.08,
              'circle-stroke-color': '#22D68A',
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
            id="infra-point-core"
            type="circle"
            paint={{
              'circle-color': ['get', 'dotColor'],
              'circle-radius': ['get', 'dotRadius'],
              'circle-opacity': ['get', 'dotOpacity'],
              'circle-stroke-color': '#06060F',
              'circle-stroke-width': 1.5,
            }}
          />
          <Layer
            id="infra-point-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'label'],
              'text-size': 10,
              'text-font': ['Open Sans SemiBold', 'Arial Unicode MS Regular'],
              'text-anchor': 'top',
              'text-offset': [0, 0.9],
              'text-allow-overlap': false,
            }}
            paint={{
              'text-color': ['get', 'dotColor'],
              'text-halo-color': '#06060F',
              'text-halo-width': 1.5,
              'text-opacity': 0.9,
            }}
          />
        </Source>
      )}
    </>
  )
}
