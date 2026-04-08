import { motion } from 'motion/react'
import type { EsgScore } from '../types/telemetry'
import { W } from '../app/canvas/canvasTheme'

interface EsgScoreRingProps {
  esg: EsgScore
  compact?: boolean
}

function scoreColor(v: number): string {
  if (v >= 90) return W.green
  if (v >= 75) return W.amber
  return W.red
}

export function EsgScoreRing({ esg, compact = false }: EsgScoreRingProps) {
  const size = compact ? 36 : 44
  const sw = compact ? 3 : 4
  const r = (size - sw) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const filled = (esg.overall / 100) * circumference
  const color = scoreColor(esg.overall)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={size} height={size}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={W.glass06} strokeWidth={sw} />
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeDashoffset={circumference * 0.25}
            style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
            animate={{ strokeDasharray: `${filled} ${circumference - filled}` }}
            transition={{ duration: 0.5 }}
          />
          <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={size * 0.28} fontWeight={700} fontFamily="JetBrains Mono, monospace">
            {esg.overall}
          </text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>ESG</span>
          <span style={{ fontSize: 10, color: W.text4 }}>Score</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={W.glass06} strokeWidth={sw} />
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference * 0.25}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          animate={{ strokeDasharray: `${filled} ${circumference - filled}` }}
          transition={{ duration: 0.5 }}
        />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={size * 0.32} fontWeight={700} fontFamily="JetBrains Mono, monospace">
          {esg.overall}
        </text>
      </svg>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
        ESG Score
      </span>
    </div>
  )
}
