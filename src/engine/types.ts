import type { GeoLayerKey } from '../data/geo/registry'

export interface ViewManifest {
  id: string
  title: string
  subtitle?: string
  theme?: 'dark' | 'light'
  logo?: string
  sections: SectionConfig[]
}

export type SectionKind =
  | 'hero-map'
  | 'metric-grid'
  | 'card-stack'
  | 'chart-row'
  | 'table'
  | 'timeline'
  | 'custom'

export interface SectionConfig {
  id: string
  kind: SectionKind
  title?: string
  columns?: number
  gap?: number
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  type: string
  dataQuery?: string
  dataPath?: string
  props?: Record<string, unknown>
  geo?: {
    layers: GeoLayerKey[]
    center?: [number, number]
    zoom?: number
    pitch?: number
  }
}
