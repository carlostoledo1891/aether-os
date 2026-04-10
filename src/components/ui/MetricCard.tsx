import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

export interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  color?: string
  sublabel?: string
  className?: string
  style?: CSSProperties
}

export function MetricCard({
  label,
  value,
  unit,
  color = W.text1,
  sublabel,
  className,
  style,
}: MetricCardProps) {
  return (
    <div
      className={className}
      style={{
        background: W.glass04,
        border: W.chromeBorder,
        borderRadius: W.radius.sm,
        padding: '8px 10px',
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: W.text4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 4,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color,
          }}
        >
          {value}
        </span>
        {unit ? (
          <span
            style={{
              fontSize: 8,
              fontFamily: 'var(--font-mono)',
              color: W.text4,
            }}
          >
            {unit}
          </span>
        ) : null}
      </div>
      {sublabel ? (
        <div
          style={{
            marginTop: 4,
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            color: W.text3,
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </div>
  )
}
