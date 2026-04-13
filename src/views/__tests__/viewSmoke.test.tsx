import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { DataServiceProvider } from '../../services/DataServiceProvider'
import { MapCameraProvider } from '../../contexts/MapCameraContext'
import { createMockDataService } from '../../services/mockDataService'
import type { AetherDataService } from '../../services/dataService'
import type { ReactNode } from 'react'

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
  service = createMockDataService()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('ExecutiveView smoke', () => {
  it('renders without crashing', async () => {
    const { ExecutiveView } = await import('../ExecutiveView')
    const { container } = render(
      <TestWrapper><ExecutiveView /></TestWrapper>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})

describe('BuyerView smoke', () => {
  it('renders without crashing', async () => {
    const { BuyerView } = await import('../BuyerView')
    const { container } = render(
      <TestWrapper><BuyerView /></TestWrapper>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})

describe('FieldView smoke', () => {
  it('renders without crashing', async () => {
    const { FieldView } = await import('../FieldView')
    const { container } = render(
      <TestWrapper><FieldView /></TestWrapper>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})
