import { useEffect, useMemo, useState } from 'react'
import { FIELD_VIEW_STATE } from '../components/map/MapBase'
import {
  fetchPastDaysDailyPrecip,
  sumPrecipMm,
  type DailyPrecipSeries,
} from '../services/weather/openMeteoClient'

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

function weatherEnabled(): boolean {
  const v = import.meta.env.VITE_WEATHER_ENABLED as string | undefined
  return v === '1' || v === 'true'
}

function siteCoordinates(): { lat: number; lng: number } {
  const lat = Number(import.meta.env.VITE_WEATHER_LAT ?? FIELD_VIEW_STATE.latitude)
  const lng = Number(import.meta.env.VITE_WEATHER_LNG ?? FIELD_VIEW_STATE.longitude)
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

const cache = new Map<string, { at: number; data: SiteWeatherSnapshot }>()
const STALE_MS = 10 * 60 * 1000

function baselineForWindow(days: number): number {
  return 3.2 * days
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
