import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'

interface BarItem {
  label: string
  value: number
  color: string
  sublabel?: string
}

interface BarComparisonProps {
  items: BarItem[]
  max?: number
  height?: number
  showPercent?: boolean
}

export function BarComparison({ items, max, height = 28, showPercent = false }: BarComparisonProps) {
  const m = max ?? Math.max(...items.map(i => i.value))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(({ label, value, color, sublabel }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: W.text2, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
              {label}
            </span>
            <span style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {showPercent ? `${value}%` : value.toLocaleString()}
            </span>
          </div>
          <div style={{
            height, background: 'rgba(255,255,255,0.04)',
            borderRadius: height / 2, overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / m) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${color}80, ${color})`,
                borderRadius: height / 2,
                boxShadow: `0 0 8px ${color}40`,
              }}
            />
          </div>
          {sublabel && (
            <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-ui)' }}>
              {sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
