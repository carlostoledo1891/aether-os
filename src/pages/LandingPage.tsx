import { W } from '../app/canvas/canvasTheme'

const FEATURES = [
  { title: 'Geological Intelligence', desc: 'Lithological intervals, drill intercepts, and deposit modeling with AI-assisted analysis.' },
  { title: 'Plant Operations', desc: 'Real-time telemetry, environmental monitoring, and SCADA integration with OPC-UA/MQTT roadmap.' },
  { title: 'Supply Chain Traceability', desc: 'SHA-256 hash chain from mine to magnet. EU DPP compliant. Blockchain anchoring planned.' },
  { title: 'Compliance & ESG', desc: 'Automated regulatory tracking, stakeholder management, and ESG scoring with AI audit.' },
]

const HIGHLIGHTS = [
  '218+ automated tests',
  '25 AI agent tools',
  'EU DPP schema validation',
  'Real-time telemetry dashboard',
  'Interactive geological maps',
  'SHA-256 audit trail',
  '5 persona views',
  'WCAG AA contrast compliant',
  'SCADA integration ready',
]

export default function LandingPage() {
  return (
    <div style={{ background: W.bg, color: W.text1, minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', color: W.violet, marginBottom: 16 }}>
          Vero by Meteoric Resources
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, maxWidth: 800, margin: '0 0 16px' }}>
          AI-Powered Operating System for Rare Earth Supply Chains
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: W.text3, maxWidth: 600, lineHeight: 1.6, marginBottom: 32 }}>
          Full-stack traceability from mine to magnet. Geology, operations, compliance, and buyer intelligence — unified in one platform.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/" style={{ background: W.violet, color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}>
            Open Dashboard →
          </a>
          <a href="/pitch-deck" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>
            View Deck
          </a>
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>The Problem</h2>
        <p style={{ color: W.text3, fontSize: 16, lineHeight: 1.7 }}>
          Rare earth supply chains are opaque, concentrated, and vulnerable. 70% of global production flows through a single country, and downstream manufacturers have zero visibility into provenance, environmental impact, or supply risk. Regulatory pressure (EU Battery Regulation, US CHIPS Act) demands verifiable traceability that today's tools cannot provide.
        </p>
      </section>

      {/* Solution */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>The Solution</h2>
        <p style={{ color: W.text3, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          Vero is an AI-native operating system that unifies geological intelligence, plant operations monitoring, regulatory compliance, and buyer-facing digital product passports into a single real-time platform.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Platform Highlights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {HIGHLIGHTS.map(h => (
            <div key={h} style={{ padding: '12px 16px', background: W.glass04, borderRadius: 8, fontSize: 13, color: W.text2, border: `1px solid ${W.glass06}` }}>
              {h}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>See Vero in Action</h2>
        <p style={{ color: W.text3, marginBottom: 24 }}>Explore the live dashboard or review the investment deck.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/" style={{ background: W.violet, color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Open Dashboard
          </a>
          <a href="mailto:contact@meteoric.tech" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '12px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', background: 'transparent' }}>
            Contact Us
          </a>
        </div>
        <p style={{ color: W.text4, fontSize: 11, marginTop: 40 }}>
          © 2026 Meteoric Resources Ltd. All rights reserved.
        </p>
      </section>
    </div>
  )
}
