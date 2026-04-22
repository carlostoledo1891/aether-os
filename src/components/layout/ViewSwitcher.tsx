import { motion } from 'motion/react'
import { Map, ShieldCheck } from 'lucide-react'
import type { ViewMode } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'
import { getViewConfig } from '../../config/demoExperience'

interface ViewSwitcherProps {
  views: ViewMode[]
  active: ViewMode
  onChange: (v: ViewMode) => void
  alertCount?: number
}

const VIEW_ICONS = {
  map: Map,
  shield: ShieldCheck,
} as const

export function ViewSwitcher({ views, active, onChange, alertCount = 0 }: ViewSwitcherProps) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: '3px', background: W.glass04, borderRadius: W.radius.lg, border: W.hairlineBorder }}>
      {views.map((id) => {
        const view = getViewConfig(id)
        const isActive = active === id
        const Icon = VIEW_ICONS[view.icon]
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: W.radius.md,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              outline: 'none',
              transition: 'color 0.2s',
              minWidth: 0,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="view-pill"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: W.radius.md,
                  background: `linear-gradient(135deg, ${view.color}22, ${view.color}11)`,
                  border: `1px solid ${view.color}40`,
                  boxShadow: `0 0 12px ${view.color}20`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon
              size={12}
              style={{
                color: isActive ? view.color : W.text4,
                filter: isActive ? `drop-shadow(0 0 4px ${view.color}80)` : undefined,
                transition: 'color 0.2s',
                flexShrink: 0,
                zIndex: 1,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 1, gap: 1 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
                color: isActive ? W.text1 : W.text3,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {view.label}
              </span>
            </div>
            {id === 'operator' && alertCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 6,
                width: 14, height: 14,
                background: W.red,
                borderRadius: '50%',
                fontSize: 8,
                fontWeight: 700,
                color: W.textInverse,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                {alertCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
