import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

export interface MapPopupData {
  title: string
  rows: { label: string; value: string }[]
  accentColor?: string
}

interface MapFeaturePopupProps {
  data: MapPopupData | null
  x: number
  y: number
}

export function MapFeaturePopup({ data, x, y }: MapFeaturePopupProps) {
  if (!data) return null
  const style: CSSProperties = {
    position: 'absolute',
    left: x + 12,
    top: y - 8,
    zIndex: 60,
    pointerEvents: 'none',
    background: W.panel,
    border: `1px solid ${W.glass12}`,
    borderRadius: W.radius.sm,
    padding: '6px 8px',
    maxWidth: 220,
    fontSize: 10,
    lineHeight: 1.5,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  }
  return (
    <div style={style}>
      <div style={{ fontWeight: 700, color: data.accentColor ?? W.violet, marginBottom: 2, fontSize: 11 }}>
        {data.title}
      </div>
      {data.rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ color: W.text4 }}>{r.label}</span>
          <span style={{ color: W.text2, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
