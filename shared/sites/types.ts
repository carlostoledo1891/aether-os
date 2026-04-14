/**
 * Site configuration types for the VeroChain platform.
 *
 * Every mine-site deployment has a single SiteConfig that feeds:
 *   - Frontend (tenant identity, map defaults, domain data)
 *   - Server (seed data, API context)
 *   - Engine (geographic coordinates for enrichers)
 *
 * To onboard a new site, create a new file alongside caldeira.ts
 * and set VITE_PROJECT_ID / SITE_ID env vars.
 */

export interface SiteGeo {
  center: [lng: number, lat: number]
  bbox: [[number, number], [number, number]]
  defaultZoom: number
  defaultPitch: number
  defaultBearing: number
  pois: Record<string, { coords: [number, number]; label: string }>
}

export interface SiteThresholds {
  sulfate_warning_ppm: number
  nitrate_warning_ppm: number
  radiation_critical_usv_h: number
  ph_low: number
  ph_high: number
  recirculation_warning_pct: number
}

export interface SiteIdentity {
  siteId: string
  projectName: string
  companyName: string
  accentColor: string
}

export type SiteLayerSourceType =
  | 'arcgis-rest'
  | 'wms'
  | 'xyz-raster'
  | 'geojson-component'
  | 'geojson-snapshot'

export type SiteExternalLayerRenderMode =
  | 'snapshot-geojson'
  | 'live-raster'

export type SiteExternalLayerIdentifyMode =
  | 'none'
  | 'snapshot-properties'
  | 'arcgis-query'

export type SiteExternalLayerLegendSymbol =
  | 'fill'
  | 'line'
  | 'circle'
  | 'raster'

export interface SiteExternalLayerLegendItem {
  label: string
  symbol: SiteExternalLayerLegendSymbol
  color?: string
  strokeColor?: string
}

export interface SiteExternalLayer {
  id: string
  group: string
  label: string
  sourceType: SiteLayerSourceType
  url?: string
  attribution: string
  defaultOn?: boolean
  provider?: string
  datasetId?: string
  logicalSourceId?: string
  renderMode?: SiteExternalLayerRenderMode
  identifyMode?: SiteExternalLayerIdentifyMode
  supportsLegend?: boolean
  supportsHealth?: boolean
  apiSourceId?: string
  serviceBaseUrl?: string
  queryUrl?: string
  layerId?: number
  sublayerIds?: number[]
  legendUrl?: string
  legendItems?: SiteExternalLayerLegendItem[]
  snapshotPath?: string
  snapshotSourceId?: string
}

export interface SiteConfig {
  identity: SiteIdentity
  geo: SiteGeo
  thresholds: SiteThresholds
  springCount: number
  externalLayers?: SiteExternalLayer[]
}
