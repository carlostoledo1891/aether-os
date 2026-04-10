import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { DeckShell, Terminal, StatCard, Bullet } from '../components/deck'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

/* ── Slide Types ─────────────────────────────────────────────────── */

interface SlideData {
  type: 'cover' | 'bullets' | 'stats' | 'code' | 'market' | 'cta'
  title: string
  subtitle?: string
  items?: string[]
}

const SLIDES: SlideData[] = [
  {
    type: 'cover',
    title: 'Vero',
    subtitle: 'The trust layer for critical operations',
  },
  {
    type: 'bullets',
    title: 'The Problem',
    items: [
      '70% of rare earth production flows through one country — zero downstream provenance visibility.',
      'US DoD faces 18–24 month procurement delays from incomplete FEOC documentation.',
      'EU Digital Product Passport enforcement begins Feb 2027 — no industry-standard tooling exists.',
      'Operators juggle spreadsheets across engineering, permitting, IR, and community. None survives diligence.',
    ],
  },
  {
    type: 'bullets',
    title: 'Three Truths, One Platform',
    items: [
      'Ground Truth — Real-time field operations, digital twins, and hydrology with explicit data provenance labels.',
      'Trade Truth — FEOC, IRA, and EU Digital Product Passport evidence with molecular-to-magnet batch traceability.',
      'Board Truth — Financial scenarios, risk register, capital tracker, and ESG — aligned to board and steerco rhythm.',
    ],
  },
  {
    type: 'stats',
    title: 'Platform at a Glance',
    subtitle: 'twin',
  },
  {
    type: 'code',
    title: 'Under the Hood',
  },
  {
    type: 'stats',
    title: 'Engineering Quality',
    subtitle: 'quality',
  },
  {
    type: 'market',
    title: 'Market Opportunity',
  },
  {
    type: 'bullets',
    title: 'Competitive Moat',
    items: [
      'Founder inside the project — 40 years of local context no outside team can replicate.',
      'Persona-validated at 9.4/10 — proven product-market fit methodology, not just feature claims.',
      'Three truths in one platform — no competitor covers field ops + compliance + executive in one stack.',
      '310 tests, production 3-process architecture, OpenAPI, SHA-256 audit chain — survives due diligence.',
      'JSON-driven public dashboards (Mini Engine) — configurable views no competitor even attempts.',
    ],
  },
  {
    type: 'stats',
    title: 'Traction',
    subtitle: 'traction',
  },
  {
    type: 'bullets',
    title: 'The Team',
    items: [
      'Carlos Toledo — Founder. Air Force pilot, full-stack engineer, product designer. Built the entire platform solo — 310 tests, enterprise security, 27 AI tools.',
      'Dr. Heber Caponi — Chief Scientific Officer. Decades of active field research. Bridges simulated to field-verified data.',
      'Ready to scale — codebase architected for immediate team onboarding.',
    ],
  },
  {
    type: 'cta',
    title: 'Valuation & Ask',
    items: [
      'Pre-revenue consensus: $5–7 M pre-money.',
      '2030 ARR projection: $4.5 M (consensus) · $13 M (bull).',
      'Implied 2030 EV: $55–90 M (consensus) · $130–200 M (bull).',
      'Seed to: hire commercial lead, onboard 5 pilots, connect field instruments.',
    ],
  },
]

const TWIN_STATS = [
  { value: '17', label: 'Equipment', sub: 'Metso · Andritz · GEA · Outotec' },
  { value: '28', label: 'Sensors', sub: 'Mapped to live telemetry' },
  { value: '27', label: 'AI Tools', sub: 'Domain-grounded agents' },
  { value: '14', label: 'Overlays', sub: 'Map visualization layers' },
]

const QUALITY_STATS = [
  { value: '310', label: 'Tests', sub: '260 frontend + 50 server' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'CSP', label: 'Headers', sub: 'Content Security Policy' },
  { value: '120', label: 'Rate Limit', sub: 'Requests per minute' },
]

const TRACTION_STATS = [
  { value: '9.4', label: 'Persona Score', sub: '/10 weighted avg' },
  { value: '5 / 9', label: 'At Ceiling', sub: 'Personas at 10.0' },
  { value: '310', label: 'Tests', sub: 'Across 3 packages' },
  { value: 'SHA-256', label: 'Audit Chain', sub: 'Cryptographic' },
]

