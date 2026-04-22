/**
 * Marketing-only NYC-region corridor routes for the moving-pin demo.
 *
 * Each route is an open polyline traced (by hand) over real corridors
 * radiating out from Manhattan — including outer-borough roads, the
 * NJ waterfront/Turnpike, the Hudson Valley, Long Island, and the
 * I-95 NE corridor out to Bridgeport, CT. Pins follow these polylines
 * in a continuous ping-pong motion so they never "snap" back to the
 * start.
 *
 * The set is tuned to fill the full visible canvas of the marketing
 * globe at the locked Manhattan camera (zoom ~11.6, pitch ~56, bearing
 * -28°), which exposes a roughly ~75 km radius around the island.
 *
 * Pure data + math — no map runtime dependencies.
 */

export type ManhattanPinKind = 'asset' | 'sensor' | 'alert'

export interface ManhattanRoute {
  id: string
  /** Polyline waypoints `[lng, lat]`, open path; pins ping-pong end-to-end. */
  coords: Array<[number, number]>
  /** Time (ms) for one full one-way traversal of the polyline. */
  oneWayMs: number
}

export interface ManhattanPin {
  id: string
  routeId: string
  /** Phase offset along the route in cycles (0..2 — 0..1 forward, 1..2 reverse). */
  phaseOffset: number
  /** Per-pin speed multiplier so pins on the same route don't lock-step. */
  speedMul: number
  kind: ManhattanPinKind
  /** Synthetic asset label (used later if we ever surface tooltips). */
  label: string
}

// ─── Manhattan corridor routes ─────────────────────────────────────────────

