# LAPOC Data Ingestion Contract

## Overview

This document defines the data contract for Dr. Caponi's LAPOC field instruments.
When real LAPOC data becomes available (CSV upload, direct API push, or manual entry),
it flows through the same `POST /ingest/lapoc` endpoint that the simulation engine
currently uses with synthetic data. **Zero frontend or backend code changes required.**

## Payload Interface

```typescript
interface LapocTelemetryPayload {
  source: 'lapoc' | 'lapoc-simulated'
  provenance: 'verified_real' | 'simulated'
  timestamp: string  // ISO 8601

  piezometer_readings: LapocPiezometerReading[]
  water_quality_samples: LapocWaterQualitySample[]
  field_observations: LapocFieldObservation[]
}

interface LapocPiezometerReading {
  sensor_id: string        // e.g. 'PIZ-LAPOC-01'
  timestamp: string        // ISO 8601
  depth_meters: number     // water table depth
  temperature_c: number    // groundwater temperature
  conductivity_us_cm: number
}

interface LapocWaterQualitySample {
  sample_id: string        // lab tracking ID
  timestamp: string
  location: string         // e.g. 'Caldeira discharge point'
  ph: number
  sulfate_ppm: number
  nitrate_ppm: number
  iron_ppm: number
  manganese_ppm: number
  turbidity_ntu: number
}

interface LapocFieldObservation {
  observer: string         // e.g. 'Dr. Caponi'
  timestamp: string
  spring_id: string        // matches spring GeoJSON id
  flow_status: 'active' | 'reduced' | 'dry'
  photo_ref?: string       // URL or file reference
  notes: string
}
```

## Ingestion Endpoint

```
POST /ingest/lapoc
Content-Type: application/json
```

The server stores the latest LAPOC payload and serves it via `GET /api/lapoc/latest`.

## Integration Modes

### Mode 1: Simulation (current)

The Aether Engine generates synthetic LAPOC-style data every 30 seconds,
tagged as `source: 'lapoc-simulated'` and `provenance: 'simulated'`.
Provenance badges in the UI show "Simulated."

### Mode 2: CSV Upload (near-term)

When Dr. Caponi provides CSV files from LAPOC instruments:
1. Parse CSV into `LapocTelemetryPayload` format
2. POST to `/ingest/lapoc` with `source: 'lapoc'` and `provenance: 'verified_real'`
3. Provenance badges automatically update to "Live feed"

### Mode 3: Direct Push (future)

When LAPOC instruments can push data directly:
1. Configure instruments to POST to `{AETHER_API_URL}/ingest/lapoc`
2. Set `source: 'lapoc'` in the payload
3. The engine's synthetic LAPOC generator can be disabled

## Provenance Evolution

| Phase | `source` | `provenance` | UI Badge |
|-------|----------|-------------|----------|
| Simulation | `lapoc-simulated` | `simulated` | Simulated |
| CSV Upload | `lapoc` | `verified_real` | Live feed (LAPOC) |
| Direct Push | `lapoc` | `verified_real` | Live feed (LAPOC) |

## Data Quality Notes

- Piezometer readings: expect 3-6 sensors, 10-minute intervals
- Water quality: lab samples typically weekly or bi-weekly
- Field observations: quarterly visits (photos + flow status)
- All timestamps should be UTC ISO 8601
- Missing fields should be omitted (not null)
