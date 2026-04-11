import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { DeckShell, Terminal, StatCard, Bullet, GlassRow, Tag } from '../components/deck'
import { PRODUCT_ROADMAP } from '../data/domain/roadmap'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { LicenseOverlay } from '../components/map/LicenseOverlay'
import { EnvironmentalOverlay } from '../components/map/EnvironmentalOverlay'

const MiniMap = lazy(() => import('./meteoric/MiniMap'))
const DeckCountdown = lazy(() => import('./meteoric/DeckCountdown'))
const AnimatedStat = lazy(() => import('./meteoric/AnimatedStat'))
const FakeChat = lazy(() => import('./meteoric/FakeChat'))

const EU_DPP_DATE = new Date('2027-02-01T00:00:00Z')

const CALDEIRA_CENTER: [number, number] = [-46.555, -21.88]

function ApiPingBadge() {
  const [status, setStatus] = useState<'checking' | 'live' | 'offline'>('checking')
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/health', { signal: ctrl.signal, cache: 'no-store' })
      .then(r => setStatus(r.ok ? 'live' : 'offline'))
      .catch(() => setStatus('offline'))
    return () => ctrl.abort()
  }, [])
  const color = status === 'live' ? W.green : status === 'offline' ? W.text4 : W.amber
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: W.glass04, borderRadius: 6, border: `1px solid ${W.glass06}` }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: status === 'live' ? `0 0 6px ${W.green}60` : 'none' }} />
      <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
        {status === 'live' ? 'API Live' : status === 'offline' ? 'API Offline' : 'Checking…'}
      </span>
    </div>
  )
}

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

/* ── Slides ──────────────────────────────────────────────────────── */

type SlideType =
  | 'cover' | 'stats' | 'bullets' | 'code' | 'dataviz'
  | 'geology' | 'executive' | 'governance'
  | 'timeline' | 'reasons' | 'standard' | 'roadmap'
  | 'hydro' | 'traceability'
  | 'team' | 'cta'

interface SlideData { type: SlideType; title: string; subtitle?: string }

const SLIDES: SlideData[] = [
  { type: 'cover', title: 'Vero for Caldeira', subtitle: 'Your digital twin is already built.\nNow connect it to live data.' },
  { type: 'stats', title: 'Already Built on Your Data', subtitle: 'built' },
  { type: 'bullets', title: 'Three Views, One Platform', subtitle: 'views' },
  { type: 'geology', title: 'Geology & Data Integrity' },
  { type: 'executive', title: 'Executive & Capital Intelligence' },
  { type: 'governance', title: 'Governance & Disclosure Safety' },
  { type: 'code', title: 'Ready for Live Data', subtitle: 'integration' },
  { type: 'dataviz', title: 'Any Data. Any Visualization.' },
  { type: 'bullets', title: '27 AI Tools — and Growing', subtitle: 'ai' },
  { type: 'stats', title: 'Security & Enterprise Readiness', subtitle: 'security' },
  { type: 'reasons', title: 'Why Sign This Quarter' },
  { type: 'timeline', title: '90 Days to Live Data' },
  { type: 'hydro', title: 'The Hydro Story' },
  { type: 'traceability', title: 'Traceability in Action' },
  { type: 'roadmap', title: 'Product Roadmap' },
  { type: 'standard', title: 'Vero Becomes Market Standard' },
  { type: 'team', title: 'The Team Behind Vero' },
  { type: 'cta', title: 'Let\'s Make It Official' },
]

const BUILT_STATS = [
  { value: '17', label: 'Equipment', sub: 'Metso · Andritz · GEA' },
  { value: '28', label: 'Sensors', sub: 'Pre-configured channels' },
  { value: '19', label: 'GeoJSON', sub: 'Datasets integrated' },
  { value: '27', label: 'AI Tools', sub: 'Domain-grounded' },
]

const SECURITY_STATS = [
  { value: '310', label: 'Tests', sub: '260 + 50' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'CSP', label: 'Headers', sub: 'Security policy' },
  { value: '120', label: 'Rate Limit', sub: 'req / min' },
]

