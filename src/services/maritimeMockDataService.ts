/**
 * Maritime mock data service.
 *
 * The full AetherDataService surface is mining-shaped (drillholes,
 * springs, JORC scenarios, etc.) — most of those calls are nonsense
 * for the maritime instance. This module exposes only what the
 * Atlantic Maritime workspace actually needs:
 *
 *   - the static MaritimeDataset (AOIs, vessels, sensor stations, dark events)
 *   - a `useMaritimeData()` hook returning that dataset (Week 2)
 *   - a `useAnimatedMaritimeVessels()` hook that drives gentle
 *     position updates via the existing setInterval pattern (Week 3)
 *
 * If maritime ever needs the full DataService contract (for unit
 * lifecycle / evidence bundles beyond the manual ISR preset shipped
 * server-side), promote this module into a full implementation then.
 */

import { useEffect, useMemo, useState } from 'react'
import { MARITIME_DATASET } from '../data/maritime/fixtures'
import type {
  MaritimeDataset,
  VesselRecord,
  VesselTrackPoint,
} from '../data/maritime/types'

/**
 * Returns the maritime fixture dataset. Today this is a static module —
 * the hook wrapper exists so consumers can ignore where the data comes
 * from; later versions can swap in a fetched dataset without touching
 * call sites.
 */
export function useMaritimeData(): MaritimeDataset {
  return MARITIME_DATASET
}

/**
 * Animation step interval in milliseconds. Matches the tone of the
 * existing mockDataService TICK_MS (2000ms) — slow enough for clarity,
 * fast enough to feel alive during the demo.
 */
const ANIMATION_TICK_MS = 2000

/**
 * Returns a vessel list that gently advances each vessel's current
 * position using the heading and speed of its newest track point.
 * Used by the maritime workspace to deliver the "alive" feeling
 * without bringing in any real socket / streaming layer.
 */
export function useAnimatedMaritimeVessels(
  baseVessels: VesselRecord[] = MARITIME_DATASET.vessels,
): VesselRecord[] {
  const [tick, setTick] = useState(0)
  const [startedAt] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), ANIMATION_TICK_MS)
    return () => clearInterval(id)
  }, [])

  return useMemo(
    () => baseVessels.map(v => advanceVessel(v, tick, startedAt)),
    [baseVessels, tick, startedAt],
  )
}

/**
 * Compute a synthetic next position for a vessel by stepping its last
 * track point along its heading. Dark vessels stay put — they "lost"
 * AIS so their last fix should remain the visible position.
 */
function advanceVessel(vessel: VesselRecord, tick: number, startedAt: number): VesselRecord {
  if (vessel.flaggedDark || vessel.track.length === 0) return vessel
  const last = vessel.track[vessel.track.length - 1]
  // Each tick advances roughly 8 seconds of vessel motion at the
  // recorded speed. Knots → degrees-lat per second ≈ speed/3600.
  const secondsAdvanced = tick * 8
  const distDeg = (last.speed / 3600) * secondsAdvanced
  const headingRad = (last.heading * Math.PI) / 180
  const lng =
    last.lng + (distDeg * Math.sin(headingRad)) / Math.cos((last.lat * Math.PI) / 180)
  const lat = last.lat + distDeg * Math.cos(headingRad)
  const updated: VesselTrackPoint = {
    lng,
    lat,
    timestamp: new Date(startedAt + tick * ANIMATION_TICK_MS).toISOString(),
    speed: last.speed,
    heading: last.heading,
  }
  return {
    ...vessel,
    track: [...vessel.track, updated],
  }
}

export type { MaritimeDataset } from '../data/maritime/types'
