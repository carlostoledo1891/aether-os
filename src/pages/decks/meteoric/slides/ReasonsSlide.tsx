import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { W, V, ease, EU_DPP_DATE } from './shared'

const DeckCountdown = lazy(() => import('../DeckCountdown'))

const REASONS = [
  'The DFS lands mid-2026. The dashboard needs to be live before it does — not after.',
  'VeroChain becomes the data standard every subsequent REE project adopts. Meteoric shapes the schema, not inherits it.',
  'Every investor question has a dashboard answer. Due diligence rounds close faster when your data is auditable and interactive.',
  'Competitive positioning. An interactive digital twin with geological and environmental provenance that Lynas and MP Materials do not have.',
  'Scientific credibility. LAPOC/ANSN data integration means field-verified readings carry the authority of Brazil\'s nuclear safety research institute.',
  'Community license. The Prefeitura dashboard is already built — Poços de Caldas sees environmental transparency in Portuguese, in real time.',
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
