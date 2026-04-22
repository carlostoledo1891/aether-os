import { motion } from 'motion/react'
import { W } from '../../../theme/publicTheme'
import { Kw, Str, Cmt, Fn } from '../../../components/presentation/SyntaxHelpers'
import { PRODUCT_ROADMAP } from '../../../data/domain/roadmap'
import { ScrollSection as S, Stagger, SectionHeader } from '../../../components/layout/MarketingPrimitives'
import { marketingStyles } from '../../../components/layout/MarketingShared'
import { ease, V } from '../sharedConstants'
import { Terminal, Stat } from '../shared'
import { MarketingSlideRoot } from './marketingSlideShell'
import { RequestDemoButton } from '../../../components/marketing/RequestDemo'

const { wrap, label, heading, body, glass, glow } = marketingStyles

export function TechHeroSlide() {
  return (
    <MarketingSlideRoot>
      <header style={{ minHeight: '52vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 16px 28px', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 2 }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${V}15 0%, transparent 70%)`, top: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p style={{ ...label, marginBottom: 16 }}>Technical Deep Dive</p>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 16, maxWidth: 800 }}>
            Under the Hood
          </h1>
          <p style={{ ...body, margin: '0 auto 24px', textAlign: 'center', maxWidth: 620 }}>
            Production-grade architecture, CI-enforced quality gates, zero TypeScript errors, a typed-unit data model,
            and a SHA-256 audit chain — the engine ingests data on a 2-second tick today. This is not a prototype.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: 'CI', label: 'Quality Gates', sub: 'Lint + type-check + test + scan' },
            { value: '0', label: 'TS Errors', sub: 'Strict mode' },
            { value: 'Strict', label: 'TypeScript', sub: 'Every package' },
            { value: '40+', label: 'API Endpoints', sub: 'REST + WebSocket' },
          ].map(s => <Stat key={s.label} {...s} />)}
        </motion.div>
      </header>
    </MarketingSlideRoot>
  )
}

export function TechArchitectureSlide() {
  return (
    <MarketingSlideRoot>
      <S id="architecture" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Architecture"
            heading="3-Process Production Topology"
            body="Three isolated processes — simulation engine, API server, and frontend — communicate through well-defined contracts. No monolith. No runtime coupling."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
            {[
              { title: 'aether-engine', sub: 'Simulation & Ingestion Bot', desc: 'Node.js process with a 2-second tick cycle. Ingests modeled and live channels, POSTs results to the API. Stateless by design.', badge: 'Node.js · 2s cycle' },
              { title: 'aether-api', sub: 'Fastify + SQLite', desc: 'REST and WebSocket server with 40+ endpoints. Ring-buffer SQLite with WAL mode for concurrent reads.', badge: 'REST · WS · 40+ endpoints' },
              { title: 'Vite Frontend', sub: 'React 19 · MapLibre', desc: 'Single-page app with memoized map overlays, Recharts data viz, and Motion animations.', badge: 'React 19 · MapLibre GL' },
            ].map((n, i) => (
              <Stagger key={n.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 10, color: V, fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>{n.badge}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{n.title}</h3>
                  <div style={{ fontSize: 12, color: W.text3, marginBottom: 10 }}>{n.sub}</div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{n.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>

          <Terminal title="Trust Zone — Engine → API Ingest">
            <Cmt>{'// Engine POSTs telemetry every 2 seconds'}</Cmt><br />
            <Kw>POST</Kw> /api/ingest<br />
            <Kw>X-Api-Key</Kw>: <Str>{'${ENGINE_SECRET}'}</Str>
          </Terminal>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function TechQualityServiceSlide() {
  return (
    <MarketingSlideRoot>
      <S id="quality" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Engineering Quality"
            heading="Zero Errors. CI-Enforced. Ship-Ready."
            body="Every commit runs through a CI gate: lint, type-check (strict mode), test suite, and security scan."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { v: 'Frontend', l: 'Test Suite', s: 'Vitest · RTL' },
              { v: 'Server', l: 'Test Suite', s: 'API + engine' },
              { v: '0', l: 'TypeScript Errors', s: 'Strict mode' },
              { v: 'SBOM', l: 'Every Build', s: 'Syft + Grype' },
            ].map((s, i) => (
              <Stagger key={s.l} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <Stat value={s.v} label={s.l} sub={s.s} />
                </div>
              </Stagger>
            ))}
          </div>

          <SectionHeader
            label="Service Layer"
            heading="Swap Implementation. Zero Frontend Changes."
            body={<>All data flows through <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>AetherDataService</code> — mock or live at bootstrap.</>}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 16 }}>
            <Stagger i={0}>
              <Terminal title="MockDataService — development">
                <Kw>class</Kw> <Fn>MockDataService</Fn> <Kw>implements</Kw> AetherDataService {'{'}<br />
                {'  '}<Fn>getEquipment</Fn>(): <Kw>MaybeAsync</Kw>{'<'}Equipment[]{'>'} {'{'} <Kw>return</Kw> MOCK_EQUIPMENT<br />
                {'}'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <Terminal title="LiveDataService — production">
                <Kw>class</Kw> <Fn>LiveDataService</Fn> <Kw>implements</Kw> AetherDataService {'{'}<br />
                {'  '}<Fn>getEquipment</Fn>(): <Kw>Promise</Kw>{'<'}Equipment[]{'>'} {'{'} <Kw>return</Kw> fetch(<Str>'/api/equipment'</Str>)<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function TechAiIntegrationSlide() {
  return (
    <MarketingSlideRoot>
      <S id="ai" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="AI Architecture"
            heading="Tool-Grounded AI. No Speculation."
            body="Frontier LLM via Vercel AI SDK with function calling — model-agnostic. Every response is grounded in a unit lookup or evidence query and cites its source."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { cat: 'Operations', tools: 'unit lookup, state transitions, dependency graph, telemetry queries' },
              { cat: 'Compliance', tools: 'audit chain queries, evidence dossier, schema validation' },
              { cat: 'Vertical Lenses', tools: 'geology, hydrology, financial, environmental — pluggable per unit type' },
            ].map((c, i) => (
              <Stagger key={c.cat} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.text1 }}>{c.cat}</div>
                  <div style={{ fontSize: 11, color: W.text3, marginTop: 6, lineHeight: 1.5 }}>{c.tools}</div>
                </div>
              </Stagger>
            ))}
          </div>

          <Terminal title="AI Tool Router — function calling">
            <Kw>const</Kw> tools = {'{'} <Fn>getDeposits</Fn>: tool({'{'} ... {'}'}), ... {'}'}
          </Terminal>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function TechSensorTwinSlide() {
  return (
    <MarketingSlideRoot>
      <S id="integration" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Integration Surface"
            heading="REST. WebSocket. Industrial-Protocol Ready."
            body="REST for batch queries, WebSocket for real-time channels, CSV upload for bulk historicals, and a connector framework with an OPC-UA / MQTT roadmap for industrial protocol bridges."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { title: 'REST API', sub: '40+ endpoints', desc: 'OpenAPI spec auto-generated. Rate-limited and authenticated.' },
              { title: 'WebSocket', sub: 'Real-time channels', desc: 'Live telemetry streaming via subscription channels.' },
              { title: 'OPC-UA / MQTT', sub: 'Roadmap', desc: 'Connector framework for industrial protocols.' },
            ].map((n, i) => (
              <Stagger key={n.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{n.title}</h3>
                  <div style={{ fontSize: 11, color: V, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{n.sub}</div>
                  <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.55, margin: 0 }}>{n.desc}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      <S style={{ padding: '28px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Reference Digital Twin"
            heading="Pilot Plant Control Room"
            body="Reference deployment for the critical-minerals vertical — interactive SVG schematic, equipment catalog, sensor mapping, process steps, and animated flow paths. The same scene runtime targets any process or asset graph."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {['ROM Pad', 'Leaching', 'Purification', 'SX Circuit', 'Precipitation', 'Drying', 'Product'].map((name, i) => (
              <Stagger key={name} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ fontSize: 10, color: V, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Step {String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginTop: 4 }}>{name}</div>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function TechDppDataSlide() {
  return (
    <MarketingSlideRoot>
      <S id="dpp" style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Evidence Pipeline"
            heading="Verifiable. Exportable. Passport-Ready."
            body="A SHA-256 append-only audit chain captures every mutation. Schemas export as Digital Product Passport-aligned dossiers (CEN/CENELEC reference) for the critical-minerals vertical, and the same Map &amp; Geofence + Monitor &amp; Verify pillars produce equivalent evidence dossiers for agriculture (organic / regenerative certification) and defense (audit-chain reporting)."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <Stagger i={0}>
              <div style={glass}>
                <div style={glow} />
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Digital Product Passport (reference)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { v: '22', l: 'DPP Fields Mapped' },
                    { v: '59%', l: 'Reference Coverage' },
                  ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: V }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: W.text3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Stagger>
            <Stagger i={1}>
              <div style={glass}>
                <div style={glow} />
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Evidence Chain</h3>
                <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>
                  Append-only SHA-256 chain with a /verify-chain endpoint. Per-record evidence dossier exports for assessors,
                  buyer diligence, and regulator review — without trusting our database.
                </p>
              </div>
            </Stagger>
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function TechClosingSlide() {
  return (
    <MarketingSlideRoot>
      <S style={{ padding: '32px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Technical Roadmap"
            heading="Ship velocity"
            body="Near-term milestones from the product roadmap — engineering and compliance in lockstep."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {PRODUCT_ROADMAP.slice(0, 3).map((phase, i) => {
              const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={{ ...glass, height: '100%' }}>
                    <div style={glow} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0', color: accent }}>{phase.title}</h3>
                    <p style={{ fontSize: 11, color: W.text3, margin: 0, lineHeight: 1.5 }}>{phase.items[0]?.description}</p>
                  </div>
                </Stagger>
              )
            })}
          </div>
        </div>
      </S>

      <S style={{ padding: '36px 0 24px', textAlign: 'center' }}>
        <div style={wrap}>
          <h2 style={{ ...heading, marginBottom: 10 }}>Ready to inspect the stack?</h2>
          <p style={{ ...body, margin: '0 auto 24px', textAlign: 'center' }}>Book a walkthrough — we'll wire your data sources to typed units on a live call.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <RequestDemoButton size="lg" />
            <a href="/" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'transparent', letterSpacing: '0.01em' }}>Website</a>
          </div>
        </div>
      </S>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 Vero. Technical architecture documentation available under docs/architecture/.
        </p>
      </footer>
    </MarketingSlideRoot>
  )
}
