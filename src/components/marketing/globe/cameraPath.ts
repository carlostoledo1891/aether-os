/**
 * Marketing-globe camera path.
 *
 * The page is a single tall scroll container. Scroll position is
 * normalised to a progress value t ∈ [0, 1], and `cameraAt(t)` returns
 * the exact camera state for that moment. The camera *is* the scrollbar
 * — not animated independently, not driven by IntersectionObserver.
 *
 * Design notes:
 *   - Keyframes are sparse (12 of them) and interpolated with an
 *     ease-in-out cubic so motion feels intentional.
 *   - Bearing interpolates the *short way around* the circle so we
 *     never spin 350° to reach a -10° target.
 *   - Each keyframe carries a `region` token (manhattan / caldeira /
 *     planet) which the moving-pin overlay listens to in order to
 *     swap its dataset at the right moment (i.e. when the camera is
 *     pulled out and pin detail isn't on screen).
 *   - The transit segment (Manhattan → Caldeira) is *intentional*: the
 *     camera pulls out to the planet, sweeps across the Atlantic, then
 *     descends into Brazil. The journey reads as one of the chapters,
 *     not as a teleport.
 */

export type Region = 'manhattan' | 'caldeira' | 'planet'

export interface CameraState {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

export interface CameraSample extends CameraState {
  region: Region
}

export interface Keyframe extends CameraState {
  /** Position along the scroll track, 0..1. */
  at: number
  /** Which pin dataset should be loaded around this keyframe. */
  region: Region
}

/**
 * Camera keyframes along the scroll track.
 *
 * Story order, top → bottom:
 *   0.00 – 0.20   Manhattan thesis + first-pin detail
 *   0.20 – 0.32   Manhattan cluster, slight pull-back
 *   0.32 – 0.44   Tristate pull-back
 *   0.44 – 0.62   Honest transit across the Atlantic
 *   0.62 – 0.82   Caldeira approach + drillhole detail
 *   0.82 – 1.00   Pull out to the planet, hold for the coda
 */
const KEYFRAMES: Keyframe[] = [
  { at: 0.00, longitude: -73.9712, latitude:  40.7654, zoom: 11.6, pitch: 56, bearing: -28, region: 'manhattan' },
  { at: 0.10, longitude: -73.9850, latitude:  40.7550, zoom: 14.0, pitch: 62, bearing: -22, region: 'manhattan' },
  { at: 0.20, longitude: -73.9762, latitude:  40.7589, zoom: 15.0, pitch: 64, bearing:  -8, region: 'manhattan' },
  { at: 0.32, longitude: -73.8500, latitude:  40.9500, zoom:  8.4, pitch: 50, bearing: -18, region: 'manhattan' },
  { at: 0.44, longitude: -65.0000, latitude:  28.0000, zoom:  3.6, pitch: 25, bearing: -10, region: 'planet'    },
  { at: 0.54, longitude: -55.0000, latitude:  10.0000, zoom:  2.6, pitch:  0, bearing:   0, region: 'planet'    },
  { at: 0.62, longitude: -56.0000, latitude:  -1.0000, zoom:  4.4, pitch: 30, bearing:  12, region: 'caldeira'  },
  { at: 0.72, longitude: -56.0440, latitude:  -1.8420, zoom: 13.4, pitch: 58, bearing:  18, region: 'caldeira'  },
  { at: 0.82, longitude: -56.0120, latitude:  -1.8520, zoom: 13.8, pitch: 58, bearing:  30, region: 'caldeira'  },
  { at: 0.92, longitude: -52.0000, latitude:  18.0000, zoom:  1.6, pitch:  0, bearing:   0, region: 'planet'    },
  { at: 1.00, longitude: -52.0000, latitude:  18.0000, zoom:  1.6, pitch:  0, bearing:   0, region: 'planet'    },
]

export function getKeyframes(): readonly Keyframe[] {
  return KEYFRAMES
}

export function cameraAt(t: number): CameraSample {
  const clamped = clamp01(t)

  // Endpoints — fast path.
  if (clamped <= KEYFRAMES[0].at) return sampleOf(KEYFRAMES[0])
  const last = KEYFRAMES[KEYFRAMES.length - 1]
  if (clamped >= last.at) return sampleOf(last)

  // Find the surrounding pair.
  let i = 0
  while (i < KEYFRAMES.length - 2 && KEYFRAMES[i + 1].at <= clamped) i++
  const a = KEYFRAMES[i]
  const b = KEYFRAMES[i + 1]
  const span = b.at - a.at
  const localT = span > 0 ? (clamped - a.at) / span : 0
  const e = easeInOutCubic(localT)

  return {
    longitude: lerp(a.longitude, b.longitude, e),
    latitude:  lerp(a.latitude,  b.latitude,  e),
    zoom:      lerp(a.zoom,      b.zoom,      e),
    pitch:     lerp(a.pitch,     b.pitch,     e),
    bearing:   lerpAngle(a.bearing, b.bearing, e),
    // Swap region at the midpoint so the pin overlay re-loads its
    // dataset when the camera is between regions, not on top of one.
    region: e < 0.5 ? a.region : b.region,
  }
}

function sampleOf(k: Keyframe): CameraSample {
  return {
    longitude: k.longitude,
    latitude: k.latitude,
    zoom: k.zoom,
    pitch: k.pitch,
    bearing: k.bearing,
    region: k.region,
  }
}

function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Interpolate bearing the *short way* around the 360° circle. */
function lerpAngle(a: number, b: number, t: number): number {
  const diff = ((b - a + 540) % 360) - 180
  return a + diff * t
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
