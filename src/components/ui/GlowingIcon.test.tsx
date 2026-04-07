import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GlowingIcon } from './GlowingIcon'
import { Activity } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

describe('GlowingIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GlowingIcon icon={Activity} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies violet color by default', () => {
    const { container } = render(<GlowingIcon icon={Activity} />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.color).toBe(W.violet)
  })

  it('applies custom color', () => {
    const { container } = render(<GlowingIcon icon={Activity} color="red" />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.color).toBe(W.red)
  })

  it('applies drop-shadow filter for glow', () => {
    const { container } = render(<GlowingIcon icon={Activity} color="green" />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.filter).toContain('drop-shadow')
  })

  it('accepts custom size', () => {
    const { container } = render(<GlowingIcon icon={Activity} size={24} />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.getAttribute('width')).toBe('24')
    expect(svg.getAttribute('height')).toBe('24')
  })

  it('merges custom style', () => {
    const { container } = render(<GlowingIcon icon={Activity} style={{ marginRight: 8 }} />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.marginRight).toBe('8px')
  })
})
