import { lazy, useEffect } from 'react'
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest, LazySlide } from '../../../components/deck/types'
import { MARKETING_COPY } from '../../../config/marketing'

/* ── Lazy Slide Imports ───────────────────────────────────── */

const DisclaimerSlide  = lazy(() => import('../../../components/deck/slides/DisclaimerSlide').then(m => ({ default: () => <m.default names="Guilherme & Juliano" /> })))
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
const DigitalTwinSlide = lazy(() => import('./slides/DigitalTwinSlide'))
const LapocSlide       = lazy(() => import('./slides/LapocSlide'))
const ReportsSlide     = lazy(() => import('./slides/ReportsSlide'))
const PersonasSlide    = lazy(() => import('./slides/PersonasSlide'))
const MoatSlide        = lazy(() => import('./slides/MoatSlide'))
const RevenueSlide     = lazy(() => import('./slides/FinancialsSlides').then(m => ({ default: m.RevenueSlide })))
const ValuationSlide   = lazy(() => import('./slides/FinancialsSlides').then(m => ({ default: m.ValuationSlide })))
const RiskSlide        = lazy(() => import('./slides/RiskSlide'))
const ExitSlide        = lazy(() => import('./slides/ExitSlide'))
const TeamSlide        = lazy(() => import('./slides/TeamSlide'))
const WhyYouSlide      = lazy(() => import('./slides/WhyYouSlide'))
const WhyINeedYouSlide = lazy(() => import('./slides/WhyINeedYouSlide'))
const AskSlide         = lazy(() => import('./slides/AskSlide'))
const MeteorPlaySlide  = lazy(() => import('./slides/MeteorSlides').then(m => ({ default: m.MeteorPlaySlide })))
const WhyBeforeMeteorSlide = lazy(() => import('./slides/MeteorSlides').then(m => ({ default: m.WhyBeforeMeteorSlide })))
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
  CaldeiraSlide,
  ArchitectureSlide,
  CodeQualitySlide,
  DataServiceSlide,
  AiAgentSlide,
  DigitalTwinSlide,
  LapocSlide,
  ReportsSlide,
  PersonasSlide,
  MoatSlide,
  RevenueSlide,
  ValuationSlide,
  RiskSlide,
  ExitSlide,
  TeamSlide,
  WhyYouSlide,
  WhyINeedYouSlide,
  AskSlide,
  MeteorPlaySlide,
  WhyBeforeMeteorSlide,
  RoadmapSlide,
  TimelineSlide,
  CloseSlide,
]

const MANIFEST: DeckManifest = {
  id: 'founders',
  title: 'Vero — Founders Deck',
  mode: 'slides',
  exitPath: '/',
  slides,
}

/* ── Component ────────────────────────────────────────────── */

export default function FoundersDeck() {
  useEffect(() => {
    if (import.meta.env.DEV || window.location.pathname.startsWith('/deck/founders') || window.location.pathname === '/founders-deck') {
      console.log(
        '%c\u{1F44B} Hey Juliano %c\n\n' +
        'You opened DevTools. We expected that.\n\n' +
        `${MARKETING_COPY.testCount} tests \u00B7 0 errors \u00B7 TypeScript strict\n` +
        '107 design tokens \u00B7 MaybeAsync<T> \u00B7 3 processes\n\n' +
        'The codebase is ready for a second pair of hands.\n' +
        'AGENT.md bootstraps any AI agent in seconds.\n\n' +
        '%cgit clone \u2192 npm i \u2192 npm run dev:all%c\n',
        'font-size:18px;font-weight:bold;color:#7C5CFC;',
        'font-size:12px;color:#ECECF8;',
        'font-size:11px;font-family:monospace;color:#00D4C8;background:#0D0D1C;padding:4px 8px;border-radius:4px;',
        ''
      )
    }
  }, [])

  return <DeckRunner manifest={MANIFEST} />
}
