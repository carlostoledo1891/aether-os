import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const FOCUS_ITEMS = [
  'Caldeira pilot — Meteoric demo, field integration, LAPOC instruments',
  'Dev pipeline — new features, regulatory datasets, DPP compliance fields',
  'Field work — geology, hydrology, plant commissioning, community dashboards',
  'Science — Dr. Caponi coordination, instrument validation, data provenance',
]

const CANNOT_ITEMS = [
  'GTM strategy and commercial negotiations',
  'Investor pipeline and fundraising execution',
  'Pricing benchmarks and contract structuring',
  'Board governance and advisory network',
  'Market positioning against Minviro, Circulor, generic ESG',
]

const LANES = [
  { who: 'Carlos', lane: 'Product + Science + Field', detail: 'Builds the platform, runs the pilot, integrates LAPOC', href: '/' },
  { who: 'Juliano', lane: 'Tech Mentorship', detail: 'Architecture review, hiring bar, scaling guidance', href: '/tech' },
  { who: 'Guilherme', lane: 'Commercial Front', detail: 'GTM, investor pipeline, revenue strategy', href: '/business' },
]

export default function WhyINeedYouSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Focus Thesis</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Why I Need You</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 24, maxWidth: 900, width: '100%', marginBottom: 24 }}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What I need to focus on</div>
        {FOCUS_ITEMS.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, marginTop: 6, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
      <div style={{ background: W.glass08, width: 1 }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 11, color: W.text4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What I cannot do simultaneously</div>
        {CANNOT_ITEMS.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${W.text4}60`, marginTop: 6, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 800, width: '100%', marginBottom: 16 }}>
      {LANES.map(p => (
        <a key={p.who} href={p.href} onClick={e => e.stopPropagation()} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '16px 14px', textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: V }}>{p.who}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: W.text1, marginTop: 4 }}>{p.lane}</div>
          <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>{p.detail}</div>
          <div style={{ fontSize: 10, color: V, fontFamily: 'var(--font-mono)', marginTop: 6, opacity: 0.7 }}>{p.href === '/' ? 'Platform →' : `vero.supply${p.href} →`}</div>
        </a>
      ))}
    </div>
    <p style={{ fontSize: 12, color: W.text4, maxWidth: 600 }}>
      Today I work with 2 US-based frontier AI companies. I see the regulations creating the market. The perfect storm is forming for rare earth minerals tech. Seed money lets me go 100% on Vero — you handle the front.
    </p>
  </>)
}
