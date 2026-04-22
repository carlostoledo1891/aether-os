/**
 * Regenerates caldeira-drillholes.geojson and patches caldeira-licenses.geojson
 * from `data/caldeira/staging/*` + embedded Jan 2024 DD collars.
 *
 * Run: npm run build:caldeira-geojson
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { targetToDeposit } from './depositSlug.ts'
import { normalizeHoleId } from './normalizeHoleId.ts'
import { JAN_2024_DD_ROWS } from './sources/jan2024Rows.ts'
import { isWithinCaldeiraEnvelope, utm23sSirgasToWgs84 } from './utmSirgas.ts'
import { applyDrillAssayBackfill, type GeoJsonFC, type GeoJsonFeature } from '../backfill-drill-assays.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const STAGING = join(ROOT, 'data/caldeira/staging')
const OUT_DRILL = join(ROOT, 'src/data/geojson/caldeira-drillholes.geojson')
const OUT_LIC = join(ROOT, 'src/data/geojson/caldeira-licenses.geojson')

type Campaign = '2022-infill' | '2023-infill' | '2024-resource' | '2025-pfs' | '2025-discovery'

interface DdHighlight {
  holeId: string
  deposit: string
  treo_ppm: number
  mreo_pct: number
  depth_m: number
  intercept: string
  including?: string
  campaign: Campaign
}

interface DrillWork {
  id: string
  deposit: string
  hole_type: 'DD' | 'AC' | 'AUGER'
  depth_m: number
  easting_utm: number
  northing_utm: number
  elev_m?: number
  lon: number
  lat: number
  source_ref: string
  as_of: string
  asx_status_note?: string
  /** Joined assay / intercept UI fields */
  treo_ppm: number
  mreo_pct: number
  campaign: Campaign
  intercept?: string
  including?: string
  note: string | null
}

type ExistingFeature = GeoJsonFeature & {
  properties: Record<string, unknown>
}

function readStagingText(name: string): string {
  return readFileSync(join(STAGING, name), 'utf8')
}

function parseAgoacCollarLines(text: string): Omit<DrillWork, 'treo_ppm' | 'mreo_pct' | 'campaign' | 'intercept' | 'including' | 'note'>[] {
  const out: Omit<DrillWork, 'treo_ppm' | 'mreo_pct' | 'campaign' | 'intercept' | 'including' | 'note'>[] = []
  const re =
    /^Agostinho AC (AGOAC\d+)\s+([\d,]+)\s+([\d,]+)\s+([\d,.]+)\s+([\d.]+)\s+-90\s+360\s*$/
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const m = t.match(re)
    if (!m) continue
    const easting = Number(m[2].replaceAll(',', ''))
    const northing = Number(m[3].replaceAll(',', ''))
    const elev = Number(m[4].replaceAll(',', ''))
    const depth = Number(m[5])
    const [lon, lat] = utm23sSirgasToWgs84(easting, northing)
    out.push({
      id: m[1],
      deposit: 'agostinho',
      hole_type: 'AC',
      depth_m: depth,
      easting_utm: easting,
      northing_utm: northing,
      elev_m: elev,
      lon,
      lat,
      source_ref: 'asx_02909601_appendix1',
      as_of: '2025-02-05',
    })
  }
  return out
}

function parseAgoacInterceptLines(text: string): Map<string, { treo: number; mreoPct: number; depth: number; summary: string }> {
  const map = new Map<string, { treo: number; mreoPct: number; depth: number; summary: string }>()
  const re =
    /^Agostinho (AGOAC\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d,]+)\s+([\d,]+)\s+(\d+)%\s+(.+)$/
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const m = t.match(re)
    if (!m) continue
    const holeId = m[1]
    const depth = Number(m[4])
    const treo = Number(m[5].replaceAll(',', ''))
    const mreoPct = Number(m[7])
    map.set(holeId, { treo, mreoPct, depth, summary: m[8].trim() })
  }
  return map
}

function loadDdHighlights(): Map<string, DdHighlight> {
  const raw = JSON.parse(readStagingText('dd_intercept_highlights.json')) as DdHighlight[]
  const map = new Map<string, DdHighlight>()
  for (const h of raw) {
    map.set(normalizeHoleId(h.holeId), h)
  }
  return map
}

