import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { DeckShell, Terminal, StatCard, Bullet, GlassRow } from '../components/deck'

const ease = [0.16, 1, 0.3, 1] as const
const V = W.violet

/* ── Slides ──────────────────────────────────────────────────────── */

type SlideType = 'cover' | 'stats' | 'bullets' | 'code' | 'dataviz' | 'timeline' | 'reasons' | 'standard' | 'cta'

interface SlideData { type: SlideType; title: string; subtitle?: string }

const SLIDES: SlideData[] = [
  { type: 'cover', title: 'Vero for Caldeira', subtitle: 'Your digital twin is already built.\nNow connect it to live data.' },
  { type: 'stats', title: 'Already Built on Your Data', subtitle: 'built' },
  { type: 'bullets', title: 'Three Views, One Platform', subtitle: 'views' },
  { type: 'code', title: 'Ready for Live Data', subtitle: 'integration' },
  { type: 'dataviz', title: 'Any Data. Any Visualization.' },
  { type: 'bullets', title: '27 AI Tools, Grounded in Caldeira', subtitle: 'ai' },
  { type: 'stats', title: 'Security & Enterprise Readiness', subtitle: 'security' },
  { type: 'reasons', title: 'Why Sign This Quarter' },
  { type: 'timeline', title: '90 Days to Live Data' },
  { type: 'standard', title: 'Vero Becomes Market Standard' },
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

/* ── Component ───────────────────────────────────────────────────── */

export default function MeteoricDeck() {
  return (
    <DeckShell count={SLIDES.length} padding="48px 64px">
      {(idx) => {
        const slide = SLIDES[idx]
        const statsData = slide.subtitle === 'security' ? SECURITY_STATS : BUILT_STATS

        return (<>
          {/* ── Cover ──────────────────────────────────────────── */}
          {slide.type === 'cover' && (<>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
              style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Meteoric Resources Ltd · ASX: MEI</div>
            <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 520, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{slide.subtitle}</p>
            <div style={{ marginTop: 40 }}>
              <GlassRow items={[{ label: 'Equipment', value: '17' }, { label: 'Sensors', value: '28' }, { label: 'GeoJSON', value: '19' }, { label: 'AI Tools', value: '27' }, { label: 'Tests', value: '310' }]} />
            </div>
          </>)}

          {/* ── Stats ──────────────────────────────────────────── */}
          {slide.type === 'stats' && (<>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statsData.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
              {statsData.map(s => <StatCard key={s.label} {...s} />)}
            </div>
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
                    <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
                  </div>
                ))}
              </div>
            )}
            {slide.subtitle === 'ai' && (
              <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Bullet>Geology: lithology analysis, resource classification, drill log interpretation</Bullet>
                <Bullet>Financial: scenario modeling, NPV sensitivity, CAPEX tracking</Bullet>
                <Bullet>Compliance: DPP field validation, FEOC verification, audit chain queries</Bullet>
                <Bullet>Environmental: water quality assessment, spring status interpretation</Bullet>
                <div style={{ marginTop: 12, background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '16px 20px', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>Example cross-data queries</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: W.text2, lineHeight: 1.7 }}>
                    <span style={{ color: V }}>&gt;</span> "Compare pH trends across springs vs rainfall"<br />
                    <span style={{ color: V }}>&gt;</span> "Which equipment has highest maintenance risk?"<br />
                    <span style={{ color: V }}>&gt;</span> "Generate compliance package for Ucore audit"
                  </div>
                </div>
              </div>
            )}
          </>)}

          {/* ── Code / Integration ──────────────────────────────── */}
          {slide.type === 'code' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, maxWidth: 960, width: '100%' }}>
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
            <p style={{ fontSize: 12, color: W.text4, marginTop: 20, maxWidth: 500 }}>
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
                  <span style={{ fontSize: 12, color: W.text2 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: W.text4, marginTop: 20 }}>
              Prefeitura de Poços de Caldas dashboard already live at <span style={{ color: V, fontFamily: 'var(--font-mono)' }}>/view/prefeitura-pocos</span>
            </p>
          </>)}

          {/* ── Reasons ────────────────────────────────────────── */}
          {slide.type === 'reasons' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {REASONS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: W.text2, lineHeight: 1.6, margin: 0 }}>{r}</p>
                </div>
              ))}
            </div>
          </>)}

          {/* ── Timeline ───────────────────────────────────────── */}
          {slide.type === 'timeline' && (<>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>{slide.title}</h2>
            <div style={{ maxWidth: 720, width: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${V}60, ${V}10)` }} />
              {TIMELINE.map((t, i) => (
                <div key={t.week} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: W.glass04, border: `1px solid ${W.glass06}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>W{t.week}</span>
                  </div>
                  <div style={{ textAlign: 'left', paddingTop: 8 }}>
                    <p style={{ fontSize: 14, color: i === TIMELINE.length - 1 ? W.text1 : W.text2, lineHeight: 1.5, margin: 0, fontWeight: i === TIMELINE.length - 1 ? 700 : 400 }}>{t.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <GlassRow items={[{ label: 'Annual Cost', value: '$102k' }, { label: '% of NPV', value: '0.013%' }, { label: 'NPV Consensus', value: '$821M' }]} />
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
                  <div style={{ fontSize: 12, color: V, fontWeight: 600, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{s.status}</div>
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 720, marginTop: 28 }}>
              <Bullet>Meteoric shapes the DPP schema with us — not after the standard is set</Bullet>
              <div style={{ height: 8 }} />
              <Bullet>Every new REE project that signs Vero sees Meteoric as the reference deployment</Bullet>
            </div>
          </>)}

          {/* ── CTA ────────────────────────────────────────────── */}
          {slide.type === 'cta' && (<>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 32, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {slide.title}
            </h2>
            <div style={{ marginBottom: 28 }}>
              <GlassRow items={[{ label: 'Growth Tier', value: '$102k/yr' }, { label: 'Live Data', value: '90 days' }, { label: 'Views', value: '3 + Mini' }]} />
            </div>
            <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
              <Bullet>Full platform: 3 views + Mini Engine + 27 AI tools</Bullet>
              <Bullet>Live telemetry integration within 90 days</Bullet>
              <Bullet>A founder from the Caldeira — 40 years of local context</Bullet>
              <Bullet>Dr. Caponi (LAPOC) — decades of field work on your deposit</Bullet>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Open Platform
              </a>
              <a href="/lp" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>
                Website
              </a>
              <a href="mailto:contact@meteoric.tech" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, textDecoration: 'none', background: 'transparent' }}>
                contact@meteoric.tech
              </a>
            </div>
          </>)}
        </>)
      }}
    </DeckShell>
  )
}
