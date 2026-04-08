import type { ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface SectionLabelProps {
  children: ReactNode
  /** Slightly wider tracking for hero section titles */
  wideTracking?: boolean
}

/** Uppercase micro-heading for glass panels — keeps section titles consistent. */
export function SectionLabel({ children, wideTracking }: SectionLabelProps) {
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: wideTracking ? '0.1em' : '0.08em',
      textTransform: 'uppercase',
      color: W.text4,
    }}>
      {children}
    </span>
  )
}
