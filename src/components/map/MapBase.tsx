import { useEffect, useRef, useState, useCallback } from 'react'
import Map, { NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from './mapStacking'

export type { MapLayerMouseEvent }

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string
const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')

type MapStyleId = 'satellite' | 'operations' | 'topo'

const MAP_STYLE_DEFS: { id: MapStyleId; label: string; url: string }[] = HAS_TILER
  ? [
      { id: 'satellite',  label: 'Satellite',   url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
      { id: 'operations', label: 'Operations',  url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}` },
      { id: 'topo',       label: 'Topography',  url: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_KEY}` },
    ]
  : [
      { id: 'operations', label: 'Dark', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    ]

const STORAGE_KEY = 'vero-map-style'

const LEGACY_STYLE_MAP: Record<string, MapStyleId> = {
  dataviz: 'operations', streets: 'operations', hybrid: 'satellite',
}

function getInitialStyle(): MapStyleId {
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

/** Default framing: Poços de Caldas Alkaline Complex centroid.
 *  Latitude shifted south to compensate for pitch-induced visual center shift. */
export const CALDEIRA_VIEW_STATE = {
  longitude: -46.555,
  latitude:  -21.88,
  zoom:       10.98,
  pitch:      35,
  bearing:    0,
}

export const CALDEIRA_BBOX: [[number, number], [number, number]] = [
  [-46.72, -22.06],
  [-46.39, -21.75],
]

export interface FlyToTarget {
  center: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
  duration?: number
}

interface MapBaseProps {
  id?: string
  initialViewState?: typeof CALDEIRA_VIEW_STATE
  children?: React.ReactNode
  interactiveLayerIds?: string[]
  cursor?: string
  highlightWater?: boolean
  interactive?: boolean
  disableZoomControls?: boolean
  hideControls?: boolean
  containerStyle?: React.CSSProperties
  flyTo?: FlyToTarget
  forceStyle?: MapStyleId
  onMouseEnter?: (e: MapLayerMouseEvent) => void
  onMouseLeave?: (e: MapLayerMouseEvent) => void
  onMouseMove?: (e: MapLayerMouseEvent) => void
  onClick?: (e: MapLayerMouseEvent) => void
}

function FlyToController({ mapId, target }: { mapId: string; target: FlyToTarget }) {
  const maps = useMap()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
    if (!mapRef) return
    const map = (mapRef as { getMap: () => maplibregl.Map }).getMap()

    const run = () => {
      fired.current = true
      map.flyTo({
        center: target.center,
        zoom: target.zoom,
        pitch: target.pitch ?? map.getPitch(),
        bearing: target.bearing ?? map.getBearing(),
        duration: target.duration ?? 3000,
        essential: true,
      })
    }

    if (map.isStyleLoaded()) run()
    else map.once('load', run)
  }, [maps, mapId, target])

  return null
}

const WATER_LAYER_IDS = ['water', 'water_shadow'] as const
const WATERWAY_LAYER_IDS = ['waterway'] as const
const WATER_LABEL_IDS = ['waterway_label', 'watername_lake', 'watername_lake_line'] as const

const CYAN_LINE_WIDTH = [
  'interpolate', ['linear'], ['zoom'],
  6, 0.5, 10, 0.8, 13, 1.5, 16, 2.5,
]

function StyleController({
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
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.4 } as never)
      }

      const isDark = activeStyleId === 'operations'

      if (isDark) {
        if (has('background')) {
          try { map.setPaintProperty('background', 'background-color', W.canvas) } catch { /* noop */ }
        }
        for (const id of WATER_LAYER_IDS) {
          if (has(id)) {
            try { map.setPaintProperty(id, 'fill-color', W.mapWaterFill) } catch { /* noop */ }
          }
        }
      }
      const capture = (layerId: string, prop: string) => {
        if (!has(layerId)) return
        const k = `${layerId}::${prop}`
        if (!originals.current.has(k)) {
          try { originals.current.set(k, map.getPaintProperty(layerId, prop)) } catch { /* noop */ }
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
        try { map.setPaintProperty(layerId, prop, val) } catch { /* noop */ }
      }
      const setZoom = (layerId: string, min: number, max: number) => {
        if (!has(layerId)) return
        try { map.setLayerZoomRange(layerId, min, max) } catch { /* noop */ }
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
          } catch { /* noop */ }
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

function MapStylePicker({
  active, onChange,
}: {
  active: MapStyleId; onChange: (id: MapStyleId) => void
}) {
  const [open, setOpen] = useState(false)
  if (MAP_STYLE_DEFS.length <= 1) return null

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 10, zIndex: Z.mapStyleControl,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          background: W.mapControlBg,
          border: W.mapControlBorder, borderRadius: W.radius.sm,
          padding: 4, minWidth: 110,
        }}>
          {MAP_STYLE_DEFS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onChange(s.id); setOpen(false) }}
              style={{
                display: 'block', width: '100%', padding: '5px 8px',
                background: s.id === active ? `${W.violet}25` : 'transparent',
                border: 'none', borderRadius: 4, cursor: 'pointer', textAlign: 'left',
                fontSize: 10, fontWeight: s.id === active ? 700 : 500,
                color: s.id === active ? W.violetSoft : W.text3,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Map style"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px',
          background: W.mapControlBg,
          border: W.mapControlBorder, borderRadius: W.radius.sm,
          cursor: 'pointer', fontSize: 10, fontWeight: 600,
          color: W.text3, fontFamily: 'var(--font-ui)',
          letterSpacing: '0.04em',
        }}
      >
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
          <path d="M8 2v16" /><path d="M16 6v16" />
        </svg>
        {MAP_STYLE_DEFS.find(s => s.id === active)?.label ?? 'Style'}
      </button>
    </div>
  )
}

