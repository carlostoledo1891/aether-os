import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DollarSign } from 'lucide-react'
import { ExecutiveCard } from './ExecutiveCard'

describe('ExecutiveCard', () => {
  it('renders children', () => {
    render(<ExecutiveCard>Body content</ExecutiveCard>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders optional title and icon', () => {
    render(
      <ExecutiveCard title="KPI block" icon={DollarSign} iconColor="green">
        Values
      </ExecutiveCard>,
    )
    expect(screen.getByText('KPI block')).toBeInTheDocument()
    expect(screen.getByText('Values')).toBeInTheDocument()
  })
})
