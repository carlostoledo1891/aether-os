import { lazy, Suspense } from 'react'
import { Bullet } from '../../../../components/deck'
import { W, V, EU_DPP_DATE } from './shared'


const DeckCountdown = lazy(() => import('../DeckCountdown'))

export default function CtaSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 8, color: W.text1 }}>
        This is not a deck.
      </h2>
      <h2 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 28, background: `linear-gradient(135deg, ${W.text4} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        It's not a prototype.
      </h2>
      <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 520, lineHeight: 1.6, marginBottom: 28, textAlign: 'center' }}>
        Live geological data. Environmental compliance telemetry. A domain-grounded AI trained on the Caldeira's own datasets. It's running — go in and see.
      </p>
      <div style={{ marginBottom: 28 }}>
        <Suspense fallback={null}>
          <DeckCountdown target={EU_DPP_DATE} label="Until EU DPP enforcement — shape the schema, don't chase it" />
        </Suspense>
      </div>
      <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, textAlign: 'left' }}>
        <Bullet>The Caldeira is a globally strategic asset. A flagship trust layer protects its valuation at every stage — PFS, DFS, and construction.</Bullet>
        <Bullet>The team brings production-grade engineering, 40 years of Caldeira context, and active LAPOC/ANSN field science.</Bullet>
        <Bullet accent={W.green}>$102k/yr at 0.013% of NPV — less than one week of DFS consultant fees.</Bullet>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/app" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '16px 40px', borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.01em' }}>
          Enter the Platform
        </a>
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 20 }}>carlos@verochain.co</p>
    </>
  )
}
