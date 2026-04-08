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

const insetTop = `inset 0 1px 0 ${W.glass07}`
const glowMap = {
  violet: `0 0 20px ${W.violetGlow}, ${insetTop}`,
  cyan:   `0 0 20px ${W.cyanGlow}, ${insetTop}`,
  green:  `0 0 20px ${W.greenGlow}, ${insetTop}`,
  amber:  `0 0 20px ${W.amberGlow}, ${insetTop}`,
  red:    `0 0 20px ${W.redGlow}, ${insetTop}`,
  none:   `inset 0 1px 0 ${W.glass04}`,
}

export function GlassCard({
  children, className = '', style, glow = 'none', onClick, animate = true
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: W.glass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: W.chromeBorder,
    borderRadius: W.radius.lg,
    boxShadow: glowMap[glow],
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
