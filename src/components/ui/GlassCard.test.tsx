import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Hello World</GlassCard>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies glassmorphism base styles', () => {
    const { container } = render(<GlassCard animate={false}>Content</GlassCard>)
    const card = container.firstChild as HTMLElement
    expect(card.style.backdropFilter).toBe('blur(var(--w-glass-card-blur, 8px))')
    expect(card.style.borderRadius).toBe('14px')
  })

  it('renders as static div when animate=false', () => {
    const { container } = render(<GlassCard animate={false}>Static</GlassCard>)
    const card = container.firstChild as HTMLElement
    expect(card.tagName).toBe('DIV')
  })

  it('fires onClick handler', () => {
    const handleClick = vi.fn()
    render(<GlassCard animate={false} onClick={handleClick}>Clickable</GlassCard>)
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('applies custom style overrides', () => {
    const { container } = render(
      <GlassCard animate={false} style={{ padding: '20px' }}>Styled</GlassCard>
    )
    const card = container.firstChild as HTMLElement
    expect(card.style.padding).toBe('20px')
  })
})
