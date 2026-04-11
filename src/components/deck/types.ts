import type { ComponentType, LazyExoticComponent, ReactNode } from 'react'
import type { TimeRange } from '../reports/reportTheme'

export type DeckMode = 'slides' | 'dashboard' | 'report'

export type DeckTheme = 'dark' | 'light'

export type LazySlide = LazyExoticComponent<ComponentType> | ComponentType

export interface DeckManifest {
  id: string
  title: string
  subtitle?: string
  mode: DeckMode
  theme?: DeckTheme
  exitPath?: string

  slides?: LazySlide[]

  timeRange?: boolean
  printable?: boolean
  portal?: boolean

  children?: ReactNode
  renderContent?: (range: TimeRange) => ReactNode
}
