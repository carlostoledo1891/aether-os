import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DeckRunner } from './DeckRunner'
import type { DeckManifest } from './types'

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
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  }
})

function SlideA() { return <div>Slide A Content</div> }
function SlideB() { return <div>Slide B Content</div> }
function SlideC() { return <div>Slide C Content</div> }

function DashboardContent() { return <div>Dashboard Content</div> }

function wrap(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('DeckRunner — slides mode', () => {
  const manifest: DeckManifest = {
    id: 'test-slides',
    title: 'Test Deck',
    mode: 'slides',
    slides: [SlideA, SlideB, SlideC],
    exitPath: '/lp',
  }

  it('renders first slide by default', () => {
    wrap(<DeckRunner manifest={manifest} />)
    expect(screen.getByText('Slide A Content')).toBeInTheDocument()
  })

  it('shows correct slide count', () => {
    wrap(<DeckRunner manifest={manifest} />)
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
  })

  it('navigates forward with right arrow key', () => {
    wrap(<DeckRunner manifest={manifest} />)
    act(() => { fireEvent.keyDown(window, { key: 'ArrowRight' }) })
    expect(screen.getByText('Slide B Content')).toBeInTheDocument()
  })

  it('does not go below first slide on left arrow at start', () => {
    wrap(<DeckRunner manifest={manifest} />)
    act(() => { fireEvent.keyDown(window, { key: 'ArrowLeft' }) })
    expect(screen.getByText('Slide A Content')).toBeInTheDocument()
    expect(screen.getByText('01 / 03')).toBeInTheDocument()
  })

  it('renders navigation hint', () => {
    wrap(<DeckRunner manifest={manifest} />)
    expect(screen.getByText('← → navigate · ESC exit')).toBeInTheDocument()
  })

  it('has dot pager buttons matching slide count', () => {
    wrap(<DeckRunner manifest={manifest} />)
    const dots = screen.getAllByRole('button', { name: /Slide \d+/ })
    expect(dots).toHaveLength(3)
  })
})

describe('DeckRunner — dashboard mode', () => {
  const manifest: DeckManifest = {
    id: 'test-dashboard',
    title: 'Test Dashboard',
    mode: 'dashboard',
    children: <DashboardContent />,
  }

  it('renders content without nav chrome', () => {
    wrap(<DeckRunner manifest={manifest} />)
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
    expect(screen.queryByText(/navigate/)).not.toBeInTheDocument()
  })

  it('renders with dark theme by default', () => {
    const { container } = wrap(<DeckRunner manifest={manifest} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.background).toBe('#181724')
  })

  it('renders with light theme when specified', () => {
    const lightManifest: DeckManifest = { ...manifest, theme: 'light' }
    const { container } = wrap(<DeckRunner manifest={lightManifest} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.background.toLowerCase()).toBe('#ffffff')
  })
})

describe('DeckRunner — report mode', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
  })

  const manifest: DeckManifest = {
    id: 'test-report',
    title: 'Test Report',
    subtitle: 'Project X',
    mode: 'report',
    theme: 'light',
    timeRange: true,
    printable: true,
    portal: false,
    children: <div>Report Content</div>,
  }

  it('renders report content', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    expect(screen.getByText('Report Content')).toBeInTheDocument()
  })

  it('renders as dialog', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows report title in toolbar', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    expect(screen.getByText('Test Report')).toBeInTheDocument()
    expect(screen.getByText('Project X')).toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has close button', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    const closeBtn = screen.getByLabelText('Close report')
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has export PDF button when printable', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    expect(screen.getByText('Export PDF')).toBeInTheDocument()
  })

  it('has time range selector', () => {
    wrap(<DeckRunner manifest={manifest} onClose={onClose} />)
    expect(screen.getByText('All Time')).toBeInTheDocument()
    expect(screen.getByText('7 Days')).toBeInTheDocument()
  })
})
