import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { W } from '../../../theme/publicTheme'
import { Tag, SlidePanel } from '../index'

const V = W.violet

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

export default function WhiteBoxSlide() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1080, margin: '0 auto', gap: 60 }}>
        {/* Left Column: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
          <div style={{ marginBottom: 24 }}>
            <Tag>The White Box Mine</Tag>
          </div>
          
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: W.text1 }}>
            From Probabilistic to Provable
          </h2>
          
          <p style={{ fontSize: 16, color: W.text3, lineHeight: 1.6, maxWidth: 600, marginBottom: 40 }}>
            Legacy ESG reporting is the equivalent of an AI hallucination — an output without an audit trail of the inputs. We apply <span style={{ color: W.text1, fontWeight: 600 }}>Field Observability</span> to trace the physical reality of extraction.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${V}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: V, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>01</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Observe</h3>
                  <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Ground Truth</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                Geology is probabilistic; operations are absolute. We separate the predictive model (JORC resources) from the verified reality (LAPOC instrument data).
              </p>
            </SlidePanel>

            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${W.cyan}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.cyan, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>02</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Trace</h3>
                  <div style={{ fontSize: 11, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Zero-Trust Extraction</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                Every movement of ore — from extraction coordinate to the final batch of MREC — is logged in a cryptographic audit chain.
              </p>
            </SlidePanel>

            <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${W.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.green, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>03</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: W.text1 }}>Verify</h3>
                  <div style={{ fontSize: 11, color: W.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Commercial Arbitrage</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                "White Box" observability de-risks the asset, generating an instantaneous, mathematically provable Digital Product Passport (DPP).
              </p>
            </SlidePanel>
          </div>
        </div>

        {/* Right Column: Organogram + Governance card */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="400" height="460" viewBox="0 0 400 460" style={{ overflow: 'visible', flexShrink: 0 }}>
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={V} stopOpacity={0.2} />
                <stop offset="100%" stopColor={V} stopOpacity={0} />
              </radialGradient>
            </defs>
            
            {/* Background glows */}
            <circle cx={200} cy={80} r={80} fill="url(#nodeGlow)" />
            <circle cx={200} cy={180} r={80} fill="url(#nodeGlow)" />
            <circle cx={200} cy={280} r={80} fill="url(#nodeGlow)" />
            <circle cx={200} cy={380} r={80} fill="url(#nodeGlow)" />

            {/* Edges */}
            <OrganogramEdge x1={200} y1={110} x2={200} y2={150} delay={0.6} />
            <OrganogramEdge x1={200} y1={210} x2={200} y2={250} delay={1.2} />
            <OrganogramEdge x1={200} y1={310} x2={200} y2={350} delay={1.8} />

            {/* Nodes */}
            <OrganogramNode x={200} y={80} label="Sensors" sub="Physical Ground Truth" delay={0.2} />
            <OrganogramNode x={200} y={180} label="Ingestion" sub="Nervous System" delay={0.8} />
            <OrganogramNode x={200} y={280} label="Trace" sub="Blockchain / DPP" delay={1.4} />
            <OrganogramNode x={200} y={380} label="Verify" sub="Capital & Compliance" delay={2.0} />

            {/* Loop Edge */}
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

          <div style={{ marginTop: 16, padding: '14px 18px', background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: 12, color: W.text2, margin: 0, textAlign: 'center', fontWeight: 500, lineHeight: 1.5 }}>
              <span style={{ color: V, fontWeight: 700 }}>Governance as a Shield:</span> Continuous, verified disclosure protects the board and ensures that market narrative matches field reality 1:1.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
