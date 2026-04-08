import type { CSSProperties, ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface MutedCaptionProps {
  children: ReactNode
  style?: CSSProperties
}

/** Secondary explanatory text (disclaimers, helper lines). */
export function MutedCaption({ children, style }: MutedCaptionProps) {
  return (
    <p style={{
      margin: 0,
      fontSize: 10,
      color: W.text4,
      lineHeight: 1.45,
      ...style,
    }}>
      {children}
    </p>
  )
}
