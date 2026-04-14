import { CALDEIRA_EXTERNAL_LAYERS } from 'shared/sites/caldeira'
import type { LayerId } from './layerRegistry'
import { getExternalSnapshotIdFromRenderedLayerId } from '../../data/geo/externalRegistry'
import { buildExternalLayerPresentation, type ExternalLayerPresentation } from './externalLayerPresentation'

const EXTERNAL_LAYER_BY_ID = new Map(CALDEIRA_EXTERNAL_LAYERS.map(layer => [layer.id, layer]))

export function getExternalLayerConfig(layerId: string) {
  return EXTERNAL_LAYER_BY_ID.get(layerId) ?? null
}

export function getExternalLayerIdFromRenderedFeature(mapLayerId: string) {
  return getExternalSnapshotIdFromRenderedLayerId(mapLayerId)
}

export function buildExternalPresentationFromRenderedFeature(
  mapLayerId: string,
  properties: Record<string, unknown>,
): ExternalLayerPresentation | null {
  const layerId = getExternalLayerIdFromRenderedFeature(mapLayerId)
  if (!layerId) return null
  return buildExternalLayerPresentation(layerId, properties, { mode: 'snapshot' })
}

export function getLiveIdentifyLayerIds(visibleLayerIds: LayerId[]) {
  return visibleLayerIds.filter(layerId => EXTERNAL_LAYER_BY_ID.get(layerId)?.identifyMode === 'arcgis-query')
}

export async function requestExternalIdentify(
  layerId: string,
  lng: number,
  lat: number,
): Promise<ExternalLayerPresentation | null> {
  const config = getExternalLayerConfig(layerId)
  if (!config || config.identifyMode !== 'arcgis-query') return null

  const params = new URLSearchParams({
    lng: String(lng),
    lat: String(lat),
  })
  const response = await fetch(`/api/geo/external-layers/${layerId}/identify?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Identify failed (${response.status}) for ${layerId}`)
  }
  const payload = await response.json() as {
    ok: boolean
    properties?: Record<string, unknown> | null
  }
  if (!payload.ok || !payload.properties) return null
  return buildExternalLayerPresentation(layerId, payload.properties, { mode: 'live-query' })
}
