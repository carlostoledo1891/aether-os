/**
 * useLayerSurface — normalized layer API for field, preset, and static maps.
 */

import { useState, useCallback, useMemo } from 'react'
import { CALDEIRA_LAYER_MANIFEST } from 'shared/sites/caldeiraLayers'
import {
  useSharedMapLayers,
  type FieldEnvMapLayers,
  type FieldOpsMapLayers,
} from '../../views/field/fieldMapLayers'
import {
  ALL_LAYERS,
  type LayerGroupId,
  type LayerId,
  type LayerVisibilityState,
} from './layerRegistry'
import { collectInteractiveLayerIds } from './layerRuntime'

const LAYER_GROUP_BY_ID: Record<LayerId, LayerGroupId> = Object.fromEntries(
  ALL_LAYERS.map(layer => [layer.id, layer.group] as const),
) as Record<LayerId, LayerGroupId>

const MANIFEST_LAYER_BY_ID = Object.fromEntries(
  CALDEIRA_LAYER_MANIFEST.map(layer => [layer.id as LayerId, layer] as const),
) as Record<LayerId, (typeof CALDEIRA_LAYER_MANIFEST)[number]>

export interface LayerSurfaceAPI {
  state: LayerVisibilityState
  toggle: (id: LayerId) => void
  visibleLayerIds: LayerId[]
  interactiveLayerIds: string[]
  terrainExaggeration: number
  setTerrainExaggeration: (v: number) => void
  setActiveGroups: (groups: LayerGroupId[] | undefined) => void
}

interface LayerSurfaceOptions {
  mode: 'shared-field' | 'local'
  initialLayerIds?: LayerId[]
}

function buildVisibilityState(activeLayerIds?: readonly LayerId[]): LayerVisibilityState {
  const activeSet = new Set<LayerId>(activeLayerIds ?? [])
  return Object.fromEntries(
    ALL_LAYERS.map(layer => [layer.id, activeLayerIds ? activeSet.has(layer.id) : layer.defaultOn]),
  ) as LayerVisibilityState
}

function buildSharedLocalDefaults(): LayerVisibilityState {
  return Object.fromEntries(
    ALL_LAYERS.map(layer => [
      layer.id,
      MANIFEST_LAYER_BY_ID[layer.id].binding.kind === 'local' ? layer.defaultOn : false,
    ]),
  ) as LayerVisibilityState
}

function readSharedBinding(
  layerId: LayerId,
  opsMapLayers: FieldOpsMapLayers,
  envMapLayers: FieldEnvMapLayers,
  localState: LayerVisibilityState,
) {
  const layer = MANIFEST_LAYER_BY_ID[layerId]
  const binding = layer.binding
  if (binding.kind === 'shared-store') {
    if (binding.store === 'ops') return opsMapLayers[binding.key]
    return envMapLayers[binding.key]
  }
  return localState[layerId]
}

function buildSharedFieldState(
  opsMapLayers: FieldOpsMapLayers,
  envMapLayers: FieldEnvMapLayers,
  localState: LayerVisibilityState,
): LayerVisibilityState {
  return Object.fromEntries(
    ALL_LAYERS.map(layer => [
      layer.id,
      readSharedBinding(layer.id, opsMapLayers, envMapLayers, localState),
    ]),
  ) as LayerVisibilityState
}

function filterVisibleLayerIds(
  state: LayerVisibilityState,
  activeGroups?: LayerGroupId[],
): LayerId[] {
  const groupSet = activeGroups ? new Set(activeGroups) : null
  return ALL_LAYERS
    .filter(layer => state[layer.id] && (!groupSet || groupSet.has(LAYER_GROUP_BY_ID[layer.id])))
    .map(layer => layer.id)
}

export function useLayerSurface({
  mode,
  initialLayerIds,
}: LayerSurfaceOptions): LayerSurfaceAPI {
  const { opsMapLayers, envMapLayers, setOpsMapLayers, setEnvMapLayers } = useSharedMapLayers()
  const [localState, setLocalState] = useState<LayerVisibilityState>(() =>
    mode === 'shared-field'
      ? buildSharedLocalDefaults()
      : buildVisibilityState(initialLayerIds),
  )
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.4)
  const [activeGroups, setActiveGroups] = useState<LayerGroupId[] | undefined>(undefined)

  const state = useMemo(
    () => mode === 'shared-field'
      ? buildSharedFieldState(opsMapLayers, envMapLayers, localState)
      : localState,
    [mode, opsMapLayers, envMapLayers, localState],
  )

  const toggle = useCallback((id: LayerId) => {
    const binding = MANIFEST_LAYER_BY_ID[id].binding
    if (mode === 'shared-field' && binding.kind === 'shared-store') {
      if (binding.store === 'ops') {
        setOpsMapLayers(prev => ({ ...prev, [binding.key]: !prev[binding.key] }))
      } else {
        setEnvMapLayers(prev => ({ ...prev, [binding.key]: !prev[binding.key] }))
      }
      return
    }

    setLocalState(prev => ({ ...prev, [id]: !prev[id] }))
  }, [mode, setEnvMapLayers, setOpsMapLayers])

  const visibleLayerIds = useMemo(
    () => filterVisibleLayerIds(state, activeGroups),
    [state, activeGroups],
  )

  const interactiveLayerIds = useMemo(
    () => collectInteractiveLayerIds(visibleLayerIds),
    [visibleLayerIds],
  )

  return {
    state,
    toggle,
    visibleLayerIds,
    interactiveLayerIds,
    terrainExaggeration,
    setTerrainExaggeration,
    setActiveGroups,
  }
}

export function useMapLayers(): LayerSurfaceAPI {
  return useLayerSurface({ mode: 'shared-field' })
}

export function usePresetLayers(initialLayerIds: LayerId[]): LayerSurfaceAPI {
  return useLayerSurface({ mode: 'local', initialLayerIds })
}
