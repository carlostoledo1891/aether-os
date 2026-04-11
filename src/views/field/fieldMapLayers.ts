import { useSyncExternalStore } from 'react'
import type { DrillHoleType } from '../../components/map/DrillHoleOverlay'

export interface FieldOpsMapLayers {
  tenements: boolean
  drillHoles: boolean
  holeTypeFilter: DrillHoleType | 'all'
  pfsEngineering: boolean
  plantSites: boolean
  infra: boolean
}

export const DEFAULT_FIELD_OPS_LAYERS: FieldOpsMapLayers = {
  tenements: true,
  drillHoles: true,
  holeTypeFilter: 'all',
  pfsEngineering: true,
  plantSites: true,
  infra: false,
}

export interface FieldEnvMapLayers {
  apa: boolean
  buffer: boolean
  monitoring: boolean
  urban: boolean
}

export const DEFAULT_FIELD_ENV_LAYERS: FieldEnvMapLayers = {
  apa: true,
  buffer: true,
  monitoring: true,
  urban: false,
}

let currentOpsLayers = DEFAULT_FIELD_OPS_LAYERS
let currentEnvLayers = DEFAULT_FIELD_ENV_LAYERS

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

export const sharedLayerStore = {
  getOps: () => currentOpsLayers,
  getEnv: () => currentEnvLayers,
  setOps: (updater: (prev: FieldOpsMapLayers) => FieldOpsMapLayers) => {
    currentOpsLayers = updater(currentOpsLayers)
    emit()
  },
  setEnv: (updater: (prev: FieldEnvMapLayers) => FieldEnvMapLayers) => {
    currentEnvLayers = updater(currentEnvLayers)
    emit()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
}

export function useSharedMapLayers() {
  const opsMapLayers = useSyncExternalStore(sharedLayerStore.subscribe, sharedLayerStore.getOps)
  const envMapLayers = useSyncExternalStore(sharedLayerStore.subscribe, sharedLayerStore.getEnv)

  return {
    opsMapLayers,
    envMapLayers,
    setOpsMapLayers: sharedLayerStore.setOps,
    setEnvMapLayers: sharedLayerStore.setEnv,
  }
}

