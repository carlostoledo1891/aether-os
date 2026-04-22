import { motion } from 'motion/react'
import { W } from '../../../theme/publicTheme'
import { Kw, Str, Num, Cmt, Fn } from '../../../components/presentation/SyntaxHelpers'
import { MarketingObservability } from '../../../components/layout/MarketingObservability'
import { ScrollSection as S, Stagger } from '../../../components/layout/MarketingPrimitives'
import { marketingStyles } from '../../../components/layout/MarketingShared'
import { ease, V } from '../sharedConstants'
import { Terminal } from '../shared'
import { RequestDemoButton } from '../../../components/marketing/RequestDemo'
import { MarketingBorderBeam } from '../../../components/marketing/MarketingBorderBeam'
import {
  HERO_STATS,
  INDUSTRIES,
  CAPABILITIES,
  ARCH_NODES,
  QUALITY,
  AI_TOOLS,
  REPORT_CARDS,
  MARKETING_COPY,
} from '../../../config/marketing'
import { MarketingSlideRoot } from './marketingSlideShell'

const { label, heading, body, glass, glow } = marketingStyles
const wrap: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' }

export function HomeHeroSlide() {
  return (
    <MarketingSlideRoot>
      <section style={{
        minHeight: 'min(72vh, 620px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '48px 16px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <motion.div animate={{ opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '55vw', height: '55vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}14, transparent 70%)`, top: '-12vw', left: '22vw', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '35vw', height: '35vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}0C, transparent 70%)`, bottom: '-5vw', right: '15vw', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}>
          <div style={{ ...label, marginBottom: 28, position: 'relative' }}>{MARKETING_COPY.heroTagline}</div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 800, lineHeight: 1.05, maxWidth: 880, margin: '0 0 32px', position: 'relative', background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {MARKETING_COPY.heroHeadline}
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease }}
          style={{ display: 'flex', gap: 12, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Live edge on the in-page primary CTA (compact beam; hero already has soft radial scrim). */}
          <MarketingBorderBeam size="sm" strength={0.55} style={{ display: 'inline-block' }}>
            <RequestDemoButton size="lg" />
          </MarketingBorderBeam>
        </motion.div>
      </section>

      {/*
        Stats strip is pinned to the viewport bottom so it reads as a
        persistent overlay over the moving-pin globe — independent of
        the hero copy's vertical rhythm.
      */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                padding: '0 56px',
                borderLeft: i > 0 ? `1px solid ${W.glass08}` : 'none',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: W.text4, letterSpacing: '0.04em', opacity: 0.55 }}>
          {MARKETING_COPY.heroFooter}
        </div>
      </motion.div>
    </MarketingSlideRoot>
  )
}

export function HomeIndustriesObsSlide() {
  const leadIndustries = INDUSTRIES.filter(i => i.tier === 'lead')
  const adjacentIndustries = INDUSTRIES.filter(i => i.tier === 'adjacent')

  return (
    <MarketingSlideRoot>
      <S id="industries" style={{ padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={label}>{MARKETING_COPY.industriesLabel}</div>
            <h2 style={heading}>{MARKETING_COPY.industriesHeadline}</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              {MARKETING_COPY.industriesBody}
            </p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ ...label, marginBottom: 12, color: V, opacity: 0.85 }}>Lead verticals</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {leadIndustries.map((ind, i) => (
                <Stagger key={ind.title} i={i}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%', border: 'none' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: V, marginBottom: 6 }}>{ind.tagline}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: W.text1, marginBottom: 8 }}>{ind.title}</div>
                    <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: '0 0 12px' }}>{ind.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 8 }}>
                      {ind.useCases.map(u => (
                        <span key={u} style={{ fontSize: 10, color: W.text3, background: W.glass04, padding: '3px 8px', borderRadius: 999 }}>{u}</span>
                      ))}
                    </div>
                  </motion.div>
                </Stagger>
              ))}
            </div>
          </div>

          <div>
            <div style={{ ...label, marginBottom: 12 }}>Also runs on Vero</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {adjacentIndustries.map((ind, i) => (
                <Stagger key={ind.title} i={i}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                    style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 18px', border: 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, marginBottom: 6 }}>{ind.title}</div>
                    <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{ind.desc}</p>
                  </motion.div>
                </Stagger>
              ))}
            </div>
          </div>
        </div>
      </S>
      <MarketingObservability />
    </MarketingSlideRoot>
  )
}

export function HomePlatformPipelineSlide() {
  return (
    <MarketingSlideRoot>
      <S id="platform" style={{ padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={label}>{MARKETING_COPY.pillarsLabel}</div>
            <h2 style={heading}>{MARKETING_COPY.platformTagline}</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Three pillars compose every operational story Vero tells.
              Map every asset and every boundary as a typed unit. Stream every sensor and hash every change into a verifiable audit chain.
              Decide with tool-grounded AI and export evidence dossiers — same runtime, same source data, no parallel demo build.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {CAPABILITIES.map((c, idx) => (
              <Stagger key={c.tag} i={idx}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ ...label, marginBottom: 4 }}>{c.tag}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, marginBottom: 8 }}>{c.headline}</h3>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, marginBottom: 16 }}>{c.desc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    {c.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${V}40` }} />
                        <span style={{ fontSize: 13, color: W.text2, lineHeight: 1.55 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 0, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${W.glass06}` }}>
                    {c.metrics.map((m, i) => (
                      <div key={m.label} style={{ textAlign: 'center', flex: 1, borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                        <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      <S style={{ padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={label}>From Sensor to Typed Unit</div>
            <h2 style={heading}>Connect any source. Tag every reading.</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Field sensors, SCADA channels, REST and WebSocket endpoints, CSV uploads, and external APIs land
              as typed units with a provenance label — mock, modeled, simulated, live, or field-verified.
              No reading goes anonymous; every change is hashed into the audit chain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <Stagger i={0}>
              <Terminal title="api/telemetry/current">
                <Cmt>{'// Real-time sensor data'}</Cmt><br />
                {'{'}<br />
                {'  '}<Str>"channel"</Str>: <Str>"process.ph_meter"</Str>,<br />
                {'  '}<Str>"value"</Str>: <Num>2.41</Num>,<br />
                {'  '}<Str>"unit"</Str>: <Str>"pH"</Str>,<br />
                {'  '}<Str>"timestamp"</Str>: <Str>"2026-04-10T02:41:00Z"</Str>,<br />
                {'  '}<Str>"source"</Str>: <Str>"simulation_engine"</Str>,<br />
                {'  '}<Str>"quality"</Str>: <Str>"good"</Str><br />
                {'}'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <Terminal title="services/liveDataService.ts">
                <Kw>export function</Kw> <Fn>api</Fn>{'<'}<Kw>T</Kw>{'>'}<br />
                {'  (endpoint: '}<Kw>string</Kw>{', ttl = '}<Num>30_000</Num>{') {'}<br />
                <br />
                {'  '}<Cmt>{'// Two-layer cache architecture'}</Cmt><br />
                {'  '}<Kw>return</Kw>{' fetch(endpoint)'}<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function HomeArchitectureSlide() {
  return (
    <MarketingSlideRoot>
      <S id="architecture" style={{ padding: '36px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={label}>Under the Hood</div>
            <h2 style={heading}>Production-grade architecture</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Three-process production system. Enterprise security posture. Zero TypeScript errors.
              The same architecture renders the operator workspace, the marketing site, and pitch artifacts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
            {ARCH_NODES.map((node, i) => (
              <Stagger key={node.label} i={i}>
                <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}
                  style={{ ...glass, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{node.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, marginBottom: 3 }}>{node.label}</div>
                  <div style={{ fontSize: 9, color: W.text4, lineHeight: 1.4 }}>{node.sub}</div>
                </motion.div>
              </Stagger>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Stagger i={0}>
              <Terminal title="server/src/index.ts">
                <Cmt>{'// Security hardening'}</Cmt><br />
                <Kw>app</Kw>.<Fn>register</Fn>(<Str>rateLimit</Str>, {'{'}<br />
                {'  max: '}<Num>120</Num>,<br />
                {'  timeWindow: '}<Str>'1 minute'</Str><br />
                {'})'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <Terminal title="GET /api/docs — OpenAPI">
                <Cmt>{'// Auto-generated from Fastify schemas'}</Cmt><br />
                {'{'}<br />
                {'  '}<Str>"openapi"</Str>: <Str>"3.0.0"</Str>,<br />
                {'  '}<Str>"paths"</Str>: {'{ ... }'}<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, maxWidth: 800, marginInline: 'auto' }}>
            {QUALITY.map((s, i) => (
              <Stagger key={s.label} i={i}>
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                  style={{ padding: '16px 10px', background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: W.text1, marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: W.text4, marginTop: 2 }}>{s.sub}</div>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

export function HomeAiSlide() {
  return (
    <MarketingSlideRoot>
      <S id="ai-agent" style={{ padding: '36px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={label}>AI Agent</div>
            <h2 style={heading}>{MARKETING_COPY.aiTagline}</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Frontier LLM with tool-grounded function calling. Hallucination-tested and guardrailed.
              Model-agnostic via AI SDK. Every response cites the unit and evidence record it came from —
              the agent refuses to speculate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <Stagger i={0}>
              <Terminal title="AI Guardrail Test">
                <Cmt>{'// Tool-grounded answers only'}</Cmt><br />
                <Kw>test</Kw>(<Str>"unknown unit returns refusal"</Str>, () {'=> {'}<br />
                {'  '}<Kw>expect</Kw>(answer.tool_calls).<Fn>toBeTruthy</Fn>()<br />
                {'  '}<Kw>expect</Kw>(answer.text).<Fn>toContain</Fn>(<Str>"source"</Str>)<br />
                {'})'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <div style={glass}>
                <div style={{ ...label, marginBottom: 12 }}>Tool Categories</div>
                {AI_TOOLS.map(c => (
                  <div
                    key={'cat' in c ? c.cat : c.name}
                    style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${W.glass06}` }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>
                      {'cat' in c ? c.cat : c.category}
                    </div>
                    <div style={{ fontSize: 11, color: W.text3, marginTop: 2, lineHeight: 1.5 }}>
                      {'tools' in c ? c.tools : `${c.name} — ${c.label}`}
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: W.amber, fontWeight: 600, marginTop: 4 }}>
                  Provenance UI on every response · Sources collapsible
                </div>
              </div>
            </Stagger>
          </div>
        </div>
      </S>
    </MarketingSlideRoot>
  )
}

