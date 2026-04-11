/**
 * LAPOC Ingestion Adapter
 *
 * Today: generates synthetic LAPOC-style piezometer and water-quality data,
 * tagged as `source: 'lapoc-simulated'`.
 *
 * When real LAPOC instruments connect (CSV upload, API, or direct push),
 * swap the synthetic generators below for a real reader. The server endpoint,
 * provenance tagging, and frontend display require zero changes.
 */

import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

/* ─── LAPOC Telemetry Contract ──────────────────────────────────────────── */

export interface LapocPiezometerReading {
  sensor_id: string
  timestamp: string
  depth_meters: number
  temperature_c: number
  conductivity_us_cm: number
}

export interface LapocWaterQualitySample {
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

export interface LapocFieldObservation {
  observer: string
  timestamp: string
  spring_id: string
  flow_status: 'active' | 'reduced' | 'dry'
  photo_ref?: string
  notes: string
}

export interface LapocTelemetryPayload {
  source: 'lapoc' | 'lapoc-simulated'
  provenance: 'verified_real' | 'simulated'
  timestamp: string
  piezometer_readings: LapocPiezometerReading[]
  water_quality_samples: LapocWaterQualitySample[]
  field_observations: LapocFieldObservation[]
}

/* ─── Synthetic LAPOC generator (placeholder) ───────────────────────────── */

function drift(value: number, variance: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value + (Math.random() - 0.5) * 2 * variance))
}

const lastPiezoDepths = new Map<string, number>([
  ['PIZ-LAPOC-01', 14.2],
  ['PIZ-LAPOC-02', 22.8],
  ['PIZ-LAPOC-03', 18.5],
])

function generateSyntheticLapoc(): LapocTelemetryPayload {
  const now = new Date().toISOString()

  const piezometer_readings: LapocPiezometerReading[] = []
  for (const [sensorId, prevDepth] of lastPiezoDepths) {
    const depth = drift(prevDepth, 0.1, prevDepth - 2, prevDepth + 3)
    lastPiezoDepths.set(sensorId, depth)
    piezometer_readings.push({
      sensor_id: sensorId,
      timestamp: now,
      depth_meters: depth,
      temperature_c: drift(19.2, 0.3, 16, 24),
      conductivity_us_cm: drift(340, 15, 200, 600),
    })
  }

  const water_quality_samples: LapocWaterQualitySample[] = [
    {
      sample_id: `WQ-${Date.now()}`,
      timestamp: now,
      location: 'Caldeira discharge point',
      ph: drift(7.1, 0.1, 6.5, 8.0),
      sulfate_ppm: drift(145, 8, 80, 250),
      nitrate_ppm: drift(28, 3, 10, 50),
      iron_ppm: drift(0.15, 0.03, 0.01, 0.5),
      manganese_ppm: drift(0.08, 0.02, 0.01, 0.3),
      turbidity_ntu: drift(4.2, 1.0, 0.5, 15),
    },
  ]

  return {
    source: 'lapoc-simulated',
    provenance: 'simulated',
    timestamp: now,
    piezometer_readings,
    water_quality_samples,
    field_observations: [],
  }
}

/* ─── Ingestion loop ────────────────────────────────────────────────────── */

export async function ingestLapocPayload(payload: LapocTelemetryPayload): Promise<void> {
  const res = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/lapoc`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Ingest LAPOC failed: ${res.status}`)
}

export function startLapocSimulator() {
  const intervalMs = 30_000

  console.log(`[lapoc] Starting synthetic LAPOC adapter (interval: ${intervalMs / 1000}s)`)

  const run = async () => {
    try {
      try {
        const checkRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/api/lapoc/latest`)
        if (checkRes.ok) {
          const latest = await checkRes.json()
          if (latest && latest.provenance === 'verified_real') {
            const ageMs = Date.now() - new Date(latest.timestamp).getTime()
            if (ageMs < 24 * 60 * 60 * 1000) {
              console.log(`[lapoc] Yielding to real LAPOC data (age: ${Math.round(ageMs / 60000)}m)`)
              return
            }
          }
        }
      } catch { /* ignore check errors */ }

      const payload = generateSyntheticLapoc()
      await ingestLapocPayload(payload)
      console.log(`[lapoc] Ingested ${payload.piezometer_readings.length} piezo + ${payload.water_quality_samples.length} WQ samples`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[lapoc] ${msg}`)
    }
  }

  run()
  setInterval(run, intervalMs)
}
