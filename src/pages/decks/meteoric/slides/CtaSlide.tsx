import { lazy, Suspense } from 'react'
import { Bullet, GlassRow } from '../../../../components/deck'
import { W, V, EU_DPP_DATE } from './shared'

import { MARKETING_COPY } from '../../../../config/marketing'

const DeckCountdown = lazy(() => import('../DeckCountdown'))

export default function CtaSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Let's Make It Official
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
        <Bullet>Full platform: 3 views + Mini Engine + {MARKETING_COPY.aiToolCount} AI tools</Bullet>
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
    </>
  )
}
