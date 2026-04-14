import { getCaldeiraLayer } from 'shared/sites/caldeiraLayers'
import { W } from '../../app/canvas/canvasTheme'
import type { DataProvenanceKind } from '../../services/dataService'
import type { DataSourceKind } from '../ui/DataSourceBadge'
import type { MapPopupData } from './MapFeaturePopup'

export interface ExternalLayerPresentation extends MapPopupData {
  layerId: string
  layerLabel: string
  provider?: string
}

function asString(value: unknown) {
  if (value == null) return null
  const next = String(value).trim()
  return next || null
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function compactRows(rows: Array<{ label: string; value: unknown }>) {
  return rows
    .map(row => ({
      label: row.label,
      value: asString(row.value),
    }))
    .filter((row): row is { label: string; value: string } => row.value !== null)
}

function resolveAccent(group: string | undefined) {
  switch (group) {
    case 'geology':
      return W.amber
    case 'hydrology':
      return W.cyan
    case 'environment':
      return W.green
    default:
      return W.violet
  }
}

function buildBadgeInfo(kind: 'live-query' | 'snapshot', provider?: string) {
  return {
    sourceBadge: {
      kind: 'api' as DataSourceKind,
      label: kind === 'live-query' ? 'ArcGIS query' : 'Snapshot',
    },
    provenanceBadge: {
      kind: 'from_public_record' as DataProvenanceKind,
      title: provider ? `Public record · ${provider}` : 'Public record',
    },
  }
}

export function buildExternalLayerPresentation(
  layerId: string,
  properties: Record<string, unknown>,
  options?: { mode?: 'snapshot' | 'live-query' },
): ExternalLayerPresentation | null {
  const layer = getCaldeiraLayer(layerId)
  if (!layer) return null

  const title = asString(properties.label)
    ?? asString(properties.station_name)
    ?? asString(properties.name)
    ?? asString(properties.id)
    ?? layer.label

  const footerBits = [
    layer.provider,
    asString(properties.source_ref),
    asString(properties.as_of),
  ].filter(Boolean)

  const common = {
    layerId,
    layerLabel: layer.label,
    provider: layer.provider,
    accentColor: resolveAccent(layer.group),
    footer: footerBits.length ? footerBits.join(' · ') : undefined,
    ...buildBadgeInfo(options?.mode === 'live-query' ? 'live-query' : 'snapshot', layer.provider),
  }

  if (layerId === 'sigmine') {
    return {
      ...common,
      title,
      subtitle: asString(properties.phase) ?? layer.label,
      rows: compactRows([
        { label: 'Process', value: properties.process_number ?? properties.id },
        { label: 'Holder', value: properties.holder_name },
        { label: 'Substance', value: properties.substance },
        { label: 'Area', value: asNumber(properties.area_ha) != null ? `${asNumber(properties.area_ha)} ha` : null },
        { label: 'State', value: properties.uf },
      ]),
    }
  }

  if (layerId === 'geosgbGeology') {
    return {
      ...common,
      title,
      subtitle: asString(properties.hierarchy) ?? layer.label,
      rows: compactRows([
        { label: 'Unit code', value: properties.unit_code },
        { label: 'Unit name', value: properties.unit_name },
        { label: 'Lithologies', value: properties.lithologies },
        { label: 'Era', value: [asString(properties.era_min), asString(properties.era_max)].filter(Boolean).join(' - ') || null },
      ]),
    }
  }

  if (layerId === 'anmGeology') {
    return {
      ...common,
      title,
      subtitle: asString(properties.rock_class) ?? layer.label,
      rows: compactRows([
        { label: 'Unit code', value: properties.unit_code },
        { label: 'Unit name', value: properties.unit_name },
        { label: 'Primary lithology', value: properties.lithology_primary },
        { label: 'Secondary lithology', value: properties.lithology_secondary },
        { label: 'Era max', value: properties.era_max },
      ]),
    }
  }

  if (layerId === 'hidroweb') {
    return {
      ...common,
      title,
      subtitle: asString(properties.station_type) ?? layer.label,
      rows: compactRows([
        { label: 'Code', value: properties.station_code ?? properties.id },
        { label: 'Municipality', value: properties.municipality },
        { label: 'River', value: properties.river },
        { label: 'Basin', value: properties.basin },
        { label: 'Operating', value: properties.operating },
      ]),
    }
  }

  return {
    ...common,
    title,
    subtitle: layer.label,
    rows: compactRows(Object.entries(properties).slice(0, 5).map(([label, value]) => ({
      label: label.replace(/_/g, ' '),
      value,
    }))),
  }
}
