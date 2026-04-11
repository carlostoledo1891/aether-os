import { W } from '../../../app/canvas/canvasTheme'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest } from '../../../components/deck/types'
import { lazy } from 'react'

const MANIFEST: DeckManifest = {
  id: 'investors',
  title: 'Investors Deck',
  subtitle: 'Confidential',
}

const slides = [
  lazy(() => Promise.resolve({ default: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: W.text1 }}>
      <h2>Investors Deck Coming Soon</h2>
    </div>
  ) }))
]

export default function InvestorsDeck() {
  return <DeckRunner manifest={MANIFEST} slides={slides} />
}
