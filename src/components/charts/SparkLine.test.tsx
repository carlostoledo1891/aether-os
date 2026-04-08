import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SparkLine } from './SparkLine'

describe('SparkLine', () => {
  it('renders dual-axis hint when secondaryData is set', () => {
    render(
      <SparkLine
        data={[1, 2, 3, 4]}
        secondaryData={[0.5, 1, 1.5, 2]}
        height={40}
        rangeLabel="4 pts"
      />,
    )
    expect(screen.getByText('dashed · precip')).toBeInTheDocument()
    expect(screen.getByText('4 pts')).toBeInTheDocument()
  })
})
