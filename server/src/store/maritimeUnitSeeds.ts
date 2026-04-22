/**
 * Maritime instance seed data.
 *
 * Mirrors a representative slice of the front-end maritime fixtures
 * (src/data/maritime) so the same unit graph engine that powers
 * Caldeira drives the Atlantic Maritime instance — same states,
 * transitions, evidence, audit chain. Keeps the data subset small
 * (one site, ~30 units) so the bundle preset stays exercise-able
 * end-to-end without bloating verifier responses.
 */

interface MaritimeAoiSeed {
  id: string
  name: string
  classification: 'patrol' | 'restricted' | 'commercial_lane' | 'environmental'
  description: string
  assignedAssets: string[]
  center: [number, number]
}

interface MaritimeVesselSeed {
  id: string
  mmsi: string
  name: string
  flag: string
  type: 'cargo' | 'tanker' | 'fishing' | 'passenger' | 'patrol' | 'unknown'
  loa_m: number
  state: 'tracked' | 'dark' | 'inspected' | 'cleared' | 'detained'
  coordinates: [number, number]
  /** AOI id this vessel is currently inside. */
  aoiId?: string
}

interface MaritimeSensorSeed {
  id: string
  kind: 'shore_radar' | 'satellite_pass' | 'drone_orbit'
  name: string
  range_km: number
  state: 'nominal' | 'degraded' | 'offline'
  detail: string
  coordinates: [number, number]
  /** AOIs this sensor covers. */
  aoiIds: string[]
}

interface MaritimeIsrProductSeed {
  id: string
  subject: string
  classification_marking: string
  authored_by: string
  authored_at: string
  state: 'drafting' | 'ready' | 'handed_off'
  vesselIds: string[]
  aoiId?: string
}

interface MaritimeIncidentSeed {
  id: string
  title: string
  severity: 'attention' | 'action_required' | 'blocked'
  state: 'open' | 'investigating' | 'resolved' | 'false_positive'
  detected_at: string
  aoiId: string
  vesselId: string
  coordinates: [number, number]
}

export const MARITIME_SITE_ID = 'SITE-MARITIME'
export const MARITIME_SITE_LABEL = 'Atlantic Coast Maritime Authority'

export const MARITIME_AOI_SEEDS: MaritimeAoiSeed[] = [
  { id: 'AOI-NORFOLK-APPROACH', name: 'Norfolk Approach', classification: 'commercial_lane', description: 'High-density inbound lane to Hampton Roads.', assignedAssets: ['VES-001'], center: [-76.05, 36.95] },
  { id: 'AOI-VA-BEACH-EXCL', name: 'Virginia Beach Exclusion', classification: 'restricted', description: 'Surface exclusion zone — no civilian transit.', assignedAssets: ['VES-002'], center: [-75.85, 36.82] },
  { id: 'AOI-CHESAPEAKE-MOUTH', name: 'Chesapeake Mouth Patrol', classification: 'patrol', description: 'Routine patrol of the Chesapeake Bay entrance.', assignedAssets: ['VES-003'], center: [-76.0, 37.05] },
  { id: 'AOI-MID-ATL-LANE', name: 'Mid-Atlantic Shipping Lane', classification: 'commercial_lane', description: 'Deep-water transit corridor.', assignedAssets: [], center: [-73.6, 36.4] },
  { id: 'AOI-OFFSHORE-RES-1', name: 'Offshore Conservation Area 1', classification: 'environmental', description: 'Right whale critical habitat — speed restrictions in effect.', assignedAssets: [], center: [-74.7, 37.6] },
  { id: 'AOI-CAPE-HATTERAS', name: 'Cape Hatteras Patrol', classification: 'patrol', description: 'Hatteras inlet patrol corridor.', assignedAssets: ['VES-004'], center: [-75.2, 35.35] },
  { id: 'AOI-DELAWARE-BAY', name: 'Delaware Bay Approach', classification: 'commercial_lane', description: 'Inbound lane to Delaware ports.', assignedAssets: [], center: [-74.95, 38.85] },
  { id: 'AOI-NJ-COAST', name: 'New Jersey Coastal Patrol', classification: 'patrol', description: 'Routine NJ shoreline patrol.', assignedAssets: ['VES-005'], center: [-74.1, 39.45] },
  { id: 'AOI-OFFSHORE-WIND', name: 'Coastal Wind Lease', classification: 'restricted', description: 'Active offshore-wind construction exclusion.', assignedAssets: [], center: [-74.8, 39.0] },
  { id: 'AOI-FISHING-N', name: 'Northern Fishing Grounds', classification: 'environmental', description: 'Managed fishery — quota enforcement.', assignedAssets: [], center: [-72.8, 39.6] },
  { id: 'AOI-FISHING-S', name: 'Southern Fishing Grounds', classification: 'environmental', description: 'Seasonal closure currently in effect.', assignedAssets: [], center: [-74.3, 36.0] },
]