export const MANHATTAN_ROUTES: ManhattanRoute[] = [
  // R1: Broadway diagonal — Battery → Times Sq → Harlem
  {
    id: 'broadway',
    oneWayMs: 90_000,
    coords: [
      [-74.0140, 40.7033], // Battery
      [-74.0119, 40.7080], // Wall St
      [-74.0073, 40.7180], // Tribeca
      [-74.0030, 40.7250], // SoHo
      [-73.9990, 40.7330], // Greenwich Village
      [-73.9905, 40.7350], // Union Sq
      [-73.9890, 40.7410], // Flatiron
      [-73.9858, 40.7480], // Herald Sq
      [-73.9855, 40.7580], // Times Sq
      [-73.9830, 40.7620], // 50th & Broadway
      [-73.9818, 40.7680], // Columbus Circle
      [-73.9700, 40.7790], // CPW & 79th
      [-73.9601, 40.7910], // 110th
      [-73.9530, 40.8070], // 125th
      [-73.9460, 40.8200], // 145th
    ],
  },
  // R2: 5th Avenue — Washington Sq → Met Museum → 96th
  {
    id: '5th-ave',
    oneWayMs: 78_000,
    coords: [
      [-73.9974, 40.7308], // Washington Sq
      [-73.9943, 40.7400], // 23rd & 5th
      [-73.9870, 40.7480], // 34th & 5th
      [-73.9836, 40.7549], // 42nd & 5th (NYPL)
      [-73.9760, 40.7649], // 5th & 59th (Plaza)
      [-73.9636, 40.7794], // Met Museum
      [-73.9550, 40.7849], // 5th & 96th
    ],
  },
  // R3: FDR / east side — Battery → Stuy Town → UES → 116th
  {
    id: 'fdr-east',
    oneWayMs: 82_000,
    coords: [
      [-74.0030, 40.7060], // South Street Seaport
      [-73.9810, 40.7180], // 14th & FDR (East River Park)
      [-73.9710, 40.7345], // 23rd & FDR
      [-73.9700, 40.7460], // 34th & FDR
      [-73.9670, 40.7520], // UN (42nd & FDR)
      [-73.9580, 40.7625], // 60th & FDR
      [-73.9470, 40.7770], // 79th & FDR
      [-73.9398, 40.7848], // 96th & FDR
      [-73.9330, 40.7950], // 116th & FDR
    ],
  },
  // R4: West Side Highway — Battery Park City → Riverside → 125th
  {
    id: 'west-side',
    oneWayMs: 88_000,
    coords: [
      [-74.0180, 40.7110], // Battery Park City
      [-74.0095, 40.7256], // Hudson Yards entry / Tribeca
      [-74.0090, 40.7415], // Chelsea Piers
      [-74.0050, 40.7555], // 34th & 11th
      [-73.9990, 40.7640], // Hell's Kitchen
      [-73.9920, 40.7710], // Lincoln Tunnel area / 50s
      [-73.9844, 40.7888], // 79th & WSH
      [-73.9740, 40.7942], // 96th & WSH
      [-73.9670, 40.8000], // 110th
      [-73.9600, 40.8110], // 125th
    ],
  },
  // R5: 14th St crosstown
  {
    id: '14th-cross',
    oneWayMs: 52_000,
    coords: [
      [-74.0085, 40.7385], // 14th & 11th
      [-74.0010, 40.7370], // 14th & 8th
      [-73.9966, 40.7370], // 14th & 7th
      [-73.9920, 40.7355], // Union Sq
      [-73.9870, 40.7340], // 14th & 3rd
      [-73.9785, 40.7320], // 14th & FDR
    ],
  },
  // R6: 42nd St crosstown
  {
    id: '42nd-cross',
    oneWayMs: 56_000,
    coords: [
      [-73.9990, 40.7600], // 42nd & 11th
      [-73.9920, 40.7589], // 42nd & 9th (Port Authority)
      [-73.9855, 40.7580], // Times Sq
      [-73.9836, 40.7549], // 42nd & 5th
      [-73.9772, 40.7527], // Grand Central
      [-73.9700, 40.7515], // 42nd & 2nd
      [-73.9670, 40.7520], // 42nd & FDR (UN)
    ],
  },
  // R7: 86th St crosstown (UWS ↔ UES)
  {
    id: '86th-cross',
    oneWayMs: 50_000,
    coords: [
      [-73.9805, 40.7860], // 86th & WSH
      [-73.9760, 40.7855], // 86th & Broadway
      [-73.9710, 40.7849], // 86th & CPW
      [-73.9620, 40.7790], // 86th & 5th
      [-73.9550, 40.7775], // 86th & Park
      [-73.9490, 40.7765], // 86th & Lex
      [-73.9415, 40.7755], // 86th & FDR
    ],
  },
  // R8: Wall St / Financial District micro-loop
  {
    id: 'wall-st-loop',
    oneWayMs: 38_000,
    coords: [
      [-74.0114, 40.7066], // Wall St & Broadway
      [-74.0090, 40.7060], // Wall & Nassau
      [-74.0068, 40.7050], // Wall & Pearl
      [-74.0058, 40.7080], // Pine St
      [-74.0084, 40.7088], // Maiden Lane
      [-74.0114, 40.7086], // Broadway & Liberty
      [-74.0114, 40.7066], // back to start (closes loop visually)
    ],
  },

  // ─── Outer-borough / regional routes ─────────────────────────────────────
  // Camera (zoom 11.6, pitch 56, bearing -28) shows well beyond Manhattan;
  // these routes spread the pin field into Brooklyn, Queens, the Bronx,
  // the Jersey waterfront and NY Harbor so the canvas reads as a regional
  // operations picture rather than an island-only one.

  // R9: Brooklyn waterfront — Williamsburg → DUMBO → Red Hook → Sunset Park
  {
    id: 'bk-waterfront',
    oneWayMs: 96_000,
    coords: [
      [-73.9620, 40.7160], // Williamsburg waterfront
      [-73.9690, 40.7100], // South Williamsburg
      [-73.9760, 40.7035], // Navy Yard
      [-73.9870, 40.7020], // DUMBO / BK Bridge approach
      [-74.0040, 40.6990], // Brooklyn Heights promenade
      [-74.0090, 40.6840], // Red Hook
      [-74.0150, 40.6700], // Sunset Park waterfront
      [-74.0220, 40.6510], // Bay Ridge
    ],
  },

  // R10: Brooklyn arc — BK Bridge → Atlantic → Prospect Park → Greenwood
  {
    id: 'bk-arc',
    oneWayMs: 84_000,
    coords: [
      [-73.9900, 40.7030], // BK Bridge BK side
      [-73.9830, 40.6920], // Boerum Hill
      [-73.9760, 40.6855], // Atlantic Ave / Barclays
      [-73.9700, 40.6790], // Park Slope
      [-73.9690, 40.6710], // Prospect Park west
      [-73.9810, 40.6620], // Greenwood Cemetery
      [-73.9900, 40.6520], // Sunset Park east
    ],
  },

  // R11: Queens lateral — LIC → Astoria → Flushing Meadows
  {
    id: 'queens-lateral',
    oneWayMs: 92_000,
    coords: [
      [-73.9520, 40.7440], // LIC / Court Sq
      [-73.9430, 40.7480], // Hunters Point
      [-73.9320, 40.7610], // Astoria
      [-73.9220, 40.7650], // Astoria Park
      [-73.9080, 40.7560], // Steinway
      [-73.8920, 40.7480], // Jackson Heights
      [-73.8730, 40.7440], // Corona
      [-73.8460, 40.7470], // Flushing Meadows / Citi Field
    ],
  },

  // R12: Bronx — Yankee Stadium → Bronx Zoo → Pelham Pkwy
  {
    id: 'bronx-east',
    oneWayMs: 98_000,
    coords: [
      [-73.9265, 40.8296], // Yankee Stadium
      [-73.9180, 40.8390], // 161st & 3rd
      [-73.9080, 40.8460], // Tremont
      [-73.8960, 40.8530], // Belmont (Little Italy)
      [-73.8770, 40.8500], // Bronx Zoo
      [-73.8580, 40.8580], // Pelham Pkwy
      [-73.8400, 40.8650], // Eastchester
    ],
  },

  // R13: Jersey waterfront — Jersey City → Hoboken → Edgewater → GWB
  {
    id: 'nj-waterfront',
    oneWayMs: 102_000,
    coords: [
      [-74.0440, 40.7090], // Jersey City Exchange Place
      [-74.0390, 40.7180], // Newport
      [-74.0290, 40.7340], // Hoboken Terminal
      [-74.0230, 40.7480], // Hoboken North
      [-74.0170, 40.7700], // Weehawken
      [-74.0090, 40.7900], // Edgewater
      [-73.9960, 40.8120], // Fort Lee / GWB approach
      [-73.9870, 40.8260], // GWB NJ side
    ],
  },

  // R14: NY Harbor — Battery → Liberty Island → Staten Island Ferry → Sunset Park
  {
    id: 'ny-harbor',
    oneWayMs: 110_000,
    coords: [
      [-74.0150, 40.7030], // Battery Park
      [-74.0290, 40.6960], // mid-harbor
      [-74.0445, 40.6892], // Liberty Island
      [-74.0535, 40.6820], // Ellis area
      [-74.0670, 40.6620], // Staten Island Ferry approach
      [-74.0530, 40.6450], // Bay Ridge channel
      [-74.0250, 40.6350], // Lower NY Bay
    ],
  },

  // R15: Bronx west / GWB → Riverdale (rounds out the upper-left corner)
  {
    id: 'bronx-west',
    oneWayMs: 76_000,
    coords: [
      [-73.9420, 40.8500], // High Bridge
      [-73.9180, 40.8650], // Fordham
      [-73.9060, 40.8780], // Bedford Park
      [-73.8980, 40.8920], // Norwood
      [-73.9080, 40.9020], // Van Cortlandt Park
    ],
  },

  // ─── Long-haul regional corridors (Bridgeport-radius spread) ─────────────
  // These reach to the far edges of the visible globe canvas so the demo
  // reads as a full tri-state operations field, not just a city map.

  // R16: I-95 NE corridor — Bronx → New Rochelle → Stamford CT → Bridgeport CT
  {
    id: 'i95-ne',
    oneWayMs: 220_000,
    coords: [
      [-73.8580, 40.8560], // Throgs Neck (Bronx)
      [-73.8210, 40.8810], // Pelham
      [-73.7720, 40.9100], // New Rochelle
      [-73.7140, 40.9540], // Mamaroneck
      [-73.6720, 40.9810], // Rye
      [-73.6260, 41.0050], // Port Chester
      [-73.5750, 41.0380], // Greenwich CT
      [-73.5390, 41.0540], // Stamford CT
      [-73.4860, 41.0830], // Darien CT
      [-73.4150, 41.1180], // Norwalk CT
      [-73.3290, 41.1500], // Westport CT
      [-73.2480, 41.1740], // Fairfield CT
      [-73.1948, 41.1865], // Bridgeport CT (terminus)
    ],
  },

  // R17: Long Island Expressway — Queens → Garden City → Hicksville → Huntington
  {
    id: 'long-island-east',
    oneWayMs: 200_000,
    coords: [
      [-73.8400, 40.7370], // Long Island City exit
      [-73.7770, 40.7440], // Forest Hills
      [-73.7210, 40.7330], // Jamaica / Van Wyck
      [-73.6620, 40.7250], // Floral Park
      [-73.6188, 40.7062], // Hempstead
      [-73.5650, 40.7320], // Westbury
      [-73.5140, 40.7680], // Hicksville
      [-73.4710, 40.8100], // Plainview
      [-73.4276, 40.8687], // Huntington
      [-73.3900, 40.9100], // Northport
    ],
  },

  // R18: Hudson Valley — GWB → Yonkers → Tarrytown → Peekskill → West Point
  {
    id: 'hudson-valley',
    oneWayMs: 210_000,
    coords: [
      [-73.9480, 40.8510], // GWB Manhattan side
      [-73.9020, 40.9300], // Yonkers
      [-73.8800, 40.9870], // Hastings-on-Hudson
      [-73.8587, 41.0762], // Tarrytown
      [-73.9050, 41.1700], // Ossining (Sing Sing)
      [-73.9210, 41.2901], // Peekskill
      [-73.9560, 41.3500], // Garrison
      [-73.9737, 41.3915], // West Point
    ],
  },

  // R19: NJ Turnpike S — Newark → Elizabeth → Edison → New Brunswick
  {
    id: 'nj-turnpike-south',
    oneWayMs: 180_000,
    coords: [
      [-74.1745, 40.7357], // Newark Penn Station
      [-74.2090, 40.6900], // Elizabeth
      [-74.2440, 40.6520], // Linden
      [-74.2810, 40.6090], // Rahway
      [-74.3130, 40.5760], // Woodbridge
      [-74.3580, 40.5360], // Metuchen / Edison
      [-74.4080, 40.4980], // Edison interchange
      [-74.4518, 40.4862], // New Brunswick
    ],
  },

  // R20: NJ Shore — Staten Island → Sandy Hook → Long Branch → Asbury Park
  {
    id: 'nj-shore',
    oneWayMs: 230_000,
    coords: [
      [-74.1450, 40.5790], // Staten Island south
      [-74.0830, 40.5400], // Verrazzano south
      [-74.0500, 40.5040], // Atlantic Highlands
      [-74.0073, 40.4669], // Sandy Hook
      [-73.9890, 40.4040], // Long Branch
      [-74.0010, 40.3500], // Deal
      [-74.0121, 40.2204], // Asbury Park (terminus)
    ],
  },

  // R21: NJ inland — Newark → Paterson → Morristown
  {
    id: 'nj-inland',
    oneWayMs: 200_000,
    coords: [
      [-74.1745, 40.7357], // Newark
      [-74.1920, 40.7710], // Bloomfield
      [-74.1718, 40.9168], // Paterson
      [-74.2400, 40.8920], // Wayne
      [-74.3300, 40.8500], // Boonton
      [-74.4810, 40.7968], // Morristown (terminus)
    ],
  },

  // R22: Westchester inland — Bronx → White Plains → Danbury CT
  {
    id: 'westchester-inland',
    oneWayMs: 215_000,
    coords: [
      [-73.8650, 40.8930], // Yonkers / Bronx border
      [-73.8400, 40.9450], // Scarsdale
      [-73.7629, 41.0340], // White Plains
      [-73.7180, 41.1080], // Pleasantville
      [-73.6580, 41.1850], // Bedford
      [-73.5740, 41.2700], // Brewster NY
      [-73.4540, 41.3948], // Danbury CT (terminus)
    ],
  },
]

