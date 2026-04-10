import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard } from './MetricCard'

describe('MetricCard', () => {
  it('renders label text', () => {
    render(<MetricCard label="Flow Rate" value={42} />)
    expect(screen.getByText('Flow Rate')).toBeInTheDocument()
  })

  it('renders value', () => {
    render(<MetricCard label="pH" value="4.2" />)
    expect(screen.getByText('4.2')).toBeInTheDocument()
  })

  it('renders unit when provided', () => {
    render(<MetricCard label="Flow" value={7} unit="L/s" />)
    expect(screen.getByText('L/s')).toBeInTheDocument()
  })

  it('renders sublabel when provided', () => {
    render(<MetricCard label="Flow" value={7} sublabel="target: 10" />)
    expect(screen.getByText('target: 10')).toBeInTheDocument()
  })

  it('does not render unit element when not provided', () => {
    const { container } = render(<MetricCard label="pH" value="4.2" />)
    const allSpans = container.querySelectorAll('span')
    const texts = Array.from(allSpans).map((s) => s.textContent)
    expect(texts).not.toContain('undefined')
    expect(texts.every((t) => t !== '')).toBe(true)
  })
})
