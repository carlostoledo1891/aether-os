import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Factory } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import {
  PLANT_KPIS,
  PILOT_PLANT_EQUIPMENT,
  FACILITY_INFO,
  ELEMENT_RECOVERIES,
  type EquipmentCategory,
  getEquipmentByTag,
} from '../../data/caldeira/pilotPlantData'
import { PlantSchematic } from './PlantSchematic'
import { EquipmentDetailPanel } from './EquipmentDetailPanel'
import css from './controlRoom.module.css'

interface ControlRoomProps {
  onClose: () => void
}

const KPI_COLORS: Record<string, string> = {
  'kpi-throughput': W.cyan,
  'kpi-mrec': W.green,
  'kpi-recovery': W.violet,
  'kpi-mreo': W.violetSoft,
  'kpi-water': W.cyan,
  'kpi-amsul': W.amber,
  'kpi-impurity': W.green,
}

const CATEGORY_TABS: { id: EquipmentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Equipment' },
  { id: 'feed', label: 'Feed & Prep' },
  { id: 'leach', label: 'Leaching' },
  { id: 'separation', label: 'Separation' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'control', label: 'Control' },
]

export const ControlRoom = memo(function ControlRoom({ onClose }: ControlRoomProps) {
  const { plant } = useTelemetry()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [hoveredTag, setHoveredTag] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all')

  const selectedEquipment = useMemo(
    () => (selectedTag ? getEquipmentByTag(selectedTag) ?? null : null),
    [selectedTag],
  )

  const handleSelectEquipment = useCallback((tag: string | null) => {
    setSelectedTag(tag)
  }, [])

  const handleDetailSelectEquipment = useCallback((tag: string) => {
    setSelectedTag(tag)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedTag) setSelectedTag(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, selectedTag])

  const liveKPIs = useMemo(() =>
    PLANT_KPIS.map(kpi => {
      let liveValue: string | number = kpi.value
      if (kpi.id === 'kpi-throughput') liveValue = (plant.output.mrec_kg_hr * 12).toFixed(0)
      if (kpi.id === 'kpi-mrec') liveValue = (plant.output.mrec_kg_hr * 24).toFixed(1)
      if (kpi.id === 'kpi-water') liveValue = plant.flow_metrics.recirculation_pct.toFixed(0)
      return { ...kpi, liveValue }
    }),
  [plant])

  const equipmentCount = PILOT_PLANT_EQUIPMENT.length
  const sensorCount = PILOT_PLANT_EQUIPMENT.reduce((acc, e) => acc + e.sensors.length, 0)

  return (
    <motion.div
      className={css.overlay}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className={css.header}>
        <div className={css.headerLeft}>
          <Factory size={14} style={{ color: W.cyan }} />
          <div>
            <div className={css.headerTitle}>Caldeira Pilot Plant — Control Room</div>
            <div className={css.headerSub}>
              {FACILITY_INFO.name} · {FACILITY_INFO.city}, {FACILITY_INFO.state}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.green, animation: 'statusPulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: W.green, letterSpacing: '0.06em' }}>OPERATIONAL</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: W.text4 }}>
            {equipmentCount} equip · {sensorCount} sensors
          </span>
          <button className={css.closeBtn} onClick={onClose} aria-label="Close control room">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={css.body}>
        {/* Left KPI strip */}
        <div className={css.kpiStrip}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: W.text4,
            marginBottom: 2,
          }}>
            PLANT KPIs
          </div>

          {liveKPIs.map(kpi => {
            const color = KPI_COLORS[kpi.id] ?? W.text1
            return (
              <div key={kpi.id} className={css.kpiCard}>
                <div className={css.kpiLabel}>{kpi.label}</div>
                <div className={css.kpiValue} style={{ color }}>
                  {kpi.liveValue}
                  <span style={{ fontSize: 10, color: W.text4, marginLeft: 2 }}>{kpi.unit}</span>
                </div>
                <div className={css.kpiTarget}>{kpi.target}</div>
              </div>
            )
          })}

          {/* Element recoveries compact */}
          <div style={{
            marginTop: 4,
            padding: '8px 8px',
            borderRadius: 8,
            background: W.glass02,
            border: `1px solid ${W.glass05}`,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: W.text4,
              marginBottom: 6,
            }}>
              REE RECOVERIES
            </div>
            {ELEMENT_RECOVERIES.map(el => (
              <div key={el.symbol} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 0',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: W.text3,
                  width: 20,
                }}>
                  {el.symbol}
                </span>
                <div style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: W.glass04,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${el.pilotPct}%`,
                    height: '100%',
                    borderRadius: 2,
                    background: el.role === 'magnet' ? W.violet : W.green,
                    transition: 'width 0.5s',
                  }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 600,
                  color: W.text1,
                  width: 26,
                  textAlign: 'right',
                }}>
                  {el.pilotPct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center schematic */}
        <div className={css.schematicArea}>
          <PlantSchematic
            plant={plant}
            selectedTag={selectedTag}
            hoveredTag={hoveredTag}
            activeCategory={activeCategory}
            onSelectEquipment={handleSelectEquipment}
            onHoverEquipment={setHoveredTag}
          />
        </div>

        {/* Right detail panel */}
        <AnimatePresence>
          {selectedEquipment && (
            <EquipmentDetailPanel
              key={selectedEquipment.tag}
              equipment={selectedEquipment}
              onClose={() => setSelectedTag(null)}
              onSelectEquipment={handleDetailSelectEquipment}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className={css.bottomBar}>
        <div className={css.categoryTabs}>
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              className={activeCategory === tab.id ? css.categoryTabActive : css.categoryTab}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={css.locationBadge}>
          {FACILITY_INFO.operator} · {FACILITY_INFO.ticker} · Since {new Date(FACILITY_INFO.operational_since).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </motion.div>
  )
})
