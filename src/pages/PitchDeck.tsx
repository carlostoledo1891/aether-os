import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'

/* ── Types & Constants ───────────────────────────────────────────── */

interface Slide {
  title: string
  subtitle?: string
  body: string[]
  accent: string
  type: 'cover' | 'content' | 'stats' | 'cta'
}

const ease = [0.16, 1, 0.3, 1] as const

const SLIDES: Slide[] = [
  {
    type: 'cover',
    title: 'Vero',
    subtitle: 'The trust layer for critical mineral supply chains',
    body: ['Meteoric Resources Ltd · ASX: MEI'],
    accent: W.violet,
  },
  {
    type: 'content',
    title: 'The Problem',
    accent: W.red,
    body: [
      '70 % of rare earth production flows through one country — downstream manufacturers have zero visibility into provenance.',
      'US DoD faces 18–24 month procurement delays when FEOC documentation is incomplete.',
      'EU Battery Passport enforcement begins Feb 2027 — no standard tooling exists.',
      'Operators juggle spreadsheets across engineering, permitting, IR, and community. None survives diligence.',
    ],
  },
  {
    type: 'content',
    title: 'Three Truths, One Platform',
    accent: W.violet,
    body: [
      'Ground Truth — Real-time field operations and hydrology on a 3D terrain map with explicit data provenance.',
      'Trade Truth — FEOC, IRA, and EU Digital Battery Passport evidence design with molecular-to-magnet batch traceability.',
      'Board Truth — Financial scenarios, risk register, capital tracker, ESG, and stakeholder management — aligned to board rhythm.',
    ],
  },
  {
    type: 'stats',
    title: 'Pilot Plant Digital Twin',
    accent: W.cyan,
    body: [],
  },
  {
    type: 'content',
    title: 'Platform Architecture',
    accent: W.violet,
    body: [
      '3 audience views — Field Operations · Compliance & Traceability · Executive Overview',
      '27 AI agent tools grounded in project data — geology, financials, compliance, lithology, DPP validation',
      'Real SHA-256 append-only audit chain with programmatic chain verification API',
      'EU DPP-compliant JSON export — 22 CEN/CENELEC fields mapped, schema-validated',
      '310 automated tests · SCADA integration surface · OpenAPI spec at /api/docs',
    ],
  },
  {
    type: 'stats',
    title: 'Security & Enterprise Readiness',
    accent: W.violet,
    body: [],
  },
  {
    type: 'content',
    title: 'Market Opportunity',
    accent: W.green,
    body: [
      'TAM  $18.8 B (2026) → $31.9 B (2031) — Digital mining & smart mining. 11.2 % CAGR.',
      'SAM  $1.6 B (2025) → $5.2 B (2033) — Critical minerals compliance SaaS. 14.2 % CAGR.',
      'SOM  $15 M (2026) → $45 M (2030) — 15 REE projects in allied jurisdictions × $102 k / yr.',
      'EU Battery Passport (Feb 2027) and FEOC requirements are the mandatory adoption catalysts.',
    ],
  },
  {
    type: 'content',
    title: 'Caldeira Project — Flagship',
    accent: W.cyan,
    body: [
      '1.537 Bt ionic clay REE resource across 7 deposits — Poços de Caldas, MG, Brazil.',
      'NPV $821 M (consensus) / $1,985 M (forecast) · IRR 28–39 % pre-tax · 3-year payback.',
      'CAPEX $443 M — 94 % funded (US EXIM $350 M + EFA A$70 M). Breakeven NdPr $22/kg.',
      'LP approved Dec 2025 · DFS mid-2026 · FID H2 2026 · First production 2028.',
      'Offtakers: Ucore (binding, 2,000 tpa) · Neo Performance Materials (LOI, 1,500 tpa).',
    ],
  },
  {
    type: 'stats',
    title: 'Traction',
    accent: W.green,
    body: [],
  },
  {
    type: 'content',
    title: 'The Team',
    accent: W.violet,
    body: [
      'Carlos Toledo — Founder. Born inside the Caldeira. Air Force, full-stack engineer, product designer. Built the entire platform solo — 310 tests, enterprise security, 27 AI tools.',
      'Dr. Heber Caponi — Chief Scientific Advisor (LAPOC). Decades of active Caldeira field research. Bridges simulated to field-verified.',
      'Thiago A. — CEO. Brazilian / international law, enterprise operations, commercial execution.',
      'Ready to scale — codebase architected for immediate team onboarding.',
    ],
  },
  {
    type: 'cta',
    title: 'Valuation & Ask',
    accent: W.violet,
    body: [
      'Pre-revenue consensus: $5–7 M pre-money.',
      '2030 ARR projection: $4.5 M (consensus) · $13 M (bull).',
      'Implied 2030 EV: $55–90 M (consensus) · $130–200 M (bull).',
      'Seed to: hire commercial lead, onboard 5 pilots, connect LAPOC instruments.',
    ],
  },
]

