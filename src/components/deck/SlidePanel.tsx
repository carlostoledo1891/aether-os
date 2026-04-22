import { type ReactNode, type CSSProperties } from 'react'
import { W } from '../../theme/publicTheme'

export interface SlidePanelProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function SlidePanel({ children, style, className }: SlidePanelProps) {
  return (
    <div
      className={className}
      style={{
        background: W.panel,
        border: `1px solid ${W.glass08}`,
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}