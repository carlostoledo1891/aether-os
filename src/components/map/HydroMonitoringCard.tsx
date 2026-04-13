import { memo } from 'react'
import { motion } from 'motion/react'
import { Droplets } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { THRESHOLDS } from '../../data/mockData'
import type { HydroWeatherStripModel } from './hydroDetailMappers'
import hudCss from '../plant/controlRoom.module.css'

interface HydroMonitoringCardProps {
  springCounts: { active: number; reduced: number; suppressed: number }
  sulfatePpm: number
  weatherStrip?: HydroWeatherStripModel | null
  onOpenStation?: () => void
}

export const HydroMonitoringCard = memo(function HydroMonitoringCard({
  springCounts,
  sulfatePpm,
  weatherStrip,
  onOpenStation,
}: HydroMonitoringCardProps) {
  return (
    <motion.div
      className={hudCss.hudCard}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      onClick={onOpenStation}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenStation?.() } }}
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
      <div className={hudCss.hudHeader}>
        <div className={hudCss.hudStatusDot} style={{ background: springCounts.suppressed > 0 ? W.red : W.green }} />
        <Droplets size={10} style={{ color: W.cyan, opacity: 0.7 }} />
        <span className={hudCss.hudTitle}>Hydro Station</span>
        <span style={{ marginLeft: 'auto', fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)' }}>LIVE</span>
      </div>

      <div className={hudCss.hudMetricsGrid}>
        <div className={hudCss.hudMetric}>
          <div className={hudCss.hudMetricLabel}>Springs</div>
          <div className={hudCss.hudMetricValue} style={{ color: W.cyan }}>
            {springCounts.active}<span style={{ fontSize: 8, color: W.text4, marginLeft: 2 }}>/ {springCounts.active + springCounts.reduced + springCounts.suppressed}</span>
          </div>
        </div>
        <div className={hudCss.hudMetric}>
          <div className={hudCss.hudMetricLabel}>SO₄</div>
          <div className={hudCss.hudMetricValue} style={{ color: sulfatePpm < THRESHOLDS.sulfate_warning_ppm ? W.green : W.amber }}>
            {sulfatePpm.toFixed(0)}<span style={{ fontSize: 8, color: W.text4, marginLeft: 2 }}>ppm</span>
          </div>
        </div>
        <div className={hudCss.hudMetric}>
          <div className={hudCss.hudMetricLabel}>Precip 30d</div>
          <div className={hudCss.hudMetricValue} style={{ color: weatherStrip && weatherStrip.anomalyMm < 0 ? W.amber : W.cyan }}>
            {weatherStrip ? (weatherStrip.loading ? '…' : `${weatherStrip.windowPrecipMm.toFixed(0)}`) : '—'}<span style={{ fontSize: 8, color: W.text4, marginLeft: 2 }}>mm</span>
          </div>
        </div>
        <div className={hudCss.hudMetric}>
          <div className={hudCss.hudMetricLabel}>Anomaly</div>
          <div className={hudCss.hudMetricValue} style={{ color: weatherStrip && weatherStrip.anomalyMm < 0 ? W.amber : W.cyan }}>
            {weatherStrip ? `${weatherStrip.anomalyMm >= 0 ? '+' : ''}${weatherStrip.anomalyMm.toFixed(0)}` : '—'}<span style={{ fontSize: 8, color: W.text4, marginLeft: 2 }}>mm</span>
          </div>
        </div>
      </div>

      <div className={hudCss.processDotsRow}>
        {[W.cyan, springCounts.reduced > 0 ? W.amber : W.cyan, springCounts.suppressed > 0 ? W.red : W.cyan].map((color, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'unset' }}>
            <span className={hudCss.processDot} style={{ background: color, boxShadow: `0 0 4px ${color}60` }} />
            {i < arr.length - 1 && <span className={hudCss.processLine} />}
          </span>
        ))}
      </div>

      <div className={hudCss.hudFooter}>Click to open Hydro Station</div>
    </motion.div>
  )
})