export const MARITIME_VESSEL_SEEDS: MaritimeVesselSeed[] = [
  { id: 'VES-001', mmsi: '366000101', name: 'USCGC Forward', flag: 'US', type: 'patrol', loa_m: 82, state: 'tracked', coordinates: [-76.05, 36.95], aoiId: 'AOI-NORFOLK-APPROACH' },
  { id: 'VES-002', mmsi: '366000102', name: 'USCGC Bear', flag: 'US', type: 'patrol', loa_m: 82, state: 'tracked', coordinates: [-75.85, 36.82], aoiId: 'AOI-VA-BEACH-EXCL' },
  { id: 'VES-003', mmsi: '366000103', name: 'USCGC Spencer', flag: 'US', type: 'patrol', loa_m: 82, state: 'tracked', coordinates: [-76.0, 37.05], aoiId: 'AOI-CHESAPEAKE-MOUTH' },
  { id: 'VES-004', mmsi: '366000104', name: 'USCGC Reliance', flag: 'US', type: 'patrol', loa_m: 64, state: 'tracked', coordinates: [-75.2, 35.35], aoiId: 'AOI-CAPE-HATTERAS' },
  { id: 'VES-005', mmsi: '366000105', name: 'USCGC Vigorous', flag: 'US', type: 'patrol', loa_m: 64, state: 'tracked', coordinates: [-74.1, 39.45], aoiId: 'AOI-NJ-COAST' },
  { id: 'VES-024', mmsi: '371000241', name: 'Atlantic Trader', flag: 'PA', type: 'cargo', loa_m: 232, state: 'tracked', coordinates: [-75.8, 36.6], aoiId: 'AOI-NORFOLK-APPROACH' },
  { id: 'VES-031', mmsi: '371000311', name: 'Sea Phantom', flag: 'PA', type: 'cargo', loa_m: 198, state: 'dark', coordinates: [-75.81, 36.79], aoiId: 'AOI-VA-BEACH-EXCL' },
  { id: 'VES-046', mmsi: '371000461', name: 'Northern Crown', flag: 'LR', type: 'tanker', loa_m: 248, state: 'tracked', coordinates: [-73.62, 36.4], aoiId: 'AOI-MID-ATL-LANE' },
  { id: 'VES-058', mmsi: '371000581', name: 'Yi Long 88', flag: 'CN', type: 'fishing', loa_m: 62, state: 'dark', coordinates: [-74.71, 37.62], aoiId: 'AOI-OFFSHORE-RES-1' },
  { id: 'VES-072', mmsi: '371000721', name: 'Hellenic Spirit', flag: 'GR', type: 'cargo', loa_m: 219, state: 'dark', coordinates: [-75.18, 35.34], aoiId: 'AOI-CAPE-HATTERAS' },
  { id: 'VES-077', mmsi: '371000771', name: 'Norse Aurora', flag: 'NO', type: 'tanker', loa_m: 252, state: 'tracked', coordinates: [-73.4, 38.2], aoiId: 'AOI-MID-ATL-LANE' },
  { id: 'VES-078', mmsi: '371000781', name: 'Sapphire Star', flag: 'BS', type: 'passenger', loa_m: 296, state: 'tracked', coordinates: [-74.9, 38.8], aoiId: 'AOI-DELAWARE-BAY' },
]

