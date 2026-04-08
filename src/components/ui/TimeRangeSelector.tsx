import { memo } from 'react'
import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'
import type { TimeRangeKey } from '../../services/dataService'

const RANGES: { key: TimeRangeKey; label: string }[] = [
  { key: '24h', label: '24 h' },
  { key: '7d',  label: '7 d' },
  { key: '30d', label: '30 d' },
]

interface TimeRangeSelectorProps {
  value: TimeRangeKey
  onChange: (key: TimeRangeKey) => void
  accentColor?: string
}

export const TimeRangeSelector = memo(function TimeRangeSelector({
  value,
  onChange,
  accentColor = W.violet,
}: TimeRangeSelectorProps) {
  return (
    <div style={{
      display: 'flex', gap: 2,
      background: W.glass04,
      border: `1px solid ${W.glass07}`,
      borderRadius: W.radius.sm, padding: 2,
    }}>
      {RANGES.map(({ key, label }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: '3px 8px', borderRadius: W.radius.xs, border: 'none',
              cursor: 'pointer', outline: 'none', position: 'relative',
              background: 'transparent', transition: 'color 0.2s',
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              color: isActive ? accentColor : W.text4,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="time-range-pill"
                style={{
                  position: 'absolute', inset: 0, borderRadius: W.radius.xs,
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}30`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
})
