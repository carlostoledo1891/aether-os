import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'
import { PRODUCT_ROADMAP } from '../../../../data/domain/roadmap'

/* ── Product Roadmap ───────────────────────────────────────── */

export function RoadmapSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Roadmap</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Product Roadmap</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 960, width: '100%' }}>
      {PRODUCT_ROADMAP.map(phase => {
        const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
        return (
          <div key={phase.id} style={{ background: W.glass04, border: `1px solid ${phase.status === 'active' ? V : W.glass06}`, borderRadius: 14, padding: '16px 14px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            {phase.status === 'active' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: V }} />}
            <div style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{phase.quarter}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 10 }}>{phase.title}</div>
            {phase.items.slice(0, 4).map(item => (
              <div key={item.title} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: W.text2 }}>{item.title}</div>
              </div>
            ))}
            <span style={{
              fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 6px', borderRadius: 3, marginTop: 6, display: 'inline-block',
              background: phase.status === 'active' ? `${V}20` : W.glass04, color: accent,
            }}>{phase.status}</span>
          </div>
        )
      })}
    </div>
  </>)
}

/* ── Timeline ──────────────────────────────────────────────── */

const MILESTONES = [
  { date: 'Apr 15', label: 'Pitch to Meteoric Resources', status: 'next' as const },
  { date: 'Apr 21', label: 'Term sheet with angel investors', status: 'next' as const },
  { date: 'May', label: 'LAPOC connected — field-verified', status: 'pending' as const },
  { date: 'Jun', label: 'Meteoric pilot — $102k/yr', status: 'pending' as const },
  { date: 'Jul-Sep', label: 'Seed $1-2M · 3 pilots', status: 'pending' as const },
  { date: 'Feb 27', label: 'EU DPP — market 3x', status: 'pending' as const },
]

export function TimelineSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>What Happens Next</h2>
    <div style={{ maxWidth: 900, width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 19, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${V}60, ${V}10)` }} />
      <div style={{ display: 'flex', gap: 0 }}>
        {MILESTONES.map((t, i) => (
          <div key={t.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: t.status === 'next' ? `${V}20` : W.glass04, border: `1px solid ${t.status === 'next' ? V : W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: t.status === 'next' ? V : W.text4, fontFamily: 'var(--font-mono)' }}>{t.date}</span>
            </div>
            <p style={{ fontSize: 11, color: i === 0 ? W.text1 : W.text2, lineHeight: 1.4, margin: '10px 0 0', fontWeight: i === 0 ? 700 : 400, textAlign: 'center', padding: '0 4px' }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  </>)
}
