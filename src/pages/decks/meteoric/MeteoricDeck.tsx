/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest, LazySlide } from '../../../components/deck/types'

export const METEORIC_DECK_SLIDES: LazySlide[] = [
  lazy(() => import('../../../components/deck/slides/DisclaimerSlide').then(m => ({ default: () => <m.default /> }))),
  lazy(() => import('./slides/CoverSlide')),
  lazy(() => import('../../../components/deck/slides/WhiteBoxSlide')),
  lazy(() => import('./slides/BuiltStatsSlide')),
  lazy(() => import('./slides/ThreeViewsSlide')),
  lazy(() => import('./slides/GeoDataSlide')),
  lazy(() => import('./slides/GeologySlide')),
  lazy(() => import('./slides/HydroSlide')),
  lazy(() => import('./slides/TraceabilitySlide')),
  lazy(() => import('./slides/GovernanceSlide')),
  lazy(() => import('./slides/ExecutiveSlide')),
  lazy(() => import('./slides/IntegrationSlide')),
  lazy(() => import('./slides/DataVizSlide')),
  lazy(() => import('./slides/AiToolsSlide')),
  lazy(() => import('./slides/SecurityStatsSlide')),
  lazy(() => import('./slides/ReasonsSlide')),
  lazy(() => import('./slides/StandardSlide')),
  lazy(() => import('./slides/RoadmapSlide')),
  lazy(() => import('./slides/TimelineSlide')),
  lazy(() => import('./slides/TeamSlide')),
  lazy(() => import('./slides/CtaSlide')),
]

export const METEORIC_DECK_MANIFEST: DeckManifest = {
  id: 'meteoric',
  title: 'VeroChain for\nCaldeira Project',
  subtitle: 'Your digital twin is already built.\nNow connect it to live data.',
  mode: 'slides',
  theme: 'dark',
  exitPath: '/',
  slides: METEORIC_DECK_SLIDES,
}

export default function MeteoricDeck() {
  return <DeckRunner manifest={METEORIC_DECK_MANIFEST} />
}
