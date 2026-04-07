import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Globe, Layers, Settings, Mountain, ShieldCheck,
} from 'lucide-react'
import type { PlantTelemetry, EnvTelemetry } from '../types/telemetry'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowingIcon } from '../components/ui/GlowingIcon'
import { StatusChip } from '../components/ui/StatusChip'
import { MapBase } from '../components/map/MapBase'
import type { MapLayerMouseEvent } from '../components/map/MapBase'
import { PlantOverlay, PLANT_NODE_LAYER_ID, toPlantNodeDetail } from '../components/map/PlantOverlay'
import type { PlantOverlayNodeDetail } from '../components/map/PlantOverlay'
import { HydroOverlay, HYDRO_NODE_LAYER_ID, toHydroNodeDetail } from '../components/map/HydroOverlay'
import type { HydroOverlayNodeDetail } from '../components/map/HydroOverlay'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { DepositOverlay, DEPOSIT_LAYER_ID, toDepositDetail } from '../components/map/DepositOverlay'
import type { DepositDetail } from '../components/map/DepositOverlay'
import { LicenseOverlay, LICENSE_LAYER_ID, toLicenseDetail } from '../components/map/LicenseOverlay'
import type { LicenseDetail } from '../components/map/LicenseOverlay'
import { DrillHoleOverlay } from '../components/map/DrillHoleOverlay'
import { EnvironmentalOverlay } from '../components/map/EnvironmentalOverlay'
import { NeighborOverlay } from '../components/map/NeighborOverlay'
import { W } from '../app/canvas/canvasTheme'
import { PROJECT_FINANCIALS, PREDICTIVE_HYDROLOGY_SCENARIOS } from '../data/mockData'

import type { MapTab } from './field/constants'
import { TAB_COLOR } from './field/constants'
import { OperationsPanel } from './field/OperationsPanel'
import { GeologyPanel } from './field/GeologyPanel'
import { LicensesPanel } from './field/LicensesPanel'
import { EnvironmentPanel } from './field/EnvironmentPanel'

interface FieldViewProps {
  plant: PlantTelemetry
  plantHistory: PlantTelemetry[]
  env: EnvTelemetry
  envHistory: EnvTelemetry[]
}

const TAB_ITEMS: { id: MapTab; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'operations',  label: 'Operations', icon: Settings,    color: W.violet },
  { id: 'geology',     label: 'Geology',    icon: Mountain,    color: W.amber  },
  { id: 'licenses',    label: 'Licences',   icon: ShieldCheck, color: W.green  },
  { id: 'environment', label: 'Hydro Twin', icon: Layers,      color: W.cyan   },
]

const MAP_HEADER_TEXT: Record<MapTab, string> = {
  operations:  'Pilot telemetry → board-grade trust layer',
  geology:     '1.5 Bt resource · 7 deposits · Poços de Caldas Alkaline Complex',
  licenses:    'LP approved Dec 2025 · LI target Jun 2026 · 77 licences · 193 km²',
  environment: 'Hydro Digital Twin → cumulative aquifer + spring model → LI defense',
}

