import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type maplibregl from 'maplibre-gl'
import {
  MANHATTAN_PINS,
  MANHATTAN_ROUTES,
  pinPositionAt,
  type ManhattanPin,
  type ManhattanPinKind,
  type ManhattanRoute,
} from './manhattanRoutes'
import { CALDEIRA_PINS, CALDEIRA_ROUTES } from './caldeiraPins'
import {
  emitChainEvent,
  getCurrentRegion,
  subscribeToRegion,
  type ChainEventKind,
} from './globeBus'
import type { Region } from './cameraPath'

/**
 * Caldeira-style colour palette for marketing pins.
 *   - violet  → assets / drillhole-equivalent
 *   - cyan    → sensors / spring-equivalent (HidroWeb)
 *   - amber   → alerts / breach
 */
const KIND_COLOR: Record<ManhattanPinKind, string> = {
  asset: '#7C5CFC',
  sensor: '#22d3ee',
  alert: '#f59e0b',
}

const KIND_TO_CHAIN: Record<ManhattanPinKind, ChainEventKind> = {
  asset: 'asset',
  sensor: 'sensor',
  alert: 'alert',
}

const PIN_SOURCE_ID = 'mkt-pins'
const ROUTE_SOURCE_ID = 'mkt-routes'
const TRAIL_SOURCE_ID = 'mkt-trails'

const LAYER_TRAIL = 'mkt-trails-line'
const LAYER_ROUTE = 'mkt-routes-line'
const LAYER_GLOW = 'mkt-pins-glow'
const LAYER_CORE = 'mkt-pins-core'
const LAYER_RING = 'mkt-pins-ring'

const TRAIL_LIFETIME_MS = 9_000
const TRAIL_MAX_POINTS = 240

interface MovingPinsOverlayProps {
  mapId: string
  /** Disables animation (used for prefers-reduced-motion). */
  paused?: boolean
}

interface PinDataset {
  pins: ManhattanPin[]
  routes: ManhattanRoute[]
}

const DATASETS: Record<Region, PinDataset> = {
  manhattan: { pins: MANHATTAN_PINS, routes: MANHATTAN_ROUTES },
  caldeira:  { pins: CALDEIRA_PINS,  routes: CALDEIRA_ROUTES },
  // While the camera is in transit / on the planet, keep the last
  // dataset alive so trails don't clear mid-fly. The empty placeholder
  // here is overridden in `swapDataset` — we never actually load it.
  planet:    { pins: MANHATTAN_PINS, routes: MANHATTAN_ROUTES },
}

interface TrailPoint {
  lng: number
  lat: number
  ts: number
  color: string
}

/**
 * Imperative MapLibre overlay that animates pins along route polylines
 * with persistent trails + chain emission at turnarounds.
 *
 * Why imperative:
 *   - 60+ pins × 60 fps × ~1ms re-render would burn React.
 *   - One source.setData() per frame is well under budget on a modern
 *     laptop and bypasses React reconciliation entirely.
 */
