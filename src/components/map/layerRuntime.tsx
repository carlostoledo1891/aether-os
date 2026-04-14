import type { ReactNode } from 'react'
import { CALDEIRA_EXTERNAL_LAYERS } from 'shared/sites/caldeira'
import type { SiteExternalLayer } from 'shared/sites/types'
import type { LayerId } from './layerRegistry'
import { CaldeiraBoundary, CALDEIRA_BOUNDARY_LAYER_ID } from './CaldeiraBoundary'
import { LicenseOverlay, LICENSE_LAYER_ID } from './LicenseOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID } from './DrillHoleOverlay'
import { PfsEngineeringOverlay, PFS_ENGINEERING_FILL_LAYER_ID } from './PfsEngineeringOverlay'
import {
  ApaOverlay,
  BufferOverlay,
  MonitoringOverlay,
  UrbanOverlay,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
} from './EnvironmentalOverlay'
import { SpringPinsOverlay, SPRING_PIN_LAYER_ID } from './SpringPinsOverlay'
import { InfraOverlay, INFRA_POINT_CORE_LAYER_ID } from './InfraOverlay'
import { OpsPlantSitesOverlay, OPS_PLANT_SITE_CORE_LAYER_ID } from './OpsPlantSitesOverlay'
import { TerrainOverlay } from './TerrainOverlay'
import { ExternalSnapshotOverlay } from './ExternalSnapshotOverlay'
import { ExternalRasterOverlay } from './ExternalRasterOverlay'
import { HYDRO_NODE_LAYER_ID } from './hydroLayerIds'
import { getExternalSnapshotInteractiveLayerIds } from '../../data/geo/externalRegistry'

export interface LayerRuntimeContext {
  visibleLayerIds: Set<LayerId>
  mapId?: string
  terrainExaggeration?: number
  licenseProps?: {
    highlightId?: string | null
    hoveredLicenseId?: string | null
    selectedLicenseId?: string | null
  }
  renderOverrides?: Partial<Record<LayerId, ReactNode>>
}

interface LayerRuntimeDef {
  hostKey: string
  interactiveLayerIds: string[]
  render: (context: LayerRuntimeContext) => ReactNode
}

const EXTERNAL_LAYER_BY_ID = new Map<string, SiteExternalLayer>(
  CALDEIRA_EXTERNAL_LAYERS.map(layer => [layer.id, layer]),
)

const NO_INTERACTIVE_LAYER_IDS: string[] = []

function renderExternalLayer(layerId: string) {
  const config = EXTERNAL_LAYER_BY_ID.get(layerId)
  if (!config) return null
  return config.renderMode === 'live-raster'
    ? <ExternalRasterOverlay config={config} />
    : <ExternalSnapshotOverlay config={config} />
}

function getExternalInteractiveLayerIds(layerId: string) {
  const config = EXTERNAL_LAYER_BY_ID.get(layerId)
  if (!config || config.renderMode === 'live-raster' || config.identifyMode === 'none') {
    return NO_INTERACTIVE_LAYER_IDS
  }
  return getExternalSnapshotInteractiveLayerIds(layerId)
}

