import { lazy } from 'react'
import type { MarketingSlideMap, PublicMarketingSlideSpec } from './publicSlideSpec'

const trustMod = () => import('./trustDeckContent')

const dim: MarketingSlideMap = { enabled: true, preset: 'caldeira-default', dimOpacity: 0.72 }

export const TRUST_SLIDE_SPECS: PublicMarketingSlideSpec[] = [
  {
    id: 'trust-hero',
    label: 'Intro',
    title: 'Trust Center',
    map: { enabled: true, preset: 'caldeira-default', dimOpacity: 0.7 },
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustHeroSlide }))),
  },
  {
    id: 'trust-architecture',
    label: 'Architecture',
    title: 'Security architecture',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustArchitectureSlide }))),
  },
  {
    id: 'trust-compliance',
    label: 'Compliance',
    title: 'Compliance roadmap',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustComplianceSlide }))),
  },
  {
    id: 'trust-nist',
    label: 'NIST',
    title: 'Control family mapping',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustNistSlide }))),
  },
  {
    id: 'trust-sbom',
    label: 'Supply chain',
    title: 'SBOM on every build',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustSbomSlide }))),
  },
  {
    id: 'trust-disclosure',
    label: 'Disclosure',
    title: 'Responsible disclosure',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustDisclosureSlide }))),
  },
  {
    id: 'trust-cta',
    label: 'Next steps',
    title: 'Questions about security?',
    map: dim,
    slide: lazy(() => trustMod().then(x => ({ default: x.TrustCtaSlide }))),
  },
]