const TWIN_STATS = [
  { value: '17', label: 'Equipment', sub: 'Metso · Andritz · GEA · Outotec' },
  { value: '28', label: 'Sensors', sub: 'Mapped to live telemetry' },
  { value: '7', label: 'Process Steps', sub: 'ROM ore → MREC product' },
  { value: '15', label: 'Flow Paths', sub: 'Animated connections' },
]

const SECURITY_STATS = [
  { value: '310', label: 'Tests', sub: '260 frontend + 50 server' },
  { value: 'CSP', label: 'Headers', sub: 'Content Security Policy' },
  { value: '120', label: 'Rate Limit', sub: 'Requests per minute' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: '14', label: 'Memo\'d', sub: 'Map overlay components' },
  { value: 'ARIA', label: 'Accessible', sub: 'Labels on all controls' },
]

const TRACTION_STATS = [
  { value: '9.3', label: 'Persona Score', sub: '/10 weighted avg' },
  { value: '5 / 9', label: 'At Ceiling', sub: 'Personas at 10.0' },
  { value: '310', label: 'Tests', sub: 'Across 3 packages' },
  { value: '27', label: 'AI Tools', sub: 'Domain-grounded' },
  { value: '17', label: 'Equipment', sub: 'In digital twin' },
  { value: '28', label: 'Sensors', sub: 'Mapped to telemetry' },
  { value: '19', label: 'GeoJSON Sets', sub: 'Integrated' },
  { value: 'SHA-256', label: 'Audit Chain', sub: 'Cryptographic' },
]

