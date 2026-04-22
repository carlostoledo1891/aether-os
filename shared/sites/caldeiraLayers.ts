import type {
  SiteExternalLayer,
  SiteExternalLayerIdentifyMode,
  SiteExternalLayerLegendItem,
  SiteExternalLayerRenderMode,
  SiteLayerSourceType,
} from './types.js'
import { EXTERNAL_SNAPSHOT_STYLES } from './externalSnapshotStyles.js'

export type CaldeiraLayerGroupId =
  | 'base'
  | 'geology'
  | 'operations'
  | 'environment'
  | 'hydrology'
  | 'terrain'

export type CaldeiraLayerPageScope =
  | 'field-ops'
  | 'field-env'
  | 'buyer'
  | 'deck-geology'
  | 'deck-hydro'

export type CaldeiraLayerSourceType =
  | SiteLayerSourceType
  | 'component'
  | 'geojson-static'

export type SharedStoreBinding =
  | { kind: 'shared-store'; store: 'ops'; key: 'drillHoles' | 'pfsEngineering' | 'plantSites' | 'infra' }
  | { kind: 'shared-store'; store: 'env'; key: 'apa' | 'buffer' | 'monitoring' | 'urban' }
  | { kind: 'local' }

export interface CaldeiraLayerManifestItem {
  id: string
  group: CaldeiraLayerGroupId
  label: string
  pageScopes: readonly CaldeiraLayerPageScope[]
  defaultOn: boolean
  sourceType: CaldeiraLayerSourceType
  available: boolean
  uiVisible?: boolean
  provider?: string
  datasetId?: string
  logicalSourceId?: string
  snapshotPath?: string
  attribution?: string
  apiSourceId?: string
  sourceUrl?: string
  renderMode?: SiteExternalLayerRenderMode
  identifyMode?: SiteExternalLayerIdentifyMode
  supportsLegend?: boolean
  supportsHealth?: boolean
  serviceBaseUrl?: string
  queryUrl?: string
  layerId?: number
  sublayerIds?: readonly number[]
  legendUrl?: string
  legendItems?: readonly SiteExternalLayerLegendItem[]
  binding: SharedStoreBinding
  snapshotSourceId?: string
}

export type CaldeiraSnapshotNormalizerId =
  | 'geosgb'
  | 'sigmine'
  | 'anm'
  | 'snirh'

export interface CaldeiraExternalSnapshotSource {
  id: string
  snapshotSourceId: string
  label: string
  queryUrl: string
  outputFile: string
  normalizer: CaldeiraSnapshotNormalizerId
}

export const CALDEIRA_LAYER_PAGE_SCOPES = [
  'field-ops',
  'field-env',
  'buyer',
  'deck-geology',
  'deck-hydro',
] as const satisfies readonly CaldeiraLayerPageScope[]

const ALL_PANEL_SCOPES = CALDEIRA_LAYER_PAGE_SCOPES

const SIGMINE_TENEMENT_LEGEND = [
  {
    label: 'Active mineral title polygon',
    symbol: 'fill',
    color: EXTERNAL_SNAPSHOT_STYLES.sigmine.fillColor,
    strokeColor: EXTERNAL_SNAPSHOT_STYLES.sigmine.lineColor,
  },
] as const satisfies readonly SiteExternalLayerLegendItem[]

const SIGMINE_TARGET_TENEMENT_LEGEND = [
  {
    label: 'Curated target tenement',
    symbol: 'fill',
    color: EXTERNAL_SNAPSHOT_STYLES.sigmineTargets.fillColor,
    strokeColor: EXTERNAL_SNAPSHOT_STYLES.sigmineTargets.lineColor,
  },
] as const satisfies readonly SiteExternalLayerLegendItem[]

const GEOSGB_GEOLOGY_LEGEND = [
  {
    label: 'State geology polygon',
    symbol: 'fill',
    color: EXTERNAL_SNAPSHOT_STYLES.geosgbGeology.fillColor,
    strokeColor: EXTERNAL_SNAPSHOT_STYLES.geosgbGeology.lineColor,
  },
] as const satisfies readonly SiteExternalLayerLegendItem[]

