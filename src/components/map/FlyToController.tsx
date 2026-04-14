import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'

export interface FlyToTarget {
  center: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
  duration?: number
}

export function FlyToController({ mapId, target }: { mapId: string; target: FlyToTarget }) {
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
