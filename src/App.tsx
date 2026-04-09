import { lazy, Suspense, useCallback, useState, useMemo, useEffect } from 'react'
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
import { ChatPanel } from './components/layout/ChatPanel'
import shell from './AppShell.module.css'

const VIEW_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] } as const

const FieldView = lazy(() => import('./views/FieldView').then(m => ({ default: m.FieldView })))
const BuyerView = lazy(() => import('./views/BuyerView').then(m => ({ default: m.BuyerView })))
const ExecutiveView = lazy(() => import('./views/ExecutiveView').then(m => ({ default: m.ExecutiveView })))

function createDataService() {
  return getDataMode() === 'live' ? createLiveDataService() : createMockDataService()
}

type ThemeMode = 'dark' | 'board'

function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('vero-theme') as ThemeMode | null
    if (saved === 'dark' || saved === 'board') return saved
  } catch { /* SSR / private browsing */ }
  return 'dark'
}

function AppShell() {
  const [view, setView] = useState<ViewMode>('operator')
  const [alertOpen, setAlertOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('vero-theme', theme) } catch { /* noop */ }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'board' : 'dark')
  }, [])

  const { service, telemetry, dismissAlert, dismissAllAlerts } = useDataService()
  const closeAlertPanel = useCallback(() => setAlertOpen(false), [])
  const openAlertPanel = useCallback(() => { setChatOpen(false); setAlertOpen(true) }, [])
  const openChatPanel = useCallback(() => { setAlertOpen(false); setChatOpen(true) }, [])
  const closeChatPanel = useCallback(() => setChatOpen(false), [])
  const dataContext = useMemo(() => service.getDataContext(), [service])
  const { esg, activeAlerts } = telemetry
  const fieldAlertCount = activeAlerts.filter(a => a.source === 'operator').length

  return (
    <div className={shell.root}>
      <HeaderStrip
        esg={esg}
        alertCount={dataContext.disclosureMode ? 0 : activeAlerts.length}
        fieldAlertCount={fieldAlertCount}
        onAlertOpen={openAlertPanel}
        onChatOpen={openChatPanel}
        view={view}
        onViewChange={setView}
        disclosureMode={dataContext.disclosureMode}
        theme={theme}
        onToggleTheme={toggleTheme}
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
                V
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
      <ChatPanel isOpen={chatOpen} onClose={closeChatPanel} />
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
