import { describe, expect, it } from 'vitest'
import { createSceneUrl, parseSceneFromHash, resolveExperienceRoute } from './routeModel'
import type { ExperienceManifest } from './types'

describe('resolveExperienceRoute', () => {
  it('maps public paths to per-deck manifests and parses slide hash', () => {
    expect(resolveExperienceRoute('/deck/home', '#home-ai')).toEqual({
      manifestId: 'public-home',
      initialSceneId: 'home-ai',
    })
    expect(resolveExperienceRoute('/deck/business', '')).toEqual({
      manifestId: 'public-business',
      initialSceneId: undefined,
    })
    expect(resolveExperienceRoute('/deck/tech', '#tech-hero')).toEqual({
      manifestId: 'public-tech',
      initialSceneId: 'tech-hero',
    })
    expect(resolveExperienceRoute('/deck/trust', '#trust-nist')).toEqual({
      manifestId: 'public-trust',
      initialSceneId: 'trust-nist',
    })
  })

  it('parses empty hash as undefined', () => {
    expect(parseSceneFromHash('')).toBeUndefined()
    expect(parseSceneFromHash('#')).toBeUndefined()
  })
})

describe('createSceneUrl', () => {
  const horizontalManifest: ExperienceManifest = {
    id: 'public-home',
    title: 'Home',
    theme: 'dark',
    mode: 'horizontalSlides',
    defaultSceneId: 'home-hero',
    scenes: [],
  }

  it('uses pathname hash for horizontal public decks', () => {
    expect(createSceneUrl(horizontalManifest, 'home-ai', '/deck/home')).toBe('/deck/home#home-ai')
  })
})
