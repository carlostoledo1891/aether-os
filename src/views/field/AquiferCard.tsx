import { memo } from 'react'
import { motion } from 'motion/react'
import { Droplets } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import css from './EnvironmentPanel.module.css'

interface AquiferSensor {
  sensor_id: string
  depth_meters: number
  baseline_meters: number
  status: 'Normal' | 'Warning' | 'Critical'
}

export interface AquiferCardProps {
  sensors: AquiferSensor[]
}

export const AquiferCard = memo(function AquiferCard({ sensors }: AquiferCardProps) {
  return (
    <GlassCard animate={false} className={css.cardBody}>
      <div className={css.sectionHead} style={{ marginBottom: 8 }}>
        <GlowingIcon icon={Droplets} color="cyan" size={11}/>
        <SectionLabel>Aquifer Depths</SectionLabel>
      </div>
      <div className={css.flexCol} style={{ gap: 5 }}>
        {sensors.map(s => {
          const c = s.status === 'Normal' ? W.cyan : s.status === 'Warning' ? W.amber : W.red
          const delta = s.depth_meters - s.baseline_meters
          const pct = Math.min(100, (s.depth_meters / 35) * 100)
          return (
            <div key={s.sensor_id} className={css.sensorRow} style={{
              background: W.glass02, borderRadius: W.radius.sm, border: `1px solid ${c}18`,
            }}>
              <span className={css.sensorId} style={{ color: c }}>
                {s.sensor_id}
              </span>
              <div className={css.sensorBar} style={{ background: W.glass05, borderRadius: W.radius.xs }}>
                <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                  style={{ height: '100%', background: c, borderRadius: W.radius.xs, boxShadow: `0 0 4px ${c}60` }}/>
              </div>
              <span className={css.sensorDepth} style={{ color: c }}>
                {s.depth_meters.toFixed(1)} m
              </span>
              <span className={css.sensorDelta} style={{ color: delta > 0.5 ? W.amber : W.text4 }}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
})
