/**
 * Dark-vessel detection events for the Atlantic Maritime instance.
 * Each event references an existing vessel id and an AOI; the vessel
 * is flagged in fixtures/vessels.ts at runtime via the helper in
 * fixtures/index.ts.
 */

import type { DarkVesselEvent } from '../types'

export const MARITIME_DARK_EVENTS: DarkVesselEvent[] = [
  {
    id: 'DARK-001',
    vesselId: 'VES-031',
    detectedAt: '2026-04-18T11:42:00Z',
    aoiId: 'AOI-VA-BEACH-EXCL',
    coordinates: [-75.81, 36.79],
    summary: 'AIS dropout 11 minutes inside the Virginia Beach exclusion zone. Last known speed 9.2 kt heading 015°.',
    severity: 'action_required',
  },
  {
    id: 'DARK-002',
    vesselId: 'VES-058',
    detectedAt: '2026-04-18T09:18:00Z',
    aoiId: 'AOI-OFFSHORE-RES-1',
    coordinates: [-74.71, 37.62],
    summary: 'Vessel inside whale-conservation zone with AIS off; SAR sweep tasked Sentry-3 UAV to confirm.',
    severity: 'attention',
  },
  {
    id: 'DARK-003',
    vesselId: 'VES-072',
    detectedAt: '2026-04-17T22:05:00Z',
    aoiId: 'AOI-CAPE-HATTERAS',
    coordinates: [-75.18, 35.34],
    summary: 'Likely AIS spoofing — track delta vs Sentinel-1A SAR detection > 2.4 nm.',
    severity: 'action_required',
  },
  {
    id: 'DARK-004',
    vesselId: 'VES-046',
    detectedAt: '2026-04-17T16:50:00Z',
    aoiId: 'AOI-MID-ATL-LANE',
    coordinates: [-73.62, 36.4],
    summary: 'Dark anomaly cleared — vessel re-appeared on AIS after 38 min outage. Logged for audit follow-up.',
    severity: 'attention',
  },
]
