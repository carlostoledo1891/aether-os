/**
 * Root-level LAPOC ingestion orchestrator.
 *
 * Reads the sample (or user-supplied) CSVs under `data/lapoc/`, composes a
 * single LapocTelemetryPayload tagged `source: 'lapoc'` /
 * `provenance: 'verified_real'`, and POSTs to `/ingest/lapoc` on the local or
 * configured API.
 *
 * When Dr. Caponi hands over real CSVs, drop them in and rerun this script —
 * no code changes required.
 */

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const API_URL = process.env.API_URL ?? 'http://localhost:3001'
const INGEST_API_KEY = process.env.INGEST_API_KEY ?? ''
const DEFAULT_DIR = path.resolve(process.cwd(), 'data/lapoc')

interface PiezometerRow {
  sensor_id: string
  timestamp: string
  depth_meters: number
  temperature_c: number
  conductivity_us_cm: number
}

interface WaterQualityRow {
  sample_id: string
  timestamp: string
  location: string
  ph: number
  sulfate_ppm: number
  nitrate_ppm: number
  iron_ppm: number
  manganese_ppm: number
  turbidity_ntu: number
}

interface FieldObservationRow {
  observer: string
  timestamp: string
  spring_id: string
  flow_status: 'active' | 'reduced' | 'dry'
  photo_ref?: string
  notes: string
}

export interface LapocPayload {
  source: 'lapoc'
  provenance: 'verified_real'
  timestamp: string
  piezometer_readings: PiezometerRow[]
  water_quality_samples: WaterQualityRow[]
  field_observations: FieldObservationRow[]
}

function readCsv(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim())
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = cols[i] ?? '' })
    return obj
  })
}

export function parsePiezometer(rows: Record<string, string>[]): PiezometerRow[] {
  return rows.map(r => ({
    sensor_id: r.sensor_id,
    timestamp: new Date(r.timestamp).toISOString(),
    depth_meters: parseFloat(r.depth_meters),
    temperature_c: parseFloat(r.temperature_c),
    conductivity_us_cm: parseFloat(r.conductivity_us_cm),
  }))
}

export function parseWaterQuality(rows: Record<string, string>[]): WaterQualityRow[] {
  return rows.map(r => ({
    sample_id: r.sample_id,
    timestamp: new Date(r.timestamp).toISOString(),
    location: r.location,
    ph: parseFloat(r.ph),
    sulfate_ppm: parseFloat(r.sulfate_ppm),
    nitrate_ppm: parseFloat(r.nitrate_ppm),
    iron_ppm: parseFloat(r.iron_ppm),
    manganese_ppm: parseFloat(r.manganese_ppm),
    turbidity_ntu: parseFloat(r.turbidity_ntu),
  }))
}

export function parseFieldObservations(rows: Record<string, string>[]): FieldObservationRow[] {
  return rows.map(r => {
    const status = r.flow_status as 'active' | 'reduced' | 'dry'
    const base: FieldObservationRow = {
      observer: r.observer,
      timestamp: new Date(r.timestamp).toISOString(),
      spring_id: r.spring_id,
      flow_status: status,
      notes: r.notes ?? '',
    }
    if (r.photo_ref) base.photo_ref = r.photo_ref
    return base
  })
}

export function buildLapocPayload(opts: {
  piezometerCsv: string
  waterQualityCsv: string
  fieldObservationsCsv: string
}): LapocPayload {
  return {
    source: 'lapoc',
    provenance: 'verified_real',
    timestamp: new Date().toISOString(),
    piezometer_readings: parsePiezometer(readCsv(opts.piezometerCsv)),
    water_quality_samples: parseWaterQuality(readCsv(opts.waterQualityCsv)),
    field_observations: parseFieldObservations(readCsv(opts.fieldObservationsCsv)),
  }
}

async function postPayload(payload: LapocPayload): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (INGEST_API_KEY) headers['x-api-key'] = INGEST_API_KEY

  const res = await fetch(`${API_URL}/ingest/lapoc`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error(`[lapoc] Ingest failed (${res.status}):`, body)
    process.exit(1)
  }
  console.log(`[lapoc] Ingested ${payload.piezometer_readings.length} piezo · ${payload.water_quality_samples.length} WQ · ${payload.field_observations.length} field obs`)
  console.log(`[lapoc] Server response:`, body)
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      piezometer: { type: 'string' },
      'water-quality': { type: 'string' },
      'field-observations': { type: 'string' },
    },
  })

  const piezometerCsv = values.piezometer ?? path.join(DEFAULT_DIR, 'sample-piezometer.csv')
  const waterQualityCsv = values['water-quality'] ?? path.join(DEFAULT_DIR, 'sample-water-quality.csv')
  const fieldObservationsCsv = values['field-observations'] ?? path.join(DEFAULT_DIR, 'sample-field-observations.csv')

  const payload = buildLapocPayload({ piezometerCsv, waterQualityCsv, fieldObservationsCsv })

  if (
    payload.piezometer_readings.length === 0 &&
    payload.water_quality_samples.length === 0 &&
    payload.field_observations.length === 0
  ) {
    console.error('[lapoc] No rows found in any CSV. Provide --piezometer, --water-quality, or --field-observations.')
    process.exit(1)
  }

  console.log(`[lapoc] Target: ${API_URL}/ingest/lapoc`)
  await postPayload(payload)
}

// Run only when executed directly (not when imported by tests)
const invokedDirectly = (() => {
  try {
    const entry = process.argv[1]
    if (!entry) return false
    const thisFile = new URL(import.meta.url).pathname
    return path.resolve(entry) === path.resolve(thisFile)
  } catch {
    return false
  }
})()

if (invokedDirectly) {
  main().catch(err => {
    console.error('[lapoc] Unhandled error:', err)
    process.exit(1)
  })
}
