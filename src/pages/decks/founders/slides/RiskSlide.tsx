import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

import { MARKETING_COPY } from '../../../../config/marketing'

const RISKS = [
  { risk: 'Key-person risk', mitigation: `Advisory bench (science, ESG, tech, commercial) + AGENT.md bootstrap + 107 design tokens + ${MARKETING_COPY.testCount} tests = day-1 onboarding for any senior dev` },
  { risk: 'Zero revenue', mitigation: 'Apr 15 Meteoric pitch → pilot by June. Named anchor client, not cold pipeline.' },
  { risk: 'Single customer dependency', mitigation: '15 REE projects identified (ASX/TSX). OEM pipeline via ERP/ECA channels.' },
  { risk: 'EU DPP delay', mitigation: 'IRA/FEOC active now. Australian ESG 2025+. Regulatory diversification across 3 jurisdictions.' },
  { risk: 'NdPr price volatility', mitigation: '0.03% of client revenue. Price-insensitive tier — less than one day of CAPEX interest.' },
  { risk: 'Brazil jurisdiction', mitigation: 'Founder from inside the Caldeira. LAPOC partnership. Prefeitura relationship. 40 years of context.' },
]

export default function RiskSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Risk Assessment</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Risks & Mitigations</h2>
    <div style={{ maxWidth: 880, width: '100%' }}>
      {RISKS.map(r => (
        <div key={r.risk} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 0', borderBottom: `1px solid ${W.glass06}` }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${V}80`, marginTop: 8, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: W.text1 }}>{r.risk}</div>
            <div style={{ fontSize: 11, color: W.text3, marginTop: 3, lineHeight: 1.5 }}>{r.mitigation}</div>
          </div>
        </div>
      ))}
    </div>
  </>)
}
