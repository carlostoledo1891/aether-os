import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

const DAILY_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
  'relative_humidity_2m_max',
  'et0_fao_evapotranspiration',
] as const

export interface ForecastSeries {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
  relative_humidity_2m_max: number[]
  et0_fao_evapotranspiration: number[]
}

function safeNumbers(arr: (number | null)[] | undefined): number[] {
  return (arr ?? []).map(v => (typeof v === 'number' && !Number.isNaN(v) ? v : 0))
}

export async function fetchAndIngestForecast(): Promise<void> {
  const { latitude, longitude, forecastDays } = ENGINE_CONFIG.forecast
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', DAILY_FIELDS.join(','))
  url.searchParams.set('forecast_days', String(forecastDays))
  url.searchParams.set('past_days', '0')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo Forecast HTTP ${res.status}`)

  const json = (await res.json()) as {
    daily?: Record<string, (number | null)[] | string[]>
  }

  const time = (json.daily?.time ?? []) as string[]
  if (time.length === 0) throw new Error('Open-Meteo Forecast: empty series')

  const series: ForecastSeries = {
    time,
    temperature_2m_max: safeNumbers(json.daily?.temperature_2m_max as (number | null)[]),
    temperature_2m_min: safeNumbers(json.daily?.temperature_2m_min as (number | null)[]),
    precipitation_sum: safeNumbers(json.daily?.precipitation_sum as (number | null)[]),
    wind_speed_10m_max: safeNumbers(json.daily?.wind_speed_10m_max as (number | null)[]),
    relative_humidity_2m_max: safeNumbers(json.daily?.relative_humidity_2m_max as (number | null)[]),
    et0_fao_evapotranspiration: safeNumbers(json.daily?.et0_fao_evapotranspiration as (number | null)[]),
  }

  const totalPrecipMm = series.precipitation_sum.reduce((a, b) => a + b, 0)

  const payload = {
    source: 'open-meteo-forecast',
    provenance: 'modeled',
    timestamp: new Date().toISOString(),
    latitude,
    longitude,
    forecastDays: time.length,
    totalPrecipMm,
    series,
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/forecast`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest forecast failed: ${ingestRes.status}`)

  console.log(`[forecast] Ingested ${time.length}-day forecast, total precip ${totalPrecipMm.toFixed(1)} mm`)
}

export function startForecastEnricher() {
  if (!ENGINE_CONFIG.forecast.enabled) {
    console.log('[forecast] Disabled')
    return
  }

  console.log(`[forecast] Starting (interval: ${ENGINE_CONFIG.forecast.intervalMs / 60000} min)`)

  const run = () => fetchAndIngestForecast().catch(err => console.warn('[forecast]', err.message))
  run()
  setInterval(run, ENGINE_CONFIG.forecast.intervalMs)
}
