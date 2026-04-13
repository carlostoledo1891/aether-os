/**
 * Layer Registry — single source of truth for every toggleable map layer.
 *
 * Each layer belongs to a group (geology, environment, weather…).
 * The registry feeds the unified MapLayerPanel and replaces the
 * flat OverlayKey / WeatherLayerId unions as the canonical catalog.
 */

import {
  Mountain,
  MapPin,
  Factory,
  Trees,
  Droplets,
  CloudSun,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ── Group IDs ──────────────────────────────────────────────────────────

export type LayerGroupId =
  | 'base'
  | 'geology'
  | 'operations'
  | 'environment'
  | 'hydrology'
  | 'weather'
  | 'terrain'

export interface LayerGroupDef {
  id: LayerGroupId
  label: string
  icon: LucideIcon
  accent: string        // CSS color token for the group header
}

export const LAYER_GROUPS: LayerGroupDef[] = [
  { id: 'base',        label: 'Base',        icon: Layers,   accent: 'var(--c-violet)' },
  { id: 'geology',     label: 'Geology',     icon: Mountain, accent: 'var(--c-amber)'  },
  { id: 'operations',  label: 'Operations',  icon: Factory,  accent: 'var(--c-violet)' },
  { id: 'environment', label: 'Environment', icon: Trees,    accent: 'var(--c-green)'  },
  { id: 'hydrology',   label: 'Hydrology',   icon: Droplets, accent: 'var(--c-cyan)'   },
  { id: 'weather',     label: 'Weather',     icon: CloudSun, accent: 'var(--c-cyan)'   },
  { id: 'terrain',     label: 'Terrain',     icon: MapPin,   accent: 'var(--c-amber)'  },
]

// ── Layer definitions ──────────────────────────────────────────────────

export type LayerSourceType =
  | 'component'
  | 'arcgis-rest'
  | 'xyz-raster'
  | 'wms'
  | 'geojson-static'

export interface LayerDef {
  id: string
  group: LayerGroupId
  label: string
  defaultOn: boolean
  sourceType: LayerSourceType
  available: boolean
  requiresEnv?: string
  attribution?: string
}

const OWM_KEY = import.meta.env.VITE_OWM_KEY as string | undefined
const HAS_OWM = !!OWM_KEY

const _ALL_LAYERS = [
  // Base
  { id: 'boundary',        group: 'base',        label: 'Caldeira boundary',              defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'licenses',        group: 'base',        label: 'Mining licences',                defaultOn: true,  sourceType: 'component',      available: true },

  // Geology
  { id: 'drillholes',      group: 'geology',     label: 'Drill collars',                  defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'pfs',             group: 'geology',     label: 'PFS engineering',                defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'cprmGeology',     group: 'geology',     label: 'Geological map (SGB)',           defaultOn: false, sourceType: 'arcgis-rest',    available: true,    attribution: 'SGB/CPRM' },
  { id: 'macrostrat',      group: 'geology',     label: 'Macrostrat (global, external)',  defaultOn: false, sourceType: 'xyz-raster',     available: true,    attribution: '© Macrostrat' },
  { id: 'usgsRee',         group: 'geology',     label: 'USGS REE deposits',              defaultOn: false, sourceType: 'wms',            available: true,    attribution: '© USGS MRData' },

  // Operations
  { id: 'plantSites',      group: 'operations',  label: 'Plant sites',                    defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'infra',           group: 'operations',  label: 'Logistics infra',                defaultOn: false, sourceType: 'component',      available: true },

  // Environment
  { id: 'apa',             group: 'environment', label: 'APA Pedra Branca',               defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'buffer',          group: 'environment', label: 'APA buffer ring',                defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'monitoring',      group: 'environment', label: 'Monitoring zone',                defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'urban',           group: 'environment', label: 'Urban context',                  defaultOn: false, sourceType: 'component',      available: true },

  // Hydrology
  { id: 'hydroSprings',    group: 'hydrology',   label: 'Spring pins',                    defaultOn: true,  sourceType: 'component',      available: true },
  { id: 'hydroNodes',      group: 'hydrology',   label: 'Monitoring nodes',               defaultOn: true,  sourceType: 'component',      available: true },

  // Weather (OWM raster tiles + Brazilian stations)
  { id: 'weather:temp',    group: 'weather',     label: 'Temperature',                    defaultOn: false, sourceType: 'xyz-raster',     available: HAS_OWM, requiresEnv: 'VITE_OWM_KEY' },
  { id: 'weather:precip',  group: 'weather',     label: 'Precipitation',                  defaultOn: false, sourceType: 'xyz-raster',     available: HAS_OWM, requiresEnv: 'VITE_OWM_KEY' },
  { id: 'weather:wind',    group: 'weather',     label: 'Wind speed',                     defaultOn: false, sourceType: 'xyz-raster',     available: HAS_OWM, requiresEnv: 'VITE_OWM_KEY' },
  { id: 'weather:clouds',  group: 'weather',     label: 'Cloud cover',                    defaultOn: false, sourceType: 'xyz-raster',     available: HAS_OWM, requiresEnv: 'VITE_OWM_KEY' },
  { id: 'weather:pressure',group: 'weather',     label: 'Pressure',                       defaultOn: false, sourceType: 'xyz-raster',     available: HAS_OWM, requiresEnv: 'VITE_OWM_KEY' },
  { id: 'inmetStations',   group: 'weather',     label: 'INMET stations (BR)',            defaultOn: false, sourceType: 'geojson-static', available: true,    attribution: 'INMET' },

  // Terrain
  { id: 'terrain',         group: 'terrain',     label: '3D terrain',                     defaultOn: false, sourceType: 'component',      available: true },
  { id: 'hillshade',       group: 'terrain',     label: 'Hillshade',                      defaultOn: false, sourceType: 'component',      available: true },
] as const satisfies readonly LayerDef[]

export type LayerId = (typeof _ALL_LAYERS)[number]['id']

export const ALL_LAYERS: LayerDef[] = [..._ALL_LAYERS]

// ── Helpers ────────────────────────────────────────────────────────────

export function layersByGroup(group: LayerGroupId): LayerDef[] {
  return ALL_LAYERS.filter(l => l.group === group)
}

/** Map of weather layer‑registry id → OWM tile layer id */
export const WEATHER_TILE_MAP: Record<string, string> = {
  'weather:temp':     'temp_new',
  'weather:precip':   'precipitation_new',
  'weather:wind':     'wind_new',
  'weather:clouds':   'clouds_new',
  'weather:pressure': 'pressure_new',
}
