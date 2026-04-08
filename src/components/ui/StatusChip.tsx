import { memo } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface StatusChipProps {
  label: string
  variant?: 'green' | 'amber' | 'red' | 'violet' | 'cyan' | 'muted'
  dot?: boolean
  size?: 'sm' | 'md'
}

const variantMap = {
  green:  { bg: `${W.green}1F`,  border: `${W.green}4D`,  text: W.green },
  amber:  { bg: `${W.amber}1F`,  border: `${W.amber}4D`,  text: W.amber },
  red:    { bg: `${W.red}1F`,    border: `${W.red}4D`,    text: W.red },
  violet: { bg: `${W.violet}1F`, border: `${W.violet}4D`, text: W.violetSoft },
  cyan:   { bg: `${W.cyan}1F`,   border: `${W.cyan}4D`,   text: W.cyan },
  muted:  { bg: `${W.border3}26`, border: `${W.border3}4D`, text: W.text3 },
} as const

export const StatusChip = memo(function StatusChip({ label, variant = 'muted', dot = false, size = 'sm' }: StatusChipProps) {
  const v = variantMap[variant]
  const padding = size === 'sm' ? '1px 6px' : '3px 10px'
  const fontSize = size === 'sm' ? 9 : 10

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
      letterSpacing: '0.07em',
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
          boxShadow: `0 0 4px ${v.text}`,
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  )
})