export const MARITIME_SENSOR_SEEDS: MaritimeSensorSeed[] = [
  { id: 'SENSOR-CAPE-HENRY', kind: 'shore_radar', name: 'Cape Henry Radar', range_km: 90, state: 'nominal', detail: 'X-band coastal radar — Cape Henry pedestal.', coordinates: [-76.005, 36.927], aoiIds: ['AOI-NORFOLK-APPROACH', 'AOI-VA-BEACH-EXCL', 'AOI-CHESAPEAKE-MOUTH'] },
  { id: 'SENSOR-HATTERAS', kind: 'shore_radar', name: 'Hatteras Radar', range_km: 110, state: 'degraded', detail: 'Coastal radar — Cape Hatteras. Reduced range due to weather.', coordinates: [-75.535, 35.255], aoiIds: ['AOI-CAPE-HATTERAS'] },
  { id: 'SENSOR-CAPE-MAY', kind: 'shore_radar', name: 'Cape May Radar', range_km: 95, state: 'nominal', detail: 'Coastal radar covering Delaware Bay approach.', coordinates: [-74.96, 38.93], aoiIds: ['AOI-DELAWARE-BAY', 'AOI-NJ-COAST'] },
  { id: 'SENSOR-SAT-NRO-12', kind: 'satellite_pass', name: 'Sentinel-1A SAR Pass', range_km: 280, state: 'nominal', detail: 'Synthetic aperture radar, 06h pass over mid-Atlantic.', coordinates: [-74.5, 37.6], aoiIds: ['AOI-MID-ATL-LANE', 'AOI-OFFSHORE-RES-1'] },
  { id: 'SENSOR-DRONE-MQ9-1', kind: 'drone_orbit', name: 'Sentry-3 UAV Orbit', range_km: 75, state: 'nominal', detail: 'MQ-9 maritime variant — assigned to OFFSHORE-RES-1.', coordinates: [-74.7, 37.6], aoiIds: ['AOI-OFFSHORE-RES-1', 'AOI-MID-ATL-LANE'] },
  { id: 'SENSOR-DRONE-SCAN-2', kind: 'drone_orbit', name: 'ScanEagle Patrol-2', range_km: 35, state: 'nominal', detail: 'Tactical UAV in support of NJ coastal patrol.', coordinates: [-74.1, 39.45], aoiIds: ['AOI-NJ-COAST', 'AOI-OFFSHORE-WIND'] },
]

export const MARITIME_INCIDENT_SEEDS: MaritimeIncidentSeed[] = [
  { id: 'DARK-001', title: 'AIS dropout inside Virginia Beach Exclusion', severity: 'action_required', state: 'investigating', detected_at: '2026-04-18T11:42:00Z', aoiId: 'AOI-VA-BEACH-EXCL', vesselId: 'VES-031', coordinates: [-75.81, 36.79] },
  { id: 'DARK-002', title: 'Vessel inside whale-conservation zone — AIS off', severity: 'attention', state: 'investigating', detected_at: '2026-04-18T09:18:00Z', aoiId: 'AOI-OFFSHORE-RES-1', vesselId: 'VES-058', coordinates: [-74.71, 37.62] },
  { id: 'DARK-003', title: 'Likely AIS spoofing vs SAR detection', severity: 'action_required', state: 'open', detected_at: '2026-04-17T22:05:00Z', aoiId: 'AOI-CAPE-HATTERAS', vesselId: 'VES-072', coordinates: [-75.18, 35.34] },
  { id: 'DARK-004', title: 'Dark anomaly cleared — re-acquired AIS', severity: 'attention', state: 'resolved', detected_at: '2026-04-17T16:50:00Z', aoiId: 'AOI-MID-ATL-LANE', vesselId: 'VES-046', coordinates: [-73.62, 36.4] },
]

export const MARITIME_ISR_PRODUCT_SEEDS: MaritimeIsrProductSeed[] = [
  { id: 'ISR-2026-0418-A', subject: 'VES-031 dark vessel — VA Beach exclusion', classification_marking: 'CUI/MARITIME', authored_by: 'CWO Alvarez', authored_at: '2026-04-18T12:10:00Z', state: 'ready', vesselIds: ['VES-031'], aoiId: 'AOI-VA-BEACH-EXCL' },
  { id: 'ISR-2026-0418-B', subject: 'VES-072 SAR/AIS delta — Hatteras', classification_marking: 'CUI/MARITIME', authored_by: 'LT Kim', authored_at: '2026-04-18T02:15:00Z', state: 'drafting', vesselIds: ['VES-072'], aoiId: 'AOI-CAPE-HATTERAS' },
]
