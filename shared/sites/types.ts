/**
 * Site configuration types for the Vero platform.
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

export interface SiteConfig {
  identity: SiteIdentity
  geo: SiteGeo
  thresholds: SiteThresholds
  springCount: number
}
