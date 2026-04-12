/**
 * Caldeira Project — Poços de Caldas Alkaline Complex, MG, Brazil.
 * Operated by Meteoric Resources (ASX: MEI).
 *
 * This is the SINGLE SOURCE OF TRUTH for all Caldeira-specific constants.
 * Frontend, server, and engine all derive their values from here.
 */

import type { SiteConfig, SiteGeo, SiteThresholds, SiteIdentity } from './types.js'

export const CALDEIRA_IDENTITY: SiteIdentity = {
  siteId: 'caldeira',
  projectName: 'Caldeira Project',
  companyName: 'Meteoric Resources',
  accentColor: '#7C5CFC',
}

export const CALDEIRA_GEO: SiteGeo = {
  center: [-46.555, -21.88],
  bbox: [[-46.72, -22.06], [-46.39, -21.75]],
  defaultZoom: 11,
  defaultPitch: 35,
  defaultBearing: 0,
  pois: {
    pilotPlant:      { coords: [-46.575, -21.8],   label: 'CIP Pilot Plant' },
    commercialPlant: { coords: [-46.545, -21.885], label: 'Proposed Commercial Plant' },
    capaoDoMel:      { coords: [-46.565, -21.848], label: 'Capão do Mel Deposit' },
    urbanCenter:     { coords: [-46.56,  -21.79],  label: 'Poços de Caldas Urban Center' },
  },
}

export const CALDEIRA_THRESHOLDS: SiteThresholds = {
  sulfate_warning_ppm: 250,
  nitrate_warning_ppm: 50,
  radiation_critical_usv_h: 0.18,
  ph_low: 3.9,
  ph_high: 5.1,
  recirculation_warning_pct: 94,
}

export const CALDEIRA_SPRING_COUNT = 1092

export const CALDEIRA: SiteConfig = {
  identity: CALDEIRA_IDENTITY,
  geo: CALDEIRA_GEO,
  thresholds: CALDEIRA_THRESHOLDS,
  springCount: CALDEIRA_SPRING_COUNT,
}
