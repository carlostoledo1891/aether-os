import { motion } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  glow?: 'violet' | 'cyan' | 'green' | 'amber' | 'red' | 'none'
  onClick?: () => void
  animate?: boolean
}

const glowMap = {
  violet: '0 0 20px rgba(124,92,252,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
  cyan:   '0 0 20px rgba(0,212,200,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
  green:  '0 0 20px rgba(34,214,138,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
  amber:  '0 0 20px rgba(245,166,35,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
  red:    '0 0 20px rgba(255,77,77,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
  none:   'inset 0 1px 0 rgba(255,255,255,0.04)',
}

export function GlassCard({
  children, className = '', style, glow = 'none', onClick, animate = true
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.035)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    boxShadow: glowMap[glow],
    ...style,
  }

  if (!animate) {
    return (
      <div className={className} style={baseStyle} onClick={onClick}>
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
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
