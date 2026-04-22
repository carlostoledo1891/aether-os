/**
 * Marketing-only Caldeira (Pará, Brazil) pin set for the Act IV scene.
 *
 * Synthetic drillholes + spring sensors + license boundary nodes
 * arranged around the Caldeira target centroid. Mirrors the production
 * Caldeira layer aesthetic (drillholes / springs / SIGMINE polygons)
 * but lives entirely in marketing fixtures.
 *
 * Pure data — no map runtime dependencies.
 */

import type { ManhattanPin, ManhattanRoute } from './manhattanRoutes'

const CENTER_LNG = -56.05
const CENTER_LAT = -1.85

/** Hand-arranged drillhole grid (synthetic) — 16 holes in a fan pattern. */
const DRILL_OFFSETS: Array<[number, number]> = [
  [-0.030, +0.020], [-0.018, +0.024], [-0.006, +0.026], [+0.006, +0.024],
  [+0.018, +0.020], [+0.030, +0.014], [-0.034, +0.006], [-0.020, +0.008],
  [-0.008, +0.010], [+0.008, +0.008], [+0.022, +0.004], [+0.034, -0.004],
  [-0.030, -0.010], [-0.014, -0.014], [+0.000, -0.016], [+0.018, -0.012],
]

/** Three spring sensors along a stream traversal SW→NE. */
const SPRING_OFFSETS: Array<[number, number]> = [
  [-0.040, -0.030], [-0.014, -0.018], [+0.020, -0.002],
]

/** Two alert points (synthetic exceedance) on the SW boundary. */
const ALERT_OFFSETS: Array<[number, number]> = [
  [-0.038, -0.028], [+0.026, +0.012],
]

/**
 * Caldeira "routes" are degenerate — drillholes don't move, they sit at
 * a single coord. We still encode them as 2-point polylines (the same
 * coord twice) so `pinPositionAt` returns a stable position.
 */
export const CALDEIRA_ROUTES: ManhattanRoute[] = [
  ...DRILL_OFFSETS.map((offset, i) => ({
    id: `cal-drill-${i}`,
    oneWayMs: 60_000,
    coords: [
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
    ] as Array<[number, number]>,
  })),
  ...SPRING_OFFSETS.map((offset, i) => ({
    id: `cal-spring-${i}`,
    oneWayMs: 60_000,
    coords: [
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
    ] as Array<[number, number]>,
  })),
  ...ALERT_OFFSETS.map((offset, i) => ({
    id: `cal-alert-${i}`,
    oneWayMs: 60_000,
    coords: [
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
      [CENTER_LNG + offset[0], CENTER_LAT + offset[1]],
    ] as Array<[number, number]>,
  })),
]

export const CALDEIRA_PINS: ManhattanPin[] = [
  ...DRILL_OFFSETS.map((_offset, i) => ({
    id: `cal-drill-pin-${i}`,
    routeId: `cal-drill-${i}`,
    phaseOffset: 0,
    speedMul: 1,
    kind: 'asset' as const,
    label: `BH-${(i + 1).toString().padStart(3, '0')} · core`,
  })),
  ...SPRING_OFFSETS.map((_offset, i) => ({
    id: `cal-spring-pin-${i}`,
    routeId: `cal-spring-${i}`,
    phaseOffset: 0,
    speedMul: 1,
    kind: 'sensor' as const,
    label: `SPR-${(i + 1).toString().padStart(3, '0')} · spring`,
  })),
  ...ALERT_OFFSETS.map((_offset, i) => ({
    id: `cal-alert-pin-${i}`,
    routeId: `cal-alert-${i}`,
    phaseOffset: 0,
    speedMul: 1,
    kind: 'alert' as const,
    label: `ALT-${(i + 1).toString().padStart(3, '0')} · turbidity`,
  })),
]

export const CALDEIRA_CENTER: [number, number] = [CENTER_LNG, CENTER_LAT]
