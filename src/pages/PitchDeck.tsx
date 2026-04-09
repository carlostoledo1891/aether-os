import { useState, useCallback, useEffect } from 'react'
import { W } from '../app/canvas/canvasTheme'

interface Slide {
  title: string
  subtitle?: string
  body: string[]
  accent?: string
  type: 'cover' | 'content' | 'stats' | 'cta'
}

const SLIDES: Slide[] = [
  {
    title: 'Vero',
    subtitle: 'The trust layer for critical mineral supply chains',
    body: ['Meteoric Resources Ltd (ASX: MEI)'],
    type: 'cover',
  },
  {
    title: 'The Problem',
    accent: W.red,
    body: [
      '70% of rare earth production flows through a single country — downstream manufacturers have zero visibility into provenance or supply risk.',
      'US DoD faces 18–24 month procurement delays when FEOC documentation is incomplete.',
      'EU Battery Passport enforcement begins Feb 2027 with no industry-standard tooling.',
      'Operators juggle spreadsheets across engineering, permitting, IR, and community — each telling a slightly different story.',
    ],
    type: 'content',
  },
  {
    title: 'Three Truths, One Platform',
    accent: W.violet,
    body: [
      'Ground Truth (Field) — Operations and hydrology on a 3D terrain map with explicit data provenance.',
      'Trade Truth (Compliance) — FEOC / IRA / EU Digital Battery Passport evidence design with batch traceability.',
      'Board Truth (Executive) — Scenarios, risk, capital, DFS, agencies, audit trail, ESG — aligned to steerco rhythm.',
    ],
    type: 'content',
  },
  {
    title: 'Pilot Plant Digital Twin',
    accent: W.cyan,
    body: [
      '17 pieces of industrial equipment — Metso, Andritz, GEA, Outotec.',
      '28 sensors mapped to live telemetry paths with real-time readings.',
      '7 process steps from ROM ore to MREC product — animated flow visualization.',
      'Click any equipment to inspect supplier, capacity, sensors, and connected process.',
      'Collapsed HUD shows pH, MREC output, water recirculation, and TREO grade at a glance.',
    ],
    type: 'content',
  },
  {
    title: 'Platform Architecture',
    accent: W.violet,
    body: [
      '3 audience views: Field Operations · Compliance & Traceability · Executive Overview',
      '27 AI agent tools grounded in project data — geology, financials, compliance, lithology, DPP validation',
      'Real SHA-256 append-only audit chain with chain verification API',
      'EU DPP-compliant JSON export (22 CEN/CENELEC fields mapped, schema validation)',
      'Three-process backend: Fastify API + simulation engine + 4 external enrichers',
      '218+ automated tests · SCADA integration surface · OpenAPI spec',
    ],
    type: 'content',
  },
  {
    title: 'Market Opportunity',
    accent: W.green,
    body: [
      'TAM: $18.8B (2026) → $31.9B (2031) — Digital mining & smart mining technology. (Mordor Intelligence, Grand View Research)',
      'SAM: $1.6B (2025) → $5.2B (2033) — Critical minerals compliance & traceability SaaS. (Dataintelo, Growth Market Reports)',
      'SOM: $15M (2026) → $45M (2030) — 15 REE projects in allied jurisdictions × $102k/yr.',
      'EU Battery Passport (Feb 2027) and FEOC requirements are the adoption catalysts.',
    ],
    type: 'content',
  },
  {
    title: 'Caldeira Project — Flagship',
    accent: W.cyan,
    body: [
      '1.537 Bt ionic clay REE resource across 7 deposits in Poços de Caldas, MG, Brazil.',
      'NPV $821M (consensus) / $1,985M (forecast) · IRR 28–39% pre-tax · 3-year payback.',
      'CAPEX $443M — 94% funded (EXIM $350M + EFA A$70M) · Breakeven NdPr $22/kg.',
      'LP approved Dec 2025 · DFS mid-2026 · FID H2 2026 · First production 2028.',
      'Offtakers: Ucore (binding, 2,000 tpa) · Neo Performance Materials (LOI, 1,500 tpa).',
    ],
    type: 'content',
  },
  {
    title: 'Traction',
    accent: W.green,
    body: [],
    type: 'stats',
  },
  {
    title: 'The Team',
    accent: W.violet,
    body: [
      'Carlos Toledo — Founder. Born inside the Caldeira. Air Force pilot, full-stack dev, Product Design. Built the entire stack solo. 40 years of local context.',
      'Dr. Heber Caponi — Chief Scientific Advisor (LAPOC). Decades of active Caldeira field research. Converts "simulated" into "field-verified."',
      'Thiago A. — CEO. Brazilian/international law, enterprise ops, commercial execution.',
      'Full-Stack Developer — Ready at pilot. Codebase architected for immediate team scaling.',
    ],
    type: 'content',
  },
  {
    title: 'Valuation & Ask',
    accent: W.violet,
    body: [
      'Pre-revenue consensus: $5–7M pre-money.',
      '2030 ARR projection: $4.5M (consensus) / $13M (bull).',
      'Implied 2030 EV: $55–90M (consensus) / $130–200M (bull).',
      '',
      'Seed investment to: hire commercial lead, onboard 5 pilots, connect LAPOC instruments.',
      'contact@meteoric.tech',
    ],
    type: 'cta',
  },
]

