import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { W, V, ease, EU_DPP_DATE } from './shared'

const DeckCountdown = lazy(() => import('../DeckCountdown'))

const REASONS = [
  'The DFS lands mid-2026. The dashboard needs to be live before it does — not after.',
  'Vero is positioned to become a reference data layer for REE projects — and a live Atlantic Maritime ISR sibling already proves the runtime travels across verticals. Meteoric helps shape the schema rather than inheriting one set elsewhere.',
  'Most investor questions can map to a dashboard answer. Due diligence rounds close faster when the underlying data is auditable and interactive.',
  'Differentiated positioning. An interactive digital twin with geological and environmental provenance is rare in the REE peer set today.',
  'Scientific credibility. LAPOC/ANSN integration is mapped — once live, field readings inherit the chain of custody of Brazil\'s nuclear safety research institute.',
  'Community license. The Prefeitura dashboard surface is built — designed to give Poços de Caldas environmental transparency in Portuguese as live channels connect.',
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
