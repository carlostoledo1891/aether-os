import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricDisplay } from './MetricDisplay'

describe('MetricDisplay', () => {
  it('renders value and label', () => {
    render(<MetricDisplay value={42} label="Flow Rate" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Flow Rate')).toBeInTheDocument()
  })

  it('renders unit text', () => {
    render(<MetricDisplay value={7.3} unit="L/s" />)
    expect(screen.getByText('L/s')).toBeInTheDocument()
  })

  it('renders sublabel', () => {
    render(<MetricDisplay value={12} sublabel="target: 15" />)
    expect(screen.getByText('target: 15')).toBeInTheDocument()
  })

  it('formats numeric value to specified decimals', () => {
    render(<MetricDisplay value={3.14159} decimals={2} />)
    expect(screen.getByText('3.14')).toBeInTheDocument()
  })

  it('renders string values as-is', () => {
    render(<MetricDisplay value="ACTIVE" />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('applies sm size font', () => {
    const { container } = render(<MetricDisplay value={10} size="sm" />)
    const valueEl = container.querySelector('span[style*="font-size"]') as HTMLElement
    expect(valueEl).toBeTruthy()
  })

  it('does not render label or sublabel when not provided', () => {
    const { container } = render(<MetricDisplay value={99} />)
    const text = container.textContent
    expect(text).toBe('99')
  })
})
