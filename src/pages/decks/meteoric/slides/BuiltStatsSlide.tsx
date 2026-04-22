import { StatCard } from '../../../../components/deck'
import { W, V } from './shared'

const BUILT_STATS = [
  { value: '17', label: 'Equipment', sub: 'Reference vendors modeled' },
  { value: '28', label: 'Sensor Channels', sub: 'Pre-mapped, ingestion-ready' },
  { value: '19', label: 'GeoJSON', sub: 'Datasets wired in' },
  { value: '27', label: 'AI Tools', sub: 'Domain-grounded' },
]

const SCALE_ITEMS = [
  { label: 'Sensor Channels', value: 'Pluggable' },
  { label: 'API Sources', value: 'Pluggable' },
  { label: 'Regulatory Schemas', value: 'Extensible' },
]

export default function BuiltStatsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>Already Modeled on Caldeira Context</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BUILT_STATS.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
        {BUILT_STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div style={{ marginTop: 28, maxWidth: 940, width: '100%', background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 14, padding: '20px 24px' }}>
        <p style={{ fontSize: 13, color: W.text2, lineHeight: 1.6, margin: '0 0 16px', textAlign: 'center' }}>
          Each module scales independently. New sensor channels, geological datasets, and regulatory schemas are designed to connect through the existing ingestion layer without rewriting the views.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SCALE_ITEMS.map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: W.text3, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