const ROUTE_BY_ID = Object.fromEntries(MANHATTAN_ROUTES.map((r) => [r.id, r])) as Record<
  string,
  ManhattanRoute
>

export function getRoute(id: string): ManhattanRoute | undefined {
  return ROUTE_BY_ID[id]
}

// ─── Pin roster (40 pins) ──────────────────────────────────────────────────

/**
 * Distribution rationale (Bridgeport-radius spread):
 *  - Manhattan core (R1..R8): 19 pins (avenues, crosstowns, FiDi loop)
 *  - Inner regional (R9..R15): 14 pins (BK, Queens, Bronx, NJ waterfront, harbor)
 *  - Long-haul (R16..R22): 21 pins reaching CT, LI, Hudson Valley, NJ inland
 *  - Alerts: 6 amber pulses, half on long-haul corridors so the far
 *    quadrants of the canvas also light up
 *  - Total ≈ 60 pins spread across the full visible region.
 */

const VIOLET_LABELS = [
  'AST-1041 · van', 'AST-1042 · van', 'AST-1043 · truck', 'AST-1044 · truck', 'AST-1045 · van',
  'AST-1046 · cargo', 'AST-1047 · cargo', 'AST-1048 · van', 'AST-1049 · truck', 'AST-1050 · van',
  'AST-1051 · cargo', 'AST-1052 · van', 'AST-1053 · cargo', 'AST-1054 · truck', 'AST-1055 · van',
  'AST-1056 · cargo', 'AST-1057 · truck', 'AST-1058 · van', 'AST-1059 · cargo', 'AST-1060 · truck',
]
const CYAN_LABELS = [
  'SEN-204 · air', 'SEN-205 · noise', 'SEN-206 · flow', 'SEN-207 · level',
  'SEN-208 · vib',  'SEN-209 · temp',
]
const AMBER_LABELS = [
  'ALT-3001 · breach', 'ALT-3002 · alarm', 'ALT-3003 · breach',
  'ALT-3004 · alarm', 'ALT-3005 · breach', 'ALT-3006 · alarm',
]

