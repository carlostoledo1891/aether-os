/**
 * Caldeira Project — Poços de Caldas Alkaline Complex, MG, Brazil.
 * Operated by Meteoric Resources (ASX: MEI).
 *
 * This is the SINGLE SOURCE OF TRUTH for all Caldeira-specific constants.
 * Frontend, server, and engine all derive their values from here.
 */

import type { SiteConfig, SiteGeo, SiteThresholds, SiteIdentity, SiteExternalLayer } from './types.js'

export const CALDEIRA_IDENTITY: SiteIdentity = {
  siteId: 'caldeira',
  projectName: 'Caldeira Project',
  companyName: 'Meteoric Resources',
  accentColor: '#7C5CFC',
}

export const CALDEIRA_GEO: SiteGeo = {
  center: [-46.555, -21.84],
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

export const CALDEIRA_EXTERNAL_LAYERS: SiteExternalLayer[] = [
  {
    id: 'cprmGeology',
    group: 'geology',
    label: 'Geological map (SGB)',
    sourceType: 'arcgis-rest',
    url: 'https://geoportal.sgb.gov.br/server/rest/services/dados_plataforma/geologia/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image',
    attribution: 'Fonte: SGB/CPRM',
    defaultOn: false,
  },
  {
    id: 'macrostrat',
    group: 'geology',
    label: 'Macrostrat (global, external)',
    sourceType: 'xyz-raster',
    url: 'https://tiles.macrostrat.org/carto/{z}/{x}/{y}.png',
    attribution: '© Macrostrat',
    defaultOn: false,
  },
  {
    id: 'usgsRee',
    group: 'geology',
    label: 'USGS REE deposits',
    sourceType: 'wms',
    url: 'https://mrdata.usgs.gov/services/ree?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=REE&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=TRUE',
    attribution: '© USGS MRData',
    defaultOn: false,
  },
  {
    id: 'inmetStations',
    group: 'weather',
    label: 'INMET stations (BR)',
    sourceType: 'geojson-component',
    attribution: 'Fonte: INMET',
    defaultOn: false,
  },
]

export const CALDEIRA: SiteConfig = {
  identity: CALDEIRA_IDENTITY,
  geo: CALDEIRA_GEO,
  thresholds: CALDEIRA_THRESHOLDS,
  springCount: CALDEIRA_SPRING_COUNT,
  externalLayers: CALDEIRA_EXTERNAL_LAYERS,
}
