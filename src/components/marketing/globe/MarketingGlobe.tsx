import { useEffect, useMemo } from 'react'
import Map, { useMap } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type maplibregl from 'maplibre-gl'
import { MAP_STYLE_DEFS, type MapStyleId } from '../../map/MapStyleController'
import { MovingPinsOverlay } from './MovingPinsOverlay'
import { CameraDriver } from './CameraDriver'
import { cameraAt } from './cameraPath'
import { subscribeToRegion } from './globeBus'

const GLOBE_MAP_ID = 'marketing-globe'

/** Force the dark dataviz "operations" basemap. Falls back if MapTiler key is absent. */
function pickOperationsStyleUrl(): string {
  const preferredOrder: MapStyleId[] = ['operations', 'topo', 'satellite']
  for (const id of preferredOrder) {
    const def = MAP_STYLE_DEFS.find((d) => d.id === id)
    if (def) return def.url
  }
  return MAP_STYLE_DEFS[0].url
}

/**
 * Per-region projection switch.
 *
 * MapLibre's globe projection is the prestige look but it's heavy at
 * city zoom — every interpolation step does extra reprojection work.
 * We keep `globe` only for the planet pull-back and use `mercator`
 * everywhere else, so the camera reads as buttery during city + drill
 * detail beats.
 */
function ProjectionController() {
  const maps = useMap()

  useEffect(() => {
    const ref = maps[GLOBE_MAP_ID as keyof typeof maps] ?? maps.current
    if (!ref) return
    const map = (ref as { getMap: () => maplibregl.Map }).getMap()

    const apply = (region: 'manhattan' | 'caldeira' | 'planet') => {
      try {
        map.setProjection({ type: region === 'planet' ? 'globe' : 'mercator' })
      } catch {
        /* older MapLibre fallback */
      }
    }

    const installSky = () => {
      try {
        map.setSky({
          'sky-color': '#0a1330',
          'horizon-color': '#1a2a55',
          'fog-color': '#080d1d',
          'fog-ground-blend': 0.5,
          'horizon-fog-blend': 0.6,
          'sky-horizon-blend': 0.85,
          'atmosphere-blend': [
            'interpolate', ['linear'], ['zoom'],
            0, 1,
            5, 0.85,
            10, 0.4,
            12, 0,
          ],
        } as never)
      } catch {
        /* style without sky support */
      }
    }

    const seed = () => {
      apply(cameraAt(0).region)
      installSky()
    }
    if (map.isStyleLoaded()) seed()
    else map.once('load', seed)

    const unsubRegion = subscribeToRegion(apply)
    const onStyle = () => {
      try { installSky() } catch { /* noop */ }
    }
    map.on('styledata', onStyle)
    return () => {
      unsubRegion()
      map.off('styledata', onStyle)
    }
  }, [maps])

  return null
}

interface MarketingGlobeProps {
  /** Override scrim opacity over the basemap (0–1). */
  scrim?: number
}

/**
 * Fixed-background marketing globe.
 *
 * Acts as the visual protagonist of the marketing experience:
 *   - Dark "Operations" basemap, MapLibre projection per-region.
 *   - 60+ pins moving along NYC-region polylines (or Caldeira drill
 *     holes when the camera path enters the Caldeira region).
 *   - Persistent fading trails per pin.
 *   - Camera = scroll — `useScrollDriver` (in ScrollyExperience)
 *     publishes progress 0..1, `cameraAt(t)` maps to camera state,
 *     `CameraDriver` calls `map.jumpTo` per frame.
 */
export function MarketingGlobe({ scrim = 0.42 }: MarketingGlobeProps = {}) {
  const styleUrl = useMemo(() => pickOperationsStyleUrl(), [])
  const initial = cameraAt(0)

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <Map
          id={GLOBE_MAP_ID}
          initialViewState={{
            longitude: initial.longitude,
            latitude: initial.latitude,
            zoom: initial.zoom,
            pitch: initial.pitch,
            bearing: initial.bearing,
          }}
          mapStyle={styleUrl}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          interactive={false}
          dragPan={false}
          dragRotate={false}
          scrollZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          keyboard={false}
        >
          <ProjectionController />
          <CameraDriver mapId={GLOBE_MAP_ID} />
          <MovingPinsOverlay mapId={GLOBE_MAP_ID} />
        </Map>
      </div>

      {/* Vignette + radial scrim — keeps copy readable above the city. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(4,8,20,${Math.max(0, scrim - 0.12)}) 0%, rgba(4,8,20,${scrim}) 55%, rgba(4,8,20,${Math.min(1, scrim + 0.18)}) 100%),
            linear-gradient(180deg, rgba(4,8,20,0.32) 0%, rgba(4,8,20,0) 18%, rgba(4,8,20,0) 82%, rgba(4,8,20,0.45) 100%)
          `,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(124,92,252,0.08) 0%, rgba(124,92,252,0) 55%)',
        }}
      />
    </div>
  )
}
