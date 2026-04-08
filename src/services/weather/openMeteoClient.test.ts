import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchPastDaysDailyPrecip, sumPrecipMm, type DailyPrecipSeries } from './openMeteoClient'

describe('openMeteoClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds forecast URL with capped past_days and required params', async () => {
    const json = {
      daily: {
        time: ['2026-01-01', '2026-01-02'],
        precipitation_sum: [1.2, 0.8],
      },
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => json,
    } as Response)

    await fetchPastDaysDailyPrecip(-21.5, -46.6, 200)

    expect(fetch).toHaveBeenCalledTimes(1)
    const url = String(vi.mocked(fetch).mock.calls[0]![0])
    expect(url).toContain('api.open-meteo.com/v1/forecast')
    expect(url).toContain('latitude=-21.5')
    expect(url).toContain('longitude=-46.6')
    expect(url).toContain('past_days=92')
    expect(url).toContain('daily=precipitation_sum')
    expect(url).toContain('forecast_days=1')
  })

  it('throws on non-OK HTTP', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response)
    await expect(fetchPastDaysDailyPrecip(0, 0, 3)).rejects.toThrow('HTTP 503')
  })

  it('coerces null precip cells to zero', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        daily: {
          time: ['a'],
          precipitation_sum: [null, undefined, NaN, 2.5],
        },
      }),
    } as Response)

    const s = await fetchPastDaysDailyPrecip(1, 2, 2)
    expect(s.precipitation_sum).toEqual([0, 0, 0, 2.5])
  })

  it('sumPrecipMm totals series', () => {
    const s: DailyPrecipSeries = {
      time: ['a', 'b'],
      precipitation_sum: [1, 2.5],
    }
    expect(sumPrecipMm(s)).toBe(3.5)
  })
})
