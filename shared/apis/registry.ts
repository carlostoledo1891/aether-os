/**
 * API Source Registry — single source of truth for every external API
 * the platform integrates with.
 *
 * Phase 1: metadata only. Enrichers, clients, and tile layers can import
 * their ApiSourceDef to read baseUrl / authMethod / env references.
 * No runtime behavioral changes — purely a typed catalog.
 */

export type ApiCategory =
  | 'weather'
  | 'geology'
  | 'seismic'
  | 'financial'
  | 'tile'
  | 'regulatory'
  | 'llm'
  | 'environmental'

export type ApiAuthMethod = 'none' | 'query-param' | 'header-bearer' | 'header-custom'

export type ApiTier = 'free' | 'freemium' | 'paid'

export interface ApiSourceDef {
  id: string
  name: string
  provider: string
  category: ApiCategory
  baseUrl: string
  /** Env var that enables/disables this enricher (e.g. 'ENRICHER_OPENMETEO') */
  envToggle?: string
  /** Env var holding the API key (e.g. 'ALPHA_VANTAGE_KEY') */
  envKeyVar?: string
  authMethod: ApiAuthMethod
  rateLimit?: { requests: number; windowMs: number }
  docsUrl?: string
  tier: ApiTier
  /** Which layer of the stack consumes this API */
  consumers: Array<'engine' | 'server' | 'frontend'>
  /** Ingest endpoint this enricher POSTs to (engine enrichers only) */
  ingestEndpoint?: string
}

// ── Registry ────────────────────────────────────────────────────────────

