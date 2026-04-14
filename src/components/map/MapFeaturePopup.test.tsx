import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapFeaturePopup } from './MapFeaturePopup'
import { W } from '../../app/canvas/canvasTheme'

describe('MapFeaturePopup', () => {
  it('renders null when data is null', () => {
    const { container } = render(<MapFeaturePopup data={null} x={0} y={0} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders title and data rows', () => {
    render(
      <MapFeaturePopup
        data={{
          title: 'Test Feature',
          rows: [
            { label: 'Grade', value: '5000 ppm' },
            { label: 'Depth', value: '42 m' },
          ],
        }}
        x={100}
        y={100}
      />,
    )
    expect(screen.getByText('Test Feature')).toBeInTheDocument()
    expect(screen.getByText('5000 ppm')).toBeInTheDocument()
    expect(screen.getByText('42 m')).toBeInTheDocument()
    expect(screen.getByText('Grade')).toBeInTheDocument()
  })

  it('positions the popup near the cursor', () => {
    const { container } = render(
      <MapFeaturePopup
        data={{ title: 'Pin', rows: [{ label: 'Lat', value: '-21.8' }] }}
        x={200}
        y={150}
      />,
    )
    const popup = container.firstChild as HTMLElement
    expect(popup.style.left).toBe('212px')
    expect(popup.style.top).toBe('142px')
  })

  it('keeps popup title on the light text scale even when an accent color is provided', () => {
    render(
      <MapFeaturePopup
        data={{ title: 'Colored', rows: [], accentColor: '#FF0000' }}
        x={0}
        y={0}
      />,
    )
    const title = screen.getByText('Colored')
    expect(title.style.color).toBe(W.text1)
  })
})
