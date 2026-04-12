import type { LicenseDetail } from '../../components/map/LicenseOverlay'
import type { DrillHoleDetail } from '../../components/map/DrillHoleOverlay'
import type { PfsEngineeringDetail } from '../../components/map/PfsEngineeringOverlay'

export interface EnvMapFeatureDetail {
  id: string
  label: string
  kind: string
  note: string
  source_ref: string
  as_of: string
  confidence?: string
  sublabel?: string
  authority?: string
  municipality?: string
  state?: string
  area_ha?: number
  perimeter_km?: number
  description?: string
}

export interface AccessRouteMapDetail {
  id: string
  label: string
  note: string
  source_ref: string
  as_of: string
  confidence?: string
}

export interface LicenceEnvelopeMapDetail {
  id: string
  label: string
  note: string
  area_km2: number
  source_ref: string
  as_of: string
  confidence?: string
}

export interface BoundaryMapDetail {
  name: string
  area_km2: number
  type: string
  age: string
  geology: string
}

export function toAccessRouteDetail(props: Record<string, unknown>): AccessRouteMapDetail | null {
  const id = props.id
  if (typeof id !== 'string') return null
  return {
    id,
    label: String(props.label ?? ''),
    note: String(props.note ?? ''),
    source_ref: String(props.source_ref ?? ''),
    as_of: String(props.as_of ?? ''),
    confidence: props.confidence ? String(props.confidence) : undefined,
  }
}

export function toLicenceEnvelopeDetail(props: Record<string, unknown>): LicenceEnvelopeMapDetail | null {
  const id = props.id
  if (typeof id !== 'string') return null
  if (String(props.kind ?? '') !== 'licence-envelope') return null
  return {
    id,
    label: String(props.label ?? ''),
    note: String(props.note ?? ''),
    area_km2: Number(props.area_km2 ?? 0),
    source_ref: String(props.source_ref ?? ''),
    as_of: String(props.as_of ?? ''),
    confidence: props.confidence ? String(props.confidence) : undefined,
  }
}

export type FieldMapGeoSelection =
  | { kind: 'license'; detail: LicenseDetail }
  | { kind: 'drill'; detail: DrillHoleDetail }
  | { kind: 'pfs'; detail: PfsEngineeringDetail }
  | {
      kind: 'infra'
      id: string
      label: string
      sublabel: string
      infraKind: string
      /** Ops plant sites: long-form narrative from GeoJSON */
      details?: string
      source_ref?: string
      as_of?: string
      confidence?: string
    }
  | { kind: 'env'; detail: EnvMapFeatureDetail }
  | { kind: 'route'; detail: AccessRouteMapDetail }
  | { kind: 'licenceEnvelope'; detail: LicenceEnvelopeMapDetail }
  | { kind: 'boundary'; detail: BoundaryMapDetail }
