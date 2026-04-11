import { lazy } from 'react'
import { DeckRunner } from '../../components/deck/DeckRunner'
import type { DeckManifest, LazySlide } from '../../components/deck/types'

const slides: LazySlide[] = [
  lazy(() => import('./meteoric/slides/CoverSlide')),
  lazy(() => import('../components/deck/slides/WhiteBoxSlide')),
  lazy(() => import('./meteoric/slides/BuiltStatsSlide')),
  lazy(() => import('./meteoric/slides/ThreeViewsSlide')),
  lazy(() => import('./meteoric/slides/GeologySlide')),
  lazy(() => import('./meteoric/slides/ExecutiveSlide')),
  lazy(() => import('./meteoric/slides/GovernanceSlide')),
  lazy(() => import('./meteoric/slides/IntegrationSlide')),
  lazy(() => import('./meteoric/slides/DataVizSlide')),
  lazy(() => import('./meteoric/slides/AiToolsSlide')),
  lazy(() => import('./meteoric/slides/SecurityStatsSlide')),
  lazy(() => import('./meteoric/slides/ReasonsSlide')),
  lazy(() => import('./meteoric/slides/TimelineSlide')),
  lazy(() => import('./meteoric/slides/HydroSlide')),
  lazy(() => import('./meteoric/slides/TraceabilitySlide')),
  lazy(() => import('./meteoric/slides/RoadmapSlide')),
  lazy(() => import('./meteoric/slides/StandardSlide')),
  lazy(() => import('./meteoric/slides/TeamSlide')),
  lazy(() => import('./meteoric/slides/CtaSlide')),
]

const MANIFEST: DeckManifest = {
  id: 'meteoric',
  title: 'Vero for\nCaldeira Project',
  subtitle: 'Your digital twin is already built.\nNow connect it to live data.',
  mode: 'slides',
  exitPath: '/',
  slides,
}

export default function MeteoricDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