export function FieldView({ plant, plantHistory, env, envHistory }: FieldViewProps) {
  const [mapTab, setMapTab] = useState<MapTab>('operations')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedPlantNode, setSelectedPlantNode] = useState<PlantOverlayNodeDetail | null>(null)
  const [selectedHydroNode, setSelectedHydroNode] = useState<HydroOverlayNodeDetail | null>(null)
  const [selectedDeposit, setSelectedDeposit]     = useState<DepositDetail | null>(null)
  const [selectedLicense, setSelectedLicense]     = useState<LicenseDetail | null>(null)

  const interactiveLayerIds = useMemo(() =>
    mapTab === 'operations'  ? [PLANT_NODE_LAYER_ID]  :
    mapTab === 'geology'     ? [DEPOSIT_LAYER_ID]     :
    mapTab === 'licenses'    ? [LICENSE_LAYER_ID]     :
    [HYDRO_NODE_LAYER_ID]
  , [mapTab])

  const handleMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const id = e.features?.[0]?.properties?.id
    if (typeof id === 'string') setHoveredNodeId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null)
  }, [])

  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const feat = e.features?.[0]
    if (!feat) return
    const id = feat.properties?.id
    if (typeof id !== 'string') return
    const coords = (feat.geometry as { coordinates?: [number, number] }).coordinates

    if (mapTab === 'operations') {
      if (selectedPlantNode?.id === id) { setSelectedPlantNode(null); return }
      setSelectedPlantNode(toPlantNodeDetail(feat.properties ?? {}, coords))
    } else if (mapTab === 'geology') {
      if (selectedDeposit?.id === id) { setSelectedDeposit(null); return }
      const detail = toDepositDetail(feat.properties ?? {})
      if (detail) setSelectedDeposit(detail)
    } else if (mapTab === 'licenses') {
      if (selectedLicense?.id === id) { setSelectedLicense(null); return }
      const detail = toLicenseDetail(feat.properties ?? {})
      if (detail) setSelectedLicense(detail)
    } else {
      if (selectedHydroNode?.id === id) { setSelectedHydroNode(null); return }
      setSelectedHydroNode(toHydroNodeDetail(feat.properties ?? {}, coords))
    }
  }, [mapTab, selectedPlantNode, selectedDeposit, selectedLicense, selectedHydroNode])

  const switchTab = useCallback((tab: MapTab) => {
    setMapTab(tab)
    setHoveredNodeId(null)
  }, [])

  const springCounts = useMemo(() => ({
    active: env.springs.filter(s => s.status === 'Active').length,
  }), [env.springs])

  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS[1]

  const activeNode: (PlantOverlayNodeDetail | HydroOverlayNodeDetail | null) =
    mapTab === 'operations' ? selectedPlantNode : mapTab === 'environment' ? selectedHydroNode : null
  const isPinned = activeNode !== null || selectedDeposit !== null || selectedLicense !== null
  const isHovering = hoveredNodeId !== null

  const bottomMetrics = useMemo(() =>
    mapTab === 'operations' ? [
      { label: 'MREC Output', value: `${plant.output.mrec_kg_hr.toFixed(1)} kg/hr`, sub: 'Live XRF · pilot scale' },
      { label: 'NdPr Ratio', value: `${plant.output.ndpr_ratio_pct.toFixed(1)}%`, sub: 'of TREO basket' },
      { label: 'Inflow', value: `${plant.flow_metrics.in_liters_sec.toFixed(0)} L/s`, sub: 'Process water in' },
      { label: 'NH₄ Feed', value: `${plant.leaching_circuit.ammonium_sulfate_ml_min.toFixed(0)} ml/min`, sub: 'Tracked reagent feed' },
      { label: 'Annual NdPr', value: `${PROJECT_FINANCIALS.annual_ndpr_t.toLocaleString()} t/yr`, sub: 'LOM target' },
    ] :
    mapTab === 'geology' ? [
      { label: 'Global Resource', value: '1.5 Bt', sub: '@ 2,359 ppm TREO' },
      { label: 'M&I Resource', value: '666 Mt', sub: '@ 2,685 ppm TREO' },
      { label: 'MREO Avg', value: '24%', sub: 'Magnetic REO fraction' },
      { label: 'Measured', value: '37 Mt', sub: '@ 2,983 ppm TREO' },
      { label: 'Deposits', value: '7', sub: 'Capão·Soberbo·Fig·BdP·Ago·CVN·DM' },
    ] :
    mapTab === 'licenses' ? [
      { label: 'Total Licences', value: '77', sub: '193 km² total area' },
      { label: 'LP Status', value: 'Approved', sub: 'Dec 2025 · unanimous COPAM' },
      { label: 'LI Target', value: 'Jun 2026', sub: 'Construction clearance' },
      { label: 'South Contiguous', value: '67 km²', sub: '21 new licences acquired' },
      { label: 'LO Target', value: '2028', sub: 'Operating licence · production' },
    ] : [
      { label: 'Spring Preservation', value: `${currentScenario.spring_preservation_pct}%`, sub: currentScenario.horizon },
      { label: 'Active Springs', value: `${currentScenario.active_springs}/98`, sub: 'Modeled protected count' },
      { label: 'Guardband', value: `${currentScenario.sulfate_guardband_ppm} ppm`, sub: 'Before sulfate breach' },
      { label: 'Recirculation', value: `${currentScenario.recirculation_pct.toFixed(1)}%`, sub: 'Commercial case model' },
      { label: 'LI Signal', value: currentScenario.permitting_signal, sub: 'Hearing readiness' },
    ]
  , [mapTab, plant, currentScenario])

  function clearPinnedNode() {
    if (mapTab === 'operations') setSelectedPlantNode(null)
    else if (mapTab === 'geology') setSelectedDeposit(null)
    else if (mapTab === 'licenses') setSelectedLicense(null)
    else setSelectedHydroNode(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden', padding: '12px 14px', gap: 10,
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: W.text1, letterSpacing: '-0.01em' }}>
            Caldeira License-to-Operate Command Center
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: W.text3, marginTop: 2 }}>
            Meteoric Resources (ASX:MEI) · Poços de Caldas, Minas Gerais · permit defense, hydrology, and pilot-to-scale visibility
          </p>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <StatusChip label="Pilot Online" variant="green" dot />
          <StatusChip label={`Springs ${springCounts.active}/98 protected`} variant="cyan" />
          <StatusChip label="MPF / FEAM / Copam" variant="amber" />
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: W.green, boxShadow: `0 0 6px ${W.green}` }}/>
            <span style={{ fontSize: 10, color: W.green, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>LIVE</span>
          </motion.div>
        </div>
      </div>

      {/* Main body: Map + Right panel */}
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {/* Map hero */}
          <div style={{
            flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden',
            borderRadius: 14,
            border: `1px solid ${TAB_COLOR[mapTab]}30`,
            boxShadow: `0 0 22px ${TAB_COLOR[mapTab]}14, inset 0 1px 0 rgba(255,255,255,0.04)`,
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: 'linear-gradient(to bottom, rgba(6,6,16,0.88), transparent)',
              zIndex: 10, pointerEvents: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <GlowingIcon
                  icon={mapTab === 'operations' ? Globe : mapTab === 'geology' ? Mountain : mapTab === 'licenses' ? ShieldCheck : Layers}
                  color={mapTab === 'operations' ? 'violet' : mapTab === 'geology' ? 'amber' : mapTab === 'licenses' ? 'green' : 'cyan'}
                  size={11}
                />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: W.text3,
                  transition: 'color 0.3s',
                }}>
                  {MAP_HEADER_TEXT[mapTab]}
                </span>
              </div>
            </div>

            <MapBase
              interactiveLayerIds={interactiveLayerIds}
              cursor={isHovering ? 'pointer' : ''}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleMapClick}
            >
              <CaldeiraBoundary />
              {mapTab === 'operations' && (
                <PlantOverlay plant={plant} env={env} hoveredNodeId={hoveredNodeId} selectedNodeId={selectedPlantNode?.id ?? null} />
              )}
              {mapTab === 'geology' && (
                <>
                  <NeighborOverlay />
                  <DepositOverlay hoveredDepositId={hoveredNodeId} selectedDepositId={selectedDeposit?.id ?? null} />
                  <DrillHoleOverlay hoveredHoleId={hoveredNodeId} />
                </>
              )}
              {mapTab === 'licenses' && (
                <LicenseOverlay hoveredLicenseId={hoveredNodeId} selectedLicenseId={selectedLicense?.id ?? null} />
              )}
              {mapTab === 'environment' && (
                <>
                  <EnvironmentalOverlay />
                  <HydroOverlay env={env} hoveredNodeId={hoveredNodeId} selectedNodeId={selectedHydroNode?.id ?? null} />
                </>
              )}
            </MapBase>
          </div>

          {/* Bottom KPI strip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bottom-${mapTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ flexShrink: 0 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {bottomMetrics.map(({ label, value, sub }) => (
                  <GlassCard key={label} animate={false} style={{ padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: W.text3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{sub}</div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right panel */}
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minHeight: 0 }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
            padding: 3, gap: 2, flexShrink: 0,
          }}>
            {TAB_ITEMS.map(({ id, label, icon: Icon, color }) => {
              const isActive = mapTab === id
              return (
                <button key={id} onClick={() => switchTab(id)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 4, padding: '6px 5px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', position: 'relative', outline: 'none',
                  background: 'transparent', transition: 'background 0.2s',
                  minWidth: 0,
                }}>
                  {isActive && (
                    <motion.div
                      layoutId="field-tab-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 7,
                        background: `linear-gradient(135deg, ${color}22, ${color}0F)`,
                        border: `1px solid ${color}35`,
                        boxShadow: `0 0 8px ${color}18`,
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon size={11} style={{
                    color: isActive ? color : W.text4,
                    filter: isActive ? `drop-shadow(0 0 3px ${color}80)` : undefined,
                    zIndex: 1, flexShrink: 0,
                  }}/>
                  <span style={{
                    fontSize: 10, fontWeight: 600, zIndex: 1,
                    color: isActive ? W.text1 : W.text4,
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active asset card */}
          <GlassCard animate={false}
            glow={isPinned
              ? (mapTab === 'operations' ? 'violet' : mapTab === 'geology' ? 'amber' : mapTab === 'licenses' ? 'green' : 'cyan')
              : isHovering ? 'cyan' : 'none'}
            style={{ padding: '11px 13px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <GlowingIcon
                  icon={mapTab === 'operations' ? Settings : mapTab === 'geology' ? Mountain : mapTab === 'licenses' ? ShieldCheck : Layers}
                  color={mapTab === 'operations' ? 'violet' : mapTab === 'geology' ? 'amber' : mapTab === 'licenses' ? 'green' : 'cyan'}
                  size={11}
                />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text3 }}>
                  Active Asset
                </span>
              </div>
              {isPinned ? (
                <StatusChip label="PINNED" variant="violet" size="sm" />
              ) : isHovering ? (
                <StatusChip label="HOVER" variant="cyan" size="sm" />
              ) : (
                <StatusChip label="READY" variant="green" size="sm" />
              )}
            </div>
            {activeNode ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, marginBottom: 2 }}>{activeNode.label}</div>
                <div style={{ fontSize: 10, color: W.text4, marginBottom: 7 }}>{activeNode.sublabel}</div>
                <div style={{ padding: '5px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 7 }}>
                  <div style={{ fontSize: 10, color: mapTab === 'operations' ? W.violetSoft : W.cyan, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {activeNode.metric || 'Sensor state available on hover'}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                  {Math.abs(activeNode.coordinates[1]).toFixed(3)}°S · {Math.abs(activeNode.coordinates[0]).toFixed(3)}°W
                </div>
                <button onClick={clearPinnedNode} style={{ width: '100%', padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: W.text3, fontSize: 10, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  Clear pinned asset
                </button>
              </>
            ) : selectedDeposit ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, marginBottom: 2 }}>{selectedDeposit.name}</div>
                <div style={{ fontSize: 10, color: W.text4, marginBottom: 7 }}>{selectedDeposit.dimensions} · {selectedDeposit.orientation}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 7 }}>
                  {[
                    { k: 'TREO', v: `${selectedDeposit.treo_ppm.toLocaleString()} ppm` },
                    { k: 'MREO', v: `${selectedDeposit.mreo_pct}%` },
                    { k: 'Tonnage', v: selectedDeposit.tonnage_mt > 0 ? `${selectedDeposit.tonnage_mt} Mt` : 'MRE pending' },
                    { k: 'Clay avg', v: selectedDeposit.clay_depth_avg_m > 0 ? `${selectedDeposit.clay_depth_avg_m} m` : '—' },
                  ].map(({ k, v }) => (
                    <div key={k} style={{ padding: '4px 6px', borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '0 0 7px', fontSize: 11, color: W.text3, lineHeight: 1.4 }}>{selectedDeposit.resource_note}</p>
                <button onClick={clearPinnedNode} style={{ width: '100%', padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: W.text3, fontSize: 10, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  Clear selection
                </button>
              </>
            ) : selectedLicense ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, marginBottom: 2 }}>{selectedLicense.name}</div>
                <div style={{ fontSize: 10, color: W.text4, marginBottom: 7 }}>{selectedLicense.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 7 }}>
                  {[
                    { k: 'Area', v: `${selectedLicense.area_km2} km²` },
                    { k: 'Licences', v: `${selectedLicense.license_count}` },
                  ].map(({ k, v }) => (
                    <div key={k} style={{ padding: '4px 6px', borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <StatusChip
                  label={selectedLicense.status === 'lp_approved' ? 'LP APPROVED' : selectedLicense.status === 'li_pending' ? 'LI PENDING' : 'EXPLORATION'}
                  variant={selectedLicense.status === 'lp_approved' ? 'green' : selectedLicense.status === 'li_pending' ? 'amber' : 'violet'}
                  size="sm"
                />
                <p style={{ margin: '7px 0', fontSize: 11, color: W.text3, lineHeight: 1.4 }}>{selectedLicense.note}</p>
                <button onClick={clearPinnedNode} style={{ width: '100%', padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: W.text3, fontSize: 10, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  Clear selection
                </button>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
                {mapTab === 'geology'     ? 'Click a deposit polygon to pin its resource data here.' :
                 mapTab === 'licenses'    ? 'Click a licence zone to see its status and details.' :
                 mapTab === 'environment' ? 'Hydro Digital Twin — click any aquifer or spring node to pin live telemetry.' :
                 'Hover any node for a live overlay card, or click to pin.'}
              </p>
            )}
          </GlassCard>

          {/* Tab content */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {mapTab === 'operations' && (
                <OperationsPanel plant={plant} plantHistory={plantHistory} />
              )}
              {mapTab === 'geology' && (
                <GeologyPanel selectedDeposit={selectedDeposit} onSelectDeposit={setSelectedDeposit} />
              )}
              {mapTab === 'licenses' && (
                <LicensesPanel selectedLicense={selectedLicense} onSelectLicense={setSelectedLicense} />
              )}
              {mapTab === 'environment' && (
                <EnvironmentPanel env={env} envHistory={envHistory} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