const TIMELINE = [
  { week: '0–2', label: 'Contract + API keys + LAPOC mapping' },
  { week: '2–4', label: 'First live sensor data flowing' },
  { week: '4–6', label: 'Custom DFS presentation views' },
  { week: '6–8', label: 'Community dashboard review' },
  { week: '8–12', label: 'Full production · board-ready' },
]

const REASONS = [
  'DFS mid-2026 — the dashboard should be live when the DFS drops.',
  'Vero becomes market standard. Meteoric gets it 18 months early — and shapes the standard.',
  'Competitive signaling. An interactive digital twin that Lynas and MP Materials don\'t have.',
  'Due diligence speed. Every question has a dashboard answer. Raises close faster.',
  'Community trust. The Prefeitura dashboard is built — Poços sees transparency in Portuguese.',
]

const STANDARDS = [
  { driver: 'EU Battery Passport', date: 'Feb 2027', status: '22 / 37 fields mapped' },
  { driver: 'US FEOC requirements', date: 'Active', status: 'Origin tracking + audit chain' },
  { driver: 'Australian ESG reporting', date: '2025+', status: 'ESG frameworks integrated' },
  { driver: 'CEN/CENELEC DPP schema', date: 'In progress', status: 'Schema-validated JSON' },
]

const DATAVIZ_ITEMS = [
  '3D terrain maps with custom GeoJSON overlays',
  'Process flow digital twins with animated connections',
  'Time series charts with live data binding',
  'Gauge dashboards for sensor monitoring',
  'Bar / line / area charts for financial scenarios',
  'Heatmaps and contour overlays for geological data',
  '14 custom overlay layer types',
  'Bilingual community dashboards (PT/EN)',
]

const TEAM_MEMBERS = [
  { name: 'Carlos Toledo', role: 'Founder · Product & Technical Lead', bg: 'Air Force pilot, full-stack engineer, product designer. Born and raised in the Caldeira — 40 years of local context. Built the entire platform solo: 310 tests, 27 AI tools, pilot plant digital twin.', accent: V },
  { name: 'Guilherme Bonifácio', role: 'Co-founder · Commercial Strategy', bg: 'iFood co-founder. Kanoa Capital. 110+ angel investments. FEA-USP Economics. Leads GTM, investor pipeline, revenue strategy, and commercial execution.', accent: V },
  { name: 'Juliano Dutra', role: 'Co-founder · Technical Advisor', bg: 'iFood co-founder. Gringo CTO. 20+ angel investments. Unicamp CS. Architecture review, engineering mentorship, hiring bar, and scaling guidance.', accent: V },
  { name: 'Dr. Heber Caponi', role: 'Scientific Advisor · LAPOC', bg: 'Decades of active Caldeira field research through LAPOC (CNEN). The bridge from simulated to field-verified data. Piezometers, water quality, geological sampling.', accent: W.amber },
]

/* ── Component ───────────────────────────────────────────────────── */

