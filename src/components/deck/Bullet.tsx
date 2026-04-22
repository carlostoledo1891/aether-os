import type { ReactNode } from 'react'
import { W } from '../../theme/publicTheme'

const V = W.violet

interface BulletProps {
  children: ReactNode
  accent?: string
}

export function Bullet({ children, accent = V }: BulletProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, marginTop: 8, flexShrink: 0, boxShadow: `0 0 8px ${accent}50` }} />
      <p style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', color: W.text2, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  )
}
