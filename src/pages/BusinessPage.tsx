import { type ReactNode, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

function useUnlockScroll() {
  useEffect(() => {
    const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean) as HTMLElement[]
    targets.forEach(el => { el.style.overflow = 'auto' })
    return () => { targets.forEach(el => { el.style.overflow = '' }) }
  }, [])
}

function S({ children, style, id }: { children: ReactNode; style?: React.CSSProperties; id?: string }) {
  return (
    <motion.section id={id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.8, ease }} style={style}>
      {children}
    </motion.section>
  )
}

function Stagger({ children, i }: { children: ReactNode; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08, ease }}>
      {children}
    </motion.div>
  )
}

/* ── Style helpers ──────────────────────────────────────────────── */

const wrap: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 32px' }
const label: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: V, marginBottom: 12 }
const heading: React.CSSProperties = { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: W.text1 }
const body: React.CSSProperties = { fontSize: 17, color: W.text3, lineHeight: 1.7, maxWidth: 640 }
const glass: React.CSSProperties = { background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }
const glow: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, ${V}05 0%, transparent 55%)` }

/* ── Market Data ────────────────────────────────────────────────── */

const MARKET_TIERS = [
  { tier: 'TAM', value: '$18.8 B → $31.9 B', desc: 'Digital Mining & Smart Mining Technology', cagr: '11.2%', src: 'Mordor Intelligence + Grand View Research', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$15 M → $45 M', desc: '15 REE projects × $102k avg ACV', cagr: '—', src: 'Internal analysis — ASX/TSX database', pct: 15 },
]

const REGULATIONS = [
  { name: 'EU Battery Regulation', date: 'Feb 2027', desc: 'Mandatory Digital Product Passport for all batteries sold in the EU. Origin traceability, carbon footprint, recycled content disclosure.', impact: 'Creates compliance SaaS demand overnight' },
  { name: 'US FEOC Requirements', date: 'Active', desc: 'Foreign Entity of Concern restrictions on IRA tax credits. Critical mineral origin verification required for EV battery incentives.', impact: 'Defense + automotive supply chains need proof' },
  { name: 'CEN/CENELEC DPP Standard', date: '2026–2027', desc: 'Technical committee TC 10 defining the schema for digital product passports. 37 mandatory fields for mineral traceability.', impact: 'Schema-first movers set the standard' },
  { name: 'OECD Due Diligence', date: 'Active', desc: 'Five-step framework for responsible mineral supply chains. Audit trails, risk identification, supplier due diligence.', impact: 'Buyer compliance pressure flows upstream' },
  { name: 'Australia ESG Reporting', date: '2025–2026', desc: 'Mandatory climate and sustainability disclosures for ASX-listed miners. Board-level ESG governance requirements.', impact: 'Operators need integrated ESG dashboards' },
]

const COMPETITORS = [
  { name: 'Minviro', focus: 'LCA / carbon footprinting', gap: 'Single dimension (carbon). No field ops, no compliance passports, no executive dashboards.' },
  { name: 'Circulor', focus: 'Supply chain traceability (general)', gap: 'Horizontal platform — not mineral-specific. No DPP schema validation. No geological context.' },
  { name: 'ReSource', focus: 'Digital product passports', gap: 'Schema tools without field integration. No plant digital twin. No geological data layer.' },
  { name: 'IBM Sterling', focus: 'Enterprise supply chain visibility', gap: 'Enterprise-scale, enterprise-price, enterprise-complexity. Not built for critical minerals.' },
]

const PRICING = [
  { tier: 'Starter', price: '$30k', period: '/year', desc: 'Single project, core views (Field + Compliance), mock data layer, up to 10 users.', target: 'Exploration-stage operators' },
  { tier: 'Growth', price: '$102k', period: '/year', desc: 'Full platform (Field + Compliance + Executive), live telemetry, AI agent, Mini Engine, up to 50 users.', target: 'Development-stage operators', highlight: true },
  { tier: 'Enterprise', price: '$180–350k', period: '/year', desc: 'Multi-project, SCADA integration, custom views, dedicated support, SLA, unlimited users.', target: 'Production-stage operators' },
]

/* ── Component ──────────────────────────────────────────────────── */

export default function BusinessPage() {
  useUnlockScroll()
  const scrollTo = useCallback((id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }, [])

  return (
    <div style={{ background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {/* ── Nav ────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(7,7,14,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${W.glass06}`, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: V, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>V</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Vero</span>
          <span style={{ color: W.text4, fontSize: 12, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>/ business</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[{ l: 'Problem', id: 'problem' }, { l: 'Regulation', id: 'regulation' }, { l: 'Market', id: 'market' }, { l: 'Moat', id: 'moat' }, { l: 'Revenue', id: 'revenue' }, { l: 'Timing', id: 'timing' }].map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={e => { e.preventDefault(); scrollTo(n.id) }}
              style={{ color: W.text3, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>{n.l}</a>
          ))}
          <a href="/lp" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Website
          </a>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <header style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 2 }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${V}15 0%, transparent 70%)`, top: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p style={{ ...label, marginBottom: 20 }}>Market & Strategy</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 20, maxWidth: 800 }}>
            The Market Case for Vero
          </h1>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center', maxWidth: 620 }}>
            Regulations are creating a compliance SaaS market that doesn't exist yet. Vero is the first platform built inside a critical minerals project, not about one. The timing is now.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '$31.9B', label: 'TAM by 2030' },
            { value: '14.2%', label: 'SAM CAGR' },
            { value: '9.4/10', label: 'Persona Score' },
            { value: 'Feb 2027', label: 'EU DPP Deadline' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '18px 14px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </header>

      {/* ── The Problem ────────────────────────────────────────── */}
      <S id="problem" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>The Problem</p>
          <h2 style={heading}>$443M Projects Run on Spreadsheets</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Critical mineral supply chains are under regulatory, geopolitical, and investor pressure simultaneously — and the industry has no purpose-built software to handle it.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { stat: '70%', title: 'China controls REE processing', desc: 'Western supply chains have a single point of failure. Governments are legislating diversification, creating compliance demand.' },
              { stat: '18 mo', title: 'Average FEOC verification delay', desc: 'Defense procurement stalls on origin verification. Billion-dollar programs wait for spreadsheet-based supply chain audits.' },
              { stat: 'Feb 2027', title: 'EU Battery Passport mandatory', desc: 'Every battery sold in the EU needs a Digital Product Passport with origin traceability. No SaaS platform exists for critical minerals.' },
              { stat: '$443M', title: 'Caldeira CAPEX — one project', desc: 'Development-stage mineral projects manage hundreds of millions in capital with email, PowerPoint, and fragmented tools.' },
            ].map((p, i) => (
              <Stagger key={p.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{p.stat}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 8, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Regulatory Catalyst ────────────────────────────────── */}
      <S id="regulation" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Regulatory Catalyst</p>
          <h2 style={heading}>Regulations Creating the Market</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Five regulatory frameworks converging simultaneously. Each one creates compliance demand. Together, they create a SaaS market for critical mineral traceability.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {REGULATIONS.map((r, i) => (
              <Stagger key={r.name} i={i}>
                <div style={{ ...glass, display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 20, alignItems: 'center' }}>
                  <div style={glow} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
                    <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{r.name}</div>
                  </div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                  <div style={{ fontSize: 12, color: W.green, fontWeight: 600, textAlign: 'right', minWidth: 200 }}>{r.impact}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── TAM/SAM/SOM ────────────────────────────────────────── */}
      <S id="market" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Market Sizing</p>
          <h2 style={heading}>TAM → SAM → SOM</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Bottom-up analysis from public market research, regulatory timelines, and the ASX/TSX critical minerals pipeline.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {MARKET_TIERS.map((t, i) => (
              <Stagger key={t.tier} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', marginRight: 12 }}>{t.tier}</span>
                      <span style={{ fontSize: 20, fontWeight: 700, color: W.text1 }}>{t.value}</span>
                    </div>
                    {t.cagr !== '—' && <span style={{ fontSize: 13, color: W.green, fontWeight: 600 }}>CAGR {t.cagr}</span>}
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: W.glass06, marginBottom: 12, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.15, ease }}
                      style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: W.text4 }}>
                    <span>{t.desc}</span>
                    <span>{t.src}</span>
                  </div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── The Perfect Storm ──────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Timing Thesis</p>
          <h2 style={heading}>The Perfect Storm</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Four forces converging in 2026–2027. Each alone is a market signal. Together, they create a window for the first compliant critical minerals platform.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { title: 'Supply Chain Sovereignty', desc: 'US IRA, EU Critical Raw Materials Act, Australian ESG mandates — every major economy is legislating domestic mineral supply chains. Operators need compliance tools yesterday.' },
              { title: 'REE Demand Curve', desc: 'EV production scaling, defense stockpiling, permanent magnet demand. The supply pipeline cannot keep pace — new projects need faster permitting, faster financing, faster compliance.' },
              { title: 'Defense-Grade Compliance', desc: 'FEOC restrictions on IRA tax credits. DoD procurement requires origin verification. Critical minerals are now a national security asset class.' },
              { title: 'EU DPP Enforcement', desc: 'February 2027 — mandatory Digital Product Passports for batteries. CEN/CENELEC schema finalization in 2026. First movers set the implementation standard.' },
            ].map((f, i) => (
              <Stagger key={f.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: W.text2, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Competitive Landscape ──────────────────────────────── */}
      <S id="moat" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Competitive Landscape</p>
          <h2 style={heading}>No One Covers All Three Truths</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Competitors cover one dimension — carbon, traceability, or schema. Vero covers field operations, compliance, and executive oversight in a single platform built inside the project it serves.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
            {COMPETITORS.map((c, i) => (
              <Stagger key={c.name} i={i}>
                <div style={{ ...glass, display: 'grid', gridTemplateColumns: '160px 200px 1fr', gap: 16, alignItems: 'center' }}>
                  <div style={glow} />
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: V }}>{c.focus}</div>
                  <div style={{ fontSize: 13, color: W.text3 }}>{c.gap}</div>
                </div>
              </Stagger>
            ))}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: W.text1 }}>Vero's Moat</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { title: 'Founder Inside the Caldeira', desc: '40 years of local context. Born and raised in Poços de Caldas. No outside team can replicate this.' },
              { title: '9.4/10 Persona Score', desc: 'Validated against 9 named stakeholder personas before a single line of marketing was written.' },
              { title: 'Three Truths Stack', desc: 'Field ops + compliance + executive in one platform. No competitor even attempts this integration.' },
              { title: '310 Tests + OpenAPI', desc: 'Production architecture, not a prototype. SHA-256 audit chain. Auto-generated API spec.' },
              { title: 'Mini Engine', desc: 'JSON-driven public dashboards (Prefeitura, community, investor views). No competitor offers this.' },
            ].map((m, i) => (
              <Stagger key={m.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: V }}>{m.title}</h4>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Revenue Model ──────────────────────────────────────── */}
      <S id="revenue" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Revenue Model</p>
          <h2 style={heading}>SaaS Pricing Anchored to Project Value</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Annual subscriptions scaled by project stage. The Growth tier — $102k/year — represents 0.03% of Caldeira's $315M annual revenue consensus. Less than one day of interest on the construction loan.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
            {PRICING.map((p, i) => (
              <Stagger key={p.tier} i={i}>
                <div style={{ ...glass, border: p.highlight ? `1px solid ${V}40` : `1px solid ${W.glass06}`, textAlign: 'center' }}>
                  <div style={glow} />
                  {p.highlight && <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Flagship Tier</div>}
                  <div style={{ fontSize: 14, fontWeight: 600, color: W.text3 }}>{p.tier}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: W.text1, marginTop: 8 }}>
                    {p.price}<span style={{ fontSize: 14, color: W.text4, fontWeight: 500 }}>{p.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, marginTop: 12, marginBottom: 8 }}>{p.desc}</p>
                  <div style={{ fontSize: 11, color: V, fontFamily: 'var(--font-mono)' }}>{p.target}</div>
                </div>
              </Stagger>
            ))}
          </div>

          <div style={{ ...glass, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div style={glow} />
            <p style={{ fontSize: 14, color: W.text2, margin: 0 }}>
              <strong style={{ color: W.text1 }}>0.03%</strong> of project annual revenue. <strong style={{ color: W.text1 }}>0.013%</strong> of NPV. The platform costs less than the PowerPoint presentations it replaces.
            </p>
          </div>
        </div>
      </S>

      {/* ── Expansion Playbook ─────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>GTM Strategy</p>
          <h2 style={heading}>Five-Tier Expansion</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Land with a flagship operator, expand through adjacent stakeholders, then scale through regulatory and defense channels.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { tier: '1', name: 'Flagship Operator', desc: 'Meteoric Resources — development partner. Platform built on their Caldeira Project data. Growth pilot at $102k/year. The proof point for every subsequent sale.', status: 'Active' },
              { tier: '2', name: 'OEM / Defense', desc: 'Design partnerships with responsible sourcing teams. Lead with DPP JSON export + FEOC tracking. Starter tier at $30k/year.', status: 'Pipeline' },
              { tier: '3', name: 'Investors & PF', desc: 'Project finance analysts and institutional investors. 45-minute live demos. The platform reduces diligence friction — every question has a dashboard answer.', status: 'Pipeline' },
              { tier: '4', name: 'Regulators & Standards', desc: 'EU Battery Regulation, CEN/CENELEC advisory. 59% DPP field coverage as conversation starter. Shape the standard, don\'t chase it.', status: 'Positioning' },
              { tier: '5', name: 'Community & Political', desc: 'Mini Engine public dashboards. Prefeitura bilingual interface. FEAM pathway. Trust built through transparency.', status: 'Active' },
            ].map((t, i) => (
              <Stagger key={t.tier} i={i}>
                <div style={{ ...glass, display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 16, alignItems: 'center' }}>
                  <div style={glow} />
                  <div style={{ fontSize: 24, fontWeight: 800, color: V, textAlign: 'center' }}>{t.tier}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                    <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.status === 'Active' ? W.green : V, fontFamily: 'var(--font-mono)' }}>{t.status}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Traction Signals ───────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Traction</p>
          <h2 style={heading}>The Product Is Real</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Not a pitch deck with mockups. A deployed platform with real data, real tests, and a real flagship customer.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { v: '310', l: 'Automated Tests' },
              { v: '9.4/10', l: 'Persona Score' },
              { v: '27', l: 'AI Domain Tools' },
              { v: '19', l: 'GeoJSON Datasets' },
              { v: '17', l: 'Equipment Items' },
              { v: '59%', l: 'DPP Coverage' },
            ].map((s, i) => (
              <Stagger key={s.l} i={i}>
                <div style={{ ...glass, textAlign: 'center' }}>
                  <div style={glow} />
                  <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{s.v}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 4 }}>{s.l}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Why Now ────────────────────────────────────────────── */}
      <S id="timing" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Why Now</p>
          <h2 style={heading}>First Mover in a Market Being Created by Law</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            The compliance SaaS market for critical minerals doesn't exist yet — because the regulations enforcing it are still being written. Vero is already built, already deployed, and already scoring 9.4/10 across stakeholders. By the time competitors notice, we'll have the flagship case study and the schema standard.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { date: 'Now', items: ['Platform deployed with Caldeira data', 'Meteoric relationship active', '310 tests, production architecture', '2 US frontier AI company collaborations'] },
              { date: 'Q2–Q3 2026', items: ['Meteoric pilot contract ($102k/yr)', 'LAPOC live sensor integration', '75% DPP field coverage', '2 additional pilot customers'] },
              { date: 'Q4 2026', items: ['Seed raise ($5–7M pre-money)', 'OPC-UA SCADA proof of concept', 'Conference pipeline (TMS, Critical Minerals Summit)', 'DPP schema validation tool launch'] },
              { date: '2027', items: ['EU DPP enforcement begins', '5+ active pilot customers', 'Enterprise tier launches', 'On-chain attestation MVP'] },
            ].map((phase, i) => (
              <Stagger key={phase.date} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 14, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>{phase.date}</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: W.text2, lineHeight: 1.8 }}>
                    {phase.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <S style={{ padding: '80px 0 60px', textAlign: 'center' }}>
        <div style={wrap}>
          <h2 style={{ ...heading, marginBottom: 12 }}>See the Platform</h2>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center' }}>
            Every number on this page is backed by a working feature. Open the platform and verify it yourself.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{ background: V, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
            <a href="/lp" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Back to Website</a>
          </div>
        </div>
      </S>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 11, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 Vero Platform. Market data sourced from Mordor Intelligence, Grand View Research,
          Dataintelo, Growth Market Reports, and internal ASX/TSX analysis. All figures are estimates.
        </p>
      </footer>
    </div>
  )
}
