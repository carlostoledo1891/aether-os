import { lazy } from 'react'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest, LazySlide } from '../../../components/deck/types'

/* ── Lazy Slide Imports ───────────────────────────────────── */

const DisclaimerSlide  = lazy(() => import('../../../components/deck/slides/DisclaimerSlide').then(m => ({ default: () => <m.default /> })))
const CoverSlide       = lazy(() => import('./slides/BookendSlides').then(m => ({ default: m.CoverSlide })))
const ProblemSlide     = lazy(() => import('./slides/ProblemSlide'))
const WhiteBoxSlide    = lazy(() => import('../../../components/deck/slides/WhiteBoxSlide'))
const MarketSlide      = lazy(() => import('./slides/MarketSlide'))
const RegulatorySlide  = lazy(() => import('./slides/RegulatorySlide'))
const PlatformSlide    = lazy(() => import('./slides/PlatformSlide'))
const CaldeiraSlide    = lazy(() => import('./slides/CaldeiraSlide'))
const ArchitectureSlide = lazy(() => import('./slides/ArchitectureSlide'))
const CodeQualitySlide = lazy(() => import('./slides/CodeQualitySlide'))
const DataServiceSlide = lazy(() => import('./slides/DataServiceSlide'))
const AiAgentSlide     = lazy(() => import('./slides/AiAgentSlide'))
const LapocSlide       = lazy(() => import('./slides/LapocSlide'))
const ReportsSlide     = lazy(() => import('./slides/ReportsSlide'))
const MoatSlide        = lazy(() => import('./slides/MoatSlide'))
const RevenueSlide     = lazy(() => import('./slides/FinancialsSlides').then(m => ({ default: m.RevenueSlide })))
const TeamSlide        = lazy(() => import('./slides/TeamSlide'))
const RoadmapSlide     = lazy(() => import('./slides/RoadmapSlides').then(m => ({ default: m.RoadmapSlide })))
const TimelineSlide    = lazy(() => import('./slides/RoadmapSlides').then(m => ({ default: m.TimelineSlide })))
const CloseSlide       = lazy(() => import('./slides/BookendSlides').then(m => ({ default: m.CloseSlide })))

/* ── Manifest ─────────────────────────────────────────────── */

const slides: LazySlide[] = [
  DisclaimerSlide,
  CoverSlide,
  ProblemSlide,
  WhiteBoxSlide,
  MarketSlide,
  RegulatorySlide,
  PlatformSlide,
  ArchitectureSlide,
  CodeQualitySlide,
  DataServiceSlide,
  AiAgentSlide,
  LapocSlide,
  ReportsSlide,
  MoatSlide,
  RevenueSlide,
  TeamSlide,
  CaldeiraSlide,
  RoadmapSlide,
  TimelineSlide,
  CloseSlide,
]

const MANIFEST: DeckManifest = {
  id: 'founders',
  title: 'VeroChain — Founders Deck',
  mode: 'slides',
  exitPath: '/',
  slides,
}

/* ── Component ────────────────────────────────────────────── */

export default function FoundersDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
