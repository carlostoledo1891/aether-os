import { useState } from 'react'
import { Bookmark, X } from 'lucide-react'
import { useMap } from 'react-map-gl/maplibre'
import { CALDEIRA_GEO } from 'shared/sites/caldeira'
import { W } from '../../app/canvas/canvasTheme'

interface MapBookmarkControlProps {
  mapId: string
}

const BOOKMARKS = [
  { id: 'site-overview', label: 'Site overview', coords: CALDEIRA_GEO.center, zoom: CALDEIRA_GEO.defaultZoom, pitch: CALDEIRA_GEO.defaultPitch },
  { id: 'pilotPlant', label: 'Pilot plant', coords: CALDEIRA_GEO.pois.pilotPlant.coords, zoom: 13.4, pitch: 45 },
  { id: 'commercialPlant', label: 'Commercial plant', coords: CALDEIRA_GEO.pois.commercialPlant.coords, zoom: 12.8, pitch: 45 },
  { id: 'capaoDoMel', label: 'Capao do Mel', coords: CALDEIRA_GEO.pois.capaoDoMel.coords, zoom: 13.2, pitch: 45 },
] as const

export function MapBookmarkControl({ mapId }: MapBookmarkControlProps) {
  const maps = useMap()
  const [open, setOpen] = useState(false)

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
    <>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label="Toggle bookmarks"
        aria-expanded={open}
        title="Bookmarks"
        style={{
          width: 29,
          height: 29,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: W.mapControlBorder,
          background: W.mapControlBg,
          cursor: 'pointer',
          color: open ? W.cyan : W.text2,
          transition: 'color 0.15s',
        }}
      >
        <Bookmark size={14} />
      </button>
      {open && (
        <div
          style={{
            background: W.mapControlBg,
            border: W.mapControlBorder,
            borderRadius: 8,
            padding: '8px 10px',
            minWidth: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Bookmarks
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close bookmarks"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: W.text4, padding: 0, display: 'flex' }}
            >
              <X size={12} />
            </button>
          </div>
          {BOOKMARKS.map(bookmark => (
            <button
              key={bookmark.id}
              type="button"
              onClick={() => flyTo(bookmark.coords, bookmark.zoom, bookmark.pitch)}
              style={{
                background: 'none',
                border: 'none',
                color: W.text2,
                fontSize: 10,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '3px 0',
              }}
            >
              {bookmark.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
