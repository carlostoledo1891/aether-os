import { StatCard } from '../../../../components/deck'
import { W } from './shared'

const SECURITY_STATS = [
  { value: 'CI', label: 'Quality Gates', sub: 'Lint + type-check + test + scan' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'CSP', label: 'Headers', sub: 'Security policy' },
  { value: 'NIST', label: '800-53 Mapped', sub: '8 control families' },
]

export default function SecurityStatsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>Security &amp; Enterprise Readiness</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SECURITY_STATS.length}, 1fr)`, gap: 16, maxWidth: 940, width: '100%' }}>
        {SECURITY_STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 20, maxWidth: 600, lineHeight: 1.5 }}>
        Enterprise security from day one: NIST 800-53 mapped, SHA-256 audit chain, CI-enforced quality gates, and zero TypeScript errors across the full codebase.
      </p>
    </>
  )
}
