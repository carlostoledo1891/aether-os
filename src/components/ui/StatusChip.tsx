import { memo } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface StatusChipProps {
  label: string
  variant?: 'green' | 'amber' | 'red' | 'violet' | 'cyan' | 'muted'
  dot?: boolean
  size?: 'sm' | 'md'
}

const variantMap = {
  green:  { bg: W.glass06, border: W.border3, text: W.text1 },
  amber:  { bg: W.glass05, border: W.border2, text: W.text2 },
  red:    { bg: W.glass04, border: W.border2, text: W.text2 },
  violet: { bg: W.glass06, border: W.border3, text: W.text1 },
  cyan:   { bg: W.glass05, border: W.border2, text: W.text2 },
  muted:  { bg: W.glass03, border: W.border, text: W.text3 },
} as const

export const StatusChip = memo(function StatusChip({ label, variant = 'muted', dot = false, size = 'sm' }: StatusChipProps) {
  const v = variantMap[variant]
  const padding = size === 'sm' ? '1px 6px' : '3px 10px'
  const fontSize = size === 'sm' ? 10 : 10

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: W.radius.lg,
      padding,
      fontSize,
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: v.text,
      fontFamily: 'var(--font-ui)',
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 4, height: 4,
          borderRadius: '50%',
          background: v.text,
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  )
})
