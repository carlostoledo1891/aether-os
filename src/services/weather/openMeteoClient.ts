/** Open-Meteo forecast API — read-only, no API key for moderate use. */

export interface DailyPrecipSeries {
  time: string[]
  precipitation_sum: number[]
}

export interface DailyClimateSeries {
  time: string[]
  precipitation_sum: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  relative_humidity_2m_mean: number[]
  et0_fao_evapotranspiration: number[]
  wind_speed_10m_max: number[]
  soil_moisture_0_to_7cm: number[]
}

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

const DAILY_FIELDS = [
  'precipitation_sum',
  'temperature_2m_max',
  'temperature_2m_min',
  'et0_fao_evapotranspiration',
  'wind_speed_10m_max',
] as const

const HOURLY_FOR_DAILY = [
  'relative_humidity_2m',
  'soil_moisture_0_to_7cm',
] as const

function safeNumbers(arr: (number | null)[] | undefined): number[] {
  return (arr ?? []).map(v => (typeof v === 'number' && !Number.isNaN(v) ? v : 0))
}

function dailyMeanFromHourly(hourly: number[], days: number): number[] {
  const result: number[] = []
  for (let d = 0; d < days; d++) {
    const slice = hourly.slice(d * 24, (d + 1) * 24)
    if (slice.length === 0) { result.push(0); continue }
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length)
  }
  return result
}

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

export async function fetchPastDaysClimate(
  latitude: number,
  longitude: number,
  pastDays: number,
): Promise<DailyClimateSeries> {
  const capped = Math.min(92, Math.max(1, Math.floor(pastDays)))
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', DAILY_FIELDS.join(','))
  url.searchParams.set('hourly', HOURLY_FOR_DAILY.join(','))
  url.searchParams.set('past_days', String(capped))
  url.searchParams.set('forecast_days', '1')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

  const json = (await res.json()) as {
    daily?: Record<string, (number | null)[] | string[]>
    hourly?: Record<string, (number | null)[]>
  }

  const time = (json.daily?.time ?? []) as string[]
  if (time.length === 0) throw new Error('Open-Meteo: empty climate series')

  const days = time.length
  const humidityHourly = safeNumbers(json.hourly?.relative_humidity_2m as (number | null)[] | undefined)
  const soilHourly = safeNumbers(json.hourly?.soil_moisture_0_to_7cm as (number | null)[] | undefined)

  return {
    time,
    precipitation_sum: safeNumbers(json.daily?.precipitation_sum as (number | null)[]),
    temperature_2m_max: safeNumbers(json.daily?.temperature_2m_max as (number | null)[]),
    temperature_2m_min: safeNumbers(json.daily?.temperature_2m_min as (number | null)[]),
    et0_fao_evapotranspiration: safeNumbers(json.daily?.et0_fao_evapotranspiration as (number | null)[]),
    wind_speed_10m_max: safeNumbers(json.daily?.wind_speed_10m_max as (number | null)[]),
    relative_humidity_2m_mean: dailyMeanFromHourly(humidityHourly, days),
    soil_moisture_0_to_7cm: dailyMeanFromHourly(soilHourly, days),
  }
}

export function sumPrecipMm(series: DailyPrecipSeries): number {
  return series.precipitation_sum.reduce((a, b) => a + b, 0)
}

/* ─── Forecast (16-day) ─────────────────────────────────────────────── */

export interface DailyForecastSeries {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
  relative_humidity_2m_max: number[]
  et0_fao_evapotranspiration: number[]
}

const FORECAST_DAILY = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
  'et0_fao_evapotranspiration',
] as const

const FORECAST_HOURLY = ['relative_humidity_2m'] as const

export async function fetchForecast(
  latitude: number,
  longitude: number,
  days = 16,
): Promise<DailyForecastSeries> {
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', FORECAST_DAILY.join(','))
  url.searchParams.set('hourly', FORECAST_HOURLY.join(','))
  url.searchParams.set('forecast_days', String(Math.min(16, days)))
  url.searchParams.set('past_days', '0')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Open-Meteo Forecast HTTP ${res.status}`)

  const json = (await res.json()) as {
    daily?: Record<string, (number | null)[] | string[]>
    hourly?: Record<string, (number | null)[]>
  }

  const time = (json.daily?.time ?? []) as string[]
  if (time.length === 0) throw new Error('Open-Meteo Forecast: empty series')

  const humidityHourly = safeNumbers(json.hourly?.relative_humidity_2m as (number | null)[] | undefined)
  const relative_humidity_2m_max: number[] = []
  for (let d = 0; d < time.length; d++) {
    const slice = humidityHourly.slice(d * 24, (d + 1) * 24)
    relative_humidity_2m_max.push(slice.length > 0 ? Math.max(...slice) : 0)
  }

  return {
    time,
    temperature_2m_max: safeNumbers(json.daily?.temperature_2m_max as (number | null)[]),
    temperature_2m_min: safeNumbers(json.daily?.temperature_2m_min as (number | null)[]),
    precipitation_sum: safeNumbers(json.daily?.precipitation_sum as (number | null)[]),
    wind_speed_10m_max: safeNumbers(json.daily?.wind_speed_10m_max as (number | null)[]),
    relative_humidity_2m_max,
    et0_fao_evapotranspiration: safeNumbers(json.daily?.et0_fao_evapotranspiration as (number | null)[]),
  }
}