export const LAYER_RUNTIMES: Record<LayerId, LayerRuntimeDef> = {
  boundary: {
    hostKey: 'boundary',
    interactiveLayerIds: [CALDEIRA_BOUNDARY_LAYER_ID],
    render: () => <CaldeiraBoundary />,
  },
  licenses: {
    hostKey: 'licenses',
    interactiveLayerIds: [LICENSE_LAYER_ID],
    render: ({ licenseProps }) => (
      <LicenseOverlay
        highlightId={licenseProps?.highlightId}
        hoveredLicenseId={licenseProps?.hoveredLicenseId ?? null}
        selectedLicenseId={licenseProps?.selectedLicenseId ?? null}
      />
    ),
  },
  drillholes: {
    hostKey: 'drillholes',
    interactiveLayerIds: [DRILL_LAYER_ID],
    render: () => <DrillHoleOverlay />,
  },
  pfs: {
    hostKey: 'pfs',
    interactiveLayerIds: [PFS_ENGINEERING_FILL_LAYER_ID],
    render: () => <PfsEngineeringOverlay />,
  },
  geosgbGeology: {
    hostKey: 'geosgbGeology',
    interactiveLayerIds: getExternalInteractiveLayerIds('geosgbGeology'),
    render: () => renderExternalLayer('geosgbGeology'),
  },
  sigmine: {
    hostKey: 'sigmine',
    interactiveLayerIds: getExternalInteractiveLayerIds('sigmine'),
    render: () => renderExternalLayer('sigmine'),
  },
  anmGeology: {
    hostKey: 'anmGeology',
    interactiveLayerIds: getExternalInteractiveLayerIds('anmGeology'),
    render: () => renderExternalLayer('anmGeology'),
  },
  plantSites: {
    hostKey: 'plantSites',
    interactiveLayerIds: [OPS_PLANT_SITE_CORE_LAYER_ID],
    render: () => <OpsPlantSitesOverlay />,
  },
  infra: {
    hostKey: 'infra',
    interactiveLayerIds: [INFRA_POINT_CORE_LAYER_ID],
    render: () => <InfraOverlay />,
  },
  apa: {
    hostKey: 'apa',
    interactiveLayerIds: [ENV_APA_FILL_LAYER_ID, 'env-apa-label'],
    render: () => <ApaOverlay />,
  },
  buffer: {
    hostKey: 'buffer',
    interactiveLayerIds: [ENV_BUFFER_FILL_LAYER_ID],
    render: () => <BufferOverlay />,
  },
  monitoring: {
    hostKey: 'monitoring',
    interactiveLayerIds: [ENV_MONITORING_FILL_LAYER_ID],
    render: () => <MonitoringOverlay />,
  },
  urban: {
    hostKey: 'urban',
    interactiveLayerIds: [
      ENV_URBAN_FILL_LAYER_ID,
      'env-urban-label',
      ENV_URBAN_CENTROID_CORE_LAYER_ID,
      'env-urban-centroid-label',
    ],
    render: () => <UrbanOverlay />,
  },
  hydroSprings: {
    hostKey: 'hydrology',
    interactiveLayerIds: [SPRING_PIN_LAYER_ID],
    render: () => <SpringPinsOverlay />,
  },
  hydroNodes: {
    hostKey: 'hydrology',
    interactiveLayerIds: [HYDRO_NODE_LAYER_ID],
    render: () => null,
  },
  hidroweb: {
    hostKey: 'hidroweb',
    interactiveLayerIds: getExternalInteractiveLayerIds('hidroweb'),
    render: () => renderExternalLayer('hidroweb'),
  },
  terrain: {
    hostKey: 'terrain',
    interactiveLayerIds: NO_INTERACTIVE_LAYER_IDS,
    render: ({ visibleLayerIds, mapId, terrainExaggeration }) => (
      <TerrainOverlay
        mapId={mapId}
        terrain={visibleLayerIds.has('terrain')}
        hillshade={visibleLayerIds.has('hillshade')}
        exaggeration={terrainExaggeration}
      />
    ),
  },
  hillshade: {
    hostKey: 'terrain',
    interactiveLayerIds: NO_INTERACTIVE_LAYER_IDS,
    render: ({ visibleLayerIds, mapId, terrainExaggeration }) => (
      <TerrainOverlay
        mapId={mapId}
        terrain={visibleLayerIds.has('terrain')}
        hillshade={visibleLayerIds.has('hillshade')}
        exaggeration={terrainExaggeration}
      />
    ),
  },
}

export function resolveLayerRuntime(layerId: LayerId): LayerRuntimeDef {
  return LAYER_RUNTIMES[layerId]
}

export function collectInteractiveLayerIds(layerIds: LayerId[]): string[] {
  return [...new Set(layerIds.flatMap(layerId => resolveLayerRuntime(layerId).interactiveLayerIds))]
}
