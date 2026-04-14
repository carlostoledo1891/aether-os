import type { RefObject } from 'react'
import type maplibregl from 'maplibre-gl'
import { W } from '../../app/canvas/canvasTheme'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'

const CALDEIRA_BBOX: [[number, number], [number, number]] = CALDEIRA_GEO.bbox
const DEFAULT_PITCH = CALDEIRA_GEO.defaultPitch
const DEFAULT_BEARING = CALDEIRA_GEO.defaultBearing

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
        map.fitBounds(CALDEIRA_BBOX, {
          padding: { top: 60, bottom: 80, left: 60, right: 60 },
          pitch: DEFAULT_PITCH,
          bearing: DEFAULT_BEARING,
          duration: 1500,
        })
      }}
      style={{
        width: 29,
        height: 29,
        background: W.mapControlBg,
        border: W.mapControlBorder,
        borderRadius: W.radius.sm,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: W.text3,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 1 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
    </button>
  )
}
