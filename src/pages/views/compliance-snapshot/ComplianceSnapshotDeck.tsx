import { W } from '../../../app/canvas/canvasTheme'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest } from '../../../components/deck/types'

const V = W.violet

const ESG_SCORES = [
  { framework: 'GRI 303', label: 'Water & Effluents', coverage: 92, status: 'mapped' as const },
  { framework: 'GRI 306', label: 'Waste', coverage: 78, status: 'mapped' as const },
  { framework: 'SASB', label: 'Metals & Mining', coverage: 85, status: 'mapped' as const },
  { framework: 'TCFD', label: 'Climate Disclosures', coverage: 70, status: 'partial' as const },
  { framework: 'ISSB S2', label: 'Climate Disclosures', coverage: 62, status: 'partial' as const },
]

const DPP_FIELDS = [
  { field: 'Battery ID', status: 'ready' },
  { field: 'Carbon Footprint', status: 'ready' },
  { field: 'Recycled Content', status: 'ready' },
  { field: 'Supply Chain Due Diligence', status: 'ready' },
  { field: 'Mineral Origin', status: 'ready' },
  { field: 'Collection & Recycling Info', status: 'pending' },
]

const BATCHES = [
  { id: 'BATCH-MREC-8X9', date: '2026-04-06', kg: 487, feoc: '0%', ira: true, eu: true },
  { id: 'BATCH-MREC-7W2', date: '2026-04-04', kg: 512, feoc: '0%', ira: true, eu: true },
  { id: 'BATCH-MREC-4K1', date: '2026-03-10', kg: 1850, feoc: '0%', ira: true, eu: false },
  { id: 'BATCH-MREC-2A7', date: '2026-02-03', kg: 920, feoc: '0%', ira: true, eu: false },
]

const barWidth = (pct: number) => `${pct}%`

function ComplianceContent() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, background: W.green, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>V</div>
        <span style={{ fontWeight: 700, fontSize: 17, color: W.text1, letterSpacing: '-0.02em' }}>Vero</span>
        <span style={{ color: W.text4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>/ Compliance Snapshot</span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: W.text1, lineHeight: 1.1, marginBottom: 6 }}>Compliance & Traceability Snapshot</h1>
      <p style={{ fontSize: 15, color: W.text3, marginBottom: 40 }}>Caldeira Project · ESG coverage, DPP readiness, and batch tracking</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: W.text1, marginBottom: 16 }}>ESG Framework Coverage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ESG_SCORES.map(s => (
              <div key={s.framework} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: W.text1 }}>{s.framework}</span>
                    <span style={{ fontSize: 11, color: W.text4, marginLeft: 8 }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.coverage >= 80 ? W.green : W.amber, fontFamily: 'var(--font-mono)' }}>{s.coverage}%</span>
                </div>
                <div style={{ height: 4, background: W.glass06, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: barWidth(s.coverage), background: s.coverage >= 80 ? W.green : W.amber, borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: W.text1, marginBottom: 16 }}>EU DPP Readiness</h2>
          <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: W.text3 }}>Mandatory Fields</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)' }}>5/6 Ready</span>
            </div>
            {DPP_FIELDS.map(f => (
              <div key={f.field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${W.glass04}` }}>
                <span style={{ fontSize: 12, color: W.text2 }}>{f.field}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: f.status === 'ready' ? W.green : W.amber, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.status}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 11, color: W.text4 }}>EU Battery Regulation deadline: <strong style={{ color: W.amber }}>Feb 2027</strong></div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: W.text1, marginBottom: 16 }}>Batch Tracking Ledger</h2>
        <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: `1px solid ${W.glass06}`, fontSize: 10, fontWeight: 700, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Batch ID</span>
            <span>Date</span>
            <span>Volume</span>
            <span>FEOC</span>
            <span>IRA</span>
            <span>EU DPP</span>
          </div>
          {BATCHES.map(b => (
            <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: `1px solid ${W.glass04}`, fontSize: 12, color: W.text2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{b.id}</span>
              <span>{b.date}</span>
              <span>{b.kg} kg</span>
              <span style={{ color: W.green }}>{b.feoc}</span>
              <span style={{ color: b.ira ? W.green : W.text4 }}>{b.ira ? '✓' : '—'}</span>
              <span style={{ color: b.eu ? W.green : W.amber }}>{b.eu ? '✓' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        <div style={{ background: `${W.green}10`, border: `1px solid ${W.green}30`, borderRadius: 10, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>0%</div>
          <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>FEOC Exposure</div>
        </div>
        <div style={{ background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 10, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>77%</div>
          <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>ESG Coverage (avg)</div>
        </div>
        <div style={{ background: `${W.cyan}10`, border: `1px solid ${W.cyan}30`, borderRadius: 10, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: W.cyan, fontFamily: 'var(--font-mono)' }}>SHA-256</div>
          <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>Audit Chain</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: W.text4, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${W.glass06}` }}>
        Generated by Vero · Caldeira Project · {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

const MANIFEST: DeckManifest = {
  id: 'compliance-snapshot',
  title: 'Compliance Snapshot',
  subtitle: 'Caldeira Project',
  mode: 'dashboard',
  theme: 'dark',
  children: <ComplianceContent />,
}

export default function ComplianceSnapshotDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
