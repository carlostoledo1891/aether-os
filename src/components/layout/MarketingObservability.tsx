import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { W } from '../../theme/publicTheme'
import { ScrollSection as S, Stagger, SectionHeader } from './MarketingPrimitives'
import { marketingStyles } from './MarketingShared'

const V = W.violet
const { wrap, glass, glow } = marketingStyles

const TOPICS = [
  {
    title: 'The Problem',
    tag: 'Field reports nobody trusts',
    desc: 'Field operations report to GIS, telemetry to a fleet console, compliance to a spreadsheet, and the board to a slide. Buyers, regulators, and capital see four different stories. Vero collapses them onto one map with one audit chain — a "White Box Field" instead of four black boxes.',
  },
  {
    title: 'Observe',
    tag: 'Ground truth on the map',
    desc: 'Models are probabilistic; operations are absolute. Vero separates the predictive layer (forecasts, resource estimates, financial scenarios) from verified reality (sensor streams, field-verified readings, operator inputs). Every reading lands as a typed unit on the map with a provenance label.',
  },
  {
    title: 'Trace',
    tag: 'Zero-trust audit chain',
    desc: 'Zero-trust architecture for the physical operation. Every state change — a sample at the source, a paddock crossing, an AOI breach, a permit edit, a batch handoff — is logged in a SHA-256 append-only audit chain that downstream parties can verify without trusting our database.',
  },
  {
    title: 'Verify',
    tag: 'Compliance as moat',
    desc: 'White-box field operations de-risk the operation and unlock strategic capital and customer trust. The same audit chain produces an evidence dossier the buyer can verify — Digital Product Passport for minerals, organic / regenerative certification for agriculture, audit-chain reports for defense — turning compliance from a cost into a moat.',
  },
]

function OrganogramNode({ x, y, label, sub, delay }: { x: number, y: number, label: string, sub: string, delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <rect x={x - 80} y={y - 30} width={160} height={60} rx={12} fill={`${W.glass04}`} stroke={`${W.glass12}`} strokeWidth={1} />
      <text x={x} y={y - 2} textAnchor="middle" fill={W.text1} fontSize={13} fontWeight={700} fontFamily="var(--font-sans)">{label}</text>
      <text x={x} y={y + 14} textAnchor="middle" fill={V} fontSize={10} fontWeight={600} fontFamily="var(--font-mono)">{sub}</text>
    </motion.g>
  )
}

function OrganogramEdge({ x1, y1, x2, y2, delay }: { x1: number, y1: number, x2: number, y2: number, delay: number }) {
  const path = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
  
  return (
    <>
      <path d={path} fill="none" stroke={`${W.glass08}`} strokeWidth={2} />
      <motion.path
        d={path}
        fill="none"
        stroke={V}
        strokeWidth={2}
        strokeDasharray="4 8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: 'easeInOut' }}
      />
      <motion.circle
        r={3}
        fill={V}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay }}
        style={{ filter: `drop-shadow(0 0 6px ${V})`, offsetPath: `path('${path}')` } as CSSProperties & Record<string, string>}
      />
    </>
  )
}

export function MarketingObservability() {
  return (
    <S id="observability" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={glow} />
      <div style={{ ...wrap, position: 'relative' }}>
        <SectionHeader
          label="The White Box Field"
          heading="From four black boxes to one map"
          body="GIS, telemetry, compliance, and the board pack — usually four parallel stories. Vero collapses them onto one map with one audit chain so buyers, regulators, and capital see the same operational truth."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 48, alignItems: 'center' }}>
          {/* Left Column: Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TOPICS.map((t, i) => (
              <Stagger key={t.title} i={i}>
                <div style={{ ...glass, padding: '24px 28px' }}>
                  <div style={glow} />
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: W.text1, margin: 0 }}>{t.title}</h3>
                    <span style={{ fontSize: 11, color: V, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{t.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, color: W.text3, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>

          {/* Right Column: Animated Organogram */}
          <div style={{ ...glass, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={glow} />
            <svg width="100%" height="100%" viewBox="0 0 400 500" style={{ overflow: 'visible' }}>
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={V} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={V} stopOpacity={0} />
                </radialGradient>
              </defs>
              
              {/* Background glows */}
              <circle cx={200} cy={100} r={80} fill="url(#nodeGlow)" />
              <circle cx={200} cy={200} r={80} fill="url(#nodeGlow)" />
              <circle cx={200} cy={300} r={80} fill="url(#nodeGlow)" />
              <circle cx={200} cy={400} r={80} fill="url(#nodeGlow)" />

              {/* Edges */}
              <OrganogramEdge x1={200} y1={130} x2={200} y2={170} delay={0.6} />
              <OrganogramEdge x1={200} y1={230} x2={200} y2={270} delay={1.2} />
              <OrganogramEdge x1={200} y1={330} x2={200} y2={370} delay={1.8} />

              {/* Nodes */}
              <OrganogramNode x={200} y={100} label="Field Sensors" sub="Ground Truth" delay={0.2} />
              <OrganogramNode x={200} y={200} label="Map & Geofence" sub="Typed Units" delay={0.8} />
              <OrganogramNode x={200} y={300} label="Monitor & Verify" sub="Audit Chain" delay={1.4} />
              <OrganogramNode x={200} y={400} label="Decide & Report" sub="Evidence Dossier" delay={2.0} />

              {/* Loop Edge */}
              <motion.path
                d="M 120 400 C 40 400, 40 100, 120 100"
                fill="none"
                stroke={W.green}
                strokeWidth={2}
                strokeDasharray="4 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 2.6, ease: 'easeInOut' }}
              />
              <motion.circle
                r={3}
                fill={W.green}
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 2.6 }}
                style={{ filter: `drop-shadow(0 0 6px ${W.green})`, offsetPath: `path('M 120 400 C 40 400, 40 100, 120 100')` } as CSSProperties & Record<string, string>}
              />
            </svg>
          </div>
        </div>
      </div>
    </S>
  )
}