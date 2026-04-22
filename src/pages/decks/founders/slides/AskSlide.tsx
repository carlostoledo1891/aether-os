import { W, V } from '../shared'
import { Bullet } from '../../../../components/deck'

export default function AskSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 28, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      The Ask
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 720, marginBottom: 24 }}>
      {[
        { label: 'Target', value: '$250-500k' },
        { label: 'Pre-Money', value: '$3-5M' },
        { label: 'Runway', value: '12 months' }
      ].map(s => (
        <div key={s.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
        </div>
      ))}
    </div>
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, marginBottom: 12 }}>
      <Bullet>12 months Carlos full-time → product, demos, pilot conversion</Bullet>
      <Bullet>Infra, AI tokens, field travel → $80-110k/yr</Bullet>
      <Bullet>Apr 16 Meteoric demo → first pilot target by June</Bullet>
      <Bullet accent={W.green}>Target: 3 paying pilots by Month 9 · Seed round by Month 12</Bullet>
    </div>
  </>)
}
