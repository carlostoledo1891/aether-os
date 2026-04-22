/**
 * Procedurally-generated AIS vessel fixtures for the Atlantic Maritime
 * instance. Hand-authoring 78 vessels is busywork — instead we use a
 * seeded LCG so the dataset is deterministic across reloads (the user
 * can refresh the workspace and see the same fleet) but we still get
 * realistic spatial spread without hand-typing every MMSI.
 *
 * 78 vessels = the kpi the instance config advertises.
 *
 * Patrol vessels (VES-PATROL-001..007) are pinned to specific AOIs to
 * match the assignedAssets references in fixtures/aois.ts.
 */

import type {
  VesselFlag,
  VesselRecord,
  VesselTrackPoint,
  VesselType,
} from '../types'

/** Mulberry32 PRNG — small, fast, deterministic. */
function makePrng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6D2B79F5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FLAGS_BY_TYPE: Record<VesselType, VesselFlag[]> = {
  cargo: ['PA', 'LR', 'MH', 'GR', 'CY', 'BS', 'NL'],
  tanker: ['PA', 'LR', 'GR', 'CY', 'NO', 'GB'],
  fishing: ['US', 'BR', 'JP'],
  passenger: ['US', 'GB', 'NO', 'NL'],
  patrol: ['US'],
  unknown: ['UNK', 'PA', 'MH'],
}

const NAME_PREFIXES: Record<VesselType, string[]> = {
  cargo: ['Atlantic', 'Cape', 'Ocean', 'Hyundai', 'Maersk', 'CMA CGM', 'Evergreen', 'OOCL'],
  tanker: ['Stena', 'Frontline', 'Nordic', 'Eagle', 'Energy', 'Sovereign'],
  fishing: ['Wanchese', 'Outer Banks', 'Hatteras', 'Salty Dawg', 'Reel Time', 'Sea Hawk'],
  passenger: ['Spirit of', 'Cape May', 'Liberty', 'Norfolk Star'],
  patrol: ['USCGC'],
  unknown: ['MV', 'Vessel'],
}
const NAME_SUFFIXES = [
  'Vega', 'Orion', 'Sirius', 'Polaris', 'Pegasus', 'Atlas', 'Lyra', 'Aquila',
  'Andromeda', 'Cassiopeia', 'Hyperion', 'Boreas', 'Argonaut', 'Triton',
  'Neptune', 'Mariner', 'Voyager', 'Endeavour', 'Resolute', 'Sentinel',
  'Hornbill', 'Albatross', 'Gannet', 'Petrel',
]

const TYPE_DISTRIBUTION: VesselType[] = [
  // 78 total vessels (matches the kpi). Frequencies tuned to look
  // realistic against US east-coast traffic.
  ...Array(25).fill('cargo'),
  ...Array(15).fill('tanker'),
  ...Array(18).fill('fishing'),
  ...Array(8).fill('passenger'),
  ...Array(7).fill('patrol'),
  ...Array(5).fill('unknown'),
] as VesselType[]

/** AOI centroids used to spatially anchor patrol vessels (matches aois.ts). */
const PATROL_ANCHORS: Array<[number, number]> = [
  [-76.05, 36.92], // Norfolk Approach
  [-76.05, 36.92], // Norfolk Approach (2nd cutter)
  [-75.88, 36.78], // VA Beach exclusion
  [-76.32, 36.95], // Norfolk Naval
  [-74.95, 37.55], // Offshore Reserve North
  [-75.32, 35.42], // Cape Hatteras
  [-74.82, 38.22], // Delmarva North
]

/** Base reference time used by all generated track points. */
const NOW_REF = new Date('2026-04-18T14:00:00Z').getTime()

interface SpawnRegion {
  lng: number
  lat: number
  /** Half-extent in degrees; a uniform box around (lng, lat). */
  spread: number
}

const SPAWN_REGIONS_BY_TYPE: Record<VesselType, SpawnRegion[]> = {
  // Heavy cargo concentrates on the bay-mouth and offshore lane.
  cargo: [
    { lng: -75.97, lat: 37.05, spread: 0.45 },
    { lng: -73.95, lat: 36.05, spread: 0.9 },
    { lng: -75.85, lat: 36.88, spread: 0.35 },
  ],
  tanker: [
    { lng: -75.97, lat: 37.05, spread: 0.55 },
    { lng: -73.95, lat: 36.05, spread: 0.7 },
  ],
  // Fishing fleet hugs the Outer Banks.
  fishing: [
    { lng: -75.55, lat: 35.65, spread: 0.5 },
    { lng: -75.62, lat: 35.78, spread: 0.3 },
    { lng: -76.51, lat: 34.62, spread: 0.4 },
  ],
  // Passengers near the Bay-mouth and Wallops corridor.
  passenger: [
    { lng: -75.97, lat: 37.05, spread: 0.4 },
    { lng: -74.82, lat: 38.22, spread: 0.3 },
  ],
  patrol: [{ lng: -75.5, lat: 36.5, spread: 0.5 }],
  unknown: [
    { lng: -74.5, lat: 36.5, spread: 1.1 },
    { lng: -75.95, lat: 37.0, spread: 0.6 },
  ],
}

