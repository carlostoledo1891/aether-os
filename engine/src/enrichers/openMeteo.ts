import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

interface DailyPrecipSeries { time: string[]; precipitation_sum: number[] }

export async function fetchAndIngestWeather(): Promise<void> {
  const { latitude, longitude, pastDays } = ENGINE_CONFIG.openMeteo
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', 'precipitation_sum')
  url.searchParams.set('past_days', String(pastDays))
  url.searchParams.set('forecast_days', '1')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

  const json = await res.json() as {
    daily?: { time?: string[]; precipitation_sum?: (number | null)[] }
  }
  const time = json.daily?.time ?? []
  const raw = json.daily?.precipitation_sum ?? []
  const precipitation_sum = raw.map((v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0))

  if (time.length === 0) throw new Error('Open-Meteo: empty series')

  const series: DailyPrecipSeries = { time, precipitation_sum }
  const precipMm = precipitation_sum.reduce((a, b) => a + b, 0)

  const payload = {
    source: 'open-meteo',
    provenance: 'verified_real',
    timestamp: new Date().toISOString(),
    latitude, longitude, precipMm, series,
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/weather`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest weather failed: ${ingestRes.status}`)

  console.log(`[open-meteo] Ingested ${time.length} days, total ${precipMm.toFixed(1)} mm`)
}

export function startOpenMeteoEnricher() {
  if (!ENGINE_CONFIG.openMeteo.enabled) {
    console.log('[open-meteo] Disabled')
    return
  }

  console.log(`[open-meteo] Starting (interval: ${ENGINE_CONFIG.openMeteo.intervalMs / 60000} min)`)

  const run = () => fetchAndIngestWeather().catch(err => console.warn('[open-meteo]', err.message))
  run()
  setInterval(run, ENGINE_CONFIG.openMeteo.intervalMs)
}
