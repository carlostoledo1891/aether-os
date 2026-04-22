import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertPanel } from '../components/layout/AlertPanel'
import { DataModeBanner } from '../components/layout/DataModeBanner'
import { DeckRunner } from '../components/deck/DeckRunner'
import { getWorkspaceChromeCssVars } from '../components/map/mapControlStyles'
import type { AlertItem } from '../types/telemetry'
import { useDataService } from '../services/DataServiceProvider'
import { ThemeScope } from '../theme/ThemeProvider'
import { TopChrome } from './chrome/TopChrome'
import { getAppendixManifest, resolvePresentationManifest } from './manifestRegistry'
import { OptionalMapLayer } from './map/OptionalMapLayer'
import { HorizontalSlidesRenderer } from './renderers/HorizontalSlidesRenderer'
import { isPublicMarketingDeckManifestId } from './publicDeckNav'
import type { ExperienceManifest } from './types'
import { usePresentationRuntime } from './usePresentationRuntime'

const CHROME_HEIGHT = 58
const DATA_BANNER_HEIGHT = 29
const EMPTY_MANIFEST: ExperienceManifest = {
  id: 'empty',
  title: 'Empty',
  theme: 'dark',
  mode: 'horizontalSlides',
  defaultSceneId: 'empty',
  scenes: [
    {
      id: 'empty',
      label: 'Empty',
      render: () => null,
    },
  ],
}

export function PresentationShell() {
  const location = useLocation()
  const { service, telemetry, dismissAlert, dismissAllAlerts } = useDataService()
  const dataContext = useMemo(() => service.getDataContext(), [service])

  const [appendixOpen, setAppendixOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [highlightFeatureId, setHighlightFeatureId] = useState<string | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openAppendix = useCallback(() => setAppendixOpen(true), [])
  const closeAppendix = useCallback(() => setAppendixOpen(false), [])
  const openAlertPanel = useCallback(() => setAlertOpen(true), [])
  const closeAlertPanel = useCallback(() => setAlertOpen(false), [])

  const resolved = useMemo(
    () =>
      resolvePresentationManifest(location.pathname, location.hash, {
        highlightFeatureId,
        openAppendix,
      }),
    [highlightFeatureId, location.hash, location.pathname, openAppendix],
  )

  const runtime = usePresentationRuntime({
    manifest: resolved?.manifest ?? EMPTY_MANIFEST,
    initialSceneId: resolved?.initialSceneId,
  })

  const handleAlertNavigate = useCallback(
    (alert: AlertItem) => {
      runtime.goToScene(alert.source === 'buyer' ? 'traceability' : 'geology')
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      setHighlightFeatureId(alert.id)
      highlightTimerRef.current = setTimeout(() => setHighlightFeatureId(null), 5000)
      setAlertOpen(false)
    },
    [runtime],
  )

  if (!resolved) {
    return null
  }

  const showTabs = runtime.manifest.chrome?.showSceneTabs ?? runtime.manifest.scenes.length > 1
  const showProgress = runtime.manifest.chrome?.showProgress ?? true
  const showUtilities = runtime.manifest.chrome?.showAppUtilities ?? false
  const showPublicDeckBar = Boolean(
    runtime.manifest.chrome?.showPublicDeckNav && isPublicMarketingDeckManifestId(runtime.manifest.id),
  )
  const showChrome = showTabs || showProgress || showUtilities || showPublicDeckBar
  const topOffset =
    (showChrome ? CHROME_HEIGHT : 0)
    + (runtime.manifest.chrome?.showDataModeBanner ? DATA_BANNER_HEIGHT : 0)

  return (
    <ThemeScope
      theme={runtime.manifest.theme}
      style={{
        minHeight: '100vh',
        background: 'var(--w-bg)',
        color: 'var(--w-text1)',
        ...getWorkspaceChromeCssVars(),
      }}
    >
      <OptionalMapLayer scene={runtime.activeScene} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {showChrome && (
          <TopChrome
            runtime={runtime}
            alertCount={dataContext.disclosureMode ? 0 : telemetry.activeAlerts.length}
            disclosureMode={dataContext.disclosureMode}
            onAlertsOpen={runtime.manifest.chrome?.showAppUtilities ? openAlertPanel : undefined}
          />
        )}

        {runtime.manifest.chrome?.showDataModeBanner && (
          <DataModeBanner context={dataContext} />
        )}

        <HorizontalSlidesRenderer runtime={runtime} topOffset={topOffset} />
      </div>

      {showUtilities && (
        <AlertPanel
          alerts={telemetry.activeAlerts}
          isOpen={alertOpen}
          onClose={closeAlertPanel}
          onDismiss={dismissAlert}
          onDismissAll={dismissAllAlerts}
          onNavigate={handleAlertNavigate}
        />
      )}

      {appendixOpen && (
        <DeckRunner manifest={getAppendixManifest()} onClose={closeAppendix} />
      )}
    </ThemeScope>
  )
}