export const API_REGISTRY = {
  'open-meteo-current': {
    id: 'open-meteo-current',
    name: 'Open-Meteo Current Weather',
    provider: 'Open-Meteo',
    category: 'weather',
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    envToggle: 'ENRICHER_OPENMETEO',
    authMethod: 'none',
    docsUrl: 'https://open-meteo.com/en/docs',
    tier: 'free',
    consumers: ['engine', 'frontend'],
    ingestEndpoint: '/ingest/weather',
  },

  'open-meteo-forecast': {
    id: 'open-meteo-forecast',
    name: 'Open-Meteo 16-Day Forecast',
    provider: 'Open-Meteo',
    category: 'weather',
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    envToggle: 'ENRICHER_FORECAST',
    authMethod: 'none',
    docsUrl: 'https://open-meteo.com/en/docs',
    tier: 'free',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/forecast',
  },

  'open-meteo-archive': {
    id: 'open-meteo-archive',
    name: 'Open-Meteo ERA5 Archive',
    provider: 'Open-Meteo',
    category: 'weather',
    baseUrl: 'https://archive-api.open-meteo.com/v1/archive',
    envToggle: 'ENRICHER_ARCHIVE',
    authMethod: 'none',
    docsUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
    tier: 'free',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/historical-weather',
  },

  'bcb-ptax': {
    id: 'bcb-ptax',
    name: 'BCB PTAX (BRL/USD)',
    provider: 'Banco Central do Brasil',
    category: 'financial',
    baseUrl: 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata',
    envToggle: 'ENRICHER_BCB',
    authMethod: 'none',
    docsUrl: 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/aplicacao#!/recursos',
    tier: 'free',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/market',
  },

  'usgs-seismic': {
    id: 'usgs-seismic',
    name: 'USGS FDSN Earthquake Catalog',
    provider: 'U.S. Geological Survey',
    category: 'seismic',
    baseUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
    envToggle: 'ENRICHER_USGS',
    authMethod: 'none',
    docsUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
    tier: 'free',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/seismic',
  },

  'alpha-vantage': {
    id: 'alpha-vantage',
    name: 'Alpha Vantage Stock Quote',
    provider: 'Alpha Vantage',
    category: 'financial',
    baseUrl: 'https://www.alphavantage.co/query',
    envKeyVar: 'ALPHA_VANTAGE_KEY',
    authMethod: 'query-param',
    rateLimit: { requests: 25, windowMs: 86_400_000 },
    docsUrl: 'https://www.alphavantage.co/documentation/',
    tier: 'freemium',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/market',
  },

  'brasilapi-cptec': {
    id: 'brasilapi-cptec',
    name: 'BrasilAPI CPTEC Forecast',
    provider: 'BrasilAPI / CPTEC-INPE',
    category: 'weather',
    baseUrl: 'https://brasilapi.com.br/api/cptec/v1',
    authMethod: 'none',
    docsUrl: 'https://brasilapi.com.br/docs#tag/CPTEC',
    tier: 'free',
    consumers: ['frontend'],
  },

  'maptiler': {
    id: 'maptiler',
    name: 'MapTiler Basemaps & Terrain',
    provider: 'MapTiler',
    category: 'tile',
    baseUrl: 'https://api.maptiler.com',
    envKeyVar: 'VITE_MAPTILER_KEY',
    authMethod: 'query-param',
    docsUrl: 'https://docs.maptiler.com/',
    tier: 'freemium',
    consumers: ['frontend'],
  },

  'openweathermap-tiles': {
    id: 'openweathermap-tiles',
    name: 'OpenWeatherMap Raster Tiles',
    provider: 'OpenWeatherMap',
    category: 'tile',
    baseUrl: 'https://tile.openweathermap.org/map',
    envKeyVar: 'VITE_OWM_KEY',
    authMethod: 'query-param',
    docsUrl: 'https://openweathermap.org/api/weathermaps',
    tier: 'freemium',
    consumers: ['frontend'],
  },

  'google-gemini': {
    id: 'google-gemini',
    name: 'Google Gemini (Chat LLM)',
    provider: 'Google',
    category: 'llm',
    baseUrl: 'https://generativelanguage.googleapis.com',
    envKeyVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
    authMethod: 'header-bearer',
    docsUrl: 'https://ai.google.dev/docs',
    tier: 'paid',
    consumers: ['server'],
  },

  'geosgb-geology': {
    id: 'geosgb-geology',
    name: 'GeoSGB Geological Map Services',
    provider: 'Serviço Geológico do Brasil',
    category: 'geology',
    baseUrl: 'https://geoportal.sgb.gov.br/server/rest/services/dados_plataforma/geologia/MapServer',
    authMethod: 'none',
    docsUrl: 'https://geoportal.sgb.gov.br',
    tier: 'free',
    consumers: ['frontend'],
  },

  sigmine: {
    id: 'sigmine',
    name: 'SIGMINE Mining Cadastre',
    provider: 'ANM',
    category: 'geology',
    baseUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/FeatureServer',
    authMethod: 'none',
    docsUrl: 'https://www.gov.br/anm/pt-br/assuntos/sistemas/sigmine',
    tier: 'free',
    consumers: ['frontend'],
  },

  'anm-geoscience': {
    id: 'anm-geoscience',
    name: 'ANM Geoscience Layers',
    provider: 'Agencia Nacional de Mineracao',
    category: 'geology',
    baseUrl: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/geociencias/MapServer',
    authMethod: 'none',
    docsUrl: 'https://www.gov.br/anm/pt-br/assuntos/dados-abertos',
    tier: 'free',
    consumers: ['frontend'],
  },

  'snirh-hidroweb': {
    id: 'snirh-hidroweb',
    name: 'SNIRH Hidroweb',
    provider: 'ANA / SNIRH',
    category: 'environmental',
    baseUrl: 'https://portal1.snirh.gov.br/server/rest/services/Esta%C3%A7%C3%B5es_Hidrometeorol%C3%B3gicas_SNIRH/FeatureServer',
    authMethod: 'none',
    docsUrl: 'https://www.snirh.gov.br/hidroweb/mapa',
    tier: 'free',
    consumers: ['frontend'],
  },

  inmet: {
    id: 'inmet',
    name: 'INMET Weather Stations',
    provider: 'INMET',
    category: 'weather',
    baseUrl: 'https://portal.inmet.gov.br',
    authMethod: 'none',
    docsUrl: 'https://portal.inmet.gov.br/dadoshistoricos',
    tier: 'free',
    consumers: ['frontend'],
  },

  'cnen-lapoc': {
    id: 'cnen-lapoc',
    name: 'CNEN LAPOC Field Data',
    provider: 'CNEN / LAPOC',
    category: 'environmental',
    baseUrl: '/ingest/lapoc',
    authMethod: 'header-custom',
    docsUrl: 'docs/data/caldeira/LAPOC_INGESTION.md',
    tier: 'free',
    consumers: ['engine', 'server'],
    ingestEndpoint: '/ingest/lapoc',
  },
} as const satisfies Record<string, ApiSourceDef>

export type ApiSourceId = keyof typeof API_REGISTRY

export function getApiSource(id: ApiSourceId): ApiSourceDef {
  return API_REGISTRY[id]
}

export function getApiSourcesByCategory(category: ApiCategory): ApiSourceDef[] {
  return Object.values(API_REGISTRY).filter(s => s.category === category)
}

export function getApiSourcesByConsumer(consumer: 'engine' | 'server' | 'frontend'): ApiSourceDef[] {
  return Object.values(API_REGISTRY).filter(s => (s.consumers as readonly string[]).includes(consumer))
}
