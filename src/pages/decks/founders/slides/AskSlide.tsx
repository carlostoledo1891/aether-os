import { W, V } from '../shared'
import { Bullet, GlassRow } from '../../../../components/deck'

export default function AskSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 28, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      The Ask
    </h2>
    <GlassRow items={[{ label: 'Target', value: '$500k-1M' }, { label: 'Pre-Money', value: '$5-7M' }, { label: 'Runway', value: '18 months' }]} />
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24, marginBottom: 12 }}>
      <Bullet>12 months Carlos full-time → product + stakeholder demos</Bullet>
      <Bullet>Senior dev hire (Month 1-2) → 2x shipping velocity</Bullet>
      <Bullet>Commercial hire (Month 2-3) → pipeline + pilot conversions</Bullet>
      <Bullet>Infra + AI tokens + conferences → $110k/yr</Bullet>
      <Bullet accent={W.green}>Target: 3 paying pilots by Month 6 · Seed round by Month 9</Bullet>
    </div>
  </>)
}
