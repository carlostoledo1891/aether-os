import { motion } from 'motion/react'
import { W } from '../../../theme/publicTheme'
import { PRODUCT_ROADMAP } from '../../../data/domain/roadmap'
import { MarketingObservability } from '../../../components/layout/MarketingObservability'
import { ScrollSection as S, Stagger, SectionHeader } from '../../../components/layout/MarketingPrimitives'
import { marketingStyles } from '../../../components/layout/MarketingShared'
import { ease, V } from '../sharedConstants'
import { MarketingSlideRoot } from './marketingSlideShell'
import { RequestDemoButton } from '../../../components/marketing/RequestDemo'

const { wrap, label, heading, body, glass } = marketingStyles
const glow: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, ${V}05 0%, transparent 55%)` }

const MARKET_TIERS = [
  { tier: 'TAM', value: '$4.8 B → $9.6 B', desc: 'ESG Compliance in Mining', cagr: '8.9%', src: 'Grand View Research (Nov 2025)', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$150 M → $450 M', desc: '150 Critical Mineral projects × $102k avg ACV', cagr: '—', src: 'Internal analysis — ASX/TSX database', pct: 15 },
]

const REGULATIONS = [
  { name: 'EU Battery Regulation', date: 'Feb 2027', desc: 'Mandatory Digital Product Passport for all batteries sold in the EU. Origin traceability, carbon footprint, recycled content disclosure.', impact: 'Creates compliance SaaS demand overnight' },
  { name: 'US FEOC Requirements', date: 'Active', desc: 'Foreign Entity of Concern restrictions on IRA tax credits. Critical mineral origin verification required for EV battery incentives.', impact: 'Defense + automotive supply chains need proof' },
  { name: 'CEN/CENELEC DPP Standard', date: '2026–2027', desc: 'Technical committee TC 10 defining the schema for digital product passports. 37 mandatory fields for mineral traceability.', impact: 'Schema-first movers set the standard' },
]

const COMPETITORS = [
  { name: 'Minviro', focus: 'LCA / carbon footprinting', gap: 'Single dimension (carbon). No field ops, no per-record evidence chain, no operator workspace.' },
  { name: 'Circulor', focus: 'Supply chain traceability (general)', gap: 'Generic traceability layer — no typed unit model, no per-vertical lenses, no operator-grade UI.' },
  { name: 'GRC / ESG SaaS suites', focus: 'Survey-driven disclosure (carbon accounting, ESG scoring)', gap: 'Filing-centric, not operations-grade. Cannot drive day-to-day operator decisions or carry verifiable provenance into a passport.' },
]

const PRICING = [
  { tier: 'Starter', price: '$30k', period: '/year', desc: 'Single operation, core lenses (Field + Compliance), mock data layer, up to 10 users.', target: 'Early-stage operators' },
  { tier: 'Growth', price: '$102k', period: '/year', desc: 'Full platform (Field + Compliance + Executive), live telemetry, AI agent, embedded ingestion engine, up to 50 users.', target: 'Development-stage operators', highlight: true },
  { tier: 'Enterprise', price: '$180–350k', period: '/year', desc: 'Multi-operation, integrations with existing systems, custom unit types and lenses, dedicated support, SLA, unlimited users.', target: 'Production-stage operators' },
]

export function BizHeroSlide() {
  return (
    <MarketingSlideRoot>
      <header style={{ minHeight: '52vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 16px 28px', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 2 }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${V}15 0%, transparent 70%)`, top: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p style={{ ...label, marginBottom: 16 }}>Market & Strategy</p>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 16, maxWidth: 800 }}>
            The Business Case for Vero
          </h1>
          <p style={{ ...body, margin: '0 auto 24px', textAlign: 'center', maxWidth: 620 }}>
            Regulators, buyers, and capital allocators are forcing field operations to prove what happened — with verifiable evidence,
            not narrative reports. Vero is the field-operations command center that turns an operation into an audit-ready system of record.
            Lead verticals: mining, agriculture, defense. Adjacent verticals share the same shape.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '$9.6B', label: 'TAM by 2033' },
            { value: '14.2%', label: 'SAM CAGR' },
            { value: '9.4/10', label: 'Persona Score' },
            { value: 'Feb 2027', label: 'EU DPP Deadline' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '14px 12px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </header>
    </MarketingSlideRoot>
  )
}

