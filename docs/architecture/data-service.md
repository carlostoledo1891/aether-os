# Data Service Architecture

## Data Service Layer

- **`AetherDataService`** (`src/services/dataService.ts`) — single interface contract for all data access. All `get*` methods return `MaybeAsync<T>` (= `T | Promise<T>`) — mock returns `T` synchronously, live returns `Promise<T>`. Exception: `getDataContext()` is always synchronous.
- **`MockDataService`** (`src/services/mockDataService.ts`) — used when `VITE_DATA_MODE` is unset or not `live`. Client-side mock data with no network calls. Returns `T` (satisfies `MaybeAsync<T>`).
- **`LiveDataService`** (`src/services/liveDataService.ts`) — selected when `getDataMode() === 'live'`. Fetches domain data from `/api/*` endpoints with 30s TTL caching, receives real-time telemetry via `WebSocket` at `/ws/telemetry`. Returns `Promise<T>`. Falls back to cached data if backend is unreachable. WebSocket URL auto-detects `/ws` prefix.
- **`useServiceQuery` hook** (`src/hooks/useServiceQuery.ts`) — bridges sync/async service methods for React components. Returns `{ data, isLoading, error }`. Uses dedup cache (200ms window) and inflight request sharing. Selector stored in `useRef` to prevent re-render loops. `useServiceQueryWithArg` variant for methods with dynamic arguments.
- **`LoadingSkeleton`** (`src/components/ui/LoadingSkeleton.tsx`) — consistent loading state shown when `isLoading` is true. Variants: `card`, `row`, `metric`, `full`.
- **`DataServiceProvider`** (`src/services/DataServiceProvider.tsx`) — React Context + hooks:
  - `useDataService()` — full service instance
  - `useTelemetry()` — current telemetry snapshot (plant + env + esg + alerts + history)
  - `useAetherService()` — alias for the service object with all query methods
- **Tick system:** 2s interval (engine-side). Engine generates telemetry → POSTs to `/ingest/telemetry` → server stores + broadcasts via WebSocket → `LiveDataService` receives and updates React state.

## External API Enrichment (Engine)

| Enricher | API | Frequency | Data | Provenance tag |
|----------|-----|-----------|------|---------------|
| Open-Meteo | `api.open-meteo.com` | 30 min | Precipitation mm/h for Caldeira coords | `Open-Meteo` |
| BCB PTAX | `olinda.bcb.gov.br` | 1 hour | BRL/USD exchange rate | `BCB` |
| USGS Seismic | `earthquake.usgs.gov` | 6 hours | M2.5+ events within 200km | `USGS` |
| Alpha Vantage | `alphavantage.co` | 24 hours | MEI.AX stock quote | `AlphaVantage` |
| LAPOC (sim) | — | 30 min | Synthetic instrument data (swap-ready) | `Vero Simulation Engine` |

Enrichers are toggleable via env vars: `ENRICHER_OPENMETEO=1`, `ENRICHER_BCB=1`, `ENRICHER_USGS=1`, `ALPHA_VANTAGE_KEY=...`.

## LAPOC Ingestion Contract

The `LapocTelemetryPayload` interface defines the data shape expected from Dr. Caponi's LAPOC instruments. Currently fed by a synthetic generator in the engine; when real instruments are connected, only the adapter function changes. Full documentation: `docs/data/caldeira/LAPOC_INGESTION.md`.

## Provenance System (Dynamic)

The `/api/provenance` and `/api/context` endpoints dynamically update based on what data has actually been ingested:
- If Open-Meteo data has been received → `precip_field` becomes `verified_real`, hydro spring status becomes `modeled` (with real precip input).
- If BCB data has been received → `fx_rate` becomes `verified_real`.
- Banner label evolves: "Vero Simulation Engine" → "Live pipeline — enriched with Open-Meteo, BCB" → "Live pipeline — LAPOC field instruments" (future).

## Live Thresholds

### `PlantTelemetry`

| Field | Target | Alert trigger |
|---|---|---|
| `flow_metrics.recirculation_pct` | > 95% | < 94% → warning |
| `leaching_circuit.ph_level` | 4.0 – 5.0 | < 3.9 or > 5.1 → warning |
| `output.treo_grade_pct` | > 90% | < 90% → shows running state |
| `fjh_separation.energy_savings_pct` | ~87% | tracked only |

### `EnvTelemetry`

| Field | Limit | Status |
|---|---|---|
| `water_quality.sulfate_ppm` | < 250 | amber if breached |
| `water_quality.nitrate_ppm` | < 50 | amber if breached |
| `legacy_infrastructure.radiation_usv_h` | < 0.18 | red if breached |
| `aquifer.sensors[].status` | Normal | amber/red per sensor |