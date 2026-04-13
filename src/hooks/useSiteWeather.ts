import { useEffect, useMemo, useState } from 'react'
import { CALDEIRA_VIEW_STATE } from '../components/map/MapBase'
import {
  fetchPastDaysDailyPrecip,
  fetchPastDaysClimate,
  fetchForecast,
  sumPrecipMm,
  type DailyPrecipSeries,
  type DailyClimateSeries,
  type DailyForecastSeries,
} from '../services/weather/openMeteoClient'
import { fetchCptecForecast, type CptecForecast } from '../services/weather/cptecClient'

export type SiteWeatherSource = 'openmeteo' | 'mock'

export interface SiteWeatherSnapshot {
  loading: boolean
  error: string | null
  source: SiteWeatherSource
  /** Total precipitation over requested window (mm) */
  windowPrecipMm: number
  /** Simple normal baseline for site (mm / same window length) — demo heuristic */
  normalBaselineMm: number
  /** Negative = drier than baseline */
  anomalyMm: number
  series: DailyPrecipSeries
}

export interface SiteClimateSnapshot {
  loading: boolean
  error: string | null
  source: SiteWeatherSource
  windowPrecipMm: number
  normalBaselineMm: number
  anomalyMm: number
  series: DailyClimateSeries
  /** Derived KPIs from the full climate series */
  tempMaxAvg: number
  tempMinAvg: number
  humidityAvg: number
  et0Total: number
  windMaxAvg: number
  soilMoistureAvg: number
  waterBalance: number
}

function weatherEnabled(): boolean {
  const v = import.meta.env.VITE_WEATHER_ENABLED as string | undefined
  return v === '1' || v === 'true'
}

function siteCoordinates(): { lat: number; lng: number } {
  const lat = Number(import.meta.env.VITE_WEATHER_LAT ?? CALDEIRA_VIEW_STATE.latitude)
  const lng = Number(import.meta.env.VITE_WEATHER_LNG ?? CALDEIRA_VIEW_STATE.longitude)
  return { lat, lng }
}

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

