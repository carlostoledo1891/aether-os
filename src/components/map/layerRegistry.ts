/**
 * Layer Registry — single source of truth for every toggleable map layer.
 *
 * This registry now carries the user-visible catalog plus enough provenance
 * metadata to support a later swap from repo-local snapshot files to
 * server-managed cache endpoints without changing UI consumers.
 */

import {
  Mountain,
  MapPin,
  Factory,
  Trees,
  Droplets,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CALDEIRA_LAYER_MANIFEST,
  type CaldeiraLayerGroupId,
  type CaldeiraLayerId,
  type CaldeiraLayerManifestItem,
  type CaldeiraLayerPageScope,
  type CaldeiraLayerSourceType,
} from 'shared/sites/caldeiraLayers'

// ── Group IDs ──────────────────────────────────────────────────────────

export type LayerGroupId = CaldeiraLayerGroupId
export type LayerPageScope = CaldeiraLayerPageScope

export interface LayerGroupDef {
  id: LayerGroupId
  label: string
  icon: LucideIcon
  accent: string
}

export const LAYER_GROUPS: LayerGroupDef[] = [
  { id: 'base',        label: 'Base',        icon: Layers,   accent: 'var(--c-violet)' },
  { id: 'geology',     label: 'Geology',     icon: Mountain, accent: 'var(--c-amber)'  },
  { id: 'operations',  label: 'Operations',  icon: Factory,  accent: 'var(--c-violet)' },
  { id: 'environment', label: 'Environment', icon: Trees,    accent: 'var(--c-green)'  },
  { id: 'hydrology',   label: 'Hydrology',   icon: Droplets, accent: 'var(--c-cyan)'   },
  { id: 'terrain',     label: 'Terrain',     icon: MapPin,   accent: 'var(--c-amber)'  },
]

export const VISIBLE_LAYER_GROUPS: LayerGroupId[] = [
  'base',
  'geology',
  'operations',
  'environment',
  'hydrology',
  'terrain',
]

// ── Layer definitions ──────────────────────────────────────────────────

export type LayerSourceType = CaldeiraLayerSourceType

export type LayerDef = Omit<CaldeiraLayerManifestItem, 'binding' | 'id'> & { id: LayerId }

export type LayerId = CaldeiraLayerId

export type LayerVisibilityState = Record<LayerId, boolean>

export const ALL_LAYERS: LayerDef[] = CALDEIRA_LAYER_MANIFEST.map(({ binding: _binding, ...layer }) => ({
  ...layer,
  id: layer.id as LayerId,
  pageScopes: [...layer.pageScopes],
}))

// ── External raster layer IDs (formerly in per-service overlay files) ──

export const GEOSGB_GEOLOGY_LAYER_ID = 'geosgb-geology'
export const SIGMINE_LAYER_ID = 'sigmine-tenements'
export const ANM_GEOLOGY_LAYER_ID = 'anm-geology'

// ── Helpers ────────────────────────────────────────────────────────────

export function layersByGroup(group: LayerGroupId, scope?: LayerPageScope): LayerDef[] {
  return ALL_LAYERS.filter(
    l => l.group === group && l.uiVisible !== false && (!scope || l.pageScopes.includes(scope)),
  )
}

export function groupsForScope(scope: LayerPageScope): LayerGroupId[] {
  return VISIBLE_LAYER_GROUPS.filter(group => layersByGroup(group, scope).length > 0)
}
