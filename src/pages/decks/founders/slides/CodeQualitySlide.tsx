import { W } from '../shared'
import { Tag, StatCard, Terminal, Kw, Fn, Str, Num, Cmt } from '../../../../components/deck'

const BADGES = ['React.memo × 14 overlays', 'Lazy-loaded views', 'ErrorBoundary on every route', 'CI: lint + test + build', 'Docker Compose deploy']

export default function CodeQualitySlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Engineering</Tag></div>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Code Quality — The Numbers</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 880, width: '100%', marginBottom: 20 }}>
      <StatCard value="310" label="Tests" sub="260 frontend + 50 server" accent={W.green} />
      <StatCard value="0" label="TS Errors" sub="Strict mode" />
      <StatCard value="135+" label="TS Files" sub="3 packages" />
      <StatCard value="AGENT.md" label="AI Bootstrap" sub="On-demand context" />
    </div>
    <Terminal title="src/app/canvas/canvasTheme.ts — Design Token System (107 tokens)">
      <Kw>export const</Kw> <Fn>W</Fn> = {'{'}<br />
      {'  '}bg: <Str>'#07070E'</Str>, canvas: <Str>'#060610'</Str>,<br />
      {'  '}panel: <Str>'#0D0D1C'</Str>, surface: <Str>'#121228'</Str>,<br />
      {'  '}violet: <Str>'#7C5CFC'</Str>, <Cmt>{'// primary accent'}</Cmt><br />
      {'  '}cyan: <Str>'#00D4C8'</Str>, <Cmt>{'// hydrology domain'}</Cmt><br />
      {'  '}green: <Str>'#22D68A'</Str>, <Cmt>{'// compliance / success'}</Cmt><br />
      {'  '}amber: <Str>'#F5A623'</Str>, <Cmt>{'// warning'}</Cmt><br />
      {'  '}red: <Str>'#FF4D4D'</Str>, <Cmt>{'// critical'}</Cmt><br />
      {'  '}text1: <Str>'#ECECF8'</Str>, <Cmt>{'// WCAG AAA ≥7:1'}</Cmt><br />
      {'  '}radius: {'{ '}xs: <Num>4</Num>, sm: <Num>7</Num>, md: <Num>10</Num>, lg: <Num>14</Num>{' }'},<br />
      {'}'} <Kw>as const</Kw>
    </Terminal>
    <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {BADGES.map(n => (
        <div key={n} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 8, padding: '5px 12px', fontSize: 11, color: W.text2 }}>{n}</div>
      ))}
    </div>
  </>)
}