function pickRegion(type: VesselType, prng: () => number): SpawnRegion {
  const regions = SPAWN_REGIONS_BY_TYPE[type]
  return regions[Math.floor(prng() * regions.length)]
}

function buildTrack(
  start: [number, number],
  type: VesselType,
  prng: () => number,
  numPoints: number,
): VesselTrackPoint[] {
  const points: VesselTrackPoint[] = []
  let lng = start[0]
  let lat = start[1]
  let heading = Math.floor(prng() * 360)
  const baseSpeed =
    type === 'patrol'
      ? 14 + prng() * 6
      : type === 'fishing'
      ? 4 + prng() * 5
      : type === 'cargo'
      ? 14 + prng() * 8
      : type === 'tanker'
      ? 12 + prng() * 5
      : 10 + prng() * 8
  for (let i = 0; i < numPoints; i++) {
    // ~1 minute between fixes (real AIS = 6s..3min depending on vessel).
    const t = NOW_REF - (numPoints - 1 - i) * 60_000
    const speedKt = Math.max(2, baseSpeed + (prng() - 0.5) * 3)
    points.push({
      lng,
      lat,
      timestamp: new Date(t).toISOString(),
      speed: Math.round(speedKt * 10) / 10,
      heading,
    })
    // Convert speed (knots) to degrees per minute and step.
    const distDeg = (speedKt / 60) * (1 / 60) // knots → deg-lat per minute
    const headingRad = (heading * Math.PI) / 180
    lng += distDeg * Math.sin(headingRad) / Math.cos((lat * Math.PI) / 180)
    lat += distDeg * Math.cos(headingRad)
    // Small heading drift (±5°).
    heading = (heading + (prng() - 0.5) * 10 + 360) % 360
  }
  return points
}

function buildName(type: VesselType, prng: () => number, index: number): string {
  if (type === 'patrol') return `USCGC ${NAME_SUFFIXES[index % NAME_SUFFIXES.length]}`
  const prefix = NAME_PREFIXES[type][Math.floor(prng() * NAME_PREFIXES[type].length)]
  const suffix = NAME_SUFFIXES[Math.floor(prng() * NAME_SUFFIXES.length)]
  return `${prefix} ${suffix}`
}

function buildMmsi(prng: () => number, flag: VesselFlag): string {
  // Real MMSI prefixes (MID, Maritime Identification Digit) per ITU.
  const midByFlag: Record<VesselFlag, number> = {
    US: 366, PA: 351, LR: 636, MH: 538, CN: 412, GB: 232, NL: 244, GR: 237,
    NO: 257, JP: 431, KR: 440, BS: 308, CY: 209, BR: 710, UNK: 999,
  }
  const mid = midByFlag[flag]
  const tail = Math.floor(prng() * 1_000_000).toString().padStart(6, '0')
  return `${mid}${tail}`
}

function buildLoa(type: VesselType, prng: () => number): number {
  const ranges: Record<VesselType, [number, number]> = {
    cargo: [180, 360],
    tanker: [220, 330],
    fishing: [12, 35],
    passenger: [60, 150],
    patrol: [50, 95],
    unknown: [30, 200],
  }
  const [min, max] = ranges[type]
  return Math.round(min + prng() * (max - min))
}

function buildAll(): VesselRecord[] {
  const prng = makePrng(20260418) // sprint-launch date as seed
  let patrolIdx = 0

  return TYPE_DISTRIBUTION.map((type, i): VesselRecord => {
    const id =
      type === 'patrol'
        ? `VES-PATROL-${String(++patrolIdx).padStart(3, '0')}`
        : `VES-${String(i + 1).padStart(3, '0')}`
    const flag = FLAGS_BY_TYPE[type][
      Math.floor(prng() * FLAGS_BY_TYPE[type].length)
    ]
    let region: SpawnRegion
    if (type === 'patrol' && patrolIdx <= PATROL_ANCHORS.length) {
      const [lng, lat] = PATROL_ANCHORS[patrolIdx - 1]
      region = { lng, lat, spread: 0.06 }
    } else {
      region = pickRegion(type, prng)
    }
    const start: [number, number] = [
      region.lng + (prng() - 0.5) * 2 * region.spread,
      region.lat + (prng() - 0.5) * 2 * region.spread,
    ]
    const numPoints = 6 + Math.floor(prng() * 5)
    return {
      id,
      mmsi: buildMmsi(prng, flag),
      name: buildName(type, prng, i),
      flag,
      type,
      loa_m: buildLoa(type, prng),
      track: buildTrack(start, type, prng, numPoints),
    }
  })
}

export const MARITIME_VESSELS: VesselRecord[] = buildAll()