const ANM_GEOLOGY_LEGEND = [
  {
    label: 'ANM geoscience polygon',
    symbol: 'fill',
    color: EXTERNAL_SNAPSHOT_STYLES.anmGeology.fillColor,
    strokeColor: EXTERNAL_SNAPSHOT_STYLES.anmGeology.lineColor,
  },
] as const satisfies readonly SiteExternalLayerLegendItem[]

const HIDROWEB_STATION_LEGEND = [
  { label: 'Hydrometeorological station', symbol: 'circle', color: '#22d3ee', strokeColor: '#ffffff' },
] as const satisfies readonly SiteExternalLayerLegendItem[]

const _CALDEIRA_LAYER_MANIFEST = [
  {
    id: 'boundary',
    group: 'geology',
    label: 'Caldeira boundary',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: true,
    sourceType: 'component',
    available: true,
    provider: 'ANM',
    datasetId: 'anm_sigmine_geociencias_pocos_caldas_complexo_alcalino',
    binding: { kind: 'local' },
  },
  {
    id: 'drillholes',
    group: 'geology',
    label: 'Drill collars',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: true,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    datasetId: 'drillholes_caldeira',
    binding: { kind: 'shared-store', store: 'ops', key: 'drillHoles' },
  },
  {
    id: 'pfs',
    group: 'geology',
    label: 'PFS engineering',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    datasetId: 'pfs_pit_capao_mel',
    binding: { kind: 'shared-store', store: 'ops', key: 'pfsEngineering' },
  },
  {
    id: 'geosgbGeology',
    group: 'geology',
    label: 'GeoSGB geology',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'geojson-snapshot',
    available: true,
    attribution: 'Fonte: SGB/GeoSGB',
    provider: 'Serviço Geológico do Brasil',
    datasetId: 'geosgb_minas_gerais_1m_2021',
    logicalSourceId: 'snapshot:geosgb-geology',
    snapshotPath: 'src/data/geojson/external/caldeira-geosgb-geology.geojson',
    snapshotSourceId: 'geosgb',
    apiSourceId: 'geosgb-geology',
    renderMode: 'snapshot-geojson',
    identifyMode: 'snapshot-properties',
    supportsLegend: true,
    supportsHealth: true,
    serviceBaseUrl: 'https://geoportal.sgb.gov.br/server/rest/services/geologia/litoestratigrafia_estados/MapServer',
    queryUrl: 'https://geoportal.sgb.gov.br/server/rest/services/geologia/litoestratigrafia_estados/MapServer/8/query',
    layerId: 8,
    sublayerIds: [8],
    legendUrl: 'https://geoportal.sgb.gov.br/server/rest/services/geologia/litoestratigrafia_estados/MapServer/legend?f=pjson',
    legendItems: GEOSGB_GEOLOGY_LEGEND,
    sourceUrl: 'https://geoportal.sgb.gov.br/server/rest/services/dados_plataforma/geologia/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image',
    binding: { kind: 'local' },
  },
  {
    id: 'sigmine',
    group: 'geology',
    label: 'SIGMINE tenements',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'geojson-snapshot',
    available: true,
    attribution: 'Fonte: ANM SIGMINE',
    provider: 'ANM',
    datasetId: 'sigmine_processos_minerarios_ativos',
    logicalSourceId: 'snapshot:sigmine-tenements',
    snapshotPath: 'src/data/geojson/external/caldeira-sigmine-tenements.geojson',
    snapshotSourceId: 'sigmine',
    apiSourceId: 'sigmine',
    renderMode: 'snapshot-geojson',
    identifyMode: 'arcgis-query',
    supportsLegend: true,
    supportsHealth: true,
    serviceBaseUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/FeatureServer',
    queryUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/FeatureServer/0/query',
    layerId: 0,
    sublayerIds: [0],
    legendUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/FeatureServer/0?f=pjson',
    legendItems: SIGMINE_TENEMENT_LEGEND,
    sourceUrl: 'https://sigmine.dnpm.gov.br/arcgis/rest/services/SIGMINE/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image',
    binding: { kind: 'local' },
  },
  {
    id: 'sigmineTargets',
    group: 'geology',
    label: 'SIGMINE target tenements',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: true,
    sourceType: 'geojson-snapshot',
    available: true,
    attribution: 'Fonte: ANM SIGMINE · curated target subset',
    provider: 'ANM',
    datasetId: 'sigmine_target_processos_curated',
    logicalSourceId: 'snapshot:sigmine-target-tenements',
    snapshotPath: 'src/data/geojson/external/caldeira-sigmine-target-tenements.geojson',
    snapshotSourceId: 'sigmine-targets',
    apiSourceId: 'sigmine',
    renderMode: 'snapshot-geojson',
    identifyMode: 'none',
    supportsLegend: true,
    supportsHealth: false,
    legendItems: SIGMINE_TARGET_TENEMENT_LEGEND,
    binding: { kind: 'local' },
  },
  {
    id: 'anmGeology',
    group: 'geology',
    label: 'ANM geology',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'geojson-snapshot',
    available: true,
    attribution: 'Fonte: ANM',
    provider: 'ANM',
    datasetId: 'anm_sigmine_geociencias_geologia',
    logicalSourceId: 'snapshot:anm-geology',
    snapshotPath: 'src/data/geojson/external/caldeira-anm-geology.geojson',
    snapshotSourceId: 'anm',
    apiSourceId: 'anm-geoscience',
    renderMode: 'snapshot-geojson',
    identifyMode: 'snapshot-properties',
    supportsLegend: true,
    supportsHealth: true,
    serviceBaseUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/geociencias/MapServer',
    queryUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/geociencias/MapServer/2/query',
    layerId: 2,
    sublayerIds: [2],
    legendUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/geociencias/MapServer/legend?f=pjson',
    legendItems: ANM_GEOLOGY_LEGEND,
    sourceUrl: 'https://geo.anm.gov.br/arcgis/rest/services/ANM/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image',
    binding: { kind: 'local' },
  },
  {
    id: 'plantSites',
    group: 'operations',
    label: 'Plant sites',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    datasetId: 'ops_reality_plant_sites',
    binding: { kind: 'shared-store', store: 'ops', key: 'plantSites' },
  },
  {
    id: 'infra',
    group: 'operations',
    label: 'Logistics infra',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    binding: { kind: 'shared-store', store: 'ops', key: 'infra' },
  },
  {
    id: 'apa',
    group: 'environment',
    label: 'APA Pedra Branca',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: true,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    datasetId: 'apa_pedra_branca',
    binding: { kind: 'shared-store', store: 'env', key: 'apa' },
  },
  {
    id: 'buffer',
    group: 'environment',
    label: 'APA buffer ring',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'Vero',
    datasetId: 'apa_buffer_3km',
    binding: { kind: 'shared-store', store: 'env', key: 'buffer' },
  },
  {
    id: 'monitoring',
    group: 'environment',
    label: 'Monitoring zone',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: false,
    uiVisible: false,
    provider: 'Vero',
    datasetId: 'water_monitoring_zone',
    binding: { kind: 'shared-store', store: 'env', key: 'monitoring' },
  },
  {
    id: 'urban',
    group: 'environment',
    label: 'Urban context',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: false,
    uiVisible: false,
    provider: 'Vero',
    datasetId: 'urban_pocos_caldas',
    binding: { kind: 'shared-store', store: 'env', key: 'urban' },
  },
  {
    id: 'hydroSprings',
    group: 'hydrology',
    label: 'Spring pins',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'SISEMA / MG',
    binding: { kind: 'local' },
  },
  {
    id: 'hydroNodes',
    group: 'hydrology',
    label: 'Monitoring nodes',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'Vero / LAPOC-ready',
    binding: { kind: 'local' },
  },
  {
    id: 'hidroweb',
    group: 'hydrology',
    label: 'SNIRH Hidroweb stations',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'geojson-snapshot',
    available: true,
    attribution: 'Fonte: ANA/SNIRH Hidroweb',
    provider: 'ANA / SNIRH',
    datasetId: 'snirh_estacoes_hidrometeorologicas',
    logicalSourceId: 'snapshot:snirh-hidroweb',
    snapshotPath: 'src/data/geojson/external/caldeira-snirh-stations.geojson',
    snapshotSourceId: 'snirh',
    apiSourceId: 'snirh-hidroweb',
    renderMode: 'snapshot-geojson',
    identifyMode: 'snapshot-properties',
    supportsLegend: true,
    supportsHealth: true,
    serviceBaseUrl: 'https://portal1.snirh.gov.br/server/rest/services/Esta%C3%A7%C3%B5es_Hidrometeorol%C3%B3gicas_SNIRH/FeatureServer',
    queryUrl: 'https://portal1.snirh.gov.br/server/rest/services/Esta%C3%A7%C3%B5es_Hidrometeorol%C3%B3gicas_SNIRH/FeatureServer/0/query',
    layerId: 0,
    sublayerIds: [0],
    legendItems: HIDROWEB_STATION_LEGEND,
    sourceUrl: 'https://metadados.snirh.gov.br/geoserver/ows?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=hidroweb:estacoes&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=TRUE',
    binding: { kind: 'local' },
  },
  {
    id: 'terrain',
    group: 'terrain',
    label: '3D terrain',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'MapTiler / AWS Terrarium',
    binding: { kind: 'local' },
  },
  {
    id: 'hillshade',
    group: 'terrain',
    label: 'Hillshade',
    pageScopes: ALL_PANEL_SCOPES,
    defaultOn: false,
    sourceType: 'component',
    available: true,
    provider: 'MapTiler / AWS Terrarium',
    binding: { kind: 'local' },
  },
] as const satisfies readonly CaldeiraLayerManifestItem[]

