import { useEffect, useRef, type ReactNode } from 'react'
import Map, { useMap } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string
const HAS_TILER = !!(MAPTILER_KEY && MAPTILER_KEY !== 'your_maptiler_key_here')

const SATELLITE_URL = HAS_TILER
  ? `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`
  : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

interface FlyToTarget {
  center: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
  duration?: number
}

interface MiniMapProps {
  id: string
  center: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
  overlays?: ReactNode
  children?: ReactNode
  flyTo?: FlyToTarget
  style?: React.CSSProperties
  interactive?: boolean
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

export default function MiniMap({
  id,
  center,
  zoom,
  pitch = 0,
  bearing = 0,
  overlays,
  children,
  flyTo,
  style,
  interactive = false,
}: MiniMapProps) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 14,
      overflow: 'hidden',
      ...style,
    }}>
      {!interactive && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} />}
      <Map
        id={id}
        initialViewState={{ longitude: center[0], latitude: center[1], zoom, pitch, bearing }}
        mapStyle={SATELLITE_URL}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        interactive={interactive}
        dragPan={interactive}
        dragRotate={interactive}
        scrollZoom={false}
        doubleClickZoom={false}
        touchPitch={false}
        touchZoomRotate={false}
        keyboard={false}
      >
        {flyTo && <FlyToController mapId={id} target={flyTo} />}
        {overlays}
        {children}
      </Map>
    </div>
  )
}
