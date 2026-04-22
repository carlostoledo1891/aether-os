import { motion } from 'motion/react'
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  glow?: 'violet' | 'cyan' | 'green' | 'amber' | 'red' | 'none'
  onClick?: () => void
  animate?: boolean
}

const colorMap = {
  violet: W.border3,
  cyan:   W.border3,
  green:  W.border3,
  amber:  W.border3,
  red:    W.border3,
  none:   'transparent',
}

export function GlassCard({
  children, className = '', style, glow = 'none', onClick, animate = true
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: `var(--w-glass-card-bg, ${W.card})`,
    backdropFilter: `blur(var(--w-glass-card-blur, 8px))`,
    WebkitBackdropFilter: `blur(var(--w-glass-card-blur, 8px))`,
    border: `var(--w-glass-card-border, 1px solid ${W.border2})`,
    borderRadius: W.radius.lg,
    boxShadow: glow !== 'none'
      ? `0 0 0 1px ${colorMap[glow]}, ${W.shadowMd}`
      : W.shadowSm,
    ...style,
  }

  const handleKeyDown = onClick
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
      }
    : undefined

  if (!animate) {
    return (
      <div
        className={className}
        style={baseStyle}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.15 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </motion.div>
  )
}