const MARKET_TIERS = [
  { tier: 'TAM', value: '$18.8 B → $31.9 B', desc: 'Digital mining & smart mining', cagr: '11.2%', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical minerals compliance SaaS', cagr: '14.2%', pct: 52 },
  { tier: 'SOM', value: '$15 M → $45 M', desc: '15 REE projects × $102k / yr', cagr: '—', pct: 15 },
]

/* ── Component ───────────────────────────────────────────────────── */

export default function PitchDeck() {
  return (
    <DeckShell count={SLIDES.length} padding="56px 72px">
      {(idx) => {
        const slide = SLIDES[idx]
        const statsForSlide = slide.subtitle === 'traction' ? TRACTION_STATS
          : slide.subtitle === 'quality' ? QUALITY_STATS
          : TWIN_STATS

        return (<>
          {/* ── Cover ──────────────────────────────────────────── */}
          {slide.type === 'cover' && (<>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
              style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32 }}>V</motion.div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 20 }}>Operational Intelligence Platform</div>
            <h1 style={{ fontSize: 'clamp(56px, 9vw, 96px)', fontWeight: 800, lineHeight: 1.0, marginBottom: 24, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: W.text3, maxWidth: 560, lineHeight: 1.5, marginBottom: 40 }}>{slide.subtitle}</p>
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[{ v: '9.4', l: 'Persona Score' }, { v: '310', l: 'Tests' }, { v: '27', l: 'AI Tools' }, { v: 'SHA-256', l: 'Audit Chain' }].map((s, i) => (
                <div key={s.l} style={{ textAlign: 'center', padding: '0 28px', borderLeft: i > 0 ? `1px solid ${W.glass08}` : 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: W.text4, marginTop: 3, letterSpacing: '0.04em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── Bullets ────────────────────────────────────────── */}
          {slide.type === 'bullets' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>{slide.title}</h2>
            <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {slide.items?.map((line, i) => <Bullet key={i}>{line}</Bullet>)}
            </div>
          </>)}

          {/* ── Stats ──────────────────────────────────────────── */}
          {slide.type === 'stats' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 48 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statsForSlide.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
              {statsForSlide.map(s => <StatCard key={s.label} {...s} />)}
            </div>
          </>)}

          {/* ── Code ────────────────────────────────────────────── */}
          {slide.type === 'code' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, maxWidth: 960, width: '100%' }}>
              <Terminal title="api/telemetry/current">
                <span style={{ color: W.text4 }}>{'// Real-time sensor data'}</span><br />
                {'{ '}<span style={{ color: W.green }}>"channel"</span>{': '}<span style={{ color: W.green }}>"ph_meter"</span>{','}<br />
                {'  '}<span style={{ color: W.green }}>"value"</span>{': '}<span style={{ color: W.cyan }}>2.41</span>{','}<br />
                {'  '}<span style={{ color: W.green }}>"unit"</span>{': '}<span style={{ color: W.green }}>"pH"</span>{','}<br />
                {'  '}<span style={{ color: W.green }}>"source"</span>{': '}<span style={{ color: W.green }}>"sim_engine"</span>{' }'}
              </Terminal>
              <Terminal title="server/src/index.ts">
                <span style={{ color: W.text4 }}>{'// Enterprise security'}</span><br />
                <span style={{ color: V }}>app</span>{'.register(rateLimit, {'}<br />
                {'  max: '}<span style={{ color: W.cyan }}>120</span>{','}<br />
                {'  timeWindow: '}<span style={{ color: W.green }}>'1 minute'</span><br />
                {'})'}<br />
                <span style={{ color: W.text4 }}>{'// CSP + CORS + fail-closed'}</span>
              </Terminal>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Fastify API ⚡', 'Sim Engine 🔄', 'React 19 🖥', 'SQLite 🗄', '27 AI Tools 🤖'].map((n, i) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <div style={{ width: 16, height: 1, background: W.glass12 }} />}
                  <div style={{ background: W.glass04, border: `1px solid ${W.glass08}`, borderRadius: 8, padding: '5px 12px', fontSize: 10, color: W.text2 }}>{n}</div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── Market ──────────────────────────────────────────── */}
          {slide.type === 'market' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 48 }}>{slide.title}</h2>
            <div style={{ maxWidth: 860, width: '100%' }}>
              {MARKET_TIERS.map(m => (
                <div key={m.tier} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{m.tier}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value}</span>
                  </div>
                  <div style={{ height: 6, background: W.glass04, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 1.2, ease }}
                      style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
                  </div>
                  <div style={{ fontSize: 11, color: W.text4, marginTop: 6, textAlign: 'left' }}>
                    {m.desc}{m.cagr !== '—' ? ` · ${m.cagr} CAGR` : ''}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── CTA ────────────────────────────────────────────── */}
          {slide.type === 'cta' && (<>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 40, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h2>
            <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 40 }}>
              {slide.items?.map((line, i) => <p key={i} style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: W.text2, lineHeight: 1.6, margin: 0 }}>{line}</p>)}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
              <a href="/lp" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Website</a>
              <a href="mailto:contact@meteoric.tech" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', background: 'transparent' }}>contact@meteoric.tech</a>
            </div>
          </>)}
        </>)
      }}
    </DeckShell>
  )
}
