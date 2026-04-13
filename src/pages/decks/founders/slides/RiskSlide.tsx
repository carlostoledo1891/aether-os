import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const RISKS = [
  { risk: 'Key-person risk', mitigation: 'Advisory bench (science, ESG, tech, commercial) + AGENT.md bootstrap + strict TypeScript + CI quality gates = day-1 onboarding for any senior dev' },
  { risk: 'Zero revenue', mitigation: 'Apr 15 Meteoric pitch → pilot by June. Named anchor client, not cold pipeline.' },
  { risk: 'Single customer dependency', mitigation: '150 Critical Mineral projects identified (ASX/TSX/SEC). OEM pipeline via ERP/ECA channels.' },
  { risk: 'EU DPP delay', mitigation: 'IRA/FEOC active now. Australian ESG 2025+. Regulatory diversification across 3 jurisdictions.' },
  { risk: 'NdPr price volatility', mitigation: '0.03% of client revenue. Price-insensitive tier — less than one day of CAPEX interest.' },
  { risk: 'Brazil jurisdiction', mitigation: 'Founder from inside the Caldeira. LAPOC partnership. Prefeitura relationship. 40 years of context.' },
]

export default function RiskSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Risk Assessment</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Risks & Mitigations</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 960, width: '100%' }}>
      {RISKS.map(r => (
        <div key={r.risk} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px', textAlign: 'left' }}>
          <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 6 }}>{r.risk}</div>
          <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>{r.mitigation}</div>
        </div>
      ))}
    </div>
  </>)
}
