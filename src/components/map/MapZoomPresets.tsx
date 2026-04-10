import { memo, useState, useCallback } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from './mapStacking'
import { CALDEIRA_BBOX } from './MapBase'
import type { ComplianceLedger } from '../../types/telemetry'

type PresetId = 'caldeira' | 'journey' | 'full'

interface MapZoomPresetsProps {
  mapId: string
  timeline: ComplianceLedger['molecular_timeline']
}

const FIT_OPTS = { padding: 80, duration: 800, pitch: 35, bearing: 0 }

export const MapZoomPresets = memo(function MapZoomPresets({ mapId, timeline }: MapZoomPresetsProps) {
  const maps = useMap()
  const mapRef = maps[mapId as keyof typeof maps] ?? maps.current
  const [active, setActive] = useState<PresetId>('caldeira')

  const fitTo = useCallback((preset: PresetId) => {
    if (!mapRef) return
    setActive(preset)

    if (preset === 'caldeira') {
      mapRef.fitBounds(CALDEIRA_BBOX, FIT_OPTS)
      return
    }

    const isJourney = preset === 'journey'
    const steps = timeline.filter(s =>
      s.coordinates && (isJourney ? s.status !== 'pending' : true),
    )
    const coords = steps.map(s => s.coordinates!).filter(Boolean)

    if (coords.length === 0) {
      mapRef.fitBounds(CALDEIRA_BBOX, FIT_OPTS)
      return
    }

    let [minLng, minLat] = CALDEIRA_BBOX[0]
    let [maxLng, maxLat] = CALDEIRA_BBOX[1]

    for (const c of coords) {
      minLng = Math.min(minLng, c.lng)
      minLat = Math.min(minLat, c.lat)
      maxLng = Math.max(maxLng, c.lng)
      maxLat = Math.max(maxLat, c.lat)
    }

    const lngSpan = maxLng - minLng
    const latSpan = maxLat - minLat
    const buffer = Math.max(lngSpan, latSpan) * 0.15
    minLng -= buffer
    maxLng += buffer
    maxLat += buffer
    minLat -= buffer * 1.8

    mapRef.fitBounds([[minLng, minLat], [maxLng, maxLat]], FIT_OPTS)
  }, [mapRef, timeline])

  const presets: { id: PresetId; label: string; tooltip: string }[] = [
    { id: 'caldeira',  label: 'Caldeira',     tooltip: 'Fit to Caldeira deposit area' },
    { id: 'journey',   label: 'Journey',      tooltip: 'Fit all verified & active steps' },
    { id: 'full',      label: 'Full Journey',  tooltip: 'Fit all steps including pending' },
  ]

  return (
    <div style={{
      position: 'absolute', bottom: 165, right: 12, zIndex: Z.hud,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      {presets.map(p => (
        <button
          key={p.id}
          type="button"
          title={p.tooltip}
          onClick={() => fitTo(p.id)}
          style={{
            padding: '4px 8px',
            fontSize: 9,
            fontWeight: active === p.id ? 700 : 500,
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.04em',
            color: active === p.id ? W.violetSoft : W.text3,
            background: active === p.id
              ? W.overlay88
              : W.mapControlBg,
            border: active === p.id
              ? W.mapControlBorder
              : W.mapControlBorder,
            borderRadius: 4,
            cursor: 'pointer',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
})
