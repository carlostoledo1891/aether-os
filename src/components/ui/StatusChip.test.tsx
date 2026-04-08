import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusChip } from './StatusChip'

describe('StatusChip', () => {
  it('renders the label text', () => {
    render(<StatusChip label="ACTIVE" />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('applies green variant styling', () => {
    const { container } = render(<StatusChip label="OK" variant="green" />)
    const chip = container.firstChild as HTMLElement
    expect(chip.style.color).toContain('22D68A')
  })

  it('renders dot when dot prop is true', () => {
    const { container } = render(<StatusChip label="LIVE" variant="green" dot />)
    const spans = container.querySelectorAll('span')
    // Should have at least the outer span + dot span + text
    expect(spans.length).toBeGreaterThanOrEqual(2)
  })

  it('does not render dot by default', () => {
    const { container } = render(<StatusChip label="TEST" />)
    const spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
  })

  it('applies md size padding', () => {
    const { container } = render(<StatusChip label="MD" size="md" />)
    const chip = container.firstChild as HTMLElement
    expect(chip.style.padding).toBe('3px 10px')
  })
})