let pinCounter = 0
function makeAssetPins(routeId: string, count: number): ManhattanPin[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = pinCounter++
    return {
      id: `${routeId}-pin-${i}`,
      routeId,
      // Spread phaseOffset across [0, 2) so pins on the same route are
      // staggered both forward and backward.
      phaseOffset: (i / count) * 2,
      speedMul: 0.85 + ((idx * 37) % 30) / 100, // 0.85..1.15 deterministic jitter
      kind: 'asset',
      label: VIOLET_LABELS[idx % VIOLET_LABELS.length],
    }
  })
}

function makeSensorPins(routeId: string, count: number): ManhattanPin[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = pinCounter++
    return {
      id: `${routeId}-sen-${i}`,
      routeId,
      phaseOffset: 0.15 + (i / count) * 2,
      speedMul: 0.6 + (i * 0.08), // sensors move slower than assets
      kind: 'sensor',
      label: CYAN_LABELS[idx % CYAN_LABELS.length],
    }
  })
}

function makeAlertPins(): ManhattanPin[] {
  // Spread alerts across inner regional + long-haul so amber pulses
  // light up multiple quadrants of the canvas — including the far edges.
  return [
    { id: 'alert-bk-waterfront', routeId: 'bk-waterfront',     phaseOffset: 0.4, speedMul: 1.05, kind: 'alert', label: AMBER_LABELS[0] },
    { id: 'alert-queens',        routeId: 'queens-lateral',    phaseOffset: 1.1, speedMul: 0.95, kind: 'alert', label: AMBER_LABELS[1] },
    { id: 'alert-nj',            routeId: 'nj-waterfront',     phaseOffset: 0.7, speedMul: 1.10, kind: 'alert', label: AMBER_LABELS[2] },
    { id: 'alert-bronx',         routeId: 'bronx-east',        phaseOffset: 1.6, speedMul: 0.90, kind: 'alert', label: AMBER_LABELS[3] },
    { id: 'alert-i95-ne',        routeId: 'i95-ne',            phaseOffset: 1.3, speedMul: 0.85, kind: 'alert', label: AMBER_LABELS[4] },
    { id: 'alert-hudson',        routeId: 'hudson-valley',     phaseOffset: 0.9, speedMul: 0.90, kind: 'alert', label: AMBER_LABELS[5] },
  ]
}

