import { W, V } from '../shared'
import { Terminal, Kw, Fn, Str, Cmt } from '../../../../components/deck'

const REPORT_TYPES = [
  { name: 'Environment', items: 'APA zones, water quality, springs, permitting timeline, community acceptance' },
  { name: 'Operations', items: 'NPV/IRR, CAPEX breakdown, C1/AISC costs, process flow, pilot plant data' },
  { name: 'Drill Tests', items: 'JORC table, grade distribution, RE recovery, lithology, Pilot vs ANSTO' },
]

export default function ReportsSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>Interactive Report Templates</h2>
    <p style={{ fontSize: 12, color: W.text3, marginBottom: 24, maxWidth: 500 }}>Custom templates in light or dark mode — PDF export via browser print</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
      {REPORT_TYPES.map(r => (
        <div key={r.name} style={{ background: 'rgba(250,250,253,0.05)', border: `1px solid ${W.glass08}`, borderRadius: 14, padding: '18px 14px', textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: V, marginBottom: 6 }}>{r.name}</div>
          <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: 0 }}>{r.items}</p>
        </div>
      ))}
    </div>
    <Terminal title="reportTheme.ts — WL (Light) palette mirrors W (Dark)">
      <Kw>export const</Kw> <Fn>WL</Fn> = {'{'}<br />
      {'  '}bg: <Str>'#FFFFFF'</Str>, panel: <Str>'#F5F5FA'</Str>,<br />
      {'  '}text1: <Str>'#1A1A2E'</Str>, violet: <Str>'#7C5CFC'</Str>,<br />
      {'  '}<Cmt>{'// Same structure — swap token, swap theme'}</Cmt><br />
      {'}'} <Kw>as const</Kw>
    </Terminal>
  </>)
}
