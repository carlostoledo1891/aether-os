/**
 * useMapLayers — single state bridge for all map layer toggles.
 *
 * Combines the legacy fieldMapLayers shared store (ops/env keys) with
 * new layer keys (geology APIs, weather sub-layers, terrain controls)
 * into one LayerState that drives the unified MapLayerPanel.
 *
 * usePresetLayers — local-only variant for preset-driven consumers
 * (deck slides, story maps) that don't share state with FieldView.
 */

import { useState, useCallback, useMemo } from 'react'
import {
  useSharedMapLayers,
  type FieldOpsMapLayers,
  type FieldEnvMapLayers,
} from '../../views/field/fieldMapLayers'
import { ALL_LAYERS, WEATHER_TILE_MAP, type LayerGroupId } from './layerRegistry'
import type { LayerState } from './MapLayerPanel'
import type { WeatherLayerId } from './WeatherTileOverlay'
import type { OverlayKey } from './mapPresets'

const LAYER_GROUP_BY_ID: Record<string, LayerGroupId> = {}
for (const l of ALL_LAYERS) LAYER_GROUP_BY_ID[l.id] = l.group

/* ── Key mappings between registry IDs and shared store ────────────── */

const OPS_KEY_MAP: Record<string, keyof FieldOpsMapLayers> = {
  licenses: 'tenements',
  drillholes: 'drillHoles',
  pfs: 'pfsEngineering',
  plantSites: 'plantSites',
  infra: 'infra',
}

const ENV_KEY_MAP: Record<string, keyof FieldEnvMapLayers> = {
  apa: 'apa',
  buffer: 'buffer',
  monitoring: 'monitoring',
  urban: 'urban',
}

const ENV_LAYER_IDS = new Set(Object.keys(ENV_KEY_MAP))

/* ── Shared return type ────────────────────────────────────────────── */

export interface MapLayersAPI {
  state: LayerState
  toggle: (id: string) => void
  weatherOpacity: number
  setWeatherOpacity: (v: number) => void
  terrainExaggeration: number
  setTerrainExaggeration: (v: number) => void
  activeWeatherLayers: Set<WeatherLayerId>
  overlayKeys: OverlayKey[]
  environmentalProps: {
    showApa: boolean
    showBuffer: boolean
    showMonitoring: boolean
    showUrban: boolean
  }
  /** Restrict overlay rendering to layers belonging to these groups. */
  setActiveGroups: (groups: LayerGroupId[] | undefined) => void
}

/* ── Shared derivation helpers ─────────────────────────────────────── */

function deriveWeatherLayers(state: LayerState): Set<WeatherLayerId> {
  const set = new Set<WeatherLayerId>()
  for (const [registryId, owmId] of Object.entries(WEATHER_TILE_MAP)) {
    if (state[registryId]) set.add(owmId as WeatherLayerId)
  }
  return set
}

function deriveOverlayKeys(
  state: LayerState,
  weatherLayers: Set<WeatherLayerId>,
  activeGroups?: LayerGroupId[],
): OverlayKey[] {
  const groupSet = activeGroups ? new Set(activeGroups) : null
  const ok = (id: string) => !groupSet || groupSet.has(LAYER_GROUP_BY_ID[id])

  const keys: OverlayKey[] = []
  if (state.boundary && ok('boundary')) keys.push('boundary')
  if (state.licenses && ok('licenses')) keys.push('licenses')
  if (state.drillholes && ok('drillholes')) keys.push('drillholes')
  if (state.pfs && ok('pfs')) keys.push('pfs')
  if (state.plantSites && ok('plantSites')) keys.push('plantSites')
  if (state.infra && ok('infra')) keys.push('infra')
  if (ok('apa') && (state.apa || state.buffer || state.monitoring || state.urban))
    keys.push('environmental')
  if (state.hydroSprings && ok('hydroSprings')) keys.push('hydroSprings')
  if (state.hydroNodes && ok('hydroNodes')) keys.push('hydroNodes')
  if (state.cprmGeology && ok('cprmGeology')) keys.push('cprmGeology')
  if (state.macrostrat && ok('macrostrat')) keys.push('macrostrat')
  if (state.usgsRee && ok('usgsRee')) keys.push('usgsRee')
  if (state.inmetStations && ok('inmetStations')) keys.push('inmetStations')
  if (state.terrain && ok('terrain')) keys.push('terrain')
  if (state.hillshade && ok('hillshade')) keys.push('hillshade')
  if (weatherLayers.size > 0 && (!groupSet || groupSet.has('weather'))) keys.push('weather')
  return keys
}

