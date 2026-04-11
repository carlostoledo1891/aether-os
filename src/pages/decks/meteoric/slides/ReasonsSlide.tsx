import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { W, V, ease, EU_DPP_DATE } from './shared'

const DeckCountdown = lazy(() => import('../DeckCountdown'))

const REASONS = [
  'DFS mid-2026 — the dashboard should be live when the DFS drops.',
  'Vero becomes market standard. Meteoric gets it 18 months early — and shapes the standard.',
  'Competitive signaling. An interactive digital twin that Lynas and MP Materials don\'t have.',
  'Due diligence speed. Every question has a dashboard answer. Raises close faster.',
  'Community trust. The Prefeitura dashboard is built — Poços sees transparency in Portuguese.',
]

export default function ReasonsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Why Sign This Quarter</h2>
      <div style={{ marginBottom: 24 }}>
        <Suspense fallback={null}>
          <DeckCountdown target={EU_DPP_DATE} />
        </Suspense>
      </div>
      <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REASONS.map((r, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left' }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 8, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              {i + 1}
            </div>
            <p style={{ fontSize: 14, color: W.text2, lineHeight: 1.6, margin: 0 }}>{r}</p>
          </motion.div>
        ))}
      </div>
    </>
  )
}
