import type { ComponentType, LazyExoticComponent } from 'react'

export type LazyMarketingSlide = LazyExoticComponent<ComponentType<object>>

export interface MarketingSlideMap {
  enabled: boolean
  preset: string
  dimOpacity?: number
}

export interface PublicMarketingSlideSpec {
  id: string
  label: string
  title: string
  map: MarketingSlideMap
  slide: LazyMarketingSlide
}
