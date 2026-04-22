import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { W, V } from '../shared'
import { Tag, SlidePanel, StatCard } from '../../../../components/deck'

/* ─ Local SVG helpers (mirror WhiteBoxSlide template) ─────── */

function NodeBox({ x, y, label, sub, delay }: { x: number, y: number, label: string, sub: string, delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <rect x={x - 80} y={y - 30} width={160} height={60} rx={12} fill={W.glass04} stroke={W.glass12} strokeWidth={1} />
      <text x={x} y={y - 2} textAnchor="middle" fill={W.text1} fontSize={13} fontWeight={700} fontFamily="var(--font-sans)">{label}</text>
      <text x={x} y={y + 14} textAnchor="middle" fill={W.cyan} fontSize={10} fontWeight={600} fontFamily="var(--font-mono)">{sub}</text>
    </motion.g>
  )
}

function NodeEdge({ x1, y1, x2, y2, delay }: { x1: number, y1: number, x2: number, y2: number, delay: number }) {
  const path = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
  return (
    <>
      <path d={path} fill="none" stroke={W.glass08} strokeWidth={2} />
      <motion.path
        d={path}
        fill="none"
        stroke={W.cyan}
        strokeWidth={2}
        strokeDasharray="4 8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: 'easeInOut' }}
      />
      <motion.circle
        r={3}
        fill={W.cyan}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay }}
        style={{ filter: `drop-shadow(0 0 6px ${W.cyan})`, offsetPath: `path('${path}')` } as CSSProperties & Record<string, string>}
      />
    </>
  )
}

const KPIS = [
  { v: '11', l: 'AOIs', s: 'Mid-Atlantic' },
  { v: '78', l: 'Vessels', s: 'AIS-style' },
  { v: '4', l: 'Dark events', s: 'Action req\u2019d' },
  { v: '3', l: 'ISR products', s: 'Bundleable' },
]

export default function MaritimeSiblingSlide() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1080, margin: '0 auto', gap: 60 }}>
        {/* Left Column: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
          <div style={{ marginBottom: 16 }}>
            <Tag>Reference deployment 2 of 2 · /app/maritime</Tag>
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 14, color: W.text1 }}>
            Atlantic Maritime ISR — Same Runtime
          </h2>

          <p style={{ fontSize: 16, color: W.text3, lineHeight: 1.6, maxWidth: 600, marginBottom: 20 }}>
            The maritime instance ships on the same audit-chain runtime as Caldeira. Different fixtures (AIS vessels, AOI polygons, sensor stations) — identical primitives (units, evidence, bundles, verifier).
            Built in week 2; auto-verified bundle handoff in week 3.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 560, marginBottom: 24 }}>
            {KPIS.map(k => <StatCard key={k.l} value={k.v} label={k.l} sub={k.s} />)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${W.cyan}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.cyan, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>01</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Detect</h3>
                  <div style={{ fontSize: 11, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AIS dropouts inside AOIs</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                Animated vessel positions tick every 2 s. Dark-vessel chips surface AIS dropouts inside exclusion zones — the same alert composition Caldeira uses for environmental excursions.
              </p>
            </SlidePanel>

            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${V}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: V, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>02</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Trace</h3>
                  <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Unit graph + edges</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                AOIs, vessels, sensor stations, ISR products and incident alerts are first-class units in the same SQLite-backed graph as drill collars and licenses. Forward edges from <code style={{ fontFamily: 'var(--font-mono)', color: W.text2 }}>SITE-MARITIME</code> traverse into bundle snapshots cleanly.
              </p>
            </SlidePanel>

            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${W.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.green, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>03</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Verify</h3>
                  <div style={{ fontSize: 11, color: W.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Same /verify/&lt;hash&gt;</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                <code style={{ fontFamily: 'var(--font-mono)', color: W.text2 }}>POST /api/bundles/preset {`{ preset: "maritimeIsr" }`}</code> returns a real chain hash anchored at a seeded reference event. Open <code style={{ fontFamily: 'var(--font-mono)', color: W.text2 }}>/verify/&lt;hash&gt;</code> in any browser — the verifier doesn't care which vertical produced it.
              </p>
            </SlidePanel>
          </div>
        </div>

        {/* Right Column: Maritime organogram */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="400" height="460" viewBox="0 0 400 460" style={{ overflow: 'visible', flexShrink: 0 }}>
            <defs>
              <radialGradient id="maritimeNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={W.cyan} stopOpacity={0.2} />
                <stop offset="100%" stopColor={W.cyan} stopOpacity={0} />
              </radialGradient>
            </defs>

            <circle cx={200} cy={80} r={80} fill="url(#maritimeNodeGlow)" />
            <circle cx={200} cy={180} r={80} fill="url(#maritimeNodeGlow)" />
            <circle cx={200} cy={280} r={80} fill="url(#maritimeNodeGlow)" />
            <circle cx={200} cy={380} r={80} fill="url(#maritimeNodeGlow)" />

            <NodeEdge x1={200} y1={110} x2={200} y2={150} delay={0.6} />
            <NodeEdge x1={200} y1={210} x2={200} y2={250} delay={1.2} />
            <NodeEdge x1={200} y1={310} x2={200} y2={350} delay={1.8} />

            <NodeBox x={200} y={80} label="AIS / Radar / Sat" sub="Sensor truth" delay={0.2} />
            <NodeBox x={200} y={180} label="Fusion + AOIs" sub="Same unit graph" delay={0.8} />
            <NodeBox x={200} y={280} label="Dark events" sub="Action required" delay={1.4} />
            <NodeBox x={200} y={380} label="ISR Bundle" sub="/verify/<hash>" delay={2.0} />

            <motion.path
              d="M 120 380 C 40 380, 40 80, 120 80"
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
              style={{ filter: `drop-shadow(0 0 6px ${W.green})`, offsetPath: `path('M 120 380 C 40 380, 40 80, 120 80')` } as CSSProperties & Record<string, string>}
            />
          </svg>

          <div style={{ marginTop: 16, padding: '14px 18px', background: `${W.cyan}10`, border: `1px solid ${W.cyan}30`, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: 12, color: W.text2, margin: 0, textAlign: 'center', fontWeight: 500, lineHeight: 1.5 }}>
              <span style={{ color: W.cyan, fontWeight: 700 }}>One runtime, two verticals:</span> the maritime instance proves the platform claim — switching the use case is a config and a fixture set, not a fork of the codebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
