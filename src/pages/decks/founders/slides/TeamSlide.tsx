import { W, V } from '../shared'

import { MARKETING_COPY } from '../../../../config/marketing'

const MEMBERS = [
  { name: 'Carlos Toledo', role: 'Founder · Product & Tech', bg: `Air Force pilot → Product Design → Full-stack dev. Born inside the Caldeira. 40 years of local context. Built the entire platform solo — ${MARKETING_COPY.testCount} tests, ${MARKETING_COPY.aiToolCount} AI tools, pilot plant digital twin.`, accent: V },
  { name: 'Dr. Heber Caponi', role: 'Scientific Advisor · LAPOC', bg: 'Decades of active field research on the Caldeira alkaline complex through LAPOC (CNEN). The bridge from simulated to field-verified data. Piezometers, water quality, geological sampling.', accent: W.amber },
]

export default function TeamSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>The Team</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 700, width: '100%' }}>
      {MEMBERS.map(t => (
        <div key={t.name} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
          <div style={{ width: 8, height: 2, background: t.accent, borderRadius: 1, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{t.name}</div>
          <div style={{ fontSize: 12, color: t.accent, fontWeight: 600, marginBottom: 10 }}>{t.role}</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.55, margin: 0 }}>{t.bg}</p>
        </div>
      ))}
    </div>
  </>)
}
