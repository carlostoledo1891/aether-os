import { lazy } from 'react'
import type { MarketingSlideMap, PublicMarketingSlideSpec } from './publicSlideSpec'

const homeMod = () => import('./homeDeckContent')

const heroMap: MarketingSlideMap = { enabled: true, preset: 'caldeira-hero', dimOpacity: 0.42 }
const dim: MarketingSlideMap = { enabled: true, preset: 'caldeira-close', dimOpacity: 0.62 }

export const HOME_SLIDE_SPECS: PublicMarketingSlideSpec[] = [
  {
    id: 'home-hero',
    label: 'Home',
    title: 'Operational intelligence',
    map: heroMap,
    slide: lazy(() => homeMod().then(x => ({ default: x.HomeHeroSlide }))),
  },
  {
    id: 'home-industries',
    label: 'Industries',
    title: 'Multi-industry platform',
    map: dim,
    slide: lazy(() => homeMod().then(x => ({ default: x.HomeIndustriesObsSlide }))),
  },
  {
    id: 'home-platform',
    label: 'Platform',
    title: 'Ingest · visualize · verify',
    map: { enabled: true, preset: 'caldeira-technical', dimOpacity: 0.62 },
    slide: lazy(() => homeMod().then(x => ({ default: x.HomePlatformPipelineSlide }))),
  },
  {
    id: 'home-architecture',
    label: 'Architecture',
    title: 'Production-grade stack',
    map: dim,
    slide: lazy(() => homeMod().then(x => ({ default: x.HomeArchitectureSlide }))),
  },
  {
    id: 'home-ai',
    label: 'AI',
    title: 'AI agent',
    map: dim,
    slide: lazy(() => homeMod().then(x => ({ default: x.HomeAiSlide }))),
  },
  {
    id: 'home-closing',
    label: 'Market & roadmap',
    title: 'Market, reports, roadmap, team',
    map: dim,
    slide: lazy(() => homeMod().then(x => ({ default: x.HomeClosingSlide }))),
  },
]
