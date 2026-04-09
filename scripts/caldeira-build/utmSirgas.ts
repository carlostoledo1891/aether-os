import proj4 from 'proj4'

/** SIRGAS 2000 / UTM zone 23S — issuer appendix datum for Caldeira collars. */
proj4.defs(
  'EPSG:31983',
  '+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
)

/**
 * @returns [longitude, latitude] in WGS84 (degrees), suitable for GeoJSON.
 */
export function utm23sSirgasToWgs84(easting: number, northing: number): [number, number] {
  const [lon, lat] = proj4('EPSG:31983', 'WGS84', [easting, northing]) as [number, number]
  return [lon, lat]
}

/** Rough Caldeira / Poços envelope for QA (not legal survey bounds). */
export function isWithinCaldeiraEnvelope(lon: number, lat: number): boolean {
  return lon >= -46.85 && lon <= -46.35 && lat >= -22.05 && lat <= -21.65
}
