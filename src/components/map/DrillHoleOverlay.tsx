import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type PointGeometry,
} from './geojson'
import drillholesUrl from '../../data/geojson/caldeira-drillholes.geojson?url'

type Campaign = '2022-infill' | '2023-infill' | '2024-resource' | '2025-pfs'

interface DrillHoleProperties extends FeatureProperties {
  id: string
  deposit: string
  treo_ppm: number
  mreo_pct: number
  depth_m: number
  campaign: Campaign
  note?: string
}

type DrillHoleFeature = Feature<DrillHoleProperties, PointGeometry>

export interface DrillHoleDetail {
  id: string
  deposit: string
  treo_ppm: number
  mreo_pct: number
  depth_m: number
  campaign: Campaign
  note?: string
}

export const DRILL_LAYER_ID = 'drill-hole-core'

export function toDrillHoleDetail(
  properties: Record<string, unknown>,
): DrillHoleDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    deposit: String(properties.deposit ?? ''),
    treo_ppm: Number(properties.treo_ppm ?? 0),
    mreo_pct: Number(properties.mreo_pct ?? 0),
    depth_m: Number(properties.depth_m ?? 0),
    campaign: (properties.campaign ?? '2022-infill') as Campaign,
    note: properties.note ? String(properties.note) : undefined,
  }
}

/** Circle color ramp: cyan → violet → amber for TREO grade */
function holeColor(treo: number): string {
  if (treo >= 10000) return '#FF4D4D'   // red — exceptional
  if (treo >= 5000)  return '#F5A623'   // amber — very high
  if (treo >= 3000)  return '#9D80FF'   // violet-soft — high
  if (treo >= 2200)  return '#7C5CFC'   // violet — resource grade
  return '#00D4C8'                       // cyan — lower grade
}

/** Radius scaled by depth (5–14px) */
function holeRadius(depth: number): number {
  return Math.min(14, Math.max(5, 5 + (depth / 45) * 9))
}

interface DrillHoleOverlayProps {
  hoveredHoleId?: string | null
  /** Filter to only show holes for a specific deposit */
  depositFilter?: string | null
}

export function DrillHoleOverlay({
  hoveredHoleId = null,
  depositFilter = null,
}: DrillHoleOverlayProps) {
  const raw = useGeoJsonFeatureCollection<DrillHoleFeature>(drillholesUrl)

  const data = useMemo<FeatureCollection<DrillHoleFeature> | null>(() => {
    if (!raw) return null
    const features = raw.features
      .filter(f => !depositFilter || f.properties.deposit === depositFilter)
      .map(f => {
        const treo = f.properties.treo_ppm
        const depth = f.properties.depth_m
        const isHovered = f.properties.id === hoveredHoleId
        return {
          ...f,
          properties: {
            ...f.properties,
            circleColor: holeColor(treo),
            circleRadius: holeRadius(depth) * (isHovered ? 1.5 : 1),
            circleOpacity: isHovered ? 1 : 0.78,
          },
        }
      })
    return { type: 'FeatureCollection', features }
  }, [raw, hoveredHoleId, depositFilter])

  if (!data) return null

  return (
    <Source id="drillholes-source" type="geojson" data={data}>
      {/* Glow halo */}
      <Layer
        id="drill-hole-glow"
        type="circle"
        paint={{
          'circle-color': ['get', 'circleColor'],
          'circle-radius': ['*', ['get', 'circleRadius'], 2.2],
          'circle-opacity': 0.12,
          'circle-blur': 1,
        }}
      />
      {/* Core dot */}
      <Layer
        id={DRILL_LAYER_ID}
        type="circle"
        paint={{
          'circle-color': ['get', 'circleColor'],
          'circle-radius': ['get', 'circleRadius'],
          'circle-opacity': ['get', 'circleOpacity'],
          'circle-stroke-color': '#06060F',
          'circle-stroke-width': 0.8,
        }}
      />
      {/* Hole ID labels on hover / at high zoom */}
      <Layer
        id="drill-hole-label"
        type="symbol"
        minzoom={13}
        layout={{
          'text-field': ['concat', ['get', 'id'], '\n', ['to-string', ['get', 'treo_ppm']], ' ppm'],
          'text-size': 8,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-anchor': 'top',
          'text-offset': [0, 0.8],
          'text-allow-overlap': false,
        }}
        paint={{
          'text-color': ['get', 'circleColor'],
          'text-halo-color': '#06060F',
          'text-halo-width': 1.2,
          'text-opacity': 0.8,
        }}
      />
    </Source>
  )
}
