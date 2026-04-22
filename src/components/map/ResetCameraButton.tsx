import type { RefObject } from 'react'
import { ScanSearch } from 'lucide-react'
import type maplibregl from 'maplibre-gl'
import { getMapControlTriggerStyle } from './mapControlStyles'
import { fitMapToCaldeira } from './caldeiraCamera'

export function ResetCameraButton({
  mapRef,
}: {
  mapRef: RefObject<maplibregl.Map | null>
}) {
  return (
    <button
      type="button"
      title="Reset View"
      onClick={(e) => {
        e.stopPropagation()
        const map = mapRef.current
        if (!map) return
        fitMapToCaldeira(map, { duration: 1500 })
      }}
      style={{
        ...getMapControlTriggerStyle(false),
      }}
    >
      <ScanSearch size={15} />
    </button>
  )
}
