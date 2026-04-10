import { type ReactNode, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'

const ease = [0.16, 1, 0.3, 1] as const

/** Global index.css sets overflow:hidden on html/body/#root for the dashboard.
 *  The LP is a scrollable page, so we unlock overflow while mounted. */
function useUnlockScroll() {
  useEffect(() => {
    const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean) as HTMLElement[]
    targets.forEach(el => { el.style.overflow = 'auto' })
    return () => { targets.forEach(el => { el.style.overflow = '' }) }
  }, [])
}

/* ── Scroll-reveal section wrapper ──────────────────────────────── */

function S({ children, style, id }: { children: ReactNode; style?: React.CSSProperties; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.7, ease }}
      style={style}
    >
      {children}
    </motion.section>
  )
}

/* ── Data ────────────────────────────────────────────────────────── */

const HERO_STATS = [
  { value: '9.3 / 10', label: 'Persona Score' },
  { value: '310', label: 'Automated Tests' },
  { value: '27', label: 'AI Agent Tools' },
  { value: 'SHA-256', label: 'Audit Chain' },
]

const PROBLEMS = [
  { stat: '70%', title: 'Supply Concentration', desc: 'Rare earth production flows through one country — zero downstream visibility into provenance or supply risk.' },
  { stat: '18–24 mo', title: 'Procurement Delays', desc: 'US DoD faces delays when FEOC documentation is incomplete or contested across the supply chain.' },
  { stat: 'Feb 2027', title: 'Compliance Void', desc: 'EU Battery Passport enforcement begins with no industry-standard tooling for critical minerals.' },
  { stat: '0', title: 'Unified Platforms', desc: 'Teams juggle spreadsheets across engineering, permitting, IR, and community — none survives diligence.' },
]

const PERSPECTIVES = [
  {
    tag: 'Ground Truth',
    audience: 'For Field Operators & Geologists',
    headline: 'See what\'s happening in the field',
    desc: 'Real-time monitoring across the entire operation — from drill collar to pilot plant product output.',
    accent: W.cyan,
    features: [
      'Pilot Plant Digital Twin — 17 equipment items, 28 sensors, animated process flow visualization',
      '3D terrain maps with 19 GeoJSON datasets, drill collars, springs, licence boundaries',
      'Hydro Twin spring monitoring network for licence-to-operate defense',
      'Click-to-inspect any equipment node: supplier, capacity, sensors, connected process step',
    ],
    metrics: [
      { value: '17', label: 'Equipment' },
      { value: '28', label: 'Sensors' },
      { value: '19', label: 'GeoJSON Sets' },
    ],
  },
  {
    tag: 'Trade Truth',
    audience: 'For Compliance Teams & Offtakers',
    headline: 'Prove where it came from',
    desc: 'Automated provenance evidence from molecular composition to magnet assembly — audit-ready.',
    accent: W.green,
    features: [
      'EU Digital Product Passport — 22 CEN/CENELEC fields mapped and schema-validated',
      'FEOC origin tracking — molecular-to-magnet provenance chain with batch traceability',
      'SHA-256 append-only audit ledger with programmatic chain verification API',
      'Export-ready compliance evidence packages for downstream auditors and regulators',
    ],
    metrics: [
      { value: '22', label: 'DPP Fields' },
      { value: 'SHA-256', label: 'Audit' },
      { value: '100%', label: 'Export-Ready' },
    ],
  },
  {
    tag: 'Board Truth',
    audience: 'For Executives & Investors',
    headline: 'Decide with verified data',
    desc: 'Financial scenarios, risk tracking, and ESG frameworks — aligned to board and steerco rhythm.',
    accent: W.violet,
    features: [
      'Bear / Consensus / Bull financial scenarios with ARR projections through 2030',
      'Capital tracker with DSCR projections, CAPEX monitoring, and funding status',
      'Risk register with live feed integration, mitigation tracking, and escalation',
      'ESG governance frameworks, stakeholder management, and compliance reporting',
    ],
    metrics: [
      { value: '3', label: 'Scenarios' },
      { value: 'Live', label: 'DSCR' },
      { value: '9.3', label: 'Score' },
    ],
  },
]

const MARKET = [
  { layer: 'TAM', value: '$18.8 B → $31.9 B', period: '2026 – 2031', cagr: '11.2 %', desc: 'Digital mining & smart mining technology', pct: 100 },
  { layer: 'SAM', value: '$1.6 B → $5.2 B', period: '2025 – 2033', cagr: '14.2 %', desc: 'Critical minerals compliance SaaS', pct: 52 },
  { layer: 'SOM', value: '$15 M → $45 M', period: '2026 – 2030', cagr: '—', desc: '15 REE projects × $102 k / yr', pct: 15 },
]

