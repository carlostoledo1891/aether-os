import { lazy, Suspense } from 'react'
import { Bullet } from '../../../../components/deck'
import { W, V } from './shared'

const FakeChat = lazy(() => import('../FakeChat'))

export default function AiToolsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>27 Grounded AI Tools — and Growing</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 940, width: '100%', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Bullet>Geology: lithology lookup, resource classification helpers, drill log queries</Bullet>
          <Bullet>Financial: scenario modeling, NPV sensitivity sweeps, CAPEX scratchpad</Bullet>
          <Bullet>Compliance: DPP field lookup, FEOC origin queries, audit chain inspection</Bullet>
          <Bullet>Environmental: water quality readouts, spring status summaries (modeled inputs)</Bullet>
          <div style={{ marginTop: 8, background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
            <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>Hallucination fence</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: W.text2, lineHeight: 1.6 }}>
              <span style={{ color: W.green }}>✓</span> 11 guardrail tests · 100% pass<br />
              <span style={{ color: W.green }}>✓</span> Refuses lithium queries<br />
              <span style={{ color: W.green }}>✓</span> Source citation on every answer
            </div>
          </div>
          <div style={{ marginTop: 4, background: `${V}08`, border: `1px dashed ${V}50`, borderRadius: 10, padding: '10px 14px', textAlign: 'left' }}>
            <span style={{ fontSize: 11, color: V, fontWeight: 600 }}>AI workflows are project-specific.</span>
            <span style={{ fontSize: 11, color: W.text3 }}> 27 grounded tools today, swappable per use case via the Vercel AI SDK function-calling layer. New tools added without rewiring the UI.</span>
          </div>
        </div>
        <Suspense fallback={null}>
          <FakeChat />
        </Suspense>
      </div>
    </>
  )
}
