import { useEffect } from 'react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

export function useUnlockScroll() {
  useEffect(() => {
    const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean) as HTMLElement[]
    targets.forEach(el => { el.style.overflow = 'auto' })
    return () => { targets.forEach(el => { el.style.overflow = '' }) }
  }, [])
}

export const marketingStyles = {
  wrap:    { maxWidth: 1100, margin: '0 auto', padding: '0 32px' } as React.CSSProperties,
  label:   { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: V, marginBottom: 12 } as React.CSSProperties,
  heading: { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: W.text1 } as React.CSSProperties,
  body:    { fontSize: 17, color: W.text3, lineHeight: 1.7, maxWidth: 640 } as React.CSSProperties,
  glass:   { background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' } as React.CSSProperties,
  glow:    { position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, ${V}05 0%, transparent 55%)` } as React.CSSProperties,
  page:    { background: W.bg, color: W.text1, fontFamily: 'var(--font-sans)', minHeight: '100vh' } as React.CSSProperties,
} as const