const CALDEIRA = [
  { value: '$821 M', label: 'NPV Consensus' },
  { value: '28 %', label: 'IRR Pre-Tax' },
  { value: '$443 M', label: 'CAPEX' },
  { value: '3 yr', label: 'Payback' },
  { value: '$2.0 B', label: 'LOM FCF' },
]

const TEAM = [
  { name: 'Carlos Toledo', role: 'Founder & Product Lead', desc: 'Born inside the Caldeira. Air Force pilot, full-stack engineer, product designer. 310 tests, enterprise security, 27 AI tools — built solo. 40 years of local context.' },
  { name: 'Dr. Heber Caponi', role: 'Chief Scientific Advisor', desc: 'LAPOC researcher. Decades of active Caldeira field work. The bridge from simulated to field-verified data.' },
  { name: 'Thiago A.', role: 'CEO (designated)', desc: 'Brazilian / international law. Enterprise operations and commercial execution at scale.' },
]

const AUDIENCES = [
  { label: 'Defense & Procurement', need: 'FEOC supply chain verification', offer: 'Security posture + audit chain + FEOC origin tracking', accent: W.violet, stat: '8.0', statLabel: 'DoD Score' },
  { label: 'EU Compliance', need: 'Digital Product Passport readiness', offer: '22 CEN/CENELEC DPP fields mapped with schema validation', accent: W.green, stat: '59%', statLabel: 'DPP Coverage' },
  { label: 'Project Finance', need: 'Technical risk de-risking', offer: 'Bear/Consensus/Bull scenarios + DSCR + 310 automated tests', accent: W.amber, stat: '9.0', statLabel: 'PF Score' },
  { label: 'Communities', need: 'Honest environmental monitoring', offer: 'Hydro Twin + bilingual grievance path + visible "modeled" labels', accent: W.cyan, stat: 'PT/EN', statLabel: 'Bilingual' },
]

