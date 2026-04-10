import { memo } from 'react'
import { Droplets } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import css from './EnvironmentPanel.module.css'

export interface SpringsCardProps {
  springCount: number
  counts: { active: number; reduced: number; suppressed: number }
}

export const SpringsCard = memo(function SpringsCard({
  springCount,
  counts,
}: SpringsCardProps) {
  return (
    <GlassCard animate={false} className={css.cardBody}>
      <div className={css.sectionHead} style={{ marginBottom: 8 }}>
        <GlowingIcon icon={Droplets} color="cyan" size={11}/>
        <SectionLabel>Water Springs</SectionLabel>
        <span style={{ fontSize: 10, color: W.text4 }}>{springCount} monitored</span>
      </div>
      <div className={css.springCounters} style={{ marginBottom: 8 }}>
        {[
          { count: counts.active,     label: 'Active',     color: W.green },
          { count: counts.reduced,    label: 'Reduced',    color: W.amber },
          { count: counts.suppressed, label: 'Suppressed', color: W.red   },
        ].map(({ count, label, color }) => (
          <div key={label} className={css.springCounter}>
            <span className={css.monoCounterLg} style={{ color }}>{count}</span>
            <span className={css.labelUpper} style={{ color: W.text4, letterSpacing: '0.04em' }}>{label}</span>
          </div>
        ))}
      </div>
      <div className={css.barTrack} style={{ height: 6, background: W.glass05, borderRadius: W.radius.xs, display: 'flex' }}>
        {springCount > 0 && <>
          <div style={{ width: `${(counts.active / springCount) * 100}%`, background: W.green, opacity: 0.75 }} />
          <div style={{ width: `${(counts.reduced / springCount) * 100}%`, background: W.amber, opacity: 0.85 }} />
          <div style={{ width: `${(counts.suppressed / springCount) * 100}%`, background: W.red, opacity: 0.9 }} />
        </>}
      </div>
      <div className={css.preservationRate} style={{ color: W.text4 }}>
        {((counts.active / springCount) * 100).toFixed(1)}% preservation rate · FBDS/IDE-SISEMA verified
      </div>
    </GlassCard>
  )
})
