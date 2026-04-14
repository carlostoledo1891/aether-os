import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamShowcase } from './TeamShowcase'

vi.mock('motion/react', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react')
  const Passthrough = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
    const { animate, initial, exit, transition, whileInView, viewport, custom, ...rest } = props
    void animate; void initial; void exit; void transition; void whileInView; void viewport; void custom
    return React.createElement('div', { ...rest, ref }, typeof children === 'function' ? children : children)
  })
  Passthrough.displayName = 'MotionPassthrough'
  return {
    motion: new Proxy({}, { get: () => Passthrough }),
  }
})

describe('TeamShowcase', () => {
  it('shows Carlos as the only named team member', () => {
    render(<TeamShowcase title="The Team" />)

    expect(screen.getByText('Carlos Toledo')).toBeInTheDocument()
    expect(screen.getByText('Scientific Advisor')).toBeInTheDocument()
    expect(screen.getByText('ESG & Human Rights Advisor')).toBeInTheDocument()
    expect(screen.getByText('Sustainability Strategy Advisor')).toBeInTheDocument()

    expect(screen.queryByText(/Juliano/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Guilherme/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Heber Caponi/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Milca Neves Tavares/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Alexandre Quevedo/i)).not.toBeInTheDocument()
  })
})
