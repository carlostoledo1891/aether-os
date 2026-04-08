import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, AlertTriangle, AlertCircle, Info, BellOff, Clock, User, FileText } from 'lucide-react'
import type { AlertItem } from '../../types/telemetry'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import type { IncidentRecord } from '../../services/dataService'
import panelStyles from './AlertPanel.module.css'

type PanelTab = 'active' | 'history'

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

function incidentResponseTime(inc: IncidentRecord): string {
  if (!inc.acknowledgedAt) return '—'
  const diff = new Date(inc.acknowledgedAt).getTime() - new Date(inc.triggeredAt).getTime()
  const mins = Math.round(diff / 60000)
  return `${mins} min`
}

function incidentResolutionTime(inc: IncidentRecord): string {
  if (!inc.resolvedAt) return 'ongoing'
  const diff = new Date(inc.resolvedAt).getTime() - new Date(inc.triggeredAt).getTime()
  const mins = Math.round(diff / 60000)
  return mins < 60 ? `${mins} min` : `${(mins / 60).toFixed(1)} hr`
}

export function AlertPanel({ alerts, isOpen, onClose, onDismiss, onDismissAll }: AlertPanelProps) {
  const service = useAetherService()
  const rawIncidents = useMemo(() => service.getIncidentLog(), [service])
  const incidents = Array.isArray(rawIncidents) ? rawIncidents : ([] as IncidentRecord[])
  const active = alerts.filter(a => !a.dismissed)
  const [tab, setTab] = useState<PanelTab>('active')
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

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
            className={panelStyles.scrim}
            style={{ background: W.scrim }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Alerts panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            className={panelStyles.drawer}
          >
            {/* Header */}
            <div className={panelStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} style={{ color: active.length > 0 ? W.red : W.text3 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: W.text1 }}>Alerts</span>
                {active.length > 0 && (
                  <span style={{
                    padding: '1px 7px', background: W.redBadgeBg,
                    border: `1px solid ${W.redBorderSoft}`, borderRadius: W.radius.md,
                    fontSize: 10, fontWeight: 600, color: W.red,
                  }}>
                    {active.length}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {tab === 'active' && active.length > 0 && (
                  <button type="button" onClick={onDismissAll} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px',
                    background: W.glass04, border: W.chromeBorder,
                    borderRadius: W.radius.sm, cursor: 'pointer', color: W.text3, fontSize: 10, outline: 'none',
                  }}>
                    <BellOff size={10} />
                    Dismiss all
                  </button>
                )}
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close alerts"
                  onClick={onClose}
                  style={{
                    width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: W.glass04, border: W.chromeBorder,
                    borderRadius: W.radius.sm, cursor: 'pointer', outline: 'none',
                  }}
                >
                  <X size={12} style={{ color: W.text3 }} />
                </button>
              </div>
            </div>

            <div style={{
              padding: '8px 20px',
              fontSize: 10,
              color: W.text4,
              borderBottom: W.hairlineBorder,
              background: W.glass02,
              lineHeight: 1.4,
            }}>
              Incident workflow demonstration — pilot escalation paths and paging TBD.
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 0, borderBottom: W.hairlineBorder }}>
              {([
                { id: 'active' as PanelTab, label: 'Active Alerts', count: active.length, ariaLabel: 'Active Alerts tab' as const },
                { id: 'history' as PanelTab, label: 'Incident Log', count: incidents.length, ariaLabel: 'Incident Log tab' as const },
              ]).map(({ id, label, count, ariaLabel }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={ariaLabel}
                  onClick={() => setTab(id)}
                  style={{
                  flex: 1, padding: '8px 12px', border: 'none', cursor: 'pointer',
                  background: 'transparent', outline: 'none',
                  borderBottom: tab === id ? `2px solid ${W.violet}` : '2px solid transparent',
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: tab === id ? W.text1 : W.text4, letterSpacing: '0.04em' }}>
                    {label} ({count})
                  </span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className={panelStyles.scrollArea}>
              {tab === 'active' && (
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
                            borderRadius: W.radius.md, padding: '12px 14px',
                            display: 'flex', flexDirection: 'column', gap: 6,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Icon size={13} style={{ color, flexShrink: 0 }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{alert.title}</span>
                            </div>
                            <button
                              type="button"
                              aria-label="Dismiss alert"
                              onClick={() => onDismiss(alert.id)}
                              style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: W.text4, padding: 2, flexShrink: 0,
                            }}
                            >
                              <X size={10} />
                            </button>
                          </div>
                          <p style={{ fontSize: 10, color: W.text2, margin: 0, lineHeight: 1.5 }}>{alert.detail}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{alert.source}</span>
                            <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>{timeAgo(alert.timestamp)}</span>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </AnimatePresence>
              )}

              {tab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {incidents.map(inc => {
                    const { color, bg, border } = severityMap[inc.severity]
                    const withinSla = inc.acknowledgedAt
                      ? (new Date(inc.acknowledgedAt).getTime() - new Date(inc.triggeredAt).getTime()) / 60000 <= inc.slaMinutes
                      : false
                    return (
                      <div key={inc.id} style={{
                        background: bg, border: `1px solid ${border}`,
                        borderRadius: W.radius.md, padding: '12px 14px',
                        display: 'flex', flexDirection: 'column', gap: 6,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {inc.severity === 'critical' ? <AlertCircle size={13} style={{ color, flexShrink: 0 }} /> :
                             inc.severity === 'warning' ? <AlertTriangle size={13} style={{ color, flexShrink: 0 }} /> :
                             <Info size={13} style={{ color, flexShrink: 0 }} />}
                            <span style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{inc.title}</span>
                          </div>
                          <span style={{
                            padding: '1px 7px', borderRadius: W.radius.md,
                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                            background: inc.status === 'resolved' ? `${W.green}20` : `${W.amber}20`,
                            color: inc.status === 'resolved' ? W.green : W.amber,
                            border: `1px solid ${inc.status === 'resolved' ? W.green : W.amber}30`,
                          }}>
                            {inc.status}
                          </span>
                        </div>

                        {/* Timing metrics */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={9} style={{ color: W.text4 }} />
                            <span style={{ fontSize: 10, color: W.text4 }}>Response:</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: withinSla ? W.green : W.red, fontFamily: 'var(--font-mono)' }}>
                              {incidentResponseTime(inc)}
                            </span>
                            <span style={{ fontSize: 9, color: W.text4 }}>({inc.slaMinutes}m SLA)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={9} style={{ color: W.text4 }} />
                            <span style={{ fontSize: 10, color: W.text4 }}>Total:</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: W.text2, fontFamily: 'var(--font-mono)' }}>
                              {incidentResolutionTime(inc)}
                            </span>
                          </div>
                        </div>

                        {/* Assignee & note */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <User size={9} style={{ color: W.text4 }} />
                          <span style={{ fontSize: 10, color: W.text3, fontWeight: 600 }}>{inc.assignee}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                          <FileText size={9} style={{ color: W.text4, marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontSize: 10, color: W.text2, margin: 0, lineHeight: 1.45 }}>{inc.responseNote}</p>
                        </div>

                        <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                          {new Date(inc.triggeredAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
