import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataGrid } from './DataGrid'

describe('DataGrid', () => {
  it('renders children', () => {
    render(
      <DataGrid>
        <div>Child A</div>
        <div>Child B</div>
      </DataGrid>,
    )
    expect(screen.getByText('Child A')).toBeInTheDocument()
    expect(screen.getByText('Child B')).toBeInTheDocument()
  })

  it('applies correct grid-template-columns for columns=3', () => {
    const { container } = render(
      <DataGrid columns={3}>
        <div>Item</div>
      </DataGrid>,
    )
    const grid = container.firstChild as HTMLElement
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('default columns is 2', () => {
    const { container } = render(
      <DataGrid>
        <div>Item</div>
      </DataGrid>,
    )
    const grid = container.firstChild as HTMLElement
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)')
  })
})
