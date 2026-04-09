import { W } from '../app/canvas/canvasTheme'

const FEATURES = [
  {
    title: 'Pilot Plant Digital Twin',
    desc: '17 equipment items, 28 sensors, 7 process steps — animated interactive Control Room with real-time telemetry and equipment-level inspection.',
    accent: W.cyan,
  },
  {
    title: 'Field Operations',
    desc: '3D terrain-aware maps with 19 GeoJSON datasets, drill collars, springs, licences, and infrastructure. Hydro Twin for LI defense.',
    accent: W.violet,
  },
  {
    title: 'Compliance & Traceability',
    desc: 'EU DPP schema validation (22 CEN/CENELEC fields), FEOC tracking, molecular-to-magnet ledger. Real SHA-256 audit chain.',
    accent: W.green,
  },
  {
    title: 'Executive Overview',
    desc: 'Financial scenarios (Bear/Consensus/Bull), risk register, capital tracker, DSCR projections, stakeholder management, ESG frameworks.',
    accent: W.violet,
  },
]

const STATS = [
  { value: '9.2/10', label: 'Persona Score', desc: 'Weighted avg across 9 stakeholder types' },
  { value: '27', label: 'AI Agent Tools', desc: 'Domain-grounded, hallucination-tested' },
  { value: '218+', label: 'Automated Tests', desc: 'Across 3 packages (frontend, server, engine)' },
  { value: '$5–7M', label: 'Consensus Valuation', desc: 'Pre-money at seed stage' },
]

const MARKET = [
  { layer: 'TAM', value: '$18.8B → $31.9B', period: '2026–2031', cagr: '11.2%', desc: 'Digital mining & smart mining' },
  { layer: 'SAM', value: '$1.6B → $5.2B', period: '2025–2033', cagr: '14.2%', desc: 'Critical minerals compliance SaaS' },
  { layer: 'SOM', value: '$15M → $45M', period: '2026–2030', cagr: '—', desc: '15 REE projects × $102k/yr' },
]

export default function LandingPage() {
  return (
    <div style={{ background: W.bg, color: W.text1, minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(ellipse at 50% 20%, ${W.violet}10 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: W.violet, marginBottom: 20, position: 'relative' }}>
          Verified Origin · Trusted Supply
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 700, lineHeight: 1.05, maxWidth: 900, margin: '0 0 20px', position: 'relative', background: `linear-gradient(135deg, ${W.text1}, ${W.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The trust layer for critical mineral supply chains
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: W.text3, maxWidth: 640, lineHeight: 1.65, marginBottom: 36, position: 'relative' }}>
          One platform to align field operations, compliance evidence, and board-level metrics. Pilot Plant Digital Twin, 3D terrain maps, AI-powered analysis, and EU DPP-compliant traceability — from mine to magnet.
        </p>
        <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
          <a href="/" style={{ background: W.violet, color: '#fff', padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}>
            Open Dashboard
          </a>
          <a href="/pitch-deck" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>
            View Deck
          </a>
        </div>
        <div style={{ marginTop: 64, display: 'flex', gap: 32, position: 'relative' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: W.violet, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: W.text3, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: '100px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.red, marginBottom: 12 }}>The Problem</div>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 600, marginBottom: 20, lineHeight: 1.2 }}>
          Critical minerals are a national security bottleneck
        </h2>
        <p style={{ color: W.text3, fontSize: 16, lineHeight: 1.75 }}>
          70% of rare earth production flows through a single country. US DoD faces 18–24 month procurement delays. EU Battery Passport enforcement begins Feb 2027 with no standard tooling. Operators juggle spreadsheets across engineering, permitting, IR, and community — each telling a slightly different story. Spreadsheets and slide decks don't survive diligence.
        </p>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.violet, marginBottom: 12, textAlign: 'center' }}>Platform</div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 40, textAlign: 'center' }}>Four Experiences, One Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: f.accent, opacity: 0.5 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: W.text1 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Market */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.green, marginBottom: 12, textAlign: 'center' }}>Market Opportunity</div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 32, textAlign: 'center' }}>Regulatory tailwinds drive adoption</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MARKET.map(m => (
            <div key={m.layer} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: W.glass04, borderRadius: 10, border: `1px solid ${W.glass06}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)', width: 40, flexShrink: 0 }}>{m.layer}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value} <span style={{ fontSize: 11, color: W.text4, fontWeight: 400 }}>({m.period})</span></div>
                <div style={{ fontSize: 12, color: W.text3, marginTop: 2 }}>{m.desc}{m.cagr !== '—' ? ` · ${m.cagr} CAGR` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Caldeira */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.cyan, marginBottom: 12 }}>Flagship Deployment</div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 20 }}>Caldeira Project — Meteoric Resources</h2>
        <p style={{ color: W.text3, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          World-class ionic clay REE deposit in Poços de Caldas, MG, Brazil. 1.537 Bt resource across 7 deposits. NPV $821M consensus. CAPEX $443M — 94% funded. LP approved Dec 2025. DFS mid-2026. First production 2028.
        </p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { v: '$821M', l: 'NPV Consensus' },
            { v: '28%', l: 'IRR Pre-Tax' },
            { v: '$443M', l: 'CAPEX' },
            { v: '3 yrs', l: 'Payback' },
            { v: '$2.0B', l: 'LOM FCF' },
          ].map(k => (
            <div key={k.l} style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: W.cyan, fontFamily: 'var(--font-mono)' }}>{k.v}</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{k.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.violet, marginBottom: 12, textAlign: 'center' }}>Team</div>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 32, textAlign: 'center' }}>Built from Inside the Caldeira</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { name: 'Carlos Toledo', role: 'Founder & Product Lead', desc: 'Born in the Caldeira. Air Force, full-stack dev, Product Design. Built the entire stack.' },
            { name: 'Dr. Heber Caponi', role: 'Chief Scientific Advisor', desc: 'Decades of Caldeira field research. Converts simulated to field-verified.' },
            { name: 'Thiago A.', role: 'CEO (designated)', desc: 'Brazilian/international law, enterprise ops, commercial execution.' },
          ].map(t => (
            <div key={t.name} style={{ padding: '20px 16px', background: W.glass04, borderRadius: 12, border: `1px solid ${W.glass06}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: W.violet, marginTop: 2, marginBottom: 8 }}>{t.role}</div>
              <div style={{ fontSize: 12, color: W.text3, lineHeight: 1.55 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(ellipse at 50% 80%, ${W.violet}08 0%, transparent 50%)`, pointerEvents: 'none' }} />
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, marginBottom: 12, position: 'relative' }}>See Vero in Action</h2>
        <p style={{ color: W.text3, marginBottom: 28, position: 'relative', fontSize: 15 }}>Explore the live dashboard, review the deck, or start a conversation.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative' }}>
          <a href="/" style={{ background: W.violet, color: '#fff', padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Open Dashboard
          </a>
          <a href="/pitch-deck" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '13px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>
            View Deck
          </a>
          <a href="mailto:contact@meteoric.tech" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '13px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', background: 'transparent' }}>
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0 }}>
          © 2026 Meteoric Resources Ltd. All rights reserved. Demo mixes public-reference data, disclosure-aligned scenarios, and simulated time series.
        </p>
      </footer>
    </div>
  )
}
