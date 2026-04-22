import { useCallback, useState } from 'react'
import { Bookmark, X } from 'lucide-react'
import { useMap } from 'react-map-gl/maplibre'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'
import { W } from '../../app/canvas/canvasTheme'
import { usePopoverDismiss } from '../../hooks/usePopoverDismiss'
import {
  mapControlAnchorStyle,
  getMapControlMenuRowStyle,
  getMapControlTriggerStyle,
  mapControlCloseButtonStyle,
  mapControlHeaderLabelStyle,
  mapControlHeaderStyle,
  mapControlPanelStyle,
  mapControlSidePopoverStyle,
} from './mapControlStyles'

interface MapBookmarkControlProps {
  mapId: string
}

const BOOKMARKS = [
  { id: 'site-overview', label: 'Site overview', coords: CALDEIRA_GEO.center, zoom: CALDEIRA_GEO.defaultZoom, pitch: CALDEIRA_GEO.defaultPitch },
  { id: 'pilotPlant', label: 'Pilot plant', coords: CALDEIRA_GEO.pois.pilotPlant.coords, zoom: 13.4, pitch: 0 },
  { id: 'commercialPlant', label: 'Commercial plant', coords: CALDEIRA_GEO.pois.commercialPlant.coords, zoom: 12.8, pitch: 0 },
  { id: 'capaoDoMel', label: 'Capao do Mel', coords: CALDEIRA_GEO.pois.capaoDoMel.coords, zoom: 13.2, pitch: 0 },
] as const

export function MapBookmarkControl({ mapId }: MapBookmarkControlProps) {
  const maps = useMap()
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])
  const anchorRef = usePopoverDismiss<HTMLDivElement>({ open, onClose: handleClose })

  function flyTo(coords: [number, number], zoom: number, pitch: number) {
    const map = maps[mapId] ?? maps.current
    map?.flyTo({
      center: coords,
      zoom,
      pitch,
      bearing: 0,
      duration: 1400,
    })
    setOpen(false)
  }

  return (
    <div ref={anchorRef} style={mapControlAnchorStyle}>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label="Toggle bookmarks"
        aria-expanded={open}
        title="Bookmarks"
        style={getMapControlTriggerStyle(open)}
      >
        <Bookmark size={14} />
      </button>
      {open && (
        <div
          style={{ ...mapControlPanelStyle, ...mapControlSidePopoverStyle, minWidth: 180 }}
        >
          <div style={mapControlHeaderStyle}>
            <span style={mapControlHeaderLabelStyle}>Bookmarks</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close bookmarks"
              style={mapControlCloseButtonStyle}
            >
              <X size={12} />
            </button>
          </div>
          {BOOKMARKS.map(bookmark => (
            <button
              key={bookmark.id}
              type="button"
              onClick={() => flyTo(bookmark.coords, bookmark.zoom, bookmark.pitch)}
              style={getMapControlMenuRowStyle(false)}
            >
              <Bookmark size={12} style={{ color: W.icon, flexShrink: 0 }} />
              <span>{bookmark.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
