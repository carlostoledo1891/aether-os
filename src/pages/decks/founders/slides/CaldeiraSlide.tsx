import { W, V } from '../shared'
import { StatCard } from '../../../../components/deck'

const STATS = [
  { v: '$821M', l: 'NPV Pre-Tax', s: 'Consensus' }, { v: '$443M', l: 'CAPEX', s: 'Total' },
  { v: '$315M', l: 'Annual Revenue', s: 'Consensus' }, { v: '28%', l: 'IRR Pre-Tax', s: 'Consensus' },
  { v: '1.54 Bt', l: 'Global Resource', s: 'JORC 2012' }, { v: '20 yrs', l: 'Mine Life', s: 'LOM' },
]

export default function CaldeiraSlide() {
  return (<>
    <div style={{ fontSize: 11, color: W.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Reference deployment 1 of 2 · /app/meteoric</div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>The Caldeira Reference Deployment</h2>
    <p style={{ fontSize: 13, color: W.text3, marginBottom: 32, maxWidth: 580 }}>Meteoric Resources (ASX: MEI) — Caldeira Project, Poços de Caldas, MG, Brazil. Project economics below are sourced from public MEI disclosures, not Vero-verified. The next slide shows the Atlantic Maritime ISR sibling instance running on the same runtime.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, maxWidth: 940, width: '100%' }}>
      {STATS.map(s => <StatCard key={s.l} value={s.v} label={s.l} sub={s.s} />)}
    </div>
    <div style={{ marginTop: 20, background: `${V}12`, border: `1px solid ${V}30`, borderRadius: 12, padding: '14px 24px', maxWidth: 500 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>0.03%</div>
      <div style={{ fontSize: 12, color: W.text2, marginTop: 4 }}>Modeled scenario: VeroChain Growth tier at $102k/yr would represent <strong style={{ color: W.text1 }}>~0.03% of Caldeira's disclosed annual revenue</strong> — less than one day of interest on the disclosed construction loan.</div>
    </div>
  </>)
}
