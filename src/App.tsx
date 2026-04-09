import { lazy, Suspense, useCallback, useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ViewMode } from './types/telemetry'
import { MapProvider } from 'react-map-gl/maplibre'
import { DataServiceProvider, useDataService } from './services/DataServiceProvider'
import { createMockDataService } from './services/mockDataService'
import { createLiveDataService } from './services/liveDataService'
import { getDataMode } from './config/env'
import { W } from './app/canvas/canvasTheme'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HeaderStrip } from './components/layout/HeaderStrip'
import { DataModeBanner } from './components/layout/DataModeBanner'
import { AlertPanel } from './components/layout/AlertPanel'
import shell from './AppShell.module.css'

const VIEW_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] } as const

const FieldView = lazy(() => import('./views/FieldView').then(m => ({ default: m.FieldView })))
const BuyerView = lazy(() => import('./views/BuyerView').then(m => ({ default: m.BuyerView })))
const ExecutiveView = lazy(() => import('./views/ExecutiveView').then(m => ({ default: m.ExecutiveView })))

function createDataService() {
  return getDataMode() === 'live' ? createLiveDataService() : createMockDataService()
}

function AppShell() {
  const [view, setView] = useState<ViewMode>('operator')
  const [alertOpen, setAlertOpen] = useState(false)

  const { service, telemetry, dismissAlert, dismissAllAlerts } = useDataService()
  const closeAlertPanel = useCallback(() => setAlertOpen(false), [])
  const dataContext = useMemo(() => service.getDataContext(), [service])
  const { esg, activeAlerts } = telemetry
  const fieldAlertCount = activeAlerts.filter(a => a.source === 'operator').length

  return (
    <div className={shell.root}>
      <HeaderStrip
        esg={esg}
        alertCount={dataContext.disclosureMode ? 0 : activeAlerts.length}
        fieldAlertCount={fieldAlertCount}
        onAlertOpen={() => setAlertOpen(true)}
        view={view}
        onViewChange={setView}
        disclosureMode={dataContext.disclosureMode}
      />
      <DataModeBanner context={dataContext} />

      <div className={shell.main}>
        <Suspense
          fallback={(
            <div
              style={{
                background: W.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                flex: 1,
                minHeight: 0,
              }}
            >
              <div style={{
                width: 36, height: 36,
                background: W.violet,
                borderRadius: W.radius.sm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: W.textInverse, letterSpacing: '-0.03em',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                Æ
              </div>
              <span style={{
                color: W.text4,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
              }}>
                Loading view…
              </span>
            </div>
          )}
        >
          <AnimatePresence mode="wait">
            {view === 'operator' && (
              <motion.div key="operator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={VIEW_TRANSITION} className={shell.viewLayer}>
                <FieldView />
              </motion.div>
            )}
            {view === 'buyer' && (
              <motion.div key="buyer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={VIEW_TRANSITION} className={shell.viewLayer}>
                <BuyerView />
              </motion.div>
            )}
            {view === 'executive' && (
              <motion.div key="executive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={VIEW_TRANSITION} className={shell.viewLayer}>
                <ExecutiveView />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </div>

      <AlertPanel
        alerts={activeAlerts}
        isOpen={alertOpen}
        onClose={closeAlertPanel}
        onDismiss={dismissAlert}
        onDismissAll={dismissAllAlerts}
      />
    </div>
  )
}

export default function App() {
  const service = useMemo(() => createDataService(), [])

  return (
    <ErrorBoundary>
      <DataServiceProvider service={service}>
        <MapProvider>
          <AppShell />
        </MapProvider>
      </DataServiceProvider>
    </ErrorBoundary>
  )
}
