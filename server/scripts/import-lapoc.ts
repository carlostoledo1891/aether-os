import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const API_URL = process.env.API_URL ?? 'http://localhost:3001'
const INGEST_API_KEY = process.env.INGEST_API_KEY ?? ''

function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      type: { type: 'string', short: 't' }, // piezometer, water_quality, field_observations
      file: { type: 'string', short: 'f' }
    }
  })

  if (!values.type || !values.file) {
    console.error('Usage: tsx import-lapoc.ts --type <piezometer|water_quality|field_observations> --file <path.csv>')
    process.exit(1)
  }

  const filePath = path.resolve(process.cwd(), values.file)
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const csv = fs.readFileSync(filePath, 'utf-8')
  const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length < 2) {
    console.error('Empty CSV or missing data rows')
    process.exit(1)
  }

  const headers = lines[0].split(',').map(h => h.trim())
  const rows = lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim())
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = cols[i] ?? '' })
    return obj
  })

  const payload: Record<string, unknown> = {
    source: 'lapoc',
    provenance: 'verified_real',
    timestamp: new Date().toISOString(),
    piezometer_readings: [],
    water_quality_samples: [],
    field_observations: []
  }

  if (values.type === 'piezometer') {
    payload.piezometer_readings = rows.map(r => ({
      sensor_id: r.sensor_id,
      timestamp: new Date(r.timestamp).toISOString(),
      depth_meters: parseFloat(r.depth_meters),
      temperature_c: parseFloat(r.temperature_c),
      conductivity_us_cm: parseFloat(r.conductivity_us_cm)
    }))
  } else if (values.type === 'water_quality') {
    payload.water_quality_samples = rows.map(r => ({
      sample_id: r.sample_id,
      timestamp: new Date(r.timestamp).toISOString(),
      location: r.location,
      ph: parseFloat(r.ph),
      sulfate_ppm: parseFloat(r.sulfate_ppm),
      nitrate_ppm: parseFloat(r.nitrate_ppm),
      iron_ppm: parseFloat(r.iron_ppm),
      manganese_ppm: parseFloat(r.manganese_ppm),
      turbidity_ntu: parseFloat(r.turbidity_ntu)
    }))
  } else if (values.type === 'field_observations') {
    payload.field_observations = rows.map(r => ({
      observer: r.observer,
      timestamp: new Date(r.timestamp).toISOString(),
      spring_id: r.spring_id,
      flow_status: r.flow_status,
      photo_ref: r.photo_ref || undefined,
      notes: r.notes || ''
    }))
  } else {
    console.error('Invalid type. Must be piezometer, water_quality, or field_observations')
    process.exit(1)
  }

  postData(payload)
}

async function postData(payload: unknown) {
  try {
    const res = await fetch(`${API_URL}/ingest/lapoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INGEST_API_KEY
      },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Ingest failed:', data)
      process.exit(1)
    }
    console.log('Successfully ingested LAPOC data:', data)
  } catch (err) {
    console.error('Network error:', err)
    process.exit(1)
  }
}

main()