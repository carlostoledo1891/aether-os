import { W } from '../../../app/canvas/canvasTheme'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest } from '../../../components/deck/types'

const V = W.violet

const METRICS = [
  { label: 'NPV (pre-tax, consensus)', value: '$821M', sub: 'PFS basis' },
  { label: 'IRR (pre-tax)', value: '28%', sub: 'Consensus scenario' },
  { label: 'CAPEX', value: '$443M', sub: 'Fully funded (EXIM + EFA)' },
  { label: 'Resource', value: '1.537 Bt', sub: '@ 2,359 ppm TREO' },
  { label: 'Annual NdPr', value: '4,228 t', sub: '@ 6 Mtpa throughput' },
  { label: 'Payback', value: '3 years', sub: 'Consensus pricing' },
]

const MILESTONES = [
  { date: 'Dec 2025', label: 'LP Approved', status: 'done' as const },
  { date: 'Feb 2026', label: 'LI Application', status: 'done' as const },
  { date: 'Jun 2026', label: 'DFS Completion', status: 'active' as const },
  { date: 'Sep 2026', label: 'FID', status: 'pending' as const },
  { date: 'Jan 2027', label: 'Construction Start', status: 'pending' as const },
  { date: 'Jan 2028', label: 'First Production', status: 'pending' as const },
]

const statusColor = (s: 'done' | 'active' | 'pending') =>
  s === 'done' ? W.green : s === 'active' ? V : W.text4

function CaldeiraExecContent() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, background: V, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>V</div>
        <span style={{ fontWeight: 700, fontSize: 17, color: W.text1, letterSpacing: '-0.02em' }}>Vero</span>
        <span style={{ color: W.text4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>/ Caldeira Executive Summary</span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: W.text1, lineHeight: 1.1, marginBottom: 6 }}>Caldeira Rare Earth Project</h1>
      <p style={{ fontSize: 15, color: W.text3, marginBottom: 40 }}>Meteoric Resources NL (ASX: MEI) · Poços de Caldas, MG, Brazil</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ fontSize: 11, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: W.text1, marginBottom: 20 }}>Project Timeline</h2>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 10, left: 20, right: 20, height: 2, background: W.glass06 }} />
          {MILESTONES.map((ms, i) => (
            <div key={ms.label} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: statusColor(ms.status), margin: '0 auto 10px', border: `2px solid ${W.bg}`, boxShadow: ms.status === 'active' ? `0 0 12px ${V}60` : 'none' }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: W.text1 }}>{ms.label}</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{ms.date}</div>
              {i === 0 || i === 1 ? <div style={{ fontSize: 9, color: W.green, fontWeight: 600, marginTop: 3 }}>✓</div> : null}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
        <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '20px 18px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 12 }}>Competitive Position</h3>
          <div style={{ fontSize: 12, color: W.text3, lineHeight: 1.6 }}>
            <div>Carbon intensity: <strong style={{ color: W.green }}>2.14 kg CO₂/t</strong> vs 13.4 (Chinese avg)</div>
            <div>Water usage: <strong style={{ color: W.cyan }}>50 L/t</strong> vs 850 (Chinese avg)</div>
            <div>FEOC exposure: <strong style={{ color: W.green }}>0%</strong></div>
            <div>Opex: <strong style={{ color: V }}>$8.91/kg</strong> (lowest quartile)</div>
          </div>
        </div>
        <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 12, padding: '20px 18px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 12 }}>Funding Structure</h3>
          <div style={{ fontSize: 12, color: W.text3, lineHeight: 1.6 }}>
            <div>US EXIM Bank: <strong style={{ color: V }}>$350M</strong></div>
            <div>Export Finance Australia: <strong style={{ color: V }}>$70M (AUD)</strong></div>
            <div>Equity / Working Capital: <strong style={{ color: V }}>$23M</strong></div>
            <div>Total CAPEX funded: <strong style={{ color: W.green }}>100%</strong></div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: W.text4, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${W.glass06}` }}>
        Generated by Vero · Caldeira Project · {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

const MANIFEST: DeckManifest = {
  id: 'caldeira-exec',
  title: 'Caldeira Executive Summary',
  subtitle: 'Meteoric Resources',
  mode: 'dashboard',
  theme: 'dark',
  children: <CaldeiraExecContent />,
}

export default function CaldeiraExecDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
