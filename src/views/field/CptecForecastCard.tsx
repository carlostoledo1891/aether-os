import { CloudSun } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import type { CptecForecast } from '../../services/weather/cptecClient'
import css from './EnvironmentPanel.module.css'

function formatCptecDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
}

export function CptecForecastCard({ data }: { data: CptecForecast }) {
  return (
    <GlassCard animate={false} glow="cyan" className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={CloudSun} color="cyan" size={11} />
          <SectionLabel>CPTEC Municipal Forecast</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: `${W.green}15`, color: W.green,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          INPE/CPTEC
        </span>
      </div>

      <div className={css.mono10} style={{ color: W.text4, marginBottom: 6 }}>
        {data.city}, {data.state}
      </div>

      <div className={css.flexCol} style={{ gap: 3 }}>
        {data.days.map(d => (
          <div
            key={d.date}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '3px 6px', borderRadius: W.radius.sm,
              background: W.glass03, border: W.hairlineBorder,
            }}
          >
            <span className={css.mono10} style={{ color: W.text3, minWidth: 60, flexShrink: 0 }}>
              {formatCptecDate(d.date)}
            </span>
            <span className={css.mono10} style={{ color: W.text2, minWidth: 52, flexShrink: 0 }}>
              {d.tempMin}–{d.tempMax}°C
            </span>
            <span className={css.mono10} style={{ color: W.text4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.conditionDesc}
            </span>
            {d.uvIndex > 0 && (
              <span className={css.mono10} style={{ color: d.uvIndex >= 8 ? W.amber : W.text4, flexShrink: 0 }}>
                UV {d.uvIndex}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className={css.mono10} style={{ color: W.text4, margin: '5px 0 0' }}>
        Fonte: INPE/CPTEC via BrasilAPI · {data.city}
      </p>
    </GlassCard>
  )
}
