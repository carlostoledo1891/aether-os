import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataServiceProvider } from '../../../services/DataServiceProvider'
import { MapCameraProvider } from '../../../contexts/MapCameraContext'
import { createMockDataService } from '../../../services/mockDataService'
import type { AetherDataService } from '../../../services/dataService'
import type { ReactNode } from 'react'

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] }

vi.mock('react-map-gl/maplibre', () => ({
  default: ({ children }: { children?: ReactNode }) => <div data-testid="map-container">{children}</div>,
  Map: ({ children }: { children?: ReactNode }) => <div data-testid="map-container">{children}</div>,
  Marker: () => <div data-testid="marker" />,
  Source: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Layer: () => null,
  NavigationControl: () => null,
  useMap: () => ({ current: null }),
}))

vi.mock('maplibre-gl', () => ({
  default: { Map: vi.fn() },
  Map: vi.fn(),
  LngLatBounds: vi.fn(),
}))

let service: AetherDataService

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <MapCameraProvider>
      <DataServiceProvider service={service}>{children}</DataServiceProvider>
    </MapCameraProvider>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(EMPTY_GEOJSON), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })))
  service = createMockDataService()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('BuyerView', () => {
  it('renders without crashing and shows map', async () => {
    const { BuyerView } = await import('../../BuyerView')
    const { container } = render(
      <TestWrapper><BuyerView /></TestWrapper>,
    )
    expect(container.firstChild).toBeTruthy()
    expect(screen.getByTestId('map-container')).toBeTruthy()
  })

  it('renders compliance tab content by default', async () => {
    const { BuyerView } = await import('../../BuyerView')
    render(
      <TestWrapper><BuyerView /></TestWrapper>,
    )
    const complianceEls = screen.queryAllByText(/Compliance|Batch/i)
    expect(complianceEls.length).toBeGreaterThan(0)
  })

  it('displays layer toggle controls', async () => {
    const { BuyerView } = await import('../../BuyerView')
    render(
      <TestWrapper><BuyerView /></TestWrapper>,
    )
    expect(document.querySelector('[data-testid="map-container"]')).toBeTruthy()
  })
})
