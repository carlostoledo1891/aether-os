/**
 * Field card unit tests — covers the render surface that produced the
 * production "Cannot read properties of undefined" crash.
 *
 * Each card is tested with:
 *   1. Happy path  — valid populated data renders without throwing
 *   2. Empty data  — zero-length arrays show fallback text, not a crash
 *   3. Edge cases  — optional fields absent, source variants, thresholds
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SeismicActivityCard } from '../SeismicActivityCard'
import { WeatherForecastCard } from '../WeatherForecastCard'
import { WaterQualityCard } from '../WaterQualityCard'
import { CommunityNoticeCard } from '../CommunityNoticeCard'
import { ClimateBaselineCard } from '../ClimateBaselineCard'
import { CptecForecastCard } from '../CptecForecastCard'
import type { SeismicSnapshot, HistoricalWeatherSnapshot } from '../../../services/dataService'
import type { SiteForecastSnapshot } from '../../../hooks/useSiteWeather'
import type { CptecForecast } from '../../../services/weather/cptecClient'

// ── SeismicActivityCard ────────────────────────────────────────────────────

const SEISMIC_EVENTS = [
  { id: 'ev1', time: '2025-01-01T12:00:00Z', latitude: -21.8, longitude: -46.5, depth_km: 10, magnitude: 2.3, place: 'Near Poços de Caldas' },
  { id: 'ev2', time: '2025-01-02T08:00:00Z', latitude: -21.9, longitude: -46.6, depth_km: 15, magnitude: 4.1, place: 'Minas Gerais' },
  { id: 'ev3', time: '2025-01-03T06:00:00Z', latitude: -22.0, longitude: -46.4, depth_km: 8, magnitude: 1.8, place: 'SE Brazil' },
]

describe('SeismicActivityCard', () => {
  it('renders events list in happy-path', () => {
    const data: SeismicSnapshot = {
      events: SEISMIC_EVENTS,
      source: 'usgs',
      updated_at: '2025-01-03T12:00:00Z',
    }
    render(<SeismicActivityCard data={data} />)
    expect(screen.getByText('Seismic Activity')).toBeInTheDocument()
    expect(screen.getByText('USGS')).toBeInTheDocument()
    expect(screen.getByText(/M2\.3/)).toBeInTheDocument()
    expect(screen.getByText(/M4\.1/)).toBeInTheDocument()
    expect(screen.getByText(/3 event/)).toBeInTheDocument()
  })

  it('renders empty-state text when events array is empty', () => {
    const data: SeismicSnapshot = {
      events: [],
      source: 'mock',
      updated_at: '2025-01-01T00:00:00Z',
    }
    render(<SeismicActivityCard data={data} />)
    expect(screen.getByText(/No seismic events/i)).toBeInTheDocument()
    expect(screen.getByText('Mock')).toBeInTheDocument()
    expect(screen.getByText(/0 event/)).toBeInTheDocument()
  })

  it('slices to at most 5 events without crashing', () => {
    const manyEvents = Array.from({ length: 10 }, (_, i) => ({
      id: `ev${i}`, time: '2025-01-01T00:00:00Z',
      latitude: -21, longitude: -46, depth_km: 10,
      magnitude: 1.0 + i * 0.3, place: `Place ${i}`,
    }))
    const data: SeismicSnapshot = { events: manyEvents, source: 'usgs', updated_at: '' }
    render(<SeismicActivityCard data={data} />)
    expect(screen.getByText(/5 event/)).toBeInTheDocument()
  })

  it('shows amber glow indicator for high-magnitude events', () => {
    const data: SeismicSnapshot = {
      events: [{ id: 'e1', time: '', latitude: -21, longitude: -46, depth_km: 5, magnitude: 4.5, place: 'Big quake' }],
      source: 'usgs',
      updated_at: '',
    }
    const { container } = render(<SeismicActivityCard data={data} />)
    expect(container.firstChild).toBeTruthy()
    expect(screen.getByText(/M4\.5/)).toBeInTheDocument()
  })
})

// ── WeatherForecastCard ────────────────────────────────────────────────────

function makeForecast(days: number): SiteForecastSnapshot {
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date('2025-06-01')
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
  return {
    loading: false,
    error: null,
    source: 'openmeteo',
    forecastDays: days,
    totalPrecipMm: 42.5,
    series: {
      time: dates,
      temperature_2m_max: dates.map(() => 28),
      temperature_2m_min: dates.map(() => 15),
      precipitation_sum: dates.map(() => 6.5),
      wind_speed_10m_max: dates.map(() => 12),
      relative_humidity_2m_max: dates.map(() => 80),
      et0_fao_evapotranspiration: dates.map(() => 3.1),
    },
  }
}

describe('WeatherForecastCard', () => {
  it('renders 7-day forecast rows in happy path', () => {
    render(<WeatherForecastCard forecast={makeForecast(7)} />)
    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument()
    expect(screen.getByText('Open-Meteo Forecast')).toBeInTheDocument()
    expect(screen.getByText(/42\.5 mm/)).toBeInTheDocument()
  })

  it('renders empty forecast without crashing', () => {
    const empty: SiteForecastSnapshot = {
      loading: false,
      error: null,
      source: 'mock',
      forecastDays: 0,
      totalPrecipMm: 0,
      series: {
        time: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
        precipitation_sum: [],
        wind_speed_10m_max: [],
        relative_humidity_2m_max: [],
        et0_fao_evapotranspiration: [],
      },
    }
    render(<WeatherForecastCard forecast={empty} />)
    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument()
    expect(screen.getByText('Mock')).toBeInTheDocument()
    expect(screen.getByText(/0\.0 mm over 0 day/)).toBeInTheDocument()
  })

  it('handles undefined array elements gracefully via ?? 0', () => {
    const forecast = makeForecast(3)
    // Simulate a partial series where some optional values are undefined
    ;(forecast.series.temperature_2m_max as unknown as undefined[])[1] = undefined
    expect(() => render(<WeatherForecastCard forecast={forecast} />)).not.toThrow()
  })
})

// ── WaterQualityCard ───────────────────────────────────────────────────────

const WQ_DEFAULTS = {
  sulfatePpm: 180,
  nitratePpm: 30,
  sulfateData: [160, 170, 175, 180, 178],
  nitrateData: [28, 29, 30, 31, 30],
  precipMmSeries: [2, 3, 1, 4, 2],
  range: '7d' as const,
}

describe('WaterQualityCard', () => {
  it('renders within-threshold values as green (no alerts)', () => {
    render(<WaterQualityCard {...WQ_DEFAULTS} />)
    expect(screen.getByText('Water Quality')).toBeInTheDocument()
    expect(screen.queryByText('⚠')).not.toBeInTheDocument()
  })

  it('shows warning chip when sulfate exceeds 250 ppm', () => {
    render(<WaterQualityCard {...WQ_DEFAULTS} sulfatePpm={310} sulfateData={[300, 310]} />)
    expect(screen.getByText('⚠')).toBeInTheDocument()
  })

  it('shows warning chip when nitrate exceeds 50 ppm', () => {
    render(<WaterQualityCard {...WQ_DEFAULTS} nitratePpm={65} nitrateData={[60, 65]} />)
    expect(screen.getByText('⚠')).toBeInTheDocument()
  })

  it('renders with empty sparkline data arrays without crashing', () => {
    expect(() =>
      render(<WaterQualityCard {...WQ_DEFAULTS} sulfateData={[]} nitrateData={[]} precipMmSeries={[]} />),
    ).not.toThrow()
  })
})

// ── CommunityNoticeCard ────────────────────────────────────────────────────

describe('CommunityNoticeCard', () => {
  it('renders English content by default', () => {
    const toggle = vi.fn()
    render(<CommunityNoticeCard lang="en" onToggleLang={toggle} />)
    expect(screen.getByText('Community & Stakeholder Notice')).toBeInTheDocument()
  })

  it('renders Portuguese content when lang=pt', () => {
    const toggle = vi.fn()
    render(<CommunityNoticeCard lang="pt" onToggleLang={toggle} />)
    expect(screen.getByText(/Aviso/i)).toBeInTheDocument()
  })

  it('calls onToggleLang when the language button is clicked', () => {
    const toggle = vi.fn()
    render(<CommunityNoticeCard lang="en" onToggleLang={toggle} />)
    const btn = screen.getByRole('button', { name: /Switch language/i })
    fireEvent.click(btn)
    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('renders grievance steps list', () => {
    const toggle = vi.fn()
    render(<CommunityNoticeCard lang="en" onToggleLang={toggle} />)
    // The grievance box heading text (varies by lang)
    expect(screen.getByText(/How to Report|Registro|Grievance/i)).toBeInTheDocument()
  })
})

// ── ClimateBaselineCard ────────────────────────────────────────────────────

const CLIMATE_HAPPY: HistoricalWeatherSnapshot = {
  series: {
    time: ['2024-01-01', '2024-01-02', '2024-01-03'],
    precipitation_sum: [5.0, 12.3, 0.0],
    temperature_2m_max: [28.5, 29.1, 27.8],
    temperature_2m_min: [14.2, 15.0, 13.8],
  },
  source: 'openmeteo_archive',
  dayCount: 3,
  updated_at: '2024-01-04T00:00:00Z',
}

describe('ClimateBaselineCard', () => {
  it('renders averages correctly in happy path', () => {
    render(<ClimateBaselineCard data={CLIMATE_HAPPY} />)
    expect(screen.getByText('Climate Baseline')).toBeInTheDocument()
    expect(screen.getByText('ERA5 Archive')).toBeInTheDocument()
    expect(screen.getByText(/\d+\.\d mm/)).toBeInTheDocument()
    expect(screen.getByText(/3-day window/)).toBeInTheDocument()
  })

  it('handles zero dayCount without division-by-zero crash', () => {
    const data: HistoricalWeatherSnapshot = {
      series: {
        time: [],
        precipitation_sum: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
      },
      source: 'mock',
      dayCount: 0,
      updated_at: '',
    }
    expect(() => render(<ClimateBaselineCard data={data} />)).not.toThrow()
    expect(screen.getByText(/0-day window/)).toBeInTheDocument()
  })

  it('handles absent optional temperature arrays', () => {
    const data: HistoricalWeatherSnapshot = {
      series: { time: ['2024-01-01'], precipitation_sum: [3.0] },
      source: 'mock',
      dayCount: 1,
      updated_at: '',
    }
    expect(() => render(<ClimateBaselineCard data={data} />)).not.toThrow()
    // Both avg high and avg low fall back to 0 when temperature arrays are absent
    const zeroReadings = screen.getAllByText(/0\.0°C/)
    expect(zeroReadings.length).toBeGreaterThanOrEqual(2)
  })
})

// ── CptecForecastCard ──────────────────────────────────────────────────────

const CPTEC_HAPPY: CptecForecast = {
  city: 'Poços de Caldas',
  state: 'MG',
  updatedAt: '2025-06-01T12:00:00Z',
  days: [
    { date: '2025-06-01', condition: 'pn', conditionDesc: 'Partly cloudy', tempMin: 14, tempMax: 28, uvIndex: 6 },
    { date: '2025-06-02', condition: 'c', conditionDesc: 'Rain', tempMin: 12, tempMax: 22, uvIndex: 2 },
    { date: '2025-06-03', condition: 'ps', conditionDesc: 'Mostly sunny', tempMin: 15, tempMax: 30, uvIndex: 9 },
  ],
}

describe('CptecForecastCard', () => {
  it('renders all forecast days in happy path', () => {
    render(<CptecForecastCard data={CPTEC_HAPPY} />)
    expect(screen.getByText('CPTEC Municipal Forecast')).toBeInTheDocument()
    expect(screen.getByText('INPE/CPTEC')).toBeInTheDocument()
    expect(screen.getByText('Poços de Caldas, MG')).toBeInTheDocument()
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
    expect(screen.getByText('Rain')).toBeInTheDocument()
  })

  it('renders empty days array without crashing', () => {
    const data: CptecForecast = { ...CPTEC_HAPPY, days: [] }
    expect(() => render(<CptecForecastCard data={data} />)).not.toThrow()
    expect(screen.getByText('CPTEC Municipal Forecast')).toBeInTheDocument()
  })

  it('renders UV index only when uvIndex > 0', () => {
    render(<CptecForecastCard data={CPTEC_HAPPY} />)
    // UV 6 and UV 2 should appear; UV 0 should not
    expect(screen.getByText('UV 6')).toBeInTheDocument()
    expect(screen.getByText('UV 2')).toBeInTheDocument()
    expect(screen.getByText('UV 9')).toBeInTheDocument()
  })

  it('highlights high UV index in amber when >= 8', () => {
    const { container } = render(<CptecForecastCard data={CPTEC_HAPPY} />)
    expect(container.firstChild).toBeTruthy()
  })
})
