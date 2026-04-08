import { GlowingIcon } from './GlowingIcon'
import { W } from '../../app/canvas/canvasTheme'
import type { LucideIcon } from 'lucide-react'

interface MapHeaderStripProps {
  icon: LucideIcon
  color: 'green' | 'cyan' | 'violet' | 'amber' | 'red'
  text: string
}

export function MapHeaderStrip({ icon, color, text }: MapHeaderStripProps) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px',
      background: `linear-gradient(to bottom, ${W.overlay88}, transparent)`,
      zIndex: 10, pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <GlowingIcon icon={icon} color={color} size={11} />
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: W.text3, transition: 'color 0.3s',
        }}>
          {text}
        </span>
      </div>
    </div>
  )
}
