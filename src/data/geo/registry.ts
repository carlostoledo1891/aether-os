/**
 * Canonical GeoJSON layer registry.
 * Single source of truth for all map geometry — every overlay reads URLs from here.
 * `renderOrder` controls paint stacking: lower = painted first (below).
 */

import boundaryUrl from '../geojson/caldeira-boundary.geojson?url'
import pfsUrl from '../geojson/caldeira-pfs-engineering.geojson?url'
import apaUrl from '../geojson/caldeira-apa-pedra-branca.geojson?url'
import bufferUrl from '../geojson/caldeira-apa-buffer.geojson?url'
import monitoringUrl from '../geojson/caldeira-environmental.geojson?url'
import urbanUrl from '../geojson/caldeira-urban-context.geojson?url'
import drillholesUrl from '../geojson/caldeira-drillholes.geojson?url'
import sitesUrl from '../geojson/caldeira-ops-plant-sites.geojson?url'
import infraUrl from '../geojson/caldeira-infrastructure.geojson?url'
import hydroSpringsUrl from '../geojson/hydro-springs.geojson?url'
import hydroNodesUrl from '../geojson/hydro-nodes.geojson?url'

export type GeoLayerKind = 'polygon' | 'point' | 'line'

export interface GeoLayerDef {
  id: string
  url: string
  kind: GeoLayerKind
  /** Lower = painted first (below). Polygons < lines < points. */
  renderOrder: number
}

export const GEO = {
  boundary:      { id: 'caldeira-boundary',         url: boundaryUrl,     kind: 'polygon' as const, renderOrder: 0 },
  pfs:           { id: 'caldeira-pfs-engineering',   url: pfsUrl,          kind: 'polygon' as const, renderOrder: 5 },
  apa:           { id: 'caldeira-apa-pedra-branca',  url: apaUrl,          kind: 'polygon' as const, renderOrder: 6 },
  buffer:        { id: 'caldeira-apa-buffer',        url: bufferUrl,       kind: 'polygon' as const, renderOrder: 7 },
  monitoring:    { id: 'caldeira-environmental',     url: monitoringUrl,   kind: 'polygon' as const, renderOrder: 8 },
  urban:         { id: 'caldeira-urban-context',     url: urbanUrl,        kind: 'polygon' as const, renderOrder: 9 },
  drillholes:    { id: 'caldeira-drillholes',        url: drillholesUrl,   kind: 'point'   as const, renderOrder: 30 },
  hydroSprings:  { id: 'hydro-springs',              url: hydroSpringsUrl, kind: 'point'   as const, renderOrder: 31 },
  hydroNodes:    { id: 'hydro-nodes',                url: hydroNodesUrl,   kind: 'point'   as const, renderOrder: 32 },
  plantSites:    { id: 'caldeira-ops-plant-sites',   url: sitesUrl,        kind: 'point'   as const, renderOrder: 33 },
  infra:         { id: 'caldeira-infrastructure',    url: infraUrl,        kind: 'point'   as const, renderOrder: 34 },
} as const satisfies Record<string, GeoLayerDef>

export type GeoLayerKey = keyof typeof GEO
