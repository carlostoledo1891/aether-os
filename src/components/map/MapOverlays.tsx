/**
 * MapOverlays — mounts overlay children based on a layer key array.
 *
 * Instead of 10+ conditional imports per map consumer, pass the list
 * of desired overlays and this component handles the rest.
 */

import { CaldeiraBoundary } from './CaldeiraBoundary'
import { LicenseOverlay } from './LicenseOverlay'
import { DrillHoleOverlay } from './DrillHoleOverlay'
import { PfsEngineeringOverlay } from './PfsEngineeringOverlay'
import { EnvironmentalOverlay } from './EnvironmentalOverlay'
import { SpringPinsOverlay } from './SpringPinsOverlay'
import { InfraOverlay } from './InfraOverlay'
import { OpsPlantSitesOverlay } from './OpsPlantSitesOverlay'
import { WeatherTileOverlay } from './WeatherTileOverlay'
import type { OverlayKey } from './mapPresets'

interface MapOverlaysProps {
  layers: OverlayKey[]
  environmentalProps?: {
    showApa?: boolean
    showBuffer?: boolean
    showMonitoring?: boolean
    showUrban?: boolean
  }
  licenseProps?: {
    highlightId?: string | null
  }
}

export function MapOverlays({ layers, environmentalProps, licenseProps }: MapOverlaysProps) {
  const has = (key: OverlayKey) => layers.includes(key)

  return (
    <>
      {has('boundary') && <CaldeiraBoundary />}
      {has('licenses') && <LicenseOverlay highlightId={licenseProps?.highlightId} />}
      {has('pfs') && <PfsEngineeringOverlay />}
      {has('drillholes') && <DrillHoleOverlay />}
      {has('environmental') && (
        <EnvironmentalOverlay
          showApa={environmentalProps?.showApa}
          showBuffer={environmentalProps?.showBuffer}
          showMonitoring={environmentalProps?.showMonitoring}
          showUrban={environmentalProps?.showUrban}
        />
      )}
      {has('hydroSprings') && <SpringPinsOverlay />}
      {/* hydroNodes (HydroOverlay) requires telemetry props — mount directly in FieldView */}
      {has('infra') && <InfraOverlay />}
      {has('plantSites') && <OpsPlantSitesOverlay />}
      {has('weather') && <WeatherTileOverlay />}
    </>
  )
}
