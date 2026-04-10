import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import {
  useGeoJsonFeatureCollection,
  type Feature,
  type FeatureCollection,
  type FeatureProperties,
  type PolygonGeometry,
} from './geojson'
import { GEO } from '../../data/geo/registry'

type LicenseStatus = 'lp_approved' | 'li_pending' | 'exploration' | 'inferred'

interface LicenseProperties extends FeatureProperties {
  id: string
  name: string
  label: string
  status: LicenseStatus
  area_km2: number
  license_count: number
  note: string
}

type LicenseFeature = Feature<LicenseProperties, PolygonGeometry>

export interface LicenseDetail {
  id: string
  name: string
  label: string
  status: LicenseStatus
  area_km2: number
  license_count: number
  note: string
  source_ref?: string
  as_of?: string
  confidence?: string
  resource_category?: string
  total_mt?: number
}

export const LICENSE_LAYER_ID = 'license-fill'

export function toLicenseDetail(
  properties: Record<string, unknown>,
): LicenseDetail | null {
  const id = properties.id
  if (typeof id !== 'string') return null
  return {
    id,
    name: String(properties.name ?? ''),
    label: String(properties.label ?? ''),
    status: (properties.status ?? 'exploration') as LicenseStatus,
    area_km2: Number(properties.area_km2 ?? 0),
    license_count: Number(properties.license_count ?? 0),
    note: String(properties.note ?? ''),
    source_ref: properties.source_ref ? String(properties.source_ref) : undefined,
    as_of: properties.as_of ? String(properties.as_of) : undefined,
    confidence: properties.confidence ? String(properties.confidence) : undefined,
    resource_category: properties.resource_category ? String(properties.resource_category) : undefined,
    total_mt: typeof properties.total_mt === 'number' ? properties.total_mt : undefined,
  }
}

const LICENSE_COLORS = { fill: W.violet, line: W.violetSoft } as const

interface LicenseOverlayProps {
  hoveredLicenseId?: string | null
  selectedLicenseId?: string | null
}

export function LicenseOverlay({
  hoveredLicenseId = null,
  selectedLicenseId = null,
}: LicenseOverlayProps) {
  const raw = useGeoJsonFeatureCollection<LicenseFeature>(GEO.licenses.url)

  const data = useMemo<FeatureCollection<LicenseFeature> | null>(() => {
    if (!raw) return null
    return {
      type: 'FeatureCollection',
      features: raw.features.map(f => {
        const isHovered = f.properties.id === hoveredLicenseId
        const isSelected = f.properties.id === selectedLicenseId
        return {
          ...f,
          properties: {
            ...f.properties,
            fillColor: LICENSE_COLORS.fill,
            fillOpacity: isSelected ? 0.16 : isHovered ? 0.12 : 0.07,
            lineColor: LICENSE_COLORS.line,
            lineWidth: isSelected ? 2.5 : isHovered ? 2 : 1.5,
          },
        }
      }),
    }
  }, [raw, hoveredLicenseId, selectedLicenseId])

  if (!data) return null

  return (
    <Source id="licenses-source" type="geojson" data={data}>
      <Layer
        id={LICENSE_LAYER_ID}
        type="fill"
        paint={{
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': ['get', 'fillOpacity'],
        }}
      />
      <Layer
        id="license-outline"
        type="line"
        paint={{
          'line-color': ['get', 'lineColor'],
          'line-width': ['get', 'lineWidth'],
          'line-opacity': 0.70,
        }}
      />
      <Layer
        id="license-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'center',
          'text-allow-overlap': false,
          'text-max-width': 10,
        }}
        paint={{
          'text-color': ['get', 'lineColor'],
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.5,
          'text-opacity': 0.85,
        }}
      />
      <Layer
        id="license-label-area"
        type="symbol"
        layout={{
          'text-field': ['concat', ['to-string', ['get', 'area_km2']], ' km²  ·  ', ['to-string', ['get', 'license_count']], ' licences'],
          'text-size': 8.5,
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'center',
          'text-offset': [0, 1.2],
          'text-allow-overlap': false,
        }}
        paint={{
          'text-color': W.text2,
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.2,
          'text-opacity': 0.7,
        }}
      />
    </Source>
  )
}
