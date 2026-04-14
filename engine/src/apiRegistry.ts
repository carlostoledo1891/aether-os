/**
 * Engine-local mirror of shared/apis/registry.ts
 *
 * The canonical registry lives in shared/apis/registry.ts and is maintained
 * there. This file re-exports only the entries and helpers the engine needs.
 *
 * When the monorepo adds workspace package references (npm workspaces or
 * tsconfig project references), this file can be replaced with a direct
 * import from the shared package.
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

export interface ApiSourceDef {
  id: string
  name: string
  provider: string
  category: ApiCategory
  baseUrl: string
  envToggle?: string
  envKeyVar?: string
  authMethod: ApiAuthMethod
  rateLimit?: { requests: number; windowMs: number }
  docsUrl?: string
  tier: 'free' | 'freemium' | 'paid'
  consumers: readonly string[]
  ingestEndpoint?: string
}

export const ENGINE_API_SOURCES = {
  'open-meteo-current': {
    id: 'open-meteo-current',
    name: 'Open-Meteo Current Weather',
    provider: 'Open-Meteo',
    category: 'weather',
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    envToggle: 'ENRICHER_OPENMETEO',
    authMethod: 'none',
    tier: 'free',
    consumers: ['engine'],
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
    tier: 'freemium',
    consumers: ['engine'],
    ingestEndpoint: '/ingest/market',
  },
} as const satisfies Record<string, ApiSourceDef>

export type EngineApiSourceId = keyof typeof ENGINE_API_SOURCES

export function getEngineApiSource(id: EngineApiSourceId): ApiSourceDef {
  return ENGINE_API_SOURCES[id]
}
