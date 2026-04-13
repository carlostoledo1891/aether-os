import type { CSSProperties } from 'react'
import { WL } from './reportTheme'

export const SECTION_STYLE: CSSProperties = {
  padding: '32px 40px',
  borderBottom: `1px solid ${WL.border}`,
}

export const CARD_STYLE: CSSProperties = {
  background: WL.surface,
  border: `1px solid ${WL.border}`,
  borderRadius: WL.radius.lg,
  padding: 20,
}
