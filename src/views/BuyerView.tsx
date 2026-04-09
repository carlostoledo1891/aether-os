import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldCheck, FileText, Download, ChevronDown } from 'lucide-react'
import { TabSwitcher } from '../components/ui/TabSwitcher'
import { Marker } from 'react-map-gl/maplibre'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowingIcon } from '../components/ui/GlowingIcon'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { MapBase, BUYER_VIEW_STATE } from '../components/map/MapBase'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { DepositOverlay } from '../components/map/DepositOverlay'
import { InfraOverlay } from '../components/map/InfraOverlay'
import { useServiceQuery } from '../hooks/useServiceQuery'
import { W } from '../app/canvas/canvasTheme'
import { ComplianceTab } from './buyer/ComplianceTab'
import { TraceabilityTab } from './buyer/TraceabilityTab'
import styles from './BuyerView.module.css'

const BATCH_DEPOSIT_MAP: Record<string, string> = {
  'BATCH-MREC-8X9': 'capao-do-mel',
  'BATCH-MREC-7W2': 'soberbo',
}

type BuyerTab = 'compliance' | 'traceability'

const TAB_ITEMS: { id: BuyerTab; label: string; icon: typeof ShieldCheck; color: string }[] = [
  { id: 'compliance',   label: 'Compliance',    icon: ShieldCheck,  color: W.green },
  { id: 'traceability', label: 'Traceability',  icon: FileText,     color: W.cyan },
]

const TAB_COLOR: Record<BuyerTab, string> = {
  compliance:   W.green,
  traceability: W.cyan,
}

const MAP_HEADER_TEXT: Record<BuyerTab, string> = {
  compliance:   'FEOC-clean chain · IRA-ready · EU Digital Battery Passport',
  traceability: 'Molecular-to-magnet ledger · provenance · partner APIs',
}

const STEP_STATUS_COLORS: Record<string, string> = {
  verified: W.green,
  active: W.violet,
  pending: W.text4,
}

export function BuyerView() {
  const { data: batches } = useServiceQuery('batches', s => s.getBatches())
  const { data: deposits } = useServiceQuery('deposit-data', s => s.getDepositData())
  const [batchIndex, setBatchIndex] = useState(0)
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<BuyerTab>('compliance')
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)

  const handleStepClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
  }, [])

  const handleMarkerClick = useCallback((index: number) => {
    setSelectedStepIndex(prev => prev === index ? null : index)
    setActiveTab('traceability')
  }, [])

  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (exportTimerRef.current) clearTimeout(exportTimerRef.current) }, [])

  const safeBatchIndex = Math.min(batchIndex, Math.max((batches ?? []).length - 1, 0))
  const batch = (batches ?? [])[safeBatchIndex]
  const batchId = batch?.batch_id ?? ''
  const originDepositId = BATCH_DEPOSIT_MAP[batchId] ?? 'capao-do-mel'
  const originDeposit = (deposits ?? []).find(d => d.id === originDepositId)

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
              boxShadow: `0 0 22px ${TAB_COLOR[activeTab]}14, inset 0 1px 0 ${W.glass04}`,
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            {/* Map header overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: `linear-gradient(to bottom, ${W.overlay88}, transparent)`,
              zIndex: 10, pointerEvents: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <GlowingIcon
                  icon={activeTab === 'compliance' ? ShieldCheck : FileText}
                  color={activeTab === 'compliance' ? 'green' : 'cyan'}
                  size={11}
                />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: W.text3, transition: 'color 0.3s',
                }}>
                  {MAP_HEADER_TEXT[activeTab]}
                </span>
              </div>
            </div>

            <MapBase id="buyerField" initialViewState={BUYER_VIEW_STATE}>
              <CaldeiraBoundary />
              <DepositOverlay highlightId={originDepositId} />
              <InfraOverlay showRoute mapId="buyerField" />
              {batch.molecular_timeline.map((step, i) => {
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

            {/* Origin badge */}
            <div style={{
              position: 'absolute', bottom: 10, left: 12, zIndex: 10,
              display: 'flex', gap: 8, alignItems: 'center', pointerEvents: 'none',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 10px', background: W.overlay88,
                backdropFilter: 'blur(8px)', borderRadius: W.radius.sm,
                border: `1px solid ${W.cyan}40`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.cyan, boxShadow: `0 0 6px ${W.cyan}` }}/>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.cyan, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Origin</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{originDeposit?.name ?? 'Caldeira'}</span>
                {originDeposit && (
                  <span style={{ fontSize: 10, color: W.text3, borderLeft: `1px solid ${W.glass12}`, paddingLeft: 7 }}>
                    {originDeposit.treo_ppm.toLocaleString()} ppm · {originDeposit.tonnage_mt} Mt
                  </span>
                )}
              </div>
            </div>

            {/* Route legend */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10, zIndex: 10,
              display: 'flex', gap: 10, pointerEvents: 'none',
              padding: '4px 10px', background: `${W.bg}CC`,
              backdropFilter: 'blur(8px)', borderRadius: W.radius.sm,
              border: `1px solid ${W.glass07}`,
            }}>
              {[
                { color: W.amber, label: 'Deposit' },
                { color: W.green, label: 'Plant' },
                { color: W.cyan, label: 'Route → Santos' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}/>
                  <span style={{ fontSize: 10, color: W.text3 }}>{label}</span>
                </div>
              ))}
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
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30,
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
