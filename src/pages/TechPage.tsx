import { type ReactNode, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { W } from '../app/canvas/canvasTheme'
import { Terminal as TerminalBase, Kw, Str, Num, Cmt, Fn } from '../components/deck'
import { PRODUCT_ROADMAP } from '../data/domain/roadmap'

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

function Terminal({ title, children }: { title: string; children: ReactNode }) {
  return <TerminalBase title={title} large>{children}</TerminalBase>
}

/* ── Stat pill ──────────────────────────────────────────────────── */

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '18px 14px' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

/* ── Style helpers ──────────────────────────────────────────────── */

const wrap: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 32px' }
const label: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: V, marginBottom: 12 }
const heading: React.CSSProperties = { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: W.text1 }
const body: React.CSSProperties = { fontSize: 17, color: W.text3, lineHeight: 1.7, maxWidth: 640 }
const glass: React.CSSProperties = { background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }
const glow: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, ${V}05 0%, transparent 55%)` }

/* ── Component ──────────────────────────────────────────────────── */

export default function TechPage() {
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
          <span style={{ color: W.text4, fontSize: 12, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>/ tech</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[{ l: 'Architecture', id: 'architecture' }, { l: 'Quality', id: 'quality' }, { l: 'AI', id: 'ai' }, { l: 'Integration', id: 'integration' }, { l: 'DPP', id: 'dpp' }, { l: 'Data', id: 'data' }].map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={e => { e.preventDefault(); scrollTo(n.id) }}
              style={{ color: W.text3, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>{n.l}</a>
          ))}
          <a href="/business" style={{ color: W.text3, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Business</a>
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
          <p style={{ ...label, marginBottom: 20 }}>Technical Deep Dive</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 20, maxWidth: 800 }}>
            Under the Hood
          </h1>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center', maxWidth: 600 }}>
            Production-grade architecture, 310 automated tests, zero TypeScript errors, and an integration surface ready for live sensor data. This is not a prototype.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '310', label: 'Tests', sub: '260 frontend + 50 server' },
            { value: '0', label: 'TS Errors', sub: 'Strict mode' },
            { value: '135+', label: 'TS Files', sub: '3 packages' },
            { value: '40+', label: 'API Endpoints', sub: 'REST + WebSocket' },
          ].map(s => <Stat key={s.label} {...s} />)}
        </motion.div>
      </header>

      {/* ── Architecture ───────────────────────────────────────── */}
      <S id="architecture" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Architecture</p>
          <h2 style={heading}>3-Process Production Topology</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Three isolated processes — simulation engine, API server, and frontend — communicate through well-defined contracts. No monolith. No runtime coupling.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { title: 'aether-engine', sub: 'Simulation Bot', desc: 'Node.js process with a 2-second tick cycle. Ingests enricher data (Open-Meteo, BCB PTAX, USGS, Alpha Vantage), computes derived telemetry, and POSTs results to the API. Stateless by design — crash and restart without data loss.', badge: 'Node.js · 2s cycle' },
              { title: 'aether-api', sub: 'Fastify + SQLite', desc: 'REST and WebSocket server with 40+ endpoints. Ring-buffer SQLite with WAL mode for concurrent reads. TTL cache prevents stale data. Rate-limited at 120 req/min. All writes go through a single ingest gate with schema validation.', badge: 'REST · WS · 40+ endpoints' },
              { title: 'Vite Frontend', sub: 'React 19 · MapLibre', desc: 'Single-page app with 14 memoized map overlays, Recharts data viz, and Motion animations. Code-split by route with ErrorBoundary on every view. Service layer abstracts data source — swap mock for live with zero component changes.', badge: 'React 19 · 14 overlays' },
            ].map((n, i) => (
              <Stagger key={n.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 11, color: V, fontFamily: 'var(--font-mono)', marginBottom: 8, fontWeight: 600 }}>{n.badge}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{n.title}</h3>
                  <div style={{ fontSize: 13, color: W.text3, marginBottom: 12 }}>{n.sub}</div>
                  <p style={{ fontSize: 14, color: W.text2, lineHeight: 1.65, margin: 0 }}>{n.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: W.text1 }}>Security Boundaries</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            {['Content Security Policy (CSP)', 'CORS strict origin', 'Rate limiting (120 req/min)', 'Fail-closed ingest', 'API key authentication', 'SHA-256 audit chain', 'Zero-cache financial data', 'OpenAPI schema validation'].map((s, i) => (
              <Stagger key={s} i={i}>
                <div style={{ background: `${V}10`, border: `1px solid ${V}20`, borderRadius: 8, padding: '8px 16px', fontSize: 13, color: V, fontFamily: 'var(--font-mono)' }}>{s}</div>
              </Stagger>
            ))}
          </div>

          <Terminal title="Trust Zone — Engine → API Ingest">
            <Cmt>{'// Engine POSTs telemetry every 2 seconds'}</Cmt><br />
            <Kw>POST</Kw> /api/ingest<br />
            <Kw>Content-Type</Kw>: application/json<br />
            <Kw>X-Api-Key</Kw>: <Str>{'${ENGINE_SECRET}'}</Str><br /><br />
            {'{'}<br />
            {'  '}<Str>"source"</Str>: <Str>"engine"</Str>,<br />
            {'  '}<Str>"timestamp"</Str>: <Str>"2026-04-09T18:30:00Z"</Str>,<br />
            {'  '}<Str>"channels"</Str>: {'{'}<br />
            {'    '}<Str>"E-101.temperature"</Str>: <Num>72.4</Num>,<br />
            {'    '}<Str>"E-201.pH"</Str>: <Num>1.8</Num>,<br />
            {'    '}<Str>"E-301.flowRate"</Str>: <Num>45.2</Num><br />
            {'  }'}<br />
            {'}'}
          </Terminal>
        </div>
      </S>

      {/* ── Code Quality ───────────────────────────────────────── */}
      <S id="quality" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Engineering Quality</p>
          <h2 style={heading}>310 Tests. Zero Errors. Ship-Ready.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Every commit runs through a CI gate: lint, type-check (strict mode), and the full test suite. The codebase has never shipped with a TypeScript error.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { v: '260', l: 'Frontend Tests', s: 'Vitest · React Testing Library' },
              { v: '50', l: 'Server Tests', s: 'API + engine coverage' },
              { v: '0', l: 'TypeScript Errors', s: 'Strict mode, all packages' },
              { v: '135+', l: 'TypeScript Files', s: 'Across 3 packages' },
              { v: 'CI', l: 'Pipeline', s: 'lint → tsc → test → build' },
            ].map((s, i) => (
              <Stagger key={s.l} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <Stat value={s.v} label={s.l} sub={s.s} />
                </div>
              </Stagger>
            ))}
          </div>

          <Terminal title="src/app/canvas/canvasTheme.ts — Design Token System (107 tokens)">
            <Kw>export const</Kw> <Fn>W</Fn> = {'{'}<br />
            {'  '}bg: <Str>'#07070E'</Str>, canvas: <Str>'#060610'</Str>,<br />
            {'  '}panel: <Str>'#0D0D1C'</Str>, surface: <Str>'#121228'</Str>,<br />
            {'  '}violet: <Str>'#7C5CFC'</Str>, <Cmt>{'// primary accent'}</Cmt><br />
            {'  '}cyan: <Str>'#00D4C8'</Str>, <Cmt>{'// hydrology domain'}</Cmt><br />
            {'  '}green: <Str>'#22D68A'</Str>, <Cmt>{'// compliance / success'}</Cmt><br />
            {'  '}amber: <Str>'#F5A623'</Str>, <Cmt>{'// warning'}</Cmt><br />
            {'  '}red: <Str>'#FF4D4D'</Str>, <Cmt>{'// critical'}</Cmt><br />
            {'  '}text1: <Str>'#ECECF8'</Str>, <Cmt>{'// WCAG AAA ≥7:1'}</Cmt><br />
            {'  '}radius: {'{ '}xs: <Num>4</Num>, sm: <Num>7</Num>, md: <Num>10</Num>, lg: <Num>14</Num>{' }'},<br />
            {'}'} <Kw>as const</Kw>
          </Terminal>
        </div>
      </S>

      {/* ── Service Layer ──────────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Service Layer</p>
          <h2 style={heading}>Swap Implementation. Zero Frontend Changes.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            All data flows through <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>AetherDataService</code> — a TypeScript interface with 40+ methods. Components never know if they're consuming mock data or live API responses.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <Stagger i={0}>
              <Terminal title="MockDataService — development">
                <Kw>class</Kw> <Fn>MockDataService</Fn> <Kw>implements</Kw> AetherDataService {'{'}<br />
                {'  '}<Fn>getEquipment</Fn>(): <Kw>MaybeAsync</Kw>{'<'}Equipment[]{'>'} {'{'}<br />
                {'    '}<Kw>return</Kw> MOCK_EQUIPMENT <Cmt>{'// sync, in-memory'}</Cmt><br />
                {'  }'}<br />
                {'  '}<Fn>getTelemetry</Fn>(): <Kw>MaybeAsync</Kw>{'<'}Telemetry{'>'} {'{'}<br />
                {'    '}<Kw>return</Kw> generateTelemetry()<br />
                {'  }'}<br />
                {'}'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <Terminal title="LiveDataService — production">
                <Kw>class</Kw> <Fn>LiveDataService</Fn> <Kw>implements</Kw> AetherDataService {'{'}<br />
                {'  '}<Fn>getEquipment</Fn>(): <Kw>Promise</Kw>{'<'}Equipment[]{'>'} {'{'}<br />
                {'    '}<Kw>return</Kw> fetch(<Str>'/api/equipment'</Str>) <Cmt>{'// async'}</Cmt><br />
                {'  }'}<br />
                {'  '}<Fn>getTelemetry</Fn>(): <Kw>Promise</Kw>{'<'}Telemetry{'>'} {'{'}<br />
                {'    '}<Kw>return</Kw> <Kw>this</Kw>.ws.subscribe(<Str>'telemetry'</Str>)<br />
                {'  }'}<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>

          <div style={{ ...glass, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <div style={glow} />
            <p style={{ fontSize: 14, color: W.text2, margin: 0 }}>
              <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>useServiceQuery</code> hook deduplicates requests and caches results. Every view — Field, Compliance, Executive — consumes the same interface. Swap implementation at bootstrap, not in 50 components.
            </p>
          </div>
        </div>
      </S>

      {/* ── AI Integration ─────────────────────────────────────── */}
      <S id="ai" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>AI Architecture</p>
          <h2 style={heading}>27 Domain Tools. 10 Guardrails. Zero Hallucination.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Frontier LLM via Vercel AI SDK with function calling — model-agnostic, swap providers without code changes. Every response is grounded in tool output — the AI cannot invent data. 10 system-prompt honesty rules enforce factual boundaries.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { cat: 'Geology', count: 5, tools: 'deposits, resources, lithology, drill logs, JORC classification' },
              { cat: 'Financial', count: 5, tools: 'scenario modeling, NPV sensitivity, CAPEX tracking, DSCR, IRR' },
              { cat: 'Compliance', count: 4, tools: 'DPP validation, FEOC verification, audit chain, export' },
              { cat: 'Operations', count: 5, tools: 'plant telemetry, equipment status, sensor channels, flow paths, process steps' },
              { cat: 'Environmental', count: 4, tools: 'water quality, springs, hydrology scenarios, community card' },
              { cat: 'Market', count: 4, tools: 'sizing, pricing, benchmarks, comparable analysis' },
            ].map((c, i) => (
              <Stagger key={c.cat} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 24, fontWeight: 800, color: V }}>{c.count}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginTop: 4 }}>{c.cat}</div>
                  <div style={{ fontSize: 12, color: W.text3, marginTop: 6, lineHeight: 1.5 }}>{c.tools}</div>
                </div>
              </Stagger>
            ))}
          </div>

          <Terminal title="AI Tool Router — function calling">
            <Kw>const</Kw> tools = {'{'}<br />
            {'  '}<Fn>getDeposits</Fn>: tool({'{'}<br />
            {'    '}description: <Str>'Retrieve geological deposit data with JORC classification'</Str>,<br />
            {'    '}parameters: z.object({'{'} includeGrade: z.boolean() {'}'}),<br />
            {'    '}<Fn>execute</Fn>: <Kw>async</Kw> (params) ={'>'} service.getDeposits(params),<br />
            {'  }'}),<br />
            {'  '}<Fn>getFinancialScenarios</Fn>: tool({'{'}<br />
            {'    '}description: <Str>'Get Bear/Consensus/Bull NPV projections'</Str>,<br />
            {'    '}parameters: z.object({'{'} scenario: z.enum([<Str>'bear'</Str>, <Str>'consensus'</Str>, <Str>'bull'</Str>]) {'}'}),<br />
            {'    '}<Fn>execute</Fn>: <Kw>async</Kw> (params) ={'>'} service.getFinancialScenarios(params),<br />
            {'  }'}),<br />
            {'  '}<Cmt>{'// ... 25 more domain-grounded tools'}</Cmt><br />
            {'}'}
          </Terminal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            <div style={glass}>
              <div style={glow} />
              <h4 style={{ fontSize: 14, fontWeight: 700, color: W.amber, marginBottom: 8 }}>Hallucination Fence</h4>
              <ul style={{ fontSize: 13, color: W.text2, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                <li>Never invent data — only return tool output</li>
                <li>Always cite the source dataset</li>
                <li>Distinguish modeled vs measured vs public</li>
                <li>Refuse to answer outside tool coverage</li>
                <li>Flag when data is simulated</li>
              </ul>
            </div>
            <div style={glass}>
              <div style={glow} />
              <h4 style={{ fontSize: 14, fontWeight: 700, color: W.green, marginBottom: 8 }}>Test Coverage</h4>
              <ul style={{ fontSize: 13, color: W.text2, lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
                <li>10 hallucination-specific test cases</li>
                <li>100% pass rate on guardrail suite</li>
                <li>Boundary tests for every tool parameter</li>
                <li>Regression tests for known edge cases</li>
                <li>Source provenance on every AI response</li>
              </ul>
            </div>
          </div>
        </div>
      </S>

      {/* ── Sensor / SCADA Integration ─────────────────────────── */}
      <S id="integration" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Integration Surface</p>
          <h2 style={heading}>REST. WebSocket. SCADA-Ready.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Three integration paths — REST for batch queries, WebSocket for real-time telemetry, and an OPC-UA/MQTT roadmap for industrial SCADA systems. Equipment-sensor catalog with 17 equipment items and 28 mapped sensor channels.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
            {[
              { title: 'REST API', sub: '40+ endpoints', desc: 'Full CRUD for equipment, telemetry, deposits, compliance, financial data. OpenAPI spec auto-generated. Rate-limited and authenticated.' },
              { title: 'WebSocket', sub: 'Real-time channels', desc: 'Live telemetry streaming via subscription channels. Equipment status, sensor readings, alert events — all push-based. Reconnect with exponential backoff.' },
              { title: 'OPC-UA / MQTT', sub: 'Roadmap', desc: 'Connector framework for industrial protocols. Tag mapping from SCADA to Vero equipment-sensor catalog. CSV/Excel batch upload as interim bridge.' },
            ].map((n, i) => (
              <Stagger key={n.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{n.title}</h3>
                  <div style={{ fontSize: 12, color: V, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>{n.sub}</div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{n.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>

          <Terminal title="Telemetry endpoint — REST">
            <Kw>GET</Kw> /api/telemetry?equipment=E-101&range=24h<br /><br />
            {'{'}<br />
            {'  '}<Str>"equipment"</Str>: <Str>"E-101"</Str>,<br />
            {'  '}<Str>"name"</Str>: <Str>"ROM Pad Feeder"</Str>,<br />
            {'  '}<Str>"channels"</Str>: {'['}<br />
            {'    '}{'{'} <Str>"id"</Str>: <Str>"temperature"</Str>, <Str>"value"</Str>: <Num>72.4</Num>, <Str>"unit"</Str>: <Str>"°C"</Str>, <Str>"quality"</Str>: <Str>"good"</Str> {'}'},<br />
            {'    '}{'{'} <Str>"id"</Str>: <Str>"vibration"</Str>, <Str>"value"</Str>: <Num>0.34</Num>, <Str>"unit"</Str>: <Str>"mm/s"</Str>, <Str>"quality"</Str>: <Str>"good"</Str> {'}'},<br />
            {'    '}{'{'} <Str>"id"</Str>: <Str>"throughput"</Str>, <Str>"value"</Str>: <Num>145.8</Num>, <Str>"unit"</Str>: <Str>"t/h"</Str>, <Str>"quality"</Str>: <Str>"good"</Str> {'}'}<br />
            {'  ]'},<br />
            {'  '}<Str>"timestamp"</Str>: <Str>"2026-04-09T18:30:00Z"</Str>,<br />
            {'  '}<Str>"source"</Str>: <Str>"simulated"</Str> <Cmt>{'// honest provenance label'}</Cmt><br />
            {'}'}
          </Terminal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 24 }}>
            {[
              { v: '17', l: 'Equipment Items', s: 'Metso · Andritz · GEA · Outotec' },
              { v: '28', l: 'Sensor Channels', s: 'Mapped to telemetry' },
              { v: '7', l: 'Process Steps', s: 'ROM to product' },
              { v: '15', l: 'Flow Paths', s: 'Animated SVG' },
            ].map((s, i) => (
              <Stagger key={s.l} i={i}>
                <div style={{ ...glass, textAlign: 'center' }}>
                  <div style={glow} />
                  <Stat value={s.v} label={s.l} sub={s.s} />
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Digital Twin ───────────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Digital Twin</p>
          <h2 style={heading}>Pilot Plant Control Room</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Interactive SVG schematic of the Caldeira AMSUL pilot plant — 17 equipment nodes, 28 sensors, 7 process steps, and 15 animated flow paths. Each equipment item maps to its real-world counterpart with status indicators and sensor channels.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { step: '01', name: 'ROM Pad', desc: 'Primary crushing, feed control' },
              { step: '02', name: 'Leaching', desc: 'H₂SO₄ acid leach, pH control' },
              { step: '03', name: 'Purification', desc: 'Impurity removal, filtration' },
              { step: '04', name: 'SX Circuit', desc: 'Solvent extraction, REE separation' },
              { step: '05', name: 'Precipitation', desc: 'AMSUL crystallization' },
              { step: '06', name: 'Drying', desc: 'Product dewatering, packaging' },
              { step: '07', name: 'Product', desc: 'REO concentrate, quality assay' },
            ].map((s, i) => (
              <Stagger key={s.step} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 11, color: V, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Step {s.step}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: W.text1, marginTop: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: W.text3, marginTop: 4 }}>{s.desc}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── DPP / Blockchain ───────────────────────────────────── */}
      <S id="dpp" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>DPP &amp; Blockchain Pipeline</p>
          <h2 style={heading}>Compliance-Ready. Blockchain-Ready.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Digital Product Passport export aligned to CEN/CENELEC standards. SHA-256 append-only audit chain provides immutable evidence of every data event. The pipeline to full blockchain attestation is architected — we own more of the process with each release.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <Stagger i={0}>
              <div style={glass}>
                <div style={glow} />
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Digital Product Passport</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { v: '22', l: 'DPP Fields Mapped' },
                    { v: '59%', l: 'Coverage Today' },
                    { v: '75%', l: 'Target (90 days)' },
                    { v: 'JSON', l: 'Schema Export' },
                  ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center', padding: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: V }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: W.text3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
                  CEN/CENELEC TC 10 field mapping with inline schema validation. One-click JSON export from any batch. Run our output against your validator.
                </p>
              </div>
            </Stagger>
            <Stagger i={1}>
              <div style={glass}>
                <div style={glow} />
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Blockchain Pipeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { phase: 'Today', desc: 'SHA-256 append-only audit chain — every data event hashed and timestamped', status: 'live' },
                    { phase: 'Next', desc: 'Standalone DPP schema validation tool — lead magnet for EU enforcement conversations', status: 'building' },
                    { phase: 'Pipeline', desc: 'On-chain attestation of audit hashes — immutable proof without exposing operational data', status: 'designed' },
                    { phase: 'Vision', desc: 'Full molecular-to-magnet traceability ledger — batch-level origin proof across the supply chain', status: 'planned' },
                  ].map(p => (
                    <div key={p.phase} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: p.status === 'live' ? W.green : p.status === 'building' ? V : W.text4, fontFamily: 'var(--font-mono)', minWidth: 56 }}>{p.phase}</div>
                      <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Stagger>
          </div>

          <Terminal title="DPP JSON Export — CEN/CENELEC aligned">
            {'{'}<br />
            {'  '}<Str>"schema"</Str>: <Str>"urn:cenclc:dpp:battery:2026"</Str>,<br />
            {'  '}<Str>"productId"</Str>: <Str>"VERO-CALDEIRA-REO-001"</Str>,<br />
            {'  '}<Str>"origin"</Str>: {'{'}<br />
            {'    '}<Str>"country"</Str>: <Str>"BR"</Str>,<br />
            {'    '}<Str>"site"</Str>: <Str>"Caldeira Alkaline Complex"</Str>,<br />
            {'    '}<Str>"operator"</Str>: <Str>"Meteoric Resources NL"</Str><br />
            {'  }'},<br />
            {'  '}<Str>"auditHash"</Str>: <Str>"sha256:a1b2c3...f8e9d0"</Str>,<br />
            {'  '}<Str>"feocStatus"</Str>: <Str>"compliant"</Str>,<br />
            {'  '}<Str>"fieldsCovered"</Str>: <Num>22</Num>,<br />
            {'  '}<Str>"totalRequired"</Str>: <Num>37</Num>,<br />
            {'  '}<Str>"coveragePercent"</Str>: <Num>59.4</Num><br />
            {'}'}
          </Terminal>
        </div>
      </S>

      {/* ── Data Layer ─────────────────────────────────────────── */}
      <S id="data" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Data Layer</p>
          <h2 style={heading}>19 GeoJSON Datasets. Schema-Tested.</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            Geological, hydrological, and infrastructure data loaded from typed GeoJSON with schema validation. JORC-safe resource classification with explicit methodology labeling. Geology and hydrology kept in separate visual layers — the digital twin never pretends to prove the deposit.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { title: 'Geology', items: ['Drill collars & traces', 'Resource classification (JORC)', 'Deposit polygons with ASX refs', 'Lithology domains', 'Grade distribution'] },
              { title: 'Hydrology', items: ['Spring monitoring network', 'Piezometer locations', 'Water quality parameters', 'Hydro Twin scenarios', 'FEAM/IGAM compliance zones'] },
              { title: 'Infrastructure', items: ['Equipment layout (17 items)', 'Sensor mapping (28 channels)', 'APA protection zones', 'License boundaries', 'Community impact areas'] },
            ].map((c, i) => (
              <Stagger key={c.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: V }}>{c.title}</h3>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: W.text2, lineHeight: 1.8 }}>
                    {c.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </Stagger>
            ))}
          </div>

          <div style={{ ...glass, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
            <div style={glow} />
            <p style={{ fontSize: 14, color: W.text2, margin: 0, lineHeight: 1.7 }}>
              Every GeoJSON dataset has a schema test. Every resource figure links to its JORC table. Modeled data is labeled <span style={{ color: W.amber }}>"modeled"</span>, public data is labeled <span style={{ color: W.green }}>"public"</span>, simulated data is labeled <span style={{ color: W.text4 }}>"simulated"</span>. No ambiguity.
            </p>
          </div>
        </div>
      </S>

      {/* ── Modularity ─────────────────────────────────────────── */}
      <S style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Modularity</p>
          <h2 style={heading}>Architected for Scale</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            107 design tokens, shared component library, lazy-loaded routes, and a Mini Engine pattern that generates public dashboards from JSON manifests. Built for a second developer to be productive on day one.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { title: 'Design Tokens', desc: '107 semantic tokens — colors, glass, radii, chrome. One source of truth for dark mode. Light mode–ready.' },
              { title: 'Component Library', desc: 'DeckShell, Terminal, StatCard, GlassRow, Tag, Bullet — shared across decks, pages, and dashboards.' },
              { title: 'Mini Engine', desc: 'JSON-driven public views. One manifest generates a complete dashboard — Prefeitura, community, investor views.' },
              { title: 'Error Boundaries', desc: 'ErrorBoundary on every route. Lazy loading on every page. Suspense fallbacks. Graceful degradation.' },
              { title: 'HANDOFF.md', desc: '2,600+ lines of documentation. Every feature, every decision, every architecture choice. Developer onboarding in hours, not weeks.' },
              { title: 'Service Seam', desc: 'AetherDataService interface. Mock ↔ Live swap at bootstrap. Zero component changes. Zero feature flags.' },
            ].map((c, i) => (
              <Stagger key={c.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Technical Roadmap ────────────────────────────────────── */}
      <S id="roadmap" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <p style={label}>Technical Roadmap</p>
          <h2 style={heading}>Integration Evolution</h2>
          <p style={{ ...body, marginBottom: 40 }}>
            From LAPOC instruments to full blockchain anchoring — the technical path from pilot to enterprise.
          </p>
          <div style={{ display: 'grid', gap: 16 }}>
            {PRODUCT_ROADMAP.filter(p => p.items.some(it => it.tag === 'tech' || it.tag === 'infra' || it.tag === 'compliance')).map((phase, i) => {
              const accent = phase.status === 'active' ? V : W.text4
              const techItems = phase.items.filter(it => it.tag === 'tech' || it.tag === 'infra' || it.tag === 'compliance')
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={glass}>
                    <div style={glow} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: W.text1 }}>{phase.title}</span>
                      <span style={{
                        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        background: phase.status === 'active' ? `${V}20` : W.glass04, color: accent, marginLeft: 'auto',
                      }}>{phase.status}</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Terminal title={`${phase.id}.integration.ts`}>
                        {techItems.map((item, j) => (
                          <span key={item.title}>
                            <Kw>export</Kw> <Kw>const</Kw> <Fn>{item.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()}</Fn> = {'{'}<br />
                            {'  '}name: <Str>'{item.title}'</Str>,<br />
                            {'  '}status: <Str>'{phase.status}'</Str>,<br />
                            {'  '}desc: <Str>'{item.description.slice(0, 60)}…'</Str>,<br />
                            {'}'}{j < techItems.length - 1 ? <><br /><br /></> : null}
                          </span>
                        ))}
                      </Terminal>
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
          <h2 style={{ ...heading, marginBottom: 12 }}>See It Running</h2>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center' }}>
            This is not a slide deck. Open the platform and explore every feature described on this page.
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
          © 2026 Vero Platform. Built with TypeScript, React 19, Fastify, SQLite, MapLibre GL, and Vercel AI SDK.
          Demo environment uses public-reference data, disclosure-aligned scenarios, and simulated time series.
        </p>
      </footer>
    </div>
  )
}
