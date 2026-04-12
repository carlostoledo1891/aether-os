import { memo, useMemo } from 'react'
import { motion } from 'motion/react'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { StatusChip } from '../ui/StatusChip'
import { useTelemetry } from '../../services/DataServiceProvider'
import {
  type PilotPlantEquipment,
  getSensorsForEquipment,
  getStepForEquipment,
  getSensorValue,
  getEquipmentByTag,
  getCategoryColor,
  CATEGORY_LABELS,
} from '../../data/caldeira/pilotPlantData'
import css from './controlRoom.module.css'

interface EquipmentDetailPanelProps {
  equipment: PilotPlantEquipment
  onClose: () => void
  onSelectEquipment: (tag: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  running: W.green,
  idle: W.text4,
  warning: W.amber,
  maintenance: W.red,
}

const DOMAIN_COLOR: Record<string, string> = {
  cyan: W.cyan,
  violet: W.violet,
  green: W.green,
  amber: W.amber,
}

export const EquipmentDetailPanel = memo(function EquipmentDetailPanel({
  equipment,
  onClose,
  onSelectEquipment,
}: EquipmentDetailPanelProps) {
  const { plant } = useTelemetry()

  const sensors = useMemo(() => getSensorsForEquipment(equipment.tag), [equipment.tag])
  const step = useMemo(() => getStepForEquipment(equipment.tag), [equipment.tag])
  const catColor = getCategoryColor(equipment.category)
  const accentColor = DOMAIN_COLOR[catColor] ?? W.violet

  const sensorReadings = useMemo(() =>
    sensors.map(s => ({
      ...s,
      currentValue: getSensorValue(s, plant),
    })),
  [sensors, plant])

  const upstreamEquipment = useMemo(
    () => equipment.upstream.map(t => getEquipmentByTag(t)).filter(Boolean) as PilotPlantEquipment[],
    [equipment.upstream],
  )
  const downstreamEquipment = useMemo(
    () => equipment.downstream.map(t => getEquipmentByTag(t)).filter(Boolean) as PilotPlantEquipment[],
    [equipment.downstream],
  )

  return (
    <motion.div
      className={css.detailPanel}
      initial={{ x: 280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 280, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className={css.detailHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className={css.detailTag}>{equipment.tag}</div>
            <div className={css.detailName}>{equipment.name}</div>
          </div>
          <button className={css.closeBtn} onClick={onClose} aria-label="Close detail panel">
            <X size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusChip
            label={equipment.status.toUpperCase()}
            variant={equipment.status === 'running' ? 'green' : equipment.status === 'warning' ? 'amber' : 'cyan'}
            size="sm"
            dot
          />
          <span style={{
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: 3,
            background: `${accentColor}12`,
            color: accentColor,
            border: `1px solid ${accentColor}25`,
          }}>
            {CATEGORY_LABELS[equipment.category]}
          </span>
          {step && (
            <span style={{
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              color: W.text4,
            }}>
              Step {step.step}
            </span>
          )}
        </div>
      </div>

      {/* Purpose */}
      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>Purpose</div>
        <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>
          {equipment.purpose}
        </p>
      </div>

      {/* Specifications */}
      <div className={css.detailSection}>
        <div className={css.detailSectionTitle}>Specifications</div>
        <div className={css.specRow}>
          <span className={css.specKey}>Capacity</span>
          <span className={css.specValue}>{equipment.capacity}</span>
        </div>
        <div className={css.specRow}>
          <span className={css.specKey}>Material</span>
          <span className={css.specValue}>{equipment.material}</span>
        </div>
        <div className={css.specRow}>
          <span className={css.specKey}>Manufacturer</span>
          <span className={css.specValue}>{equipment.manufacturer}</span>
        </div>
      </div>

      {/* Sensor Readings */}
      {sensorReadings.length > 0 && (
        <div className={css.detailSection}>
          <div className={css.detailSectionTitle}>Live Sensors ({sensorReadings.length})</div>
          {sensorReadings.map(s => {
            const pct = (s.currentValue - s.range[0]) / (s.range[1] - s.range[0])
            const inRange = pct >= 0.15 && pct <= 0.85
            const dotColor = inRange ? W.green : pct < 0.1 || pct > 0.9 ? W.red : W.amber
            return (
              <div key={s.id} className={css.sensorRow}>
                <span className={css.sensorDot} style={{ background: dotColor, boxShadow: `0 0 4px ${dotColor}60` }} />
                <span className={css.sensorLabel}>{s.label}</span>
                <span className={css.sensorValue}>{s.currentValue.toFixed(s.type === 'pH' ? 2 : 1)}</span>
                <span className={css.sensorUnit}>{s.unit}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Process step context */}
      {step && (
        <div className={css.detailSection}>
          <div className={css.detailSectionTitle}>Process Step</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: W.text1, marginBottom: 4 }}>
            {step.step}. {step.shortName}
          </div>
          <p style={{ fontSize: 10, color: W.text3, lineHeight: 1.5, margin: 0 }}>
            {step.description}
          </p>
          {step.reagents.length > 0 && (
            <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {step.reagents.map(r => (
                <span key={r} style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 6px',
                  borderRadius: 3,
                  background: `${W.amber}10`,
                  color: W.amber,
                  border: `1px solid ${W.amber}20`,
                }}>
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connected Equipment */}
      {(upstreamEquipment.length > 0 || downstreamEquipment.length > 0) && (
        <div className={css.detailSection}>
          <div className={css.detailSectionTitle}>Connected Equipment</div>
          {upstreamEquipment.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 3, display: 'block' }}>
                UPSTREAM
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {upstreamEquipment.map(eq => (
                  <button
                    key={eq.tag}
                    className={css.connectedLink}
                    onClick={() => onSelectEquipment(eq.tag)}
                  >
                    <ArrowLeft size={8} />
                    {eq.tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          {downstreamEquipment.length > 0 && (
            <div>
              <span style={{ fontSize: 9, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 3, display: 'block' }}>
                DOWNSTREAM
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {downstreamEquipment.map(eq => (
                  <button
                    key={eq.tag}
                    className={css.connectedLink}
                    onClick={() => onSelectEquipment(eq.tag)}
                  >
                    {eq.tag}
                    <ArrowRight size={8} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status footer */}
      <div style={{
        padding: '8px 14px',
        marginTop: 'auto',
        borderTop: `1px solid ${W.glass06}`,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[equipment.status] }} />
        <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: W.text4 }}>
          {equipment.tag} · {equipment.status}
        </span>
      </div>
    </motion.div>
  )
})
