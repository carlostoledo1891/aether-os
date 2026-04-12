/**
 * Precomputed cross-layer metrics (approximate WGS84 / haversine).
 * Replace with runtime turf.js joins when GeoJSON is swapped for ANM vectors.
 */

import { CALDEIRA_GEO } from 'shared/sites/caldeira'

const EARTH_KM = 6371

function haversineKm(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const toR = (d: number) => (d * Math.PI) / 180
  const dLat = toR(lat2 - lat1)
  const dLon = toR(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(a)))
}

const PILOT_LONLAT = CALDEIRA_GEO.pois.pilotPlant.coords
const COMMERCIAL_PLANT_LONLAT = CALDEIRA_GEO.pois.commercialPlant.coords

/** Per-concession polygons whose centroids fall inside schematic APA buffer rectangle */
export const SPATIAL_INSIGHTS = {
  pilot_to_pfs_plant_km: haversineKm(
    PILOT_LONLAT[0],
    PILOT_LONLAT[1],
    COMMERCIAL_PLANT_LONLAT[0],
    COMMERCIAL_PLANT_LONLAT[1],
  ),
  licence_zones_in_apa_buffer: 7,
  apa_buffer_note:
    'Heuristic on schematic buffer rectangle (ops reality master) — replace with official FEAM/IEF union.',
} as const

export function getSpatialInsightsSummary(): string {
  return (
    `Pilot plant ≈ ${SPATIAL_INSIGHTS.pilot_to_pfs_plant_km.toFixed(1)} km straight-line to proposed commercial plant collar. ` +
    `${SPATIAL_INSIGHTS.licence_zones_in_apa_buffer} mining licence polygons have centroids inside the schematic APA buffer (see map).`
  )
}
