import { memo, useMemo } from 'react'
import { motion } from 'motion/react'
import { Factory } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import { PROCESS_STEPS } from '../../data/caldeira/pilotPlantData'
import css from './controlRoom.module.css'

interface PilotPlantCardProps {
  onOpen?: () => void
}

const phVariant = (v: number): 'green' | 'amber' | 'red' =>
  v >= 4.0 && v <= 5.0 ? 'green' : v >= 3.5 && v <= 5.5 ? 'amber' : 'red'

const COLOR_MAP = { green: W.green, amber: W.amber, red: W.red, cyan: W.cyan, violet: W.violet }

export const PilotPlantCard = memo(function PilotPlantCard({ onOpen }: PilotPlantCardProps) {
  const { plant } = useTelemetry()

  const ph = plant.leaching_circuit.ph_level
  const phColor = phVariant(ph)
  const recircOk = plant.flow_metrics.recirculation_pct >= 95

  const metrics = useMemo(() => [
    { label: 'pH', value: ph.toFixed(2), color: COLOR_MAP[phColor] },
    { label: 'MREC', value: `${plant.output.mrec_kg_hr.toFixed(1)}`, unit: 'kg/h', color: W.green },
    { label: 'Recirc', value: `${plant.flow_metrics.recirculation_pct.toFixed(0)}%`, color: recircOk ? W.cyan : W.amber },
    { label: 'TREO', value: `${plant.output.treo_grade_pct.toFixed(1)}%`, color: W.violet },
  ], [ph, phColor, plant.output.mrec_kg_hr, plant.flow_metrics.recirculation_pct, plant.output.treo_grade_pct, recircOk])

  const stepColors = useMemo(() =>
    PROCESS_STEPS.map(s => {
      const map: Record<string, string> = { cyan: W.cyan, violet: W.violet, green: W.green, amber: W.amber }
      return map[s.domainColor] ?? W.text4
    }),
  [])

  return (
    <motion.div
      className={css.hudCard}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen?.() } }}
      style={{
        background: W.overlay88,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${W.cyan}20`,
        borderRadius: W.radius.md,
        padding: '10px 12px',
        boxShadow: `0 0 20px ${W.cyan}10`,
      }}
    >
      <div className={css.hudHeader}>
        <div className={css.hudStatusDot} style={{ background: W.green }} />
        <Factory size={10} style={{ color: W.cyan, opacity: 0.7 }} />
        <span className={css.hudTitle}>Pilot Plant</span>
        <span style={{ marginLeft: 'auto', fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)' }}>LIVE</span>
      </div>

      <div className={css.hudMetricsGrid}>
        {metrics.map(m => (
          <div key={m.label} className={css.hudMetric}>
            <div className={css.hudMetricLabel}>{m.label}</div>
            <div className={css.hudMetricValue} style={{ color: m.color }}>
              {m.value}
              {m.unit && <span style={{ fontSize: 8, color: W.text4, marginLeft: 2 }}>{m.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={css.processDotsRow}>
        {stepColors.map((color, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', flex: i < stepColors.length - 1 ? 1 : 'unset' }}>
            <span className={css.processDot} style={{ background: color, boxShadow: `0 0 4px ${color}60` }} />
            {i < stepColors.length - 1 && <span className={css.processLine} />}
          </span>
        ))}
      </div>

      {onOpen && <div className={css.hudFooter}>Click to open Control Room</div>}
    </motion.div>
  )
})