export function BizProblemSlide() {
  return (
    <MarketingSlideRoot>
      <S id="problem" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="The Problem"
            heading="Capital-Heavy Operations Run on Spreadsheets"
            body="Operators across critical minerals, energy, defense supply chains, and capital-heavy industry face simultaneous regulatory, geopolitical, and investor pressure — with no purpose-built operational system of record to handle it."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: 'Spreadsheets', title: 'The default operational ledger', desc: 'Engineering, permitting, IR, and community data live in disconnected files. None survives diligence, audit, or a leadership change.' },
              { stat: '18 mo', title: 'Origin-verification delay (defense)', desc: 'FEOC and equivalent supply-chain checks stall billion-dollar programs. The bottleneck is evidence, not the underlying material.' },
              { stat: 'Feb 2027', title: 'EU Digital Product Passport live', desc: 'Battery, textile, electronics, and construction-product sectors all need machine-readable provenance. Critical minerals is the leading edge.' },
              { stat: '$100M+', title: 'CAPEX per development project', desc: 'Development-stage operators manage hundreds of millions in capital with email, PowerPoint, and fragmented tools — and cannot show their work.' },
            ].map((p, i) => (
              <Stagger key={p.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 26, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{p.stat}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 8, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function BizRegulationSlide() {
  return (
    <MarketingSlideRoot>
      <S id="regulation" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Regulatory Catalyst"
            heading="Regulations Creating the Market"
            body="Regulatory frameworks converging simultaneously. Each one creates compliance demand."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {REGULATIONS.map((r, i) => (
              <Stagger key={r.name} i={i}>
                <div style={{ ...glass, position: 'relative' }}>
                  <div style={glow} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: W.text1, marginTop: 4 }}>{r.name}</div>
                    </div>
                    <div style={{ fontSize: 11, color: W.green, fontWeight: 600 }}>{r.impact}</div>
                  </div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function BizMarketObsSlide() {
  return (
    <MarketingSlideRoot>
      <S id="market" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Lead Vertical Sizing"
            heading="TAM → SAM → SOM (Critical Minerals)"
            body="Bottom-up analysis from public market research, regulatory timelines, and the ASX/TSX critical minerals pipeline. Mining is the deployed reference; the other lead verticals (agriculture / water, defense / public sector) and the adjacent industries (logistics, transportation, infrastructure) add comparable surface area on the same three pillars."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MARKET_TIERS.map((t, i) => (
              <Stagger key={t.tier} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', marginRight: 10 }}>{t.tier}</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: W.text1 }}>{t.value}</span>
                    </div>
                    {t.cagr !== '—' && <span style={{ fontSize: 13, color: W.green, fontWeight: 600 }}>CAGR {t.cagr}</span>}
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: W.glass06, marginBottom: 10, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.12 }}
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
      <MarketingObservability />
      <S style={{ padding: '28px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Timing Thesis"
            heading="The Perfect Storm"
            body="Four forces converging in 2026–2027. Each alone is a market signal. Together, they open a window for an evidence-first operational platform."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { title: 'Supply Chain Sovereignty', desc: 'US IRA, EU Critical Raw Materials Act, Australian ESG mandates — every major economy is legislating domestic supply chains and demanding verifiable origin data.' },
              { title: 'Demand-Side Pressure', desc: 'EV scale-up, defense stockpiling, infrastructure programs, and ESG-mandated procurement all need provenance-grade evidence the existing supply base cannot produce.' },
            ].map((f, i) => (
              <Stagger key={f.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function BizMoatRevenueSlide() {
  return (
    <MarketingSlideRoot>
      <S id="moat" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Competitive Landscape"
            heading="No One Covers Operations + Evidence + Executive in One Platform"
            body="Adjacent vendors solve one dimension — carbon, traceability, or schema. Vero unifies field operations, compliance evidence, and executive oversight on the same typed-unit + audit-chain substrate."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {COMPETITORS.map((c, i) => (
              <Stagger key={c.name} i={i}>
                <div style={{ ...glass, position: 'relative' }}>
                  <div style={glow} />
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: V, marginBottom: 8 }}>{c.focus}</div>
                  <div style={{ fontSize: 12, color: W.text3 }}>{c.gap}</div>
                </div>
              </Stagger>
            ))}
          </div>

          <SectionHeader
            label="Revenue Model"
            heading="SaaS Pricing Anchored to Project Value"
            body="Annual subscriptions scaled by project stage."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {PRICING.map((p, i) => (
              <Stagger key={p.tier} i={i}>
                <div style={{ ...glass, border: p.highlight ? `1px solid ${V}40` : `1px solid ${W.glass06}`, textAlign: 'center' }}>
                  <div style={glow} />
                  {p.highlight && <div style={{ fontSize: 9, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Flagship Tier</div>}
                  <div style={{ fontSize: 13, fontWeight: 600, color: W.text3 }}>{p.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: W.text1, marginTop: 6 }}>
                    {p.price}<span style={{ fontSize: 12, color: W.text4, fontWeight: 500 }}>{p.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.55, marginTop: 10, marginBottom: 6 }}>{p.desc}</p>
                  <div style={{ fontSize: 10, color: V, fontFamily: 'var(--font-mono)' }}>{p.target}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function BizClosingSlide() {
  return (
    <MarketingSlideRoot>
      <S id="roadmap" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Growth Roadmap"
            heading="Expansion Trajectory"
            body="From the mining reference deployment to a multi-industry platform standard — each phase reuses the same three pillars (Map &amp; Geofence, Monitor &amp; Verify, Decide &amp; Report) and unlocks adjacent ACV."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {PRODUCT_ROADMAP.slice(0, 4).map((phase, i) => {
              const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
              const bizItems = phase.items.filter(it => it.tag === 'business' || it.tag === 'compliance')
              const allItems = bizItems.length > 0 ? bizItems : phase.items.slice(0, 2)
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={glow} />
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 10px', color: accent }}>{phase.title}</h3>
                      {allItems.map(item => (
                        <div key={item.title} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: W.text1 }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, marginTop: 2 }}>{item.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Stagger>
              )
            })}
          </div>
        </div>
      </S>

      <S style={{ padding: '36px 0 24px', textAlign: 'center' }}>
        <div style={wrap}>
          <h2 style={{ ...heading, marginBottom: 10 }}>See the Platform</h2>
          <p style={{ ...body, margin: '0 auto 24px', textAlign: 'center' }}>
            Every number on this page is backed by a working feature. Open the platform and verify it yourself.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <RequestDemoButton size="lg" />
            <a href="/" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'transparent', letterSpacing: '0.01em' }}>Website</a>
          </div>
        </div>
      </S>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 Vero. Market data sourced from Grand View Research,
          Dataintelo, Growth Market Reports, and internal ASX/TSX analysis. All figures are estimates.
        </p>
      </footer>
    </MarketingSlideRoot>
  )
}
