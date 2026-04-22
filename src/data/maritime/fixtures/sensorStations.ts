/**
 * Sensor stations covering the Atlantic Maritime AOIs. Mix of shore
 * radar pedestals, satellite-pass swath centroids, and persistent UAV
 * orbit anchors — the three sensor families the demo persona narrates
 * during the workspace tour.
 */

import type { SensorStation } from '../types'

export const MARITIME_SENSOR_STATIONS: SensorStation[] = [
  {
    id: 'SEN-RAD-CAPE-HENRY',
    kind: 'shore_radar',
    name: 'Cape Henry Radar Pedestal',
    coordinates: [-75.998, 36.926],
    range_km: 65,
    status: 'nominal',
    detail: 'X-band coastal surveillance radar — primary track source for Norfolk Approach AOI.',
  },
  {
    id: 'SEN-RAD-OREGON-INLET',
    kind: 'shore_radar',
    name: 'Oregon Inlet Radar',
    coordinates: [-75.535, 35.78],
    range_km: 55,
    status: 'nominal',
    detail: 'Outer Banks coverage — Oregon Inlet to Cape Hatteras transit corridor.',
  },
  {
    id: 'SEN-RAD-CAPE-LOOKOUT',
    kind: 'shore_radar',
    name: 'Cape Lookout Radar',
    coordinates: [-76.535, 34.62],
    range_km: 50,
    status: 'degraded',
    detail: 'Reduced range due to scheduled antenna service. Reverts to full coverage 18 Apr.',
  },
  {
    id: 'SEN-SAT-MORNING-PASS',
    kind: 'satellite_pass',
    name: 'Sentinel-1A Morning Swath',
    coordinates: [-74.6, 37.05],
    range_km: 140,
    status: 'nominal',
    detail: 'Synthetic-aperture radar pass 06:42 UTC. Twice-daily coverage of the offshore lanes.',
  },
  {
    id: 'SEN-SAT-EVENING-PASS',
    kind: 'satellite_pass',
    name: 'Sentinel-1B Evening Swath',
    coordinates: [-75.1, 36.4],
    range_km: 140,
    status: 'nominal',
    detail: 'Evening complementary pass at 18:11 UTC.',
  },
  {
    id: 'SEN-UAV-CHESAPEAKE',
    kind: 'drone_orbit',
    name: 'MQ-9 Persistent Orbit "Sentry-3"',
    coordinates: [-75.45, 37.18],
    range_km: 75,
    status: 'nominal',
    detail: 'Persistent UAV orbit over the bay-mouth approach. EO/IR + AIS rebroadcast.',
  },
]
