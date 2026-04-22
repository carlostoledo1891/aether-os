/**
 * MapCommand — discriminated union for every viewport action the AI copilot
 * can dispatch.  These are VIEW-ONLY operations; they never mutate data.
 */
export interface MapPoint {
  lng: number
  lat: number
}

export interface MapBoundsBox {
  west: number
  south: number
  east: number
  north: number
}

export type MapCommand =
  | { type: 'toggleLayer'; layerId: string; visible: boolean }
  | { type: 'flyTo'; center: MapPoint; zoom: number; pitch?: number; bearing?: number }
  | { type: 'bookmark'; bookmarkId: NamedBookmarkId }
  | { type: 'highlight'; featureId: string }
  | { type: 'fitBounds'; bbox: MapBoundsBox }
  | { type: 'clearHighlight' }
  | { type: 'flyToUnit'; unitId: string }
  | { type: 'highlightUnit'; unitId: string }
  | { type: 'openInspector'; unitId: string }

/**
 * Mapping from manifest layer IDs to the shared-store keys they control.
 * Layers not listed here are toggled via the generic `useLayerSurface.toggle`.
 */
export const LAYER_TO_STORE_KEY: Record<string, { store: 'ops' | 'env'; key: string }> = {
  drillholes:  { store: 'ops', key: 'drillHoles' },
  pfs:         { store: 'ops', key: 'pfsEngineering' },
  plantSites:  { store: 'ops', key: 'plantSites' },
  infra:       { store: 'ops', key: 'infra' },
  apa:         { store: 'env', key: 'apa' },
  buffer:      { store: 'env', key: 'buffer' },
  monitoring:  { store: 'env', key: 'monitoring' },
  urban:       { store: 'env', key: 'urban' },
}

export const AVAILABLE_LAYER_IDS = [
  'boundary', 'drillholes', 'pfs', 'geosgbGeology', 'sigmine',
  'sigmineTargets', 'anmGeology', 'plantSites', 'infra',
  'apa', 'buffer', 'hydroSprings', 'hydroNodes', 'hidroweb',
  'terrain', 'hillshade',
] as const

export const AVAILABLE_BOOKMARK_IDS = [
  'site-overview',
  'pilotPlant',
  'commercialPlant',
  'capaoDoMel',
] as const

export type NamedBookmarkId = (typeof AVAILABLE_BOOKMARK_IDS)[number]

export const NAMED_BOOKMARKS: Record<NamedBookmarkId, { center: MapPoint; zoom: number; pitch: number }> = {
  'site-overview':    { center: { lng: -46.573, lat: -21.895 }, zoom: 8.5, pitch: 0 },
  'pilotPlant':       { center: { lng: -46.575, lat: -21.8 }, zoom: 13.4, pitch: 0 },
  'commercialPlant':  { center: { lng: -46.545, lat: -21.885 }, zoom: 12.8, pitch: 0 },
  'capaoDoMel':       { center: { lng: -46.565, lat: -21.848 }, zoom: 13.2, pitch: 0 },
}
