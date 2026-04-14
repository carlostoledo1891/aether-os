import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Layers, Settings } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { HydroStation } from './field/HydroStation'
import { PilotPlantCard } from '../components/plant/PilotPlantCard'
import { ControlRoom } from '../components/plant/ControlRoom'
import { MapBase } from '../components/map/MapBase'
import { MapOverlays } from '../components/map/MapOverlays'
import { HydroOverlay, HydroLegend } from '../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../components/map/HydroOverlay'
import { DrillHoleOverlay } from '../components/map/DrillHoleOverlay'
import { PfsEngineeringOverlay } from '../components/map/PfsEngineeringOverlay'
import { OpsPlantSitesOverlay } from '../components/map/OpsPlantSitesOverlay'
import { MapFeaturePopup } from '../components/map/MapFeaturePopup'
import { MapLayerPanel } from '../components/map/MapLayerPanel'
import { MapBookmarkControl } from '../components/map/MapBookmarkControl'
import { useLayerSurface } from '../components/map/useMapLayers'
import { VISIBLE_LAYER_GROUPS } from '../components/map/layerRegistry'
import { HydroMonitoringCard } from '../components/map/HydroMonitoringCard'
import { W } from '../app/canvas/canvasTheme'
import { Z } from '../components/map/mapStacking'
import hydroStyles from '../components/map/HydroOverlay.module.css'
import { useMapCameraRestore } from '../hooks/useMapCameraRestore'
import { useTelemetry } from '../services/DataServiceProvider'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { useSiteWeather } from '../hooks/useSiteWeather'
import { WATER_SULFATE_LIMIT_PPM, WATER_NITRATE_LIMIT_PPM } from '../data/domainThresholds'

import type { MapTab } from './field/constants'
import { OperationsPanel } from './field/OperationsPanel'
import { EnvironmentPanel } from './field/EnvironmentPanel'
import { FieldBottomMetrics } from './field/FieldBottomMetrics'
import { FieldPinnedAssetCard } from './field/FieldPinnedAssetCard'
import { useSharedMapLayers } from './field/fieldMapLayers'
import { useMapInteraction } from './field/useMapInteraction'
import fieldChrome from './field/FieldMapChrome.module.css'
const TAB_ITEMS: { id: MapTab; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'operations',  label: 'Operations', icon: Settings,    color: W.violet },
  { id: 'environment', label: 'Hydro Twin', icon: Layers,      color: W.cyan   },
]

function DiamondShape({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="6" height="6" rx="1" fill={color} transform="rotate(45 5 5)" />
    </svg>
  )
}

