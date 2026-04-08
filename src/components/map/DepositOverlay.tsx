import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import {
  emptyFeatureCollection,
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type PolygonGeometry,
} from './geojson'
import depositsUrl from '../../data/geojson/caldeira-deposits.geojson?url'

type DepositStatus = 'measured' | 'indicated' | 'inferred' | 'exploration'

interface DepositProperties extends FeatureProperties {
  id: string
  name: string
  status: DepositStatus
  treo_ppm: number
  mreo_pct: number
  tonnage_mt: number
  clay_depth_avg_m: number
  clay_depth_max_m: number
  area_km2: number
  orientation: string
  dimensions: string
  resource_note: string
}

type DepositFeature = Feature<DepositProperties, PolygonGeometry>

export interface DepositDetail {
  id: string
  name: string
  status: DepositStatus
  treo_ppm: number
  mreo_pct: number
  tonnage_mt: number
  clay_depth_avg_m: number
  clay_depth_max_m: number
  dimensions: string
  resource_note: string
}

export const DEPOSIT_LAYER_ID = 'deposit-fill'

export function toDepositDetail(
  properties: Record<string, unknown>,
): DepositDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    name: String(properties.name ?? ''),
    status: (properties.status ?? 'exploration') as DepositStatus,
    treo_ppm: Number(properties.treo_ppm ?? 0),
    mreo_pct: Number(properties.mreo_pct ?? 0),
    tonnage_mt: Number(properties.tonnage_mt ?? 0),
    clay_depth_avg_m: Number(properties.clay_depth_avg_m ?? 0),
    clay_depth_max_m: Number(properties.clay_depth_max_m ?? 0),
    dimensions: String(properties.dimensions ?? ''),
    resource_note: String(properties.resource_note ?? ''),
  }
}

/** Fill color keyed by TREO grade: green = rich, violet = mid, cyan = lower */
function treoFillColor(treo: number): string {
  if (treo >= 3500) return W.amber   // ultra-high grade
  if (treo >= 2800) return W.violet  // high grade
  if (treo >= 2200) return W.cyan    // resource grade
  return W.violetSoft                // exploration
}

/** Outline color by deposit status */
function statusLineColor(status: DepositStatus): string {
  switch (status) {
    case 'measured':    return W.green
    case 'indicated':   return W.violet
    case 'inferred':    return W.cyan
    case 'exploration': return W.amber
  }
}

interface DepositOverlayProps {
  hoveredDepositId?: string | null
  selectedDepositId?: string | null
  /** Optional: fade non-highlighted deposits (used in BuyerView) */
  highlightId?: string | null
}

export function DepositOverlay({
  hoveredDepositId = null,
  selectedDepositId = null,
  highlightId = null,
}: DepositOverlayProps) {
  const raw = useGeoJsonFeatureCollection<DepositFeature>(depositsUrl)

  const data = useMemo<FeatureCollection<DepositFeature> | null>(() => {
    if (!raw) return null
    return {
      type: 'FeatureCollection',
      features: raw.features.map(f => {
        const status = f.properties.status
        const treo = f.properties.treo_ppm
        const isHighlighted = highlightId ? f.properties.id === highlightId : true
        const isHovered = f.properties.id === hoveredDepositId
        const isSelected = f.properties.id === selectedDepositId
        const fillOpacity = isHighlighted
          ? (isSelected ? 0.42 : isHovered ? 0.36 : 0.22)
          : 0.06
        return {
          ...f,
          properties: {
            ...f.properties,
            fillColor: treoFillColor(treo),
            fillOpacity,
            lineColor: statusLineColor(status),
            lineWidth: isSelected ? 3 : isHovered ? 2 : 1.5,
            lineDash: status === 'exploration' ? 1 : 0,
          },
        }
      }),
    }
  }, [raw, hoveredDepositId, selectedDepositId, highlightId])

  const hoverData = useMemo(
    () => data?.features.find(f => f.properties.id === hoveredDepositId)
      ? { type: 'FeatureCollection' as const, features: data!.features.filter(f => f.properties.id === hoveredDepositId) }
      : emptyFeatureCollection<DepositFeature>(),
    [data, hoveredDepositId],
  )

  if (!data) return null

  return (
    <>
      <Source id="deposits-source" type="geojson" data={data}>
        {/* Grade fill */}
        <Layer
          id={DEPOSIT_LAYER_ID}
          type="fill"
          paint={{
            'fill-color': ['get', 'fillColor'],
            'fill-opacity': ['get', 'fillOpacity'],
          }}
        />
        {/* Status outline */}
        <Layer
          id="deposit-outline"
          type="line"
          paint={{
            'line-color': ['get', 'lineColor'],
            'line-width': ['get', 'lineWidth'],
            'line-opacity': 0.75,
            'line-dasharray': [
              'case',
              ['==', ['get', 'lineDash'], 1],
              ['literal', [5, 3]],
              ['literal', [1, 0]],
            ],
          }}
        />
        {/* Name + resource label (always shown) */}
        <Layer
          id="deposit-label-name"
          type="symbol"
          layout={{
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-font': ['Open Sans Bold'],
            'text-anchor': 'center',
            'text-offset': [0, -0.6],
            'text-allow-overlap': false,
          }}
          paint={{
            'text-color': ['get', 'lineColor'],
            'text-halo-color': W.mapHalo,
            'text-halo-width': 1.5,
            'text-opacity': 0.9,
          }}
        />
        <Layer
          id="deposit-label-grade"
          type="symbol"
          layout={{
            'text-field': [
              'case',
              ['>', ['get', 'tonnage_mt'], 0],
              ['concat', ['to-string', ['get', 'tonnage_mt']], ' Mt · ', ['to-string', ['get', 'treo_ppm']], ' ppm'],
              ['concat', ['to-string', ['get', 'treo_ppm']], ' ppm peak'],
            ],
            'text-size': 9,
            'text-font': ['Open Sans Regular'],
            'text-anchor': 'center',
            'text-offset': [0, 0.6],
            'text-allow-overlap': false,
          }}
          paint={{
            'text-color': W.text1,
            'text-halo-color': W.mapHalo,
            'text-halo-width': 1.2,
            'text-opacity': 0.75,
          }}
        />
      </Source>

      {/* Hover glow outline */}
      <Source id="deposits-hover-source" type="geojson" data={hoverData}>
        <Layer
          id="deposit-hover-glow"
          type="line"
          paint={{
            'line-color': W.textInverse,
            'line-width': 3,
            'line-opacity': 0.3,
            'line-blur': 3,
          }}
        />
      </Source>
    </>
  )
}
