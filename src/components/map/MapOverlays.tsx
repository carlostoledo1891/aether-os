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
  const renderedHosts = new Set<string>()

  return (
    <>
      {layers.map(layerId => {
        const runtime = resolveLayerRuntime(layerId)
        if (renderedHosts.has(runtime.hostKey)) return null
        renderedHosts.add(runtime.hostKey)

        const overrideLayerId = layers.find(id => resolveLayerRuntime(id).hostKey === runtime.hostKey && renderOverrides?.[id] !== undefined)
        const override = overrideLayerId ? renderOverrides?.[overrideLayerId] : undefined
        if (override !== undefined) return <Fragment key={runtime.hostKey}>{override}</Fragment>

        return (
          <Fragment key={runtime.hostKey}>
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
