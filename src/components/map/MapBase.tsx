import { useEffect, useRef, useState, useCallback } from 'react'
import Map, { NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { W } from '../../app/canvas/canvasTheme'

export type { MapLayerMouseEvent }

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string
const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')

type MapStyleId = 'hybrid' | 'satellite' | 'dataviz' | 'streets'

const MAP_STYLE_DEFS: { id: MapStyleId; label: string; url: string }[] = HAS_TILER
  ? [
      { id: 'hybrid',    label: 'Terrain',    url: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}` },
      { id: 'satellite', label: 'Satellite',  url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
      { id: 'dataviz',   label: 'Operations', url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}` },
      { id: 'streets',   label: 'Standard',   url: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}` },
    ]
  : [
      { id: 'dataviz', label: 'Dark', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
    ]

const STORAGE_KEY = 'vero-map-style'

function getInitialStyle(): MapStyleId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as MapStyleId | null
    if (saved && MAP_STYLE_DEFS.some(d => d.id === saved)) return saved
  } catch { /* SSR / private browsing */ }
  return MAP_STYLE_DEFS[0].id
}

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

      const isDark = activeStyleId === 'dataviz' || activeStyleId === 'streets'

      if (isDark) {
        try {
          map.setPaintProperty('background', 'background-color', W.canvas)
        } catch { /* layer may not exist */ }
        for (const id of WATER_LAYER_IDS) {
          try { map.setPaintProperty(id, 'fill-color', W.mapWaterFill) } catch { /* noop */ }
        }
      }

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
              const id = k.slice(3); const { min, max } = val as { min: number; max: number }; map.setLayerZoomRange(id, min, max)
            } else {
              const sep = k.indexOf('::'); const id = k.slice(0, sep); const prop = k.slice(sep + 2); map.setPaintProperty(id, prop, val)
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
      position: 'absolute', bottom: 24, left: 10, zIndex: 5,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          background: 'rgba(6,6,16,0.92)', backdropFilter: 'blur(12px)',
          border: W.chromeBorder, borderRadius: W.radius.sm,
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
          background: 'rgba(6,6,16,0.88)', backdropFilter: 'blur(10px)',
          border: W.chromeBorder, borderRadius: W.radius.sm,
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
  const [styleId, setStyleId] = useState<MapStyleId>(getInitialStyle)

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme')
    if (theme === 'board' && MAP_STYLE_DEFS.some(d => d.id === 'streets')) {
      setStyleId('streets')
    }
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme')
      if (theme === 'board' && MAP_STYLE_DEFS.some(d => d.id === 'streets')) {
        setStyleId('streets')
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const styleUrl = MAP_STYLE_DEFS.find(d => d.id === styleId)?.url ?? MAP_STYLE_DEFS[0].url

  const handleStyleChange = useCallback((id: MapStyleId) => {
    setStyleId(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch { /* noop */ }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Map
        id={id}
        initialViewState={initialViewState}
        mapStyle={styleUrl}
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
        <StyleController maptilerKey={MAPTILER_KEY} mapId={id} highlightWater={highlightWater} activeStyleId={styleId} />
        <NavigationControl
          position="top-right"
          showCompass
          showZoom
          visualizePitch
        />
        {children}
      </Map>

      <MapStylePicker active={styleId} onChange={handleStyleChange} />

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
