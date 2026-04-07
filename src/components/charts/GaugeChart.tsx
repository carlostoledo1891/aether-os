import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'

interface GaugeChartProps {
  value: number      // 0–100
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
  unit?: string
  showValue?: boolean
  animate?: boolean
}

export function GaugeChart({
  value, max = 100, size = 80, strokeWidth = 6,
  color = W.violet, trackColor = 'rgba(255,255,255,0.06)',
  label, sublabel, unit = '%', showValue = true, animate = true,
}: GaugeChartProps) {
  const pct = Math.min(1, Math.max(0, value / max))
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2

  // Arc: start at 225deg, sweep 270deg (like a fuel gauge)
  const startAngle = 225
  const sweepAngle = 270
  const endAngle = startAngle + sweepAngle * pct

  function polarToCartesian(angle: number) {
    const rad = (angle - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(start: number, end: number) {
    const s = polarToCartesian(start)
    const e = polarToCartesian(end)
    const largeArc = (end - start) > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  const fullTrack = arcPath(startAngle, startAngle + sweepAngle)
  const progressArc = arcPath(startAngle, endAngle)
  const dashLength = Math.PI * r * sweepAngle / 180
  void dashLength

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path d={fullTrack} fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Progress */}
        <motion.path
          d={progressArc}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
          initial={animate ? { pathLength: 0 } : undefined}
          animate={animate ? { pathLength: pct } : undefined}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {showValue && (
          <text
            x={cx} y={cy + 4}
            textAnchor="middle"
            fill={W.text1}
            fontSize={size * 0.22}
            fontWeight={600}
            fontFamily="JetBrains Mono, monospace"
          >
            {typeof value === 'number' ? value.toFixed(value >= 10 ? 1 : 2) : value}{unit}
          </text>
        )}
      </svg>
      {label && (
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: W.text3, fontFamily: 'var(--font-ui)' }}>
          {label}
        </span>
      )}
      {sublabel && (
        <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-ui)' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
