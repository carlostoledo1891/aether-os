import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Globe, Layers, Settings } from 'lucide-react'
import { GlowingIcon } from '../components/ui/GlowingIcon'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { MapBase } from '../components/map/MapBase'
import type { MapLayerMouseEvent } from '../components/map/MapBase'
import { PlantOverlay, PLANT_NODE_LAYER_ID, toPlantNodeDetail } from '../components/map/PlantOverlay'
import type { PlantOverlayNodeDetail } from '../components/map/PlantOverlay'
import { HydroOverlay, HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID, toHydroNodeDetail, toSpringDetail } from '../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../components/map/HydroOverlay'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import {
  EnvironmentalOverlay,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  UDC_REFERENCE_LAYER_ID,
  parseEnvMapFeature,
} from '../components/map/EnvironmentalOverlay'
import { LicenseOverlay, LICENSE_LAYER_ID, toLicenseDetail } from '../components/map/LicenseOverlay'
import { DepositOverlay, DEPOSIT_LAYER_ID, toDepositDetail } from '../components/map/DepositOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID, toDrillHoleDetail } from '../components/map/DrillHoleOverlay'
import { PfsEngineeringOverlay, PFS_ENGINEERING_FILL_LAYER_ID, toPfsEngineeringDetail } from '../components/map/PfsEngineeringOverlay'
import { InfraOverlay, INFRA_POINT_CORE_LAYER_ID } from '../components/map/InfraOverlay'
import { OpsPlantSitesOverlay, OPS_PLANT_SITE_CORE_LAYER_ID } from '../components/map/OpsPlantSitesOverlay'
import { AccessRoutesOverlay, ACCESS_ROUTE_LINE_LAYER_ID } from '../components/map/AccessRoutesOverlay'
import { LicenceEnvelopeOverlay, LICENCE_ENVELOPE_FILL_LAYER_ID } from '../components/map/LicenceEnvelopeOverlay'
import { NeighborOverlay } from '../components/map/NeighborOverlay'
import { W } from '../app/canvas/canvasTheme'
import { useTelemetry, useAetherService } from '../services/DataServiceProvider'
import { useSiteWeather } from '../hooks/useSiteWeather'

import type { MapTab } from './field/constants'
import { TAB_COLOR } from './field/constants'
import { OperationsPanel } from './field/OperationsPanel'
import { EnvironmentPanel } from './field/EnvironmentPanel'
import { FieldBottomMetrics } from './field/FieldBottomMetrics'
import { FieldPinnedAssetCard } from './field/FieldPinnedAssetCard'
import { FieldMapGeoInspector } from './field/FieldMapGeoInspector'
import {
  DEFAULT_FIELD_ENV_LAYERS,
  DEFAULT_FIELD_OPS_LAYERS,
  type FieldEnvMapLayers,
  type FieldOpsMapLayers,
} from './field/fieldMapLayers'
import {
  type FieldMapGeoSelection,
  toAccessRouteDetail,
  toLicenceEnvelopeDetail,
} from './field/fieldMapGeoSelection'
import fieldChrome from './field/FieldMapChrome.module.css'
import { MAP_STACKING } from '../components/map/mapStacking'

const TAB_ITEMS: { id: MapTab; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'operations',  label: 'Operations', icon: Settings,    color: W.violet },
  { id: 'environment', label: 'Hydro Twin', icon: Layers,      color: W.cyan   },
]

const MAP_HEADER_TEXT: Record<MapTab, string> = {
  operations:  'Pilot telemetry → board-grade trust layer',
  environment: 'Hydro Digital Twin → cumulative aquifer + spring model → LI defense',
}

const OPS_LAYER_PRIORITY = [
  OPS_PLANT_SITE_CORE_LAYER_ID,
  PLANT_NODE_LAYER_ID,
  INFRA_POINT_CORE_LAYER_ID,
  ACCESS_ROUTE_LINE_LAYER_ID,
  DRILL_LAYER_ID,
  PFS_ENGINEERING_FILL_LAYER_ID,
  LICENSE_LAYER_ID,
  DEPOSIT_LAYER_ID,
  LICENCE_ENVELOPE_FILL_LAYER_ID,
] as const

const ENV_LAYER_PRIORITY = [
  HYDRO_SPRING_LAYER_ID,
  HYDRO_NODE_LAYER_ID,
  UDC_REFERENCE_LAYER_ID,
  'env-udc-label',
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  'env-urban-label',
  'env-urban-centroid-label',
  ENV_APA_FILL_LAYER_ID,
  'env-apa-label',
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
] as const