function mockClimateSeries(lat: number, lng: number, days: number): DailyClimateSeries {
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

const cache = new Map<string, { at: number; data: SiteWeatherSnapshot }>()
const climateCache = new Map<string, { at: number; data: SiteClimateSnapshot }>()
const STALE_MS = 10 * 60 * 1000

function baselineForWindow(days: number): number {
  return 3.2 * days
}

function avg(arr: number[]): number {
  return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
}

function deriveClimateKpis(
  series: DailyClimateSeries,
  windowPrecipMm: number,
  normalBaselineMm: number,
  anomalyMm: number,
  source: SiteWeatherSource,
  loading: boolean,
  error: string | null,
): SiteClimateSnapshot {
  const et0Total = series.et0_fao_evapotranspiration.reduce((a, b) => a + b, 0)
  return {
    loading,
    error,
    source,
    windowPrecipMm,
    normalBaselineMm,
    anomalyMm,
    series,
    tempMaxAvg: avg(series.temperature_2m_max),
    tempMinAvg: avg(series.temperature_2m_min),
    humidityAvg: avg(series.relative_humidity_2m_mean),
    et0Total,
    windMaxAvg: avg(series.wind_speed_10m_max),
    soilMoistureAvg: avg(series.soil_moisture_0_to_7cm),
    waterBalance: windowPrecipMm - et0Total,
  }
}

/** Last `pastDays` of the snapshot series with baseline/anomaly matching that sub-window (same heuristic as the hook). */
export function siteWeatherMetricsForPastDays(
  snapshot: SiteWeatherSnapshot,
  pastDays: number,
): Pick<SiteWeatherSnapshot, 'windowPrecipMm' | 'normalBaselineMm' | 'anomalyMm'> {
  const vals = snapshot.series.precipitation_sum
  const len = vals.length
  if (len === 0) {
    const normalBaselineMm = baselineForWindow(1)
    return { windowPrecipMm: 0, normalBaselineMm, anomalyMm: -normalBaselineMm }
  }
  const n = Math.min(Math.max(1, Math.floor(pastDays)), len)
  const windowPrecipMm = vals.slice(-n).reduce((a, b) => a + b, 0)
  const normalBaselineMm = baselineForWindow(n)
  return { windowPrecipMm, normalBaselineMm, anomalyMm: windowPrecipMm - normalBaselineMm }
}

export function useSiteWeather(pastDays: number, options?: { enabled?: boolean }): SiteWeatherSnapshot {
  const enabled = options?.enabled ?? true
  const days = Math.min(92, Math.max(1, Math.floor(pastDays)))
  const { lat, lng } = useMemo(() => siteCoordinates(), [])
  const apiOn = weatherEnabled()

  const [state, setState] = useState<SiteWeatherSnapshot>(() => {
    const series = mockDailyPrecipSeries(lat, lng, days)
    const windowPrecipMm = sumPrecipMm(series)
    const normalBaselineMm = baselineForWindow(series.time.length)
    return {
      loading: false,
      error: null,
      source: 'mock',
      windowPrecipMm,
      normalBaselineMm,
      anomalyMm: windowPrecipMm - normalBaselineMm,
      series,
    }
  })

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const run = () => {
      const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)},${days}`
      const hit = cache.get(cacheKey)
      if (hit && Date.now() - hit.at < STALE_MS) {
        if (!cancelled) setState(hit.data)
        return
      }

      if (!apiOn) {
        const series = mockDailyPrecipSeries(lat, lng, days)
        const windowPrecipMm = sumPrecipMm(series)
        const normalBaselineMm = baselineForWindow(series.time.length)
        const snap: SiteWeatherSnapshot = {
          loading: false,
          error: null,
          source: 'mock',
          windowPrecipMm,
          normalBaselineMm,
          anomalyMm: windowPrecipMm - normalBaselineMm,
          series,
        }
        cache.set(cacheKey, { at: Date.now(), data: snap })
        if (!cancelled) setState(snap)
        return
      }

      if (!cancelled) setState((s) => ({ ...s, loading: true, error: null }))

      fetchPastDaysDailyPrecip(lat, lng, days)
        .then((series) => {
          if (cancelled) return
          const windowPrecipMm = sumPrecipMm(series)
          const normalBaselineMm = baselineForWindow(series.time.length)
          const snap: SiteWeatherSnapshot = {
            loading: false,
            error: null,
            source: 'openmeteo',
            windowPrecipMm,
            normalBaselineMm,
            anomalyMm: windowPrecipMm - normalBaselineMm,
            series,
          }
          cache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
        .catch(() => {
          if (cancelled) return
          const series = mockDailyPrecipSeries(lat, lng, days)
          const windowPrecipMm = sumPrecipMm(series)
          const normalBaselineMm = baselineForWindow(series.time.length)
          const snap: SiteWeatherSnapshot = {
            loading: false,
            error: 'Open-Meteo unavailable — mock precip',
            source: 'mock',
            windowPrecipMm,
            normalBaselineMm,
            anomalyMm: windowPrecipMm - normalBaselineMm,
            series,
          }
          cache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
    }

    queueMicrotask(run)
    return () => { cancelled = true }
  }, [enabled, apiOn, lat, lng, days])

  return state
}

/** Enriched climate hook — fetches temperature, humidity, ET0, soil moisture, wind */
export function useSiteClimate(pastDays: number, options?: { enabled?: boolean }): SiteClimateSnapshot {
  const enabled = options?.enabled ?? true
  const days = Math.min(92, Math.max(1, Math.floor(pastDays)))
  const { lat, lng } = useMemo(() => siteCoordinates(), [])
  const apiOn = weatherEnabled()

  const [state, setState] = useState<SiteClimateSnapshot>(() => {
    const series = mockClimateSeries(lat, lng, days)
    const windowPrecipMm = sumPrecipMm(series)
    const normalBaselineMm = baselineForWindow(series.time.length)
    return deriveClimateKpis(series, windowPrecipMm, normalBaselineMm, windowPrecipMm - normalBaselineMm, 'mock', false, null)
  })

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const run = () => {
      const cacheKey = `climate:${lat.toFixed(4)},${lng.toFixed(4)},${days}`
      const hit = climateCache.get(cacheKey)
      if (hit && Date.now() - hit.at < STALE_MS) {
        if (!cancelled) setState(hit.data)
        return
      }

      if (!apiOn) {
        const series = mockClimateSeries(lat, lng, days)
        const windowPrecipMm = sumPrecipMm(series)
        const normalBaselineMm = baselineForWindow(series.time.length)
        const snap = deriveClimateKpis(series, windowPrecipMm, normalBaselineMm, windowPrecipMm - normalBaselineMm, 'mock', false, null)
        climateCache.set(cacheKey, { at: Date.now(), data: snap })
        if (!cancelled) setState(snap)
        return
      }

      if (!cancelled) setState(s => ({ ...s, loading: true, error: null }))

      fetchPastDaysClimate(lat, lng, days)
        .then(series => {
          if (cancelled) return
          const windowPrecipMm = sumPrecipMm(series)
          const normalBaselineMm = baselineForWindow(series.time.length)
          const snap = deriveClimateKpis(series, windowPrecipMm, normalBaselineMm, windowPrecipMm - normalBaselineMm, 'openmeteo', false, null)
          climateCache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
        .catch(() => {
          if (cancelled) return
          const series = mockClimateSeries(lat, lng, days)
          const windowPrecipMm = sumPrecipMm(series)
          const normalBaselineMm = baselineForWindow(series.time.length)
          const snap = deriveClimateKpis(series, windowPrecipMm, normalBaselineMm, windowPrecipMm - normalBaselineMm, 'mock', false, 'Open-Meteo unavailable — mock climate')
          climateCache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
    }

    queueMicrotask(run)
    return () => { cancelled = true }
  }, [enabled, apiOn, lat, lng, days])

  return state
}

/* ─── Forecast Hook ──────────────────────────────────────────────────── */

export interface SiteForecastSnapshot {
  loading: boolean
  error: string | null
  source: SiteWeatherSource
  forecastDays: number
  totalPrecipMm: number
  series: DailyForecastSeries
}

function mockForecastSeries(lat: number, lng: number, days: number): DailyForecastSeries {
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

const forecastCache = new Map<string, { at: number; data: SiteForecastSnapshot }>()

export function useSiteForecast(days = 16, options?: { enabled?: boolean }): SiteForecastSnapshot {
  const enabled = options?.enabled ?? true
  const n = Math.min(16, Math.max(1, Math.floor(days)))
  const { lat, lng } = useMemo(() => siteCoordinates(), [])
  const apiOn = weatherEnabled()

  const [state, setState] = useState<SiteForecastSnapshot>(() => {
    const series = mockForecastSeries(lat, lng, n)
    return {
      loading: false, error: null, source: 'mock',
      forecastDays: series.time.length,
      totalPrecipMm: series.precipitation_sum.reduce((a, b) => a + b, 0),
      series,
    }
  })

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const run = () => {
      const cacheKey = `forecast:${lat.toFixed(4)},${lng.toFixed(4)},${n}`
      const hit = forecastCache.get(cacheKey)
      if (hit && Date.now() - hit.at < STALE_MS) {
        if (!cancelled) setState(hit.data)
        return
      }

      if (!apiOn) {
        const series = mockForecastSeries(lat, lng, n)
        const snap: SiteForecastSnapshot = {
          loading: false, error: null, source: 'mock',
          forecastDays: series.time.length,
          totalPrecipMm: series.precipitation_sum.reduce((a, b) => a + b, 0),
          series,
        }
        forecastCache.set(cacheKey, { at: Date.now(), data: snap })
        if (!cancelled) setState(snap)
        return
      }

      if (!cancelled) setState(s => ({ ...s, loading: true, error: null }))

      fetchForecast(lat, lng, n)
        .then(series => {
          if (cancelled) return
          const snap: SiteForecastSnapshot = {
            loading: false, error: null, source: 'openmeteo',
            forecastDays: series.time.length,
            totalPrecipMm: series.precipitation_sum.reduce((a, b) => a + b, 0),
            series,
          }
          forecastCache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
        .catch(() => {
          if (cancelled) return
          const series = mockForecastSeries(lat, lng, n)
          const snap: SiteForecastSnapshot = {
            loading: false, error: 'Open-Meteo unavailable — mock forecast', source: 'mock',
            forecastDays: series.time.length,
            totalPrecipMm: series.precipitation_sum.reduce((a, b) => a + b, 0),
            series,
          }
          forecastCache.set(cacheKey, { at: Date.now(), data: snap })
          setState(snap)
        })
    }

    queueMicrotask(run)
    return () => { cancelled = true }
  }, [enabled, apiOn, lat, lng, n])

  return state
}

/* ── CPTEC / INPE municipal forecast ─────────────────────────────────── */

export interface CptecForecastSnapshot {
  loading: boolean
  error: string | null
  data: CptecForecast | null
}

let _cptecCache: { at: number; data: CptecForecast } | null = null

export function useCptecForecast(): CptecForecastSnapshot {
  const enabled = weatherEnabled()
  const [state, setState] = useState<CptecForecastSnapshot>(() => {
    if (enabled && _cptecCache && Date.now() - _cptecCache.at < STALE_MS) {
      return { loading: false, error: null, data: _cptecCache.data }
    }
    return { loading: false, error: null, data: null }
  })

  useEffect(() => {
    if (!enabled) return
    if (_cptecCache && Date.now() - _cptecCache.at < STALE_MS) return

    let cancelled = false

    const run = () => {
      if (cancelled) return
      setState(s => ({ ...s, loading: true, error: null }))

      fetchCptecForecast()
        .then(data => {
          if (cancelled) return
          _cptecCache = { at: Date.now(), data }
          setState({ loading: false, error: null, data })
        })
        .catch(err => {
          if (cancelled) return
          setState({ loading: false, error: String(err), data: null })
        })
    }

    queueMicrotask(run)
    return () => { cancelled = true }
  }, [enabled])

  return state
}
