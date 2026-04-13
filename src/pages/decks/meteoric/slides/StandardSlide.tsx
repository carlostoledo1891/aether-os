import { Bullet } from '../../../../components/deck'
import { W, V } from './shared'

const STANDARDS = [
  { driver: 'EU Battery Passport', date: 'Feb 2027', status: '22 / 37 fields mapped' },
  { driver: 'US FEOC requirements', date: 'Active', status: 'Origin tracking + audit chain' },
  { driver: 'Australian ESG reporting', date: '2025+', status: 'ESG frameworks integrated' },
  { driver: 'CEN/CENELEC DPP schema', date: 'In progress', status: 'Schema-validated JSON' },
]

export default function StandardSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>VeroChain Becomes Market Standard</h2>
      <div style={{ maxWidth: 860, width: '100%' }}>
        {STANDARDS.map(s => (
          <div key={s.driver} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${W.glass06}`, textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>{s.driver}</div>
              <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{s.date}</div>
            </div>
            <div style={{ fontSize: 13, color: V, fontWeight: 600, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{s.status}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 720, marginTop: 28 }}>
        <Bullet>Meteoric shapes the DPP schema with us — not after the standard is set</Bullet>
        <div style={{ height: 8 }} />
        <Bullet>Every new REE project that signs VeroChain sees Meteoric as the reference deployment</Bullet>
      </div>
    </>
  )
}
