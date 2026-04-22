import { motion, AnimatePresence } from 'motion/react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

interface MetricDisplayProps {
  value: number | string
  unit?: string
  label?: string
  sublabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'text1' | 'violet' | 'cyan' | 'green' | 'amber' | 'red'
  trend?: 'up' | 'down' | 'flat' | null
  trendGood?: 'up' | 'down'
  mono?: boolean
  decimals?: number
}

const sizeMap = {
  sm: { value: 18, unit: 11, label: 10 },
  md: { value: 26, unit: 13, label: 10 },
  lg: { value: 36, unit: 15, label: 11 },
  xl: { value: 48, unit: 18, label: 11 },
} as const

const colorMap = {
  text1:  W.text1,
  violet: W.text1,
  cyan:   W.text2,
  green:  W.text1,
  amber:  W.text2,
  red:    W.text2,
} as const

export function MetricDisplay({
  value, unit, label, sublabel, size = 'md', color = 'text1',
  trend, trendGood: _trendGood = 'up', mono = true, decimals,
}: MetricDisplayProps) {
  const s = sizeMap[size]
  const c = colorMap[color]
  const displayValue = typeof value === 'number' && decimals !== undefined
    ? value.toFixed(decimals)
    : value

  const trendColor = trend
    ? (trend === 'flat' ? W.text4 : W.text2)
    : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && (
        <span style={{
          fontSize: s.label,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: W.text3,
          fontFamily: 'var(--font-ui)',
        }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={String(displayValue)}
            initial={{ opacity: 0.6, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: s.value,
              fontWeight: 600,
              color: c,
              fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
              letterSpacing: mono ? '-0.02em' : undefined,
              lineHeight: 1,
            }}
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
        {unit && (
          <span style={{
            fontSize: s.unit,
            color: W.text3,
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
          }}>
            {unit}
          </span>
        )}
        {trend && (
          <span style={{ color: trendColor }}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'flat' && <Minus size={12} />}
          </span>
        )}
      </div>
      {sublabel && (
        <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-ui)' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
