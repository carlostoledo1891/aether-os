# LAPOC sample CSVs

These CSV files define the **shape** of data we expect from Dr. Caponi's LAPOC
laboratory at POCOS DE CALDAS. They exist so the ingestion seam ships and can
be swapped for real LAPOC exports with zero code changes.

For the full contract (field types, provenance tagging, endpoint behaviour),
see [docs/data/caldeira/LAPOC_INGESTION.md](../../docs/data/caldeira/LAPOC_INGESTION.md).

## Files

| File | Shape | Ingested as |
|------|-------|-------------|
| `sample-piezometer.csv` | one row per reading (water table depth, temp, conductivity) | `piezometer_readings[]` |
| `sample-water-quality.csv` | one row per lab sample | `water_quality_samples[]` |
| `sample-field-observations.csv` | one row per site visit note | `field_observations[]` |

All three files are tagged as `source: 'lapoc'` and `provenance: 'verified_real'`
when posted via `npm run ingest:lapoc`. The root-level orchestrator at
[scripts/ingest-lapoc.ts](../../scripts/ingest-lapoc.ts) reads all three CSVs,
composes one `LapocTelemetryPayload`, and POSTs to `/ingest/lapoc`.

## Usage

```bash
# One-shot: parse all sample CSVs and post to the local server
npm run ingest:lapoc

# Or point at a different API / auth key
API_URL=https://api.example.com INGEST_API_KEY=xxx npm run ingest:lapoc

# Or specify custom CSVs
npm run ingest:lapoc -- \
  --piezometer data/lapoc/my-piezo.csv \
  --water-quality data/lapoc/my-wq.csv \
  --field-observations data/lapoc/my-field.csv
```

## Column contracts

### piezometer

```
sensor_id          e.g. PIZ-LAPOC-01
timestamp          ISO 8601 UTC
depth_meters       water table depth (m)
temperature_c      groundwater temperature
conductivity_us_cm micro-siemens / cm
```

### water quality

```
sample_id          lab tracking ID
timestamp          ISO 8601 UTC
location           free text ("Caldeira discharge point")
ph                 pH
sulfate_ppm        ppm
nitrate_ppm        ppm
iron_ppm           ppm
manganese_ppm      ppm
turbidity_ntu      NTU
```

### field observations

```
observer           e.g. "Dr. Caponi"
timestamp          ISO 8601 UTC
spring_id          matches spring GeoJSON id (e.g. SP-03)
flow_status        active | reduced | dry
photo_ref          optional (URL or filename)
notes              free text
```

## Replacing with real LAPOC exports

When Dr. Caponi provides CSVs:
1. Drop them into `data/lapoc/` (any filename).
2. Run `npm run ingest:lapoc -- --piezometer <path> ...`.
3. The ingest route yields to `verified_real` data, and the engine's synthetic
   LAPOC generator silently steps aside (see `engine/src/enrichers/lapocAdapter.ts`).
