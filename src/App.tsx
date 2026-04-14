import { lazy, Suspense, useCallback, useRef, useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { AlertItem, ReportType, ViewMode } from './types/telemetry'
import { MapProvider } from 'react-map-gl/maplibre'
import { MapCameraProvider } from './contexts/MapCameraContext'
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
import { DeckRunner } from './components/deck/DeckRunner'
import type { DeckManifest } from './components/deck/types'
import shell from './AppShell.module.css'

const LandingPage = lazy(() => import('./pages/marketing/LandingPage'))
const TechPage = lazy(() => import('./pages/marketing/TechPage'))
const BusinessPage = lazy(() => import('./pages/marketing/BusinessPage'))
const TrustCenterPage = lazy(() => import('./pages/marketing/TrustCenterPage'))

const FoundersDeck = lazy(() => import('./pages/decks/founders/FoundersDeck'))
const MeteoricDeck = lazy(() => import('./pages/decks/meteoric/MeteoricDeck'))

const PrefeituraPage = lazy(() => import('./pages/views/prefeitura/PrefeituraPage').then(m => ({ default: m.PrefeituraPage })))
const CaldeiraExecDeck = lazy(() => import('./pages/views/caldeira-exec/CaldeiraExecDeck'))
const ComplianceSnapshotDeck = lazy(() => import('./pages/views/compliance-snapshot/ComplianceSnapshotDeck'))

const KnowledgePage = lazy(() => import('./pages/admin/KnowledgePage'))
const MapLayersPage = lazy(() => import('./pages/admin/MapLayersPage'))

const EnvironmentReport = lazy(() => import('./components/reports/EnvironmentReport'))
const OperationsReport = lazy(() => import('./components/reports/OperationsReport'))
const DrillTestsReport = lazy(() => import('./components/reports/DrillTestsReport'))

const REPORT_MANIFESTS: Record<string, DeckManifest> = {
  environment:   { id: 'report-environment',  title: 'Environmental & Community Report', subtitle: 'Caldeira Project', mode: 'report', theme: 'light', timeRange: true, printable: true, portal: true, renderContent: (range) => <EnvironmentReport range={range} /> },
  operations:    { id: 'report-operations',   title: 'Operations Report',                subtitle: 'Caldeira Project', mode: 'report', theme: 'light', timeRange: true, printable: true, portal: true, renderContent: (range) => <OperationsReport range={range} /> },
  'drill-tests': { id: 'report-drill-tests', title: 'Drill Tests & Resource Report',   subtitle: 'Caldeira Project', mode: 'report', theme: 'light', timeRange: true, printable: true, portal: true, renderContent: (range) => <DrillTestsReport range={range} /> },
}

const VIEW_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] } as const

const FieldView = lazy(() => import('./views/FieldView').then(m => ({ default: m.FieldView })))
const BuyerView = lazy(() => import('./views/BuyerView').then(m => ({ default: m.BuyerView })))
const ExecutiveView = lazy(() => import('./views/ExecutiveView').then(m => ({ default: m.ExecutiveView })))

function createDataService() {
  return getDataMode() === 'live' ? createLiveDataService() : createMockDataService()
}

function AppShell() {
  const [view, setView] = useState<ViewMode>('operator')
  const [reportOpen, setReportOpen] = useState<ReportType | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [highlightFeatureId, setHighlightFeatureId] = useState<string | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { service, telemetry, dismissAlert, dismissAllAlerts } = useDataService()
  const closeAlertPanel = useCallback(() => setAlertOpen(false), [])
  const openAlertPanel = useCallback(() => { setChatOpen(false); setAlertOpen(true) }, [])
  const openChatPanel = useCallback(() => { setAlertOpen(false); setChatOpen(true) }, [])
  const closeChatPanel = useCallback(() => setChatOpen(false), [])
  const handleReportOpen = useCallback((type: ReportType) => { setReportOpen(type) }, [])
  const handleReportClose = useCallback(() => setReportOpen(null), [])

  const handleAlertNavigate = useCallback((alert: AlertItem) => {
    if (alert.source === 'operator') {
      setView('operator')
    } else if (alert.source === 'buyer') {
      setView('buyer')
    } else {
      setView('operator')
    }
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    setHighlightFeatureId(alert.id)
    highlightTimerRef.current = setTimeout(() => setHighlightFeatureId(null), 5000)
    setAlertOpen(false)
  }, [])

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
        onReportOpen={handleReportOpen}
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
                <FieldView highlightFeatureId={highlightFeatureId} />
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
        onNavigate={handleAlertNavigate}
      />
      <ChatPanel isOpen={chatOpen} onClose={closeChatPanel} />

      {reportOpen && (
        <Suspense fallback={null}>
          <DeckRunner
            manifest={REPORT_MANIFESTS[reportOpen]}
            onClose={handleReportClose}
          />
        </Suspense>
      )}
    </div>
  )
}

const PageFallback = () => (
  <div style={{ background: W.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.text1 }}>
    Loading…
  </div>
)

export default function App() {
  const service = useMemo(() => createDataService(), [])

  return (
    <DataServiceProvider service={service}>
      <MapProvider>
        <MapCameraProvider>
          <Routes>
            <Route path="/" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><LandingPage /></Suspense></ErrorBoundary>} />
            <Route path="/app/*" element={<ErrorBoundary><AppShell /></ErrorBoundary>} />
            <Route path="/business" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><BusinessPage /></Suspense></ErrorBoundary>} />
            <Route path="/tech" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><TechPage /></Suspense></ErrorBoundary>} />
            <Route path="/trust" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><TrustCenterPage /></Suspense></ErrorBoundary>} />
            
            <Route path="/deck/founders" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><FoundersDeck /></Suspense></ErrorBoundary>} />
            <Route path="/deck/meteoric" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><MeteoricDeck /></Suspense></ErrorBoundary>} />
            
            <Route path="/views/prefeitura" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><PrefeituraPage /></Suspense></ErrorBoundary>} />
            <Route path="/views/caldeira-exec" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><CaldeiraExecDeck /></Suspense></ErrorBoundary>} />
            <Route path="/views/compliance-snapshot" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><ComplianceSnapshotDeck /></Suspense></ErrorBoundary>} />
            
            <Route path="/admin/knowledge" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><KnowledgePage /></Suspense></ErrorBoundary>} />
            <Route path="/admin/map-layers" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><MapLayersPage /></Suspense></ErrorBoundary>} />
            
            <Route path="/*" element={<ErrorBoundary><Suspense fallback={<PageFallback />}><LandingPage /></Suspense></ErrorBoundary>} />
          </Routes>
        </MapCameraProvider>
      </MapProvider>
    </DataServiceProvider>
  )
}
