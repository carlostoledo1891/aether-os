import geosgbUrl from '../geojson/external/caldeira-geosgb-geology.geojson?url'
import sigmineUrl from '../geojson/external/caldeira-sigmine-tenements.geojson?url'
import sigmineTargetsUrl from '../geojson/external/caldeira-sigmine-target-tenements.geojson?url'
import anmGeologyUrl from '../geojson/external/caldeira-anm-geology.geojson?url'
import snirhUrl from '../geojson/external/caldeira-snirh-stations.geojson?url'
import { EXTERNAL_SNAPSHOT_STYLES } from 'shared/sites/externalSnapshotStyles'

export type ExternalSnapshotGeometryKind = 'polygon' | 'point'

export interface ExternalSnapshotLayerDef {
  id: string
  url: string
  kind: ExternalSnapshotGeometryKind
  sourceId: string
  attribution: string
  fillColor?: string
  lineColor?: string
  circleColor?: string
}

export const EXTERNAL_GEO = {
  geosgbGeology: {
    id: 'geosgbGeology',
    url: geosgbUrl,
    kind: 'polygon' as const,
    sourceId: 'ext-snapshot-geosgb-geology',
    attribution: 'Fonte: SGB/GeoSGB',
    ...EXTERNAL_SNAPSHOT_STYLES.geosgbGeology,
  },
  sigmine: {
    id: 'sigmine',
    url: sigmineUrl,
    kind: 'polygon' as const,
    sourceId: 'ext-snapshot-sigmine',
    attribution: 'Fonte: ANM SIGMINE',
    ...EXTERNAL_SNAPSHOT_STYLES.sigmine,
  },
  sigmineTargets: {
    id: 'sigmineTargets',
    url: sigmineTargetsUrl,
    kind: 'polygon' as const,
    sourceId: 'ext-snapshot-sigmine-targets',
    attribution: 'Fonte: ANM SIGMINE · curated target subset',
    ...EXTERNAL_SNAPSHOT_STYLES.sigmineTargets,
  },
  anmGeology: {
    id: 'anmGeology',
    url: anmGeologyUrl,
    kind: 'polygon' as const,
    sourceId: 'ext-snapshot-anm-geology',
    attribution: 'Fonte: ANM',
    ...EXTERNAL_SNAPSHOT_STYLES.anmGeology,
  },
  hidroweb: {
    id: 'hidroweb',
    url: snirhUrl,
    kind: 'point' as const,
    sourceId: 'ext-snapshot-snirh-hidroweb',
    attribution: 'Fonte: ANA/SNIRH Hidroweb',
    ...EXTERNAL_SNAPSHOT_STYLES.hidroweb,
  },
} as const satisfies Record<string, ExternalSnapshotLayerDef>

export type ExternalSnapshotLayerId = keyof typeof EXTERNAL_GEO

export function getExternalSnapshotLayer(id: string): ExternalSnapshotLayerDef | null {
  return EXTERNAL_GEO[id as ExternalSnapshotLayerId] ?? null
}

export function getExternalSnapshotInteractiveLayerIds(id: string): string[] {
  const layer = getExternalSnapshotLayer(id)
  if (!layer) return []
  return layer.kind === 'point'
    ? [`${layer.sourceId}-circle`]
    : [`${layer.sourceId}-fill`, `${layer.sourceId}-line`]
}

export function getExternalSnapshotIdFromRenderedLayerId(renderedLayerId: string): ExternalSnapshotLayerId | null {
  return (Object.entries(EXTERNAL_GEO).find(([, layer]) =>
    getExternalSnapshotInteractiveLayerIds(layer.id).includes(renderedLayerId),
  )?.[0] as ExternalSnapshotLayerId | undefined) ?? null
}
