/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react'
import type { DeckManifest, LazySlide } from '../components/deck/types'
import { FOUNDERS_DECK_SLIDES } from '../pages/decks/founders/FoundersDeck'
import { METEORIC_DECK_SLIDES } from '../pages/decks/meteoric/MeteoricDeck'
import { TECHNICAL_APPENDIX } from '../config/demoExperience'
import { BUSINESS_SLIDE_SPECS } from '../pages/marketing/decks/businessScenes'
import { HOME_SLIDE_SPECS } from '../pages/marketing/decks/homeScenes'
import type { MarketingSlideMap, PublicMarketingSlideSpec } from '../pages/marketing/decks/publicSlideSpec'
import { TECH_SLIDE_SPECS } from '../pages/marketing/decks/techScenes'
import { TRUST_SLIDE_SPECS } from '../pages/marketing/decks/trustScenes'
import { resolveExperienceRoute } from './routeModel'
import type { ExperienceManifest, ExperienceMapPresetId, SceneMapConfig } from './types'
import DrillTestsReport from '../components/reports/DrillTestsReport'

export interface PresentationShellBindings {
  highlightFeatureId: string | null
  openAppendix: () => void
}

export function resolvePresentationManifest(
  pathname: string,
  hash: string,
  bindings: PresentationShellBindings,
) {
  const route = resolveExperienceRoute(pathname, hash)
  if (!route) return null

  const manifest = getManifestById(route.manifestId, bindings)
  return {
    manifest,
    initialSceneId: route.initialSceneId,
  }
}

export function getAppendixManifest(): DeckManifest {
  return {
    id: TECHNICAL_APPENDIX.id,
    title: TECHNICAL_APPENDIX.title,
    subtitle: TECHNICAL_APPENDIX.subtitle,
    mode: 'report',
    theme: 'light',
    timeRange: true,
    printable: true,
    portal: true,
    renderContent: range => <DrillTestsReport range={range} />,
  }
}

function getManifestById(id: string, _bindings: PresentationShellBindings): ExperienceManifest {
  switch (id) {
    case 'deck-founders':
      // Founders deck has no live map anywhere — all slides stay map-less.
      return createDeckManifest('deck-founders', 'Founders Deck', FOUNDERS_DECK_SLIDES, {
        mapSlideIndices: [],
      })
    case 'deck-meteoric':
      // Meteoric deck: map only on slides 7, 8, 9 (1-indexed) =
      // GeologySlide, HydroSlide, TraceabilitySlide at zero-based indices 6, 7, 8.
      return createDeckManifest('deck-meteoric', 'Meteoric Deck', METEORIC_DECK_SLIDES, {
        mapSlideIndices: [6, 7, 8],
      })
    case 'public-home':
      return createPublicMarketingManifestFromSpecs('public-home', 'VeroChain', HOME_SLIDE_SPECS)
    case 'public-business':
      return createPublicMarketingManifestFromSpecs('public-business', 'Business case', BUSINESS_SLIDE_SPECS)
    case 'public-tech':
      return createPublicMarketingManifestFromSpecs('public-tech', 'Technical deep dive', TECH_SLIDE_SPECS)
    case 'public-trust':
      return createPublicMarketingManifestFromSpecs('public-trust', 'Trust Center', TRUST_SLIDE_SPECS)
    default:
      throw new Error(`Unknown presentation manifest: ${id}`)
  }
}

interface DeckManifestOptions {
  /**
   * Zero-based slide indices that should mount a live map underneath the slide
   * content. All other slides render with a plain dark background.
   */
  mapSlideIndices: number[]
}

function createDeckManifest(
  id: string,
  title: string,
  slides: LazySlide[],
  { mapSlideIndices }: DeckManifestOptions,
): ExperienceManifest {
  const mapSlides = new Set(mapSlideIndices)
  return {
    id,
    title,
    theme: 'dark',
    mode: 'horizontalSlides',
    defaultSceneId: 'scene-1',
    chrome: {
      showSceneTabs: false,
      showProgress: true,
    },
    scenes: slides.map((slide, index) => {
      const wantsMap = mapSlides.has(index)
      return {
        id: `scene-${index + 1}`,
        label: `Slide ${index + 1}`,
        title: `Slide ${index + 1}`,
        map: wantsMap
          ? {
              enabled: true,
              preset: 'caldeira-technical',
              dimOpacity: 0.58,
            }
          : { enabled: false },
        surface: { mode: 'transparent' },
        render: () => <SlideScene slide={slide} centered={!wantsMap} />,
      }
    }),
  }
}

function createPublicMarketingManifestFromSpecs(
  id: string,
  title: string,
  slideSpecs: PublicMarketingSlideSpec[],
): ExperienceManifest {
  const defaultSceneId = slideSpecs[0]?.id ?? 'slide-1'
  return {
    id,
    title,
    theme: 'dark',
    mode: 'horizontalSlides',
    defaultSceneId,
    chrome: {
      showSceneTabs: false,
      showProgress: true,
      showPublicDeckNav: true,
    },
    scenes: slideSpecs.map(spec => ({
      id: spec.id,
      label: spec.label,
      title: spec.title,
      map: toSceneMapConfig(spec.map),
      surface: { mode: 'transparent' },
      render: () => <SlideScene slide={spec.slide} />,
    })),
  }
}

function toSceneMapConfig(map: MarketingSlideMap): SceneMapConfig {
  return {
    enabled: map.enabled,
    preset: map.preset as ExperienceMapPresetId,
    dimOpacity: map.dimOpacity,
  }
}

function SlideScene({
  slide: SlideComponent,
  centered = false,
}: {
  slide: LazySlide
  /**
   * When true, the slide content is flex-centered horizontally and vertically
   * inside a padded container with `textAlign: center`. Matches the layout
   * provided by DeckRunner, which Founders/Meteoric slides were written for.
   * Marketing decks default to `false` and keep their own layout.
   */
  centered?: boolean
}) {
  const style: React.CSSProperties = centered
    ? {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 56px',
        overflow: 'auto',
        boxSizing: 'border-box',
      }
    : { width: '100%', height: '100%' }
  return (
    <Suspense fallback={null}>
      <div style={style}>
        <SlideComponent />
      </div>
    </Suspense>
  )
}
