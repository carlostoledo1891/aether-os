import { StatCard } from '../../../../components/deck'
import { W } from './shared'

const SECURITY_STATS = [
  { value: '310', label: 'Tests', sub: '260 + 50' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'CSP', label: 'Headers', sub: 'Security policy' },
  { value: '120', label: 'Rate Limit', sub: 'req / min' },
]

export default function SecurityStatsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>Security &amp; Enterprise Readiness</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SECURITY_STATS.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
        {SECURITY_STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 20, maxWidth: 600, lineHeight: 1.5 }}>
        Built from a mix of public datasets, government data, Meteoric ASX announcements, live APIs (weather, seismic, PTAX), and independent research.
      </p>
    </>
  )
}
