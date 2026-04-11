import { type ReactNode, type CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'

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
        background: 'rgba(10,10,18,0.82)',
        backdropFilter: 'blur(16px)',
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