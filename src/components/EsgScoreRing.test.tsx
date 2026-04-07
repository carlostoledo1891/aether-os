import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EsgScoreRing } from './EsgScoreRing'
import type { EsgScore } from '../types/telemetry'

const highEsg: EsgScore = { overall: 94, operator: 95, regulator: 91, buyer: 96 }
const midEsg: EsgScore = { overall: 78, operator: 80, regulator: 75, buyer: 79 }
const lowEsg: EsgScore = { overall: 60, operator: 58, regulator: 65, buyer: 57 }

describe('EsgScoreRing', () => {
  it('renders the overall score value', () => {
    render(<EsgScoreRing esg={highEsg} />)
    expect(screen.getByText('94')).toBeInTheDocument()
  })

  it('renders "ESG Score" label in full mode', () => {
    render(<EsgScoreRing esg={highEsg} />)
    expect(screen.getByText('ESG Score')).toBeInTheDocument()
  })

  it('renders compact variant with ESG and Score labels', () => {
    render(<EsgScoreRing esg={highEsg} compact />)
    expect(screen.getByText('ESG')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('renders SVG ring element', () => {
    const { container } = render(<EsgScoreRing esg={midEsg} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
  })

  it('renders different scores correctly', () => {
    const { rerender } = render(<EsgScoreRing esg={lowEsg} />)
    expect(screen.getByText('60')).toBeInTheDocument()

    rerender(<EsgScoreRing esg={midEsg} />)
    expect(screen.getByText('78')).toBeInTheDocument()
  })
})
