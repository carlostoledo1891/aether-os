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
  { date: 'Feb 2027', label: 'EU DPP — market 3x', status: 'pending' as const },
]

export function TimelineSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>What Happens Next</h2>
    <div style={{ maxWidth: 600, width: '100%', position: 'relative', margin: '0 auto' }}>
      {/* Vertical Line */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 2, background: `linear-gradient(180deg, ${V}80 0%, ${V}20 100%)` }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {MILESTONES.map((t, i) => (
          <div key={t.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ width: '45%', textAlign: 'right', fontSize: 16, fontWeight: 800, color: t.status === 'next' ? V : W.text3, fontFamily: 'var(--font-mono)' }}>
              {t.date}
            </div>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: W.bg, border: `3px solid ${t.status === 'next' ? V : W.glass08}`, zIndex: 1, position: 'relative' }}>
              {t.status === 'next' && <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `${V}40`, filter: 'blur(4px)' }} />}
            </div>
            <div style={{ width: '45%', textAlign: 'left', fontSize: 15, color: i === 0 ? W.text1 : W.text2, fontWeight: i === 0 ? 700 : 500 }}>
              {t.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>)
}
