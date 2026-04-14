import { memo, type CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from './mapStacking'
import { LITH_COLORS } from '../charts/lithologyPalette'
import { DataSourceBadge, type DataSourceKind } from '../ui/DataSourceBadge'
import { ProvenanceBadge } from '../ui/ProvenanceBadge'
import type { DataProvenanceKind } from '../../services/dataService'

export interface LithologyBarInterval {
  from_m: number
  to_m: number
  lithology: string
}

export interface MapPopupData {
  title: string
  subtitle?: string
  rows: { label: string; value: string }[]
  footer?: string
  accentColor?: string
  lithologyIntervals?: LithologyBarInterval[]
  sourceBadge?: { kind: DataSourceKind; label?: string }
  provenanceBadge?: { kind: DataProvenanceKind; title?: string }
}

interface MapFeaturePopupProps {
  data: MapPopupData | null
  x: number
  y: number
}

export const MapFeaturePopup = memo(function MapFeaturePopup({ data, x, y }: MapFeaturePopupProps) {
  if (!data) return null

  const lith = data.lithologyIntervals
  const hasLith = lith && lith.length > 0
  const totalDepth = hasLith ? lith[lith.length - 1].to_m : 0

  const style: CSSProperties = {
    position: 'absolute',
    left: x + 12,
    top: y - 8,
    zIndex: Z.mapPopup,
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
          {data.lithologyIntervals?.map((iv, i) => (
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
        {(data.sourceBadge || data.provenanceBadge) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 5 }}>
            {data.sourceBadge && (
              <DataSourceBadge kind={data.sourceBadge.kind} label={data.sourceBadge.label} />
            )}
            {data.provenanceBadge && (
              <ProvenanceBadge kind={data.provenanceBadge.kind} title={data.provenanceBadge.title} />
            )}
          </div>
        )}
        <div style={{ fontWeight: 700, color: data.accentColor ?? W.violet, marginBottom: data.subtitle ? 2 : 4, fontSize: 11 }}>
          {data.title}
        </div>
        {data.subtitle && (
          <div style={{ fontSize: 9, color: W.text3, marginBottom: 6, fontWeight: 500 }}>
            {data.subtitle}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ color: W.text4 }}>{r.label}</span>
              <span style={{ color: W.text2, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
        {data.footer && (
          <div style={{ 
            marginTop: 6, paddingTop: 4, borderTop: `1px solid ${W.glass08}`,
            fontSize: 9, color: W.text4, fontFamily: 'var(--font-mono)' 
          }}>
            {data.footer}
          </div>
        )}
      </div>
    </div>
  )
})