function pickFeatureByPriority(
  feats: MapLayerMouseEvent['features'] | undefined,
  order: readonly string[],
) {
  if (!feats?.length) return undefined
  for (const lid of order) {
    const f = feats.find((x) => x.layer?.id === lid)
    if (f) return f
  }
  return undefined
}

export function FieldView() {
  const { plant, env } = useTelemetry()
  const service = useAetherService()
  const PROJECT_FINANCIALS = useMemo(() => service.getProjectFinancials(), [service])
  const PREDICTIVE_HYDROLOGY_SCENARIOS = useMemo(() => service.getHydrologyScenarios(), [service])
  const SPRING_COUNT = useMemo(() => service.getSpringCount(), [service])
  const [mapTab, setMapTab] = useState<MapTab>('operations')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [mapHoverHint, setMapHoverHint] = useState<string | null>(null)
  const [selectedPlantNode, setSelectedPlantNode] = useState<PlantOverlayNodeDetail | null>(null)
  const [selectedHydroNode, setSelectedHydroNode] = useState<HydroOverlayNodeDetail | null>(null)
  const [geoSelection, setGeoSelection] = useState<FieldMapGeoSelection | null>(null)
  const [opsMapLayers, setOpsMapLayers] = useState<FieldOpsMapLayers>(DEFAULT_FIELD_OPS_LAYERS)
  const [envMapLayers, setEnvMapLayers] = useState<FieldEnvMapLayers>(DEFAULT_FIELD_ENV_LAYERS)

  const interactiveLayerIds = useMemo(() => {
    if (mapTab === 'operations') {
      const ids: string[] = []
      if (opsMapLayers.deposits) ids.push(DEPOSIT_LAYER_ID)
      if (opsMapLayers.tenements) ids.push(LICENSE_LAYER_ID)
      if (opsMapLayers.drillHoles) ids.push(DRILL_LAYER_ID)
      if (opsMapLayers.pfsEngineering) ids.push(PFS_ENGINEERING_FILL_LAYER_ID)
      if (opsMapLayers.plantSites) ids.push(OPS_PLANT_SITE_CORE_LAYER_ID)
      if (opsMapLayers.infra) ids.push(INFRA_POINT_CORE_LAYER_ID)
      if (opsMapLayers.plantSchematic) ids.push(PLANT_NODE_LAYER_ID)
      if (opsMapLayers.accessRoutes) ids.push(ACCESS_ROUTE_LINE_LAYER_ID)
      if (opsMapLayers.licenceEnvelope) ids.push(LICENCE_ENVELOPE_FILL_LAYER_ID)
      return ids
    }
    const e: string[] = [HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID]
    if (envMapLayers.apa) e.push(ENV_APA_FILL_LAYER_ID, 'env-apa-label')
    if (envMapLayers.buffer) e.push(ENV_BUFFER_FILL_LAYER_ID)
    if (envMapLayers.monitoring) e.push(ENV_MONITORING_FILL_LAYER_ID)
    if (envMapLayers.urban) {
      e.push(
        ENV_URBAN_CENTROID_CORE_LAYER_ID,
        'env-urban-centroid-label',
        ENV_URBAN_FILL_LAYER_ID,
        'env-urban-label',
      )
    }
    if (envMapLayers.udc) e.push(UDC_REFERENCE_LAYER_ID, 'env-udc-label')
    return e
  }, [mapTab, opsMapLayers, envMapLayers])

  const handleMouseEnter = useCallback(
    (e: MapLayerMouseEvent) => {
      const feat = e.features?.[0]
      const layerId = feat?.layer?.id
      const id = feat?.properties?.id
      if (
        (layerId === PLANT_NODE_LAYER_ID || layerId === OPS_PLANT_SITE_CORE_LAYER_ID) &&
        typeof id === 'string'
      ) {
        setHoveredNodeId(id)
        setMapHoverHint(null)
        return
      }
      if (mapTab === 'environment' && (layerId === HYDRO_NODE_LAYER_ID || layerId === HYDRO_SPRING_LAYER_ID) && typeof id === 'string') {
        setHoveredNodeId(id)
        setMapHoverHint(null)
        return
      }
      setHoveredNodeId(null)
      const label = feat?.properties?.label ?? feat?.properties?.name ?? feat?.properties?.id
      if (typeof label === 'string') setMapHoverHint(label)
    },
    [mapTab],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
    setMapHoverHint(null)
  }, [])

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feats = e.features
      if (mapTab === 'operations') {
        const feat = pickFeatureByPriority(feats, OPS_LAYER_PRIORITY as unknown as string[])
        if (!feat?.properties) return
        const layerId = feat.layer?.id
        const props = feat.properties as Record<string, unknown>
        const id = props.id
        if (typeof id !== 'string') return

        if (layerId === PLANT_NODE_LAYER_ID && opsMapLayers.plantSchematic) {
          setGeoSelection(null)
          const coords = (feat.geometry as { coordinates?: [number, number] }).coordinates
          if (selectedPlantNode?.id === id) {
            setSelectedPlantNode(null)
            return
          }
          setSelectedPlantNode(toPlantNodeDetail(props, coords))
          return
        }

        if (layerId === OPS_PLANT_SITE_CORE_LAYER_ID && opsMapLayers.plantSites) {
          setSelectedPlantNode(null)
          setGeoSelection((g) =>
            g?.kind === 'infra' && g.id === id
              ? null
              : {
                  kind: 'infra',
                  id,
                  label: String(props.label ?? ''),
                  sublabel: String(props.sublabel ?? ''),
                  infraKind: String(props.kind ?? 'plant'),
                  details: props.details ? String(props.details) : undefined,
                  source_ref: props.source_ref ? String(props.source_ref) : undefined,
                  as_of: props.as_of ? String(props.as_of) : undefined,
                  confidence: props.confidence ? String(props.confidence) : undefined,
                },
          )
          return
        }

        setSelectedPlantNode(null)

        if (layerId === ACCESS_ROUTE_LINE_LAYER_ID && opsMapLayers.accessRoutes) {
          const d = toAccessRouteDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'route' && g.detail.id === id ? null : { kind: 'route', detail: d }))
          return
        }

        if (layerId === LICENCE_ENVELOPE_FILL_LAYER_ID && opsMapLayers.licenceEnvelope) {
          const d = toLicenceEnvelopeDetail(props)
          if (d) {
            setGeoSelection((g) =>
              g?.kind === 'licenceEnvelope' && g.detail.id === id ? null : { kind: 'licenceEnvelope', detail: d },
            )
          }
          return
        }

        if (layerId === LICENSE_LAYER_ID && opsMapLayers.tenements) {
          const d = toLicenseDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'license' && g.detail.id === id ? null : { kind: 'license', detail: d }))
          return
        }
        if (layerId === DRILL_LAYER_ID && opsMapLayers.drillHoles) {
          const d = toDrillHoleDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'drill' && g.detail.id === id ? null : { kind: 'drill', detail: d }))
          return
        }
        if (layerId === DEPOSIT_LAYER_ID && opsMapLayers.deposits) {
          const d = toDepositDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'deposit' && g.detail.id === id ? null : { kind: 'deposit', detail: d }))
          return
        }
        if (layerId === PFS_ENGINEERING_FILL_LAYER_ID && opsMapLayers.pfsEngineering) {
          const d = toPfsEngineeringDetail(props)
          if (d) setGeoSelection((g) => (g?.kind === 'pfs' && g.detail.id === id ? null : { kind: 'pfs', detail: d }))
          return
        }
        if (layerId === INFRA_POINT_CORE_LAYER_ID && opsMapLayers.infra) {
          setGeoSelection((g) =>
            g?.kind === 'infra' && g.id === id
              ? null
              : {
                  kind: 'infra',
                  id,
                  label: String(props.label ?? ''),
                  sublabel: String(props.sublabel ?? ''),
                  infraKind: String(props.kind ?? ''),
                  details: props.details ? String(props.details) : undefined,
                  source_ref: props.source_ref ? String(props.source_ref) : undefined,
                  as_of: props.as_of ? String(props.as_of) : undefined,
                  confidence: props.confidence ? String(props.confidence) : undefined,
                },
          )
          return
        }
        return
      }

      /* environment tab */
      const feat = pickFeatureByPriority(feats, ENV_LAYER_PRIORITY as unknown as string[])
      if (!feat?.properties) return
      const layerId = feat.layer?.id
      const props = feat.properties as Record<string, unknown>
      const id = props.id
      if (typeof id !== 'string') return

      if (layerId === HYDRO_SPRING_LAYER_ID || layerId === HYDRO_NODE_LAYER_ID) {
        setGeoSelection(null)
        const coords = (feat.geometry as { coordinates?: [number, number] }).coordinates
        if (selectedHydroNode?.id === id) {
          setSelectedHydroNode(null)
          return
        }
        const springTelem = layerId === HYDRO_SPRING_LAYER_ID ? env.springs.find((s) => s.id === id) : undefined
        const detail =
          layerId === HYDRO_SPRING_LAYER_ID
            ? toSpringDetail(props, coords, springTelem)
            : toHydroNodeDetail(props, coords)
        if (detail) setSelectedHydroNode(detail)
        return
      }

      setSelectedHydroNode(null)
      const envDetail = parseEnvMapFeature(props)
      if (envDetail) {
        setGeoSelection((g) => (g?.kind === 'env' && g.detail.id === id ? null : { kind: 'env', detail: envDetail }))
      }
    },
    [
      mapTab,
      opsMapLayers.tenements,
      opsMapLayers.deposits,
      opsMapLayers.drillHoles,
      opsMapLayers.pfsEngineering,
      opsMapLayers.plantSites,
      opsMapLayers.infra,
      opsMapLayers.plantSchematic,
      opsMapLayers.accessRoutes,
      opsMapLayers.licenceEnvelope,
      selectedPlantNode,
      selectedHydroNode,
      env.springs,
    ],
  )

  const switchTab = useCallback((tab: MapTab) => {
    setMapTab(tab)
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setGeoSelection(null)
  }, [])

  const handleClearGeoSelection = useCallback(() => setGeoSelection(null), [])

  const clearPinnedNode = useCallback(() => {
    if (mapTab === 'operations') setSelectedPlantNode(null)
    else setSelectedHydroNode(null)
  }, [mapTab])

  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS[1] ?? PREDICTIVE_HYDROLOGY_SCENARIOS[0]

  const weather = useSiteWeather(30, { enabled: mapTab === 'environment' })
  const hydroWeatherStrip = useMemo(
    () => ({
      loading: weather.loading,
      error: weather.error,
      windowPrecipMm: weather.windowPrecipMm,
      anomalyMm: weather.anomalyMm,
      source: weather.source,
      scenarioDroughtIndex: currentScenario.drought_index,
      scenarioHorizon: currentScenario.horizon,
    }),
    [weather, currentScenario],
  )

  const activeNode: PlantOverlayNodeDetail | HydroOverlayNodeDetail | null =
    mapTab === 'operations' ? selectedPlantNode : mapTab === 'environment' ? selectedHydroNode : null
  const isPinned = activeNode !== null
  const isHovering = hoveredNodeId !== null || mapHoverHint !== null

  const bottomMetrics = useMemo(
    () =>
      mapTab === 'operations'
        ? [
            { label: 'MREC Output', value: `${plant.output.mrec_kg_hr.toFixed(1)} kg/hr`, sub: 'XRF (simulated) · pilot scale' },
            { label: 'NdPr Ratio', value: `${plant.output.ndpr_ratio_pct.toFixed(1)}%`, sub: 'of TREO basket' },
            { label: 'Inflow', value: `${plant.flow_metrics.in_liters_sec.toFixed(0)} L/s`, sub: 'Process water in' },
            { label: 'NH₄ Feed', value: `${plant.leaching_circuit.ammonium_sulfate_ml_min.toFixed(0)} ml/min`, sub: 'Tracked reagent feed' },
            { label: 'Annual NdPr', value: `${PROJECT_FINANCIALS.annual_ndpr_t.toLocaleString()} t/yr`, sub: 'LOM target' },
          ]
        : [
            { label: 'Spring Preservation', value: `${currentScenario.spring_preservation_pct}%`, sub: currentScenario.horizon },
            { label: 'Active Springs', value: `${currentScenario.active_springs}/${SPRING_COUNT}`, sub: 'Modeled protected count' },
            { label: 'Guardband', value: `${currentScenario.sulfate_guardband_ppm} ppm`, sub: 'Before sulfate breach' },
            { label: 'Recirculation', value: `${currentScenario.recirculation_pct.toFixed(1)}%`, sub: 'Commercial case model' },
            { label: 'LI Signal', value: currentScenario.permitting_signal, sub: 'Hearing readiness' },
          ],
    [mapTab, plant, currentScenario, PROJECT_FINANCIALS, SPRING_COUNT],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        padding: '12px 14px',
        gap: 10,
      }}
    >
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div
            className={fieldChrome.mapHero}
            style={{
              borderRadius: W.radius.lg,
              border: `1px solid ${TAB_COLOR[mapTab]}30`,
              boxShadow: `0 0 22px ${TAB_COLOR[mapTab]}14, inset 0 1px 0 ${W.glass04}`,
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            <div className={fieldChrome.mapTitleRow} style={{ zIndex: MAP_STACKING.fieldTitle }}>
              <div className="flex items-center gap-1.5">
                <GlowingIcon
                  icon={mapTab === 'operations' ? Globe : Layers}
                  color={mapTab === 'operations' ? 'violet' : 'cyan'}
                  size={11}
                />
                <span className={fieldChrome.mapTitleLabel}>{MAP_HEADER_TEXT[mapTab]}</span>
              </div>
            </div>

            <MapBase
              interactiveLayerIds={interactiveLayerIds}
              cursor={isHovering ? 'pointer' : ''}
              highlightWater={mapTab === 'environment'}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
            >
              <CaldeiraBoundary />
              {mapTab === 'operations' && (
                <>
                  {opsMapLayers.neighbors && <NeighborOverlay />}
                  {opsMapLayers.licenceEnvelope && <LicenceEnvelopeOverlay />}
                  {opsMapLayers.deposits && (
                    <DepositOverlay hoveredDepositId={null} selectedDepositId={null} />
                  )}
                  {opsMapLayers.tenements && (
                    <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                  )}
                  {opsMapLayers.pfsEngineering && (
                    <PfsEngineeringOverlay hoveredId={null} selectedId={null} />
                  )}
                  {opsMapLayers.accessRoutes && <AccessRoutesOverlay />}
                  {opsMapLayers.drillHoles && (
                    <DrillHoleOverlay
                      hoveredHoleId={null}
                      holeTypeFilter={opsMapLayers.holeTypeFilter}
                    />
                  )}
                  {opsMapLayers.plantSites && (
                    <OpsPlantSitesOverlay
                      hoveredId={hoveredNodeId}
                      selectedId={
                        geoSelection?.kind === 'infra' &&
                        (geoSelection.id === 'PLANT-PILOT-01' || geoSelection.id === 'PLANT-COMM-01')
                          ? geoSelection.id
                          : null
                      }
                    />
                  )}
                  {opsMapLayers.infra && <InfraOverlay showRoute={false} mapId="aetherField" />}
                  {opsMapLayers.plantSchematic && (
                    <PlantOverlay
                      plant={plant}
                      env={env}
                      hoveredNodeId={hoveredNodeId}
                      selectedNodeId={selectedPlantNode?.id ?? null}
                    />
                  )}
                </>
              )}
              {mapTab === 'environment' && (
                <>
                  <EnvironmentalOverlay
                    showApa={envMapLayers.apa}
                    showBuffer={envMapLayers.buffer}
                    showMonitoring={envMapLayers.monitoring}
                    showUrban={envMapLayers.urban}
                    showUdc={envMapLayers.udc}
                  />
                  <HydroOverlay
                    env={env}
                    hoveredNodeId={hoveredNodeId}
                    selectedNodeId={selectedHydroNode?.id ?? null}
                    weatherStrip={hydroWeatherStrip}
                  />
                </>
              )}
            </MapBase>

            {mapHoverHint && (
              <div
                className="pointer-events-none absolute bottom-7 left-2 z-[2] max-w-[min(280px,90%)] rounded-md px-2 py-1 font-mono text-[9px]"
                style={{
                  background: 'rgba(6,6,16,0.88)',
                  border: W.chromeBorder,
                  color: W.text3,
                }}
              >
                {mapHoverHint}
              </div>
            )}
            <div
              className="pointer-events-none absolute bottom-1 left-2 z-[2] max-w-[90%] text-[8px]"
              style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)' }}
            >
              Geometries: terrain-aligned ops master — see docs/data/caldeira/DATA_SOURCES.md (non-survey)
            </div>
          </div>

          <FieldBottomMetrics tabKey={mapTab} items={bottomMetrics} />
        </div>

        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minHeight: 0 }}>
          <TabSwitcher items={TAB_ITEMS} active={mapTab} onSelect={switchTab} layoutId="field-tab-pill" />

          <FieldPinnedAssetCard
            mapTab={mapTab}
            isPinned={isPinned}
            isHovering={isHovering && !geoSelection}
            activeNode={activeNode}
            onClear={clearPinnedNode}
          />

          <FieldMapGeoInspector selection={geoSelection} onClear={handleClearGeoSelection} />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {mapTab === 'operations' && (
                <OperationsPanel opsMapLayers={opsMapLayers} setOpsMapLayers={setOpsMapLayers} />
              )}
              {mapTab === 'environment' && (
                <EnvironmentPanel
                  envMapLayers={envMapLayers}
                  setEnvMapLayers={setEnvMapLayers}
                  siteWeather={weather}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
