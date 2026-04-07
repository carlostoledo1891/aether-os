import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import type { SimulationMode } from '../../types/telemetry'

interface PlaybackScrubberProps {
  simMode: SimulationMode
  onStepChange: (step: number) => void
  totalSteps: number
  stepLabels?: string[]
}

export function PlaybackScrubber({ simMode, onStepChange, totalSteps, stepLabels }: PlaybackScrubberProps) {
  if (simMode.type !== 'playback') return null

  const step = simMode.playbackStep ?? 0
  const labels = stepLabels?.slice(0, totalSteps) ?? Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 220, damping: 30 }}
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          background: 'rgba(13,13,28,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: 520,
        }}
      >
        {/* Controls */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => onStepChange(Math.max(0, step - 1))}
            style={{ ...btnStyle }}
            disabled={step === 0}
          >
            <SkipBack size={12} style={{ color: step === 0 ? '#484870' : '#A0A0C8' }} />
          </button>
          <button
            onClick={() => onStepChange(step === totalSteps - 1 ? 0 : step + 1)}
            style={{ ...btnStyle, background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)' }}
          >
            {step < totalSteps - 1 ? (
              <Play size={12} style={{ color: '#9D80FF' }} />
            ) : (
              <Pause size={12} style={{ color: '#9D80FF' }} />
            )}
          </button>
          <button
            onClick={() => onStepChange(Math.min(totalSteps - 1, step + 1))}
            style={{ ...btnStyle }}
            disabled={step === totalSteps - 1}
          >
            <SkipForward size={12} style={{ color: step === totalSteps - 1 ? '#484870' : '#A0A0C8' }} />
          </button>
        </div>

        {/* Step track */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {labels.map((label, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer' }}
              onClick={() => onStepChange(i)}>
              <div style={{
                width: '100%', height: 3,
                background: i <= step ? '#7C5CFC' : 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                marginBottom: 4,
                transition: 'background 0.3s',
                boxShadow: i <= step ? '0 0 4px rgba(124,92,252,0.5)' : undefined,
              }} />
              <span style={{
                fontSize: 8, color: i === step ? '#9D80FF' : '#484870',
                textAlign: 'center', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)',
                fontWeight: i === step ? 700 : 400,
                transition: 'color 0.2s',
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step counter */}
        <span style={{ fontSize: 10, color: '#9D80FF', fontFamily: 'var(--font-mono)', fontWeight: 600, flexShrink: 0 }}>
          {step + 1}/{totalSteps}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}

const btnStyle: React.CSSProperties = {
  width: 28, height: 28,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 7, cursor: 'pointer', outline: 'none',
}
