import type { ReactNode } from 'react'
import type { ThemeId } from '../theme/themeTokens'

export type ExperienceRenderMode = 'horizontalSlides'

export type SceneBackgroundMode = 'transparent' | 'glass' | 'solid'

export type ExperienceMapPresetId =
  | 'caldeira-default'
  | 'caldeira-close'
  | 'caldeira-hero'
  | 'caldeira-technical'

export interface SceneMapConfig {
  enabled: boolean
  preset?: ExperienceMapPresetId
  dimOpacity?: number
  scrim?: string
  interactive?: boolean
}

export interface SceneSurfaceConfig {
  mode?: SceneBackgroundMode
  color?: string
  border?: string
  blur?: number
}

export interface ExperienceScene {
  id: string
  label: string
  title?: string
  description?: string
  routePath?: string
  map?: SceneMapConfig
  surface?: SceneSurfaceConfig
  render: () => ReactNode
}

export interface ExperienceChromeConfig {
  showSceneTabs?: boolean
  showProgress?: boolean
  showAppUtilities?: boolean
  showDataModeBanner?: boolean
  /** Four-route pill nav (Home / Business / Tech / Trust); scenes are in-deck slides. */
  showPublicDeckNav?: boolean
}

export interface ExperienceManifest {
  id: string
  title: string
  subtitle?: string
  theme: ThemeId
  mode: ExperienceRenderMode
  defaultSceneId: string
  scenes: ExperienceScene[]
  chrome?: ExperienceChromeConfig
}

export interface PresentationRuntimeState {
  manifest: ExperienceManifest
  activeScene: ExperienceScene
  activeSceneIndex: number
  isFirstScene: boolean
  isLastScene: boolean
  goToScene: (sceneId: string) => void
  goToIndex: (index: number) => void
  nextScene: () => void
  previousScene: () => void
}