type HomeRoadmapStatus = 'shipped' | 'active' | 'planned' | 'future'

interface HomeRoadmapItem {
  title: string
  description: string
}

interface HomeRoadmapPhase {
  id: string
  quarter: string
  title: string
  pitch: string
  status: HomeRoadmapStatus
  items: HomeRoadmapItem[]
}

const HOME_ROADMAP: HomeRoadmapPhase[] = [
  {
    id: 'pilot-ready',
    quarter: 'Q2 2026',
    title: 'Plug-and-play pilot',
    pitch: 'Your sensors live on the map in your first 90 days.',
    status: 'active',
    items: [
      { title: 'Field instruments live in 2 weeks', description: 'OPC-UA, MQTT, REST, CSV — map your channels to typed units and watch them stream into the workspace this sprint.' },
      { title: 'Replace mock data with the real thing', description: 'LAPOC piezometers and water sensors are the live reference path — your pilot inherits the same simulated → field-verified upgrade.' },
      { title: 'Multi-tenant from day one', description: 'Run multiple sites or projects in one workspace, with per-tenant data boundaries and access controls.' },
      { title: 'Covenant alerts your CFO trusts', description: 'DSCR and operational covenants tracked automatically; threshold breaches surface in the same audit chain your lender reads.' },
    ],
  },
  {
    id: 'enterprise-grade',
    quarter: 'Q3 2026',
    title: 'Cleared by procurement',
    pitch: 'Everything you need to win an enterprise or government RFP.',
    status: 'planned',
    items: [
      { title: 'Government data, no scraping', description: 'Direct connectors to mining-titles, water-permit, and meteorological registries — official sources, signed payloads.' },
      { title: 'Tamper-proof audit chain', description: 'Merkle-root anchoring on top of SHA-256 — any auditor can prove the chain has not moved since publication.' },
      { title: 'FedRAMP pathway', description: 'AWS GovCloud deployment route for US federal and DoD programs. Procurement-ready posture out of the box.' },
      { title: 'Roles auditors actually accept', description: 'Admin · Analyst · Viewer · Auditor with field-level permissions and full action logging.' },
      { title: 'EU passport-ready', description: 'Automatic schema validation against the published CEN/CENELEC DPP fields — zero manual mapping.' },
      { title: 'One-click board packs', description: 'Server-rendered evidence dossiers from any unit — email to a lender, print for the board.' },
    ],
  },
  {
    id: 'market-expansion',
    quarter: 'Q4 2026',
    title: 'Scale across verticals',
    pitch: 'Same platform, new fields — without a re-implementation.',
    status: 'planned',
    items: [
      { title: 'Beyond mining', description: 'Lithium, cobalt, nickel, graphite, agriculture paddocks, defense AOIs — switch the lens, keep the platform.' },
      { title: 'Portfolio across every site', description: 'Cross-project KPIs and roll-ups in a single workspace — every operation you run, one map.' },
      { title: 'Community transparency you control', description: 'Public PT/EN dashboards for regulators and locals — they see exactly what you publish, no more, no less.' },
      { title: 'True 3D geology', description: 'Drill traces, lithology, screen layers — geological cross-sections on the same map runtime.' },
      { title: 'Alarm workflow with paper trail', description: 'Acknowledge, escalate, resolve — every step appended to the audit chain.' },
    ],
  },
  {
    id: 'platform-standard',
    quarter: '2027+',
    title: 'Industry standard',
    pitch: 'Where the moat compounds and the leave-behind sells itself.',
    status: 'future',
    items: [
      { title: '100% DPP coverage', description: 'Every CEN/CENELEC field covered — EU export-ready by default for any unit type.' },
      { title: 'Public on-chain provenance', description: 'Any buyer can verify your supply chain without a portal account.' },
      { title: 'AI covenant reports', description: 'LLM drafts the monthly lender report, citing every data source — you approve and send.' },
      { title: 'Conference & board mode', description: 'Presentation themes for investor meetings, board sessions, and conference rooms — polished surface, same data.' },
      { title: 'White-label deployment', description: 'Run Vero under your own brand and domain.' },
      { title: 'Multi-language', description: 'EN / PT / ES / FR — full UI and report localization.' },
    ],
  },
]