const SECURITY_STATS = [
  { value: '310', label: 'Tests', sub: '260 frontend + 50 server' },
  { value: 'CSP', label: 'Headers', sub: 'Content Security Policy' },
  { value: '120', label: 'Rate Limit', sub: 'Requests / minute' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode, both packages' },
]

/* ── Shared inline-style helpers ─────────────────────────────────── */

const wrap: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 24px' }

const labelStyle = (color: string): React.CSSProperties => ({
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color, marginBottom: 12,
})

const sectionTitle: React.CSSProperties = {
  fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: W.text1,
}

const bodyText: React.CSSProperties = {
  fontSize: 17, color: W.text3, lineHeight: 1.7, maxWidth: 640,
}

const card: React.CSSProperties = {
  background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 16,
  padding: '28px 24px', position: 'relative', overflow: 'hidden',
}

/* ── Component ───────────────────────────────────────────────────── */

export default function LandingPage() {
  useUnlockScroll()

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div style={{ background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {/* ── Fixed Nav ──────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(7,7,14,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${W.glass06}`, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: W.violet, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
          }}>V</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Vero</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { label: 'Platform', id: 'platform' },
            { label: 'Security', id: 'security' },
            { label: 'Market', id: 'market' },
            { label: 'Team', id: 'team' },
          ].map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={e => { e.preventDefault(); scrollTo(l.id) }}
              style={{ color: W.text3, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
            >
              {l.label}
            </a>
          ))}
          <a href="/pitch-deck" style={{
            background: W.violet, color: '#fff', padding: '8px 18px', borderRadius: 7,
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>
            Investor Deck
          </a>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '100px 24px 60px', position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: '55vw', height: '55vw', borderRadius: '50%',
            background: `radial-gradient(circle, ${W.violet}14, transparent 70%)`,
            top: '-12vw', left: '22vw', filter: 'blur(80px)', pointerEvents: 'none',
          }}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}>
          <div style={{ ...labelStyle(W.violet), marginBottom: 28, position: 'relative' }}>
            Critical Minerals Intelligence Platform
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{
            fontSize: 'clamp(36px, 6.5vw, 72px)', fontWeight: 800, lineHeight: 1.05,
            maxWidth: 880, margin: '0 0 24px', position: 'relative',
            background: `linear-gradient(135deg, ${W.text1} 30%, ${W.violet})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          The trust layer for critical mineral supply chains
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          style={{ ...bodyText, marginBottom: 40, position: 'relative', textAlign: 'center' }}
        >
          One platform to verify field operations, prove compliance, and align
          board decisions — purpose-built for the rare earth supply chain, from mine to magnet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          style={{ display: 'flex', gap: 12, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="/" style={{
            background: W.violet, color: '#fff', padding: '14px 28px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Open Platform
          </a>
          <a href="/pitch-deck" style={{
            border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px',
            borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent',
          }}>
            Investor Deck →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ marginTop: 72, display: 'flex', gap: 0, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {HERO_STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center', padding: '0 32px',
              borderLeft: i > 0 ? `1px solid ${W.glass08}` : 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: W.violet, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 36, color: W.text4, fontSize: 20, opacity: 0.4 }}
        >
          ↓
        </motion.div>
      </section>

      {/* ── Problem ────────────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 30%, ${W.red}04 0%, transparent 55%)`,
        }} />
        <div style={{ ...wrap, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={labelStyle(W.red)}>The Gap</div>
          <h2 style={sectionTitle}>Critical minerals. Zero standard tooling.</h2>
          <p style={{ ...bodyText, margin: '0 auto' }}>
            The rare earth supply chain powers electric vehicles, wind turbines, defense systems,
            and consumer electronics — yet operates with no unified platform for verification.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {PROBLEMS.map(p => (
            <div key={p.title} style={card}>
              <div style={{ fontSize: 28, fontWeight: 800, color: W.red, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                {p.stat}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: W.text1, marginBottom: 6 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </S>

      {/* ── Three Truths — Perspectives ────────────────────────── */}
      <S id="platform" style={{ ...wrap, padding: '120px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={labelStyle(W.violet)}>The Platform</div>
          <h2 style={sectionTitle}>One platform. Three truths.</h2>
          <p style={{ ...bodyText, margin: '0 auto' }}>
            Every stakeholder in the critical minerals supply chain sees a different slice of
            reality. Vero aligns them — verified, auditable, and always current.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {PERSPECTIVES.map(p => (
            <div key={p.tag} style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.accent, opacity: 0.7 }} />

              <div style={{ ...labelStyle(p.accent), marginBottom: 4 }}>{p.tag}</div>
              <div style={{ fontSize: 11, color: W.text4, marginBottom: 16 }}>{p.audience}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, marginBottom: 10 }}>{p.headline}</h3>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%', background: p.accent,
                      marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${p.accent}40`,
                    }} />
                    <span style={{ fontSize: 13, color: W.text2, lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', gap: 0, marginTop: 24, paddingTop: 16,
                borderTop: `1px solid ${W.glass06}`,
              }}>
                {p.metrics.map((m, i) => (
                  <div key={m.label} style={{
                    textAlign: 'center', flex: 1,
                    borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: p.accent, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </S>

      {/* ── Who We Serve ──────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 50%, ${W.violet}05 0%, transparent 55%)`,
        }} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={labelStyle(W.violet)}>Who We Serve</div>
            <h2 style={sectionTitle}>Every stakeholder. Their deepest need.</h2>
            <p style={{ ...bodyText, margin: '0 auto' }}>
              Vero doesn't pitch features — it solves the specific problem that keeps each
              stakeholder up at night.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {AUDIENCES.map(a => (
              <div key={a.label} style={{ ...card, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a.accent, opacity: 0.7 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 6 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: a.accent, fontWeight: 600, marginBottom: 12 }}>{a.need}</div>
                <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0, flex: 1 }}>{a.offer}</p>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${W.glass06}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: a.accent, fontFamily: 'var(--font-mono)' }}>{a.stat}</div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{a.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </S>

      {/* ── Digital Twin Spotlight ──────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 50%, ${W.cyan}06 0%, transparent 60%)`,
        }} />
        <div style={{ ...wrap, textAlign: 'center', position: 'relative' }}>
          <div style={labelStyle(W.cyan)}>Hero Feature</div>
          <h2 style={sectionTitle}>Pilot Plant Digital Twin</h2>
          <p style={{ ...bodyText, margin: '0 auto 48px' }}>
            An interactive Control Room that maps the entire hydrometallurgical pilot plant — from
            ROM ore to MREC product. Real equipment from Metso, Andritz, GEA, and Outotec with
            live telemetry paths, animated process flows, and click-to-inspect panels.
          </p>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap',
            background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14,
            padding: '28px 0', maxWidth: 640, margin: '0 auto',
          }}>
            {[
              { value: '17', label: 'Equipment Items', accent: W.cyan },
              { value: '28', label: 'Mapped Sensors', accent: W.cyan },
              { value: '7', label: 'Process Steps', accent: W.cyan },
              { value: '15', label: 'Flow Paths', accent: W.cyan },
            ].map((s, i) => (
              <div key={s.label} style={{
                textAlign: 'center', flex: 1, padding: '0 20px',
                borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.accent, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: W.text4, marginTop: 4, letterSpacing: '0.03em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </S>

      {/* ── Security & Trust ───────────────────────────────────── */}
      <S id="security" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 50%, ${W.violet}05 0%, transparent 55%)`,
        }} />
        <div style={{ ...wrap, textAlign: 'center', position: 'relative' }}>
          <div style={labelStyle(W.violet)}>Enterprise Ready</div>
          <h2 style={sectionTitle}>Security & engineering quality</h2>
          <p style={{ ...bodyText, margin: '0 auto 48px' }}>
            The sprint that moved two persona scores on infrastructure alone. DoD 7.5 → 8.0.
            PF Analyst 8.5 → 9.0. Zero new features — pure engineering discipline.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16, maxWidth: 740, margin: '0 auto',
          }}>
            {SECURITY_STATS.map(s => (
              <div key={s.label} style={{
                padding: '24px 16px',
                background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: W.violet, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text1, marginTop: 6 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: W.text4, marginTop: 3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8,
            maxWidth: 640, marginInline: 'auto', textAlign: 'left',
          }}>
            {[
              'Content Security Policy + CORS lockdown + rate limiting on every endpoint',
              'API key authentication on sensitive routes — fail-closed by default',
              'React.memo on all 14 map overlays — zero unnecessary re-renders',
              'Unified z-index constant — no more stacking bugs across the UI',
              'ARIA labels on every interactive control — accessible by design',
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%', background: W.violet,
                  marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${W.violet}40`,
                }} />
                <span style={{ fontSize: 13, color: W.text2, lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </S>

      {/* ── Market ─────────────────────────────────────────────── */}
      <S id="market" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 40%, ${W.green}04 0%, transparent 55%)`,
        }} />
        <div style={{ ...wrap, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={labelStyle(W.green)}>Market Opportunity</div>
          <h2 style={sectionTitle}>Regulatory tailwinds drive adoption</h2>
          <p style={{ ...bodyText, margin: '0 auto' }}>
            EU Battery Passport enforcement (Feb 2027) and US FEOC requirements create
            mandatory compliance demand — no opt-out for critical mineral producers or buyers.
          </p>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {MARKET.map(m => (
            <div key={m.layer} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{m.layer}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value}</span>
              </div>
              <div style={{ height: 6, background: W.glass04, borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: `linear-gradient(90deg, ${W.green}, ${W.green}80)`,
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: W.text4, marginTop: 6 }}>
                {m.desc}{m.cagr !== '—' ? ` · ${m.cagr} CAGR` : ''} · {m.period}
              </div>
            </div>
          ))}
        </div>
        </div>
      </S>

      {/* ── Caldeira ───────────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 60%, ${W.cyan}05 0%, transparent 50%)`,
        }} />
        <div style={{ ...wrap, textAlign: 'center', position: 'relative' }}>
          <div style={labelStyle(W.cyan)}>Flagship Deployment</div>
          <h2 style={sectionTitle}>Caldeira Project — Meteoric Resources</h2>
          <p style={{ ...bodyText, margin: '0 auto 48px' }}>
            World-class ionic clay REE deposit in Poços de Caldas, MG, Brazil. 1.537 Bt resource
            across 7 deposits. LP approved Dec 2025 · DFS mid-2026 · First production 2028.
            Binding offtake with Ucore (2,000 tpa) and LOI with Neo Performance (1,500 tpa).
          </p>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap',
            background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14,
            padding: '28px 0', maxWidth: 700, margin: '0 auto',
          }}>
            {CALDEIRA.map((k, i) => (
              <div key={k.label} style={{
                textAlign: 'center', flex: 1, padding: '0 16px', minWidth: 100,
                borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: W.cyan, fontFamily: 'var(--font-mono)' }}>{k.value}</div>
                <div style={{ fontSize: 10, color: W.text4, marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </S>

      {/* ── Team ───────────────────────────────────────────────── */}
      <S id="team" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 40%, ${W.violet}04 0%, transparent 55%)`,
        }} />
        <div style={{ ...wrap, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={labelStyle(W.violet)}>Team</div>
          <h2 style={sectionTitle}>Built from inside the Caldeira</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {TEAM.map(t => (
            <div key={t.name} style={card}>
              <div style={{ fontSize: 16, fontWeight: 600, color: W.text1, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: W.violet, fontWeight: 600, marginBottom: 12 }}>{t.role}</div>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </S>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 80%, ${W.violet}08 0%, transparent 50%)`,
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: 16 }}>See Vero in action</h2>
          <p style={{ ...bodyText, margin: '0 auto 36px', textAlign: 'center' }}>
            Explore the live dashboard, review the investor deck, or start a conversation.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{
              background: W.violet, color: '#fff', padding: '14px 28px', borderRadius: 8,
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              Open Platform
            </a>
            <a href="/pitch-deck" style={{
              border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent',
            }}>
              Investor Deck
            </a>
            <a href="mailto:contact@meteoric.tech" style={{
              border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px',
              borderRadius: 8, fontSize: 14, textDecoration: 'none', background: 'transparent',
            }}>
              Contact Us
            </a>
          </div>
        </div>
      </S>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 Meteoric Resources Ltd. All rights reserved. Demo environment mixes
          public-reference data, disclosure-aligned scenarios, and simulated time series.
        </p>
      </footer>
    </div>
  )
}
