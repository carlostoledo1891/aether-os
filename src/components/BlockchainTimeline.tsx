import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Circle, Clock, MapPin } from 'lucide-react'
import type { ComplianceLedger } from '../types/telemetry'
import { W } from '../app/canvas/canvasTheme'

interface BlockchainTimelineProps {
  timeline: ComplianceLedger['molecular_timeline']
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

export function BlockchainTimeline({ timeline }: BlockchainTimelineProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <AnimatePresence>
        {timeline.map((step, i) => {
          const { icon: Icon, color, bg, border, label } = statusConfig[step.status]
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              style={{ display: 'flex', gap: 12 }}
            >
              {/* Connector column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: bg,
                  border: `1.5px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: step.status !== 'pending' ? `0 0 8px ${color}30` : undefined,
                }}>
                  <Icon size={12} style={{ color }} />
                </div>
                {i < timeline.length - 1 && (
                  <div style={{
                    width: 1,
                    flex: 1,
                    minHeight: 16,
                    background: step.status === 'pending'
                      ? 'rgba(255,255,255,0.06)'
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: step.status === 'pending' ? W.text4 : W.text1 }}>
                      {step.step}
                    </span>
                    <span style={{
                      marginLeft: 7,
                      fontSize: 10, fontWeight: 700,
                      color, letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>
                      {label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, color: W.text4,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0, marginLeft: 8,
                  }}>
                    {formatTime(step.timestamp)}
                  </span>
                </div>

                <p style={{ margin: '0 0 6px', fontSize: 11, color: step.status === 'pending' ? W.text4 : W.text2, lineHeight: 1.5 }}>
                  {step.description}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {step.hash && (
                    <span style={{
                      fontSize: 10, color: color, fontFamily: 'var(--font-mono)',
                      background: bg, border: `1px solid ${border}`,
                      padding: '2px 7px', borderRadius: 4,
                    }}>
                      {step.hash}
                    </span>
                  )}
                  {step.coordinates && (
                    <span style={{
                      fontSize: 10, color: W.text3, fontFamily: 'var(--font-mono)',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      <MapPin size={8} />
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
