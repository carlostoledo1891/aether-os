import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionBlock } from './SectionBlock'

describe('SectionBlock', () => {
  it('renders label text', () => {
    render(
      <SectionBlock label="Test Section">
        <div>Content</div>
      </SectionBlock>,
    )
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <SectionBlock label="Label">
        <div>Child Content</div>
      </SectionBlock>,
    )
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('renders rightSlot when provided', () => {
    render(
      <SectionBlock label="Label" rightSlot={<span>Right Side</span>}>
        <div>Content</div>
      </SectionBlock>,
    )
    expect(screen.getByText('Right Side')).toBeInTheDocument()
  })
})
