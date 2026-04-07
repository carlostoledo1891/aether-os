import { motion, AnimatePresence } from 'motion/react'
import { X, AlertTriangle, AlertCircle, Info, BellOff } from 'lucide-react'
import type { AlertItem } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'

interface AlertPanelProps {
  alerts: AlertItem[]
  isOpen: boolean
  onClose: () => void
  onDismiss: (id: string) => void
  onDismissAll: () => void
}

const severityMap = {
  critical: { icon: AlertCircle,   color: W.red,   bg: W.redSubtle,   border: `${W.red}4D` },
  warning:  { icon: AlertTriangle, color: W.amber, bg: W.amberSubtle, border: `${W.amber}4D` },
  info:     { icon: Info,          color: W.cyan,  bg: W.cyanSubtle,  border: `${W.cyan}4D` },
} as const

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export function AlertPanel({ alerts, isOpen, onClose, onDismiss, onDismissAll }: AlertPanelProps) {
  const active = alerts.filter(a => !a.dismissed)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 340,
              background: W.panel,
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column',
              zIndex: 100,
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} style={{ color: active.length > 0 ? W.red : W.text3 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: W.text1 }}>
                  Alerts
                </span>
                {active.length > 0 && (
                  <span style={{
                    padding: '1px 7px', background: 'rgba(255,77,77,0.15)',
                    border: '1px solid rgba(255,77,77,0.3)', borderRadius: 10,
                    fontSize: 10, fontWeight: 600, color: W.red,
                  }}>
                    {active.length}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {active.length > 0 && (
                  <button onClick={onDismissAll} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6, cursor: 'pointer', color: W.text3, fontSize: 10, outline: 'none',
                  }}>
                    <BellOff size={10} />
                    Dismiss all
                  </button>
                )}
                <button onClick={onClose} style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6, cursor: 'pointer', outline: 'none',
                }}>
                  <X size={12} style={{ color: W.text3 }} />
                </button>
              </div>
            </div>

            {/* Alert list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AnimatePresence>
                {active.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, color: W.text4 }}>
                    <BellOff size={28} />
                    <span style={{ fontSize: 12 }}>All clear — no active alerts</span>
                  </div>
                ) : (
                  active.map(alert => {
                    const { icon: Icon, color, bg, border } = severityMap[alert.severity]
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          background: bg, border: `1px solid ${border}`,
                          borderRadius: 10, padding: '12px 14px',
                          display: 'flex', flexDirection: 'column', gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon size={13} style={{ color, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>
                              {alert.title}
                            </span>
                          </div>
                          <button onClick={() => onDismiss(alert.id)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: W.text4, padding: 2, flexShrink: 0,
                          }}>
                            <X size={10} />
                          </button>
                        </div>
                        <p style={{ fontSize: 10, color: W.text2, margin: 0, lineHeight: 1.5 }}>
                          {alert.detail}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, color: color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {alert.source}
                          </span>
                          <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                            {timeAgo(alert.timestamp)}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
