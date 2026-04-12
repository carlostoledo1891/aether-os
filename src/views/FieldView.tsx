import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Layers, Settings } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { HydroStation } from './field/HydroStation'
import { PilotPlantCard } from '../components/plant/PilotPlantCard'
import { ControlRoom } from '../components/plant/ControlRoom'
import { MapBase } from '../components/map/MapBase'
import { HydroOverlay, HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID } from '../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../components/map/HydroOverlay'
import { CaldeiraBoundary, CALDEIRA_BOUNDARY_LAYER_ID } from '../components/map/CaldeiraBoundary'
import {
  EnvironmentalOverlay,
  ENV_APA_FILL_LAYER_ID,
  ENV_BUFFER_FILL_LAYER_ID,
  ENV_MONITORING_FILL_LAYER_ID,
  ENV_URBAN_FILL_LAYER_ID,
  ENV_URBAN_CENTROID_CORE_LAYER_ID,
} from '../components/map/EnvironmentalOverlay'
import { LicenseOverlay, LICENSE_LAYER_ID } from '../components/map/LicenseOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID } from '../components/map/DrillHoleOverlay'
import { PfsEngineeringOverlay, PFS_ENGINEERING_FILL_LAYER_ID } from '../components/map/PfsEngineeringOverlay'
import { InfraOverlay, INFRA_POINT_CORE_LAYER_ID } from '../components/map/InfraOverlay'
import { OpsPlantSitesOverlay, OPS_PLANT_SITE_CORE_LAYER_ID } from '../components/map/OpsPlantSitesOverlay'
import { MapFeaturePopup } from '../components/map/MapFeaturePopup'
import { MapLayerPicker } from '../components/map/MapLayerPicker'
import { W } from '../app/canvas/canvasTheme'
import { Z } from '../components/map/mapStacking'
import { useMapCameraRestore } from '../hooks/useMapCameraRestore'
import { useTelemetry } from '../services/DataServiceProvider'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { useSiteWeather } from '../hooks/useSiteWeather'

import type { MapTab } from './field/constants'
import { TAB_COLOR } from './field/constants'
import { OperationsPanel } from './field/OperationsPanel'
import { EnvironmentPanel } from './field/EnvironmentPanel'
import { FieldBottomMetrics } from './field/FieldBottomMetrics'
import { FieldPinnedAssetCard } from './field/FieldPinnedAssetCard'
import {
  type FieldEnvMapLayers,
  type FieldOpsMapLayers,
  useSharedMapLayers,
} from './field/fieldMapLayers'
import { useMapInteraction } from './field/useMapInteraction'
import fieldChrome from './field/FieldMapChrome.module.css'
const TAB_ITEMS: { id: MapTab; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'operations',  label: 'Operations', icon: Settings,    color: W.violet },
  { id: 'environment', label: 'Hydro Twin', icon: Layers,      color: W.cyan   },
]

interface FieldViewProps {
  highlightFeatureId?: string | null
}

