import { lazy } from 'react'
import type { MarketingSlideMap, PublicMarketingSlideSpec } from './publicSlideSpec'

const techMod = () => import('./techDeckContent')

const heroMap: MarketingSlideMap = { enabled: true, preset: 'caldeira-technical', dimOpacity: 0.62 }
const dim: MarketingSlideMap = { enabled: true, preset: 'caldeira-technical', dimOpacity: 0.65 }

export const TECH_SLIDE_SPECS: PublicMarketingSlideSpec[] = [
  {
    id: 'tech-hero',
    label: 'Home',
    title: 'Technical overview',
    map: heroMap,
    slide: lazy(() => techMod().then(x => ({ default: x.TechHeroSlide }))),
  },
  {
    id: 'tech-architecture',
    label: 'Topology',
    title: '3-process architecture',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechArchitectureSlide }))),
  },
  {
    id: 'tech-quality',
    label: 'Quality',
    title: 'CI & service layer',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechQualityServiceSlide }))),
  },
  {
    id: 'tech-ai',
    label: 'AI',
    title: 'AI integration',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechAiIntegrationSlide }))),
  },
  {
    id: 'tech-sensor',
    label: 'Integration',
    title: 'Sensors & digital twin',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechSensorTwinSlide }))),
  },
  {
    id: 'tech-dpp',
    label: 'DPP',
    title: 'DPP & audit chain',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechDppDataSlide }))),
  },
  {
    id: 'tech-closing',
    label: 'Roadmap',
    title: 'Roadmap & CTA',
    map: dim,
    slide: lazy(() => techMod().then(x => ({ default: x.TechClosingSlide }))),
  },
]
