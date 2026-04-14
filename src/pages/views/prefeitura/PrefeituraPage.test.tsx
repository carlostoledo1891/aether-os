import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import type { ReactNode } from 'react'

vi.mock('react-map-gl/maplibre', () => ({
  default: ({ children }: { children?: ReactNode }) => <div data-testid="map-container">{children}</div>,
  Map: ({ children }: { children?: ReactNode }) => <div data-testid="map-container">{children}</div>,
  MapProvider: ({ children }: { children?: ReactNode }) => <>{children}</>,
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

vi.mock('../../../components/map/geojson', async importOriginal => {
  const original = await importOriginal<typeof import('../../../components/map/geojson')>()
  return {
    ...original,
    useGeoJsonFeatureCollection: () => ({
      data: original.emptyFeatureCollection(),
      state: { status: 'ready' as const, featureCount: 0 },
    }),
  }
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('PrefeituraPage', () => {
  it('renders the story-map surface with the current layer API', async () => {
    const { PrefeituraPage } = await import('./PrefeituraPage')

    render(<PrefeituraPage />)

    expect(screen.getByText(/Painel de Impacto/i)).toBeTruthy()
    expect(screen.getAllByText(/Prefeitura Municipal de Poços de Caldas/i).length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('map-container').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Empregos Diretos/i).length).toBeGreaterThan(0)
  })
})
