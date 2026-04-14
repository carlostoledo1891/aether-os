/**
 * MapStyleController — manages map style URLs, localStorage persistence,
 * and per-style paint overrides (water highlight, dark-mode background).
 *
 * Split from MapBase.tsx to reduce its edit-blast radius: style selection
 * logic is the most frequently touched area of that file.
 */
import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'
import { W } from '../../app/canvas/canvasTheme'

// ── Style catalogue ────────────────────────────────────────────────────────

export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string
export const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')

export type MapStyleId = 'satellite' | 'operations' | 'topo'

export const MAP_STYLE_DEFS: { id: MapStyleId; label: string; url: string }[] = HAS_TILER
  ? [
      { id: 'satellite',  label: 'Satellite',   url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
      { id: 'operations', label: 'Operations',  url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}` },
      { id: 'topo',       label: 'Topography',  url: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_KEY}` },
    ]
  : [
      { id: 'operations', label: 'Dark', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    ]

export const STORAGE_KEY = 'vero-map-style'

const LEGACY_STYLE_MAP: Record<string, MapStyleId> = {
  dataviz: 'operations', streets: 'operations', hybrid: 'satellite',
}

export function getInitialStyle(): MapStyleId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      if (MAP_STYLE_DEFS.some(d => d.id === saved)) return saved as MapStyleId
      const mapped = LEGACY_STYLE_MAP[saved]
      if (mapped) return mapped
    }
  } catch { /* SSR / private browsing */ }
  return MAP_STYLE_DEFS[0].id
}

// ── Water layer paint helpers ──────────────────────────────────────────────

const WATER_LAYER_IDS = ['water', 'water_shadow'] as const
const WATERWAY_LAYER_IDS = ['waterway'] as const
const WATER_LABEL_IDS = ['waterway_label', 'watername_lake', 'watername_lake_line'] as const

const CYAN_LINE_WIDTH = [
  'interpolate', ['linear'], ['zoom'],
  6, 0.5, 10, 0.8, 13, 1.5, 16, 2.5,
]

// ── StyleController component ──────────────────────────────────────────────

export function StyleController({
  maptilerKey, mapId, highlightWater, activeStyleId,
}: {
  maptilerKey: string; mapId: string; highlightWater: boolean; activeStyleId: MapStyleId
}) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const originals = useRef<globalThis.Map<string, unknown>>(new globalThis.Map())

  useEffect(() => {
    if (!mapRef) return
    const map = (mapRef as { getMap: () => maplibregl.Map }).getMap()

    const run = () => {
      const has = (layerId: string) => !!map.getLayer(layerId)

      const hasTiler = maptilerKey && maptilerKey !== 'your_maptiler_key_here'
      if (hasTiler) {
        if (!map.getSource('terrain-dem')) {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${maptilerKey}`,
            tileSize: 256,
          } as never)
        }
        // Terrain enable/disable is owned by TerrainOverlay — no setTerrain here
      }

      const isDark = activeStyleId === 'operations'

      if (isDark) {
        if (has('background')) {
          try { map.setPaintProperty('background', 'background-color', W.canvas) } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
        }
        for (const id of WATER_LAYER_IDS) {
          if (has(id)) {
            try { map.setPaintProperty(id, 'fill-color', W.mapWaterFill) } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
          }
        }
      }
      const capture = (layerId: string, prop: string) => {
        if (!has(layerId)) return
        const k = `${layerId}::${prop}`
        if (!originals.current.has(k)) {
          try { originals.current.set(k, map.getPaintProperty(layerId, prop)) } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
        }
      }
      const captureZoom = (layerId: string) => {
        if (!has(layerId)) return
        const k = `z::${layerId}`
        if (!originals.current.has(k)) {
          const l = map.getLayer(layerId) as { minzoom?: number; maxzoom?: number } | undefined
          if (l) originals.current.set(k, { min: l.minzoom ?? 0, max: l.maxzoom ?? 24 })
        }
      }
      const set = (layerId: string, prop: string, val: unknown) => {
        if (!has(layerId)) return
        try { map.setPaintProperty(layerId, prop, val) } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
      }
      const setZoom = (layerId: string, min: number, max: number) => {
        if (!has(layerId)) return
        try { map.setLayerZoomRange(layerId, min, max) } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
      }

      if (highlightWater) {
        for (const id of WATER_LAYER_IDS) {
          capture(id, 'fill-color')
          set(id, 'fill-color', 'rgba(0,212,200,0.18)')
        }
        for (const id of WATERWAY_LAYER_IDS) {
          capture(id, 'line-color'); capture(id, 'line-opacity'); capture(id, 'line-width'); captureZoom(id)
          set(id, 'line-color', 'rgb(0,212,200)'); set(id, 'line-opacity', 0.65); set(id, 'line-width', CYAN_LINE_WIDTH); setZoom(id, 0, 24)
        }
        for (const id of WATER_LABEL_IDS) {
          capture(id, 'text-color'); capture(id, 'text-halo-color'); capture(id, 'text-halo-width'); captureZoom(id)
          set(id, 'text-color', 'rgba(0,212,200,0.85)'); set(id, 'text-halo-color', 'rgba(6,6,16,0.95)'); set(id, 'text-halo-width', 1.4); setZoom(id, 0, 24)
        }
      } else {
        for (const [k, val] of originals.current.entries()) {
          try {
            if (k.startsWith('z::')) {
              const id = k.slice(3); if (!has(id)) continue
              const { min, max } = val as { min: number; max: number }; map.setLayerZoomRange(id, min, max)
            } else {
              const sep = k.indexOf('::'); const id = k.slice(0, sep); if (!has(id)) continue
              const prop = k.slice(sep + 2); map.setPaintProperty(id, prop, val)
            }
          } catch (err) { if (import.meta.env.DEV) console.debug('[map]', err) }
        }
      }
    }

    if (map.isStyleLoaded()) {
      run()
    } else {
      map.on('load', run)
      return () => { map.off('load', run) }
    }
  }, [mapRef, maptilerKey, highlightWater, activeStyleId])

  return null
}
