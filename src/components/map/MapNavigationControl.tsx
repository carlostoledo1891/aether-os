import { useEffect, useState, type RefObject } from 'react'
import { Compass, Minus, Plus } from 'lucide-react'
import type maplibregl from 'maplibre-gl'
import { getMapControlTriggerStyle, mapControlColumnStyle, mapControlRowStyle } from './mapControlStyles'

export function MapNavigationControl({
  mapRef,
  disabled = false,
  direction = 'row',
}: {
  mapRef: RefObject<maplibregl.Map | null>
  disabled?: boolean
  direction?: 'row' | 'column'
}) {
  const [bearing, setBearing] = useState(0)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const syncBearing = () => setBearing(map.getBearing())
    syncBearing()

    map.on('rotate', syncBearing)
    map.on('pitch', syncBearing)

    return () => {
      map.off('rotate', syncBearing)
      map.off('pitch', syncBearing)
    }
  }, [mapRef])

  const handleZoomIn = () => {
    const map = mapRef.current
    if (!map) return
    map.zoomIn({ duration: 250 })
  }

  const handleZoomOut = () => {
    const map = mapRef.current
    if (!map) return
    map.zoomOut({ duration: 250 })
  }

  const handleResetBearing = () => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({ bearing: 0, pitch: 0, duration: 350 })
  }

  return (
    <div style={direction === 'column' ? mapControlColumnStyle : mapControlRowStyle} aria-label="Map navigation controls">
      <button
        type="button"
        title="Zoom in"
        aria-label="Zoom in"
        disabled={disabled}
        onClick={handleZoomIn}
        style={getMapControlTriggerStyle(false)}
      >
        <Plus size={15} />
      </button>
      <button
        type="button"
        title="Zoom out"
        aria-label="Zoom out"
        disabled={disabled}
        onClick={handleZoomOut}
        style={getMapControlTriggerStyle(false)}
      >
        <Minus size={15} />
      </button>
      <button
        type="button"
        title="Reset rotation"
        aria-label="Reset map rotation"
        disabled={disabled}
        onClick={handleResetBearing}
        style={getMapControlTriggerStyle(Math.abs(bearing) > 0.01)}
      >
        <Compass size={15} style={{ transform: `rotate(${-bearing}deg)`, transition: 'transform 0.15s ease' }} />
      </button>
    </div>
  )
}
