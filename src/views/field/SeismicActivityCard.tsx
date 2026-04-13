import { Activity } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import type { SeismicSnapshot } from '../../services/dataService'
import css from './EnvironmentPanel.module.css'

export function SeismicActivityCard({ data }: { data: SeismicSnapshot }) {
  const events = data.events.slice(0, 5)
  const maxMag = events.length > 0 ? Math.max(...events.map(e => e.magnitude)) : 0

  return (
    <GlassCard animate={false} glow={maxMag >= 4 ? 'amber' : 'none'} className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={Activity} color={maxMag >= 4 ? 'amber' : 'green'} size={11} />
          <SectionLabel>Seismic Activity</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: data.source === 'mock' ? `${W.amber}15` : `${W.cyan}15`,
            color: data.source === 'mock' ? W.amber : W.cyan,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          {data.source === 'mock' ? 'Mock' : 'USGS'}
        </span>
      </div>

      {events.length === 0 ? (
        <p className={css.mono10} style={{ color: W.text3 }}>
          No seismic events near site in the last year.
        </p>
      ) : (
        <div className={css.flexCol} style={{ gap: 3 }}>
          {events.map(e => (
            <div key={e.id} className={css.flexStart} style={{ gap: 6, alignItems: 'center' }}>
              <span
                className={css.mono10}
                style={{
                  color: e.magnitude >= 4 ? W.amber : e.magnitude >= 3 ? W.text2 : W.text4,
                  fontWeight: e.magnitude >= 4 ? 700 : 500,
                  minWidth: 30,
                }}
              >
                M{e.magnitude.toFixed(1)}
              </span>
              <span className={css.mono10} style={{ color: W.text3, minWidth: 52 }}>
                {e.depth_km.toFixed(0)} km
              </span>
              <span className={css.mono10} style={{ color: W.text4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.place}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className={css.mono10} style={{ color: W.text4, margin: '5px 0 0' }}>
        300 km radius · {events.length} event{events.length !== 1 ? 's' : ''} in window
      </p>
    </GlassCard>
  )
}
