/**
 * MapOverlays — mounts overlay children based on a layer key array.
 *
 * Instead of 10+ conditional imports per map consumer, pass the list
 * of desired overlays and this component handles the rest.
 *
 * External raster layers (CPRM, Macrostrat, USGS) are rendered via the
 * generic ExternalRasterOverlay using SiteConfig, eliminating per-service
 * overlay files. Component-based overlays (INMET, boundary, licenses…)
 * are still rendered directly.
 *
 * For overlays that need interaction props (e.g. DrillHoleOverlay with
 * hoveredHoleId), pass a `renderOverrides` map — when a key is present
 * the override ReactNode is rendered instead of the default component.
 */

import type { ReactNode } from 'react'
import { CaldeiraBoundary } from './CaldeiraBoundary'
import { LicenseOverlay } from './LicenseOverlay'
import { DrillHoleOverlay } from './DrillHoleOverlay'
import { PfsEngineeringOverlay } from './PfsEngineeringOverlay'
import { EnvironmentalOverlay } from './EnvironmentalOverlay'
import { SpringPinsOverlay } from './SpringPinsOverlay'
import { InfraOverlay } from './InfraOverlay'
import { OpsPlantSitesOverlay } from './OpsPlantSitesOverlay'
import { WeatherTileOverlay, type WeatherLayerId } from './WeatherTileOverlay'
import { InmetStationOverlay } from './InmetStationOverlay'
import { TerrainOverlay } from './TerrainOverlay'
import { ExternalRasterOverlay } from './ExternalRasterOverlay'
import type { OverlayKey } from './mapPresets'
import type { SiteExternalLayer } from 'shared/sites/types'
import { CALDEIRA_EXTERNAL_LAYERS } from 'shared/sites/caldeira'

const RASTER_SOURCE_TYPES = new Set(['arcgis-rest', 'wms', 'xyz-raster'])

export interface MapOverlaysProps {
  layers: OverlayKey[]
  mapId?: string
  environmentalProps?: {
    showApa?: boolean
    showBuffer?: boolean
    showMonitoring?: boolean
    showUrban?: boolean
  }
  licenseProps?: {
    highlightId?: string | null
    hoveredLicenseId?: string | null
    selectedLicenseId?: string | null
  }
  weatherOpacity?: number
  terrainExaggeration?: number
  activeWeatherLayers?: Set<WeatherLayerId>
  /** Site-specific external layers (from SiteConfig.externalLayers). */
  externalLayers?: SiteExternalLayer[]
  renderOverrides?: Partial<Record<OverlayKey, ReactNode>>
}

export function MapOverlays({
  layers,
  mapId,
  environmentalProps,
  licenseProps,
  weatherOpacity = 0.6,
  terrainExaggeration = 1.4,
  activeWeatherLayers,
  externalLayers,
  renderOverrides,
}: MapOverlaysProps) {
  const layerSet = new Set(layers)
  const has = (key: OverlayKey) => layerSet.has(key)
  const override = (key: OverlayKey) =>
    renderOverrides && key in renderOverrides

  const activeExternals = (externalLayers ?? CALDEIRA_EXTERNAL_LAYERS).filter(
    ext => RASTER_SOURCE_TYPES.has(ext.sourceType) && layerSet.has(ext.id as OverlayKey),
  )

  return (
    <>
      {(has('terrain') || has('hillshade')) && (
        <TerrainOverlay
          mapId={mapId}
          terrain={has('terrain')}
          hillshade={has('hillshade')}
          exaggeration={terrainExaggeration}
        />
      )}

      {activeExternals.map(ext => (
        <ExternalRasterOverlay key={ext.id} config={ext} />
      ))}

      {has('boundary') && <CaldeiraBoundary />}
      {has('licenses') && (
        override('licenses')
          ? renderOverrides!.licenses
          : <LicenseOverlay
              highlightId={licenseProps?.highlightId}
              hoveredLicenseId={licenseProps?.hoveredLicenseId ?? null}
              selectedLicenseId={licenseProps?.selectedLicenseId ?? null}
            />
      )}
      {has('pfs') && (
        override('pfs') ? renderOverrides!.pfs : <PfsEngineeringOverlay />
      )}
      {has('drillholes') && (
        override('drillholes')
          ? renderOverrides!.drillholes
          : <DrillHoleOverlay />
      )}
      {has('environmental') && (
        override('environmental')
          ? renderOverrides!.environmental
          : <EnvironmentalOverlay
              showApa={environmentalProps?.showApa}
              showBuffer={environmentalProps?.showBuffer}
              showMonitoring={environmentalProps?.showMonitoring}
              showUrban={environmentalProps?.showUrban}
            />
      )}
      {has('hydroSprings') && (
        override('hydroSprings')
          ? renderOverrides!.hydroSprings
          : <SpringPinsOverlay />
      )}
      {has('hydroNodes') && (
        override('hydroNodes')
          ? renderOverrides!.hydroNodes
          : null
      )}
      {has('infra') && (
        override('infra') ? renderOverrides!.infra : <InfraOverlay />
      )}
      {has('plantSites') && (
        override('plantSites')
          ? renderOverrides!.plantSites
          : <OpsPlantSitesOverlay />
      )}
      {has('weather') && (
        <WeatherTileOverlay opacity={weatherOpacity} activeWeatherLayers={activeWeatherLayers} />
      )}
      {has('inmetStations') && <InmetStationOverlay />}
    </>
  )
}