export function FieldView({ highlightFeatureId }: FieldViewProps) {
  const initialCamera = useMapCameraRestore('aetherField')
  const { plant, env } = useTelemetry()
  const springsRef = useRef(env.springs)
  useEffect(() => {
    springsRef.current = env.springs
  }, [env.springs])

  const { data: PROJECT_FINANCIALS } = useServiceQuery('project-financials', s => s.getProjectFinancials())
  const { data: PREDICTIVE_HYDROLOGY_SCENARIOS } = useServiceQuery('hydrology-scenarios', s => s.getHydrologyScenarios())
  const { data: SPRING_COUNT } = useServiceQuery('spring-count', s => s.getSpringCount())
  const [mapTab, setMapTab] = useState<MapTab>('operations')
  const [controlRoomOpen, setControlRoomOpen] = useState(false)
  const [hydroStationOpen, setHydroStationOpen] = useState(false)
  const { opsMapLayers, envMapLayers, setOpsMapLayers, setEnvMapLayers } = useSharedMapLayers()

  const {
    hoveredNodeId,
    setHoveredNodeId,
    mapHoverHint,
    setMapHoverHint,
    popupData,
    selectedHydroNode,
    setSelectedHydroNode,
    geoSelection,
    setGeoSelection,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleMapClick,
  } = useMapInteraction({ mapTab, opsMapLayers, springsRef })

  const interactiveLayerIds = useMemo(() => {
    if (mapTab === 'operations') {
      const ids: string[] = []
      if (opsMapLayers.tenements) ids.push(LICENSE_LAYER_ID)
      if (opsMapLayers.drillHoles) ids.push(DRILL_LAYER_ID)
      if (opsMapLayers.pfsEngineering) ids.push(PFS_ENGINEERING_FILL_LAYER_ID)
      if (opsMapLayers.plantSites) ids.push(OPS_PLANT_SITE_CORE_LAYER_ID)
      if (opsMapLayers.infra) ids.push(INFRA_POINT_CORE_LAYER_ID)
      ids.push(CALDEIRA_BOUNDARY_LAYER_ID)
      return ids
    }
    const e: string[] = [HYDRO_NODE_LAYER_ID, HYDRO_SPRING_LAYER_ID, LICENSE_LAYER_ID]
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
    e.push(CALDEIRA_BOUNDARY_LAYER_ID)
    return e
  }, [mapTab, opsMapLayers, envMapLayers])

  const switchTab = useCallback((tab: MapTab) => {
    setMapTab(tab)
    setHydroStationOpen(false)
    setControlRoomOpen(false)
    setHoveredNodeId(null)
    setMapHoverHint(null)
    setGeoSelection(null)
  }, [setHoveredNodeId, setMapHoverHint, setGeoSelection])

  const handleClearGeoSelection = useCallback(() => setGeoSelection(null), [setGeoSelection])

  const clearPinnedNode = useCallback(() => {
    if (mapTab === 'environment') setSelectedHydroNode(null)
  }, [mapTab, setSelectedHydroNode])

  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS?.[1] ?? PREDICTIVE_HYDROLOGY_SCENARIOS?.[0]

  const weather = useSiteWeather(30, { enabled: mapTab === 'environment' })
  const hydroWeatherStrip = useMemo(
    () => ({
      loading: weather.loading,
      error: weather.error,
      windowPrecipMm: weather.windowPrecipMm,
      anomalyMm: weather.anomalyMm,
      source: weather.source,
      scenarioDroughtIndex: currentScenario?.drought_index ?? 0,
      scenarioHorizon: currentScenario?.horizon ?? '',
    }),
    [weather, currentScenario],
  )

  const layerToggles = useMemo(() => {
    if (mapTab === 'operations') {
      return [
        { id: 'plantSites', label: 'Pilot + commercial plant sites', checked: opsMapLayers.plantSites },
        { id: 'tenements', label: 'Mining licences', checked: opsMapLayers.tenements },
        { id: 'pfsEngineering', label: 'PFS starter pit + spent clay', checked: opsMapLayers.pfsEngineering },
        { id: 'drillHoles', label: 'Named drill collars', checked: opsMapLayers.drillHoles },
        { id: 'infra', label: 'Logistics mesh', checked: opsMapLayers.infra },
      ]
    }
    return [
      { id: 'apa', label: 'APA Pedra Branca', checked: envMapLayers.apa },
      { id: 'buffer', label: 'APA buffer ring', checked: envMapLayers.buffer },
      { id: 'monitoring', label: 'Monitoring / cumulative zone', checked: envMapLayers.monitoring },
      { id: 'urban', label: 'Urban context (OSM-style)', checked: envMapLayers.urban },
    ]
  }, [mapTab, opsMapLayers, envMapLayers])

  const handleLayerToggle = useCallback((id: string) => {
    if (mapTab === 'operations') {
      setOpsMapLayers(prev => ({ ...prev, [id]: !prev[id as keyof FieldOpsMapLayers] }))
    } else {
      setEnvMapLayers(prev => ({ ...prev, [id]: !prev[id as keyof FieldEnvMapLayers] }))
    }
  }, [mapTab, setOpsMapLayers, setEnvMapLayers])

  const activeNode: HydroOverlayNodeDetail | null =
    mapTab === 'environment' ? selectedHydroNode : null
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
            { label: 'Annual NdPr', value: `${PROJECT_FINANCIALS?.annual_ndpr_t.toLocaleString() ?? '—'} t/yr`, sub: 'LOM target' },
          ]
        : [
            { label: 'Spring Preservation', value: `${currentScenario?.spring_preservation_pct ?? '—'}%`, sub: currentScenario?.horizon ?? '' },
            { label: 'Active Springs', value: `${currentScenario?.active_springs ?? '—'}/${SPRING_COUNT ?? '—'}`, sub: 'Modeled protected count' },
            { label: 'Guardband', value: `${currentScenario?.sulfate_guardband_ppm ?? '—'} ppm`, sub: 'Before sulfate breach' },
            { label: 'Recirculation', value: `${currentScenario?.recirculation_pct?.toFixed(1) ?? '—'}%`, sub: 'Commercial case model' },
            { label: 'LI Signal', value: currentScenario?.permitting_signal ?? '—', sub: 'Hearing readiness' },
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
              border: `1px solid ${W.border2}`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.5)`,
            }}
          >
            <MapBase
              initialViewState={initialCamera ?? undefined}
              interactiveLayerIds={interactiveLayerIds}
              cursor={isHovering ? 'pointer' : ''}
              highlightWater={mapTab === 'environment'}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
            >
              <CaldeiraBoundary />
              {mapTab === 'operations' && (
                <>
                  {/* Polygons (renderOrder 1-9) — painted first, below everything */}
                  {opsMapLayers.tenements && (
                    <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                  )}
                  {opsMapLayers.pfsEngineering && (
                    <PfsEngineeringOverlay hoveredId={null} selectedId={null} />
                  )}
                  {/* Lines (renderOrder 20+) */}
                  {/* Points (renderOrder 30+) — painted last, on top */}
                  {opsMapLayers.drillHoles && (
                    <DrillHoleOverlay
                      hoveredHoleId={hoveredNodeId}
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
                  {opsMapLayers.infra && <InfraOverlay highlightId={null} />}
                </>
              )}
              {mapTab === 'environment' && (
                <>
                  {/* Polygons first — licenses + environmental areas below points */}
                  <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                  <EnvironmentalOverlay
                    showApa={envMapLayers.apa}
                    showBuffer={envMapLayers.buffer}
                    showMonitoring={envMapLayers.monitoring}
                    showUrban={envMapLayers.urban}
                  />
                  {/* Points on top */}
                  <HydroOverlay
                    env={env}
                    hoveredNodeId={hoveredNodeId}
                    selectedNodeId={selectedHydroNode?.id ?? null}
                    weatherStrip={hydroWeatherStrip}
                    onOpenStation={() => setHydroStationOpen(true)}
                  />
                </>
              )}
            </MapBase>
            <MapFeaturePopup data={popupData?.data ?? null} x={popupData?.x ?? 0} y={popupData?.y ?? 0} />
            <AnimatePresence>
              {highlightFeatureId && (
                <motion.div
                  key="highlight-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '3px 10px',
                    borderRadius: W.radius.sm,
                    background: W.violetSubtle,
                    border: `1px solid ${W.violet}40`,
                    fontSize: 9,
                    fontWeight: 600,
                    color: W.violetSoft,
                    fontFamily: 'var(--font-mono)',
                    pointerEvents: 'none',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    zIndex: Z.header,
                  }}
                >
                  Alert source: {highlightFeatureId}
                </motion.div>
              )}
            </AnimatePresence>
            <MapLayerPicker layers={layerToggles} onToggle={handleLayerToggle} />
            <AnimatePresence>
              {mapTab === 'operations' && !controlRoomOpen && (
                <PilotPlantCard onOpen={() => setControlRoomOpen(true)} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {controlRoomOpen && mapTab === 'operations' && (
                <ControlRoom onClose={() => setControlRoomOpen(false)} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {hydroStationOpen && mapTab === 'environment' && (
                <HydroStation onClose={() => setHydroStationOpen(false)} />
              )}
            </AnimatePresence>
            {mapTab === 'operations' && (
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                zIndex: Z.mapHud,
                background: W.mapControlBg,
                border: W.mapControlBorder,
                borderRadius: 8,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: 10,
                color: W.text3,
              }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9 }}>Legend</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.green }} />
                  <span>TREO ≥ 2.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.amber }} />
                  <span>TREO 1.0–2.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.red }} />
                  <span>TREO &lt; 1.0%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: W.violet }} />
                  <span>Licence area</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: W.glass04, border: `1px dashed ${W.glass08}` }} />
                  <span>Caldeira boundary</span>
                </div>
              </div>
            )}
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
            geoSelection={geoSelection}
            onClear={clearPinnedNode}
            onClearGeo={handleClearGeoSelection}
          />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {mapTab === 'operations' && (
                <OperationsPanel />
              )}
              {mapTab === 'environment' && (
                <EnvironmentPanel siteWeather={weather} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
