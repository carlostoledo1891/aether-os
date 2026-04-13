import type { DailyPrecipSeries, DailyForecastSeries } from '../services/weather/openMeteoClient'
import { getDataMode } from '../config/env'

export function isLiveMode(): boolean {
  return getDataMode() === 'live'
}

export async function fetchServerWeatherCurrent(): Promise<DailyPrecipSeries | null> {
  try {
    const res = await fetch('/api/weather/current')
    if (!res.ok) return null
    const data = await res.json()
    if (data?.daily?.time && data?.daily?.precipitation_sum) {
      return { time: data.daily.time, precipitation_sum: data.daily.precipitation_sum }
    }
    if (data?.time && data?.precipitation_sum) {
      return { time: data.time, precipitation_sum: data.precipitation_sum }
    }
    return null
  } catch { return null }
}

export async function fetchServerForecast(): Promise<DailyForecastSeries | null> {
  try {
    const res = await fetch('/api/weather/forecast')
    if (!res.ok) return null
    const data = await res.json()
    const d = data?.daily ?? data
    if (d?.time && d?.precipitation_sum) {
      return {
        time: d.time,
        temperature_2m_max: d.temperature_2m_max ?? [],
        temperature_2m_min: d.temperature_2m_min ?? [],
        precipitation_sum: d.precipitation_sum,
        wind_speed_10m_max: d.wind_speed_10m_max ?? [],
        relative_humidity_2m_max: d.relative_humidity_2m_max ?? [],
        et0_fao_evapotranspiration: d.et0_fao_evapotranspiration ?? [],
      }
    }
    return null
  } catch { return null }
}
