import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldCheck, FileText, Download } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { Marker, useMap } from 'react-map-gl/maplibre'
import { GlassCard } from '../components/ui/GlassCard'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { MapBase } from '../components/map/MapBase'
import { useMapCameraRestore } from '../hooks/useMapCameraRestore'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { LicenseOverlay, LICENSE_LAYER_ID } from '../components/map/LicenseOverlay'
import { EnvironmentalOverlay, ENV_APA_FILL_LAYER_ID } from '../components/map/EnvironmentalOverlay'
import { TraceRouteOverlay } from '../components/map/TraceRouteOverlay'
import { DrillHoleOverlay, DRILL_LAYER_ID } from '../components/map/DrillHoleOverlay'
import { MapFeaturePopup } from '../components/map/MapFeaturePopup'
import { MapLayerPicker } from '../components/map/MapLayerPicker'
import { useBuyerMapInteraction } from './buyer/useBuyerMapInteraction'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { useSharedMapLayers } from './field/fieldMapLayers'
import { W } from '../app/canvas/canvasTheme'
import { ComplianceTab } from './buyer/ComplianceTab'
import { TraceabilityTab } from './buyer/TraceabilityTab'
import { BuyerMapLegend } from './buyer/BuyerMapLegend'
import { BatchSelector } from './buyer/BatchSelector'
import { BATCH_LICENSE_MAP, LICENSE_DEPOSIT_MAP } from '../data/domain'
import styles from './BuyerView.module.css'

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
  const initialCamera = useMapCameraRestore('buyerField')
  const maps = useMap()

  const { data: batches } = useServiceQuery('batches', s => s.getBatches())
  const [batchIndex, setBatchIndex] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<BuyerTab>('traceability')
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)

  const {
    hoveredHoleId,
    popupData,
    handleBuyerMouseEnter,
    handleBuyerMouseLeave,
  } = useBuyerMapInteraction()

  const { opsMapLayers, envMapLayers, setOpsMapLayers, setEnvMapLayers } = useSharedMapLayers()
  const [buyerLayers, setBuyerLayers] = useState({
    boundary: true,
    markers: true,
  })
  const buyerLayerToggles = [
    { id: 'boundary', label: 'Caldeira Boundary', checked: buyerLayers.boundary },
    { id: 'licenses', label: 'Mining licences', checked: opsMapLayers.tenements },
    { id: 'apa', label: 'APA Pedra Branca', checked: envMapLayers.apa },
    { id: 'markers', label: 'Batch Markers', checked: buyerLayers.markers },
  ]
  const handleBuyerLayerToggle = useCallback((id: string) => {
    if (id === 'licenses') {
      setOpsMapLayers(prev => ({ ...prev, tenements: !prev.tenements }))
    } else if (id === 'apa') {
      setEnvMapLayers(prev => ({ ...prev, apa: !prev.apa }))
    } else {
      setBuyerLayers(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
    }
  }, [setOpsMapLayers, setEnvMapLayers])

  const handleStepClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
  }, [])

  const handleMarkerClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
    setActiveTab('traceability')
  }, [])

  const buyerInteractiveLayerIds = [LICENSE_LAYER_ID, ENV_APA_FILL_LAYER_ID, DRILL_LAYER_ID]

  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (exportTimerRef.current) clearTimeout(exportTimerRef.current) }, [])

  const safeBatchIndex = Math.min(batchIndex, Math.max((batches ?? []).length - 1, 0))
  const batch = (batches ?? [])[safeBatchIndex]
  const batchId = batch?.batch_id ?? ''
  const originLicenseId = BATCH_LICENSE_MAP[batchId] ?? 'LIC-CDM-01'
  const originDepositId = LICENSE_DEPOSIT_MAP[originLicenseId] ?? 'capao-do-mel'

  const activeStep = batch?.molecular_timeline[selectedStepIndex ?? 0]
  const activeDrills = activeStep?.linked_drills

  useEffect(() => {
    const mapRef = maps.buyerField ?? maps.current
    if (!mapRef || selectedStepIndex === null || !activeStep?.coordinates) return

    mapRef.flyTo({
      center: [activeStep.coordinates.lng, activeStep.coordinates.lat],
      zoom: 12,
      duration: 1500,
    })
  }, [selectedStepIndex, activeStep, maps])

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
              initialViewState={initialCamera ?? undefined}
              interactiveLayerIds={buyerInteractiveLayerIds}
              cursor={popupData ? 'pointer' : ''}
              onMouseEnter={handleBuyerMouseEnter}
              onMouseLeave={handleBuyerMouseLeave}
            >
              {buyerLayers.boundary && <CaldeiraBoundary />}
              {opsMapLayers.tenements && <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} highlightId={originLicenseId} />}
              {(selectedStepIndex === 0 || selectedStepIndex === null) && (
                <DrillHoleOverlay depositFilter={activeDrills ? null : originDepositId} drillIds={activeDrills ?? null} hoveredHoleId={hoveredHoleId} />
              )}
              {envMapLayers.apa && <EnvironmentalOverlay showApa showBuffer showMonitoring={false} showUrban={false} />}
              <TraceRouteOverlay timeline={batch.molecular_timeline} mapId="buyerField" selectedStepIndex={selectedStepIndex} />
              {buyerLayers.markers && batch.molecular_timeline.map((step, i) => {
                if (!step.coordinates) return null
                const isSelected = selectedStepIndex === i
                const stepColor = STEP_STATUS_COLORS[step.status] ?? W.text4
                return (
                  <Marker key={`step-${i}`} longitude={step.coordinates.lng} latitude={step.coordinates.lat} anchor="center"
                    onClick={(e) => { e.originalEvent.stopPropagation(); handleMarkerClick(i) }}>
                    <div
                      onMouseEnter={(e) => {
                        const parentRect = e.currentTarget.closest(`.${styles.mapHero}`)?.getBoundingClientRect()
                        if (!parentRect) return
                        const rect = e.currentTarget.getBoundingClientRect()
                        setPopupData({
                          x: rect.left + rect.width / 2 - parentRect.left,
                          y: rect.top - parentRect.top,
                          data: {
                            title: step.step,
                            accentColor: stepColor,
                            rows: [
                              { label: 'Status', value: step.status.toUpperCase() },
                              { label: 'Entity', value: step.entity ?? '—' }
                            ]
                          }
                        })
                      }}
                      onMouseLeave={() => setPopupData(null)}
                      style={{
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

            <BuyerMapLegend />
          </div>
        </div>

        {/* Right panel (400px) */}
        <div className={styles.rightPanel}>
          <BatchSelector
            batches={batches ?? []}
            batchIndex={batchIndex}
            batch={batch}
            onSelect={(idx) => { setBatchIndex(idx); setSelectedStepIndex(null) }}
          />

          {/* Tab switcher & actions */}
          <div className={styles.tabActionsRow}>
            <div className={styles.tabSwitcherGrow}>
              <TabSwitcher items={TAB_ITEMS} active={activeTab} onSelect={setActiveTab} layoutId="buyer-tab-pill" />
            </div>
            <button 
              type="button" 
              onClick={handleExport} 
              className={styles.exportBtn}
              data-exporting={exporting}
            >
              <Download size={10} />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>

          {/* Countdown strip */}
          <GlassCard animate={false} className={styles.countdownStrip}>
            <div className={styles.countdownInner}>
              <CountdownTimer targetDate="2027-01-01T00:00:00Z" label="DoD NDAA Ban" color="amber" />
              <div className={styles.countdownDivider} />
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
