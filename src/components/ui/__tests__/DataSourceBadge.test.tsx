import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataSourceBadge } from '../DataSourceBadge'

describe('DataSourceBadge', () => {
  it('renders kind="api" with label "API"', () => {
    render(<DataSourceBadge kind="api" />)
    expect(screen.getByText('API')).toBeInTheDocument()
  })

  it('renders kind="simulated" with label "Simulated"', () => {
    render(<DataSourceBadge kind="simulated" />)
    expect(screen.getByText('Simulated')).toBeInTheDocument()
  })

  it('renders kind="seed" with label "Seed Data"', () => {
    render(<DataSourceBadge kind="seed" />)
    expect(screen.getByText('Seed Data')).toBeInTheDocument()
  })

  it('renders kind="mock" with label "Mock"', () => {
    render(<DataSourceBadge kind="mock" />)
    expect(screen.getByText('Mock')).toBeInTheDocument()
  })

  it('custom label overrides the default', () => {
    render(<DataSourceBadge kind="api" label="Custom Source" />)
    expect(screen.getByText('Custom Source')).toBeInTheDocument()
    expect(screen.queryByText('API')).toBeNull()
  })
})
