import { useEffect } from 'react'
import Map, { NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export type { MapLayerMouseEvent }

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string

const MAP_STYLE = MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here'
  ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`
  : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export const FIELD_VIEW_STATE = {
  longitude: -46.585,
  latitude:  -21.815,
  zoom:       12.05,
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
  onMouseEnter?: (e: MapLayerMouseEvent) => void
  onMouseLeave?: (e: MapLayerMouseEvent) => void
  onMouseMove?: (e: MapLayerMouseEvent) => void
  onClick?: (e: MapLayerMouseEvent) => void
}

function TerrainLoader({ maptilerKey, mapId }: { maptilerKey: string; mapId: string }) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps]

  useEffect(() => {
    if (!mapRef) return
    const map = (mapRef as { getMap: () => maplibregl.Map }).getMap()

    const applyTerrain = () => {
      if (!maptilerKey || maptilerKey === 'your_maptiler_key_here') return

      if (!map.getSource('terrain-dem')) {
        map.addSource('terrain-dem', {
          type: 'raster-dem',
          url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${maptilerKey}`,
          tileSize: 256,
        } as never)
      }

      map.setTerrain({ source: 'terrain-dem', exaggeration: 1.4 } as never)

      try {
        map.setPaintProperty('background', 'background-color', '#060610')
        map.setPaintProperty('water', 'fill-color', '#0A1A28')
      } catch {
        /* some layers may not exist in all styles */
      }
    }

    if (map.isStyleLoaded()) {
      applyTerrain()
    } else {
      map.on('load', applyTerrain)
      return () => { map.off('load', applyTerrain) }
    }
  }, [mapRef, maptilerKey])

  return null
}

export function MapBase({
  id = 'aetherField',
  initialViewState = FIELD_VIEW_STATE,
  children,
  interactiveLayerIds,
  cursor,
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
        <TerrainLoader maptilerKey={MAPTILER_KEY} mapId={id} />
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
