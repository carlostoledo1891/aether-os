import fs from 'node:fs'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { createTestApp } from './helpers.js'

const INGEST_KEY = 'lapoc-import-test-key'
const LAPOC_DIR = path.resolve(process.cwd(), '../data/lapoc')

let app: FastifyInstance

beforeAll(async () => {
  process.env.INGEST_API_KEY = INGEST_KEY
  app = await createTestApp()
})

afterAll(async () => {
  delete process.env.INGEST_API_KEY
  await app.close()
})

const headers = { 'x-api-key': INGEST_KEY }

function readCsv(file: string): Record<string, string>[] {
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
  const heads = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim())
    const row: Record<string, string> = {}
    heads.forEach((h, i) => { row[h] = cols[i] ?? '' })
    return row
  })
}

describe('LAPOC sample CSV ingestion seam', () => {
  it('sample CSVs exist in data/lapoc/', () => {
    expect(fs.existsSync(path.join(LAPOC_DIR, 'sample-piezometer.csv'))).toBe(true)
    expect(fs.existsSync(path.join(LAPOC_DIR, 'sample-water-quality.csv'))).toBe(true)
    expect(fs.existsSync(path.join(LAPOC_DIR, 'sample-field-observations.csv'))).toBe(true)
  })

  it('parses sample CSVs into a payload that /ingest/lapoc accepts with source=lapoc', async () => {
    const piezoRows = readCsv(path.join(LAPOC_DIR, 'sample-piezometer.csv'))
    const wqRows = readCsv(path.join(LAPOC_DIR, 'sample-water-quality.csv'))
    const fieldRows = readCsv(path.join(LAPOC_DIR, 'sample-field-observations.csv'))

    expect(piezoRows.length).toBeGreaterThan(0)
    expect(wqRows.length).toBeGreaterThan(0)
    expect(fieldRows.length).toBeGreaterThan(0)

    const payload = {
      source: 'lapoc',
      provenance: 'verified_real',
      timestamp: new Date().toISOString(),
      piezometer_readings: piezoRows.map(r => ({
        sensor_id: r.sensor_id,
        timestamp: new Date(r.timestamp).toISOString(),
        depth_meters: parseFloat(r.depth_meters),
        temperature_c: parseFloat(r.temperature_c),
        conductivity_us_cm: parseFloat(r.conductivity_us_cm),
      })),
      water_quality_samples: wqRows.map(r => ({
        sample_id: r.sample_id,
        timestamp: new Date(r.timestamp).toISOString(),
        location: r.location,
        ph: parseFloat(r.ph),
        sulfate_ppm: parseFloat(r.sulfate_ppm),
        nitrate_ppm: parseFloat(r.nitrate_ppm),
        iron_ppm: parseFloat(r.iron_ppm),
        manganese_ppm: parseFloat(r.manganese_ppm),
        turbidity_ntu: parseFloat(r.turbidity_ntu),
      })),
      field_observations: fieldRows.map(r => ({
        observer: r.observer,
        timestamp: new Date(r.timestamp).toISOString(),
        spring_id: r.spring_id,
        flow_status: r.flow_status,
        ...(r.photo_ref ? { photo_ref: r.photo_ref } : {}),
        notes: r.notes ?? '',
      })),
    }

    const res = await app.inject({ method: 'POST', url: '/ingest/lapoc', headers, payload })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.ok).toBe(true)
    expect(body.piezoCount).toBe(piezoRows.length)
    expect(body.wqCount).toBe(wqRows.length)
  })
})
