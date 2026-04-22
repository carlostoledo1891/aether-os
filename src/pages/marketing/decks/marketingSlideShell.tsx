import type { CSSProperties, ReactNode } from 'react'
import { W } from '../../../theme/publicTheme'

/**
 * Background is driven by `--marketing-slide-bg` so the marketing
 * shell can swap to a translucent value (revealing the fixed globe
 * behind it) without affecting the deck routes that share this
 * component (those keep the W.bg fallback).
 */
const marketingSlideRootStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 96,
  background: `var(--marketing-slide-bg, ${W.bg})`,
  color: W.text1,
  fontFamily: 'var(--font-sans)',
}

export function MarketingSlideRoot({ children }: { children: ReactNode }) {
  return <div style={marketingSlideRootStyle}>{children}</div>
}
