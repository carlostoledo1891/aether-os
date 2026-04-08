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

export type Geometry = PointGeometry | LineStringGeometry | PolygonGeometry

export interface Feature<
  P extends FeatureProperties = FeatureProperties,
  G extends Geometry = Geometry,
> {
  type: 'Feature'
  geometry: G
  properties: P
}

export interface FeatureCollection<F extends Feature = Feature> {
  type: 'FeatureCollection'
  features: F[]
}

export function emptyFeatureCollection<F extends Feature = Feature>(): FeatureCollection<F> {
  return { type: 'FeatureCollection', features: [] }
}

export function useGeoJsonFeatureCollection<F extends Feature = Feature>(url: string) {
  const [data, setData] = useState<FeatureCollection<F> | null>(null)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.status}`)
        const json = await response.json()
        if (alive) setData(json as FeatureCollection<F>)
      } catch (error) {
        console.error(error)
        if (alive) setData(null)
      }
    }

    void load()

    return () => {
      alive = false
    }
  }, [url])

  return data
}
