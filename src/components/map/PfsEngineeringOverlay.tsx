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

export type EngineeringKind = 'pfs-pit' | 'processing-plant' | 'spent-clay'

interface PfsProperties extends FeatureProperties {
  id: string
  label: string
  engineering_kind: EngineeringKind
  note?: string
  source_ref?: string
  as_of?: string
  confidence?: string
}

type PfsFeature = Feature<PfsProperties, PolygonGeometry>

export const PFS_ENGINEERING_FILL_LAYER_ID = 'pfs-engineering-fill'

export interface PfsEngineeringDetail {
  id: string
  label: string
  engineering_kind: EngineeringKind
  note: string
  source_ref: string
  as_of: string
  confidence: string
}

export function toPfsEngineeringDetail(props: Record<string, unknown>): PfsEngineeringDetail | null {
  const id = props.id
  if (typeof id !== 'string') return null
  return {
    id,
    label: String(props.label ?? ''),
    engineering_kind: (props.engineering_kind ?? 'pfs-pit') as EngineeringKind,
    note: String(props.note ?? ''),
    source_ref: String(props.source_ref ?? ''),
    as_of: String(props.as_of ?? ''),
    confidence: String(props.confidence ?? ''),
  }
}

function kindColor(kind: EngineeringKind): { fill: string; line: string } {
  switch (kind) {
    case 'pfs-pit':
      return { fill: W.amber, line: W.amber }
    case 'processing-plant':
      return { fill: W.green, line: W.green }
    case 'spent-clay':
      return { fill: W.violet, line: W.violetSoft }
  }
}

interface PfsEngineeringOverlayProps {
  hoveredId?: string | null
  selectedId?: string | null
}

export function PfsEngineeringOverlay({
  hoveredId = null,
  selectedId = null,
}: PfsEngineeringOverlayProps) {
  const raw = useGeoJsonFeatureCollection<PfsFeature>(GEO.pfs.url)

  const data = useMemo<FeatureCollection<PfsFeature> | null>(() => {
    if (!raw) return null
    return {
      type: 'FeatureCollection',
      features: raw.features.map((f) => {
        const { fill, line } = kindColor(f.properties.engineering_kind)
        const h = f.properties.id === hoveredId
        const s = f.properties.id === selectedId
        return {
          ...f,
          properties: {
            ...f.properties,
            fillColor: fill,
            fillOpacity: s ? 0.22 : h ? 0.16 : 0.10,
            lineColor: line,
            lineWidth: s ? 2.5 : h ? 2 : 1.2,
          },
        }
      }),
    }
  }, [raw, hoveredId, selectedId])

  if (!data) return null

  return (
    <Source id="pfs-engineering-source" type="geojson" data={data}>
      <Layer
        id={PFS_ENGINEERING_FILL_LAYER_ID}
        type="fill"
        paint={{
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': ['get', 'fillOpacity'],
        }}
      />
      <Layer
        id="pfs-engineering-outline"
        type="line"
        paint={{
          'line-color': ['get', 'lineColor'],
          'line-width': ['get', 'lineWidth'],
          'line-opacity': 0.65,
        }}
      />
      <Layer
        id="pfs-engineering-label"
        type="symbol"
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 9,
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'center',
          'text-max-width': 14,
        }}
        paint={{
          'text-color': ['get', 'lineColor'],
          'text-halo-color': W.mapHalo,
          'text-halo-width': 1.2,
          'text-opacity': 0.85,
        }}
      />
    </Source>
  )
}
