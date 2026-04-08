import { useEffect, useRef } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import Map, { NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export type { MapLayerMouseEvent }

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string

const MAP_STYLE = MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here'
  ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`
  : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

/** Default framing: Caldeira project polygon centroid — regional context (Andradas / Caldas / S.J. Boa Vista margins) */
export const FIELD_VIEW_STATE = {
  longitude: -46.52,
  latitude:  -21.91,
  zoom:       10.98,
  pitch:      0,
  bearing:    0,
}

export const BUYER_VIEW_STATE = {
  longitude: -46.300,
  latitude:  -22.500,
  zoom:       7.5,
  pitch:      0,
  bearing:    0,
}

export const EXEC_VIEW_STATE = {
  longitude: -46.565,
  latitude:  -21.860,
  zoom:       10.8,
  pitch:      0,
  bearing:    0,
}

interface MapBaseProps {
  id?: string
  initialViewState?: typeof FIELD_VIEW_STATE
  children?: React.ReactNode
  interactiveLayerIds?: string[]
  cursor?: string
  highlightWater?: boolean
  onMouseEnter?: (e: MapLayerMouseEvent) => void
  onMouseLeave?: (e: MapLayerMouseEvent) => void
  onMouseMove?: (e: MapLayerMouseEvent) => void
  onClick?: (e: MapLayerMouseEvent) => void
}

const WATER_LAYER_IDS = ['water', 'water_shadow'] as const
const WATERWAY_LAYER_IDS = ['waterway'] as const
const WATER_LABEL_IDS = ['waterway_label', 'watername_lake', 'watername_lake_line'] as const

const CYAN_LINE_WIDTH = [
  'interpolate', ['linear'], ['zoom'],
  6, 0.5, 10, 0.8, 13, 1.5, 16, 2.5,
]

function StyleController({
  maptilerKey, mapId, highlightWater,
}: {
  maptilerKey: string; mapId: string; highlightWater: boolean
}) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const originals = useRef<globalThis.Map<string, unknown>>(new globalThis.Map())

  useEffect(() => {
    if (!mapRef) return
    const map = (mapRef as { getMap: () => maplibregl.Map }).getMap()

    const run = () => {
      // ── Terrain (MapTiler only) ──────────────────────────────────────
      const hasTiler = maptilerKey && maptilerKey !== 'your_maptiler_key_here'
      if (hasTiler) {
        if (!map.getSource('terrain-dem')) {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${maptilerKey}`,
            tileSize: 256,
          // react-map-gl Source options type doesn't include raster-dem fields
          } as never)
        }
        // MapLibre terrain API type not exposed by react-map-gl wrapper
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.4 } as never)
        try { map.setPaintProperty('background', 'background-color', W.canvas) } catch { /* noop */ }
      }

      // ── Helpers ──────────────────────────────────────────────────────
      const capture = (layerId: string, prop: string) => {
        const k = `${layerId}::${prop}`
        if (!originals.current.has(k)) {
          try { originals.current.set(k, map.getPaintProperty(layerId, prop)) } catch { /* noop */ }
        }
      }
      const captureZoom = (layerId: string) => {
        const k = `z::${layerId}`
        if (!originals.current.has(k)) {
          try {
            const l = map.getLayer(layerId) as { minzoom?: number; maxzoom?: number } | undefined
            if (l) originals.current.set(k, { min: l.minzoom ?? 0, max: l.maxzoom ?? 24 })
          } catch { /* noop */ }
        }
      }
      const set = (layerId: string, prop: string, val: unknown) => {
        try { map.setPaintProperty(layerId, prop, val) } catch { /* noop */ }
      }
      const setZoom = (layerId: string, min: number, max: number) => {
        try { map.setLayerZoomRange(layerId, min, max) } catch { /* noop */ }
      }

      // ── Water styling ───────────────────────────────────────────────
      if (highlightWater) {
        for (const id of WATER_LAYER_IDS) {
          capture(id, 'fill-color')
          set(id, 'fill-color', 'rgba(0,212,200,0.18)')
        }

        for (const id of WATERWAY_LAYER_IDS) {
          capture(id, 'line-color')
          capture(id, 'line-opacity')
          capture(id, 'line-width')
          captureZoom(id)
          set(id, 'line-color', 'rgb(0,212,200)')
          set(id, 'line-opacity', 0.65)
          set(id, 'line-width', CYAN_LINE_WIDTH)
          setZoom(id, 0, 24)
        }

        for (const id of WATER_LABEL_IDS) {
          capture(id, 'text-color')
          capture(id, 'text-halo-color')
          capture(id, 'text-halo-width')
          captureZoom(id)
          set(id, 'text-color', 'rgba(0,212,200,0.85)')
          set(id, 'text-halo-color', 'rgba(6,6,16,0.95)')
          set(id, 'text-halo-width', 1.4)
          setZoom(id, 0, 24)
        }
      } else {
        // Restore captured originals
        for (const [k, val] of originals.current.entries()) {
          try {
            if (k.startsWith('z::')) {
              const id = k.slice(3)
              const { min, max } = val as { min: number; max: number }
              map.setLayerZoomRange(id, min, max)
            } else {
              const sep = k.indexOf('::')
              const id = k.slice(0, sep)
              const prop = k.slice(sep + 2)
              map.setPaintProperty(id, prop, val)
            }
          } catch { /* noop */ }
        }

        if (hasTiler) {
          try { map.setPaintProperty('water', 'fill-color', W.mapWaterFill) } catch { /* noop */ }
        }
      }
    }

    if (map.isStyleLoaded()) {
      run()
    } else {
      map.on('load', run)
      return () => { map.off('load', run) }
    }
  }, [mapRef, maptilerKey, highlightWater])

  return null
}

export function MapBase({
  id = 'aetherField',
  initialViewState = FIELD_VIEW_STATE,
  children,
  interactiveLayerIds,
  cursor,
  highlightWater = false,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
}: MapBaseProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Map
        id={id}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        logoPosition="bottom-right"
        interactiveLayerIds={interactiveLayerIds}
        cursor={cursor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onClick}
      >
        <StyleController maptilerKey={MAPTILER_KEY} mapId={id} highlightWater={highlightWater} />
        <NavigationControl
          position="top-right"
          showCompass
          showZoom
          visualizePitch
        />
        {children}
      </Map>

      <div style={{
        position: 'absolute', bottom: 4, right: 8,
        fontSize: 9, color: 'rgba(255,255,255,0.18)',
        fontFamily: 'var(--font-mono)', pointerEvents: 'none', zIndex: 1,
      }}>
        © MapTiler · OpenStreetMap contributors
      </div>
    </div>
  )
}