function deriveEnvProps(state: LayerState) {
  return {
    showApa: !!state.apa,
    showBuffer: !!state.buffer,
    showMonitoring: !!state.monitoring,
    showUrban: !!state.urban,
  }
}

/* ── Extension defaults (layers not bridged to fieldMapLayers) ───── */

function buildExtensionDefaults(): Record<string, boolean> {
  const bridged = new Set([
    ...Object.keys(OPS_KEY_MAP),
    ...Object.keys(ENV_KEY_MAP),
  ])
  const ext: Record<string, boolean> = {}
  for (const l of ALL_LAYERS) {
    if (!bridged.has(l.id)) ext[l.id] = l.defaultOn
  }
  return ext
}

/* ── Hook 1: useMapLayers (bridges shared store) ──────────────────── */

export function useMapLayers(): MapLayersAPI {
  const { opsMapLayers, envMapLayers, setOpsMapLayers, setEnvMapLayers } =
    useSharedMapLayers()
  const [extState, setExtState] = useState<Record<string, boolean>>(
    buildExtensionDefaults,
  )
  const [weatherOpacity, setWeatherOpacity] = useState(0.6)
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.4)
  const [activeGroups, setActiveGroups] = useState<LayerGroupId[] | undefined>(undefined)

  const state = useMemo((): LayerState => {
    const s: LayerState = {}
    s.licenses = opsMapLayers.tenements
    s.drillholes = opsMapLayers.drillHoles
    s.pfs = opsMapLayers.pfsEngineering
    s.plantSites = opsMapLayers.plantSites
    s.infra = opsMapLayers.infra
    s.apa = envMapLayers.apa
    s.buffer = envMapLayers.buffer
    s.monitoring = envMapLayers.monitoring
    s.urban = envMapLayers.urban
    for (const [k, v] of Object.entries(extState)) s[k] = v
    return s
  }, [opsMapLayers, envMapLayers, extState])

  const toggle = useCallback(
    (id: string) => {
      if (id in OPS_KEY_MAP) {
        const key = OPS_KEY_MAP[id]
        setOpsMapLayers(prev => ({ ...prev, [key]: !prev[key] }))
      } else if (id in ENV_KEY_MAP) {
        const key = ENV_KEY_MAP[id]
        setEnvMapLayers(prev => ({ ...prev, [key]: !prev[key] }))
      } else {
        setExtState(prev => ({ ...prev, [id]: !prev[id] }))
      }
    },
    [setOpsMapLayers, setEnvMapLayers],
  )

  const activeWeatherLayers = useMemo(
    () => deriveWeatherLayers(state),
    [state],
  )
  const overlayKeys = useMemo(
    () => deriveOverlayKeys(state, activeWeatherLayers, activeGroups),
    [state, activeWeatherLayers, activeGroups],
  )
  const environmentalProps = useMemo(() => deriveEnvProps(state), [state])

  return {
    state,
    toggle,
    weatherOpacity,
    setWeatherOpacity,
    terrainExaggeration,
    setTerrainExaggeration,
    activeWeatherLayers,
    overlayKeys,
    environmentalProps,
    setActiveGroups,
  }
}

/* ── Hook 2: usePresetLayers (local state for preset-driven maps) ── */

export function usePresetLayers(initialOverlays: OverlayKey[]): MapLayersAPI {
  const [state, setState] = useState<LayerState>(() => {
    const s: LayerState = {}
    const oSet = new Set(initialOverlays)
    for (const l of ALL_LAYERS) {
      if (ENV_LAYER_IDS.has(l.id)) {
        s[l.id] = oSet.has('environmental')
      } else if (l.id.startsWith('weather:')) {
        s[l.id] = oSet.has('weather') && l.id === 'weather:temp'
      } else {
        s[l.id] = oSet.has(l.id as OverlayKey)
      }
    }
    return s
  })
  const [weatherOpacity, setWeatherOpacity] = useState(0.6)
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.4)
  const [activeGroups, setActiveGroups] = useState<LayerGroupId[] | undefined>(undefined)

  const toggle = useCallback((id: string) => {
    setState(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const activeWeatherLayers = useMemo(
    () => deriveWeatherLayers(state),
    [state],
  )
  const overlayKeys = useMemo(
    () => deriveOverlayKeys(state, activeWeatherLayers, activeGroups),
    [state, activeWeatherLayers, activeGroups],
  )
  const environmentalProps = useMemo(() => deriveEnvProps(state), [state])

  return {
    state,
    toggle,
    weatherOpacity,
    setWeatherOpacity,
    terrainExaggeration,
    setTerrainExaggeration,
    activeWeatherLayers,
    overlayKeys,
    environmentalProps,
    setActiveGroups,
  }
}
