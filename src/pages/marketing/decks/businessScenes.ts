import { lazy } from 'react'
import type { MarketingSlideMap, PublicMarketingSlideSpec } from './publicSlideSpec'

const bizMod = () => import('./businessDeckContent')

const heroMap: MarketingSlideMap = { enabled: true, preset: 'caldeira-close', dimOpacity: 0.62 }
const dim: MarketingSlideMap = { enabled: true, preset: 'caldeira-close', dimOpacity: 0.65 }

export const BUSINESS_SLIDE_SPECS: PublicMarketingSlideSpec[] = [
  {
    id: 'biz-hero',
    label: 'Home',
    title: 'Market case',
    map: heroMap,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizHeroSlide }))),
  },
  {
    id: 'biz-problem',
    label: 'Problem',
    title: 'The problem',
    map: dim,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizProblemSlide }))),
  },
  {
    id: 'biz-regulation',
    label: 'Regulation',
    title: 'Regulatory catalyst',
    map: dim,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizRegulationSlide }))),
  },
  {
    id: 'biz-market',
    label: 'Market',
    title: 'TAM / SAM / SOM',
    map: dim,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizMarketObsSlide }))),
  },
  {
    id: 'biz-moat',
    label: 'Moat',
    title: 'Moat & pricing',
    map: dim,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizMoatRevenueSlide }))),
  },
  {
    id: 'biz-closing',
    label: 'Roadmap',
    title: 'Roadmap & CTA',
    map: dim,
    slide: lazy(() => bizMod().then(x => ({ default: x.BizClosingSlide }))),
  },
]
