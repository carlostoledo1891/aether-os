import { useEffect } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { DeckShell, Terminal, StatCard, Bullet, GlassRow, Tag, Kw, Str, Num, Cmt, Fn } from '../components/deck'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

/* ── Slide Data ───────────────────────────────────────────────────── */

type SlideType = 'disclaimer' | 'cover' | 'problem' | 'market' | 'regulatory' | 'platform' |
  'caldeira' | 'architecture' | 'codeQuality' | 'dataService' | 'aiAgent' |
  'digitalTwin' | 'lapoc' | 'reports' | 'personas' | 'moat' | 'revenue' | 'valuation' |
  'risk' | 'exit' | 'team' | 'whyYou' | 'whyINeedYou' | 'ask' | 'mondayPlay' | 'whyBeforeMonday' | 'timeline' | 'close'

interface SlideData { type: SlideType; title: string }

const SLIDES: SlideData[] = [
  { type: 'disclaimer', title: 'Before We Begin' },
  { type: 'cover', title: 'Vero' },
  { type: 'problem', title: 'The Problem' },
  { type: 'market', title: 'The Market' },
  { type: 'regulatory', title: 'Regulation Creates the Market' },
  { type: 'platform', title: 'Three Truths, One Platform' },
  { type: 'caldeira', title: 'The Caldeira Showcase' },
  { type: 'architecture', title: 'Architecture Deep Dive' },
  { type: 'codeQuality', title: 'Code Quality — The Numbers' },
  { type: 'dataService', title: 'Data Service Architecture' },
  { type: 'aiAgent', title: 'AI Agent — 27 Domain Tools' },
  { type: 'digitalTwin', title: 'Pilot Plant Digital Twin' },
  { type: 'lapoc', title: 'LAPOC Pipeline — Simulated → Verified' },
  { type: 'reports', title: 'Interactive Report Templates' },
  { type: 'personas', title: 'Persona-Driven Development' },
  { type: 'moat', title: 'Competitive Moat' },
  { type: 'revenue', title: 'Revenue Model & Unit Economics' },
  { type: 'valuation', title: 'Valuation' },
  { type: 'risk', title: 'Risks & Mitigations' },
  { type: 'exit', title: 'Exit Paths' },
  { type: 'team', title: 'The Team' },
  { type: 'whyYou', title: 'Why You?' },
  { type: 'whyINeedYou', title: 'Why I Need You' },
  { type: 'ask', title: 'The Ask' },
  { type: 'mondayPlay', title: 'The Monday Play' },
  { type: 'whyBeforeMonday', title: 'Why Before Monday' },
  { type: 'timeline', title: 'What Happens Next' },
  { type: 'close', title: 'The product is better than the pitch.' },
]

