/** Open-Meteo forecast API — read-only, no API key for moderate use. */

export interface DailyPrecipSeries {
  time: string[]
  precipitation_sum: number[]
}

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function fetchPastDaysDailyPrecip(
  latitude: number,
  longitude: number,
  pastDays: number,
): Promise<DailyPrecipSeries> {
  const capped = Math.min(92, Math.max(1, Math.floor(pastDays)))
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', 'precipitation_sum')
  url.searchParams.set('past_days', String(capped))
  url.searchParams.set('forecast_days', '1')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

  const json = (await res.json()) as {
    daily?: { time?: string[]; precipitation_sum?: (number | null)[] }
  }
  const time = json.daily?.time ?? []
  const raw = json.daily?.precipitation_sum ?? []
  const precipitation_sum = raw.map((v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0))

  if (time.length === 0 || precipitation_sum.length === 0) {
    throw new Error('Open-Meteo: empty precipitation series')
  }

  return { time, precipitation_sum }
}

export function sumPrecipMm(series: DailyPrecipSeries): number {
  return series.precipitation_sum.reduce((a, b) => a + b, 0)
}
