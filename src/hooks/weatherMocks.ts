import type {
  DailyPrecipSeries,
  DailyClimateSeries,
  DailyForecastSeries,
} from '../services/weather/openMeteoClient'

/** Deterministic mock series for tests and when API is off / fails */
export function mockDailyPrecipSeries(lat: number, lng: number, days: number): DailyPrecipSeries {
  const n = Math.min(92, Math.max(1, Math.floor(days)))
  const time: string[] = []
  const precipitation_sum: number[] = []
  const seed = lat * 1.003 + lng * 1.007
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    time.push(d.toISOString().slice(0, 10))
    const t = seed + i * 1.13
    const v = (Math.sin(t) * 0.5 + 0.5) * 7.5 + 1.2 + (i % 5) * 0.35
    precipitation_sum.push(Math.round(v * 10) / 10)
  }
  return { time, precipitation_sum }
}

export function mockClimateSeries(lat: number, lng: number, days: number): DailyClimateSeries {
  const precip = mockDailyPrecipSeries(lat, lng, days)
  const n = precip.time.length
  const seed = lat * 1.003 + lng * 1.007
  const temperature_2m_max: number[] = []
  const temperature_2m_min: number[] = []
  const relative_humidity_2m_mean: number[] = []
  const et0_fao_evapotranspiration: number[] = []
  const wind_speed_10m_max: number[] = []
  const soil_moisture_0_to_7cm: number[] = []

  for (let i = 0; i < n; i++) {
    const t = seed + i * 0.97
    temperature_2m_max.push(Math.round((22 + Math.sin(t) * 6) * 10) / 10)
    temperature_2m_min.push(Math.round((12 + Math.sin(t + 1) * 4) * 10) / 10)
    relative_humidity_2m_mean.push(Math.round(65 + Math.cos(t * 0.8) * 15))
    et0_fao_evapotranspiration.push(Math.round((3.2 + Math.sin(t * 1.2) * 1.5) * 10) / 10)
    wind_speed_10m_max.push(Math.round((8 + Math.sin(t * 0.6) * 5) * 10) / 10)
    soil_moisture_0_to_7cm.push(Math.round((0.25 + Math.sin(t * 0.4) * 0.08) * 1000) / 1000)
  }

  return {
    ...precip,
    temperature_2m_max,
    temperature_2m_min,
    relative_humidity_2m_mean,
    et0_fao_evapotranspiration,
    wind_speed_10m_max,
    soil_moisture_0_to_7cm,
  }
}

export function mockForecastSeries(lat: number, lng: number, days: number): DailyForecastSeries {
  const n = Math.min(16, Math.max(1, Math.floor(days)))
  const time: string[] = []
  const temperature_2m_max: number[] = []
  const temperature_2m_min: number[] = []
  const precipitation_sum: number[] = []
  const wind_speed_10m_max: number[] = []
  const relative_humidity_2m_max: number[] = []
  const et0_fao_evapotranspiration: number[] = []

  const seed = lat * 1.003 + lng * 1.007
  const now = new Date()

  for (let i = 0; i < n; i++) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() + i + 1)
    time.push(d.toISOString().slice(0, 10))
    const t = seed + i * 1.13
    temperature_2m_max.push(Math.round((24 + Math.sin(t) * 5) * 10) / 10)
    temperature_2m_min.push(Math.round((14 + Math.sin(t + 1) * 3) * 10) / 10)
    precipitation_sum.push(Math.round((Math.sin(t * 0.7) * 0.5 + 0.5) * 12 * 10) / 10)
    wind_speed_10m_max.push(Math.round((10 + Math.sin(t * 0.5) * 6) * 10) / 10)
    relative_humidity_2m_max.push(Math.round(70 + Math.cos(t * 0.8) * 20))
    et0_fao_evapotranspiration.push(Math.round((3.5 + Math.sin(t * 1.1) * 1.5) * 10) / 10)
  }

  return {
    time, temperature_2m_max, temperature_2m_min, precipitation_sum,
    wind_speed_10m_max, relative_humidity_2m_max, et0_fao_evapotranspiration,
  }
}