const TRACTION_STATS = [
  { value: '9.2', label: 'Persona Score', sub: '/10 weighted avg' },
  { value: '5/9', label: 'At Ceiling', sub: 'personas at 10.0' },
  { value: '218+', label: 'Tests', sub: 'across 3 packages' },
  { value: '27', label: 'AI Tools', sub: 'domain-grounded' },
  { value: '17', label: 'Equipment', sub: 'in digital twin' },
  { value: '28', label: 'Sensors', sub: 'mapped to telemetry' },
  { value: '19', label: 'GeoJSON Sets', sub: 'integrated' },
  { value: 'SHA-256', label: 'Audit Chain', sub: 'real cryptographic' },
]

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goNext = useCallback(() => setCurrentSlide(i => Math.min(i + 1, SLIDES.length - 1)), [])
  const goPrev = useCallback(() => setCurrentSlide(i => Math.max(i - 1, 0)), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') window.location.href = '/'
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const slide = SLIDES[currentSlide]
  const accent = slide.accent ?? W.violet

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: `radial-gradient(ellipse at 50% 0%, ${accent}08 0%, ${W.bg} 60%)`,
        color: W.text1,
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 72px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={goNext}
    >
      {slide.type === 'cover' && (
        <>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: accent, marginBottom: 32 }}>
            {slide.body[0]}
          </div>
          <h1 style={{ fontSize: 'clamp(56px, 9vw, 96px)', fontWeight: 700, lineHeight: 1.0, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1}, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: W.text3, maxWidth: 600, lineHeight: 1.5 }}>
            {slide.subtitle}
          </p>
          <div style={{ marginTop: 48, width: 40, height: 1, background: accent, opacity: 0.4 }} />
        </>
      )}

      {slide.type === 'content' && (
        <>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, marginBottom: 32, lineHeight: 1.15 }}>
            {slide.title}
          </h2>
          <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {slide.body.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, marginTop: 8, flexShrink: 0 }} />
                <p style={{ fontSize: 'clamp(13px, 1.6vw, 17px)', color: W.text2, lineHeight: 1.65, margin: 0 }}>
                  {line}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {slide.type === 'stats' && (
        <>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, marginBottom: 40, lineHeight: 1.15 }}>
            {slide.title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 800 }}>
            {TRACTION_STATS.map(s => (
              <div key={s.label} style={{ padding: '20px 12px', background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text1, marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {slide.type === 'cta' && (
        <>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, marginBottom: 32 }}>
            {slide.title}
          </h2>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 32 }}>
            {slide.body.filter(Boolean).map((line, i) => (
              <p key={i} style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: i >= 4 ? W.text3 : W.text2, lineHeight: 1.6, margin: 0, textAlign: i >= 4 ? 'center' : 'left' }}>
                {line}
              </p>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/" style={{ background: accent, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Open Dashboard
            </a>
            <a href="/lp" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>
              Landing Page
            </a>
          </div>
        </>
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, ${W.violet})`, width: `${((currentSlide + 1) / SLIDES.length) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Slide counter */}
      <div style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 11, color: W.text4, fontFamily: 'var(--font-mono)' }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* Navigation hints */}
      <div style={{ position: 'absolute', bottom: 20, left: 24, fontSize: 10, color: W.text4, letterSpacing: '0.05em' }}>
        ← → navigate · ESC exit
      </div>

      {/* Nav arrows */}
      {currentSlide > 0 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); goPrev() }}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 18 }}
          aria-label="Previous slide"
        >
          ‹
        </button>
      )}
      {currentSlide < SLIDES.length - 1 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); goNext() }}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 18 }}
          aria-label="Next slide"
        >
          ›
        </button>
      )}
    </div>
  )
}
