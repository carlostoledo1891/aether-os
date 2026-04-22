/**
 * Patrol Areas of Interest along the mid-Atlantic coast.
 * 11 polygons covering the Hampton Roads / Chesapeake mouth / Outer Banks
 * corridor — enough density to communicate "this is a maritime monitoring
 * app" within ~10 seconds of loading the workspace.
 *
 * Coordinates are hand-authored over the realistic geography. Names and
 * personas are fictional; the operating tenant (Atlantic Coast Maritime
 * Authority) is a demo persona.
 */

import type { MaritimeAoi } from '../types'

/**
 * Build a tilted rectangle around a centroid (lng, lat) with east-west
 * width / north-south height in degrees and a clockwise-positive bearing
 * (degrees). Returned ring is a closed polygon — first == last vertex.
 */
function rect(
  centerLng: number,
  centerLat: number,
  widthDeg: number,
  heightDeg: number,
  bearing = 0,
): [number, number][] {
  const halfW = widthDeg / 2
  const halfH = heightDeg / 2
  const corners: [number, number][] = [
    [-halfW, -halfH],
    [halfW, -halfH],
    [halfW, halfH],
    [-halfW, halfH],
  ]
  const theta = (bearing * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const ring: [number, number][] = corners.map(([dx, dy]) => [
    centerLng + (dx * cos - dy * sin),
    centerLat + (dx * sin + dy * cos),
  ])
  ring.push(ring[0])
  return ring
}

export const MARITIME_AOIS: MaritimeAoi[] = [
  {
    id: 'AOI-NORFOLK-APPROACH',
    name: 'Norfolk Approach',
    classification: 'patrol',
    ring: rect(-76.05, 36.92, 0.42, 0.32, 8),
    description:
      'Eastern approach corridor to Hampton Roads. 24/7 patrol coverage with two cutter assets.',
    assignedAssets: ['VES-PATROL-001', 'VES-PATROL-002'],
  },
  {
    id: 'AOI-CAPE-HENRY',
    name: 'Cape Henry Anchorage',
    classification: 'commercial_lane',
    ring: rect(-75.85, 36.88, 0.38, 0.22, -4),
    description:
      'Inbound deep-draft anchorage. Commercial lane with shared traffic-separation scheme.',
    assignedAssets: [],
  },
  {
    id: 'AOI-VA-BEACH-EXCL',
    name: 'Virginia Beach Exclusion Zone',
    classification: 'restricted',
    ring: rect(-75.88, 36.78, 0.28, 0.22),
    description:
      'Restricted operating area co-managed with Joint Expeditionary Base. No transit without clearance.',
    assignedAssets: ['VES-PATROL-003'],
  },
  {
    id: 'AOI-CHESAPEAKE-MOUTH',
    name: 'Chesapeake Bay Mouth',
    classification: 'commercial_lane',
    ring: rect(-75.97, 37.05, 0.55, 0.18, 12),
    description: 'Bay-mouth traffic separation — primary container/tanker conduit.',
    assignedAssets: [],
  },
  {
    id: 'AOI-NORFOLK-NAVAL',
    name: 'Norfolk Naval Station',
    classification: 'restricted',
    ring: rect(-76.32, 36.95, 0.18, 0.12, -6),
    description:
      'Joint exclusion zone. Coordinated with NavStation Norfolk port operations.',
    assignedAssets: ['VES-PATROL-004'],
  },
  {
    id: 'AOI-OFFSHORE-RES-1',
    name: 'Offshore Reserve North',
    classification: 'environmental',
    ring: rect(-74.95, 37.55, 0.78, 0.42, 5),
    description: 'Right-whale calving overlap — seasonal speed restriction enforced May–Nov.',
    assignedAssets: ['VES-PATROL-005'],
  },
  {
    id: 'AOI-CAPE-HATTERAS',
    name: 'Cape Hatteras Watch',
    classification: 'patrol',
    ring: rect(-75.32, 35.42, 0.62, 0.34, 22),
    description: 'Outer Banks transit funnel. High-incident corridor; weather-driven SAR posture.',
    assignedAssets: ['VES-PATROL-006'],
  },
  {
    id: 'AOI-CAPE-LOOKOUT',
    name: 'Cape Lookout Approach',
    classification: 'patrol',
    ring: rect(-76.51, 34.62, 0.55, 0.32, 18),
    description: 'Southern flank. Joint patrol with USCG Sector NC.',
    assignedAssets: [],
  },
  {
    id: 'AOI-MID-ATL-LANE',
    name: 'Mid-Atlantic Shipping Lane',
    classification: 'commercial_lane',
    ring: rect(-73.95, 36.05, 1.4, 0.32, 28),
    description: 'NYC ↔ Caribbean container backbone. Tracked but not actively patrolled.',
    assignedAssets: [],
  },
  {
    id: 'AOI-TURTLE-NEST',
    name: 'Sea Turtle Nesting Buffer',
    classification: 'environmental',
    ring: rect(-75.62, 35.78, 0.45, 0.18, 14),
    description: 'Loggerhead nesting buffer — seasonal lighting & noise restrictions.',
    assignedAssets: [],
  },
  {
    id: 'AOI-DELMARVA-NORTH',
    name: 'Delmarva North Watch',
    classification: 'patrol',
    ring: rect(-74.82, 38.22, 0.52, 0.32, -8),
    description: 'Wallops launch overflight buffer; coordinates with NASA range safety.',
    assignedAssets: ['VES-PATROL-007'],
  },
]
