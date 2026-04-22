import { lazy, Suspense, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MapProvider } from 'react-map-gl/maplibre'
import { MapCameraProvider } from './contexts/MapCameraContext'
import { DataServiceProvider } from './services/DataServiceProvider'
import { createMockDataService } from './services/mockDataService'
import { createLiveDataService } from './services/liveDataService'
import { getDataMode } from './config/env'
import { ThemeScope } from './theme/ThemeProvider'
import { useThemeTokens } from './theme/useTheme'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PresentationShell } from './experience/PresentationShell'
import { RequestDemoProvider } from './components/marketing/RequestDemo'
import { InstanceProvider } from './contexts/InstanceContext'

const WorkspacePage = lazy(() => import('./pages/unit/UnitPage'))
const EmptyShellPage = lazy(() => import('./pages/instances/EmptyShell'))
const MaritimeWorkspacePage = lazy(() => import('./pages/instances/MaritimeWorkspace'))
const PrefeituraPage = lazy(() => import('./pages/views/prefeitura/PrefeituraPage').then(m => ({ default: m.PrefeituraPage })))
const KnowledgePage = lazy(() => import('./pages/admin/KnowledgePage'))
const MapLayersPage = lazy(() => import('./pages/admin/MapLayersPage'))
const LandingPage = lazy(() => import('./pages/marketing/LandingPage'))
const TrustCenterPage = lazy(() => import('./pages/marketing/TrustCenterPage'))
const VerifyPage = lazy(() => import('./pages/verify/VerifyPage'))
const VerifierStatsPage = lazy(() => import('./pages/admin/VerifierStatsPage'))

function createDataService() {
  return getDataMode() === 'live' ? createLiveDataService() : createMockDataService()
}

const PageFallback = () => {
  const theme = useThemeTokens()
  return (
    <div style={{ background: theme.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text1 }}>
      Loading…
    </div>
  )
}

function renderPage(page: ReactNode, theme: 'dark' | 'light' = 'light') {
  return (
    <ThemeScope theme={theme} style={{ minHeight: '100vh', background: 'var(--w-bg)', color: 'var(--w-text1)' }}>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          {page}
        </Suspense>
      </ErrorBoundary>
    </ThemeScope>
  )
}

/**
 * /app entry — the multi-instance shell. If the user has previously
 * visited a Vero instance (localStorage hint), 308 them straight back
 * to it; otherwise show the EmptyShell picker.
 */
function readLastInstanceHint(): 'meteoric' | 'maritime' | null {
  if (typeof window === 'undefined') return null
  try {
    const last = window.localStorage.getItem('vero.lastInstance')
    if (last === 'meteoric' || last === 'maritime') return last
  } catch {
    // localStorage unavailable — fall through to empty shell.
  }
  return null
}

function AppRoot() {
  const last = readLastInstanceHint()
  if (last) {
    return <Navigate to={`/app/${last}`} replace />
  }
  return (
    <InstanceProvider slug="_empty">
      {renderPage(<EmptyShellPage />, 'dark')}
    </InstanceProvider>
  )
}

/**
 * Legacy /app/<unit-id> deep links land here. Forward the entire suffix
 * to /app/meteoric/<unit-id> so existing share-links keep working after
 * the multi-instance move.
 */
function LegacyAppRedirect() {
  const location = useLocation()
  // location.pathname starts with /app/ — strip the prefix and prepend
  // /app/meteoric/ so /app/SITE-CALDEIRA → /app/meteoric/SITE-CALDEIRA.
  const suffix = location.pathname.replace(/^\/app\/?/, '')
  const target = `/app/meteoric${suffix ? `/${suffix}` : ''}${location.search}${location.hash}`
  return <Navigate to={target} replace />
}

export default function App() {
  const service = useMemo(() => createDataService(), [])
  const experienceElement = (
    <ErrorBoundary>
      <PresentationShell />
    </ErrorBoundary>
  )

  return (
    <DataServiceProvider service={service}>
      <MapProvider>
        <MapCameraProvider>
          <RequestDemoProvider>
          <Routes>
            <Route path="/" element={renderPage(<LandingPage />, 'dark')} />
            {/*
              * /app — multi-instance shell.
              * /app                 → AppRoot (last-visited redirect or EmptyShell picker)
              * /app/meteoric/*      → existing Caldeira workspace, byte-identical
              * /app/maritime/*      → new Defense Maritime ISR mock instance
              * /app/<anything>/*    → legacy redirect to /app/meteoric/<anything>
              *                         (preserves pre-sprint share links)
              */}
            <Route path="/app" element={<AppRoot />} />
            <Route
              path="/app/meteoric/*"
              element={(
                <InstanceProvider slug="meteoric">
                  {renderPage(<WorkspacePage />, 'dark')}
                </InstanceProvider>
              )}
            />
            <Route
              path="/app/maritime/*"
              element={(
                <InstanceProvider slug="maritime">
                  {renderPage(<MaritimeWorkspacePage />, 'dark')}
                </InstanceProvider>
              )}
            />
            <Route path="/app/*" element={<LegacyAppRedirect />} />
            {/*
              * Day-5 sprint route consolidation
              * (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 5).
              * /business is folded into /; /tech is parked behind a 90-day
              * temporary redirect to /. The hard 30x semantics live in
              * `vercel.json`; these client-side <Navigate> elements exist
              * so local dev / preview / non-Vercel hosts behave the same
              * way and any deep link hitting the SPA shell still lands on
              * the canonical landing page.
              */}
            <Route path="/business" element={<Navigate to="/" replace />} />
            <Route path="/business/*" element={<Navigate to="/" replace />} />
            <Route path="/tech" element={<Navigate to="/" replace />} />
            <Route path="/tech/*" element={<Navigate to="/" replace />} />
            <Route path="/trust" element={renderPage(<TrustCenterPage />, 'dark')} />
            <Route path="/deck/home" element={experienceElement} />
            <Route path="/deck/business" element={experienceElement} />
            <Route path="/deck/tech" element={experienceElement} />
            <Route path="/deck/trust" element={experienceElement} />
            <Route path="/deck/founders" element={experienceElement} />
            <Route path="/deck/meteoric" element={experienceElement} />
            <Route path="/views/prefeitura" element={renderPage(<PrefeituraPage />)} />
            <Route path="/admin/knowledge" element={renderPage(<KnowledgePage />)} />
            <Route path="/admin/map-layers" element={renderPage(<MapLayersPage />)} />
            <Route path="/admin/verifier-stats" element={renderPage(<VerifierStatsPage />, 'dark')} />
            <Route path="/verify/:hash" element={renderPage(<VerifyPage />, 'dark')} />
            <Route path="/*" element={renderPage(<LandingPage />, 'dark')} />
          </Routes>
          </RequestDemoProvider>
        </MapCameraProvider>
      </MapProvider>
    </DataServiceProvider>
  )
}
