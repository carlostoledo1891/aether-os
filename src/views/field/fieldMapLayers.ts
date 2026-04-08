import type { DrillHoleType } from '../../components/map/DrillHoleOverlay'

export interface FieldOpsMapLayers {
  tenements: boolean
  deposits: boolean
  drillHoles: boolean
  holeTypeFilter: DrillHoleType | 'all'
  pfsEngineering: boolean
  /** Pilot + commercial plant collars (terrain-accurate GeoJSON) */
  plantSites: boolean
  /** Full logistics mesh: roads, ports, supply-chain art in caldeira-infrastructure.geojson */
  infra: boolean
  /** Pilot schematic nodes/edges (telemetry-linked rehearsal) */
  plantSchematic: boolean
  /** Access road polyline from ultimate_v1 merge */
  accessRoutes: boolean
  /** 193 km² Caldeira licence union — context behind per-concession polygons */
  licenceEnvelope: boolean
  /** Adjacent tenement (Axel REE Caldas) — district geology context */
  neighbors: boolean
}

export const DEFAULT_FIELD_OPS_LAYERS: FieldOpsMapLayers = {
  tenements: true,
  deposits: false,
  drillHoles: true,
  holeTypeFilter: 'all',
  pfsEngineering: true,
  plantSites: true,
  infra: false,
  plantSchematic: false,
  accessRoutes: true,
  licenceEnvelope: false,
  neighbors: false,
}

export interface FieldEnvMapLayers {
  apa: boolean
  buffer: boolean
  monitoring: boolean
  urban: boolean
  udc: boolean
}

export const DEFAULT_FIELD_ENV_LAYERS: FieldEnvMapLayers = {
  apa: true,
  buffer: true,
  monitoring: true,
  urban: false,
  udc: false,
}
