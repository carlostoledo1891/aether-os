import { W, V } from '../shared'
import { Tag, Bullet } from '../../../../components/deck'

const DRIVERS = [
  { driver: 'EU Digital Product Passport', date: 'Feb 2027', status: '22 / 37 CEN/CENELEC fields mapped', color: V },
  { driver: 'US FEOC / IRA Compliance', date: 'Active now', status: 'FEOC 0.00% · SHA-256 audit chain', color: V },
  { driver: 'Australian ESG Reporting', date: '2025+', status: '5 frameworks · 62-92% coverage', color: V },
]

export default function RegulatorySlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Regulation Creates Market</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>Regulation Creates the Market</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, maxWidth: 880, width: '100%' }}>
      {DRIVERS.map(r => (
        <div key={r.driver} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{r.driver}</div>
          <div style={{ fontSize: 12, color: r.color, fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>{r.status}</p>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 24, maxWidth: 720 }}>
      <Bullet accent={W.amber}>Pix created the fintech explosion because <strong style={{ color: W.text1 }}>regulation created the market</strong>. EU DPP does the same for mineral compliance.</Bullet>
      <div style={{ height: 8 }} />
      <Bullet>Vero is 59% DPP-ready. No competitor has 20%. Enforcement is in 10 months.</Bullet>
    </div>
  </>)
}
