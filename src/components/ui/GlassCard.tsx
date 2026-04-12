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
  violet: W.violet,
  cyan:   W.cyan,
  green:  W.green,
  amber:  W.amber,
  red:    W.red,
  none:   'transparent',
}

export function GlassCard({
  children, className = '', style, glow = 'none', onClick, animate = true
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: `var(--w-glass-card-bg, ${W.glass04})`,
    backdropFilter: `blur(var(--w-glass-card-blur, 12px))`,
    WebkitBackdropFilter: `blur(var(--w-glass-card-blur, 12px))`,
    border: 'var(--w-glass-card-border, var(--w-border-chrome))',
    borderTop: glow !== 'none' ? `1px solid ${colorMap[glow]}` : undefined,
    borderRadius: W.radius.lg,
    boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
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
