import { useState, useCallback, useEffect } from 'react'
import { W } from '../app/canvas/canvasTheme'

interface Slide {
  title: string
  subtitle?: string
  body: string
  type: 'cover' | 'content' | 'cta'
}

const SLIDES: Slide[] = [
  {
    title: 'Vero',
    subtitle: 'AI-Powered Rare Earth Operating System',
    body: 'Meteoric Resources Ltd (ASX: MEI)',
    type: 'cover',
  },
  {
    title: 'The Problem',
    body: 'Rare earth supply chains are opaque, concentrated, and vulnerable. Downstream manufacturers have zero visibility into provenance, environmental impact, or supply continuity. New regulations (EU Battery Regulation, US CHIPS Act) demand verifiable traceability.',
    type: 'content',
  },
  {
    title: 'The Solution',
    body: 'Vero unifies geological intelligence, plant operations, regulatory compliance, and buyer-facing digital product passports into a single AI-native platform. Full-stack traceability from mine to magnet.',
    type: 'content',
  },
  {
    title: 'Platform Architecture',
    body: '5 persona views: Executive Overview · Field Operations · Hydro Twin · Buyer Portal · Community Notice\n\n25 AI agent tools · 218+ automated tests · EU DPP compliant · SHA-256 audit trail · SCADA integration ready',
    type: 'content',
  },
  {
    title: 'Market Opportunity',
    body: '$12B+ rare earth market growing 8% CAGR. Supply chain software TAM of $2.4B by 2028. First-mover advantage in AI-native rare earth traceability. No direct competitors combining geology + operations + compliance + traceability.',
    type: 'content',
  },
  {
    title: 'Caldeira Project',
    body: 'World-class ionic clay rare earth deposit in Minas Gerais, Brazil. 193 km² alkaline complex. 205 drill holes with lithological characterization. Low-acid leaching process with 68% renewable energy. NdPr focus for EV magnet supply chain.',
    type: 'content',
  },
  {
    title: 'Technology Differentiators',
    body: '• AI-native: 25 specialized agent tools for geological, operational, and compliance queries\n• Real-time: Live telemetry from plant + environmental sensors\n• Blockchain-ready: SHA-256 hash chain with Merkle root anchoring roadmap\n• EU DPP: Schema-validated digital product passports\n• Multi-persona: Tailored views for executives, operators, buyers, regulators, and communities',
    type: 'content',
  },
  {
    title: 'Traction & Roadmap',
    body: 'v10: 18 UX improvements shipped · SCADA integration surface · Blockchain strategy defined\n\nQ3 2026: OPC-UA bridge · Merkle root anchoring · Customer pilot\nQ4 2026: MQTT support · Smart contract (if demand)\n2027: SaaS launch for other rare earth producers',
    type: 'content',
  },
  {
    title: 'The Ask',
    body: 'Seed investment to accelerate Vero platform development, onboard first pilot customers, and prepare for SaaS launch.\n\ncontact@meteoric.tech',
    type: 'cta',
  },
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

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: W.bg,
        color: W.text1,
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 60px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={goNext}
    >
      {slide.type === 'cover' && (
        <>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: W.violet, marginBottom: 24 }}>
            {slide.body}
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 16 }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: W.text3, maxWidth: 600, lineHeight: 1.5 }}>
            {slide.subtitle}
          </p>
        </>
      )}

      {slide.type === 'content' && (
        <>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, marginBottom: 24, lineHeight: 1.1 }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 20px)', color: W.text3, maxWidth: 700, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {slide.body}
          </p>
        </>
      )}

      {slide.type === 'cta' && (
        <>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, marginBottom: 24 }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 20px)', color: W.text3, maxWidth: 600, lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 32 }}>
            {slide.body}
          </p>
          <a href="/" style={{ background: W.violet, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Open Dashboard
          </a>
        </>
      )}

      {/* Slide counter */}
      <div style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 12, color: W.text4 }}>
        {currentSlide + 1} / {SLIDES.length}
      </div>

      {/* Navigation hints */}
      <div style={{ position: 'absolute', bottom: 20, left: 24, fontSize: 11, color: W.text4 }}>
        ← → to navigate · ESC to exit
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3 }}>
        <div style={{ height: '100%', background: W.violet, width: `${((currentSlide + 1) / SLIDES.length) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Nav arrows */}
      {currentSlide > 0 && (
        <button
          onClick={e => { e.stopPropagation(); goPrev() }}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 18 }}
        >
          ‹
        </button>
      )}
      {currentSlide < SLIDES.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); goNext() }}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text2, cursor: 'pointer', fontSize: 18 }}
        >
          ›
        </button>
      )}
    </div>
  )
}