export default function MeteoricDeck() {
  return (
    <DeckShell count={SLIDES.length} padding="48px 64px">
      {(idx) => {
        const slide = SLIDES[idx]
        const statsData = slide.subtitle === 'security' ? SECURITY_STATS : BUILT_STATS

        return (<>
          {/* ── Cover with background MiniMap ───────────────────── */}
          {slide.type === 'cover' && (<>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25 }}>
              <Suspense fallback={null}>
                <MiniMap
                  id="meteoric-cover-map"
                  center={CALDEIRA_CENTER}
                  zoom={11.5}
                  pitch={50}
                  bearing={-15}
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                />
              </Suspense>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${W.bg}dd 0%, ${W.bg}88 40%, ${W.bg}dd 100%)` }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
                style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Meteoric Resources Ltd · ASX: MEI</div>
              <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                {slide.title}
              </h1>
              <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 520, lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>{slide.subtitle}</p>
              <div style={{ marginTop: 40 }}>
                <GlassRow items={[{ label: 'Equipment', value: '17' }, { label: 'Sensors', value: '28' }, { label: 'GeoJSON', value: '19' }, { label: 'AI Tools', value: '27' }, { label: 'Tests', value: '310' }]} />
              </div>
            </div>
          </>)}

          {/* ── Stats ──────────────────────────────────────────── */}
          {slide.type === 'stats' && (<>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statsData.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
              {statsData.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <p style={{ fontSize: 12, color: W.text4, marginTop: 20, maxWidth: 600, lineHeight: 1.5 }}>
              Built from a mix of public datasets, government data, Meteoric ASX announcements, live APIs (weather, seismic, PTAX), and independent research.
            </p>
          </>)}

          {/* ── Bullets ────────────────────────────────────────── */}
          {slide.type === 'bullets' && (<>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            {slide.subtitle === 'views' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 940, width: '100%' }}>
                {[
                  { view: 'Field Operations', who: 'Geologists, operators', what: '3D terrain, drill collars, pilot plant twin, hydro monitoring' },
                  { view: 'Compliance', who: 'Buyers, auditors', what: 'FEOC tracking, DPP export, SHA-256 audit chain' },
                  { view: 'Executive', who: 'Board, investors, ECAs', what: 'Financial scenarios, risk register, capital tracker' },
                ].map(v => (
                  <div key={v.view} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -20, left: 0, right: 0, height: 2, background: V, opacity: 0.5, borderRadius: 1 }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{v.view}</div>
                    <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 8 }}>{v.who}</div>
                    <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
                  </div>
                ))}
              </div>
            )}
            {slide.subtitle === 'ai' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 940, width: '100%', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Bullet>Geology: lithology analysis, resource classification, drill log interpretation</Bullet>
                  <Bullet>Financial: scenario modeling, NPV sensitivity, CAPEX tracking</Bullet>
                  <Bullet>Compliance: DPP field validation, FEOC verification, audit chain queries</Bullet>
                  <Bullet>Environmental: water quality assessment, spring status interpretation</Bullet>
                  <div style={{ marginTop: 8, background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
                    <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>Hallucination fence</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: W.text2, lineHeight: 1.6 }}>
                      <span style={{ color: W.green }}>✓</span> 11 guardrail tests · 100% pass<br />
                      <span style={{ color: W.green }}>✓</span> Refuses lithium queries<br />
                      <span style={{ color: W.green }}>✓</span> Source citation on every answer
                    </div>
                  </div>
                  <div style={{ marginTop: 4, background: `${V}08`, border: `1px dashed ${V}50`, borderRadius: 10, padding: '10px 14px', textAlign: 'left' }}>
                    <span style={{ fontSize: 11, color: V, fontWeight: 600 }}>AI workflows are project-specific.</span>
                    <span style={{ fontSize: 11, color: W.text3 }}> Best-in-class models, swappable per use case via Vercel AI SDK. New tools deploy without downtime.</span>
                  </div>
                </div>
                <Suspense fallback={null}>
                  <FakeChat />
                </Suspense>
              </div>
            )}
          </>)}

          {/* ── Geology & Data Integrity ────────────────────────── */}
          {slide.type === 'geology' && (
            <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
                <MiniMap
                  id="meteoric-geology-map"
                  center={CALDEIRA_CENTER}
                  zoom={10.5}
                  pitch={40}
                  bearing={0}
                  interactive
                  flyTo={{ center: [-46.48, -21.85], zoom: 13, pitch: 45, duration: 4000 }}
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                >
                  <CaldeiraBoundary />
                  <LicenseOverlay />
                </MiniMap>
              </Suspense>

              {/* Glass overlay panel */}
              <div style={{ position: 'absolute', top: 40, right: 24, width: 320, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 6, pointerEvents: 'auto' }}>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '16px 16px' }}>
                  <Tag>Data Integrity</Tag>
                  <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 8, marginBottom: 12, color: W.text1 }}>{slide.title}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
                    <Suspense fallback={<StatCard value="19" label="GeoJSON" sub="Schema-tested" />}>
                      <AnimatedStat value={19} label="GeoJSON Datasets" sub="Schema-tested" />
                    </Suspense>
                    <Suspense fallback={<StatCard value="100" label="Source Labels" sub="%" />}>
                      <AnimatedStat value={100} label="Source Labels" suffix="%" sub="Modeled / public / field" />
                    </Suspense>
                  </div>
                  <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Geological Layers</div>
                  {['Drill collars with trace metadata', 'Deposit polygons with ASX source refs', 'Resource classification (JORC Table 1)', 'Lithology domains & grade distribution', 'Competent Person–safe labeling'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: V, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Hydrological Layers</div>
                  {['Spring monitoring network (modeled)', 'Piezometer locations and readings', 'Water quality parameters (pH, conductivity)'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: W.cyan, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ position: 'absolute', bottom: 48, left: 24, display: 'flex', gap: 6, zIndex: 6 }}>
                {[
                  { label: 'License Areas', color: V },
                  { label: 'Caldeira Boundary', color: W.cyan },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{l.label}</span>
                  </div>
                ))}
              </div>

              <p style={{ position: 'absolute', bottom: 48, right: 24, fontSize: 10, color: W.text4, maxWidth: 320, textAlign: 'right', zIndex: 6 }}>
                Geology and hydrology are visually separated — the digital twin never pretends to prove the deposit.
              </p>
            </div>
          )}

          {/* ── Executive & Capital ─────────────────────────────── */}
          {slide.type === 'executive' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Executive Overview</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 880, width: '100%', marginBottom: 20 }}>
              <Suspense fallback={<StatCard value="9" label="Dashboard Tabs" sub="Synchronized" />}>
                <AnimatedStat value={9} label="Dashboard Tabs" sub="Synchronized to board rhythm" />
              </Suspense>
              <Suspense fallback={<StatCard value="3" label="Financial Scenarios" sub="Bear / Consensus / Bull" />}>
                <AnimatedStat value={3} label="Financial Scenarios" sub="Bear / Consensus / Bull" />
              </Suspense>
              <Suspense fallback={<StatCard value="443" label="CAPEX Tracked" sub="$M" />}>
                <AnimatedStat value={443} label="CAPEX Tracked" prefix="$" suffix="M" sub="One-click answer" />
              </Suspense>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 880, width: '100%', marginBottom: 16 }}>
              {[
                { tab: 'Financials', desc: 'NPV sensitivity, IRR, DSCR, CAPEX breakdown, C1/AISC costs' },
                { tab: 'Capital', desc: 'DFS milestone bars, CPs, funding tracker, construction loan status' },
                { tab: 'Risk Register', desc: 'Top-decile risks with owners, mitigations, last-reviewed cadence' },
                { tab: 'Assets', desc: 'Resource overview, deposit geometry, issuer snapshot with ASX links' },
                { tab: 'ESG', desc: 'Environmental metrics, community engagement, regulatory compliance status' },
                { tab: 'Pipeline', desc: 'Offtake tracker with binding vs LOI labels, counterparty status' },
              ].map(t => (
                <div key={t.tab} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '14px 12px', textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: V, marginBottom: 4 }}>{t.tab}</div>
                  <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: W.text4, maxWidth: 600 }}>
              Every tab maps to a board agenda item. One narrative, zero contradictions. Your next raise closes faster when every diligence question has a dashboard answer.
            </p>
          </>)}

          {/* ── Governance & Disclosure ─────────────────────────── */}
          {slide.type === 'governance' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Governance</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 880, width: '100%', marginBottom: 20 }}>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Data Honesty Modes</div>
                {[
                  { mode: 'Mock', desc: 'Development and testing — clearly labeled, no confusion with production data' },
                  { mode: 'Presentation', desc: 'Demo mode — realistic scenarios with visible "illustrative" banners' },
                  { mode: 'Disclosure', desc: 'Market-safe mode — hides sensitive figures, shows only public information' },
                  { mode: 'Live', desc: 'Production — field-verified data with provenance metadata on every reading' },
                ].map(m => (
                  <div key={m.mode} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', minWidth: 80 }}>{m.mode}</div>
                    <span style={{ fontSize: 12, color: W.text2, lineHeight: 1.5 }}>{m.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Screenshot Safety</div>
                {[
                  'Every screen carries a visible data honesty banner',
                  'Disclosure mode hides board-sensitive figures automatically',
                  'Simulated data is always labeled — no screenshot can imply attestation',
                  'Field-to-filing-to-market: one coherent narrative, zero contradictions',
                  'SHA-256 audit trail — every event hashed and timestamped',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: W.green, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: W.text2, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: W.text4, maxWidth: 600 }}>
              No screenshot from Vero can be misread as certification or attestation. Continuous disclosure safety is built into every mode.
            </p>
          </>)}

          {/* ── Code / Integration ──────────────────────────────── */}
          {slide.type === 'code' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <ApiPingBadge />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, maxWidth: 960, width: '100%', marginTop: 16 }}>
              <Terminal title="REST API · /api/telemetry">
                <span style={{ color: W.text4 }}>{'// Live sensor data'}</span><br />
                {'{ '}<span style={{ color: W.green }}>"channel"</span>{': '}<span style={{ color: W.green }}>"ph_meter"</span>{','}<br />
                {'  '}<span style={{ color: W.green }}>"value"</span>{': '}<span style={{ color: W.cyan }}>2.41</span>{','}<br />
                {'  '}<span style={{ color: W.green }}>"source"</span>{': '}<span style={{ color: W.green }}>"lapoc_field"</span>{' }'}
              </Terminal>
              <Terminal title="WebSocket · live telemetry">
                <span style={{ color: V }}>ws</span>{'.on('}<span style={{ color: W.green }}>'telemetry'</span>{', d => {'}<br />
                {'  updateSensor(d.channel, d.value)'}<br />
                {'  '}<span style={{ color: W.text4 }}>{'// < 2s refresh cycle'}</span><br />
                {'})'}
              </Terminal>
              <Terminal title="SCADA · OPC-UA surface">
                <span style={{ color: W.text4 }}>{'// Integration surface ready'}</span><br />
                <span style={{ color: V }}>connector</span>{'.map({'}<br />
                {'  opcua: '}<span style={{ color: W.green }}>'equipment/*'</span>{','}<br />
                {'  mqtt: '}<span style={{ color: W.green }}>'sensors/#'</span>{','}<br />
                {'  csv: '}<span style={{ color: W.green }}>'historical/*'</span><br />
                {'})'}
              </Terminal>
            </div>
            <p style={{ fontSize: 13, color: W.text4, marginTop: 20, maxWidth: 500 }}>
              When live data connects: "Simulated" labels become "Field-verified." Every reading carries provenance metadata.
            </p>
          </>)}

          {/* ── DataViz ────────────────────────────────────────── */}
          {slide.type === 'dataviz' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, maxWidth: 880, width: '100%' }}>
              {DATAVIZ_ITEMS.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '12px 16px', textAlign: 'left' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, flexShrink: 0, boxShadow: `0 0 6px ${V}40` }} />
                  <span style={{ fontSize: 13, color: W.text2 }}>{item}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${V}08`, border: `1px dashed ${V}60`, borderRadius: 10, padding: '12px 16px', textAlign: 'left' }}>
                <div style={{ fontSize: 16, flexShrink: 0 }}>+</div>
                <span style={{ fontSize: 13, color: V, fontWeight: 600 }}>Connect any dataset, API, or sensor feed to extend the platform for your project</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: W.text4, marginTop: 20 }}>
              Prefeitura de Poços de Caldas dashboard already live at <span style={{ color: V, fontFamily: 'var(--font-mono)' }}>/view/prefeitura-pocos</span>
            </p>
          </>)}

          {/* ── Reasons ────────────────────────────────────────── */}
          {slide.type === 'reasons' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>{slide.title}</h2>
            <div style={{ marginBottom: 24 }}>
              <Suspense fallback={null}>
                <DeckCountdown target={EU_DPP_DATE} />
              </Suspense>
            </div>
            <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REASONS.map((r, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left' }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 14, color: W.text2, lineHeight: 1.6, margin: 0 }}>{r}</p>
                </motion.div>
              ))}
            </div>
          </>)}

          {/* ── Timeline ───────────────────────────────────────── */}
          {slide.type === 'timeline' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ maxWidth: 900, width: '100%', position: 'relative' }}>
              {/* Animated horizontal progress line */}
              <svg style={{ position: 'absolute', top: 19, left: 0, width: '100%', height: 2, overflow: 'visible', zIndex: 0 }}>
                <motion.line
                  x1="0" y1="1" x2="100%" y2="1"
                  stroke={V} strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 19, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${V}60, ${V}10)` }} />
              <div style={{ display: 'flex', gap: 0 }}>
                {TIMELINE.map((t, i) => (
                  <motion.div key={t.week}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.15, ease }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>W{t.week}</span>
                    </div>
                    <p style={{ fontSize: 12, color: i === TIMELINE.length - 1 ? W.text1 : W.text2, lineHeight: 1.4, margin: '10px 0 0', fontWeight: i === TIMELINE.length - 1 ? 700 : 400, textAlign: 'center', padding: '0 4px' }}>{t.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <GlassRow items={[{ label: 'Annual Cost', value: '$102k' }, { label: '% of NPV', value: '0.013%' }, { label: 'NPV Consensus', value: '$821M' }]} />
            </div>
          </>)}

          {/* ── Hydro Story ──────────────────────────────────────── */}
          {slide.type === 'hydro' && (
            <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
                <MiniMap
                  id="meteoric-hydro-map"
                  center={CALDEIRA_CENTER}
                  zoom={11}
                  pitch={30}
                  bearing={10}
                  interactive
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                >
                  <EnvironmentalOverlay showApa showBuffer showMonitoring />
                  <CaldeiraBoundary />
                </MiniMap>
              </Suspense>

              {/* Glass overlay panel */}
              <div style={{ position: 'absolute', top: 40, right: 24, width: 300, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 6, pointerEvents: 'auto' }}>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '16px 16px' }}>
                  <Tag>Hydrology</Tag>
                  <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 8, marginBottom: 12, color: W.text1 }}>{slide.title}</h2>
                  <Suspense fallback={null}>
                    <AnimatedStat value={1092} label="Springs Monitored" sub="Complete hydrological network" prefix="" />
                  </Suspense>
                </div>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Environmental Layers</div>
                  {['APA boundary with buffer zones', 'Spring network (pH, conductivity, flow)', 'Piezometer stations with readings', 'FEAM/IGAM compliance zones', 'Community monitoring interface'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: W.cyan, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: W.text2, lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>LAPOC Pipeline</div>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: '0 0 8px' }}>
                    Today: modeled from public datasets — labeled <span style={{ color: W.text4 }}>"simulated"</span>.
                  </p>
                  <p style={{ fontSize: 11, color: W.text2, lineHeight: 1.5, margin: 0 }}>
                    With live data: LAPOC/CNEN sensors feed directly. Labels become <span style={{ color: W.green }}>"field-verified"</span>. Zero code changes.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ label: 'Piezometers', value: 'Pre-mapped' }, { label: 'Quality', value: '5 params' }, { label: 'Refresh', value: '< 2s' }].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', flex: 1, padding: '6px 0', background: 'rgba(10,10,18,0.82)', borderRadius: 8, border: `1px solid ${W.glass08}`, backdropFilter: 'blur(16px)' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: W.cyan, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                      <div style={{ fontSize: 8, color: W.text4, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ position: 'absolute', bottom: 48, left: 24, display: 'flex', gap: 6, zIndex: 6 }}>
                {[
                  { label: 'APA Boundary', color: W.cyan },
                  { label: 'Monitoring Zone', color: '#3b82f6' },
                  { label: 'Buffer Zone', color: `${W.cyan}60` },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Traceability ─────────────────────────────────────── */}
          {slide.type === 'traceability' && (
            <div style={{ position: 'absolute', inset: 0 }} onClick={e => e.stopPropagation()}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', background: W.glass04 }} />}>
                <MiniMap
                  id="meteoric-trace-map"
                  center={[40, 5]}
                  zoom={1.5}
                  pitch={0}
                  bearing={0}
                  interactive
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                />
              </Suspense>

              {/* Supply route overlay markers */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
                {[
                  { label: 'Caldeira', x: '28%', y: '52%', color: V },
                  { label: 'Santos Port', x: '30%', y: '56%', color: V },
                  { label: 'Toyota, JP', x: '82%', y: '30%', color: W.green },
                ].map(p => (
                  <div key={p.label} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}80`, marginBottom: 2, marginInline: 'auto' }} />
                    <div style={{ fontSize: 9, color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>{p.label}</div>
                  </div>
                ))}
              </div>

              {/* Glass overlay — supply chain flow + stats */}
              <div style={{ position: 'absolute', top: 40, left: 24, right: 24, zIndex: 6, pointerEvents: 'auto' }}>
                <div style={{ background: 'rgba(10,10,18,0.82)', backdropFilter: 'blur(16px)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '16px 20px', maxWidth: 720, margin: '0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Tag>Traceability</Tag>
                    <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, color: W.text1, margin: 0 }}>{slide.title}</h2>
                  </div>
                  {/* Supply chain flow */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0, position: 'relative', marginBottom: 14 }}>
                    <div style={{ position: 'absolute', top: '50%', left: 28, right: 28, height: 2, background: `linear-gradient(90deg, ${V}60, ${W.green}60)`, transform: 'translateY(-50%)' }} />
                    {[
                      { step: 'Extraction', loc: 'Caldeira, MG', status: 'verified', icon: '⛏' },
                      { step: 'Processing', loc: 'AMSUL Pilot', status: 'verified', icon: '🏭' },
                      { step: 'Quality', loc: 'Lab Analysis', status: 'verified', icon: '🔬' },
                      { step: 'Compliance', loc: 'DPP Export', status: 'active', icon: '📋' },
                      { step: 'Transport', loc: 'Port → Buyer', status: 'pending', icon: '🚢' },
                      { step: 'Delivery', loc: 'Toyota, JP', status: 'pending', icon: '🏢' },
                    ].map(s => {
                      const c = s.status === 'verified' ? W.green : s.status === 'active' ? V : W.text4
                      return (
                        <div key={s.step} style={{ textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, margin: '0 auto 4px',
                            background: s.status === 'verified' ? `${W.green}15` : s.status === 'active' ? `${V}15` : W.glass04,
                            border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                          }}>{s.icon}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: c }}>{s.step}</div>
                          <div style={{ fontSize: 7, color: W.text4, marginTop: 1 }}>{s.loc}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Audit Chain', value: 'SHA-256', desc: 'Hashed & timestamped' },
                      { label: 'DPP Fields', value: '22 / 37', desc: 'CEN/CENELEC validated' },
                      { label: 'Origin Proof', value: 'FEOC Ready', desc: 'IRA credit verification' },
                    ].map(s => (
                      <div key={s.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: W.text1, marginTop: 2 }}>{s.label}</div>
                        <div style={{ fontSize: 8, color: W.text4, marginTop: 1 }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ position: 'absolute', bottom: 48, left: 24, right: 24, fontSize: 10, color: W.text4, textAlign: 'center', zIndex: 6 }}>
                From Caldeira drill collar to Toyota assembly line — every handoff is traceable. Blockchain anchoring on the roadmap.
              </p>
            </div>
          )}

          {/* ── Roadmap ─────────────────────────────────────────── */}
          {slide.type === 'roadmap' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Roadmap</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 960, width: '100%' }}>
              {PRODUCT_ROADMAP.map(phase => {
                const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
                const meteoricItems = phase.items.filter(it =>
                  it.tag === 'infra' || it.tag === 'compliance' || it.title.includes('LAPOC') || it.title.includes('OPC') || it.title.includes('Multi-Project') || it.title.includes('Covenant') || it.title.includes('Blockchain')
                )
                const items = meteoricItems.length > 0 ? meteoricItems.slice(0, 4) : phase.items.slice(0, 3)
                return (
                  <div key={phase.id} style={{ background: W.glass04, border: `1px solid ${phase.status === 'active' ? V : W.glass06}`, borderRadius: 14, padding: '16px 14px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                    {phase.status === 'active' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: V }} />}
                    <div style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{phase.quarter}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 10 }}>{phase.title}</div>
                    {items.map(item => (
                      <div key={item.title} style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: W.text2 }}>{item.title}</div>
                        <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4, marginTop: 1 }}>{item.description.slice(0, 50)}…</div>
                      </div>
                    ))}
                    <span style={{
                      fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 6px', borderRadius: 3, marginTop: 6, display: 'inline-block',
                      background: phase.status === 'active' ? `${V}20` : W.glass04, color: accent,
                    }}>{phase.status}</span>
                  </div>
                )
              })}
            </div>
          </>)}

          {/* ── Standard ───────────────────────────────────────── */}
          {slide.type === 'standard' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ maxWidth: 860, width: '100%' }}>
              {STANDARDS.map(s => (
                <div key={s.driver} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${W.glass06}`, textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>{s.driver}</div>
                    <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{s.date}</div>
                  </div>
                  <div style={{ fontSize: 13, color: V, fontWeight: 600, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{s.status}</div>
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 720, marginTop: 28 }}>
              <Bullet>Meteoric shapes the DPP schema with us — not after the standard is set</Bullet>
              <div style={{ height: 8 }} />
              <Bullet>Every new REE project that signs Vero sees Meteoric as the reference deployment</Bullet>
            </div>
          </>)}

          {/* ── Team ───────────────────────────────────────────── */}
          {slide.type === 'team' && (<>
            <div style={{ marginBottom: 16 }}><Tag>Team</Tag></div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, maxWidth: 960, width: '100%' }}>
              {TEAM_MEMBERS.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease }}
                  style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent, borderRadius: '14px 14px 0 0' }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: m.accent, fontWeight: 600, marginBottom: 10 }}>{m.role}</div>
                  <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.55, margin: 0 }}>{m.bg}</p>
                </motion.div>
              ))}
            </div>
          </>)}

          {/* ── CTA ────────────────────────────────────────────── */}
          {slide.type === 'cta' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h2>
            <div style={{ marginBottom: 20 }}>
              <Suspense fallback={null}>
                <DeckCountdown target={EU_DPP_DATE} label="Until EU DPP enforcement — first movers set the standard" />
              </Suspense>
            </div>
            <div style={{ marginBottom: 28 }}>
              <GlassRow items={[{ label: 'Growth Tier', value: '$102k/yr' }, { label: 'Live Data', value: '90 days' }, { label: 'Views', value: '3 + Mini' }]} />
            </div>
            <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
              <Bullet>Full platform: 3 views + Mini Engine + 27 AI tools</Bullet>
              <Bullet>Live telemetry integration within 90 days</Bullet>
              <Bullet>A founder from the Caldeira — 40 years of local context</Bullet>
              <Bullet>Co-founders with iFood-scale experience in tech and commercial execution</Bullet>
              <Bullet>Dr. Caponi (LAPOC) — decades of field research on your deposit</Bullet>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Open Platform
              </a>
            </div>
            <p style={{ fontSize: 12, color: W.text4, marginTop: 16 }}>carlos@vero.supply</p>
          </>)}
        </>)
      }}
    </DeckShell>
  )
}
