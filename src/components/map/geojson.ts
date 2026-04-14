import { useEffect, useState } from 'react'

/** GeoJSON allows absent keys; optional typed props use `undefined` when parsing. */
export type FeaturePropertyValue = string | number | boolean | null | undefined
export type FeatureProperties = Record<string, FeaturePropertyValue>

export interface PointGeometry {
  type: 'Point'
  coordinates: [number, number]
}

export interface LineStringGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface PolygonGeometry {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon'
  coordinates: [number, number][][][]
}

export type Geometry =
  | PointGeometry
  | LineStringGeometry
  | PolygonGeometry
  | MultiPolygonGeometry

export interface Feature<
  P extends Record<string, unknown> = FeatureProperties,
  G extends Geometry = Geometry,
> {
  type: 'Feature'
  geometry: G
  properties: P
}

export interface FeatureCollection<F extends Feature<Record<string, unknown>, Geometry> = Feature> {
  type: 'FeatureCollection'
  features: F[]
  metadata?: Record<string, unknown>
}

export function emptyFeatureCollection<F extends Feature<Record<string, unknown>, Geometry> = Feature>(): FeatureCollection<F> {
  return { type: 'FeatureCollection', features: [] }
}

export interface GeoJsonLoadState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  error?: string
  loadedAt?: string
  featureCount?: number
}

interface GeoJsonLoadResult<F extends Feature<Record<string, unknown>, Geometry>> {
  data: FeatureCollection<F> | null
  state: GeoJsonLoadState
}

export function useGeoJsonFeatureCollection<F extends Feature<Record<string, unknown>, Geometry> = Feature>(url: string): GeoJsonLoadResult<F> {
  const [data, setData] = useState<FeatureCollection<F> | null>(null)
  const [state, setState] = useState<GeoJsonLoadState>({ status: 'idle' })

  useEffect(() => {
    if (!url) {
      setData(null)
      setState({ status: 'idle' })
      return
    }

    let alive = true

    async function load() {
      try {
        if (alive) setState({ status: 'loading' })
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.status}`)
        const json = await response.json()
        if (alive) {
          const next = json as FeatureCollection<F>
          setData(next)
          setState({
            status: 'ready',
            loadedAt: typeof next.metadata?.fetched_at === 'string' ? next.metadata.fetched_at : undefined,
            featureCount: next.features.length,
          })
        }
      } catch (error) {
        console.error(error)
        if (alive) {
          setData(null)
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    }

    void load()

    return () => {
      alive = false
    }
  }, [url])

  return { data, state }
}
