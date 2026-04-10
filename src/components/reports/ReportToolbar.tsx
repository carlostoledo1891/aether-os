import { Download, Calendar } from 'lucide-react'
import type { TimeRange } from './reportTheme'
import { WL } from './reportTheme'

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '7d',  label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1yr', label: '1 Year' },
  { value: 'all', label: 'All Time' },
]

interface ReportToolbarProps {
  title: string
  subtitle: string
  range: TimeRange
  onRangeChange: (r: TimeRange) => void
  onExport: () => void
}

export function ReportToolbar({ title, subtitle, range, onRangeChange, onExport }: ReportToolbarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: `1px solid ${WL.border}`,
      background: WL.panel,
      flexShrink: 0,
      gap: 16,
      flexWrap: 'wrap',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          fontSize: 15, fontWeight: 700, color: WL.text1,
          letterSpacing: '-0.01em', fontFamily: 'var(--font-ui)',
        }}>
          {title}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 500, color: WL.text3,
          letterSpacing: '0.02em', fontFamily: 'var(--font-ui)',
        }}>
          {subtitle}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Time range selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: WL.surface, borderRadius: WL.radius.md,
          border: `1px solid ${WL.border}`, padding: 3,
        }}>
          <Calendar size={12} style={{ color: WL.text4, marginLeft: 8, marginRight: 4, flexShrink: 0 }} />
          {RANGES.map(r => {
            const active = r.value === range
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => onRangeChange(r.value)}
                style={{
                  padding: '5px 10px',
                  fontSize: 11,
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'var(--font-ui)',
                  color: active ? WL.textInverse : WL.text2,
                  background: active ? WL.violet : 'transparent',
                  border: 'none',
                  borderRadius: WL.radius.sm,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Export PDF */}
        <button
          type="button"
          onClick={onExport}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            color: WL.textInverse,
            background: WL.violet,
            border: 'none',
            borderRadius: WL.radius.sm,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <Download size={12} />
          Export PDF
        </button>
      </div>
    </div>
  )
}
