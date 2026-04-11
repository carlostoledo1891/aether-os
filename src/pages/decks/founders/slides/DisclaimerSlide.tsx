import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

export default function DisclaimerSlide() {
  return (
    <div style={{ maxWidth: 740, textAlign: 'center' }}>
      <div style={{ width: 40, height: 2, background: V, margin: '0 auto 28px', opacity: 0.6 }} />
      <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24, color: W.text2 }}>Before We Begin</h2>
      <p style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', color: W.text3, lineHeight: 1.75, marginBottom: 20 }}>
        This demo mixes <strong style={{ color: W.text1 }}>public-reference data</strong>, disclosure-aligned scenarios,
        and <strong style={{ color: W.text1 }}>simulated time series</strong>. Nothing is an attestation.
        The data honesty banner is always visible.
      </p>
      <p style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', color: W.text3, lineHeight: 1.75, marginBottom: 28 }}>
        We show honest limits before flashy features — because that's how trust is built.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Tag color={W.amber}>Public Reference Data</Tag>
        <Tag color={W.green}>Disclosure-Aligned Scenarios</Tag>
        <Tag>Simulated Time Series</Tag>
      </div>
    </div>
  )
}
