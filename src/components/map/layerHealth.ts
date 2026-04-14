import { useSyncExternalStore } from 'react'
import type { LayerId } from './layerRegistry'

export type LayerHealthState = 'idle' | 'loading' | 'ready' | 'error'

export interface LayerHealthStatus {
  state: LayerHealthState
  featureCount?: number
  loadedAt?: string
  error?: string
}

const layerHealth = new Map<LayerId, LayerHealthStatus>()
const listeners = new Set<() => void>()
let layerHealthSnapshot = new Map<LayerId, LayerHealthStatus>()

function emit() {
  listeners.forEach(listener => listener())
}

export function publishLayerHealth(layerId: LayerId, next: LayerHealthStatus) {
  const prev = layerHealth.get(layerId)
  if (
    prev?.state === next.state
    && prev?.featureCount === next.featureCount
    && prev?.loadedAt === next.loadedAt
    && prev?.error === next.error
  ) {
    return
  }
  layerHealth.set(layerId, next)
  layerHealthSnapshot = new Map(layerHealth)
  emit()
}

export function useLayerHealth() {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => layerHealthSnapshot,
    () => layerHealthSnapshot,
  )
}
