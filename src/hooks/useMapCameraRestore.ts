import { useState, useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'
import { useMapCamera, type CameraState } from '../contexts/MapCameraContext'

/**
 * Restores a saved camera position on mount and saves the current position on
 * unmount, bridging navigation between platform map views. Returns the restored
 * camera (or null if none was saved) for use as `<MapBase initialViewState=…>`.
 */
export function useMapCameraRestore(mapId: string): CameraState | null {
  const { saveCamera, getCamera, clearCamera } = useMapCamera()
  const maps = useMap()

  const [initialCamera] = useState(() => {
    const saved = getCamera()
    if (saved) {
      clearCamera()
      return saved
    }
    return null
  })

  useEffect(() => {
    const ref = maps[mapId as keyof typeof maps] ?? maps.current
    return () => {
      if (!ref) return
      const map = (ref as unknown as { getMap?: () => maplibregl.Map | undefined }).getMap?.()
      if (!map) return
      const center = map.getCenter()
      saveCamera({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      })
    }
  }, [maps, mapId, saveCamera])

  return initialCamera
}
