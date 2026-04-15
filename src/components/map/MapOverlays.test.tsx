import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { LayerId } from './layerRegistry'
import { MapOverlays } from './MapOverlays'

const renderSpy = vi.fn(({ visibleLayerIds }: { visibleLayerIds: Set<LayerId> }) => (
  <div data-testid="runtime-host">{visibleLayerIds.has('terrain') ? 'terrain-on' : 'terrain-off'}</div>
))

vi.mock('./layerRuntime', () => ({
  resolveLayerRuntime: (layerId: LayerId) => {
    if (layerId === 'terrain' || layerId === 'hillshade') {
      return {
        hostKey: 'terrain',
        interactiveLayerIds: [],
        render: renderSpy,
      }
    }
    return {
      hostKey: layerId,
      interactiveLayerIds: [],
      render: () => <div data-testid={`runtime-${layerId}`}>{layerId}</div>,
    }
  },
}))

describe('MapOverlays', () => {
  it('renders each host key once', () => {
    render(<MapOverlays layers={['terrain', 'hillshade']} />)
    expect(screen.getAllByTestId('runtime-host')).toHaveLength(1)
    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('uses host override when provided by any layer on that host', () => {
    render(
      <MapOverlays
        layers={['terrain', 'hillshade']}
        renderOverrides={{
          hillshade: <div data-testid="terrain-override">override</div>,
        }}
      />,
    )
    expect(screen.getByTestId('terrain-override')).toBeTruthy()
    expect(screen.queryByTestId('runtime-host')).toBeNull()
  })

  it('preserves runtime visibility context when no override exists', () => {
    render(<MapOverlays layers={['terrain']} />)
    expect(screen.getByTestId('runtime-host').textContent).toBe('terrain-on')
  })
})