export const MANHATTAN_PINS: ManhattanPin[] = [
  // Manhattan core (slimmed from 6/route → 3/route to free budget for spread)
  ...makeAssetPins('broadway',  3),
  ...makeAssetPins('5th-ave',   3),
  ...makeAssetPins('fdr-east',  3),
  ...makeAssetPins('west-side', 3),
  ...makeSensorPins('14th-cross', 2),
  ...makeSensorPins('42nd-cross', 2),
  ...makeSensorPins('86th-cross', 2),
  ...makeAssetPins('wall-st-loop', 1),

  // Inner regional — outer boroughs, NJ waterfront, harbor
  ...makeAssetPins('bk-waterfront',  3),
  ...makeAssetPins('bk-arc',         3),
  ...makeAssetPins('queens-lateral', 3),
  ...makeAssetPins('bronx-east',     3),
  ...makeAssetPins('nj-waterfront',  2),
  ...makeSensorPins('ny-harbor',     2),
  ...makeAssetPins('bronx-west',     1),

  // Long-haul — CT, Long Island, Hudson Valley, NJ Turnpike, NJ shore
  ...makeAssetPins('i95-ne',             4), // longest corridor — densest
  ...makeAssetPins('long-island-east',   3),
  ...makeAssetPins('hudson-valley',      3),
  ...makeAssetPins('nj-turnpike-south',  3),
  ...makeAssetPins('nj-shore',           3),
  ...makeAssetPins('nj-inland',          2),
  ...makeSensorPins('westchester-inland', 3),

  ...makeAlertPins(),
]

