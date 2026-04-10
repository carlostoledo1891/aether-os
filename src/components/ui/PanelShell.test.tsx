import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PanelShell } from './PanelShell'

describe('PanelShell', () => {
  it('renders children', () => {
    render(
      <PanelShell>
        <div>Panel Content</div>
      </PanelShell>,
    )
    expect(screen.getByText('Panel Content')).toBeInTheDocument()
  })
})
