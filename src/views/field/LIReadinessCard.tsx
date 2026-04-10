import { memo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import css from './EnvironmentPanel.module.css'

export interface LIReadinessCardProps {
  permittingSignal: string
  recommendation: string
  status: 'stable' | 'watch' | 'action'
  digitalCoveragePct: number
  springsMonitored: number
}

export const LIReadinessCard = memo(function LIReadinessCard({
  permittingSignal,
  recommendation,
  status,
  digitalCoveragePct,
  springsMonitored,
}: LIReadinessCardProps) {
  return (
    <GlassCard animate={false} glow={status === 'action' ? 'red' : 'amber'} className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 7 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={AlertTriangle} color="amber" size={11}/>
          <SectionLabel>LI Hearing Readiness</SectionLabel>
        </div>
        <StatusChip
          label={permittingSignal}
          variant={status === 'stable' ? 'green' : status === 'watch' ? 'amber' : 'red'}
          size="sm"
        />
      </div>
      <p className={css.bodyText} style={{ color: W.text3, marginBottom: 6 }}>
        {recommendation}
      </p>
      <div className={css.grid2} style={{ gap: 7 }}>
        <div className={css.statCell} style={{ borderRadius: W.radius.sm, background: W.glass03, border: W.hairlineBorder }}>
          <div className={css.labelUpper} style={{ color: W.text4 }}>Digital coverage</div>
          <div className={css.monoValue} style={{ color: W.text1 }}>
            {digitalCoveragePct}%
          </div>
        </div>
        <div className={css.statCell} style={{ borderRadius: W.radius.sm, background: W.glass03, border: W.hairlineBorder }}>
          <div className={css.labelUpper} style={{ color: W.text4 }}>Springs monitored</div>
          <div className={css.monoValue} style={{ color: W.text1 }}>
            {springsMonitored}
          </div>
        </div>
      </div>
    </GlassCard>
  )
})
