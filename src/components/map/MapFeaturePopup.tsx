import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { LITH_COLORS } from '../charts/lithologyPalette'

export interface LithologyBarInterval {
  from_m: number
  to_m: number
  lithology: string
}

export interface MapPopupData {
  title: string
  rows: { label: string; value: string }[]
  accentColor?: string
  lithologyIntervals?: LithologyBarInterval[]
}

interface MapFeaturePopupProps {
  data: MapPopupData | null
  x: number
  y: number
}

export function MapFeaturePopup({ data, x, y }: MapFeaturePopupProps) {
  if (!data) return null

  const hasLith = data.lithologyIntervals && data.lithologyIntervals.length > 0
  const totalDepth = hasLith
    ? data.lithologyIntervals![data.lithologyIntervals!.length - 1].to_m
    : 0

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
    maxWidth: 240,
    fontSize: 10,
    lineHeight: 1.5,
    boxShadow: `0 4px 12px ${W.scrim}`,
    display: 'flex',
    gap: 8,
  }

  return (
    <div style={style}>
      {/* Vertical lithology bar (left) */}
      {hasLith && (
        <div style={{ width: 6, minHeight: 48, borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
          {data.lithologyIntervals!.map((iv, i) => (
            <div
              key={i}
              style={{
                flex: (iv.to_m - iv.from_m) / totalDepth,
                background: LITH_COLORS[iv.lithology] ?? '#555',
                minHeight: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Content (right) */}
      <div style={{ flex: 1, minWidth: 0 }}>
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
    </div>
  )
}
