import { Suspense } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { DeckManifest } from '../../../components/deck/types'
import FoundersDeck from './FoundersDeck'

vi.mock('../../../components/deck/slides/DisclaimerSlide', () => ({
  default: ({ names }: { names?: string }) => <div>{names ? `Hi ${names}` : 'Disclaimer anonymous'}</div>,
}))

vi.mock('../../../components/deck/DeckRunner', () => ({
  DeckRunner: ({ manifest }: { manifest: DeckManifest }) => {
    const FirstSlide = manifest.slides?.[0]
    return (
      <div>
        <div>slide-count:{manifest.slides?.length ?? 0}</div>
        {FirstSlide ? (
          <Suspense fallback={<div>Loading slide</div>}>
            <FirstSlide />
          </Suspense>
        ) : null}
      </div>
    )
  },
}))

describe('FoundersDeck', () => {
  it('removes the personalized greeting and shortened slide sequence stays active', async () => {
    render(<FoundersDeck />)

    expect(screen.getByText('slide-count:20')).toBeInTheDocument()
    expect(await screen.findByText('Disclaimer anonymous')).toBeInTheDocument()
    expect(screen.queryByText(/Hi Guilherme/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Hi Juliano/i)).not.toBeInTheDocument()
  })
})
