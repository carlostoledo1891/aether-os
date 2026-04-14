import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'
import { Kw, Str, Num, Cmt, Fn } from '../../components/deck'
import { PRODUCT_ROADMAP } from '../../data/domain/roadmap'
import { MarketingNav } from '../../components/layout/MarketingNav'
import { MarketingObservability } from '../../components/layout/MarketingObservability'
import { ScrollSection as S, Stagger } from '../../components/layout/MarketingPrimitives'
import { useUnlockScroll, marketingStyles } from '../../components/layout/MarketingShared'
import { ease, V } from './sharedConstants'
import { Terminal } from './shared'

import {
  HERO_STATS,
  INDUSTRIES,
  CAPABILITIES,
  ARCH_NODES,
  QUALITY,
  TEAM,
  AI_TOOLS,
  MARKET_DATA,
  REPORT_CARDS,
  MARKETING_COPY
} from '../../config/marketing'

/* ── Style helpers ───────────────────────────────────────────────── */

const { label, heading, body, glass, glow } = marketingStyles
const wrap: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' }

/* ── Component ───────────────────────────────────────────────────── */

export default function LandingPage() {
  useUnlockScroll()

  return (
    <div style={{ background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      <MarketingNav
        links={[
          { label: 'Tech', href: '/tech' },
          { label: 'Business', href: '/business' },
        ]}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '100px 24px 60px', position: 'relative', overflow: 'hidden',
      }}>
        <motion.div animate={{ opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '55vw', height: '55vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}14, transparent 70%)`, top: '-12vw', left: '22vw', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '35vw', height: '35vw', borderRadius: '50%', background: `radial-gradient(circle, ${V}0C, transparent 70%)`, bottom: '-5vw', right: '15vw', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}>
          <div style={{ ...label, marginBottom: 28, position: 'relative' }}>Operational Intelligence Platform</div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{ fontSize: 'clamp(36px, 6.5vw, 72px)', fontWeight: 800, lineHeight: 1.05, maxWidth: 880, margin: '0 0 24px', position: 'relative', background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {MARKETING_COPY.heroHeadline}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease }}
          style={{ ...body, marginBottom: 40, position: 'relative', textAlign: 'center' }}>
          {MARKETING_COPY.heroSubhead}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease }}
          style={{ display: 'flex', gap: 12, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/app" style={{ background: V, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Open Platform
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
          style={{ marginTop: 72, display: 'flex', gap: 0, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          {HERO_STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 32px', borderLeft: i > 0 ? `1px solid ${W.glass08}` : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}
          style={{ marginTop: 24, fontSize: 11, color: W.text4, letterSpacing: '0.04em', position: 'relative' }}>
          {MARKETING_COPY.heroFooter}
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 36, color: W.text4, fontSize: 20, opacity: 0.4 }}>↓</motion.div>
      </section>

      {/* ── Industries ─────────────────────────────────────────── */}
      <S id="industries" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={label}>Multi-Industry</div>
            <h2 style={heading}>One platform. Any critical operation.</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              VeroChain adapts to any industry where operational data, compliance evidence,
              and stakeholder trust must coexist in a single source of truth.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {INDUSTRIES.map((ind, i) => (
              <Stagger key={ind.title} i={i}>
                <motion.div whileHover={{ y: -4, borderColor: V + '40' }} transition={{ duration: 0.2 }}
                  style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: V, opacity: 0.6 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 8 }}>{ind.title}</div>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{ind.desc}</p>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── Platform Capabilities ──────────────────────────────── */}
      <MarketingObservability />

      <S id="platform" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={label}>The Platform</div>
            <h2 style={heading}>Ingest. Visualize. Verify.</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Three pillars that turn scattered operational data into audit-ready
              intelligence any stakeholder can trust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {CAPABILITIES.map((c, idx) => (
              <Stagger key={c.tag} i={idx}>
                <motion.div whileHover={{ y: -4, borderColor: V + '40' }} transition={{ duration: 0.2 }}
                  style={{ ...glass, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: V, opacity: 0.7 }} />
                  <div style={{ ...label, marginBottom: 4 }}>{c.tag}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, marginBottom: 10 }}>{c.headline}</h3>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, marginBottom: 20 }}>{c.desc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {c.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${V}40` }} />
                        <span style={{ fontSize: 13, color: W.text2, lineHeight: 1.55 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 0, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${W.glass06}` }}>
                    {c.metrics.map((m, i) => (
                      <div key={m.label} style={{ textAlign: 'center', flex: 1, borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
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

      {/* ── Data Pipeline ──────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={label}>Data Ingestion</div>
            <h2 style={heading}>From raw data to Digital Twin</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Connect datasets, sensor channels, and external APIs. VeroChain normalizes
              everything into a unified operational model with sub-second refresh.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
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
                {'  '}<Cmt>{'// Layer 1: API TTL (authoritative)'}</Cmt><br />
                {'  '}<Cmt>{'// Layer 2: 200ms mount-coalescing'}</Cmt><br />
                {'  '}<Cmt>{'// Financial + geological: TTL = 0'}</Cmt><br />
                <br />
                {'  '}<Kw>return</Kw>{' fetch(endpoint)'}<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>
        </div>
      </S>

      {/* ── Architecture ───────────────────────────────────────── */}
      <S id="architecture" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={label}>Under the Hood</div>
            <h2 style={heading}>Production-grade architecture</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Three-process production system. Enterprise security. Zero TypeScript errors.
              Built to survive due diligence — not just demos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 40 }}>
            {ARCH_NODES.map((node, i) => (
              <Stagger key={node.label} i={i}>
                <motion.div whileHover={{ scale: 1.04, borderColor: V }} transition={{ duration: 0.2 }}
                  style={{ ...glass, padding: '18px 14px', textAlign: 'center' }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 2, background: V, opacity: 0.6 }} />
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{node.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: W.text1, marginBottom: 3 }}>{node.label}</div>
                  <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4 }}>{node.sub}</div>
                </motion.div>
              </Stagger>
            ))}
          </div>

          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${V}40, transparent)`, borderRadius: 1, marginBottom: 40, maxWidth: 700, marginInline: 'auto', position: 'relative' }}>
            <motion.div animate={{ left: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: -3, width: 8, height: 8, borderRadius: '50%', background: V, boxShadow: `0 0 12px ${V}80` }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 40 }}>
            <Stagger i={0}>
              <Terminal title="server/src/index.ts">
                <Cmt>{'// Security hardening'}</Cmt><br />
                <Kw>app</Kw>.<Fn>register</Fn>(<Str>rateLimit</Str>, {'{'}<br />
                {'  max: '}<Num>120</Num>,<br />
                {'  timeWindow: '}<Str>'1 minute'</Str><br />
                {'})'}<br />
                <br />
                <Kw>app</Kw>.<Fn>addHook</Fn>(<Str>'onSend'</Str>, (req, reply) {'=> {'}<br />
                {'  reply.header('}<Str>'Content-Security-Policy'</Str>{', csp)'}<br />
                {'  reply.header('}<Str>'X-Content-Type-Options'</Str>{', '}<Str>'nosniff'</Str>{')'}<br />
                {'})'}
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <Terminal title="GET /api/docs — OpenAPI">
                <Cmt>{'// Auto-generated from Fastify schemas'}</Cmt><br />
                {'{'}<br />
                {'  '}<Str>"openapi"</Str>: <Str>"3.0.0"</Str>,<br />
                {'  '}<Str>"paths"</Str>: {'{'}<br />
                {'    '}<Str>"/api/health"</Str>: {'{ ... },'}<br />
                {'    '}<Str>"/api/telemetry/*"</Str>: {'{ ... },'}<br />
                {'    '}<Str>"/api/audit/verify-chain"</Str>: {'{ ... },'}<br />
                {'    '}<Str>"/api/chat"</Str>: {'{ ... }'}<br />
                {'  }'}<br />
                {'}'}
              </Terminal>
            </Stagger>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 800, marginInline: 'auto' }}>
            {QUALITY.map((s, i) => (
              <Stagger key={s.label} i={i}>
                <motion.div whileHover={{ y: -2, borderColor: V + '40' }} transition={{ duration: 0.2 }}
                  style={{ padding: '20px 12px', background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: W.text1, marginTop: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: W.text4, marginTop: 2 }}>{s.sub}</div>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── AI Agent ──────────────────────────────────────────── */}
      <S id="ai-agent" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={label}>AI Agent</div>
            <h2 style={heading}>{MARKETING_COPY.aiTagline}</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Frontier LLM with domain-specific tools. Hallucination-tested and guardrailed. Model-agnostic via AI SDK.
              Every response carries visible provenance — the agent refuses to speculate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 40 }}>
            <Stagger i={0}>
              <Terminal title="AI Hallucination Test Suite">
                <Kw>test</Kw>(<Str>"JORC measured resource"</Str>, () {'=> {'}<br />
                {'  '}<Cmt>{'// Agent must cite real data'}</Cmt><br />
                {'  '}<Kw>expect</Kw>(answer).<Fn>toContain</Fn>(<Str>"37 Mt"</Str>)<br />
                {'})'}<br /><br />
                <Kw>test</Kw>(<Str>"refuses lithium question"</Str>, () {'=> {'}<br />
                {'  '}<Cmt>{'// Q: "Do you have lithium data?"'}</Cmt><br />
                {'  '}<Kw>expect</Kw>(answer).<Fn>toContain</Fn>(<Str>"rare earth"</Str>)<br />
                {'  '}<Cmt>{'// Agent refuses: no lithium in dataset'}</Cmt><br />
                {'})'}<br /><br />
                <Fn>{'// 10 tests · 100% pass rate required'}</Fn>
              </Terminal>
            </Stagger>
            <Stagger i={1}>
              <div style={glass}>
                <div style={{ ...label, marginBottom: 16 }}>Tool Categories</div>
                {AI_TOOLS.map(c => (
                  <div
                    key={'cat' in c ? c.cat : c.name}
                    style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${W.glass06}` }}
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

      {/* ── Market & Regulatory ─────────────────────────────────── */}
      <S id="market" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 48 }}>
            <div>
              <div style={label}>Market Opportunity</div>
              <h2 style={{ ...heading, marginBottom: 32 }}>Sourced TAM / SAM / SOM</h2>
              {MARKET_DATA.map(m => (
                <div key={m.tier} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{m.tier}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value}</span>
                  </div>
                  <div style={{ height: 5, background: W.glass04, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }}
                      transition={{ duration: 1.2, ease }}
                      style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: W.text3 }}>{m.desc}{m.cagr !== '—' ? ` · ${m.cagr} CAGR` : ''}</span>
                    <span style={{ fontSize: 9, color: W.text4, fontFamily: 'var(--font-mono)' }}>{m.src}</span>
                  </div>
                </div>
              ))}
              <div style={{ background: `${V}12`, border: `1px solid ${V}30`, borderRadius: 12, padding: '14px 20px', marginTop: 16 }}>
                <div style={{ fontSize: 11, color: W.text2 }}>At <span style={{ color: V, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$102k ACV</span>, VeroChain costs <span style={{ fontWeight: 700, color: W.text1 }}>0.03% of client annual revenue</span>. Price sensitivity: effectively zero.</div>
              </div>
            </div>

            <div>
              <div style={label}>Regulatory Moat</div>
              <h2 style={{ ...heading, marginBottom: 32 }}>Regulation creates the market</h2>
              {[
                { driver: 'EU Digital Product Passport', date: 'Feb 2027', status: '22 / 37 CEN/CENELEC fields mapped — 59% ready', color: V },
                { driver: 'US FEOC / IRA Compliance', date: 'Active now', status: 'FEOC 0.00% Chinese content · SHA-256 audit chain', color: W.cyan },
                { driver: 'Australian ESG Reporting', date: '2025+', status: '5 ESG frameworks · 62-92% coverage', color: W.green },
              ].map((r, i) => (
                <Stagger key={r.driver} i={i}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
                    style={{ ...glass, marginBottom: 14, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: W.text1 }}>{r.driver}</div>
                      <span style={{ fontSize: 11, color: r.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: '6px 0 0' }}>{r.status}</p>
                  </motion.div>
                </Stagger>
              ))}
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, marginTop: 12 }}>
                No competitor is past 20% DPP coverage. Enforcement is in 10 months. This is the Pix moment for mineral compliance.
              </p>
            </div>
          </div>
        </div>
      </S>

      {/* ── Report Templates ──────────────────────────────────── */}
      <S style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={label}>Report Templates</div>
            <h2 style={heading}>Interactive reports. Export-ready PDF.</h2>
            <p style={{ ...body, margin: '0 auto' }}>
              Light-mode reports with time range selectors and one-click PDF export.
              Environment, Operations, and Drill data — no new dependencies.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {REPORT_CARDS.map((r, i) => (
              <Stagger key={r.name} i={i}>
                <motion.div whileHover={{ y: -4, borderColor: r.accent + '40' }} transition={{ duration: 0.2 }}
                  style={{ ...glass, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: r.accent, opacity: 0.7 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: r.accent, marginBottom: 8 }}>{r.name}</div>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                </motion.div>
              </Stagger>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Terminal title="reportTheme.ts — WL Light Palette">
              <Kw>export const</Kw> <Fn>WL</Fn> = {'{'} bg: <Str>'#FFFFFF'</Str>, panel: <Str>'#F5F5FA'</Str>, text1: <Str>'#1A1A2E'</Str>, violet: <Str>'#7C5CFC'</Str> {'}'} <Kw>as const</Kw><br />
              <Cmt>{'// Same structure as W — swap the token, swap the theme'}</Cmt>
            </Terminal>
          </div>
        </div>
      </S>

      {/* ── Roadmap ─────────────────────────────────────────────── */}
      <S id="roadmap" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={label}>Roadmap</div>
            <h2 style={heading}>Planned Releases</h2>
            <p style={{ ...body, margin: '0 auto', textAlign: 'center' }}>
              From pilot-ready to platform standard — a clear path to full DPP compliance and multi-commodity support.
            </p>
          </div>
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${V}60, ${V}10)` }} />
            {PRODUCT_ROADMAP.map((phase, i) => {
              const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
              return (
                <Stagger key={phase.id} i={i}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 32, position: 'relative' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: phase.status === 'active' ? `${V}20` : W.glass04, border: `1px solid ${phase.status === 'active' ? V : W.glass06}`,
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{phase.quarter}</span>
                    </div>
                    <div style={{ ...glass, flex: 1, padding: '20px 24px' }}>
                      <div style={glow} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: accent }}>{phase.title}</h3>
                        <span style={{
                          fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                          background: phase.status === 'active' ? `${V}20` : phase.status === 'shipped' ? `${W.green}20` : W.glass04,
                          color: accent,
                        }}>{phase.status}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, position: 'relative' }}>
                        {phase.items.map(item => (
                          <div key={item.title} style={{ padding: '6px 0' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, marginTop: 2 }}>{item.description}</div>
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

      {/* ── Team ───────────────────────────────────────────────── */}
      <S id="team" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={glow} />
        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={label}>Team</div>
            <h2 style={heading}>Built by domain experts</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TEAM.map((t, i) => (
              <Stagger key={t.name} i={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} style={glass}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: W.text1, marginBottom: 4 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: V, fontWeight: 600, marginBottom: 12 }}>{t.role}</div>
                    </div>
                    {t.onboarding && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${V}20`, border: `1px solid ${V}40`, padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', alignItems: 'center', color: V }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        </motion.div>
                        <span style={{ fontSize: 8, fontWeight: 800, color: V, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pitching</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                </motion.div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <S style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...glow, background: `radial-gradient(ellipse at 50% 80%, ${V}08 0%, transparent 50%)` }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: 16, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            See VeroChain in action
          </h2>
          <p style={{ ...body, margin: '0 auto 36px', textAlign: 'center' }}>
            Explore the live platform or request a pilot deployment.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/app" style={{ background: V, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
          </div>
        </div>
      </S>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 10, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 VeroChain. All rights reserved. Demo environment uses
          public-reference data, disclosure-aligned scenarios, and simulated time series.
        </p>
      </footer>
    </div>
  )
}