/* ── Component ───────────────────────────────────────────────────── */

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const touchRef = useRef({ x: 0, y: 0 })

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentSlide(i => Math.min(i + 1, SLIDES.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentSlide(i => Math.max(i - 1, 0))
  }, [])

  const goTo = useCallback((idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1)
    setCurrentSlide(idx)
  }, [currentSlide])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'Escape') window.location.href = '/'
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext(); else goPrev()
    }
  }, [goNext, goPrev])

  const slide = SLIDES[currentSlide]
  const accent = slide.accent

  const statsData = slide.title === 'Traction'
    ? TRACTION_STATS
    : slide.title === 'Security & Enterprise Readiness'
      ? SECURITY_STATS
      : TWIN_STATS

  return (
    <div
      style={{
        width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
        background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)',
        cursor: 'pointer', userSelect: 'none',
      }}
      onClick={goNext}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, ${accent}0A 0%, transparent 60%)`,
        transition: 'background 0.5s ease',
      }} />

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10 }}>
        <motion.div
          animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.35, ease }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, ${W.violet})` }}
        />
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction * -80, scale: 0.98 }}
          transition={{ duration: 0.4, ease }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '56px 72px',
          }}
        >

          {/* ── Cover ──────────────────────────────────────────── */}
          {slide.type === 'cover' && (
            <>
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', width: '50vw', height: '50vw', borderRadius: '50%',
                  background: `radial-gradient(circle, ${accent}14, transparent 70%)`,
                  top: '-10vw', left: '25vw', filter: 'blur(80px)', pointerEvents: 'none',
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                style={{
                  width: 56, height: 56, background: accent, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32,
                }}
              >
                V
              </motion.div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em',
                color: W.text4, marginBottom: 20,
              }}>
                {slide.body[0]}
              </div>
              <h1 style={{
                fontSize: 'clamp(56px, 9vw, 96px)', fontWeight: 800, lineHeight: 1.0,
                marginBottom: 24,
                background: `linear-gradient(135deg, ${W.text1} 30%, ${accent})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: 'clamp(16px, 2.2vw, 22px)', color: W.text3,
                maxWidth: 560, lineHeight: 1.5, marginBottom: 40,
              }}>
                {slide.subtitle}
              </p>
              <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { value: '9.3', label: 'Persona Score' },
                  { value: '310', label: 'Tests' },
                  { value: '27', label: 'AI Tools' },
                  { value: 'SHA-256', label: 'Audit Chain' },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    textAlign: 'center', padding: '0 28px',
                    borderLeft: i > 0 ? `1px solid ${W.glass08}` : 'none',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: W.text4, marginTop: 3, letterSpacing: '0.04em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Content ────────────────────────────────────────── */}
          {slide.type === 'content' && (
            <>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1,
                marginBottom: 40,
              }}>
                {slide.title}
              </h2>
              <div style={{
                maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left',
              }}>
                {slide.body.map((line, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', background: accent,
                      marginTop: 9, flexShrink: 0, boxShadow: `0 0 8px ${accent}50`,
                    }} />
                    <p style={{
                      fontSize: 'clamp(14px, 1.6vw, 17px)', color: W.text2,
                      lineHeight: 1.65, margin: 0,
                    }}>
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Stats ──────────────────────────────────────────── */}
          {slide.type === 'stats' && (
            <>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1,
                marginBottom: 48,
              }}>
                {slide.title}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${statsData.length <= 4 ? statsData.length : 4}, 1fr)`,
                gap: 16, maxWidth: 800, width: '100%',
              }}>
                {statsData.map(s => (
                  <div key={s.label} style={{
                    padding: '24px 16px',
                    background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: accent,
                      fontFamily: 'var(--font-mono)', lineHeight: 1.1,
                    }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: W.text1, marginTop: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: W.text4, marginTop: 3 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── CTA ────────────────────────────────────────────── */}
          {slide.type === 'cta' && (
            <>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1,
                marginBottom: 40,
                background: `linear-gradient(135deg, ${W.text1} 40%, ${accent})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {slide.title}
              </h2>
              <div style={{
                maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 12,
                textAlign: 'left', marginBottom: 40,
              }}>
                {slide.body.map((line, i) => (
                  <p key={i} style={{
                    fontSize: 'clamp(14px, 1.6vw, 17px)', color: W.text2,
                    lineHeight: 1.6, margin: 0,
                  }}>
                    {line}
                  </p>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a
                  href="/"
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: accent, color: '#fff', padding: '14px 32px', borderRadius: 8,
                    fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Open Platform
                </a>
                <a
                  href="/lp"
                  onClick={e => e.stopPropagation()}
                  style={{
                    border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px',
                    borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent',
                  }}
                >
                  Website
                </a>
                <a
                  href="mailto:contact@meteoric.tech"
                  onClick={e => e.stopPropagation()}
                  style={{
                    border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px',
                    borderRadius: 8, fontSize: 15, textDecoration: 'none', background: 'transparent',
                  }}
                >
                  contact@meteoric.tech
                </a>
              </div>
            </>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ── Nav Arrows ────────────────────────────────────────── */}
      {currentSlide > 0 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); goPrev() }}
          aria-label="Previous slide"
          style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: W.text2, cursor: 'pointer', fontSize: 20,
          }}
        >
          ‹
        </button>
      )}
      {currentSlide < SLIDES.length - 1 && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); goNext() }}
          aria-label="Next slide"
          style={{
            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            background: W.glass06, border: `1px solid ${W.glass08}`, borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: W.text2, cursor: 'pointer', fontSize: 20,
          }}
        >
          ›
        </button>
      )}

      {/* ── Progress Dots ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={e => { e.stopPropagation(); goTo(i) }}
            style={{
              width: i === currentSlide ? 24 : 6, height: 6, borderRadius: 3, border: 'none',
              background: i === currentSlide ? accent : W.glass12, cursor: 'pointer', padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* ── Slide Counter ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 20, right: 24, fontSize: 11,
        color: W.text4, fontFamily: 'var(--font-mono)', zIndex: 10,
      }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* ── Keyboard Hints ────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 20, left: 24, fontSize: 10,
        color: W.text4, letterSpacing: '0.04em', zIndex: 10,
      }}>
        ← → navigate · ESC exit
      </div>
    </div>
  )
}
