import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface GlowingIconProps {
  icon: LucideIcon
  color?: 'violet' | 'cyan' | 'green' | 'amber' | 'red' | 'text2'
  size?: number
  className?: string
  style?: CSSProperties
}

const colorMap = {
  violet: { color: W.violet,  glow: `${W.violet}80` },
  cyan:   { color: W.cyan,    glow: `${W.cyan}80` },
  green:  { color: W.green,   glow: `${W.green}80` },
  amber:  { color: W.amber,   glow: `${W.amber}80` },
  red:    { color: W.red,     glow: `${W.red}80` },
  text2:  { color: W.text2,   glow: 'transparent' },
} as const

export const GlowingIcon = memo(function GlowingIcon({ icon: Icon, color = 'violet', size = 16, className = '', style }: GlowingIconProps) {
  const { color: c, glow } = colorMap[color]
  return (
    <Icon
      size={size}
      className={className}
      style={{
        color: c,
        filter: `drop-shadow(0 0 5px ${glow})`,
        flexShrink: 0,
        ...style,
      }}
    />
  )
})
