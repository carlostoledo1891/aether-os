import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const EXIT_PATHS = [
  { category: 'Mining Major', examples: 'BHP Digital, Rio Tinto, Glencore', thesis: 'Acqui-hire to digitize portfolio operations. Proven asset-level tooling.', ev: '$55-90M', accent: V },
  { category: 'ERP / SCM Vendor', examples: 'SAP, Oracle SCM, Palantir Mining', thesis: 'Compliance module bolt-on. EU DPP readiness accelerator for existing mining clients.', ev: '$90-200M', accent: V },
  { category: 'ECA / Dev Bank', examples: 'IFC, BNDES, Ex-Im Bank', thesis: 'Impact measurement platform. ESG verification for project finance portfolios.', ev: '$55-130M', accent: V },
]

export default function ExitSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Exit Strategy</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Exit Paths</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 900, width: '100%', marginBottom: 24 }}>
      {EXIT_PATHS.map(e => (
        <div key={e.category} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
          <div style={{ width: 8, height: 2, background: e.accent, borderRadius: 1, marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: e.accent }}>{e.category}</div>
          <div style={{ fontSize: 10, color: W.text4, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{e.examples}</div>
          <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '10px 0 12px' }}>{e.thesis}</p>
          <div style={{ fontSize: 15, fontWeight: 800, color: e.accent, fontFamily: 'var(--font-mono)' }}>{e.ev}</div>
          <div style={{ fontSize: 9, color: W.text4 }}>Implied EV at consensus ARR</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 11, color: W.text3 }}>3-5 year horizon · DFS → Construction → Production creates natural acquisition window</div>
  </>)
}
