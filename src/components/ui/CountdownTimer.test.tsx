import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountdownTimer } from './CountdownTimer'

describe('CountdownTimer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders label text', () => {
    const future = new Date(Date.now() + 86_400_000 * 3).toISOString()
    render(<CountdownTimer targetDate={future} label="Until Audit" />)
    expect(screen.getByText('Until Audit')).toBeInTheDocument()
  })

  it('renders days, hours, minutes segments', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-01T00:00:00Z'))

    render(<CountdownTimer targetDate="2026-04-04T12:30:00Z" label="Test" />)
    expect(screen.getByText('d')).toBeInTheDocument()
    expect(screen.getByText('h')).toBeInTheDocument()
    expect(screen.getByText('m')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument() // 3 days
    expect(screen.getByText('12')).toBeInTheDocument() // 12 hours
    expect(screen.getByText('30')).toBeInTheDocument() // 30 min
  })

  it('shows 00 for all when targetDate is in the past', () => {
    render(<CountdownTimer targetDate="2020-01-01T00:00:00Z" label="Expired" />)
    const zeros = screen.getAllByText('00')
    expect(zeros.length).toBe(3)
  })
})
