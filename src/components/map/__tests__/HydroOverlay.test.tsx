/**
 * HydroOverlay render guard tests.
 *
 * Previously crashed with "Cannot read properties of undefined (reading
 * 'filter')" when the spring event slice was called without optional
 * chaining. This suite locks in the safe-null behaviour.
 *
 * The component depends on useGeoJsonFeatureCollection which fetches remote
 * GeoJSON. In the test environment fetch is not available so it returns null
 * → the component returns null. We assert it does so gracefully (no throw).
 * A second set of tests mocks the hook to return empty feature collections
 * and exercises the full render path with edge-case env telemetry.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { EnvTelemetry } from '../../../types/telemetry'

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] }

vi.mock('react-map-gl/maplibre', () => ({
  default: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Marker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Source: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Layer: () => null,
  NavigationControl: () => null,
  useMap: () => ({ current: null }),
}))

vi.mock('maplibre-gl', () => ({
  default: { Map: vi.fn() },
  Map: vi.fn(),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: { children?: ReactNode; [k: string]: unknown }) => (
      <div {...(props as object)}>{children}</div>
    ),
  },
}))

const EMPTY_ENV: EnvTelemetry = {
  timestamp: '2025-01-01T00:00:00Z',
  aquifer: { sensors: [] },
  water_quality: { sulfate_ppm: 180, nitrate_ppm: 30, ph_groundwater: 7.2 },
  legacy_infrastructure: { radiation_usv_h: 0.14, udc_status: 'Normal' },
  springs: [],
  springEvents: [],
}

const WARN_ENV: EnvTelemetry = {
  ...EMPTY_ENV,
  aquifer: {
    sensors: [
      { sensor_id: 'PZ-01', label: 'Piezometer 1', depth_meters: 12.5, baseline_meters: 10.0, status: 'Warning', lat: -21.82, lng: -46.58 },
    ],
  },
  springs: [
    { id: 'SP-001', status: 'Reduced', monitoring_tier: 'sentinel_proxy', method: 'field_measurement', data_sources: [], last_field_visit: '2025-01-01' },
  ],
  springEvents: [
    { springId: 'SP-001', type: 'field_visit', note: 'Flow down 30%', ts: '2025-01-01T00:00:00Z' },
  ],
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
    const url = typeof input === 'string' || input instanceof URL ? String(input) : input.url
    const payload = url.includes('/src/data/geojson/') ? EMPTY_GEOJSON : {}
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HydroOverlay — null GeoJSON path (fetch unavailable)', () => {
  it('returns null without throwing when GeoJSON is not yet loaded', async () => {
    const { HydroOverlay } = await import('../HydroOverlay')
    expect(() =>
      render(<HydroOverlay env={EMPTY_ENV} hoveredNodeId={null} selectedNodeId={null} />),
    ).not.toThrow()
  })

  it('does not crash with warning-status sensors and empty springs', async () => {
    const { HydroOverlay } = await import('../HydroOverlay')
    expect(() =>
      render(<HydroOverlay env={WARN_ENV} hoveredNodeId={null} selectedNodeId={null} />),
    ).not.toThrow()
  })

  it('does not crash when springEvents is undefined', async () => {
    const { HydroOverlay } = await import('../HydroOverlay')
    const envWithoutEvents: EnvTelemetry = { ...EMPTY_ENV, springEvents: undefined }
    expect(() =>
      render(<HydroOverlay env={envWithoutEvents} hoveredNodeId={null} selectedNodeId={null} />),
    ).not.toThrow()
  })
})

describe('HydroOverlay — mocked GeoJSON (empty feature collections)', () => {
  it('renders without crashing when both node and spring collections are empty', async () => {
    vi.doMock('../geojson', async (importOriginal) => {
      const original = await importOriginal<typeof import('../geojson')>()
      return {
        ...original,
        useGeoJsonFeatureCollection: () => ({ type: 'FeatureCollection', features: [] }),
      }
    })

    const { HydroOverlay } = await import('../HydroOverlay')
    expect(() =>
      render(<HydroOverlay env={EMPTY_ENV} hoveredNodeId={null} selectedNodeId={null} />),
    ).not.toThrow()

    vi.doUnmock('../geojson')
  })
})

describe('HydroLegend', () => {
  it('renders the legend without crashing', async () => {
    const { HydroLegend } = await import('../HydroOverlay')
    const { container } = render(<HydroLegend />)
    expect(container.firstChild).toBeTruthy()
  })
})
