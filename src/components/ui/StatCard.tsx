import type { CSSProperties } from 'react'
import { W } from '../../theme/publicTheme'

export interface StatCardProps {
  value: string | number
  label: string
  sub?: string
  unit?: string
  accent?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
}

const SIZES = {
  sm: { pad: '8px 10px', value: 13, label: 8, sub: 9, radius: W.radius.sm },
  md: { pad: '22px 14px', value: 'clamp(22px, 2.8vw, 32px)', label: 'clamp(11px, 0.7vw, 13px)', sub: 'clamp(9px, 0.55vw, 11px)', radius: '14px' },
  lg: { pad: '24px 20px', value: 'clamp(28px, 3vw, 40px)', label: 'clamp(12px, 0.8vw, 15px)', sub: 'clamp(10px, 0.6vw, 12px)', radius: '16px' },
} as const

export function StatCard({
  value,
  label,
  sub,
  unit,
  accent = W.violet,
  size = 'md',
  className,
  style,
}: StatCardProps) {
  const s = SIZES[size]
  return (
    <div
      className={className}
      style={{
        padding: s.pad,
        background: W.glass04,
        border: `1px solid ${W.glass06}`,
        borderRadius: s.radius,
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3 }}>
        <span style={{ fontSize: s.value, fontWeight: 800, color: accent, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: s.sub, fontFamily: 'var(--font-mono)', color: W.text4 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: s.label, fontWeight: 600, color: W.text1, marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: s.sub, color: W.text4, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
