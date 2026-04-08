import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSiteWeather, mockDailyPrecipSeries, siteWeatherMetricsForPastDays } from './useSiteWeather'
import { sumPrecipMm } from '../services/weather/openMeteoClient'

describe('mockDailyPrecipSeries', () => {
  it('returns aligned time and precip arrays for requested days', () => {
    const s = mockDailyPrecipSeries(-21.815, -46.585, 7)
    expect(s.time).toHaveLength(7)
    expect(s.precipitation_sum).toHaveLength(7)
    expect(sumPrecipMm(s)).toBeGreaterThan(0)
  })
})

describe('siteWeatherMetricsForPastDays', () => {
  it('sums the trailing N days and matches full window when N equals series length', () => {
    const series = mockDailyPrecipSeries(0, 0, 10)
    const full = sumPrecipMm(series)
    const snap = {
      loading: false,
      error: null,
      source: 'mock' as const,
      windowPrecipMm: full,
      normalBaselineMm: 3.2 * 10,
      anomalyMm: full - 3.2 * 10,
      series,
    }
    const last7 = siteWeatherMetricsForPastDays(snap, 7)
    const expected7 = series.precipitation_sum.slice(-7).reduce((a, b) => a + b, 0)
    expect(last7.windowPrecipMm).toBeCloseTo(expected7, 5)
    const fullAgain = siteWeatherMetricsForPastDays(snap, 10)
    expect(fullAgain.windowPrecipMm).toBeCloseTo(full, 5)
  })
})

describe('useSiteWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('stays on mock path when disabled (no fetch)', () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const { result } = renderHook(() => useSiteWeather(7, { enabled: false }))

    expect(result.current.source).toBe('mock')
    expect(result.current.loading).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('resolves to mock when weather API is off', async () => {
    vi.stubEnv('VITE_WEATHER_ENABLED', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const { result } = renderHook(() => useSiteWeather(5, { enabled: true }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.source).toBe('mock')
    expect(result.current.error).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