export function HomeClosingSlide() {
  return (
    <MarketingSlideRoot>
      <S style={{ padding: '36px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={label}>Evidence Dossiers</div>
            <h2 style={heading}>Interactive reports. Export-ready PDF.</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Light-mode evidence dossiers with time range selectors and one-click PDF export.
              The same template adapts to any unit type — drill program, batch lot, equipment lifecycle,
              permit dossier — without new dependencies.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {REPORT_CARDS.map((r, i) => (
              <Stagger key={r.name} i={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  style={{ ...glass, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: r.accent, marginBottom: 6 }}>{r.name}</div>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      <S id="roadmap" style={{ padding: '36px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={label}>What unlocks next</div>
            <h2 style={heading}>From first sensor to industry standard</h2>
            <p style={{ ...body, margin: '0 auto', textAlign: 'center' }}>
              Each phase reuses the same three pillars — Map &amp; Geofence, Monitor &amp; Verify, Decide &amp; Report —
              so the platform you sign for this quarter is the platform that compounds in 2028.
              Below: what changes when, framed by what your buyers, regulators, and lenders actually see.
            </p>
          </div>
          <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${V}60, ${V}10)` }} />
            {HOME_ROADMAP.map((phase, i) => {
              const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24, position: 'relative' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: phase.status === 'active' ? `${V}20` : W.glass04, border: `1px solid ${phase.status === 'active' ? V : W.glass06}`,
                    }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                    </div>
                    <div style={{ ...glass, flex: 1, padding: '16px 20px' }}>
                      <div style={glow} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, position: 'relative' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: accent }}>{phase.title}</h3>
                        <span style={{
                          fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                          background: phase.status === 'active' ? `${V}20` : phase.status === 'shipped' ? `${W.green}20` : W.glass04,
                          color: accent,
                        }}>{phase.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: W.text2, fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.4, position: 'relative' }}>
                        {phase.pitch}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, position: 'relative' }}>
                        {phase.items.map(item => (
                          <div key={item.title} style={{ padding: '4px 0' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: W.text1 }}>{item.title}</div>
                            <div style={{ fontSize: 10, color: W.text3, lineHeight: 1.5, marginTop: 2 }}>{item.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Stagger>
              )
            })}
          </div>
        </div>
      </S>

      <S style={{ padding: '40px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...glow, background: `radial-gradient(ellipse at 50% 80%, ${V}08 0%, transparent 50%)` }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            See your operation on the map
          </h2>
          <p style={{ ...body, margin: '0 auto 28px', textAlign: 'center' }}>
            Walk through Vero on a live call — Map &amp; Geofence, Monitor &amp; Verify, Decide &amp; Report.
            Tell us what field operation you want to instrument (mine, paddock, AOI, plant, route) and we will tailor the demo to your data.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <RequestDemoButton size="lg" />
          </div>
        </div>
      </S>

      <footer style={{ padding: '24px 16px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 VeroChain. All rights reserved. Demo environment uses
          public-reference data, disclosure-aligned scenarios, and simulated time series.
        </p>
      </footer>
    </MarketingSlideRoot>
  )
}
