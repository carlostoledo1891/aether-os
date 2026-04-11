import { useState, useCallback, useRef, useEffect } from 'react'
import type maplibregl from 'maplibre-gl'
import { useMapCamera } from '../contexts/MapCameraContext'
import { CALDEIRA_BBOX } from '../components/map/MapBase'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldCheck, FileText, Download, ChevronDown } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { Marker, useMap } from 'react-map-gl/maplibre'
import { GlassCard } from '../components/ui/GlassCard'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { MapBase, BUYER_VIEW_STATE } from '../components/map/MapBase'
import type { MapLayerMouseEvent } from '../components/map/MapBase'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { LicenseOverlay, LICENSE_LAYER_ID } from '../components/map/LicenseOverlay'
import { EnvironmentalOverlay, ENV_APA_FILL_LAYER_ID } from '../components/map/EnvironmentalOverlay'
import { DepositOverlay, DEPOSIT_LAYER_ID } from '../components/map/DepositOverlay'
import { InfraOverlay } from '../components/map/InfraOverlay'
import { MapFeaturePopup } from '../components/map/MapFeaturePopup'
import { MapLayerPicker } from '../components/map/MapLayerPicker'
import type { MapPopupData } from '../components/map/MapFeaturePopup'
import type { ComplianceLedger } from '../types/telemetry'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { W } from '../app/canvas/canvasTheme'
import { Z } from '../components/map/mapStacking'
import { ComplianceTab } from './buyer/ComplianceTab'
import { TraceabilityTab } from './buyer/TraceabilityTab'
import styles from './BuyerView.module.css'

const BATCH_DEPOSIT_MAP: Record<string, string> = {
  'BATCH-MREC-8X9': 'capao-do-mel',
  'BATCH-MREC-7W2': 'soberbo',
  'BATCH-MREC-4K1': 'capao-do-mel',
  'BATCH-MREC-2A7': 'capao-do-mel',
}

function BatchFitBounds({ mapId, batchId, timeline, skipInitialFit }: {
  mapId: string
  batchId: string
  timeline: ComplianceLedger['molecular_timeline']
  skipInitialFit?: boolean
}) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const hasInitialFit = useRef(false)
  const prevBatchId = useRef(batchId)

  useEffect(() => {
    if (!mapRef) return

    if (!hasInitialFit.current) {
      hasInitialFit.current = true
      prevBatchId.current = batchId
      if (skipInitialFit) return
      const activeCoords = timeline.filter(s => s.coordinates && (s.status === 'verified' || s.status === 'active')).map(s => s.coordinates!)
      if (activeCoords.length >= 2) {
        const lngs = activeCoords.map(c => c.lng)
        const lats = activeCoords.map(c => c.lat)
        mapRef.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 80, duration: 1200, pitch: 35, bearing: 0 },
        )
      } else {
        mapRef.fitBounds(CALDEIRA_BBOX, { padding: 60, duration: 1000, pitch: 35, bearing: 0 })
      }
      return
    }

    if (batchId === prevBatchId.current) return
    prevBatchId.current = batchId

    const coords = timeline.filter(s => s.coordinates).map(s => s.coordinates!)
    if (coords.length < 2) return
    const lngs = coords.map(c => c.lng)
    const lats = coords.map(c => c.lat)
    mapRef.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 60, duration: 1000, pitch: 35, bearing: 0 },
    )
  }, [mapRef, batchId, timeline, skipInitialFit])

  return null
}

type BuyerTab = 'compliance' | 'traceability'

const TAB_ITEMS: { id: BuyerTab; label: string; icon: typeof ShieldCheck; color: string }[] = [
  { id: 'traceability', label: 'Traceability',  icon: FileText,     color: W.cyan },
  { id: 'compliance',   label: 'Compliance',    icon: ShieldCheck,  color: W.green },
]

const TAB_COLOR: Record<BuyerTab, string> = {
  compliance:   W.green,
  traceability: W.cyan,
}

const STEP_STATUS_COLORS: Record<string, string> = {
  verified: W.green,
  active: W.violet,
  pending: W.text4,
}

