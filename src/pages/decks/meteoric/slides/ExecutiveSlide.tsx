import { lazy, Suspense } from 'react'
import { StatCard, Tag } from '../../../../components/deck'
import { W, V } from './shared'

const AnimatedStat = lazy(() => import('../AnimatedStat'))

const TABS = [
  { tab: 'Financials', desc: 'NPV sensitivity, IRR, DSCR, CAPEX breakdown, C1/AISC costs' },
  { tab: 'Capital', desc: 'DFS milestone bars, CPs, funding tracker, construction loan status' },
  { tab: 'Risk Register', desc: 'Top-decile risks with owners, mitigations, last-reviewed cadence' },
  { tab: 'Assets', desc: 'Resource overview, deposit geometry, issuer snapshot with ASX links' },
  { tab: 'ESG', desc: 'Environmental metrics, community engagement, regulatory compliance status' },
  { tab: 'Pipeline', desc: 'Offtake tracker with binding vs LOI labels, counterparty status' },
]

export default function ExecutiveSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Executive Overview</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Executive &amp; Capital Intelligence</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 880, width: '100%', marginBottom: 20 }}>
        <Suspense fallback={<StatCard value="9" label="Dashboard Tabs" sub="Synchronized" />}>
          <AnimatedStat value={9} label="Dashboard Tabs" sub="Synchronized to board rhythm" />
        </Suspense>
        <Suspense fallback={<StatCard value="3" label="Financial Scenarios" sub="Bear / Consensus / Bull" />}>
          <AnimatedStat value={3} label="Financial Scenarios" sub="Bear / Consensus / Bull" />
        </Suspense>
        <Suspense fallback={<StatCard value="443" label="CAPEX Tracked" sub="$M" />}>
          <AnimatedStat value={443} label="CAPEX Tracked" prefix="$" suffix="M" sub="One-click answer" />
        </Suspense>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 880, width: '100%', marginBottom: 16 }}>
        {TABS.map(t => (
          <div key={t.tab} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '14px 12px', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: V, marginBottom: 4 }}>{t.tab}</div>
            <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: W.text4, maxWidth: 600 }}>
        Every tab maps to a board agenda item. One narrative, zero contradictions. Your next raise closes faster when every diligence question has a dashboard answer.
      </p>
    </>
  )
}