// ─── Polyline sampling ─────────────────────────────────────────────────────

interface SegmentMeta {
  /** Cumulative segment lengths along the polyline. */
  cumulative: number[]
  total: number
}

const SEGMENT_CACHE = new WeakMap<ManhattanRoute, SegmentMeta>()

function getSegmentMeta(route: ManhattanRoute): SegmentMeta {
  const cached = SEGMENT_CACHE.get(route)
  if (cached) return cached
  const cumulative: number[] = [0]
  let total = 0
  for (let i = 1; i < route.coords.length; i++) {
    const [x1, y1] = route.coords[i - 1]
    const [x2, y2] = route.coords[i]
    total += Math.hypot(x2 - x1, y2 - y1)
    cumulative.push(total)
  }
  const meta = { cumulative, total }
  SEGMENT_CACHE.set(route, meta)
  return meta
}

/** Eased ping-pong: returns 0..1..0 with smoother turnarounds at the ends. */
function easePingPong(phase: number): number {
  // phase ∈ [0, 2), 0..1 forward, 1..2 back
  const local = phase < 1 ? phase : 2 - phase
  // Smoothstep gives gentle slow-down at endpoints
  return local * local * (3 - 2 * local)
}

/**
 * Compute the [lng, lat] of a pin at time `nowMs`, given its route +
 * phase offset + speed multiplier.
 */
export function pinPositionAt(
  pin: ManhattanPin,
  route: ManhattanRoute,
  nowMs: number,
): [number, number] {
  const cycleMs = (route.oneWayMs * 2) / pin.speedMul // ms per full ping-pong
  const cycleProgress = ((nowMs / cycleMs) + (pin.phaseOffset / 2)) % 1 // 0..1
  const phase = cycleProgress * 2 // 0..2
  const t = easePingPong(phase) // 0..1 along polyline

  const meta = getSegmentMeta(route)
  if (meta.total === 0) return route.coords[0]
  const target = t * meta.total
  // Locate the segment containing `target`
  let i = 1
  while (i < meta.cumulative.length && meta.cumulative[i] < target) i++
  const segEnd = meta.cumulative[i]
  const segStart = meta.cumulative[i - 1]
  const segLen = segEnd - segStart
  const local = segLen === 0 ? 0 : (target - segStart) / segLen
  const [x1, y1] = route.coords[i - 1]
  const [x2, y2] = route.coords[i]
  return [x1 + (x2 - x1) * local, y1 + (y2 - y1) * local]
}
