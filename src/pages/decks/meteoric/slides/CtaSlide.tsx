import { lazy, Suspense } from 'react'
import { Bullet } from '../../../../components/deck'
import { W, V, EU_DPP_DATE } from './shared'


const DeckCountdown = lazy(() => import('../DeckCountdown'))

export default function CtaSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        First Movers Set The Standard
      </h2>
      <div style={{ marginBottom: 20 }}>
        <Suspense fallback={null}>
          <DeckCountdown target={EU_DPP_DATE} label="Until EU DPP enforcement — shape the schema, don't chase it" />
        </Suspense>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 720, marginBottom: 32 }}>
        {[
          { label: 'Compliance', value: 'EU DPP Ready' },
          { label: 'Audit Trail', value: 'SHA-256' },
          { label: 'Field Data', value: 'LAPOC Ready' }
        ].map(s => (
          <div key={s.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, textAlign: 'left' }}>
        <Bullet>The Caldeira is a globally strategic asset. A flagship trust layer protects its valuation at every stage — PFS, DFS, and construction.</Bullet>
        <Bullet>The platform is production-ready: live geological data, environmental compliance telemetry, and a domain-grounded AI trained on the Caldeira's own datasets.</Bullet>
        <Bullet>The team brings iFood-scale engineering, 40 years of Caldeira context, and active LAPOC/ANSN field science.</Bullet>
        <Bullet accent={W.green}>Let's make it official. $102k/yr at 0.013% of NPV — less than one week of DFS consultant fees.</Bullet>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
          Open Platform
        </a>
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 16 }}>carlos@verochain.co</p>
    </>
  )
}
