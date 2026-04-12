import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

const ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive'

const DAILY_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
  'et0_fao_evapotranspiration',
] as const

export interface HistoricalSeries {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
  et0_fao_evapotranspiration: number[]
}

function safeNumbers(arr: (number | null)[] | undefined): number[] {
  return (arr ?? []).map(v => (typeof v === 'number' && !Number.isNaN(v) ? v : 0))
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function fetchAndIngestArchive(): Promise<void> {
  const { latitude, longitude, yearsBack } = ENGINE_CONFIG.archive
  const end = new Date()
  end.setDate(end.getDate() - 1)
  const start = new Date(end)
  start.setFullYear(start.getFullYear() - yearsBack)

  const url = new URL(ARCHIVE_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', DAILY_FIELDS.join(','))
  url.searchParams.set('start_date', dateStr(start))
  url.searchParams.set('end_date', dateStr(end))
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo Archive HTTP ${res.status}`)

  const json = (await res.json()) as {
    daily?: Record<string, (number | null)[] | string[]>
  }

  const time = (json.daily?.time ?? []) as string[]
  if (time.length === 0) throw new Error('Open-Meteo Archive: empty series')

  const series: HistoricalSeries = {
    time,
    temperature_2m_max: safeNumbers(json.daily?.temperature_2m_max as (number | null)[]),
    temperature_2m_min: safeNumbers(json.daily?.temperature_2m_min as (number | null)[]),
    precipitation_sum: safeNumbers(json.daily?.precipitation_sum as (number | null)[]),
    wind_speed_10m_max: safeNumbers(json.daily?.wind_speed_10m_max as (number | null)[]),
    et0_fao_evapotranspiration: safeNumbers(json.daily?.et0_fao_evapotranspiration as (number | null)[]),
  }

  const totalPrecipMm = series.precipitation_sum.reduce((a, b) => a + b, 0)
  const avgAnnualPrecipMm = totalPrecipMm / yearsBack

  const payload = {
    source: 'open-meteo-archive',
    provenance: 'from_public_record',
    timestamp: new Date().toISOString(),
    latitude,
    longitude,
    startDate: dateStr(start),
    endDate: dateStr(end),
    dayCount: time.length,
    totalPrecipMm,
    avgAnnualPrecipMm,
    series,
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/historical-weather`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest archive failed: ${ingestRes.status}`)

  console.log(`[archive] Ingested ${time.length} days (${yearsBack}yr), avg annual precip ${avgAnnualPrecipMm.toFixed(0)} mm`)
}

export function startArchiveEnricher() {
  if (!ENGINE_CONFIG.archive.enabled) {
    console.log('[archive] Disabled')
    return
  }

  console.log(`[archive] Fetching ${ENGINE_CONFIG.archive.yearsBack}-year historical weather (one-time)`)
  fetchAndIngestArchive().catch(err => console.warn('[archive]', err.message))
}
