/**
 * Barrel export for Atlantic Maritime fixtures. Combines vessels with
 * the dark-event flag so any consumer (data service, overlays, KPI
 * strip) sees a single coherent dataset.
 */

import { MARITIME_AOIS } from './aois'
import { MARITIME_VESSELS } from './vessels'
import { MARITIME_SENSOR_STATIONS } from './sensorStations'
import { MARITIME_DARK_EVENTS } from './darkEvents'
import type { MaritimeDataset, VesselRecord } from '../types'

const DARK_VESSEL_IDS = new Set(MARITIME_DARK_EVENTS.map(e => e.vesselId))

const VESSELS_WITH_FLAGS: VesselRecord[] = MARITIME_VESSELS.map(v =>
  DARK_VESSEL_IDS.has(v.id) ? { ...v, flaggedDark: true } : v,
)

export const MARITIME_DATASET: MaritimeDataset = {
  aois: MARITIME_AOIS,
  vessels: VESSELS_WITH_FLAGS,
  sensorStations: MARITIME_SENSOR_STATIONS,
  darkEvents: MARITIME_DARK_EVENTS,
}

export {
  MARITIME_AOIS,
  MARITIME_VESSELS,
  MARITIME_SENSOR_STATIONS,
  MARITIME_DARK_EVENTS,
}
