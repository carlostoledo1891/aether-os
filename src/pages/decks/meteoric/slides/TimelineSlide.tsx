import { GlassRow } from '../../../../components/deck'
import { W, V } from './shared'

const TIMELINE = [
  { week: '0–2', label: 'Contract + API keys + LAPOC mapping' },
  { week: '2–4', label: 'First live sensor data flowing' },
  { week: '4–6', label: 'Custom DFS presentation views' },
  { week: '6–8', label: 'Community dashboard review' },
  { week: '8–12', label: 'Full production · board-ready' },
]

export default function TimelineSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>90 Days to Live Data</h2>
      <div style={{ maxWidth: 600, width: '100%', position: 'relative', margin: '0 auto 40px' }}>
        {/* Vertical Line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 2, background: `linear-gradient(180deg, ${V}80 0%, ${V}20 100%)` }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {TIMELINE.map((t, i) => {
            const isLast = i === TIMELINE.length - 1;
            return (
              <div key={t.week} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ width: '45%', textAlign: 'right', fontSize: 16, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>
                  W{t.week}
                </div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: W.bg, border: `3px solid ${V}`, zIndex: 1, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `${V}40`, filter: 'blur(4px)' }} />
                </div>
                <div style={{ width: '45%', textAlign: 'left', fontSize: 15, color: isLast ? W.text1 : W.text2, fontWeight: isLast ? 700 : 500 }}>
                  {t.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <GlassRow items={[{ label: 'Annual Cost', value: '$102k' }, { label: '% of NPV', value: '0.013%' }, { label: 'NPV Consensus', value: '$821M' }]} />
      </div>
    </>
  )
}
