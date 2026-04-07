import { motion } from 'motion/react'
import { Map, ShieldCheck, BarChart3 } from 'lucide-react'
import type { ViewMode } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'

interface ViewSwitcherProps {
  active: ViewMode
  onChange: (v: ViewMode) => void
  alertCount?: number
}

const VIEWS: { id: ViewMode; label: string; sublabel: string; icon: typeof Map; color: string }[] = [
  { id: 'operator',  label: 'License-to-Operate', sublabel: 'Field risk · hydrology · permits', icon: Map,         color: W.violet },
  { id: 'buyer',     label: 'TradeTech',          sublabel: 'Passport · APIs · provenance',      icon: ShieldCheck, color: W.green },
  { id: 'executive', label: 'Board Options',      sublabel: 'Value at risk · partner paths',     icon: BarChart3,   color: W.amber },
]

export function ViewSwitcher({ active, onChange, alertCount = 0 }: ViewSwitcherProps) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
      {VIEWS.map(({ id, label, sublabel, icon: Icon, color }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 9,
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
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                  border: `1px solid ${color}40`,
                  boxShadow: `0 0 12px ${color}20`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon
              size={13}
              style={{
                color: isActive ? color : W.text4,
                filter: isActive ? `drop-shadow(0 0 4px ${color}80)` : undefined,
                transition: 'color 0.2s',
                flexShrink: 0,
                zIndex: 1,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 1, gap: 1 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
                color: isActive ? W.text1 : W.text3,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
              <span style={{ fontSize: 10, color: isActive ? W.text3 : W.text4, whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
                {sublabel}
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
                color: '#fff',
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