export function MovingPinsOverlay({ mapId, paused = false }: MovingPinsOverlayProps) {
  const maps = useMap()
  const rafRef = useRef(0)
  // Trails persist across frames within the lifetime window.
  const trailsRef = useRef<TrailPoint[]>([])
  // Last emitted phase per pin, used to detect "turnaround moments".
  const lastEmitPhaseRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const ref = maps[mapId as keyof typeof maps] ?? maps.current
    if (!ref) return
    const map = (ref as { getMap: () => maplibregl.Map }).getMap()

    let datasetKey: Region = pickDatasetKey(getCurrentRegion())
    let dataset = DATASETS[datasetKey] ?? DATASETS.manhattan
    // Throttle synthetic chain emission to ~1 event / 1100ms so the
    // ribbon reads as a steady heartbeat instead of a flicker storm.
    let lastEmitMs = 0
    const EMIT_INTERVAL_MS = 1100
    // Throttle trail crumb dropping (~12 Hz) so we don't pump 60+
    // crumbs/sec * pins into the trail buffer.
    let lastTrailMs = 0
    const TRAIL_DROP_MS = 80

    const buildRouteFC = (rs: ManhattanRoute[]) => ({
      type: 'FeatureCollection' as const,
      features: rs.map((r) => ({
        type: 'Feature' as const,
        properties: { id: r.id },
        geometry: { type: 'LineString' as const, coordinates: r.coords },
      })),
    })

    const buildPinFC = (nowMs: number) => ({
      type: 'FeatureCollection' as const,
      features: dataset.pins.map((pin) => {
        const route = dataset.routes.find((r) => r.id === pin.routeId)!
        const pos = pinPositionAt(pin, route, nowMs)
        return {
          type: 'Feature' as const,
          properties: {
            id: pin.id,
            color: KIND_COLOR[pin.kind],
            radius: pin.kind === 'alert' ? 6 : pin.kind === 'sensor' ? 4 : 4.5,
            kind: pin.kind,
          },
          geometry: { type: 'Point' as const, coordinates: pos },
        }
      }),
    })

    const buildTrailFC = (nowMs: number) => {
      // Drop trail points older than TRAIL_LIFETIME_MS.
      const live = trailsRef.current.filter((t) => nowMs - t.ts <= TRAIL_LIFETIME_MS)
      trailsRef.current = live.slice(-TRAIL_MAX_POINTS * dataset.pins.length)
      return {
        type: 'FeatureCollection' as const,
        features: trailsRef.current.map((t) => ({
          type: 'Feature' as const,
          properties: {
            color: t.color,
            age: (nowMs - t.ts) / TRAIL_LIFETIME_MS, // 0 = fresh, 1 = expiring
          },
          geometry: { type: 'Point' as const, coordinates: [t.lng, t.lat] },
        })),
      }
    }

    const ensureSources = () => {
      if (!map.getSource(ROUTE_SOURCE_ID)) {
        map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: buildRouteFC(dataset.routes) as never })
      }
      if (!map.getSource(TRAIL_SOURCE_ID)) {
        map.addSource(TRAIL_SOURCE_ID, { type: 'geojson', data: buildTrailFC(performance.now()) as never })
      }
      if (!map.getSource(PIN_SOURCE_ID)) {
        map.addSource(PIN_SOURCE_ID, { type: 'geojson', data: buildPinFC(performance.now()) as never })
      }

      if (!map.getLayer(LAYER_ROUTE)) {
        map.addLayer({
          id: LAYER_ROUTE,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': 'rgba(124,92,252,0.50)',
            'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.2, 10, 0.4, 13, 1.0, 15, 1.6],
            'line-opacity': 0.4,
            'line-blur': 0.4,
          },
        })
      }

      if (!map.getLayer(LAYER_TRAIL)) {
        map.addLayer({
          id: LAYER_TRAIL,
          type: 'circle',
          source: TRAIL_SOURCE_ID,
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': ['interpolate', ['linear'], ['get', 'age'], 0, 2.4, 1, 0.6],
            'circle-opacity': ['interpolate', ['linear'], ['get', 'age'], 0, 0.45, 1, 0],
            'circle-blur': 0.6,
          },
        })
      }

      if (!map.getLayer(LAYER_GLOW)) {
        map.addLayer({
          id: LAYER_GLOW,
          type: 'circle',
          source: PIN_SOURCE_ID,
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': ['*', ['get', 'radius'], 2.6],
            'circle-opacity': 0.18,
            'circle-blur': 1,
          },
        })
      }
      if (!map.getLayer(LAYER_CORE)) {
        map.addLayer({
          id: LAYER_CORE,
          type: 'circle',
          source: PIN_SOURCE_ID,
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': ['get', 'radius'],
            'circle-opacity': 0.95,
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 0.7,
            'circle-stroke-opacity': 0.7,
          },
        })
      }
      if (!map.getLayer(LAYER_RING)) {
        map.addLayer({
          id: LAYER_RING,
          type: 'circle',
          source: PIN_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'alert'],
          paint: {
            'circle-color': 'transparent',
            'circle-radius': ['*', ['get', 'radius'], 2.0],
            'circle-stroke-color': ['get', 'color'],
            'circle-stroke-width': 1.4,
            'circle-stroke-opacity': 0.9,
          },
        })
      }
    }

    const swapDataset = (newKey: Region) => {
      // 'planet' isn't a real dataset — it means "we're between regions";
      // hold the current one until the camera lands somewhere with pins.
      if (newKey === 'planet') return
      if (newKey === datasetKey) return
      const next = DATASETS[newKey]
      if (!next) return
      datasetKey = newKey
      dataset = next
      trailsRef.current = []
      lastEmitPhaseRef.current.clear()
      const routeSrc = map.getSource(ROUTE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
      if (routeSrc) routeSrc.setData(buildRouteFC(dataset.routes) as never)
    }

    const unsubScene = subscribeToRegion((region) => {
      swapDataset(region)
    })

    // ── Animation loop — drops trail crumbs + emits chain events ─────────
    const tick = () => {
      const now = performance.now()
      // Drop a fresh trail crumb at most every TRAIL_DROP_MS so the
      // trail buffer scales with time rather than frame rate.
      if (now - lastTrailMs >= TRAIL_DROP_MS) {
        lastTrailMs = now
        for (const pin of dataset.pins) {
          const route = dataset.routes.find((r) => r.id === pin.routeId)!
          const pos = pinPositionAt(pin, route, now)
          trailsRef.current.push({
            lng: pos[0],
            lat: pos[1],
            ts: now,
            color: KIND_COLOR[pin.kind],
          })
        }
      }

      // Refresh map sources.
      const pinSrc = map.getSource(PIN_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
      if (pinSrc) pinSrc.setData(buildPinFC(now) as never)
      const trailSrc = map.getSource(TRAIL_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
      if (trailSrc) trailSrc.setData(buildTrailFC(now) as never)

      // Time-throttled chain emission. The ribbon reads as a steady
      // ~0.9 Hz heartbeat — slow enough not to flicker, fast enough to
      // keep the chain alive while the user reads the scrolly copy.
      if (now - lastEmitMs >= EMIT_INTERVAL_MS) {
        lastEmitMs = now
        const candidates = dataset.pins
        const pin = candidates[Math.floor(Math.random() * candidates.length)]
        if (pin) {
          const route = dataset.routes.find((r) => r.id === pin.routeId)!
          const pos = pinPositionAt(pin, route, now)
          emitChainEvent({
            kind: KIND_TO_CHAIN[pin.kind],
            source: pin.id,
            label: pin.label,
            lng: pos[0],
            lat: pos[1],
            witness: synthWitness(pin.id),
            evidence: synthEvidence(pin.kind),
          })
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      ensureSources()
      if (!paused) rafRef.current = requestAnimationFrame(tick)
    }

    if (map.isStyleLoaded()) start()
    else map.once('load', start)

    // Re-apply layers after style swaps (e.g. dev HMR).
    const onStyle = () => {
      try { ensureSources() } catch { /* noop */ }
    }
    map.on('styledata', onStyle)

    return () => {
      unsubScene()
      map.off('styledata', onStyle)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      try {
        for (const id of [LAYER_RING, LAYER_CORE, LAYER_GLOW, LAYER_ROUTE, LAYER_TRAIL]) {
          if (map.getLayer(id)) map.removeLayer(id)
        }
        for (const id of [PIN_SOURCE_ID, ROUTE_SOURCE_ID, TRAIL_SOURCE_ID]) {
          if (map.getSource(id)) map.removeSource(id)
        }
      } catch {
        /* noop */
      }
    }
  }, [maps, mapId, paused])

  return null
}

const WITNESSES = ['ops.marina', 'field.kai', 'eng.lucas', 'reg.amelia', 'qa.theo', 'ops.sophia']
function synthWitness(seed: string): string {
  let n = 0
  for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i)) % 1024
  return WITNESSES[n % WITNESSES.length]
}

/**
 * Pick a real (non-'planet') dataset for the initial mount. If the
 * camera path starts in transit, fall back to the manhattan set so
 * pins are visible the moment the user starts scrolling.
 */
function pickDatasetKey(region: Region): Region {
  return region === 'planet' ? 'manhattan' : region
}

function synthEvidence(kind: ManhattanPinKind): string[] {
  switch (kind) {
    case 'sensor':
      return ['device-attest.cose', 'reading.cbor', 'firmware-sig.pem']
    case 'alert':
      return ['threshold.policy', 'reading.cbor', 'photo.heic', 'witness-sig.cose']
    default:
      return ['gps.nmea', 'odometer.json', 'driver-attest.cose']
  }
}