function jan24RowsToWork(): DrillWork[] {
  const ddMap = loadDdHighlights()
  const out: DrillWork[] = []
  for (const row of JAN_2024_DD_ROWS) {
    const [target, , holeIdRaw, depthM, easting, northing, elevationM, asxStatus] = row
    const id = normalizeHoleId(holeIdRaw)
    const [lon, lat] = utm23sSirgasToWgs84(easting, northing)
    const hi = ddMap.get(id)
    const deposit = hi?.deposit ?? targetToDeposit(target)
    const treo_ppm = hi?.treo_ppm ?? 0
    const mreo_pct = hi?.mreo_pct ?? 0
    const campaign = hi?.campaign ?? '2024-resource'
    const intercept = hi?.intercept
    const including = hi?.including
    const note = buildNote(intercept, including, treo_ppm)
    out.push({
      id,
      deposit,
      hole_type: 'DD',
      depth_m: depthM,
      easting_utm: easting,
      northing_utm: northing,
      elev_m: elevationM,
      lon,
      lat,
      source_ref: 'asx_02766588_table2',
      as_of: '2024-01-30',
      asx_status_note: asxStatus,
      treo_ppm,
      mreo_pct,
      campaign,
      intercept,
      including,
      note,
    })
  }
  return out
}

function buildNote(intercept: string | undefined, including: string | undefined, treo: number): string | null {
  if (intercept && including) return `${intercept} · incl. ${including}`
  if (intercept) return intercept
  if (treo > 0) return null
  return null
}

function mergeAgoac(): DrillWork[] {
  const collars = parseAgoacCollarLines(readStagingText('appendix_02909601_agostinho_ac_collars.txt'))
  const inter = parseAgoacInterceptLines(readStagingText('appendix_02909601_agostinho_intercepts.txt'))
  return collars.map((c) => {
    const ax = inter.get(c.id)
    const treo_ppm = ax?.treo ?? 0
    const mreo_pct = ax?.mreoPct ?? 0
    const depth_m = ax?.depth ?? c.depth_m
    const intercept = ax ? ax.summary : undefined
    return {
      ...c,
      depth_m,
      treo_ppm,
      mreo_pct,
      campaign: '2025-discovery' as Campaign,
      intercept,
      including: undefined,
      note: ax ? ax.summary : null,
    }
  })
}

function toFeature(w: DrillWork): Record<string, unknown> {
  return {
    type: 'Feature',
    properties: {
      id: w.id,
      deposit: w.deposit,
      treo_ppm: w.treo_ppm,
      mreo_pct: w.mreo_pct,
      depth_m: w.depth_m,
      campaign: w.campaign,
      hole_type: w.hole_type,
      note: w.note,
      intercept: w.intercept ?? null,
      including: w.including ?? null,
      source_ref: w.source_ref,
      as_of: w.as_of,
      elev_m: w.elev_m,
      easting_utm: w.easting_utm,
      northing_utm: w.northing_utm,
      crs_epsg: 31983,
      ...(w.asx_status_note ? { asx_status: w.asx_status_note } : {}),
    },
    geometry: { type: 'Point', coordinates: [w.lon, w.lat] },
  }
}

function loadExistingDrillById(): Map<string, ExistingFeature> {
  if (!existsSync(OUT_DRILL)) return new Map()
  const existing = JSON.parse(readFileSync(OUT_DRILL, 'utf8')) as GeoJsonFC
  return new Map(
    existing.features
      .filter((feature): feature is ExistingFeature => typeof feature.properties?.id === 'string')
      .map(feature => [String(feature.properties.id), feature]),
  )
}

function preserveDrillFields(
  feature: ReturnType<typeof toFeature>,
  existingById: Map<string, ExistingFeature>,
): ReturnType<typeof toFeature> {
  const id = feature.properties.id
  if (typeof id !== 'string') return feature
  const existing = existingById.get(id)
  if (!existing) return feature

  const properties = feature.properties as Record<string, unknown>
  const existingProps = existing.properties

  if ((properties.treo_ppm === 0 || properties.treo_ppm == null) && typeof existingProps.treo_ppm === 'number') {
    properties.treo_ppm = existingProps.treo_ppm
  }
  if ((properties.mreo_pct === 0 || properties.mreo_pct == null) && typeof existingProps.mreo_pct === 'number') {
    properties.mreo_pct = existingProps.mreo_pct
  }
  if ((properties.intercept == null || properties.intercept === '') && typeof existingProps.intercept === 'string') {
    properties.intercept = existingProps.intercept
  }
  if ((properties.including == null || properties.including === '') && typeof existingProps.including === 'string') {
    properties.including = existingProps.including
  }
  if ((properties.note == null || properties.note === '') && typeof existingProps.note === 'string') {
    properties.note = existingProps.note
  }
  if (typeof existingProps.hmreo_ppm === 'number') {
    properties.hmreo_ppm = existingProps.hmreo_ppm
  }
  if (typeof existingProps.prnd_ppm === 'number') {
    properties.prnd_ppm = existingProps.prnd_ppm
  }
  if (Array.isArray(existingProps.lithology_intervals)) {
    properties.lithology_intervals = existingProps.lithology_intervals
  }

  return feature
}