export function MapBase({
  id = 'aetherField',
  initialViewState = CALDEIRA_VIEW_STATE,
  children,
  interactiveLayerIds,
  cursor,
  highlightWater = false,
  interactive = true,
  disableZoomControls = false,
  hideControls = false,
  containerStyle,
  flyTo,
  forceStyle,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
}: MapBaseProps) {
  const [styleId, setStyleId] = useState<MapStyleId>(getInitialStyle)

  const activeStyleId = forceStyle ?? styleId
  const styleUrl = MAP_STYLE_DEFS.find(d => d.id === activeStyleId)?.url ?? MAP_STYLE_DEFS[0].url

  const handleStyleChange = useCallback((id: MapStyleId) => {
    if (forceStyle) return
    setStyleId(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch { /* noop */ }
  }, [forceStyle])

  return (
    <div style={{ position: 'absolute', inset: 0, ...containerStyle }}>
      {!interactive && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} />}
      <Map
        id={id}
        initialViewState={initialViewState}
        mapStyle={styleUrl}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        logoPosition={hideControls ? undefined : "bottom-right"}
        interactive={interactive}
        dragPan={interactive}
        dragRotate={interactive}
        scrollZoom={!disableZoomControls}
        doubleClickZoom={!disableZoomControls}
        touchZoomRotate={!disableZoomControls}
        keyboard={!disableZoomControls}
        interactiveLayerIds={interactive ? interactiveLayerIds : undefined}
        cursor={cursor}
        onMouseEnter={interactive ? onMouseEnter : undefined}
        onMouseLeave={interactive ? onMouseLeave : undefined}
        onMouseMove={interactive ? onMouseMove : undefined}
        onClick={interactive ? onClick : undefined}
      >
        <StyleController maptilerKey={MAPTILER_KEY} mapId={id} highlightWater={highlightWater} activeStyleId={activeStyleId} />
        {flyTo && <FlyToController mapId={id} target={flyTo} />}
        {!hideControls && (
          <NavigationControl
            position="top-right"
            showCompass
            showZoom
            visualizePitch
          />
        )}
        {children}
      </Map>

      {!hideControls && <MapStylePicker active={activeStyleId} onChange={handleStyleChange} />}

      {!hideControls && (
        <div style={{
          position: 'absolute', bottom: 4, right: 8,
          fontSize: 9, color: 'rgba(255,255,255,0.18)',
          fontFamily: 'var(--font-mono)', pointerEvents: 'none', zIndex: Z.tabIndicator,
        }}>
          © MapTiler · OpenStreetMap contributors
        </div>
      )}
    </div>
  )
}