const MARKET_TIERS = [
  { tier: 'TAM', value: '$18.8 B → $31.9 B', desc: 'Digital Mining & Smart Mining Technology', cagr: '11.2%', src: 'Mordor Intelligence + Grand View Research', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$15 M → $45 M', desc: '15 REE projects × $102k avg ACV', cagr: 'Bottom-up', src: 'Internal analysis — ASX/TSX project database', pct: 15 },
]

/* ── Component ────────────────────────────────────────────────────── */

export default function FoundersDeck() {
  useEffect(() => {
    if (import.meta.env.DEV || window.location.pathname === '/founders-deck') {
      console.log(
        '%c\u{1F44B} Hey Juliano %c\n\n' +
        'You opened DevTools. We expected that.\n\n' +
        '310 tests \u00B7 0 errors \u00B7 TypeScript strict\n' +
        '107 design tokens \u00B7 MaybeAsync<T> \u00B7 3 processes\n\n' +
        'The codebase is ready for a second pair of hands.\n' +
        'HANDOFF.md has 2,500 lines waiting for you.\n\n' +
        '%cgit clone \u2192 npm i \u2192 npm run dev:all%c\n',
        'font-size:18px;font-weight:bold;color:#7C5CFC;',
        'font-size:12px;color:#ECECF8;',
        'font-size:11px;font-family:monospace;color:#00D4C8;background:#0D0D1C;padding:4px 8px;border-radius:4px;',
        ''
      )
    }
  }, [])

  return (
    <DeckShell count={SLIDES.length} padding="48px 56px">
      {(idx) => {
        const slide = SLIDES[idx]

        return (<>
          {/* ── 0. Disclaimer ─────────────────────────────────── */}
          {slide.type === 'disclaimer' && (<>
            <div style={{ maxWidth: 740, textAlign: 'center' }}>
              <div style={{ width: 40, height: 2, background: V, margin: '0 auto 28px', opacity: 0.6 }} />
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24, color: W.text2 }}>Before We Begin</h2>
              <p style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', color: W.text3, lineHeight: 1.75, marginBottom: 20 }}>
                This demo mixes <strong style={{ color: W.text1 }}>public-reference data</strong>, disclosure-aligned scenarios,
                and <strong style={{ color: W.text1 }}>simulated time series</strong>. Nothing is an attestation.
                The data honesty banner is always visible.
              </p>
              <p style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', color: W.text3, lineHeight: 1.75, marginBottom: 28 }}>
                We show honest limits before flashy features — because that's how trust is built.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tag color={W.amber}>Public Reference Data</Tag>
                <Tag color={W.green}>Disclosure-Aligned Scenarios</Tag>
                <Tag>Simulated Time Series</Tag>
              </div>
            </div>
          </>)}

          {/* ── 1. Cover ───────────────────────────────────────── */}
          {slide.type === 'cover' && (<>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
              style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Verified Origin · Trusted Supply</div>
            <h1 style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vero
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 560, lineHeight: 1.5, marginBottom: 36 }}>
              The trust layer for critical mineral supply chains.
            </p>
            <GlassRow items={[
              { label: 'Persona Score', value: '9.4/10' },
              { label: 'Tests', value: '310' },
              { label: 'AI Tools', value: '27' },
              { label: 'Overlays', value: '14' },
              { label: 'Equipment', value: '17' },
            ]} />
            <div style={{ marginTop: 20, fontSize: 10, color: W.text4, letterSpacing: '0.04em' }}>
              Solo founder · TypeScript strict · Zero compilation errors · Production architecture
            </div>
          </>)}

          {/* ── 2. Problem ──────────────────────────────────────── */}
          {slide.type === 'problem' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>{slide.title}</h2>
            <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Bullet>China controls 70% of global rare earth production — zero downstream provenance visibility.</Bullet>
              <Bullet>US DoD faces 18–24 month procurement delays from incomplete FEOC documentation.</Bullet>
              <Bullet accent={W.amber}>EU Digital Product Passport enforcement begins <strong style={{ color: W.text1 }}>February 2027</strong> — no industry-standard tooling exists.</Bullet>
              <Bullet>Operators juggle contradictory spreadsheets across engineering, permitting, IR, and community. None survives diligence.</Bullet>
              <Bullet>Meteoric Resources (ASX: MEI) — <strong style={{ color: W.text1 }}>$443M CAPEX, $821M NPV</strong> — has no unified governance layer.</Bullet>
            </div>
          </>)}

          {/* ── 3. Market ─────────────────────────────────────── */}
          {slide.type === 'market' && (<>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><Tag>Sourced TAM/SAM/SOM</Tag></div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>{slide.title}</h2>
            <div style={{ maxWidth: 860, width: '100%' }}>
              {MARKET_TIERS.map(m => (
                <div key={m.tier} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{m.tier}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value}</span>
                  </div>
                  <div style={{ height: 6, background: W.glass04, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 1.2, ease }}
                      style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: W.text3 }}>{m.desc}{m.cagr !== 'Bottom-up' ? ` · ${m.cagr} CAGR` : ''}</span>
                    <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>{m.src}</span>
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 4. Regulatory Catalyst ──────────────────────────── */}
          {slide.type === 'regulatory' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Regulation Creates Market</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, maxWidth: 880, width: '100%' }}>
              {[
                { driver: 'EU Digital Product Passport', date: 'Feb 2027', status: '22 / 37 CEN/CENELEC fields mapped', color: V },
                { driver: 'US FEOC / IRA Compliance', date: 'Active now', status: 'FEOC 0.00% · SHA-256 audit chain', color: V },
                { driver: 'Australian ESG Reporting', date: '2025+', status: '5 frameworks · 62-92% coverage', color: V },
              ].map(r => (
                <div key={r.driver} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{r.driver}</div>
                  <div style={{ fontSize: 11, color: r.color, fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{r.status}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, maxWidth: 720 }}>
              <Bullet accent={W.amber}>Pix created the fintech explosion because <strong style={{ color: W.text1 }}>regulation created the market</strong>. EU DPP does the same for mineral compliance.</Bullet>
              <div style={{ height: 8 }} />
              <Bullet>Vero is 59% DPP-ready. No competitor has 20%. Enforcement is in 10 months.</Bullet>
            </div>
          </>)}

          {/* ── 5. Platform ────────────────────────────────────── */}
          {slide.type === 'platform' && (<>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 940, width: '100%' }}>
              {[
                { view: 'Ground Truth', who: 'Geologists · Operators', what: '3D terrain, drill collars, pilot plant digital twin, hydro monitoring, 1,092 springs', icon: '\u{1F5FA}\uFE0F', accent: V },
                { view: 'Trade Truth', who: 'Buyers · Auditors · DoD', what: 'FEOC tracking, DPP export, SHA-256 audit chain, molecular-to-magnet traceability', icon: '\u{1F517}', accent: V },
                { view: 'Board Truth', who: 'Board · Investors · ECAs', what: 'Financial scenarios, risk register, capital tracker, ESG frameworks, stakeholders', icon: '\u{1F4CA}', accent: V },
              ].map(v => (
                <div key={v.view} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: v.accent, marginBottom: 4 }}>{v.view}</div>
                  <div style={{ fontSize: 10, color: W.text4, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.who}</div>
                  <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 6. Caldeira Showcase ───────────────────────────── */}
          {slide.type === 'caldeira' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>{slide.title}</h2>
            <p style={{ fontSize: 13, color: W.text3, marginBottom: 32, maxWidth: 500 }}>Meteoric Resources (ASX: MEI) — Caldeira Project, Poços de Caldas, MG, Brazil</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, maxWidth: 940, width: '100%' }}>
              {[
                { v: '$821M', l: 'NPV Pre-Tax', s: 'Consensus' }, { v: '$443M', l: 'CAPEX', s: 'Total' },
                { v: '$315M', l: 'Annual Revenue', s: 'Consensus' }, { v: '28%', l: 'IRR Pre-Tax', s: 'Consensus' },
                { v: '1.54 Bt', l: 'Global Resource', s: 'JORC 2012' }, { v: '20 yrs', l: 'Mine Life', s: 'LOM' },
              ].map(s => <StatCard key={s.l} value={s.v} label={s.l} sub={s.s} />)}
            </div>
            <div style={{ marginTop: 20, background: `${V}12`, border: `1px solid ${V}30`, borderRadius: 12, padding: '14px 24px', maxWidth: 500 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>0.03%</div>
              <div style={{ fontSize: 12, color: W.text2, marginTop: 4 }}>Vero costs $102k/yr — <strong style={{ color: W.text1 }}>0.03% of Caldeira's annual revenue</strong>. Less than one day of interest on the construction loan.</div>
            </div>
          </>)}

          {/* ── 7. Architecture ─────────────────────────────────── */}
          {slide.type === 'architecture' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Architecture</Tag></div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>{slide.title}</h2>
            <svg viewBox="0 0 880 340" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
              <defs>
                <marker id="arrowV" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
                <marker id="arrowT4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={W.text4} /></marker>
              </defs>
              {/* Trust boundary */}
              <rect x="118" y="20" width="520" height="300" rx="16" fill="none" stroke={`${V}20`} strokeWidth="1" strokeDasharray="6 4" />
              <text x="130" y="42" fill={`${V}40`} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.06em">INTERNAL TRUST ZONE</text>

              {/* Engine box */}
              <rect x="140" y="80" width="160" height="72" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="220" y="106" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">aether-engine</text>
              <text x="220" y="122" textAnchor="middle" fill={W.text3} fontSize="10">Simulation Bot</text>
              <text x="220" y="138" textAnchor="middle" fill={W.text4} fontSize="9">Node.js · 2s tick cycle</text>

              {/* API box */}
              <rect x="380" y="80" width="160" height="72" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="460" y="106" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">aether-api</text>
              <text x="460" y="122" textAnchor="middle" fill={W.text3} fontSize="10">Fastify + SQLite</text>
              <text x="460" y="138" textAnchor="middle" fill={W.text4} fontSize="9">REST · WS · 40+ endpoints</text>

              {/* Engine → API arrow */}
              <line x1="300" y1="116" x2="376" y2="116" stroke={V} strokeWidth="1.2" markerEnd="url(#arrowV)" />
              <text x="338" y="110" textAnchor="middle" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">POST /ingest</text>

              {/* SQLite */}
              <rect x="390" y="188" width="140" height="44" rx="8" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
              <text x="460" y="212" textAnchor="middle" fill={W.text3} fontSize="10" fontFamily="var(--font-mono)">SQLite + TTL Cache</text>
              <text x="460" y="224" textAnchor="middle" fill={W.text4} fontSize="8">Ring buffer · WAL mode</text>
              <line x1="460" y1="152" x2="460" y2="184" stroke={`${V}40`} strokeWidth="1" strokeDasharray="3 2" />

              {/* External enrichers */}
              {[
                { label: 'Open-Meteo', y: 72 },
                { label: 'BCB PTAX', y: 96 },
                { label: 'USGS', y: 120 },
                { label: 'Alpha Vantage', y: 144 },
              ].map(e => (
                <g key={e.label}>
                  <text x="22" y={e.y + 4} fill={W.text4} fontSize="9" fontFamily="var(--font-mono)">{e.label}</text>
                  <line x1="108" y1={e.y} x2="136" y2={e.y} stroke={W.text4} strokeWidth="0.8" strokeDasharray="3 2" markerEnd="url(#arrowT4)" />
                </g>
              ))}

              {/* Frontend box — outside trust zone */}
              <rect x="660" y="80" width="180" height="72" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="750" y="106" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">Vite Frontend</text>
              <text x="750" y="122" textAnchor="middle" fill={W.text3} fontSize="10">React 19 · MapLibre</text>
              <text x="750" y="138" textAnchor="middle" fill={W.text4} fontSize="9">Motion · Recharts · 14 overlays</text>

              {/* API → Frontend */}
              <line x1="540" y1="104" x2="656" y2="104" stroke={V} strokeWidth="1.2" markerEnd="url(#arrowV)" />
              <text x="598" y="98" textAnchor="middle" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">fetch + WS</text>

              {/* Security badges */}
              {['CSP', 'CORS', 'Rate Limit', 'Fail-closed'].map((s, i) => (
                <g key={s}>
                  <rect x={160 + i * 115} y="268" width={100} height="24" rx="6" fill={`${V}10`} stroke={`${V}20`} strokeWidth="0.8" />
                  <text x={210 + i * 115} y="284" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">{s}</text>
                </g>
              ))}

              {/* LAPOC / Meteoric labels (external) */}
              <text x="750" y="176" textAnchor="middle" fill={W.text4} fontSize="9" fontFamily="var(--font-mono)">LAPOC · Meteoric · Prefeitura</text>
              <line x1="750" y1="152" x2="750" y2="166" stroke={`${V}30`} strokeWidth="0.8" strokeDasharray="3 2" />
            </svg>
          </>)}

          {/* ── 8. Code Quality ────────────────────────────────── */}
          {slide.type === 'codeQuality' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Engineering</Tag></div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 880, width: '100%', marginBottom: 20 }}>
              <StatCard value="310" label="Tests" sub="260 frontend + 50 server" accent={W.green} />
              <StatCard value="0" label="TS Errors" sub="Strict mode" />
              <StatCard value="135+" label="TS Files" sub="3 packages" />
              <StatCard value="2,500+" label="HANDOFF.md" sub="Lines of documentation" />
            </div>
            <Terminal title="src/app/canvas/canvasTheme.ts — Design Token System (107 tokens)">
              <Kw>export const</Kw> <Fn>W</Fn> = {'{'}<br />
              {'  '}bg: <Str>'#07070E'</Str>, canvas: <Str>'#060610'</Str>,<br />
              {'  '}panel: <Str>'#0D0D1C'</Str>, surface: <Str>'#121228'</Str>,<br />
              {'  '}violet: <Str>'#7C5CFC'</Str>, <Cmt>{'// primary accent'}</Cmt><br />
              {'  '}cyan: <Str>'#00D4C8'</Str>, <Cmt>{'// hydrology domain'}</Cmt><br />
              {'  '}green: <Str>'#22D68A'</Str>, <Cmt>{'// compliance / success'}</Cmt><br />
              {'  '}amber: <Str>'#F5A623'</Str>, <Cmt>{'// warning'}</Cmt><br />
              {'  '}red: <Str>'#FF4D4D'</Str>, <Cmt>{'// critical'}</Cmt><br />
              {'  '}text1: <Str>'#ECECF8'</Str>, <Cmt>{'// WCAG AAA ≥7:1'}</Cmt><br />
              {'  '}radius: {'{ '}xs: <Num>4</Num>, sm: <Num>7</Num>, md: <Num>10</Num>, lg: <Num>14</Num>{' }'},<br />
              {'}'} <Kw>as const</Kw>
            </Terminal>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['React.memo × 14 overlays', 'Lazy-loaded views', 'ErrorBoundary on every route', 'CI: lint + test + build', 'Docker Compose deploy'].map(n => (
                <div key={n} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 8, padding: '5px 12px', fontSize: 10, color: W.text2 }}>{n}</div>
              ))}
            </div>
          </>)}

          {/* ── 9. Data Service Architecture ────────────────────── */}
          {slide.type === 'dataService' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Service Layer</Tag></div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>{slide.title}</h2>
            <svg viewBox="0 0 820 280" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
              <defs>
                <marker id="dsArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
              </defs>
              {/* Views layer */}
              <rect x="20" y="20" width="160" height="56" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="100" y="44" textAnchor="middle" fill={V} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">React Views</text>
              <text x="100" y="60" textAnchor="middle" fill={W.text4} fontSize="9">FieldView · ExecView · Buyer</text>

              {/* useServiceQuery */}
              <rect x="240" y="20" width="160" height="56" rx="10" fill={`${V}10`} stroke={`${V}30`} strokeWidth="1" />
              <text x="320" y="44" textAnchor="middle" fill={V} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">useServiceQuery</text>
              <text x="320" y="60" textAnchor="middle" fill={W.text4} fontSize="9">Hook · dedup cache</text>
              <line x1="180" y1="48" x2="236" y2="48" stroke={V} strokeWidth="1" markerEnd="url(#dsArrow)" />

              {/* AetherDataService interface */}
              <rect x="270" y="110" width="220" height="52" rx="10" fill={W.glass04} stroke={V} strokeWidth="1.5" />
              <text x="380" y="132" textAnchor="middle" fill={W.text1} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">AetherDataService</text>
              <text x="380" y="148" textAnchor="middle" fill={W.text4} fontSize="9">MaybeAsync{'<T>'} · 40+ methods</text>
              <line x1="320" y1="76" x2="360" y2="106" stroke={`${V}50`} strokeWidth="1" strokeDasharray="4 2" />

              {/* MockDataService */}
              <rect x="120" y="200" width="180" height="52" rx="10" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
              <text x="210" y="222" textAnchor="middle" fill={W.text3} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">MockDataService</text>
              <text x="210" y="238" textAnchor="middle" fill={W.text4} fontSize="9">Returns T · in-memory</text>
              <line x1="320" y1="162" x2="260" y2="196" stroke={`${V}40`} strokeWidth="1" strokeDasharray="4 2" />
              <text x="270" y="178" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">implements</text>

              {/* LiveDataService */}
              <rect x="460" y="200" width="180" height="52" rx="10" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
              <text x="550" y="222" textAnchor="middle" fill={W.text3} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">LiveDataService</text>
              <text x="550" y="238" textAnchor="middle" fill={W.text4} fontSize="9">{'Promise<T>'} · fetch + WS</text>
              <line x1="440" y1="162" x2="500" y2="196" stroke={`${V}40`} strokeWidth="1" strokeDasharray="4 2" />
              <text x="490" y="178" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">implements</text>

              {/* REST / WS targets */}
              <rect x="700" y="190" width="100" height="28" rx="6" fill={`${V}08`} stroke={`${V}15`} strokeWidth="0.8" />
              <text x="750" y="208" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">REST API</text>
              <rect x="700" y="228" width="100" height="28" rx="6" fill={`${V}08`} stroke={`${V}15`} strokeWidth="0.8" />
              <text x="750" y="246" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">WebSocket</text>
              <line x1="640" y1="218" x2="696" y2="206" stroke={V} strokeWidth="0.8" markerEnd="url(#dsArrow)" />
              <line x1="640" y1="228" x2="696" y2="240" stroke={V} strokeWidth="0.8" markerEnd="url(#dsArrow)" />

              {/* Zero changes label */}
              <rect x="250" y="262" width="260" height="16" rx="4" fill="none" />
              <text x="380" y="274" textAnchor="middle" fill={`${V}60`} fontSize="10" fontFamily="var(--font-mono)">Swap implementation → zero frontend changes</text>
            </svg>
          </>)}

          {/* ── 10. AI Agent ──────────────────────────────────── */}
          {slide.type === 'aiAgent' && (<>
            <div style={{ marginBottom: 16 }}><Tag>AI Architecture</Tag></div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>{slide.title}</h2>
            <svg viewBox="0 0 860 300" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
              <defs>
                <marker id="aiArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
              </defs>
              {/* User query */}
              <rect x="20" y="120" width="120" height="48" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="80" y="142" textAnchor="middle" fill={W.text2} fontSize="11" fontWeight="600">User Query</text>
              <text x="80" y="156" textAnchor="middle" fill={W.text4} fontSize="8">Natural language</text>

              {/* Hallucination fence */}
              <rect x="178" y="68" width="160" height="152" rx="12" fill="none" stroke={`${W.amber}30`} strokeWidth="1" strokeDasharray="5 3" />
              <text x="258" y="86" textAnchor="middle" fill={`${W.amber}60`} fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.05em">HALLUCINATION FENCE</text>

              {/* Gemini Gateway */}
              <rect x="198" y="104" width="120" height="44" rx="8" fill={`${V}10`} stroke={`${V}30`} strokeWidth="1" />
              <text x="258" y="124" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">Gemini 2.5</text>
              <text x="258" y="138" textAnchor="middle" fill={W.text4} fontSize="8">streamText() · AI SDK</text>
              <line x1="140" y1="144" x2="194" y2="128" stroke={V} strokeWidth="1" markerEnd="url(#aiArrow)" />

              {/* 10 honesty rules */}
              <rect x="198" y="160" width="120" height="36" rx="6" fill={W.glass04} stroke={`${V}15`} strokeWidth="0.8" />
              <text x="258" y="178" textAnchor="middle" fill={W.text3} fontSize="9" fontFamily="var(--font-mono)">10 honesty rules</text>
              <text x="258" y="190" textAnchor="middle" fill={W.text4} fontSize="7">System prompt guardrails</text>

              {/* Tool Router */}
              <rect x="400" y="104" width="120" height="44" rx="8" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
              <text x="460" y="124" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">Tool Router</text>
              <text x="460" y="138" textAnchor="middle" fill={W.text4} fontSize="8">27 domain tools</text>
              <line x1="318" y1="126" x2="396" y2="126" stroke={V} strokeWidth="1" markerEnd="url(#aiArrow)" />

              {/* Domain tool categories */}
              {[
                { label: 'Geology', y: 28 },
                { label: 'Financial', y: 68 },
                { label: 'Compliance', y: 108 },
                { label: 'Operations', y: 148 },
                { label: 'Environmental', y: 188 },
                { label: 'Market', y: 228 },
              ].map((t, i) => (
                <g key={t.label}>
                  <rect x="580" y={t.y} width="110" height="28" rx="6" fill={W.glass04} stroke={`${V}15`} strokeWidth="0.8" />
                  <text x="635" y={t.y + 18} textAnchor="middle" fill={W.text2} fontSize="9" fontFamily="var(--font-mono)">{t.label}</text>
                  <line x1="520" y1="126" x2="576" y2={t.y + 14} stroke={`${V}25`} strokeWidth="0.8" />
                </g>
              ))}

              {/* Provenance output */}
              <rect x="720" y="104" width="120" height="44" rx="8" fill={`${V}08`} stroke={`${V}20`} strokeWidth="0.8" />
              <text x="780" y="122" textAnchor="middle" fill={V} fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">Provenance</text>
              <text x="780" y="136" textAnchor="middle" fill={W.text4} fontSize="8">Source on every response</text>
              {[28, 68, 108, 148, 188, 228].map(y => (
                <line key={y} x1="690" y1={y + 14} x2="716" y2={120} stroke={`${V}15`} strokeWidth="0.6" />
              ))}

              {/* Test suite badge */}
              <rect x="178" y="256" width="160" height="24" rx="6" fill={`${W.amber}10`} stroke={`${W.amber}20`} strokeWidth="0.8" />
              <text x="258" y="272" textAnchor="middle" fill={W.amber} fontSize="9" fontFamily="var(--font-mono)">10 hallucination tests · 100%</text>
            </svg>
          </>)}

          {/* ── 11. Digital Twin ────────────────────────────────── */}
          {slide.type === 'digitalTwin' && (<>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>{slide.title}</h2>
            <p style={{ fontSize: 12, color: W.text3, marginBottom: 20, maxWidth: 600 }}>Interactive Control Room — 17 equipment, 28 sensors, 7 process steps, animated SVG flow</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 16 }}>
              {[
                { v: '17', l: 'Equipment', s: 'Metso · Andritz · GEA · Outotec' },
                { v: '28', l: 'Sensors', s: 'Mapped to telemetry channels' },
                { v: '7', l: 'Process Steps', s: 'AMSUL ion-exchange' },
                { v: '15', l: 'Flow Paths', s: 'Animated SVG connections' },
              ].map(s => <StatCard key={s.l} value={s.v} label={s.l} sub={s.s} />)}
            </div>
            <svg viewBox="0 0 800 120" style={{ maxWidth: 860, width: '100%' }}>
              <defs>
                <marker id="flowA" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d={`M0,0 L6,2.5 L0,5`} fill={V} /></marker>
              </defs>
              {[
                { label: 'ROM Pad', sub: 'Crushing', x: 20 },
                { label: 'Leach', sub: 'H₂SO₄', x: 180 },
                { label: 'SX Circuit', sub: 'Separation', x: 340 },
                { label: 'Precipitation', sub: 'AMSUL', x: 500 },
                { label: 'Product', sub: 'REO Conc.', x: 660 },
              ].map((n, i) => (
                <g key={n.label}>
                  <rect x={n.x} y="30" width="120" height="56" rx="8" fill={W.glass04} stroke={`${V}25`} strokeWidth="1" />
                  <text x={n.x + 60} y="54" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{n.label}</text>
                  <text x={n.x + 60} y="70" textAnchor="middle" fill={W.text4} fontSize="8">{n.sub}</text>
                  {/* Sensor dots */}
                  <circle cx={n.x + 40} cy="92" r="3" fill={`${W.green}80`} />
                  <circle cx={n.x + 60} cy="92" r="3" fill={`${W.green}80`} />
                  <circle cx={n.x + 80} cy="92" r="3" fill={`${W.green}80`} />
                  <text x={n.x + 60} y="108" textAnchor="middle" fill={W.text4} fontSize="7">{3 + i} sensors</text>
                  {i < 4 && <line x1={n.x + 120} y1="58" x2={n.x + 176} y2="58" stroke={V} strokeWidth="1" markerEnd="url(#flowA)" strokeDasharray="4 2" />}
                </g>
              ))}
              <text x="400" y="18" textAnchor="middle" fill={`${V}40`} fontSize="9" fontFamily="var(--font-mono)">Simplified AMSUL process — live version has 17 equipment + 15 animated flow paths</text>
            </svg>
          </>)}

          {/* ── 12. LAPOC Pipeline (NEW) ──────────────────────── */}
          {slide.type === 'lapoc' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Science + Credential</Tag></div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 860, width: '100%', marginBottom: 20 }}>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: W.amber, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Before — Simulated</div>
                <div style={{ background: `${W.amber}15`, border: `1px solid ${W.amber}30`, borderRadius: 8, padding: '8px 12px', fontSize: 11, color: W.amber, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                  ⚠ SIMULATED · Reference Data Only
                </div>
                <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
                  Piezometer levels from models<br />Water quality from disclosure ranges<br />Geological data from public filings
                </div>
              </div>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: W.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>After — Field-Verified</div>
                <div style={{ background: `${W.green}15`, border: `1px solid ${W.green}30`, borderRadius: 8, padding: '8px 12px', fontSize: 11, color: W.green, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                  ✓ FIELD-VERIFIED · LAPOC Instruments
                </div>
                <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
                  Live piezometer readings<br />Real-time water quality sensors<br />Field-sampled geological data
                </div>
              </div>
            </div>
            <Terminal title="Zero frontend changes — the architecture handles it">
              <Cmt>{'// DataContext already supports the transition'}</Cmt><br />
              <Kw>telemetry</Kw>: <Str>'simulated'</Str> | <Str>'live'</Str><br /><br />
              <Cmt>{'// When LAPOC connects:'}</Cmt><br />
              <Fn>LiveDataService</Fn>.connect({'{'}<br />
              {'  '}piezometers: <Str>'lapoc/piezo/*'</Str>,<br />
              {'  '}waterQuality: <Str>'lapoc/wq/*'</Str>,<br />
              {'  '}geological: <Str>'lapoc/geo/*'</Str><br />
              {'}'})
            </Terminal>
            <div style={{ marginTop: 16, maxWidth: 600, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: W.text2 }}><strong style={{ color: V }}>Dr. Heber Caponi</strong> — Chief Scientific Officer. Decades of Caldeira research.</p>
              <p style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>LAPOC instruments are the first live data channel. The scientist who studied this deposit validates every field reading.</p>
            </div>
          </>)}

          {/* ── 13. Reports ────────────────────────────────────── */}
          {slide.type === 'reports' && (<>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>{slide.title}</h2>
            <p style={{ fontSize: 12, color: W.text3, marginBottom: 24, maxWidth: 500 }}>3 light-mode reports — PDF export via browser print — zero new dependencies</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
              {[
                { name: 'Environment', items: 'APA zones, water quality, springs, permitting timeline, community acceptance' },
                { name: 'Operations', items: 'NPV/IRR, CAPEX breakdown, C1/AISC costs, process flow, pilot plant data' },
                { name: 'Drill Tests', items: 'JORC table, grade distribution, RE recovery, lithology, Pilot vs ANSTO' },
              ].map(r => (
                <div key={r.name} style={{ background: 'rgba(250,250,253,0.05)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '18px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: V, marginBottom: 6 }}>{r.name}</div>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{r.items}</p>
                </div>
              ))}
            </div>
            <Terminal title="reportTheme.ts — WL (Light) palette mirrors W (Dark)">
              <Kw>export const</Kw> <Fn>WL</Fn> = {'{'}<br />
              {'  '}bg: <Str>'#FFFFFF'</Str>, panel: <Str>'#F5F5FA'</Str>,<br />
              {'  '}text1: <Str>'#1A1A2E'</Str>, violet: <Str>'#7C5CFC'</Str>,<br />
              {'  '}<Cmt>{'// Same structure — swap token, swap theme'}</Cmt><br />
              {'}'} <Kw>as const</Kw>
            </Terminal>
          </>)}

          {/* ── 14. Persona-Driven Dev ──────────────────────────── */}
          {slide.type === 'personas' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Product Methodology</Tag></div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>9.4</div>
                <div style={{ fontSize: 11, color: W.text4 }}>/ 10 weighted avg</div>
              </div>
              <div style={{ width: 1, height: 60, background: W.glass08 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, color: W.text2, lineHeight: 1.6 }}>9 stakeholders · 15 versions<br />v1: <span style={{ color: W.amber }}>6.8</span> → v15: <span style={{ color: W.green }}>9.4</span></div>
                <div style={{ fontSize: 11, color: W.text4, marginTop: 4 }}>6 of 9 at code ceiling (10.0)</div>
              </div>
            </div>
            <div style={{ maxWidth: 860, width: '100%' }}>
              {[
                { p: 'Chairman (Tunks)', s: '10.0', gap: 'Code ceiling' },
                { p: 'CEO (Gale)', s: '10.0', gap: 'Code ceiling' },
                { p: 'Chief Geologist', s: '10.0', gap: 'Code ceiling' },
                { p: 'PF Analyst (Bank)', s: '9.5', gap: 'Covenant monitoring' },
                { p: 'SCADA Integrator', s: '10.0', gap: 'Code ceiling' },
                { p: 'Journalist', s: '10.0', gap: 'Code ceiling' },
                { p: 'EU Enforcement', s: '8.5', gap: '100% DPP coverage' },
                { p: 'NGO (Water)', s: '8.5', gap: 'Field-verified springs' },
                { p: 'DoD (Pentagon)', s: '8.0', gap: 'FedRAMP certification' },
              ].map(p => (
                <div key={p.p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${W.glass06}` }}>
                  <span style={{ fontSize: 12, color: W.text2 }}>{p.p}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 10, color: W.text4 }}>{p.gap}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: parseFloat(p.s) >= 10 ? W.green : V, fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'right' }}>{p.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 15. Competitive Moat ──────────────────────────── */}
          {slide.type === 'moat' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Defensibility</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ maxWidth: 860, width: '100%' }}>
              {[
                { comp: 'Minviro', val: '~$15M (Series A 2023)', gap: 'LCA tooling — post-hoc analysis, not live monitoring' },
                { comp: 'Circulor', val: '~$60M (Series B 2022)', gap: 'Supply chain tracing — starts mid-chain, not at the source' },
                { comp: 'Everledger', val: '$100M+ peak → collapsed', gap: 'Blockchain-first — overclaimed, under-delivered. Cautionary tale.' },
                { comp: 'Generic ESG', val: 'Varies', gap: 'Reporting aggregators. None covers field + compliance + executive.' },
              ].map(c => (
                <div key={c.comp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: `1px solid ${W.glass06}`, textAlign: 'left' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>{c.comp}</div>
                    <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{c.val}</div>
                  </div>
                  <div style={{ flex: 2, fontSize: 12, color: W.text3, paddingLeft: 16 }}>{c.gap}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, maxWidth: 720 }}>
              <Bullet>Founder grew up inside the deposit — 40 years of local context. Irreplicable.</Bullet>
              <div style={{ height: 6 }} />
              <Bullet accent={W.green}>Honesty-first positioning — data honesty banner, Slide 0 disclaimer, "words to avoid" appendix. The Everledger defense.</Bullet>
            </div>
          </>)}

          {/* ── 16. Revenue Model ─────────────────────────────── */}
          {slide.type === 'revenue' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Unit Economics</Tag></div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
              {[
                { tier: 'Pilot', price: '$2,500/mo', annual: '$30k', target: 'PFS-stage juniors' },
                { tier: 'Growth', price: '$8,500/mo', annual: '$102k', target: 'DFS-to-construction' },
                { tier: 'Enterprise', price: 'Custom', annual: '$180-350k', target: 'Multi-asset operators' },
              ].map(t => (
                <div key={t.tier} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: V }}>{t.tier}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)', marginTop: 6 }}>{t.price}</div>
                  <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>{t.annual}/yr</div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 6 }}>{t.target}</div>
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 860, width: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: V, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>2030 Revenue Scenarios</div>
              {[
                { label: 'Bear — Slow Crawl', arr: '$1.4M', clients: '15', ev: '$15-25M' },
                { label: 'Consensus — Catalyzed', arr: '$4.5M', clients: '35', ev: '$55-90M' },
                { label: 'Bull — Category Creator', arr: '$13M', clients: '65', ev: '$130-200M' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${W.glass06}` }}>
                  <span style={{ fontSize: 12, color: W.text2 }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: W.text1, fontFamily: 'var(--font-mono)' }}>{s.arr} ARR</span>
                    <span style={{ fontSize: 11, color: W.text4 }}>{s.clients} clients</span>
                    <span style={{ fontSize: 12, color: V, fontFamily: 'var(--font-mono)' }}>EV {s.ev}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: W.text3 }}>
              Operating cost ~$2k/mo · Gross margin 95%+ · Zero price sensitivity at 0.03% of client revenue
            </div>
          </>)}

          {/* ── 17. Valuation ────────────────────────────────── */}
          {slide.type === 'valuation' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Valuation</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ maxWidth: 740, width: '100%', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: V, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scorecard Method — 83rd Percentile</div>
              {[
                { factor: 'Founder / Team', weight: '25%', score: '4.5' },
                { factor: 'Market Size', weight: '20%', score: '4.0' },
                { factor: 'Product / Technology', weight: '20%', score: '4.5' },
                { factor: 'Competitive Landscape', weight: '15%', score: '3.5' },
                { factor: 'Traction', weight: '10%', score: '3.5' },
                { factor: 'Regulatory Tailwind', weight: '10%', score: '4.5' },
              ].map(f => (
                <div key={f.factor} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${W.glass06}` }}>
                  <span style={{ fontSize: 12, color: W.text2 }}>{f.factor}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 11, color: W.text4, minWidth: 36, textAlign: 'right' }}>{f.weight}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: V, fontFamily: 'var(--font-mono)', minWidth: 24, textAlign: 'right' }}>{f.score}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}>
                <span style={{ fontSize: 13, color: W.text1 }}>Total Weighted</span>
                <span style={{ fontSize: 15, color: V, fontFamily: 'var(--font-mono)' }}>4.15 / 5.0</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 740, width: '100%' }}>
              <StatCard value="$3-4M" label="Bear" sub="No signed pilot" />
              <StatCard value="$5-7M" label="Consensus" sub="Named anchor + team" />
              <StatCard value="$8-12M" label="Bull" sub="Strategic interest" />
            </div>
          </>)}

          {/* ── 18. Risk/Mitigation (NEW) ──────────────────────── */}
          {slide.type === 'risk' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Risk Assessment</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ maxWidth: 880, width: '100%' }}>
              {[
                { risk: 'Solo founder risk', mitigation: 'HANDOFF.md (2,500 lines) + 107 design tokens + 310 tests = day-1 onboarding for any senior dev' },
                { risk: 'Zero revenue', mitigation: 'Monday Meteoric demo → pilot by June. Named anchor client, not cold pipeline.' },
                { risk: 'Single customer dependency', mitigation: '15 REE projects identified (ASX/TSX). OEM pipeline via ERP/ECA channels.' },
                { risk: 'EU DPP delay', mitigation: 'IRA/FEOC active now. Australian ESG 2025+. Regulatory diversification across 3 jurisdictions.' },
                { risk: 'NdPr price volatility', mitigation: '0.03% of client revenue. Price-insensitive tier — less than one day of CAPEX interest.' },
                { risk: 'Brazil jurisdiction', mitigation: 'Founder from inside the Caldeira. LAPOC partnership. Prefeitura relationship. 40 years of context.' },
              ].map(r => (
                <div key={r.risk} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 0', borderBottom: `1px solid ${W.glass06}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${V}80`, marginTop: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>{r.risk}</div>
                    <div style={{ fontSize: 11, color: W.text3, marginTop: 3, lineHeight: 1.5 }}>{r.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 19. Exit Paths (NEW) ──────────────────────────── */}
          {slide.type === 'exit' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Exit Strategy</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 900, width: '100%', marginBottom: 24 }}>
              {[
                { category: 'Mining Major', examples: 'BHP Digital, Rio Tinto, Glencore', thesis: 'Acqui-hire to digitize portfolio operations. Proven asset-level tooling.', ev: '$55-90M', accent: V },
                { category: 'ERP / SCM Vendor', examples: 'SAP, Oracle SCM, Palantir Mining', thesis: 'Compliance module bolt-on. EU DPP readiness accelerator for existing mining clients.', ev: '$90-200M', accent: V },
                { category: 'ECA / Dev Bank', examples: 'IFC, BNDES, Ex-Im Bank', thesis: 'Impact measurement platform. ESG verification for project finance portfolios.', ev: '$55-130M', accent: V },
              ].map(e => (
                <div key={e.category} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
                  <div style={{ width: 8, height: 2, background: e.accent, borderRadius: 1, marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: e.accent }}>{e.category}</div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{e.examples}</div>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '10px 0 12px' }}>{e.thesis}</p>
                  <div style={{ fontSize: 15, fontWeight: 800, color: e.accent, fontFamily: 'var(--font-mono)' }}>{e.ev}</div>
                  <div style={{ fontSize: 9, color: W.text4 }}>Implied EV at consensus ARR</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: W.text4 }}>3-5 year horizon · DFS → Construction → Production creates natural acquisition window</div>
          </>)}

          {/* ── 20. Team (UPDATED) ─────────────────────────────── */}
          {slide.type === 'team' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, maxWidth: 900, width: '100%' }}>
              {[
                { name: 'Carlos Toledo', role: 'Founder · Product & Tech', bg: 'Air Force pilot → Product Design → Full-stack dev. Born inside the Caldeira. 40 years of local context.', accent: V },
                { name: 'Dr. Heber Caponi', role: 'Chief Scientific Officer', bg: 'Decades of active field research on the Caldeira alkaline complex. Bridges simulated → field-verified. LAPOC instruments.', accent: V },
                { name: 'Full-Stack Dev', role: 'Engineering (activating)', bg: 'Codebase architected for immediate onboarding — HANDOFF.md, design tokens, test coverage, clean service boundaries.', accent: V },
                { name: 'Strategic Advisor', role: 'Open seat', bg: 'Operator experience + capital network. This role shapes GTM, pipeline, and commercial execution. The seat is open.', accent: W.amber },
              ].map(t => (
                <div key={t.name} style={{ background: W.glass04, border: `1px solid ${t.name === 'Strategic Advisor' ? `${W.amber}40` : W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
                  <div style={{ width: 8, height: 2, background: t.accent, borderRadius: 1, marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: t.accent, fontWeight: 600, marginBottom: 8 }}>{t.role}</div>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{t.bg}</p>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 21. Why You? ──────────────────────────────────── */}
          {slide.type === 'whyYou' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Advisory Board</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 900, width: '100%', marginBottom: 24 }}>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
                <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Juliano Dutra</div>
                <div style={{ fontSize: 10, color: V, fontWeight: 600, marginBottom: 12 }}>CTO Lens</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Gringo CTO. 20+ angel investments. Unicamp CS.</p>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a technical mentor for scaling from solo-founder architecture to a team. The dev hire reports to someone who has shipped at scale.</p>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>Code review authority. Architecture validation. Hiring bar.</p>
                </div>
              </div>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
                <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Guilherme Bonifácio</div>
                <div style={{ fontSize: 10, color: V, fontWeight: 600, marginBottom: 12 }}>Business Lens</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. 110+ angel investments. Kanoa Capital. FEA-USP Economics.</p>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a commercial execution partner. Pipeline, GTM, pricing validation. The commercial hire reports to someone who has built revenue engines.</p>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>Fundraising strategy. Term sheet structuring. Investor network.</p>
                </div>
              </div>
            </div>
            <div style={{ background: `${V}08`, border: `1px solid ${V}20`, borderRadius: 12, padding: '16px 24px', maxWidth: 700, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: W.text2, margin: 0, lineHeight: 1.6 }}>
                Not asking for time — asking for <strong style={{ color: W.text1 }}>leverage</strong>. Advisory board seat. Quarterly check-ins. The codebase is ready. The product is ready. The timing is now.
              </p>
            </div>
          </>)}

          {/* ── 22. Why I Need You ─────────────────────────────── */}
          {slide.type === 'whyINeedYou' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Focus Thesis</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 24, maxWidth: 900, width: '100%', marginBottom: 24 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What I need to focus on</div>
                {[
                  'Caldeira pilot — Meteoric demo, field integration, LAPOC instruments',
                  'Dev pipeline — new features, regulatory datasets, DPP compliance fields',
                  'Field work — geology, hydrology, plant commissioning, community dashboards',
                  'Science — Dr. Caponi coordination, instrument validation, data provenance',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: W.glass08, width: 1 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: W.text4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What I cannot do simultaneously</div>
                {[
                  'GTM strategy and commercial negotiations',
                  'Investor pipeline and fundraising execution',
                  'Pricing benchmarks and contract structuring',
                  'Board governance and advisory network',
                  'Market positioning against Minviro, Circulor, generic ESG',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${W.text4}60`, marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 800, width: '100%', marginBottom: 16 }}>
              {[
                { who: 'Carlos', lane: 'Product + Science + Field', detail: 'Builds the platform, runs the pilot, integrates LAPOC' },
                { who: 'Juliano', lane: 'Tech Mentorship', detail: 'Architecture review, hiring bar, scaling guidance' },
                { who: 'Guilherme', lane: 'Commercial Front', detail: 'GTM, investor pipeline, revenue strategy' },
              ].map(p => (
                <div key={p.who} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: V }}>{p.who}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: W.text1, marginTop: 4 }}>{p.lane}</div>
                  <div style={{ fontSize: 10, color: W.text3, marginTop: 4 }}>{p.detail}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: W.text4, maxWidth: 600 }}>
              Today I work with 2 US-based frontier AI companies. I see the regulations creating the market. The perfect storm is forming for rare earth minerals tech. Seed money lets me go 100% on Vero — you handle the front.
            </p>
          </>)}

          {/* ── 23. The Ask ─────────────────────────────────────── */}
          {slide.type === 'ask' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 28, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h2>
            <GlassRow items={[{ label: 'Target', value: '$500k-1M' }, { label: 'Pre-Money', value: '$5-7M' }, { label: 'Runway', value: '18 months' }]} />
            <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24, marginBottom: 12 }}>
              <Bullet>12 months Carlos full-time → product + stakeholder demos</Bullet>
              <Bullet>Senior dev hire (Month 1-2) → 2x shipping velocity</Bullet>
              <Bullet>Commercial hire (Month 2-3) → pipeline + pilot conversions</Bullet>
              <Bullet>Infra + AI tokens + conferences → $110k/yr</Bullet>
              <Bullet accent={W.green}>Target: 3 paying pilots by Month 6 · Seed round by Month 9</Bullet>
            </div>
          </>)}

          {/* ── 22. The Monday Play (NEW) ──────────────────────── */}
          {slide.type === 'mondayPlay' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Insider Timing</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <p style={{ fontSize: 13, color: W.text3, marginBottom: 24, maxWidth: 500 }}>Monday April 14 — Vero demos live to Meteoric Resources leadership.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
              {[
                { who: 'Nick Gale', role: 'CEO', needs: 'Execution credibility for capital raises. Digital twin is his demo-closer.', accent: V },
                { who: 'Dr. De Carvalho', role: 'Chief Geologist', needs: 'Defensible QP-grade data with JORC badges. Will test the AI agent.', accent: V },
                { who: 'Nick Tunks', role: 'Chairman', needs: 'One coherent field-to-filing story. Executive Overview is his slide.', accent: V },
              ].map(p => (
                <div key={p.who} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.accent }}>{p.who}</div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.role}</div>
                  <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '8px 0 0' }}>{p.needs}</p>
                </div>
              ))}
            </div>
            <GlassRow items={[{ label: 'The Ask', value: '$102k/yr' }, { label: 'Tier', value: 'Growth' }, { label: '% of Revenue', value: '0.03%' }, { label: 'Integration', value: '90 days' }]} />
          </>)}

          {/* ── 23. Why Before Monday (NEW) ──────────────────── */}
          {slide.type === 'whyBeforeMonday' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Timing Arbitrage</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 740, width: '100%', marginBottom: 24 }}>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Pre-Money Today</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>$5-7M</div>
                <div style={{ fontSize: 11, color: W.text3, marginTop: 6 }}>Pre-revenue consensus</div>
              </div>
              <div style={{ background: `${W.green}08`, border: `1px solid ${W.green}30`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: W.green, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Post-Pilot</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>$7M+</div>
                <div style={{ fontSize: 11, color: W.text3, marginTop: 6 }}>Traction factor jumps 3.5 → 4.5</div>
              </div>
            </div>
            <div style={{ background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 12, padding: '18px 24px', maxWidth: 540, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>~$2M</div>
              <div style={{ fontSize: 13, color: W.text2, marginTop: 6 }}>Equity value created by <strong style={{ color: W.text1 }}>one meeting</strong></div>
              <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>30-40% paper value increase in days, not months</div>
            </div>
            <div style={{ maxWidth: 500 }}>
              <Bullet>Your investment creates the runway that closes the pilot.</Bullet>
              <div style={{ height: 6 }} />
              <Bullet>The pilot closes the valuation gap.</Bullet>
              <div style={{ height: 6 }} />
              <Bullet>Join before the catalyst, not after.</Bullet>
            </div>
          </>)}

          {/* ── 24. Timeline ────────────────────────────────────── */}
          {slide.type === 'timeline' && (<>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ maxWidth: 720, width: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${V}60, ${V}10)` }} />
              {[
                { date: 'Apr 14', label: 'Demo to Meteoric Resources (Gale, De Carvalho, Tunks)', status: 'next' },
                { date: 'Apr 18', label: 'Term sheet signed with angel investors', status: 'next' },
                { date: 'May', label: 'LAPOC instruments connected — "simulated" → "field-verified"', status: 'pending' },
                { date: 'Jun', label: 'Meteoric pilot signed — $102k/yr · First revenue', status: 'pending' },
                { date: 'Jul-Sep', label: 'Seed round $1-2M · Dev + commercial hire · 3 pilots', status: 'pending' },
                { date: 'Feb 2027', label: 'EU DPP enforcement — market expands 3x', status: 'pending' },
              ].map((t, i) => (
                <div key={t.date} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.status === 'next' ? `${V}20` : W.glass04, border: `1px solid ${t.status === 'next' ? V : W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'next' ? V : W.text4, fontFamily: 'var(--font-mono)' }}>{t.date}</span>
                  </div>
                  <div style={{ textAlign: 'left', paddingTop: 8 }}>
                    <p style={{ fontSize: 13, color: i === 0 ? W.text1 : W.text2, lineHeight: 1.5, margin: 0, fontWeight: i === 0 ? 700 : 400 }}>{t.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ── 25. Close ──────────────────────────────────────── */}
          {slide.type === 'close' && (<>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
              style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32 }}>V</motion.div>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: W.text3, maxWidth: 500, lineHeight: 1.6, marginBottom: 40 }}>
              Come see it. 310 tests. 27 AI tools. 14 map layers. 17 equipment. 9 stakeholders at 9.4/10. Built by one person from inside the Caldeira.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
              <a href="/lp" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Website</a>
              <a href="mailto:carlos@vero.supply" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', background: 'transparent' }}>carlos@vero.supply</a>
            </div>
          </>)}
        </>)
      }}
    </DeckShell>
  )
}
