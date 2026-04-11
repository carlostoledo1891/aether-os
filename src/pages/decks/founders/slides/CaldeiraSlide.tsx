import { W, V } from '../shared'
import { StatCard } from '../../../../components/deck'

const STATS = [
  { v: '$821M', l: 'NPV Pre-Tax', s: 'Consensus' }, { v: '$443M', l: 'CAPEX', s: 'Total' },
  { v: '$315M', l: 'Annual Revenue', s: 'Consensus' }, { v: '28%', l: 'IRR Pre-Tax', s: 'Consensus' },
  { v: '1.54 Bt', l: 'Global Resource', s: 'JORC 2012' }, { v: '20 yrs', l: 'Mine Life', s: 'LOM' },
]

export default function CaldeiraSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>The Caldeira Showcase</h2>
    <p style={{ fontSize: 13, color: W.text3, marginBottom: 32, maxWidth: 500 }}>Meteoric Resources (ASX: MEI) — Caldeira Project, Poços de Caldas, MG, Brazil</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, maxWidth: 940, width: '100%' }}>
      {STATS.map(s => <StatCard key={s.l} value={s.v} label={s.l} sub={s.s} />)}
    </div>
    <div style={{ marginTop: 20, background: `${V}12`, border: `1px solid ${V}30`, borderRadius: 12, padding: '14px 24px', maxWidth: 500 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>0.03%</div>
      <div style={{ fontSize: 12, color: W.text2, marginTop: 4 }}>Vero costs $102k/yr — <strong style={{ color: W.text1 }}>0.03% of Caldeira's annual revenue</strong>. Less than one day of interest on the construction loan.</div>
    </div>
  </>)
}
