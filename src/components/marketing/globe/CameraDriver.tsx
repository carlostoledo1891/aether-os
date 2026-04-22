import { useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'
import { getCameraSample, subscribeToCamera } from './globeBus'
import type { CameraSample } from './cameraPath'

interface CameraDriverProps {
  mapId: string
}

/**
 * Subscribes to the global camera channel and applies the requested
 * state to MapLibre with `jumpTo`. There is no `flyTo` — the scroll
 * driver hands us a smoothed-per-frame camera state already, so any
 * MapLibre-side animation curve would just fight it.
 *
 * Frame budgeting: scroll callbacks fire at rAF speed, but we may
 * receive multiple per frame (resize + scroll + initial sync). The
 * driver coalesces all of them into a single `jumpTo` per animation
 * frame.
 */
export function CameraDriver({ mapId }: CameraDriverProps) {
  const maps = useMap()

  useEffect(() => {
    const ref = maps[mapId as keyof typeof maps] ?? maps.current
    if (!ref) return
    const map = (ref as { getMap: () => maplibregl.Map }).getMap()

    let pending: CameraSample | null = null
    let scheduled = false

    const flush = () => {
      scheduled = false
      if (!pending) return
      const c = pending
      pending = null
      try {
        map.jumpTo({
          center: [c.longitude, c.latitude],
          zoom: c.zoom,
          pitch: c.pitch,
          bearing: c.bearing,
        })
      } catch {
        /* map style not yet ready — next frame will retry */
      }
    }

    const apply = (sample: CameraSample) => {
      pending = sample
      if (!scheduled) {
        scheduled = true
        requestAnimationFrame(flush)
      }
    }

    const seed = () => apply(getCameraSample())
    if (map.isStyleLoaded()) seed()
    else map.once('load', seed)

    const unsub = subscribeToCamera(apply)
    return () => {
      unsub()
    }
  }, [maps, mapId])

  return null
}
