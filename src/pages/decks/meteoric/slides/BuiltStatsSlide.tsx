import { StatCard } from '../../../../components/deck'
import { W } from './shared'

const BUILT_STATS = [
  { value: '17', label: 'Equipment', sub: 'Metso · Andritz · GEA' },
  { value: '28', label: 'Sensors', sub: 'Pre-configured channels' },
  { value: '19', label: 'GeoJSON', sub: 'Datasets integrated' },
  { value: '27', label: 'AI Tools', sub: 'Domain-grounded' },
]

export default function BuiltStatsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>Already Built on Your Data</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BUILT_STATS.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
        {BUILT_STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 20, maxWidth: 600, lineHeight: 1.5 }}>
        Built from a mix of public datasets, government data, Meteoric ASX announcements, live APIs (weather, seismic, PTAX), and independent research.
      </p>
    </>
  )
}
