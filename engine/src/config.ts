export const ENGINE_CONFIG = {
  apiBaseUrl: process.env.AETHER_API_URL ?? 'http://localhost:3001',
  tickMs: parseInt(process.env.TICK_MS ?? '2000', 10),
  source: 'aether-engine',
  ingestApiKey: process.env.INGEST_API_KEY ?? '',

  openMeteo: {
    enabled: process.env.ENRICHER_OPENMETEO !== '0',
    intervalMs: 30 * 60 * 1000,
    latitude: parseFloat(process.env.SITE_LAT ?? '-21.815'),
    longitude: parseFloat(process.env.SITE_LNG ?? '-46.585'),
    pastDays: 30,
  },

  bcb: {
    enabled: process.env.ENRICHER_BCB !== '0',
    intervalMs: 60 * 60 * 1000,
  },

  usgs: {
    enabled: process.env.ENRICHER_USGS !== '0',
    intervalMs: 6 * 60 * 60 * 1000,
    latitude: -21.79,
    longitude: -46.58,
    radiusKm: 200,
  },

  alphaVantage: {
    enabled: !!process.env.ALPHA_VANTAGE_KEY,
    apiKey: process.env.ALPHA_VANTAGE_KEY ?? '',
    intervalMs: 24 * 60 * 60 * 1000,
    symbol: 'MEI.AX',
  },
}

export function ingestHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (ENGINE_CONFIG.ingestApiKey) h['x-api-key'] = ENGINE_CONFIG.ingestApiKey
  return h
}