function buildDrillholes(): void {
  const merged = [...jan24RowsToWork(), ...mergeAgoac()]
  merged.sort((a, b) => a.id.localeCompare(b.id))
  const existingById = loadExistingDrillById()

  const outside = merged.filter((w) => !isWithinCaldeiraEnvelope(w.lon, w.lat))
  if (outside.length > 0) {
    console.warn(
      'Caldeira build: collars outside rough envelope (check CRS):',
      outside.slice(0, 5).map((w) => w.id),
    )
  }

  const generatedAt = new Date().toISOString()
  const fc = {
    type: 'FeatureCollection',
    metadata: {
      generated_at: generatedAt,
      crs_pipeline: 'EPSG:31983 (SIRGAS 2000 / UTM 23S) → WGS84',
      sources: [
        '02766588_table2',
        '02909601_appendix1',
        '02909601_appendix2',
        'dd_intercept_highlights.json',
        'asx_02766588_table1',
      ],
      feature_count: merged.length,
      preserved_fields: ['hmreo_ppm', 'prnd_ppm', 'lithology_intervals'],
    },
    features: merged.map(work => preserveDrillFields(toFeature(work), existingById)),
  } satisfies GeoJsonFC
  const assayResult = applyDrillAssayBackfill(fc)
  if (assayResult.notFound > 0) {
    console.warn('Caldeira build: assay backfill IDs missing from drill GeoJSON:', assayResult.missingIds)
  }
  writeFileSync(OUT_DRILL, `${JSON.stringify(assayResult.geojson, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${merged.length} drill features → ${OUT_DRILL}`)
}

interface LicenceMetricRow {
  licence_id: string
  note: string
  resource_category: string
  total_mt: string
  as_of: string
  source_ref: string
}

function parseLicenceCsv(text: string): LicenceMetricRow[] {
  const rows: LicenceMetricRow[] = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    if (t.startsWith('licence_id,')) continue
    const m = t.match(/^([^,]+),"(.*)",([^,]*),([^,]*),([^,]*),([^,]*)$/)
    if (!m) {
      console.warn('Skip licence CSV line (unexpected format):', t.slice(0, 80))
      continue
    }
    rows.push({
      licence_id: m[1],
      note: m[2],
      resource_category: m[3],
      total_mt: m[4],
      as_of: m[5],
      source_ref: m[6],
    })
  }
  return rows
}

function patchLicences(): void {
  const csv = parseLicenceCsv(readStagingText('licence_metrics.csv'))
  const byId = new Map(csv.map((r) => [r.licence_id, r]))
  const lic = JSON.parse(readFileSync(OUT_LIC, 'utf8')) as {
    type: string
    features: { properties: Record<string, unknown> }[]
  }
  const geoIds = new Set(lic.features.map((f) => f.properties.id as string))
  for (const [csvId] of byId) {
    if (!geoIds.has(csvId)) {
      console.warn(`Caldeira build: licence CSV row "${csvId}" has no matching feature in GeoJSON — check licence_id`)
    }
  }
  for (const f of lic.features) {
    const id = f.properties.id as string
    const row = byId.get(id)
    if (!row) continue
    f.properties.note = row.note
    f.properties.resource_category = row.resource_category
    if (row.total_mt) {
      const n = Number(row.total_mt)
      if (!Number.isNaN(n)) f.properties.total_mt = n
    }
    f.properties.as_of = row.as_of
    f.properties.source_ref = row.source_ref
  }
  if (!lic.metadata) {
    ;(lic as { metadata?: unknown }).metadata = {}
  }
  ;(lic as { metadata: Record<string, unknown> }).metadata = {
    ...((lic as { metadata?: Record<string, unknown> }).metadata ?? {}),
    licence_metrics_generated_at: new Date().toISOString(),
    licence_metrics_source: 'data/caldeira/staging/licence_metrics.csv',
  }
  writeFileSync(OUT_LIC, `${JSON.stringify(lic, null, 2)}\n`, 'utf8')
  console.log(`Patched ${csv.length} licence rows → ${OUT_LIC}`)
}

buildDrillholes()
patchLicences()
