/**
 * MapOverlays — generic host for manifest-backed layer runtimes.
 *
 * Consumers pass visible layer ids plus optional overrides for layers that
 * need surface-specific props. The runtime resolver owns renderer selection,
 * interactive ids, and any shared host deduplication.
 */

import { Fragment, type ReactNode } from 'react'
import type { LayerId } from './layerRegistry'
import { resolveLayerRuntime } from './layerRuntime'

export interface MapOverlaysProps {
  layers: LayerId[]
  mapId?: string
  licenseProps?: {
    highlightId?: string | null
    hoveredLicenseId?: string | null
    selectedLicenseId?: string | null
  }
  terrainExaggeration?: number
  renderOverrides?: Partial<Record<LayerId, ReactNode>>
}

export function MapOverlays({
  layers,
  mapId,
  licenseProps,
  terrainExaggeration = 1.4,
  renderOverrides,
}: MapOverlaysProps) {
  const visibleLayerIds = new Set(layers)
  const runtimeByLayerId = new Map(layers.map(layerId => [layerId, resolveLayerRuntime(layerId)]))
  const hostEntries = new Map<string, { layerId: LayerId; override: ReactNode | undefined }>()

  for (const layerId of layers) {
    const runtime = runtimeByLayerId.get(layerId)
    if (!runtime || hostEntries.has(runtime.hostKey)) continue
    hostEntries.set(runtime.hostKey, { layerId, override: renderOverrides?.[layerId] })
  }

  for (const layerId of layers) {
    const runtime = runtimeByLayerId.get(layerId)
    if (!runtime) continue
    const override = renderOverrides?.[layerId]
    if (override === undefined) continue
    const hostEntry = hostEntries.get(runtime.hostKey)
    if (!hostEntry || hostEntry.override === undefined) {
      hostEntries.set(runtime.hostKey, { layerId, override })
    }
  }

  return (
    <>
      {[...hostEntries.entries()].map(([hostKey, hostEntry]) => {
        const runtime = runtimeByLayerId.get(hostEntry.layerId)
        if (!runtime) return null
        const override = hostEntry.override
        if (override !== undefined) return <Fragment key={runtime.hostKey}>{override}</Fragment>

        return (
          <Fragment key={hostKey}>
            {runtime.render({
              visibleLayerIds,
              mapId,
              terrainExaggeration,
              licenseProps,
              renderOverrides,
            })}
          </Fragment>
        )
      })}
    </>
  )
}
