import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const PERSONA_SCORES = [
  { p: 'Chairman (Tunks)', s: '10.0', gap: 'Code ceiling' },
  { p: 'CEO (Gale)', s: '10.0', gap: 'Code ceiling' },
  { p: 'Chief Geologist', s: '10.0', gap: 'Code ceiling' },
  { p: 'PF Analyst (Bank)', s: '9.5', gap: 'Covenant monitoring' },
  { p: 'SCADA Integrator', s: '10.0', gap: 'Code ceiling' },
  { p: 'Journalist', s: '10.0', gap: 'Code ceiling' },
  { p: 'EU Enforcement', s: '8.5', gap: '100% DPP coverage' },
  { p: 'NGO (Water)', s: '8.5', gap: 'Field-verified springs' },
  { p: 'DoD (Pentagon)', s: '8.0', gap: 'FedRAMP certification' },
]

export default function PersonasSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Product Methodology</Tag></div>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Persona-Driven Development</h2>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>9.4</div>
        <div style={{ fontSize: 11, color: W.text3 }}>/ 10 weighted avg</div>
      </div>
      <div style={{ width: 1, height: 60, background: W.glass08 }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 13, color: W.text2, lineHeight: 1.6 }}>9 stakeholders · 15 versions<br />v1: <span style={{ color: W.amber }}>6.8</span> → v15: <span style={{ color: W.green }}>9.4</span></div>
        <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>6 of 9 at code ceiling (10.0)</div>
      </div>
    </div>
    <div style={{ maxWidth: 860, width: '100%' }}>
      {PERSONA_SCORES.map(p => (
        <div key={p.p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${W.glass06}` }}>
          <span style={{ fontSize: 12, color: W.text2 }}>{p.p}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, color: W.text4 }}>{p.gap}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: parseFloat(p.s) >= 10 ? W.green : V, fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'right' }}>{p.s}</span>
          </div>
        </div>
      ))}
    </div>
  </>)
}
