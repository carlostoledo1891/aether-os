/**
 * Backfill drill hole assay data from Meteoric ASX release (30 Jan 2024).
 * Source: "Exceptional REE Drill Results Outside Inferred Resources" — Table 1.
 *
 * Usage:  npm run backfill:drill-assays
 *
 * This script is additive — it only adds/updates fields, never removes features.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GEOJSON_PATH = resolve(__dirname, '..', 'src', 'data', 'geojson', 'caldeira-drillholes.geojson')

interface AssayEntry {
  treo_ppm: number
  mreo_pct: number
  hmreo_ppm: number
  prnd_ppm: number
  intercept: string
  including: string | null
}

// Extracted from PDF Table 1 — full-hole composite rows
// mreo_pct = round((MREO / TREO) * 100) where MREO = Pr6O11 + Nd2O3 + Tb4O7 + Dy2O3
const ASSAY_LOOKUP: Record<string, AssayEntry> = {
  AGODD0001: {
    treo_ppm: 2616, mreo_pct: Math.round((243 / 2616) * 100), hmreo_ppm: 18, prnd_ppm: 224,
    intercept: '43.2m @ 2,616ppm TREO [0m]',
    including: '18m @ 3,628ppm TREO [17m]',
  },
  AGODD0002: {
    treo_ppm: 3143, mreo_pct: Math.round((772 / 3143) * 100), hmreo_ppm: 42, prnd_ppm: 730,
    intercept: '37.1m @ 3,143ppm TREO [0m]',
    including: null,
  },
  BDPDD0002: {
    treo_ppm: 3855, mreo_pct: Math.round((685 / 3855) * 100), hmreo_ppm: 37, prnd_ppm: 649,
    intercept: '58.6m @ 3,855ppm TREO [0m]',
    including: '31m @ 5,727ppm TREO [0m]',
  },
  BDPDD0003: {
    treo_ppm: 4151, mreo_pct: Math.round((745 / 4151) * 100), hmreo_ppm: 41, prnd_ppm: 704,
    intercept: '39.1m @ 4,151ppm TREO [0m]',
    including: '25m @ 5,391ppm TREO [6m]',
  },
  BDPDD0004: {
    treo_ppm: 3053, mreo_pct: Math.round((725 / 3053) * 100), hmreo_ppm: 30, prnd_ppm: 695,
    intercept: '29.2m @ 3,053ppm TREO [0m]',
    including: '11m @ 5,695ppm TREO [7m]',
  },
  BDPDD0005: {
    treo_ppm: 1642, mreo_pct: Math.round((212 / 1642) * 100), hmreo_ppm: 15, prnd_ppm: 197,
    intercept: '52.1m @ 1,642ppm TREO [0m]',
    including: '5.1m @ 3,200ppm TREO [4m]',
  },
  BDPDD0006: {
    treo_ppm: 1984, mreo_pct: Math.round((345 / 1984) * 100), hmreo_ppm: 21, prnd_ppm: 324,
    intercept: '43.4m @ 1,984ppm TREO [0m]',
    including: '4.9m @ 4,977ppm TREO [8m]',
  },
  CERDD0003: {
    treo_ppm: 2419, mreo_pct: Math.round((466 / 2419) * 100), hmreo_ppm: 24, prnd_ppm: 443,
    intercept: '75.3m @ 2,419ppm TREO [0m]',
    including: '12m @ 3,202ppm TREO [46m]',
  },
  CERDD0004: {
    treo_ppm: 2026, mreo_pct: Math.round((407 / 2026) * 100), hmreo_ppm: 33, prnd_ppm: 374,
    intercept: '66.8m @ 2,026ppm TREO [0m]',
    including: '17.3m @ 3,295ppm TREO [8m]',
  },
  CERDD0005: {
    treo_ppm: 1628, mreo_pct: Math.round((323 / 1628) * 100), hmreo_ppm: 23, prnd_ppm: 300,
    intercept: '120.1m @ 1,628ppm TREO [0m]',
    including: '7.8m @ 5,109ppm TREO [0m]',
  },
  CIPDD0001: {
    treo_ppm: 1991, mreo_pct: Math.round((337 / 1991) * 100), hmreo_ppm: 24, prnd_ppm: 313,
    intercept: '33.5m @ 1,991ppm TREO [0m]',
    including: '9.8m @ 3,490ppm TREO [21m]',
  },
  COQDD0001: {
    treo_ppm: 2019, mreo_pct: Math.round((363 / 2019) * 100), hmreo_ppm: 24, prnd_ppm: 339,
    intercept: '82.6m @ 2,019ppm TREO [0m]',
    including: '15m @ 4,974ppm TREO [13m]',
  },
  COQDD0002: {
    treo_ppm: 3603, mreo_pct: Math.round((890 / 3603) * 100), hmreo_ppm: 52, prnd_ppm: 838,
    intercept: '32.6m @ 3,603ppm TREO [0m]',
    including: '24.2m @ 4,127ppm TREO [1m]',
  },
  COQDD0003: {
    treo_ppm: 2145, mreo_pct: Math.round((420 / 2145) * 100), hmreo_ppm: 29, prnd_ppm: 391,
    intercept: '17.8m @ 2,145ppm TREO [0m]',
    including: null,
  },
  CVSDD0002: {
    treo_ppm: 2514, mreo_pct: Math.round((433 / 2514) * 100), hmreo_ppm: 31, prnd_ppm: 401,
    intercept: '70.8m @ 2,514ppm TREO [0m]',
    including: '7m @ 7,594ppm TREO [2m]',
  },
  CVSDD0003: {
    treo_ppm: 3322, mreo_pct: Math.round((467 / 3322) * 100), hmreo_ppm: 31, prnd_ppm: 436,
    intercept: '56.6m @ 3,322ppm TREO [0m]',
    including: '35m @ 3,766ppm TREO [0m]',
  },
  CVSDD0004: {
    treo_ppm: 3387, mreo_pct: Math.round((605 / 3387) * 100), hmreo_ppm: 62, prnd_ppm: 543,
    intercept: '200m @ 3,387ppm TREO [0m]',
    including: '5m @ 11,888ppm TREO [36m]',
  },
  CVSDD0005: {
    treo_ppm: 3451, mreo_pct: Math.round((601 / 3451) * 100), hmreo_ppm: 55, prnd_ppm: 546,
    intercept: '200.6m @ 3,451ppm TREO [0m]',
    including: '5.8m @ 10,417ppm TREO [1m]',
  },
  DONDD0001: {
    treo_ppm: 1640, mreo_pct: Math.round((323 / 1640) * 100), hmreo_ppm: 21, prnd_ppm: 302,
    intercept: '15m @ 1,640ppm TREO [0m]',
    including: '4m @ 3,208ppm TREO [0m]',
  },
  FLIDD0001: {
    treo_ppm: 2746, mreo_pct: Math.round((745 / 2746) * 100), hmreo_ppm: 40, prnd_ppm: 705,
    intercept: '18m @ 2,746ppm TREO [0m]',
    including: '8m @ 4,298ppm TREO [0m]',
  },
  FLIDD0002: {
    treo_ppm: 2109, mreo_pct: Math.round((470 / 2109) * 100), hmreo_ppm: 21, prnd_ppm: 449,
    intercept: '24.8m @ 2,109ppm TREO [0m]',
    including: '5.5m @ 3,722ppm TREO [10m]',
  },
  PIADD0001: {
    treo_ppm: 6406, mreo_pct: Math.round((1357 / 6406) * 100), hmreo_ppm: 110, prnd_ppm: 1248,
    intercept: '143m @ 6,406ppm TREO [0m]',
    including: '8m @ 23,946ppm TREO [85m]',
  },
  PIADD0002: {
    treo_ppm: 2556, mreo_pct: Math.round((491 / 2556) * 100), hmreo_ppm: 31, prnd_ppm: 460,
    intercept: '46.2m @ 2,556ppm TREO [0m]',
    including: '17m @ 3,271ppm TREO [15m]',
  },
  PIADD0003: {
    treo_ppm: 1214, mreo_pct: Math.round((218 / 1214) * 100), hmreo_ppm: 20, prnd_ppm: 198,
    intercept: '12.7m @ 1,214ppm TREO [0m]',
    including: null,
  },
  PIADD0004: {
    treo_ppm: 1318, mreo_pct: Math.round((268 / 1318) * 100), hmreo_ppm: 19, prnd_ppm: 248,
    intercept: '62.6m @ 1,318ppm TREO [0m]',
    including: null,
  },
  PINDD0001: {
    treo_ppm: 1777, mreo_pct: Math.round((329 / 1777) * 100), hmreo_ppm: 18, prnd_ppm: 311,
    intercept: '32.6m @ 1,777ppm TREO [0m]',
    including: '11m @ 3,053ppm TREO [0m]',
  },
  PITDD0001: {
    treo_ppm: 1697, mreo_pct: Math.round((356 / 1697) * 100), hmreo_ppm: 19, prnd_ppm: 337,
    intercept: '44.8m @ 1,697ppm TREO [0m]',
    including: null,
  },
  TAMDD0001: {
    treo_ppm: 1626, mreo_pct: Math.round((345 / 1626) * 100), hmreo_ppm: 21, prnd_ppm: 324,
    intercept: '15.7m @ 1,626ppm TREO [0m]',
    including: null,
  },
  TAMDD0002: {
    treo_ppm: 1784, mreo_pct: Math.round((350 / 1784) * 100), hmreo_ppm: 18, prnd_ppm: 331,
    intercept: '14.7m @ 1,784ppm TREO [0m]',
    including: null,
  },
  TAMDD0003: {
    treo_ppm: 2938, mreo_pct: Math.round((610 / 2938) * 100), hmreo_ppm: 28, prnd_ppm: 581,
    intercept: '19.5m @ 2,938ppm TREO [0m]',
    including: null,
  },
  TATDD0001: {
    treo_ppm: 927, mreo_pct: Math.round((138 / 927) * 100), hmreo_ppm: 9, prnd_ppm: 129,
    intercept: '6.3m @ 927ppm TREO [0m]',
    including: null,
  },
}

interface GeoJsonFeature {
  type: string
  properties: Record<string, unknown>
  geometry: unknown
}

interface GeoJsonFC {
  type: string
  metadata: Record<string, unknown>
  features: GeoJsonFeature[]
}

function main() {
  console.log('Reading GeoJSON...')
  const raw = readFileSync(GEOJSON_PATH, 'utf-8')
  const geojson = JSON.parse(raw) as GeoJsonFC

  let updated = 0
  let alreadyCorrect = 0
  let notFound = 0

  const lookupIds = new Set(Object.keys(ASSAY_LOOKUP))

  for (const feature of geojson.features) {
    const id = feature.properties.id as string
    if (!lookupIds.has(id)) continue

    const assay = ASSAY_LOOKUP[id]
    lookupIds.delete(id)
    const p = feature.properties

    const needsUpdate =
      p.treo_ppm !== assay.treo_ppm ||
      p.mreo_pct !== assay.mreo_pct ||
      p.intercept !== assay.intercept ||
      p.hmreo_ppm !== assay.hmreo_ppm ||
      p.prnd_ppm !== assay.prnd_ppm

    if (!needsUpdate) {
      alreadyCorrect++
      continue
    }

    p.treo_ppm = assay.treo_ppm
    p.mreo_pct = assay.mreo_pct
    p.hmreo_ppm = assay.hmreo_ppm
    p.prnd_ppm = assay.prnd_ppm
    p.intercept = assay.intercept
    p.including = assay.including
    p.note = assay.including
      ? `${assay.intercept} · incl. ${assay.including}`
      : assay.intercept
    p.source_ref = 'asx_02766588_table1'
    p.as_of = '2024-01-30'

    updated++
  }

  notFound = lookupIds.size
  if (notFound > 0) {
    console.warn(`  WARNING: ${notFound} hole(s) not found in GeoJSON: ${[...lookupIds].join(', ')}`)
  }

  console.log(`Writing GeoJSON... (${updated} updated, ${alreadyCorrect} already correct, ${notFound} not found)`)
  writeFileSync(GEOJSON_PATH, JSON.stringify(geojson, null, 2) + '\n')
  console.log('Done.')
}

main()