export function BuyerView() {
  const { getCamera, clearCamera, saveCamera } = useMapCamera()
  const maps = useMap()
  const [initialCamera] = useState(() => {
    const saved = getCamera()
    if (saved) {
      clearCamera()
      return saved
    }
    return null
  })

  useEffect(() => {
    return () => {
      const mapRef = maps['buyerField' as keyof typeof maps] ?? maps.current
      if (!mapRef) return
      const map = (mapRef as unknown as { getMap?: () => maplibregl.Map | undefined }).getMap?.()
      if (!map) return
      const center = map.getCenter()
      saveCamera({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      })
    }
  }, [maps, saveCamera])

  const { data: batches } = useServiceQuery('batches', s => s.getBatches())
  const [batchIndex, setBatchIndex] = useState(0)
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<BuyerTab>('traceability')
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)

  const [popupData, setPopupData] = useState<{ data: MapPopupData; x: number; y: number } | null>(null)

  const [buyerLayers, setBuyerLayers] = useState({
    boundary: true,
    licenses: true,
    apa: true,
    deposits: true,
    infrastructure: true,
    markers: true,
  })
  const buyerLayerToggles = [
    { id: 'boundary', label: 'Caldeira Boundary', checked: buyerLayers.boundary },
    { id: 'licenses', label: 'License Areas', checked: buyerLayers.licenses },
    { id: 'apa', label: 'APA / Buffer', checked: buyerLayers.apa },
    { id: 'deposits', label: 'Deposits', checked: buyerLayers.deposits },
    { id: 'infrastructure', label: 'Infrastructure', checked: buyerLayers.infrastructure },
    { id: 'markers', label: 'Batch Markers', checked: buyerLayers.markers },
  ]
  const handleBuyerLayerToggle = useCallback((id: string) => {
    setBuyerLayers(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }, [])

  const handleStepClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
  }, [])

  const handleMarkerClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
    setActiveTab('traceability')
  }, [])

  const buyerInteractiveLayerIds = [DEPOSIT_LAYER_ID, LICENSE_LAYER_ID, ENV_APA_FILL_LAYER_ID]

  const handleBuyerMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    const feat = e.features?.[0]
    const layerId = feat?.layer?.id
    const props = feat?.properties as Record<string, unknown> | undefined
    const px = e.point
    if (layerId === DEPOSIT_LAYER_ID && props) {
      setPopupData({
        x: px.x, y: px.y,
        data: {
          title: String(props.name ?? props.id ?? ''),
          accentColor: W.cyan,
          rows: [
            { label: 'Status', value: String(props.status ?? '—') },
            { label: 'TREO', value: `${Number(props.treo_ppm ?? 0)} ppm` },
            { label: 'Tonnage', value: `${Number(props.tonnage_mt ?? 0)} Mt` },
          ],
        },
      })
      return
    }
    setPopupData(null)
  }, [])

  const handleBuyerMouseLeave = useCallback(() => {
    setPopupData(null)
  }, [])

  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (exportTimerRef.current) clearTimeout(exportTimerRef.current) }, [])

  const safeBatchIndex = Math.min(batchIndex, Math.max((batches ?? []).length - 1, 0))
  const batch = (batches ?? [])[safeBatchIndex]
  const batchId = batch?.batch_id ?? ''
  const originDepositId = BATCH_DEPOSIT_MAP[batchId] ?? 'capao-do-mel'

  function handleExport() {
    setExporting(true)
    window.print()
    exportTimerRef.current = setTimeout(() => { setExporting(false); exportTimerRef.current = null }, 1500)
  }

  if (!batch) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, minHeight: 0, padding: 24,
    }}>
      <div style={{
        padding: '24px 32px', borderRadius: W.radius.md,
        background: W.glass03, border: W.hairlineBorder, textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: W.text2, marginBottom: 6 }}>No batches available</div>
        <div style={{ fontSize: 11, color: W.text4, lineHeight: 1.5 }}>
          Compliance data will appear here once MREC batches are created in the pilot plant.
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.viewShell}
    >
      <div className={styles.mainRow}>
        {/* Left: Map + bottom strip */}
        <div className={styles.leftColumn}>
          <div
            className={styles.mapHero}
            style={{
              border: `1px solid ${TAB_COLOR[activeTab]}30`,
              boxShadow: `0 0 22px ${TAB_COLOR[activeTab]}14`,
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            <MapBase
              id="buyerField"
              initialViewState={initialCamera ?? BUYER_VIEW_STATE}
              interactiveLayerIds={buyerInteractiveLayerIds}
              cursor={popupData ? 'pointer' : ''}
              onMouseEnter={handleBuyerMouseEnter}
              onMouseLeave={handleBuyerMouseLeave}
            >
              <BatchFitBounds mapId="buyerField" batchId={batchId} timeline={batch.molecular_timeline} skipInitialFit={!!initialCamera} />
              {buyerLayers.boundary && <CaldeiraBoundary />}
              {buyerLayers.licenses && <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />}
              {buyerLayers.apa && <EnvironmentalOverlay showApa showBuffer showMonitoring={false} showUrban={false} />}
              {buyerLayers.deposits && <DepositOverlay highlightId={originDepositId} />}
              {buyerLayers.infrastructure && <InfraOverlay showRoute mapId="buyerField" />}
              {buyerLayers.markers && batch.molecular_timeline.map((step, i) => {
                if (!step.coordinates) return null
                const isSelected = selectedStepIndex === i
                const stepColor = STEP_STATUS_COLORS[step.status] ?? W.text4
                return (
                  <Marker key={`step-${i}`} longitude={step.coordinates.lng} latitude={step.coordinates.lat} anchor="center"
                    onClick={(e) => { e.originalEvent.stopPropagation(); handleMarkerClick(i) }}>
                    <div style={{
                      width: isSelected ? 18 : 12, height: isSelected ? 18 : 12,
                      borderRadius: '50%',
                      background: isSelected ? stepColor : `${stepColor}40`,
                      border: `2px solid ${stepColor}`,
                      boxShadow: isSelected ? `0 0 14px ${stepColor}80` : `0 0 6px ${stepColor}40`,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <span style={{ fontSize: 8, fontWeight: 800, color: W.textInverse, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>}
                    </div>
                  </Marker>
                )
              })}
            </MapBase>
            <MapFeaturePopup data={popupData?.data ?? null} x={popupData?.x ?? 0} y={popupData?.y ?? 0} />
            <MapLayerPicker layers={buyerLayerToggles} onToggle={handleBuyerLayerToggle} />

            {/* Batch legend */}
            <div style={{
              position: 'absolute', bottom: 12, right: 12, zIndex: Z.mapHud,
              background: W.mapControlBg, border: W.mapControlBorder,
              borderRadius: 8, padding: '8px 10px',
              display: 'flex', flexDirection: 'column', gap: 4,
              fontSize: 10, color: W.text3,
            }}>
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9 }}>Legend</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.green }} />
                <span>Verified step</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.violet }} />
                <span>Active step</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.text4 }} />
                <span>Pending step</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${W.cyan}`, background: 'transparent' }} />
                <span>Origin deposit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel (400px) */}
        <div className={styles.rightPanel}>
          {/* Batch selector */}
          <div className={styles.batchSelectorWrap}>
            <button type="button" onClick={() => setBatchDropdownOpen(p => !p)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 11px', borderRadius: W.radius.md,
              background: W.glass04, border: `1px solid ${W.glass12}`,
              cursor: 'pointer', outline: 'none', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>Batch</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: W.violetSoft, fontFamily: 'var(--font-mono)' }}>{batch.batch_id}</span>
                <span style={{ fontSize: 10, color: W.text3 }}>{batch.tonnage_kg} kg</span>
              </div>
              <ChevronDown size={12} style={{ color: W.text4, transition: 'transform 0.2s', transform: batchDropdownOpen ? 'rotate(180deg)' : undefined }} />
            </button>
            <AnimatePresence>
              {batchDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: Z.buyerPanel,
                    marginTop: 4, borderRadius: W.radius.md, overflow: 'hidden',
                    background: `${W.panel}F5`, backdropFilter: 'blur(12px)',
                    border: `1px solid ${W.glass12}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}>
                  {(batches ?? []).map((b, i) => (
                    <button type="button" key={b.batch_id} onClick={() => { setBatchIndex(i); setBatchDropdownOpen(false); setSelectedStepIndex(null) }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 11px', border: 'none', cursor: 'pointer', outline: 'none',
                      background: i === batchIndex ? `${W.violet}1F` : 'transparent',
                      borderBottom: i < (batches ?? []).length - 1 ? W.hairlineBorder : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: i === batchIndex ? W.violetSoft : W.text2, fontFamily: 'var(--font-mono)' }}>{b.batch_id}</span>
                        <span style={{ fontSize: 10, color: W.text4 }}>{b.tonnage_kg} kg</span>
                      </div>
                      <span style={{ fontSize: 10, color: W.text4 }}>{b.offtake_destination.split('—')[0].trim()}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab switcher & actions */}
          <div className={styles.tabActionsRow}>
            <div className={styles.tabSwitcherGrow}>
              <TabSwitcher items={TAB_ITEMS} active={activeTab} onSelect={setActiveTab} layoutId="buyer-tab-pill" />
            </div>
            <button type="button" onClick={handleExport} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', height: '100%',
              background: exporting ? `${W.green}26` : W.glass04,
              border: `1px solid ${exporting ? `${W.green}66` : W.glass12}`,
              borderRadius: W.radius.md, cursor: 'pointer', outline: 'none',
              color: exporting ? W.green : W.text2, fontSize: 10, fontWeight: 600,
              transition: 'all 0.2s', flexShrink: 0,
            }}>
              <Download size={10} />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>

          {/* Countdown strip */}
          <GlassCard animate={false} style={{ padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <CountdownTimer targetDate="2027-01-01T00:00:00Z" label="DoD NDAA Ban" color="amber" />
              <div style={{ width: 1, height: 36, background: W.glass08 }} />
              <CountdownTimer targetDate="2027-02-18T00:00:00Z" label="EU DBP Mandate" color="violet" />
            </div>
          </GlassCard>

          {/* Tab content */}
          <div className={styles.tabContentScroll}>
            <AnimatePresence mode="wait">
              {activeTab === 'compliance' && (
                <motion.div key="compliance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                  <ComplianceTab batch={batch} />
                </motion.div>
              )}
              {activeTab === 'traceability' && (
                <motion.div key="traceability" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                  <TraceabilityTab batch={batch} selectedStepIndex={selectedStepIndex} onStepClick={handleStepClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
