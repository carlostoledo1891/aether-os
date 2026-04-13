import { memo, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type PointGeometry,
} from './geojson'
import { GEO } from '../../data/geo/registry'
import { HYDRO_SPRING_PIN_RADIUS_DEFAULT_PX } from './springPinStyle'

export type DrillCampaign =
  | '2022-infill'
  | '2023-infill'
  | '2024-resource'
  | '2025-pfs'
  | '2025-discovery'

export type DrillHoleType = 'DD' | 'AC' | 'AUGER'

interface DrillHoleProperties {
  [key: string]: unknown
  id: string
  deposit: string
  treo_ppm: number
  mreo_pct: number
  depth_m: number
  campaign: DrillCampaign
  hole_type: DrillHoleType
  note: string | null
  intercept?: string | null
  including?: string | null
  hmreo_ppm?: number
  prnd_ppm?: number
  source_ref?: string
  as_of?: string
  lithology_intervals?: { from_m: number; to_m: number; lithology: string; weathering: string }[]
}

type DrillHoleFeature = Feature<DrillHoleProperties, PointGeometry>

export interface DrillHoleDetail {
  id: string
  deposit: string
  treo_ppm: number
  mreo_pct: number
  depth_m: number
  campaign: DrillCampaign
  hole_type: DrillHoleType
  note: string | null
  intercept?: string
  including?: string
  hmreo_ppm?: number
  prnd_ppm?: number
  source_ref?: string
  as_of?: string
  lithology_intervals?: { from_m: number; to_m: number; lithology: string; weathering: string }[]
}

export const DRILL_LAYER_ID = 'drill-hole-core'

export function parseLithologyIntervals(
  raw: unknown,
): { from_m: number; to_m: number; lithology: string; weathering: string }[] | undefined {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch { /* not valid JSON */ }
  }
  return undefined
}

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
    campaign: (properties.campaign ?? '2022-infill') as DrillCampaign,
    hole_type: (properties.hole_type ?? 'AC') as DrillHoleType,
    note: properties.note ? String(properties.note) : null,
    source_ref: properties.source_ref ? String(properties.source_ref) : undefined,
    as_of: properties.as_of ? String(properties.as_of) : undefined,
    intercept: properties.intercept ? String(properties.intercept) : undefined,
    including: properties.including ? String(properties.including) : undefined,
    lithology_intervals: parseLithologyIntervals(properties.lithology_intervals),
  }
}

/** Circle color ramp: light purple → deep purple for TREO grade */
function holeColor(treo: number): string {
  if (treo >= 10000) return '#7E22CE'       // purple-700 — exceptional
  if (treo >= 5000)  return '#A855F7'       // purple-500 — very high
  if (treo >= 3000)  return W.violetSoft    // #9D80FF — high
  if (treo >= 2200)  return W.violet        // #7C5CFC — resource grade
  return '#C4B5FD'                          // violet-200 — lower grade
}

interface DrillHoleOverlayProps {
  hoveredHoleId?: string | null
  /** Filter to only show holes for a specific deposit */
  depositFilter?: string | null
  /** Filter by collar type */
  holeTypeFilter?: DrillHoleType | 'all'
  /** Filter by exact hole IDs */
  drillIds?: string[] | null
}

export const DrillHoleOverlay = memo(function DrillHoleOverlay({
  hoveredHoleId = null,
  depositFilter = null,
  holeTypeFilter = 'all',
  drillIds = null,
}: DrillHoleOverlayProps) {
  const raw = useGeoJsonFeatureCollection<DrillHoleFeature>(GEO.drillholes.url)

  const data = useMemo<FeatureCollection<DrillHoleFeature> | null>(() => {
    if (!raw) return null
    const features = raw.features
      .filter(f => !depositFilter || f.properties.deposit === depositFilter)
      .filter(f => holeTypeFilter === 'all' || f.properties.hole_type === holeTypeFilter)
      .filter(f => !drillIds || drillIds.length === 0 || drillIds.includes(f.properties.id))
      .map(f => {
        const treo = f.properties.treo_ppm
        const isHovered = f.properties.id === hoveredHoleId
        return {
          ...f,
          properties: {
            ...f.properties,
            circleColor: holeColor(treo),
            circleRadius: HYDRO_SPRING_PIN_RADIUS_DEFAULT_PX,
            circleOpacity: isHovered ? 1 : 0.78,
          },
        }
      })
    return { type: 'FeatureCollection', features }
  }, [raw, hoveredHoleId, depositFilter, holeTypeFilter, drillIds])

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
          'circle-stroke-color': W.mapHalo,
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
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'top',
          'text-offset': [0, 0.8],
          'text-allow-overlap': false,
        }}
        paint={{
          'text-color': ['get', 'circleColor'],
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.2,
          'text-opacity': 0.8,
        }}
      />
    </Source>
  )
})
