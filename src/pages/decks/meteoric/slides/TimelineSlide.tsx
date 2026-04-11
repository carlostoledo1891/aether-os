import { motion } from 'motion/react'
import { GlassRow } from '../../../../components/deck'
import { W, V, ease } from './shared'

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
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>90 Days to Live Data</h2>
      <div style={{ maxWidth: 900, width: '100%', position: 'relative' }}>
        <svg style={{ position: 'absolute', top: 19, left: 0, width: '100%', height: 2, overflow: 'visible', zIndex: 0 }}>
          <motion.line
            x1="0" y1="1" x2="100%" y2="1"
            stroke={V} strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 19, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${V}60, ${V}10)` }} />
        <div style={{ display: 'flex', gap: 0 }}>
          {TIMELINE.map((t, i) => (
            <motion.div key={t.week}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15, ease }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>W{t.week}</span>
              </div>
              <p style={{ fontSize: 12, color: i === TIMELINE.length - 1 ? W.text1 : W.text2, lineHeight: 1.4, margin: '10px 0 0', fontWeight: i === TIMELINE.length - 1 ? 700 : 400, textAlign: 'center', padding: '0 4px' }}>{t.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <GlassRow items={[{ label: 'Annual Cost', value: '$102k' }, { label: '% of NPV', value: '0.013%' }, { label: 'NPV Consensus', value: '$821M' }]} />
      </div>
    </>
  )
}
