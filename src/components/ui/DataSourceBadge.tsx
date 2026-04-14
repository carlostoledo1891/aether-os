import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

export type DataSourceKind = 'api' | 'simulated' | 'seed' | 'mock'

const KIND_MAP: Record<DataSourceKind, { defaultLabel: string }> = {
  api:       { defaultLabel: 'API' },
  simulated: { defaultLabel: 'Simulated' },
  seed:      { defaultLabel: 'Seed Data' },
  mock:      { defaultLabel: 'Mock' },
}

interface DataSourceBadgeProps {
  kind: DataSourceKind
  label?: string
  style?: CSSProperties
}

export function DataSourceBadge({ kind, label, style }: DataSourceBadgeProps) {
  const { defaultLabel } = KIND_MAP[kind]
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
        background: W.glass04,
        color: W.text3,
        border: `1px solid ${W.glass06}`,
        ...style,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: W.text4,
          flexShrink: 0,
        }}
      />
      {text}
    </span>
  )
}