export type CaldeiraLayerId = (typeof _CALDEIRA_LAYER_MANIFEST)[number]['id']

export const CALDEIRA_LAYER_MANIFEST: CaldeiraLayerManifestItem[] = [
  ..._CALDEIRA_LAYER_MANIFEST,
]

export function getCaldeiraLayer(id: string): CaldeiraLayerManifestItem | null {
  return CALDEIRA_LAYER_MANIFEST.find(layer => layer.id === id) ?? null
}

export function buildCaldeiraExternalLayers(): SiteExternalLayer[] {
  return CALDEIRA_LAYER_MANIFEST
    .filter(layer => layer.sourceType !== 'component' && layer.sourceType !== 'geojson-static')
    .map(layer => ({
      id: layer.id,
      group: layer.group,
      label: layer.label,
      sourceType: layer.sourceType as SiteLayerSourceType,
      url: layer.sourceUrl,
      attribution: layer.attribution ?? '',
      defaultOn: layer.defaultOn,
      provider: layer.provider,
      datasetId: layer.datasetId,
      logicalSourceId: layer.logicalSourceId,
      renderMode: layer.renderMode,
      identifyMode: layer.identifyMode,
      supportsLegend: layer.supportsLegend,
      supportsHealth: layer.supportsHealth,
      apiSourceId: layer.apiSourceId,
      serviceBaseUrl: layer.serviceBaseUrl,
      queryUrl: layer.queryUrl,
      layerId: layer.layerId,
      sublayerIds: layer.sublayerIds ? [...layer.sublayerIds] : undefined,
      legendUrl: layer.legendUrl,
      legendItems: layer.legendItems ? [...layer.legendItems] : undefined,
      snapshotPath: layer.snapshotPath,
      snapshotSourceId: layer.snapshotSourceId,
    }))
}

export const CALDEIRA_EXTERNAL_SNAPSHOT_SOURCES: CaldeiraExternalSnapshotSource[] =
  CALDEIRA_LAYER_MANIFEST
    .filter((layer): layer is CaldeiraLayerManifestItem & {
      snapshotPath: string
      snapshotSourceId: string
      queryUrl: string
    } => (
      layer.sourceType === 'geojson-snapshot'
      && typeof layer.snapshotPath === 'string'
      && typeof layer.snapshotSourceId === 'string'
      && typeof layer.queryUrl === 'string'
    ))
    .map(layer => ({
      id: layer.id,
      snapshotSourceId: layer.snapshotSourceId,
      label: layer.label,
      queryUrl: layer.queryUrl,
      outputFile: layer.snapshotPath.split('/').at(-1) ?? `${layer.id}.geojson`,
      normalizer: layer.snapshotSourceId as CaldeiraSnapshotNormalizerId,
    }))
