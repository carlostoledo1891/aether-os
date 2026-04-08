import { memo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GlassCard } from '../../components/ui/GlassCard'
import { W } from '../../app/canvas/canvasTheme'

export interface FieldBottomMetric {
  label: string
  value: string
  sub: string
}

export const FieldBottomMetrics = memo(function FieldBottomMetrics({
  tabKey,
  items,
}: {
  tabKey: string
  items: FieldBottomMetric[]
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`bottom-${tabKey}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="shrink-0"
      >
        <div className="grid grid-cols-5 gap-2">
          {items.map(({ label, value, sub }) => (
            <GlassCard key={label} animate={false} className="px-3 py-2">
              <div
                className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: W.text3 }}
              >
                {label}
              </div>
              <div
                className="font-mono text-[15px] font-bold tracking-tight"
                style={{ color: W.text1 }}
              >
                {value}
              </div>
              <div className="mt-0.5 text-[10px]" style={{ color: W.text4 }}>{sub}</div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
})
