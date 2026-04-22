import { lazy, Suspense } from 'react'
import { StatCard, Tag } from '../../../../components/deck'
import { W, V } from './shared'

const AnimatedStat = lazy(() => import('../AnimatedStat'))

const TABS = [
  { tab: 'Geology', desc: 'Resource overview, deposit geometry, and issuer snapshot with ASX links' },
  { tab: 'Pilot Validation', desc: 'Pilot vs ANSTO recovery, MREC quality, and process-readiness reference points' },
  { tab: 'Hydro Twin', desc: 'Hydrology remains visible without blurring geology claims or reserve language' },
  { tab: 'Map Evidence', desc: 'Drill collars, licence boundaries, and Caldeira field context in one surface' },
  { tab: 'Technical Appendix', desc: 'Printable dossier for committee review and offline circulation' },
  { tab: 'AI Provenance', desc: 'Source-grounded answers that show where each geology figure came from' },
]

export default function ExecutiveSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Technical Review Surface</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Built For Geology Review, Not Board Theatre</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 880, width: '100%', marginBottom: 20 }}>
        <Suspense fallback={<StatCard value="1" label="Primary Surface" sub="Geology-first" />}>
          <AnimatedStat value={1} label="Primary Surface" sub="Geology-first demo path" />
        </Suspense>
        <Suspense fallback={<StatCard value="1" label="Appendix" sub="Printable" />}>
          <AnimatedStat value={1} label="Appendix" sub="Printable geology dossier" />
        </Suspense>
        <Suspense fallback={<StatCard value="750" label="Drill Holes" sub="Public ASX metadata" />}>
          <AnimatedStat value={750} label="Drill Holes" suffix="+" sub="Public ASX metadata, source-linked" />
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
      <p style={{ fontSize: 12, color: W.text3, maxWidth: 600 }}>
        The product should feel like something a chief geologist would actually use: defensible figures, visible methodology, and a printable appendix instead of dashboard theatre.
      </p>
    </>
  )
}
