import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'
import { PRODUCT_ROADMAP } from '../../data/domain/roadmap'
import { MarketingNav } from '../../components/layout/MarketingNav'
import { MarketingObservability } from '../../components/layout/MarketingObservability'
import { ScrollSection as S, Stagger, SectionHeader } from '../../components/layout/MarketingPrimitives'
import { useUnlockScroll, marketingStyles } from '../../components/layout/MarketingShared'
import { ease, V } from './sharedConstants'

const { wrap, label, heading, body, glass } = marketingStyles
const glow: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, ${V}05 0%, transparent 55%)` }

/* ── Market Data ────────────────────────────────────────────────── */

const MARKET_TIERS = [
  { tier: 'TAM', value: '$4.8 B → $9.6 B', desc: 'ESG Compliance in Mining', cagr: '8.9%', src: 'Grand View Research (Nov 2025)', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$150 M → $450 M', desc: '150 Critical Mineral projects × $102k avg ACV', cagr: '—', src: 'Internal analysis — ASX/TSX database', pct: 15 },
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

  return (
    <div style={{ background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      <MarketingNav
        section="business"
        links={[
          { label: 'Platform', href: '/lp' },
          { label: 'Tech', href: '/tech' },
          { label: 'Business', href: '/business' },
        ]}
        cta={{ label: 'Founders Deck', href: '/deck/founders' }}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <header style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 2 }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${V}15 0%, transparent 70%)`, top: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p style={{ ...label, marginBottom: 20 }}>Market & Strategy</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 20, maxWidth: 800 }}>
            The Market Case for VeroChain
          </h1>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center', maxWidth: 620 }}>
            Regulations are creating a compliance SaaS market that doesn't exist yet. VeroChain is the first platform built inside a critical minerals project, not about one. The timing is now.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '$9.6B', label: 'TAM by 2033' },
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
          <SectionHeader
            label="The Problem"
            heading="$443M Projects Run on Spreadsheets"
            body="Critical mineral supply chains are under regulatory, geopolitical, and investor pressure simultaneously — and the industry has no purpose-built software to handle it."
          />

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
          <SectionHeader
            label="Regulatory Catalyst"
            heading="Regulations Creating the Market"
            body="Five regulatory frameworks converging simultaneously. Each one creates compliance demand. Together, they create a SaaS market for critical mineral traceability."
          />

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
          <SectionHeader
            label="Market Sizing"
            heading="TAM → SAM → SOM"
            body="Bottom-up analysis from public market research, regulatory timelines, and the ASX/TSX critical minerals pipeline."
          />

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
      <MarketingObservability />

      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Timing Thesis"
            heading="The Perfect Storm"
            body="Four forces converging in 2026–2027. Each alone is a market signal. Together, they create a window for the first compliant critical minerals platform."
          />

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
          <SectionHeader
            label="Competitive Landscape"
            heading="No One Covers All Three Truths"
            body="Competitors cover one dimension — carbon, traceability, or schema. VeroChain covers field operations, compliance, and executive oversight in a single platform built inside the project it serves."
          />

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

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: W.text1 }}>VeroChain's Moat</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { title: 'Founder Inside the Caldeira', desc: '40 years of local context. Born and raised in Poços de Caldas. No outside team can replicate this.' },
              { title: '9.4/10 Persona Score', desc: 'Validated against 9 named stakeholder personas before a single line of marketing was written.' },
              { title: 'Three Truths Stack', desc: 'Field ops + compliance + executive in one platform. No competitor even attempts this integration.' },
              { title: 'CI + OpenAPI', desc: 'Production architecture, not a prototype. SHA-256 audit chain. NIST 800-53 mapped. Auto-generated API spec.' },
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
          <SectionHeader
            label="Revenue Model"
            heading="SaaS Pricing Anchored to Project Value"
            body="Annual subscriptions scaled by project stage. The Growth tier — $102k/year — represents 0.03% of Caldeira's $315M annual revenue consensus. Less than one day of interest on the construction loan."
          />

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
          <SectionHeader
            label="GTM Strategy"
            heading="Five-Tier Expansion"
            body="Land with a flagship operator, expand through adjacent stakeholders, then scale through regulatory and defense channels."
          />

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
          <SectionHeader
            label="Traction"
            heading="The Product Is Real"
            body="Not a pitch deck with mockups. A deployed platform with real data, real tests, and a real flagship customer."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { v: 'NIST', l: '800-53 Mapped' },
              { v: '9.4/10', l: 'Persona Score' },
              { v: 'SHA-256', l: 'Audit Chain' },
              { v: '19', l: 'GeoJSON Datasets' },
              { v: 'Full', l: 'Digital Twin' },
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
          <SectionHeader
            label="Why Now"
            heading="First Mover in a Market Being Created by Law"
            body="The compliance SaaS market for critical minerals doesn't exist yet — because the regulations enforcing it are still being written. VeroChain is already built, already deployed, and already scoring 9.4/10 across stakeholders. By the time competitors notice, we'll have the flagship case study and the schema standard."
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { date: 'Now', items: ['Platform deployed with Caldeira data', 'Meteoric relationship active', 'CI-enforced quality gates, production architecture', '2 US frontier AI company collaborations'] },
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

      {/* ── Growth Roadmap ──────────────────────────────────────── */}
      <S id="roadmap" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Growth Roadmap"
            heading="Expansion Trajectory"
            body="From single-commodity pilot to multi-industry platform standard — each phase unlocks new revenue streams."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {PRODUCT_ROADMAP.map((phase, i) => {
              const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
              const bizItems = phase.items.filter(it => it.tag === 'business' || it.tag === 'compliance')
              const allItems = bizItems.length > 0 ? bizItems : phase.items.slice(0, 2)
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={glow} />
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: '4px 0 12px', color: accent }}>{phase.title}</h3>
                      {allItems.map(item => (
                        <div key={item.title} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, marginTop: 2 }}>{item.description}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, position: 'relative' }}>
                      <span style={{
                        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '3px 10px', borderRadius: 4,
                        background: phase.status === 'active' ? `${V}20` : W.glass04, color: accent,
                      }}>{phase.status}</span>
                    </div>
                  </div>
                </Stagger>
              )
            })}
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
          © 2026 VeroChain. Market data sourced from Grand View Research,
          Dataintelo, Growth Market Reports, and internal ASX/TSX analysis. All figures are estimates.
        </p>
      </footer>
    </div>
  )
}
