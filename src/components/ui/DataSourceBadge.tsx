import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

export type DataSourceKind = 'api' | 'simulated' | 'seed' | 'mock'

const KIND_MAP: Record<DataSourceKind, { color: string; defaultLabel: string }> = {
  api:       { color: W.cyan,  defaultLabel: 'API' },
  simulated: { color: W.amber, defaultLabel: 'Simulated' },
  seed:      { color: W.text4, defaultLabel: 'Seed Data' },
  mock:      { color: W.text3, defaultLabel: 'Mock' },
}

interface DataSourceBadgeProps {
  kind: DataSourceKind
  label?: string
  style?: CSSProperties
}

export function DataSourceBadge({ kind, label, style }: DataSourceBadgeProps) {
  const { color, defaultLabel } = KIND_MAP[kind]
  const text = label ?? defaultLabel

  return (
    <span
      title={text}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 8,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '1px 5px',
        borderRadius: W.radius.xs,
        background: `${color}15`,
        color,
        ...style,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      {text}
    </span>
  )
}
