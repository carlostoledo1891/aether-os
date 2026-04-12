import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest } from '../../../components/deck/types'
import { lazy } from 'react'

const MANIFEST: DeckManifest = {
  id: 'investors',
  title: 'Investors Deck',
  subtitle: 'Confidential',
  mode: 'slides',
  exitPath: '/',
  slides: [
    lazy(() => import('../../../components/deck/slides/DisclaimerSlide')),
    lazy(() => import('./slides/TeamSlide'))
  ]
}

export default function InvestorsDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
