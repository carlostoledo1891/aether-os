import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Circle, Clock, MapPin } from 'lucide-react'
import type { ComplianceLedger } from '../types/telemetry'
import { W } from '../app/canvas/canvasTheme'

interface BlockchainTimelineProps {
  timeline: ComplianceLedger['molecular_timeline']
  selectedStepIndex?: number | null
  onStepClick?: (index: number) => void
}

const statusConfig = {
  verified: { icon: CheckCircle, color: W.green,  bg: `${W.green}1F`, border: `${W.green}4D`, label: 'VERIFIED' },
  active:   { icon: Circle,      color: W.violet, bg: `${W.violet}1F`, border: `${W.violet}4D`, label: 'ACTIVE' },
  pending:  { icon: Clock,       color: W.text4,  bg: `${W.text4}1F`,  border: `${W.text4}33`,  label: 'PENDING' },
} as const

function formatTime(ts: string): string {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'UTC',
  })
}

export function BlockchainTimeline({ timeline, selectedStepIndex, onStepClick }: BlockchainTimelineProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{ margin: '0 0 10px', fontSize: 9, color: W.text4, lineHeight: 1.4 }}>
        Demonstration ledger — illustrative hashes and API handoffs; production ERP/CBP integration is post–pilot scope.
      </p>
      <AnimatePresence>
        {timeline.map((step, i) => {
          const { icon: Icon, color, bg, border, label } = statusConfig[step.status]
          const isSelected = selectedStepIndex === i
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              role={onStepClick ? 'button' : undefined}
              tabIndex={onStepClick ? 0 : undefined}
              onClick={() => onStepClick?.(i)}
              onKeyDown={onStepClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStepClick(i) } } : undefined}
              style={{
                display: 'flex', gap: 12,
                cursor: onStepClick ? 'pointer' : undefined,
                padding: '2px 4px',
                marginLeft: -4,
                borderRadius: W.radius.sm,
                background: isSelected ? `${color}12` : 'transparent',
                border: isSelected ? `1px solid ${color}30` : '1px solid transparent',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              {/* Connector column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: bg,
                  border: `1.5px solid ${isSelected ? color : border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isSelected ? `0 0 12px ${color}50` : step.status !== 'pending' ? `0 0 8px ${color}30` : undefined,
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}>
                  <Icon size={12} style={{ color }} />
                </div>
                {i < timeline.length - 1 && (
                  <div style={{
                    width: 1,
                    flex: 1,
                    minHeight: 16,
                    background: step.status === 'pending'
                      ? W.glass06
                      : `linear-gradient(to bottom, ${color}50, rgba(255,255,255,0.06))`,
                    margin: '2px 0',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                paddingBottom: i < timeline.length - 1 ? 14 : 0,
                paddingTop: 2,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: step.status === 'pending' ? W.text4 : W.text1 }}>
                      {step.step}
                    </span>
                    <span style={{
                      marginLeft: 7,
                      fontSize: 9, fontWeight: 700,
                      color, letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>
                      {label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 9, color: W.text4,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0, marginLeft: 8,
                  }}>
                    {formatTime(step.timestamp)}
                  </span>
                </div>

                <p style={{ margin: '0 0 6px', fontSize: 10, color: step.status === 'pending' ? W.text4 : W.text2, lineHeight: 1.5 }}>
                  {step.description}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {step.hash && (
                    <span title={step.hash} style={{
                      fontSize: 9, color: color, fontFamily: 'var(--font-mono)',
                      background: bg, border: `1px solid ${border}`,
                      padding: '1px 6px', borderRadius: W.radius.xs,
                      maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', display: 'inline-block',
                    }}>
                      {step.hash}
                    </span>
                  )}
                  {step.coordinates && (
                    <span style={{
                      fontSize: 9, color: isSelected ? W.text1 : W.text3, fontFamily: 'var(--font-mono)',
                      display: 'flex', alignItems: 'center', gap: 3,
                      transition: 'color 0.2s',
                    }}>
                      <MapPin size={7} />
                      {step.coordinates.lat.toFixed(3)}, {step.coordinates.lng.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
