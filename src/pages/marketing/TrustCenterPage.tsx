import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'
import { MarketingNav } from '../../components/layout/MarketingNav'
import { ScrollSection as S, Stagger, SectionHeader } from '../../components/layout/MarketingPrimitives'
import { useUnlockScroll, marketingStyles } from '../../components/layout/MarketingShared'
import { ease, V } from './sharedConstants'
import { Stat } from './shared'

const { wrap, label, heading, body, glass, glow } = marketingStyles

function ControlRow({ family, status, desc, evidence }: { family: string; status: 'implemented' | 'partial' | 'planned'; desc: string; evidence: string }) {
  const color = status === 'implemented' ? W.green : status === 'partial' ? W.amber : W.text4
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr 1fr', gap: 12, padding: '12px 0', borderBottom: `1px solid ${W.glass04}`, alignItems: 'start' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>{family}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{status}</div>
      <div style={{ fontSize: 13, color: W.text2, lineHeight: 1.5 }}>{desc}</div>
      <div style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>{evidence}</div>
    </div>
  )
}

export default function TrustCenterPage() {
  useUnlockScroll()

  return (
    <div style={{ background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>
      <MarketingNav
        section="trust"
        links={[
          { label: 'Tech', href: '/tech' },
          { label: 'Business', href: '/business' },
          { label: 'Trust', href: '/trust' },
        ]}
        cta={{ label: 'Founders Deck', href: '/deck/founders' }}
      />

      {/* Hero */}
      <header style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 2 }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${W.green}12 0%, transparent 70%)`, top: '-10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p style={{ ...label, marginBottom: 20, color: W.green }}>Trust Center</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 20, maxWidth: 800 }}>
            Security. Compliance. Transparency.
          </h1>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center', maxWidth: 640 }}>
            VeroChain is designed for FedRAMP and CMMC Level 2 compliance. Controls mapped to NIST 800-53 Rev 5, technical foundations implemented, architecture supports the authorization boundary.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease }}
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: 'NIST', label: '800-53 Mapped', sub: 'Rev 5 controls' },
            { value: 'CMMC', label: 'Level 2', sub: '110 practices mapped' },
            { value: 'SHA-256', label: 'Audit Chain', sub: 'Append-only + verify' },
            { value: 'CI/CD', label: 'SBOM + Scan', sub: 'Syft + Grype' },
          ].map(s => <Stat key={s.label} {...s} />)}
        </motion.div>
      </header>

      {/* Security Architecture */}
      <S id="architecture" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Security Architecture"
            heading="Defense-in-Depth by Design"
            body="Three-process architecture with natural segmentation. Engine communicates to API via HTTP only (unidirectional). Frontend consumes API via REST and authenticated WebSocket. No direct database access from any external surface."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { title: 'Authentication', items: ['API key auth on ingest/chat/alert/WS', 'Separate keys per function', 'Fail-closed in production', 'WebSocket token verification'] },
              { title: 'Network Controls', items: ['CORS strict origin allowlist', 'Content Security Policy (CSP)', 'Rate limiting (120 req/min global)', 'Per-endpoint rate limits'] },
              { title: 'Container Hardening', items: ['Non-root user (UID 1001)', 'cap_drop: ALL', 'Read-only filesystem', 'Alpine minimal base images'] },
              { title: 'Supply Chain', items: ['SBOM via Syft (CycloneDX)', 'Vulnerability scan via Grype', 'npm audit in CI pipeline', 'Dependabot automated updates'] },
              { title: 'Audit & Integrity', items: ['SHA-256 append-only hash chain', 'Chain integrity verification API', 'Event logging for all mutations', 'Exportable audit trail for assessors'] },
              { title: 'Data Honesty', items: ['Provenance tags on every data point', 'Disclosure mode for IR safety', 'Mock/live boundary enforced', 'TTL=0 on financial/geological data'] },
            ].map((c, i) => (
              <Stagger key={c.title} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: W.green }}>{c.title}</h3>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: W.text2, lineHeight: 1.8 }}>
                    {c.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* Compliance Roadmap */}
      <S id="compliance" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Compliance Roadmap"
            heading="Mapped. Documented. On the Path."
            body="Application-level controls are implemented and mapped to federal frameworks. Infrastructure controls require a FedRAMP-authorized cloud partner, planned as part of the Series A roadmap."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { framework: 'NIST 800-53 Rev 5', status: 'Controls mapped', detail: '8 control families mapped with code references. AC, AU, CM, IA, IR, RA, SC, SI — all with implemented/planned/N/A status per control.', color: W.green },
              { framework: 'CMMC Level 2', status: 'Practices mapped', detail: '110 practices from NIST 800-171 mapped. 52% application-level implemented, 29% infrastructure-dependent, 15% planned, 4% N/A.', color: W.green },
              { framework: 'SOC 2 Type I', status: 'Planned post-fundraise', detail: 'Trust Services Criteria (CC6, CC7, CC8) aligned with existing controls. Formal audit engagement planned after Series A.', color: W.amber },
              { framework: 'FedRAMP Tailored', status: 'Architecture designed', detail: 'Application controls satisfy FedRAMP Low baseline at application layer. Authorization requires 3PAO assessment with cloud partner.', color: W.amber },
              { framework: 'ISO 27001', status: 'Planned', detail: 'ISMS scope defined. Implementation planned after SOC 2 Type I, leveraging overlapping control documentation.', color: W.text4 },
              { framework: 'EU GDPR / BR LGPD', status: 'DPA available', detail: 'Data Processing Addendum documents data categories, storage, retention, deletion, sub-processors, and residency options.', color: W.green },
            ].map((f, i) => (
              <Stagger key={f.framework} i={i}>
                <div style={glass}>
                  <div style={glow} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{f.framework}</h3>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: f.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{f.status}</div>
                  <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </S>

      {/* NIST Control Families */}
      <S id="nist" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="NIST 800-53 Rev 5"
            heading="Control Family Mapping"
            body="Application-level controls mapped to the eight priority control families that FedRAMP assessors evaluate first."
          />
          <div style={{ ...glass, overflow: 'auto' }}>
            <div style={glow} />
            <div style={{ minWidth: 700 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr 1fr', gap: 12, padding: '12px 0', borderBottom: `1px solid ${W.glass08}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Family</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Evidence</div>
              </div>
              <ControlRow family="AC" status="partial" desc="Access Control — API key auth, endpoint separation, rate limiting, CORS" evidence="server/src/index.ts, telemetryChannel.ts" />
              <ControlRow family="AU" status="implemented" desc="Audit — SHA-256 hash chain, event logging, chain verification, export" evidence="store/auditChain.ts, /api/audit/*" />
              <ControlRow family="CM" status="implemented" desc="Config Management — SBOM, CI pipeline, TypeScript strict, validated env" evidence="ci.yml, validateEnv.ts, CONTRIBUTING.md" />
              <ControlRow family="IA" status="partial" desc="Identification & Auth — API keys per function, WS token auth" evidence="index.ts onRequest hook, rbac-design.md" />
              <ControlRow family="IR" status="implemented" desc="Incident Response — plan, severity matrix, SLAs, communication templates" evidence="incident-response.md, SECURITY.md" />
              <ControlRow family="RA" status="implemented" desc="Risk Assessment — risk register, vulnerability scanning, persona framework" evidence="/api/risks, Grype in CI" />
              <ControlRow family="SC" status="partial" desc="System Protection — CSP, CORS, rate limits, TLS at deployment layer" evidence="vercel.json, server/src/index.ts" />
              <ControlRow family="SI" status="implemented" desc="System Integrity — Grype scan, npm audit, Dependabot, ESLint, TypeScript" evidence="ci.yml security job, eslint.config.js" />
            </div>
          </div>
        </div>
      </S>

      {/* SBOM & Vulnerability Scanning */}
      <S id="sbom" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Software Supply Chain"
            heading="SBOM on Every Build"
            body="CycloneDX Software Bill of Materials generated via Syft on every CI build. Vulnerability scanning via Grype. Full SBOM artifacts available as pipeline artifacts for assessor review."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { v: 'Syft', l: 'SBOM Generator', s: 'CycloneDX format' },
              { v: 'Grype', l: 'Vulnerability Scanner', s: 'Fail on critical CVEs' },
              { v: 'npm audit', l: 'Dependency Audit', s: 'High/critical threshold' },
              { v: 'Dependabot', l: 'Auto Updates', s: 'Automated PRs' },
              { v: '98%', l: 'OSI-Approved', s: 'License compliance' },
            ].map((s, i) => (
              <Stagger key={s.l} i={i}>
                <div style={{ ...glass, textAlign: 'center' }}>
                  <div style={glow} />
                  <Stat value={s.v} label={s.l} sub={s.s} />
                </div>
              </Stagger>
            ))}
          </div>
          <div style={{ ...glass, maxWidth: 700, margin: '0 auto' }}>
            <div style={glow} />
            <p style={{ fontSize: 14, color: W.text2, margin: 0, lineHeight: 1.7, textAlign: 'center' }}>
              SBOM summary available at <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>/api/security/sbom-summary</code>. Full CycloneDX artifacts downloadable from CI pipeline. API endpoint at <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>/api/audit/verify-chain</code> validates the integrity of the append-only audit chain.
            </p>
          </div>
        </div>
      </S>

      {/* Responsible Disclosure */}
      <S id="disclosure" style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <SectionHeader
            label="Responsible Disclosure"
            heading="Report. Respond. Resolve."
            body="We take security seriously. Our responsible disclosure policy provides clear SLAs and a structured process for security researchers."
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { time: '48 hours', action: 'Acknowledgement', desc: 'We confirm receipt and begin assessment' },
              { time: '5 days', action: 'Assessment', desc: 'Initial severity and impact evaluation' },
              { time: '10 days', action: 'Resolution Timeline', desc: 'Fix plan communicated to reporter' },
            ].map((s, i) => (
              <Stagger key={s.action} i={i}>
                <div style={{ ...glass, textAlign: 'center' }}>
                  <div style={glow} />
                  <div style={{ fontSize: 24, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>{s.time}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginTop: 6 }}>{s.action}</div>
                  <div style={{ fontSize: 13, color: W.text2, marginTop: 6 }}>{s.desc}</div>
                </div>
              </Stagger>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: 14, color: W.text2 }}>
              Report vulnerabilities to <code style={{ color: V, fontFamily: 'var(--font-mono)' }}>security@vero.earth</code>
            </p>
          </div>
        </div>
      </S>

      {/* CTA */}
      <S style={{ padding: '80px 0 60px', textAlign: 'center' }}>
        <div style={wrap}>
          <h2 style={{ ...heading, marginBottom: 12 }}>Questions About Security?</h2>
          <p style={{ ...body, margin: '0 auto 32px', textAlign: 'center' }}>
            Review our full compliance documentation or contact our team for a security briefing.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/tech" style={{ background: V, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Technical Deep Dive</a>
            <a href="/lp" style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Back to Website</a>
          </div>
        </div>
      </S>

      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: `1px solid ${W.glass06}` }}>
        <p style={{ color: W.text4, fontSize: 11, margin: 0, lineHeight: 1.5, maxWidth: 600, marginInline: 'auto' }}>
          © 2026 VeroChain. Controls mapped to NIST 800-53 Rev 5 and CMMC Level 2. FedRAMP authorization pending cloud partner selection.
          See SECURITY.md for responsible disclosure. See docs/compliance/ for full control mapping documentation.
        </p>
      </footer>
    </div>
  )
}
