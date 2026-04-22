import type { ReactNode } from 'react'
import { W } from '../../theme/publicTheme'

const V = W.violet

interface TagProps {
  children: ReactNode
  color?: string
}

export function Tag({ children, color = V }: TagProps) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 'clamp(9px, 0.6vw, 11px)', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: color, background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: 6, padding: '3px 10px',
    }}>
      {children}
    </span>
  )
}