function FieldOpsLegend() {
  return (
    <div style={{
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
        <DiamondShape color="#7E22CE" />
        <span>TREO &ge; 10 000 ppm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <DiamondShape color="#A855F7" />
        <span>TREO 5 000–10 000 ppm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <DiamondShape color={W.violetSoft} />
        <span>TREO 3 000–5 000 ppm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <DiamondShape color={W.violet} />
        <span>TREO 2 200–3 000 ppm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <DiamondShape color="#C4B5FD" />
        <span>TREO &lt; 2 200 ppm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 8, height: 3, borderRadius: 1, background: W.violet }} />
        <span>Licence area</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 8, height: 3, borderRadius: 1, background: `${W.violet}50` }} />
        <span>Caldeira boundary</span>
      </div>
    </div>
  )
}

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
  const { data: marketFx } = useServiceQuery('market-fx', s => s.getMarketFx())
  const { data: marketStock } = useServiceQuery('market-stock', s => s.getMarketStock())
  const [mapTab, setMapTab] = useState<MapTab>('operations')
  const [controlRoomOpen, setControlRoomOpen] = useState(false)
  const [hydroStationOpen, setHydroStationOpen] = useState(false)
  const { opsMapLayers } = useSharedMapLayers()
  const mapLayers = useLayerSurface({ mode: 'shared-field' })

  useEffect(() => {
    mapLayers.setActiveGroups(VISIBLE_LAYER_GROUPS)
  }, [mapLayers])

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
  } = useMapInteraction({ mapTab, opsMapLayers, springsRef, visibleLayerIds: mapLayers.visibleLayerIds })

  const ls = mapLayers.state

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

  const springCounts = useMemo(() => ({
    active: env.springs.filter(s => s.status === 'Active').length,
    reduced: env.springs.filter(s => s.status === 'Reduced').length,
    suppressed: env.springs.filter(s => s.status === 'Suppressed').length,
  }), [env.springs])

  const waterQualityAlert = env.water_quality.sulfate_ppm >= WATER_SULFATE_LIMIT_PPM || env.water_quality.nitrate_ppm >= WATER_NITRATE_LIMIT_PPM
  const showRainStressBadge = Boolean(
    hydroWeatherStrip.anomalyMm < -6
    && hydroWeatherStrip.scenarioDroughtIndex >= 0.35,
  )

  const fieldPanelState = ls

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
            ...(marketFx ? [{ label: 'BRL/USD', value: marketFx.value.toFixed(2), sub: marketFx.source === 'mock' ? 'Mock' : 'BCB PTAX' }] : []),
            ...(marketStock ? [{ label: 'MEI.AX', value: `A$${marketStock.value.toFixed(3)}`, sub: marketStock.source === 'mock' ? 'Mock' : 'Alpha Vantage' }] : []),
          ]
        : [
            { label: 'Spring Preservation', value: `${currentScenario?.spring_preservation_pct ?? '—'}%`, sub: currentScenario?.horizon ?? '' },
            { label: 'Active Springs', value: `${currentScenario?.active_springs ?? '—'}/${SPRING_COUNT ?? '—'}`, sub: 'Modeled protected count' },
            { label: 'Guardband', value: `${currentScenario?.sulfate_guardband_ppm ?? '—'} ppm`, sub: 'Before sulfate breach' },
            { label: 'Recirculation', value: `${currentScenario?.recirculation_pct?.toFixed(1) ?? '—'}%`, sub: 'Commercial case model' },
            { label: 'LI Signal', value: currentScenario?.permitting_signal ?? '—', sub: 'Hearing readiness' },
          ],
    [mapTab, plant, currentScenario, PROJECT_FINANCIALS, SPRING_COUNT, marketFx, marketStock],
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
              interactiveLayerIds={mapLayers.interactiveLayerIds}
              cursor={isHovering ? 'pointer' : ''}
              highlightWater={mapTab === 'environment'}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
              controlSlots={{
                topLeft: (
                  <>
                    {mapTab === 'operations' && !controlRoomOpen && (
                      <PilotPlantCard onOpen={() => setControlRoomOpen(true)} />
                    )}
                    {mapTab === 'environment' && !hydroStationOpen && (
                      <>
                        <HydroMonitoringCard
                          springCounts={springCounts}
                          sulfatePpm={env.water_quality.sulfate_ppm}
                          weatherStrip={hydroWeatherStrip}
                          onOpenStation={() => setHydroStationOpen(true)}
                        />
                        <div className={hydroStyles.wqBadge + ' ' + (waterQualityAlert ? hydroStyles.wqBadgeWarn : hydroStyles.wqBadgeOk)}>
                          WQ · SO4 {env.water_quality.sulfate_ppm.toFixed(0)} ppm · NO3 {env.water_quality.nitrate_ppm.toFixed(0)} ppm
                        </div>
                        {showRainStressBadge && (
                          <div className={hydroStyles.rainStressBadge}>
                            Rain deficit vs norm · watch springs
                          </div>
                        )}
                      </>
                    )}
                  </>
                ),
                topRight: (
                  <>
                    <MapBookmarkControl mapId="aetherField" />
                    <MapLayerPanel
                      state={fieldPanelState}
                      onToggle={mapLayers.toggle}
                      groups={VISIBLE_LAYER_GROUPS}
                      terrainExaggeration={mapLayers.terrainExaggeration}
                      onTerrainExaggerationChange={mapLayers.setTerrainExaggeration}
                    />
                  </>
                ),
                bottomRight: mapTab === 'operations' ? <FieldOpsLegend /> : <HydroLegend />,
              }}
            >
              <MapOverlays
                layers={mapLayers.visibleLayerIds}
                terrainExaggeration={mapLayers.terrainExaggeration}
                renderOverrides={{
                  drillholes: ls.drillholes ? (
                    <DrillHoleOverlay
                      hoveredHoleId={hoveredNodeId}
                      holeTypeFilter={opsMapLayers.holeTypeFilter}
                    />
                  ) : null,
                  pfs: ls.pfs ? (
                    <PfsEngineeringOverlay hoveredId={null} selectedId={null} />
                  ) : null,
                  plantSites: ls.plantSites ? (
                    <OpsPlantSitesOverlay
                      hoveredId={hoveredNodeId}
                      selectedId={
                        geoSelection?.kind === 'infra' &&
                        (geoSelection.id === 'PLANT-PILOT-01' || geoSelection.id === 'PLANT-COMM-01')
                          ? geoSelection.id
                          : null
                      }
                    />
                  ) : null,
                  hydroSprings: (ls.hydroSprings || ls.hydroNodes) && mapTab === 'environment' ? (
                    <HydroOverlay
                      env={env}
                      hoveredNodeId={hoveredNodeId}
                      selectedNodeId={selectedHydroNode?.id ?? null}
                    />
                  ) : undefined,
                  hydroNodes: (ls.hydroSprings || ls.hydroNodes) && mapTab === 'environment' ? (
                    <HydroOverlay
                      env={env}
                      hoveredNodeId={hoveredNodeId}
                      selectedNodeId={selectedHydroNode?.id ?? null}
                    />
                  ) : undefined,
                }}
              />
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
