import { Tag } from '../../../../components/deck'
import { W, V } from './shared'

const DATA_MODES = [
  { mode: 'Mock', desc: 'Development and testing — clearly labeled, no confusion with production data' },
  { mode: 'Presentation', desc: 'Demo mode — realistic scenarios with visible "illustrative" banners' },
  { mode: 'Disclosure', desc: 'Market-safe mode — hides sensitive figures, shows only public information' },
  { mode: 'Live', desc: 'Production — field-verified data with provenance metadata on every reading' },
]

const SAFETY_ITEMS = [
  'Every screen carries a visible data honesty banner',
  'Disclosure mode hides board-sensitive figures automatically',
  'Dynamic provenance automatically upgrades UI badges when real data connects',
  'Field-to-filing-to-market: one coherent narrative, zero contradictions',
  'SHA-256 audit trail — every event hashed and timestamped',
]

export default function GovernanceSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Governance</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Governance &amp; Disclosure Safety</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 880, width: '100%', marginBottom: 20 }}>
        <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Data Honesty Modes</div>
          {DATA_MODES.map(m => (
            <div key={m.mode} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', minWidth: 80 }}>{m.mode}</div>
              <span style={{ fontSize: 12, color: W.text2, lineHeight: 1.5 }}>{m.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Screenshot Safety</div>
          {SAFETY_ITEMS.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: W.green, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: W.text2, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: W.text4, maxWidth: 600 }}>
        No screenshot from Vero can be misread as certification or attestation. Continuous disclosure safety is built into every mode.
      </p>
    </>
  )
}
