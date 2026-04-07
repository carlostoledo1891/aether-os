import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ViewMode } from './types/telemetry'
import { useSimulatedTelemetry } from './hooks/useSimulatedTelemetry'
import { MapProvider } from 'react-map-gl/maplibre'
import { HeaderStrip } from './components/layout/HeaderStrip'
import { AlertPanel } from './components/layout/AlertPanel'
import { PlaybackScrubber } from './components/layout/PlaybackScrubber'
import { FieldView } from './views/FieldView'
import { BuyerView } from './views/BuyerView'
import { ExecutiveView } from './views/ExecutiveView'
import { BATCHES } from './data/mockData'

export default function App() {
  const [view, setView] = useState<ViewMode>('operator')
  const [batchId, setBatchId] = useState(BATCHES[0].batch_id)
  const [alertOpen, setAlertOpen] = useState(false)

  const {
    plant, env, esg, activeAlerts,
    plantHistory, envHistory,
    simMode, setSimMode,
    dismissAlert, dismissAllAlerts,
  } = useSimulatedTelemetry()



  const batch = BATCHES.find(b => b.batch_id === batchId) ?? BATCHES[0]

  function handleSimToggle() {
    setSimMode(prev => ({
      type: prev.type === 'live' ? 'playback' : 'live',
      playbackStep: 0,
    }))
  }

  function handlePlaybackStep(step: number) {
    setSimMode({ type: 'playback', playbackStep: step })
  }

  const fieldAlertCount = activeAlerts.filter(a => a.source === 'operator').length

  // Background canvas grid — subtle depth effect
  const bgStyle = {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  }

  return (
    <MapProvider>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#07070E',
      fontFamily: 'Inter, sans-serif',
      ...bgStyle,
    }}>
      {/* Header + nav (single row) */}
      <HeaderStrip
        esg={esg}
        simMode={simMode}
        onSimToggle={handleSimToggle}
        batchId={batchId}
        onBatchChange={setBatchId}
        alertCount={activeAlerts.length}
        fieldAlertCount={fieldAlertCount}
        onAlertOpen={() => setAlertOpen(true)}
        view={view}
        onViewChange={setView}
      />

      {/* Playback banner */}
      <AnimatePresence>
        {simMode.type === 'playback' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: 'hidden',
              background: 'rgba(124,92,252,0.08)',
              borderBottom: '1px solid rgba(124,92,252,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <p style={{ margin: 0, fontSize: 10, color: '#9D80FF', fontWeight: 600, letterSpacing: '0.04em' }}>
              ▶ PLAYBACK MODE — Live telemetry paused. Use the scrubber below to step through a batch journey.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {view === 'operator' && (
            <motion.div
              key="operator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <FieldView plant={plant} plantHistory={plantHistory} env={env} envHistory={envHistory} />
            </motion.div>
          )}
          {view === 'buyer' && (
            <motion.div
              key="buyer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <BuyerView batchId={batchId} />
            </motion.div>
          )}
          {view === 'executive' && (
            <motion.div
              key="executive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <ExecutiveView esg={esg} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert panel */}
      <AlertPanel
        alerts={activeAlerts}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onDismiss={dismissAlert}
        onDismissAll={dismissAllAlerts}
      />

      {/* Playback scrubber (floats above content when in playback mode) */}
      <PlaybackScrubber
        simMode={simMode}
        onStepChange={handlePlaybackStep}
        totalSteps={batch.molecular_timeline.length}
        stepLabels={batch.molecular_timeline.map(s => s.step)}
      />
    </div>
    </MapProvider>
  )
}
