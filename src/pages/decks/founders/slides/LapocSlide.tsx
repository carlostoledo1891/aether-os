import { W, V } from '../shared'
import { Tag, Terminal, Cmt, Kw, Str, Fn } from '../../../../components/deck'

export default function LapocSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Science + Credential</Tag></div>
    <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>LAPOC Pipeline — Simulated Today, Field-Verified When Connected</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 860, width: '100%', marginBottom: 20 }}>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
        <div style={{ fontSize: 10, color: W.amber, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Before — Simulated</div>
        <div style={{ background: `${W.amber}15`, border: `1px solid ${W.amber}30`, borderRadius: 8, padding: '8px 12px', fontSize: 11, color: W.amber, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          ⚠ SIMULATED · Reference Data Only
        </div>
        <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
          Piezometer levels from models<br />Water quality from disclosure ranges<br />Geological data from public filings
        </div>
      </div>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
        <div style={{ fontSize: 10, color: W.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>After — Target State</div>
        <div style={{ background: `${W.green}15`, border: `1px solid ${W.green}30`, borderRadius: 8, padding: '8px 12px', fontSize: 11, color: W.green, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          ◯ FIELD-VERIFIED · pending LAPOC partnership
        </div>
        <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
          Live piezometer readings<br />Real-time water quality sensors<br />Field-sampled geological data
        </div>
      </div>
    </div>
    <Terminal title="Zero frontend changes — the architecture handles it">
      <Cmt>{'// DataContext already supports the transition'}</Cmt><br />
      <Kw>telemetry</Kw>: <Str>'simulated'</Str> | <Str>'live'</Str><br /><br />
      <Cmt>{'// When LAPOC connects:'}</Cmt><br />
      <Fn>LiveDataService</Fn>.connect({'{'}<br />
      {'  '}piezometers: <Str>'lapoc/piezo/*'</Str>,<br />
      {'  '}waterQuality: <Str>'lapoc/wq/*'</Str>,<br />
      {'  '}geological: <Str>'lapoc/geo/*'</Str><br />
      {'}'})
    </Terminal>
    <div style={{ marginTop: 16, maxWidth: 620, textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: W.text2 }}><strong style={{ color: V }}>Scientific advisor in conversation</strong> — decades of Caldeira field research.</p>
      <p style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>LAPOC is the target first live-data partner. The relationship is in-progress, not contracted. Once instruments connect, independent field science validates each reading as the platform shifts from simulated to field-verified evidence.</p>
    </div>
  </>)
}
