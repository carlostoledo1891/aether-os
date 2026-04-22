/**
 * Maritime domain types for the Atlantic Coast Maritime Authority demo
 * instance. These are intentionally small and self-contained — the
 * mining unit graph (UnitDetail / UnitSummary in shared/units/types) is
 * not reused because the maritime fixtures don't need its lifecycle
 * machinery yet. If maritime grows into a real graph instance later,
 * promote these into shared/units.
 */

export type AoiClassification =
  | 'patrol'
  | 'restricted'
  | 'commercial_lane'
  | 'environmental'

export interface MaritimeAoi {
  id: string
  name: string
  classification: AoiClassification
  /** Closed ring of [lng, lat] pairs, first==last. */
  ring: [number, number][]
  description: string
  /** Patrol vessels assigned to this AOI (vessel ids). */
  assignedAssets: string[]
}

export type VesselType =
  | 'cargo'
  | 'tanker'
  | 'fishing'
  | 'passenger'
  | 'patrol'
  | 'unknown'

export type VesselFlag =
  | 'US'
  | 'PA'
  | 'LR'
  | 'MH'
  | 'CN'
  | 'GB'
  | 'NL'
  | 'GR'
  | 'NO'
  | 'JP'
  | 'KR'
  | 'BS'
  | 'CY'
  | 'BR'
  | 'UNK'

/** A single AIS-shaped position fix. */
export interface VesselTrackPoint {
  lng: number
  lat: number
  /** ISO timestamp of the fix. */
  timestamp: string
  /** Knots. */
  speed: number
  /** Degrees, 0–359 (true heading). */
  heading: number
}

export interface VesselRecord {
  id: string
  /** 9-digit Maritime Mobile Service Identity. */
  mmsi: string
  name: string
  flag: VesselFlag
  type: VesselType
  /** Length overall, metres. */
  loa_m: number
  /** Track points oldest-to-newest; the last entry is the current position. */
  track: VesselTrackPoint[]
  /** True if the vessel matches a known dark-vessel detection. */
  flaggedDark?: boolean
}

export type SensorKind = 'shore_radar' | 'satellite_pass' | 'drone_orbit'

export interface SensorStation {
  id: string
  kind: SensorKind
  name: string
  /** Anchor point (radar pedestal, sat pass centroid, drone orbit centre). */
  coordinates: [number, number]
  /** Coverage circle radius in km (for the visual halo). */
  range_km: number
  status: 'nominal' | 'degraded' | 'offline'
  detail: string
}

export interface DarkVesselEvent {
  id: string
  vesselId: string
  detectedAt: string
  aoiId: string
  /** Detection coordinates (where AIS dropped or anomaly observed). */
  coordinates: [number, number]
  summary: string
  severity: 'attention' | 'action_required' | 'blocked'
}

export interface MaritimeDataset {
  aois: MaritimeAoi[]
  vessels: VesselRecord[]
  sensorStations: SensorStation[]
  darkEvents: DarkVesselEvent[]
}
