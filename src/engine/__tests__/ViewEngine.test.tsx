import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataServiceProvider } from '../../services/DataServiceProvider'
import { createMockDataService } from '../../services/mockDataService'
import { ViewEngine } from '../ViewEngine'
import type { ViewManifest } from '../types'
import type { ReactNode } from 'react'

const service = createMockDataService()

function Wrapper({ children }: { children: ReactNode }) {
  return <DataServiceProvider service={service}>{children}</DataServiceProvider>
}

function renderWithProvider(manifest: ViewManifest) {
  return render(<ViewEngine manifest={manifest} />, { wrapper: Wrapper })
}

describe('ViewEngine', () => {
  it('renders manifest title and subtitle', () => {
    const manifest: ViewManifest = {
      id: 'test-view',
      title: 'Test Dashboard',
      subtitle: 'A test subtitle',
      sections: [],
    }
    renderWithProvider(manifest)
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument()
    expect(screen.getByText('A test subtitle')).toBeInTheDocument()
  })

  it('renders section titles', () => {
    const manifest: ViewManifest = {
      id: 'test-view',
      title: 'Title',
      sections: [
        { id: 'sec-1', kind: 'metric-grid', title: 'Key Metrics', widgets: [] },
        { id: 'sec-2', kind: 'card-stack', title: 'Overview Cards', widgets: [] },
      ],
    }
    renderWithProvider(manifest)
    expect(screen.getByText('Key Metrics')).toBeInTheDocument()
    expect(screen.getByText('Overview Cards')).toBeInTheDocument()
  })

  it('renders MetricCard widgets with label/value', () => {
    const manifest: ViewManifest = {
      id: 'test-view',
      title: 'Title',
      sections: [
        {
          id: 'sec-metrics',
          kind: 'metric-grid',
          widgets: [
            { type: 'metric-card', props: { label: 'Flow Rate', value: '7.3' } },
            { type: 'metric-card', props: { label: 'pH Level', value: '4.2' } },
          ],
        },
      ],
    }
    renderWithProvider(manifest)
    expect(screen.getByText('Flow Rate')).toBeInTheDocument()
    expect(screen.getByText('7.3')).toBeInTheDocument()
    expect(screen.getByText('pH Level')).toBeInTheDocument()
    expect(screen.getByText('4.2')).toBeInTheDocument()
  })

  it('renders placeholder for unknown widget type', () => {
    const manifest: ViewManifest = {
      id: 'test-view',
      title: 'Title',
      sections: [
        {
          id: 'sec-unknown',
          kind: 'metric-grid',
          widgets: [{ type: 'unknown-widget', props: {} }],
        },
      ],
    }
    renderWithProvider(manifest)
    expect(screen.getByText('[unknown-widget]')).toBeInTheDocument()
  })

  it('renders hero-map placeholder', () => {
    const manifest: ViewManifest = {
      id: 'test-view',
      title: 'Title',
      sections: [
        {
          id: 'sec-map',
          kind: 'hero-map',
          widgets: [
            { type: 'map', geo: { layers: ['boundary', 'deposits'] } },
          ],
        },
      ],
    }
    renderWithProvider(manifest)
    expect(screen.getByText(/\[map — boundary, deposits\]/)).toBeInTheDocument()
  })
})
