# Aether OS — Handoff Document

> **Update this file at the end of every chat session.**  
> It is the single source of truth for any new conversation picking up this project.

---

## Project Overview

**Aether OS** is a B2B SaaS platform — a "Trust Bridge" and compliance clearinghouse for the critical minerals / rare earth elements (REE) supply chain. Its primary showcase project is **Meteoric Resources' Caldeira Project** in Poços de Caldas, Minas Gerais, Brazil (ASX: MEI).

The prototype is built to pitch to:
- **Buyers** (DoD, EV OEMs, magnet manufacturers) needing FEOC-clean, IRA-compliant supply
- **Regulators** (MPF, FEAM, IBAMA) needing real-time environmental compliance telemetry
- **Operators** (Meteoric Resources, Ucore, Neo Performance Materials) needing plant efficiency visibility
- **Executives** needing a pitch-ready financial / ESG overview

**Dev server:** `http://localhost:5175/` (frontend via Vite proxy → API at `:3001`)  
**Working directory:** `/Users/carlostoledo/Documents/Aether Project/aether-os`  
**Start all:** `npm run dev:all` (concurrently: API server + simulation engine + Vite frontend)

**Marketing / deck copy (iterate in repo):** [`docs/copy/WEBSITE_COPY.md`](docs/copy/WEBSITE_COPY.md), [`docs/copy/PITCH_DECK_COPY.md`](docs/copy/PITCH_DECK_COPY.md)

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Language | TypeScript 5.9 (strict) — all three packages |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite` plugin) |
| Animation | Motion (`motion/react`) 12.x |
| Charts | Recharts |
| Icons | `lucide-react` |
| Map | `react-map-gl` v8 + `maplibre-gl` |
| Map tiles | MapTiler (Dataviz Dark style + terrain DEM) |
| Testing | Vitest 4.x + `@testing-library/react` + `happy-dom` |
| **Backend** | **Fastify 5.8 + `better-sqlite3` 12.x** |
| **Engine** | **Node.js + TypeScript (standalone process)** |
| **Server testing** | **Vitest 4.x + Fastify `.inject()` (22 route-level tests)** |
| **Dev runner** | **`concurrently` (runs all 3 processes via `npm run dev:all`)** |
| Font: UI | Inter (Google Fonts) |
| Font: Mono | JetBrains Mono (Google Fonts) |

---

## File Structure

```
aether-os/
├── index.html
├── vite.config.ts                       Vite config + proxy (/api→:3001, /ws→ws://:3001)
├── docker-compose.yml                   3-service deploy (api, engine, ui)
├── nginx.conf                           production reverse proxy for API/WS
├── .github/workflows/ci.yml            lint + test:run + build on push/PR
├── .env                                VITE_MAPTILER_KEY + VITE_DATA_MODE=live
├── HANDOFF.md                          ← this file
├── server/                              NEW — Fastify backend (Aether API)
│   ├── package.json                    aether-api — Fastify + better-sqlite3
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
│       ├── index.ts                    server entry (Fastify + CORS + WebSocket + all routes + ingest guard)
│       ├── seed.ts                     seeds SQLite with mockData on first boot (25+ domain keys)
│       ├── store/db.ts                 SQLite setup, CRUD ops, telemetry ring buffer (DB_PATH from env)
│       ├── __tests__/                  route-level integration tests (Fastify .inject())
│       │   ├── helpers.ts              test app factory (no listen, logger off)
│       │   ├── health.test.ts          health endpoint shape
│       │   ├── telemetry.test.ts       ingest + current + history round-trip
│       │   ├── domain.test.ts          seeded domain data endpoints
│       │   └── ingest-guard.test.ts    API key guard (reject/accept)
│       ├── types/shared.ts             types shared with engine
│       ├── routes/
│       │   ├── health.ts               GET /api/health (uptime, lastIngestAt, source)
│       │   ├── telemetry.ts            GET /api/telemetry/current, /history?range=
│       │   └── domain.ts               40+ REST endpoints (financials, risks, batches, etc.)
│       ├── ws/telemetryChannel.ts      WS /ws/telemetry (broadcast to all clients)
│       └── ingest/
│           ├── telemetryHook.ts        POST /ingest/telemetry (engine → store → WS broadcast)
│           ├── weatherHook.ts          POST /ingest/weather
│           ├── marketHook.ts           POST /ingest/market + /ingest/seismic
│           └── lapocHook.ts            POST /ingest/lapoc (LAPOC instruments)
├── engine/                              NEW — Aether Simulation Engine
│   ├── package.json                    aether-engine — Node.js + TypeScript
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
│       ├── index.ts                    tick loop (2s) + server health wait + enricher start
│       ├── config.ts                   engine config (tick rate, API keys, site coords, ingest headers)
│       ├── generators/
│       │   ├── types.ts                engine-local telemetry types
│       │   ├── plantGenerator.ts       lifted from mockGenerator.ts
│       │   ├── envGenerator.ts         lifted from mockGenerator.ts
│       │   └── alertGenerator.ts       alert detection + ESG score calculation
│       └── enrichers/
│           ├── openMeteo.ts            real precipitation — Open-Meteo (30min)
│           ├── bcbExchange.ts          BRL/USD — Banco Central do Brasil (1h)
│           ├── usgsSeismic.ts          earthquake data — USGS (6h)
│           ├── alphaVantage.ts         MEI.AX stock quote (daily, key-gated)
│           └── lapocAdapter.ts         synthetic LAPOC data (swap-ready contract)
├── docs/
│   ├── STYLING.md                      styling contract: W vs CSS vars, primitives, future themes
│   ├── copy/
│   │   ├── WEBSITE_COPY.md             marketing + UI string source for iteration
│   │   └── PITCH_DECK_COPY.md          slide-style pitch narrative
│   └── data/caldeira/
│       ├── DATA_SOURCES.md             GeoJSON / dataset registry + URLs
│       └── GLOSSARY.md                 permitting & project terminology
├── src/
│   ├── main.tsx                        entry point
│   ├── App.tsx                         ErrorBoundary → DataServiceProvider → MapProvider → AppShell (CSS module + view routing)
│   ├── AppShell.module.css             root shell: bg + grid via CSS vars (--w-bg, --w-app-shell-grid)
│   ├── types/
│   │   ├── telemetry.ts                plant/env/ESG interfaces — ViewMode: 'operator'|'buyer'|'executive'
│   │   └── liveTelemetry.ts            future LiveTelemetryEnvelope DTO (map → PlantTelemetry/EnvTelemetry)
│   ├── data/
│   │   ├── mockData.ts                 BATCHES, INITIAL_PLANT/ENV_TELEMETRY, PROJECT_FINANCIALS, MARKET_PRICES, DEPOSIT_DATA, PILOT_PLANT_PERFORMANCE, U_TH_SAFETY, PROJECT_TIMELINE, RESOURCE_CLASSIFICATION, CYBER_TRUST_PILLARS, HARDWARE_SENSORS, SCOPE_3_TRACKING, SPRING_COUNT
│   │   ├── mockGenerator.ts            drift(), generatePlantTelemetry(scale), generateEnvTelemetry(scale), detectAlerts(), calculateEsgScore()
│   │   ├── caldeira/                   issuerSnapshot.ts, spatialInsights.ts — ASX-facing citations + pilot↔plant km / APA heuristics
│   │   └── geojson/                    static Caldeira map geometry for MapLibre sources/layers
│   │       ├── caldeira-boundary.geojson        Poços alkaline complex outline (terrain master; non-survey)
│   │       ├── caldeira-deposits.geojson        7 deposit polygons (optional on Operations — off by default)
│   │       ├── caldeira-licenses.geojson        7 per-block mining licence polygons + MRE-style props (`ops_reality_tenements`)
│   │       ├── caldeira-drillholes.geojson      8 named collars DD/AC + intercept fields
│   │       ├── caldeira-pfs-engineering.geojson PFS starter pit + spent clay footprint
│   │       ├── caldeira-ops-plant-sites.geojson pilot + commercial plant points (default On on Operations)
│   │       ├── caldeira-access-routes.geojson   concept access road LineString (ultimate_v1 merge)
│   │       ├── caldeira-licence-envelope.geojson optional 193 km² union context polygon
│   │       ├── caldeira-apa-pedra-branca.geojson / caldeira-apa-buffer.geojson  APA core + schematic buffer (split files)
│   │       ├── caldeira-urban-context.geojson   Poços city centroid (Point, `urban-centroid`) for Hydro tab
│   │       ├── caldeira-neighbors.geojson       Axel REE Caldas adjacent tenement (district context)
│   │       ├── caldeira-infrastructure.geojson  full logistics mesh (ports, roads, supply art) — optional on Operations
│   │       ├── caldeira-environmental.geojson   water monitoring zone (Hydro Twin)
│   │       ├── caldeira-reference-udc.geojson   UDC reference footprint
│   │       ├── plant-nodes.geojson / plant-edges.geojson  pilot flow schematic — optional on Operations
│   │       ├── hydro-nodes.geojson              hydro monitoring nodes + UDC point
│   │       └── hydro-springs.geojson          ~1,092 spring points (FBDS/CAR reference) inside boundary
│   ├── services/
│   │   ├── dataService.ts              AetherDataService interface — single contract for all data
│   │   ├── mockDataService.ts          MockDataService — mock data injection at the service boundary
│   │   ├── liveDataService.ts          createLiveDataService() — live mode with connectionStatus tracking, WS backoff, API key guard
│   │   └── DataServiceProvider.tsx     React Context provider + useDataService/useTelemetry/useAetherService hooks
│   ├── config/
│   │   └── env.ts                      getDataMode, getApiBaseUrl, getWsUrl, getDisclosureMode (Vite env helpers)
│   ├── hooks/
│   │   └── useSiteWeather.ts           Open-Meteo precip (optional) + mockDailyPrecipSeries fallback
│   ├── app/canvas/
│   │   └── canvasTheme.ts              W{} token object (JS mirror of CSS vars), DOMAIN_COLORS, StatusType
│   ├── test/
│   │   └── setup.ts                    Vitest setup — imports @testing-library/jest-dom
│   ├── styles/
│   │   ├── fonts.css                   Google Fonts imports
│   │   └── theme.css                   CSS variables (:root) + @theme inline (Tailwind 4 tokens)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx           glassmorphism card (glow variants: violet|cyan|green|amber|red|none)
│   │   │   ├── GlowingIcon.tsx         lucide icon + drop-shadow glow
│   │   │   ├── StatusChip.tsx          pill badge (variant + dot)
│   │   │   ├── MetricDisplay.tsx       animated numeric value + unit + trend arrow
│   │   │   ├── CountdownTimer.tsx      countdown to target ISO date
│   │   │   ├── TimeRangeSelector.tsx  24h/7d/30d toggle for sparkline history
│   │   │   ├── SectionLabel.tsx       uppercase panel section titles
│   │   │   ├── MutedCaption.tsx       disclaimer / helper paragraph style
│   │   │   └── HairlineDivider.tsx    1px separator (horizontal or vertical)
│   │   ├── charts/
│   │   │   ├── SparkLine.tsx           Recharts LineChart with threshold bands
│   │   │   ├── GaugeChart.tsx          circular SVG gauge
│   │   │   └── BarComparison.tsx       horizontal bar comparison
│   │   ├── layout/
│   │   │   ├── HeaderStrip.tsx         single-row navbar: logo | ViewSwitcher | ESG, alerts
│   │   │   ├── DataModeBanner.tsx      data-honesty strip (Demo data / Live — backend not connected + detail)
│   │   │   ├── ViewSwitcher.tsx        3-tab nav (Field Operations | Compliance & Traceability | Executive Overview) + alert badge
│   │   │   └── AlertPanel.tsx          right-side sliding alert drawer
│   │   ├── map/                        GeoJSON-driven MapLibre overlay system
│   │   │   ├── MapBase.tsx             react-map-gl + MapLibre wrapper; exports FIELD/BUYER/EXEC_VIEW_STATE (field zoom tuned for full Caldeira boundary)
│   │   │   ├── mapStacking.ts          MAP_STACKING z-index contract (field title, HUD, tooltip, etc.)
│   │   │   ├── hydroDetailMappers.ts   toSpringDetail / toHydroNodeDetail / tierShort (+ types)
│   │   │   ├── hydroLayerIds.ts        HYDRO_*_LAYER_ID constants
│   │   │   ├── HydroOverlay.module.css map HUD layout classes
│   │   │   ├── geojson.ts              GeoJSON loader + PointGeometry/LineStringGeometry/PolygonGeometry typings
│   │   │   ├── CaldeiraBoundary.tsx    alkaline complex fill + glow + dashed edge (`caldeira-boundary.geojson`)
│   │   │   ├── PlantOverlay.tsx        plant schematic nodes/edges — optional on Operations (`plantSchematic` toggle)
│   │   │   ├── HydroOverlay.tsx        springs, hydro nodes, HUD; Hydro Twin tab
│   │   │   ├── DepositOverlay.tsx      7 deposit polygons; optional on Operations (`deposits` toggle); DEPOSIT_LAYER_ID, toDepositDetail()
│   │   │   ├── LicenseOverlay.tsx      7 per-block licence polygons; LICENSE_LAYER_ID, toLicenseDetail() (+ resource_category / total_mt)
│   │   │   ├── DrillHoleOverlay.tsx    8 collars; hole_type filter DD/AC/AUGER; DRILL_LAYER_ID, toDrillHoleDetail()
│   │   │   ├── PfsEngineeringOverlay.tsx  pit + spent-clay polygons
│   │   │   ├── OpsPlantSitesOverlay.tsx   pilot + commercial plant points (OPS_PLANT_SITE_CORE_LAYER_ID)
│   │   │   ├── AccessRoutesOverlay.tsx    concept road LineString
│   │   │   ├── LicenceEnvelopeOverlay.tsx optional 193 km² dashed context
│   │   │   ├── InfraOverlay.tsx        full logistics mesh — optional on Operations (`infra` toggle); supply route when showRoute (BuyerView)
│   │   │   ├── EnvironmentalOverlay.tsx  APA + buffer (split GeoJSON) + monitoring + urban centroid + UDC; Hydro Twin (+ env toggles)
│   │   │   └── NeighborOverlay.tsx     Axel REE Caldas adjacent tenement (e.g. geology context)
│   │   ├── EsgScoreRing.tsx            composite ESG ring gauge
│   │   ├── GreenPremiumCard.tsx        spot vs certified NdPr price delta card
│   │   └── BlockchainTimeline.tsx      molecular-to-magnet vertical timeline
│   └── views/
│       ├── FieldView.tsx               2-tab MapLibre: Operations | Hydro Twin — layered overlays + `FieldMapGeoInspector` + `fieldMapLayers` toggles
│       ├── field/
│       │   ├── constants.ts            MapTab, colors, chain/license data shared with panels
│       │   ├── FieldMapChrome.module.css map title row (gradient + MAP_STACKING.fieldTitle)
│       │   ├── FieldBottomMetrics.tsx  bottom KPI strip (5 tiles)
│       │   ├── FieldPinnedAssetCard.tsx active asset / pinned node detail
│       │   ├── OperationsPanel.tsx     Operations — map layer toggles (terrain vs legacy), spatial cross-check, plant metrics, sparklines
│       │   ├── EnvironmentPanel.tsx    Hydro Twin — map env toggles, monitoring, modeling, aquifer / WQ / springs (+ MonitoringNetworkCard)
│       │   ├── fieldMapLayers.ts       DEFAULT_FIELD_OPS_LAYERS / ENV — plantSites on, infra+schematic+deposits off by default
│       │   ├── FieldMapGeoInspector.tsx click-selection detail for licence / drill / PFS / infra / route / envelope / env
│       │   ├── fieldMapGeoSelection.ts selection types + toAccessRouteDetail / toLicenceEnvelopeDetail
│       │   ├── MonitoringNetworkCard.tsx tier mix + precip context (Tailwind + tokens)
│       │   ├── GeologyPanel.tsx        deposit cards (used by ExecutiveView Assets, not Field map tabs)
│       │   └── LicensesPanel.tsx       licence zone cards (used by ExecutiveView Assets)
│       ├── BuyerView.tsx               supply-chain MapLibre hero + tabbed right panel (Compliance | Traceability)
│       └── ExecutiveView.tsx           full-width tabbed dashboard (no map) — Assets … ESG
```

---

## Design System

### Palette (`src/app/canvas/canvasTheme.ts` + `src/styles/theme.css`)

| Token | Hex | Use |
|---|---|---|
| `W.bg` | `#07070E` | App background |
| `W.canvas` | `#060610` | Map backgrounds |
| `W.panel` | `#0D0D1C` | Cards / panels |
| `W.violet` | `#7C5CFC` | Primary accent, processing domain |
| `W.violetSoft` | `#9D80FF` | Secondary violet |
| `W.cyan` | `#00D4C8` | Extraction / hydrology domain |
| `W.green` | `#22D68A` | Compliance / success |
| `W.amber` | `#F5A623` | Warning / monitor |
| `W.red` | `#FF4D4D` | Critical / alert |
| `W.text1–4` | `#ECECF8 → #484870` | Text hierarchy |

### Domain Colors (SVG maps)

| Domain | Color | Used for |
|---|---|---|
| `extraction` | cyan | Mine blocks |
| `processing` | violet | Leach, Precip, CIP, FJH |
| `compliance` | green | XRF/QA |
| `transport` | violetSoft | Container/Export |
| `monitor` | amber | Piezometers, UDC |
| `external` | border3 | Competitor projects (muted) |

### Key CSS Keyframes (`src/styles/index.css`)
- `flow-dash` / `flow-dash-slow` — SVG edge animation (`stroke-dashoffset`)
- `node-ring-pulse` — expanding ring pulse
- `warn-pulse-glow` — pulsing outer glow for warning/critical map nodes (used by PlantOverlay and HydroOverlay `Marker` components)
- `.map-flow-edge`, `.map-flow-edge-med`, `.map-flow-edge-slow` — edge speed classes

---

## Geographic Reference

All map views use MapLibre GL JS with WGS 84 coordinates. Key site positions:

| Site | Lat, Lng |
|---|---|
| Pilot plant (ops reality GeoJSON) | −21.800, −46.575 |
| Commercial plant collar (ops reality) | −21.885, −46.545 |
| Poços city centroid (urban layer) | −21.788, −46.561 |
| CIP Plant (hub — schematic / legacy plant graph) | −21.793, −46.555 |
| Block 14-C (mine — legacy narrative) | −21.848, −46.618 |
| UDC legacy site | −21.912, −46.648 |
| PCAC center | −21.790, −46.580 |

*Straight-line pilot → commercial plant distance for executive copy is computed in `spatialInsights.ts` from the two ops-reality collars above.*

**Default view states** (exported from `MapBase.tsx`):
- `FIELD_VIEW_STATE`: zoom **10.98** (slightly zoomed out vs earlier builds so the Caldeira boundary is less clipped), center **−21.91, −46.52**
- `BUYER_VIEW_STATE`: zoom 7.5 (shows Caldeira → Santos route)
- `EXEC_VIEW_STATE`: zoom 10.8 (regional overview)

---

## Data Architecture

### Three-Process Architecture (Synthetic Data Bridge)

The system runs as three independent processes connected via HTTP and WebSocket:

```
┌─────────────────────┐    POST /ingest/*    ┌──────────────────────┐
│   aether-engine     │ ──────────────────── │   aether-api         │
│   (Simulation Bot)  │   every 2 seconds    │   (Fastify + SQLite) │
│                     │                      │                      │
│   Enrichers:        │                      │   REST: /api/*       │
│   ├─ Open-Meteo     │                      │   WS:  /ws/telemetry │
│   ├─ BCB PTAX       │                      │   DB:  aether.db     │
│   ├─ USGS Seismic   │                      └───────┬──────────────┘
│   ├─ Alpha Vantage  │                              │
│   └─ LAPOC (sim)    │                              │ fetch() + WebSocket
└─────────────────────┘                              ▼
                                             ┌──────────────────────┐
                                             │   Vite Frontend      │
                                             │   (React 19)         │
                                             │                      │
                                             │   LiveDataService    │
                                             │   → REST for domain  │
                                             │   → WS for telemetry │
                                             └──────────────────────┘
```

**Why this architecture:** The engine generates data that looks and behaves like real sensor/instrument telemetry, posted to real HTTP endpoints. The frontend talks to real REST/WebSocket endpoints. When actual sensor data (LAPOC, SCADA) arrives, the engine's synthetic generators are replaced — no frontend or server changes needed. Data provenance tags track every source.

### Data Service Layer
- **`AetherDataService`** (`src/services/dataService.ts`) — single interface contract for all data access (telemetry, scenarios, risks, off-takers, capital, audit, ESG, **`getIssuerSnapshot()`**, **`getSpatialInsights()`**, etc.)
- **`MockDataService`** (`src/services/mockDataService.ts`) — used when `VITE_DATA_MODE` is unset or not `live`. Client-side mock data with no network calls.
- **`LiveDataService`** (`src/services/liveDataService.ts`) — selected when `getDataMode() === 'live'`. **Now a real backend client:** fetches domain data from `/api/*` endpoints with TTL caching, and receives real-time telemetry via `WebSocket` at `/ws/telemetry`. Falls back to mock data if the backend is unreachable.
- **`DataServiceProvider`** (`src/services/DataServiceProvider.tsx`) — React Context + hooks:
  - `useDataService()` — full service instance
  - `useTelemetry()` — current telemetry snapshot (plant + env + esg + alerts + history)
  - `useAetherService()` — alias for the service object with all query methods
- **Tick system:** 2s interval (engine-side). Engine generates telemetry → POSTs to `/ingest/telemetry` → server stores + broadcasts via WebSocket → `LiveDataService` receives and updates React state.

### External API Enrichment (Engine)

| Enricher | API | Frequency | Data | Provenance tag |
|----------|-----|-----------|------|---------------|
| Open-Meteo | `api.open-meteo.com` | 30 min | Precipitation mm/h for Caldeira coords | `Open-Meteo` |
| BCB PTAX | `olinda.bcb.gov.br` | 1 hour | BRL/USD exchange rate | `BCB` |
| USGS Seismic | `earthquake.usgs.gov` | 6 hours | M2.5+ events within 200km | `USGS` |
| Alpha Vantage | `alphavantage.co` | 24 hours | MEI.AX stock quote | `AlphaVantage` |
| LAPOC (sim) | — | 30 min | Synthetic instrument data (swap-ready) | `Aether Simulation Engine` |

Enrichers are toggleable via env vars: `ENRICHER_OPENMETEO=1`, `ENRICHER_BCB=1`, `ENRICHER_USGS=1`, `ALPHA_VANTAGE_KEY=...`.

### LAPOC Ingestion Contract

The `LapocTelemetryPayload` interface defines the data shape expected from Dr. Caponi's LAPOC instruments. Currently fed by a synthetic generator in the engine; when real instruments are connected, only the adapter function changes. Full documentation: [`docs/data/caldeira/LAPOC_INGESTION.md`](docs/data/caldeira/LAPOC_INGESTION.md).

### Provenance System (Dynamic)

The `/api/provenance` and `/api/context` endpoints dynamically update based on what data has actually been ingested:
- If Open-Meteo data has been received → `precip_field` becomes `verified_real`, hydro spring status becomes `modeled` (with real precip input).
- If BCB data has been received → `fx_rate` becomes `verified_real`.
- Banner label evolves: "Aether Simulation Engine" → "Live pipeline — enriched with Open-Meteo, BCB" → "Live pipeline — LAPOC field instruments" (future).

### Removed: `useSimulatedTelemetry`
- Deleted; all views consume telemetry via **`DataServiceProvider`** only.

### `PlantTelemetry` — live thresholds
| Field | Target | Alert trigger |
|---|---|---|
| `flow_metrics.recirculation_pct` | > 95% | < 94% → warning |
| `leaching_circuit.ph_level` | 4.0 – 5.0 | < 3.9 or > 5.1 → warning |
| `output.treo_grade_pct` | > 90% | < 90% → shows running state |
| `fjh_separation.energy_savings_pct` | ~87% | tracked only |

### `EnvTelemetry` — live thresholds
| Field | Limit | Status |
|---|---|---|
| `water_quality.sulfate_ppm` | < 250 | amber if breached |
| `water_quality.nitrate_ppm` | < 50 | amber if breached |
| `legacy_infrastructure.radiation_usv_h` | < 0.18 | red if breached |
| `aquifer.sensors[].status` | Normal | amber/red per sensor |

### Project Financials (`PROJECT_FINANCIALS`)
```
Pre-tax NPV: $821M (consensus) – $1,985M (forecast) | Post-tax: $488M – $1,256M
IRR Pre-tax: 28–39% | Post-tax: 21–31% | CAPEX: $443M | Payback: <3 yrs
LOM FCF: $2.0B | 20-year mine life | 6.0 Mtpa throughput
Annual: 13,584 t TREO | 4,228 t NdPr | 130 t DyTb | LOM: 271,687 t TREO
Funding: EXIM US$350M + EFA A$70M (~94% of CAPEX)
NdPr Net OPEX: $22/kg
```

### Resource Classification (`RESOURCE_CLASSIFICATION`)
```
Global: 1.537 Bt @ 2,359 ppm TREO | M&I: 666 Mt @ 2,685 ppm | Measured: 37 Mt @ 2,983 ppm
7 deposits | 750+ drill holes | 24% MREO avg
(Sum verified: 37 + 666 + 834 = 1,537 Mt)
```

### Pilot Plant Performance (`PILOT_PLANT_PERFORMANCE`)
```
Nameplate: 2.0 kg/day MREC | Peak: 2.6 kg/day | MREC: 32.7% MREO, 1.0% DyTb
Recovery: Nd 70% | Pr 71% | Tb 61% | Dy 56% | Avg magnet: 70%
```

### Uranium/Thorium Safety (`U_TH_SAFETY`)
```
Primary mineral: Ionic adsorption clay (IAC) — REE adsorbed on halloysite/kaolinite
U/Th do not solubilize at pH 4.0 ammonium sulfate ion-exchange process
MREC safe for international transport | No radioactive tailings
```

### Project Timeline (`PROJECT_TIMELINE`)
```
LP Approved Dec 2025 → LI Application Q1 2026 → DFS Mid 2026 → FID H2 2026 → Construction 2027 → First Production 2028
```

### Market Prices (`MARKET_PRICES`)
```
NdPr Spot: $67/kg | NdPr Green: $135/kg (green premium)
DyTb Spot: $350/kg | DyTb Green: $680/kg
```

### Spring Count (`SPRING_COUNT`)
```
1092 — matches public-reference spring points in hydro-springs.geojson (FBDS/CAR geometry inside Caldeira boundary)
Exported constant from mockData.ts — used by EnvironmentPanel, HydroOverlay, FieldView KPIs; map status colors are modeled (not field-verified)
```

---

## Three Views

### 1. Field Operations View (`FieldView.tsx`) — License-to-Operate command center
**Layout:** Column → [flex row: MapLibre hero + bottom KPI strip | 300px right panel]

- **Hero:** `MapBase` (react-map-gl + MapLibre, MapTiler Dataviz Dark, pitch 0°, terrain DEM). Map title row uses `FieldMapChrome.module.css` + `MAP_STACKING.fieldTitle`. Passes `highlightWater={mapTab === 'environment'}` for Hydro Twin.
- **Map tabs (2):** **Operations** | **Hydro Twin** (`MapTab` in `field/constants.ts`). Deposit/licence **cards** (not map pickers) live under **ExecutiveView → Assets** (`GeologyPanel`, `LicensesPanel`).
- **Map overlays (tab-driven + `fieldMapLayers` / `DEFAULT_FIELD_OPS_LAYERS`):**
  - **Operations (defaults):** `CaldeiraBoundary` · optional `LicenceEnvelopeOverlay` · optional `DepositOverlay` · `LicenseOverlay` · `PfsEngineeringOverlay` · `AccessRoutesOverlay` · `DrillHoleOverlay` · `OpsPlantSitesOverlay` · optional `InfraOverlay` · optional `PlantOverlay` (schematic). **Terrain-aligned** layers on by default; **legacy** deposit / full infra / plant schematic off unless toggled in `OperationsPanel`.
  - **Hydro Twin:** `CaldeiraBoundary` + `EnvironmentalOverlay` (APA, buffer, monitoring, urban centroid, UDC — each gated by `envMapLayers`) + `HydroOverlay` — ~1,092 springs, piezometers; optional **Open-Meteo** precip via `useSiteWeather` when `VITE_WEATHER_ENABLED=1`.
- **Right panel:** `TabSwitcher` → **`FieldPinnedAssetCard`** (plant/hydro node pin) → **`FieldMapGeoInspector`** (GeoJSON click selection) → `OperationsPanel` or `EnvironmentPanel` (includes **`MonitoringNetworkCard`** + always-visible **Community & Stakeholder Notice** disclaimer card).
- **Bottom strip:** **`FieldBottomMetrics`** — five KPI tiles (operations vs hydro scenario metrics).
- **Interactivity:** `FieldView` owns hover/click; `interactiveLayerIds` + `pickFeatureByPriority` for licences, drills, PFS, plant sites, infra, routes, envelope, env polygons, springs/nodes. Parsers: `toLicenseDetail`, `toDrillHoleDetail`, `toPfsEngineeringDetail`, `parseEnvMapFeature`, `toAccessRouteDetail`, `toLicenceEnvelopeDetail`.
- **Registry:** `docs/data/caldeira/DATA_SOURCES.md` indexes datasets; `src/data/geojson/geoJsonSchema.test.ts` guards key schemas.
- **Language:** English only (PT-BR toggle was removed)

### 2. Buyer View (`BuyerView.tsx`) — TradeTech & Compliance-as-a-Service
**Layout:** Column → [top bar] + [flex row: MapLibre supply-chain hero | right panel (400px)]

- **Hero:** `MapBase` (buyerField, BUYER_VIEW_STATE zoom 7.5) showing Caldeira → Santos export route, origin deposit highlight. Map markers sync with blockchain timeline steps.
- **Right panel (400px, 2 tabs: Compliance | Traceability):**
  - **Compliance** — FEOC ring gauge (0.00%), IRA/EU DBP status chips, carbon intensity bar, trust controls, **U/Th radioactivity safety profile**, green premium, **defense-grade cybersecurity pillars** (SOC 2 Type II, Zero-Trust, Data Sovereignty), **competitive benchmarks** (Caldeira vs Lynas vs MP vs Chinese baseline)
  - **Traceability** — Batch selector dropdown + molecular-to-magnet blockchain timeline (`BlockchainTimeline` with click-to-highlight interactivity), upstream **Scope 3 reagent provenance** (Ammonium Sulfate FEOC tracking), digital passport issuance, API handoff layer
- **Timeline ↔ Map interactivity:** Clicking a timeline step highlights the corresponding map marker; clicking a map marker highlights the corresponding trace step.
- **Countdown strip** — DoD NDAA and EU DBP countdowns pinned below tabs

### 3. Executive View (`ExecutiveView.tsx`) — Board decision screen
**Layout:** Full-width tabbed dashboard (no map — focuses entirely on data and metrics)

- **Default tab:** Assets (on load)
- **9 tabs:** Assets | Financials | Risk | Pipeline | Capital | DFS | **Agencies** (permits / MPF–FEAM–IBAMA matrix, `getSpatialInsights` card, MPF thread, monitoring annex, exports) | Audit | ESG
  - **Assets** — Geology panel (resource classification, deposit cards) + Licenses panel (zone cards, LP-LI-LO timeline)
  - **Financials** — Spot/Consensus/Forecast scenario selector, Pre-Tax NPV₈/IRR/Revenue KPIs, NPV sensitivity table at 7 NdPr price points; **issuer snapshot** strip (`getIssuerSnapshot`) with ASX citation link pattern
  - **Risk** — Heat summary + top 10 project risks (L×I scoring, category, mitigation, owner, status)
  - **Pipeline** — Off-taker cards (Ucore binding, Neo LOI) with volume, pricing, status
  - **Capital** — Drawdown overview, funding sources (EXIM $350M, EFA A$70M), monthly spend-vs-budget, CPs checklist
  - **DFS** — Ausenco workstream progress bars + regulatory log (COPAM, SUPRAM, FEAM, MPF, INB/CNEN, IBAMA) + **Aether Platform Roadmap** (Phase 1/2/3 vertical stepper with milestones, costs, timelines)
  - **Audit** — Immutable event log with 15 seed events, filterable by type (including `system_event` and `offtake_update` filters), hash-verified entries
  - **ESG** — 5 frameworks (GRI 303/306, SASB EM-MM, TCFD, ISSB S2) with per-metric mapping, coverage % per framework (62–92%), status badges

---

## Global Layout (`App.tsx`)

```
ErrorBoundary
  └── DataServiceProvider   service = useMemo(() => createDataService(), [])
        └── MapProvider
              └── AppShell (div.AppShell.module.css — var(--w-bg), grid via --w-app-shell-grid)
                    ├── HeaderStrip
                    ├── DataModeBanner     — getDataContext() from injected service
                    ├── main (flex:1) → AnimatePresence → motion.div.viewLayer → active view
                    └── AlertPanel
```

`createDataService()` uses **`getDataMode()`** from `src/config/env.ts`: **`createMockDataService()`** or **`createLiveDataService()`**.

**State held in `AppShell`:**
- `view: ViewMode` — passed to `HeaderStrip` / `ViewSwitcher`
- `alertOpen: boolean` — alert drawer
- Telemetry via `DataServiceProvider` (`useTelemetry()` / `useAetherService()`)

### Data honesty (`getDataContext()`)

- [`AetherDataService`](src/services/dataService.ts) exposes **`getDataContext(): DataContext`** with `mode` (`mock` | `live`), `telemetry` (`simulated` until a real backend), **`presentationMode`** (from `VITE_PRESENTATION_MODE`), **`disclosureMode`** (from `VITE_DISCLOSURE_MODE`), `bannerLabel`, and `detail`.
- **`VITE_PRESENTATION_MODE=1`:** banner shifts to **stakeholder / mixed illustrative** wording for MPF–agency style demos while keeping the same data pipeline.
- **`VITE_DISCLOSURE_MODE=1`:** IR disclosure mode — hides simulated telemetry panels, suppresses alert count to 0, changes banner to **"Disclosure mode — board-approved facts only"** (violet theme), and adds a **DISCLOSURE** badge to HeaderStrip. Only board-approved data is surfaced: financial scenarios, resource classification, risk register, audit trail, ESG frameworks. Implemented via `getDisclosureMode()` in `src/config/env.ts`.
- **`getProvenanceProfile()`** returns per-area provenance kinds (`from_public_record`, `simulated`, etc.) for **`ProvenanceBadge`** on Field Hydro Twin and Executive surfaces; includes **`map_geometry`** (bundled GeoJSON — see `DATA_SOURCES.md`).
- **`getRegulatoryExportBundle()`** packs regulatory log + audit slice + permitting risks for **JSON download** (Executive → **Agencies** tab).
- **`VITE_DATA_MODE=live`:** `createLiveDataService()` is used; **`getDataContext()`** surfaces live mode (e.g. **“Live — backend not connected”**) all data flows through genuine network endpoints when the backend is running (`npm run dev:all`). Falls back to cached data (`degraded`) or shows offline state when the backend is unreachable. `DataModeBanner` displays amber (degraded) or red (offline) states. WebSocket reconnection uses exponential backoff (1s to 30s cap with jitter).
- **UI rule:** do not label simulated plant/env time series as “live” in user-facing copy. Map GeoJSON (springs, boundary, deposits) is bundled reference data — springs use public FBDS/CAR geometry where noted in `hydro-springs.geojson` metadata.

### Future: credential scopes (RBAC) — not implemented

When auth lands, prefer **one UI** with **scoped data** from `AetherDataService` implementations (not separate apps):

| Scope (proposed) | Typical access |
|------------------|----------------|
| `regulator.read` | Agency matrix, monitoring annex methodology, submitted doc IDs, public geometry — hide draft financials and unreleased lab data. |
| `issuer.internal` | Full register, risks, capital, simulated telemetry as today. |
| `community.public` | High-level monitoring narrative, grievance entry points — no competitive detail. |

Filter or redact in **service/DTO** layers; keep view components dumb.

### Narrative policy (investor / board rehearsal)

- **Geology & resource** (Executive **Assets** / GeologyPanel, Financials, resource figures): public disclosure / illustrative scenarios — **not** validated by environmental or hydrology views.
- **Environment & Hydro Twin:** compliance and hydrology narratives are **separate** from tonnage, grade, or reserve assurance.
- **ESG tab:** dashboard coverage is **not** a substitute for JORC or statutory reporting.
- **Traceability / blockchain UI:** demonstration ledger — production ERP/CBP integration is out of scope until pilot.

### Styling contract (UI scalability & future themes)

- **Authoritative doc:** [`docs/STYLING.md`](docs/STYLING.md) — when to use **`W`** vs **`var(--w-*)`**, chrome/hairline tokens, radii, shared primitives (`SectionLabel`, `MutedCaption`, `HairlineDivider`), performance notes, and a **future `data-theme`** approach for light/dark without rewriting the app.
- **Copy iteration:** [`docs/copy/WEBSITE_COPY.md`](docs/copy/WEBSITE_COPY.md) and [`docs/copy/PITCH_DECK_COPY.md`](docs/copy/PITCH_DECK_COPY.md) — update narrative here first, then mirror into README/UI strings.
- **`W`** in [`src/app/canvas/canvasTheme.ts`](src/app/canvas/canvasTheme.ts) and **`:root`** in [`src/styles/theme.css`](src/styles/theme.css) should stay in sync for new tokens.

---

## Key Components Detail

### `MapBase` (`src/components/map/MapBase.tsx`)
- **Wraps:** `react-map-gl` v8 with MapLibre GL JS adapter
- **Map id:** `"aetherField"` — overlay components access it via `useMap().aetherField`
- **Style:** MapTiler Dataviz Dark (`VITE_MAPTILER_KEY`) or CARTO Dark fallback (no key)
- **Terrain:** MapTiler terrain-rgb-v2 DEM, exaggeration 1.4x (applied on `map.load`)
- **Controls:** `NavigationControl` (zoom+compass), dark-themed via `index.css` overrides
- **Interaction props:** `interactiveLayerIds`, `cursor`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onClick` — all passed through to `<Map>`. This is the single entry point for all map node interaction; overlay components never bind imperative events
- **Initial field view:** `FIELD_VIEW_STATE` — `longitude: -46.52, latitude: -21.91, zoom: 10.98, pitch: 0, bearing: 0` (framing adjusted so the Caldeira boundary is less clipped)
- **`highlightWater` prop:** When `true`, the internal `StyleController` recolours base-map water features (fills, lines, labels) to `rgb(0, 212, 200)` and makes all waterways visible at every zoom level. Controlled by `FieldView` (`mapTab === 'environment'`). Original paint/layout properties are captured on first highlight and restored when the prop goes `false`.
- **`StyleController`:** Internal component (replaces former `TerrainLoader`). Handles terrain loading (if MapTiler key is valid) and water feature highlighting (unconditionally). Targets CARTO dark-matter layer IDs: `water`, `water_shadow`, `waterway`, `waterway_label`, `watername_lake`, `watername_lake_line`. Uses zoom-interpolated `line-width` for waterways (0.5px at zoom 6 → 2.5px at zoom 16).

### `PlantOverlay` (`src/components/map/PlantOverlay.tsx`)
- **Props:** `{ plant, env, hoveredNodeId, selectedNodeId }` — pure rendering, no interaction logic
- **Geometry source:** `src/data/geojson/plant-nodes.geojson` + `plant-edges.geojson`
- **Render path:** native MapLibre `Source` / `Layer` stack (no SVG projection math)
- **Styling:** telemetry maps each node to a live `status`, `metric`, `fillColor`, and `statusColor`; linework is split into process / monitor / risk variants
- **Exports:** `PLANT_NODE_LAYER_ID`, `toPlantNodeDetail()` — used by FieldView to wire interaction
- **Interaction:** none — hover/click state is driven by FieldView → MapBase via react-map-gl's `interactiveLayerIds`

### `HydroOverlay` (`src/components/map/HydroOverlay.tsx`)
- **Props:** `{ env, hoveredNodeId, selectedNodeId, weatherStrip? }` — pure rendering, no interaction logic; HUD chrome via `HydroOverlay.module.css` + `MAP_STACKING`
- **Geometry source:** `src/data/geojson/hydro-nodes.geojson`, `hydro-springs.geojson` (~1,092 public-reference points). Rivers come from base-map vector tiles (highlighted by `StyleController`).
- **Render path:** native MapLibre `Source` / `Layer` stack for springs (many clickable points), monitoring nodes, and the UDC zone
- **Styling:** piezometer colors and labels come from `env.aquifer.sensors`; UDC zone size/intensity derives from `radiation_usv_h`; spring **locations** are public FBDS/CAR-derived geometry; **Active/Reduced/Suppressed** colors are **modeled** from mock telemetry; warning/critical nodes get a pulsing outer glow via CSS `warn-pulse-glow` animation
- **Exports:** layer IDs and mappers are defined in **`hydroDetailMappers.ts`** / **`hydroLayerIds.ts`** and re-exported from this module for a stable import path
- **Interaction:** Springs and hydro nodes are both interactive — hover/click state is driven by FieldView → MapBase via react-map-gl's `interactiveLayerIds`. Clicking a spring shows detailed info (ISE array, coordinates, status history) in the Active Asset panel.

### Legacy maps (all deleted)
- **`CaldeiraSiteMap.tsx`**, **`HydroTwinMap.tsx`**, **`DigitalTwinMap.tsx`** — removed in cleanup session
- **`OperatorView.tsx`** / **`RegulatorView.tsx`** — deleted earlier; replaced by `FieldView.tsx`

### `GlassCard`
- Base style: `background: rgba(255,255,255,0.035)`, `backdropFilter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, `borderRadius: 14`
- Glow variants apply `box-shadow` with matching color
- `animate={false}` skips motion.div (use for map containers to avoid re-render)

---

## Simulation System

### `mockGenerator.ts`
```typescript
drift(value, variance, min, max)         // bounded random walk
generatePlantTelemetry(prev, scale=1)    // realistic plant drift (scale controls variance)
generateEnvTelemetry(prev, scale=1)      // realistic env drift (scale controls variance)
calculateEsgScore(plant, env)            // weighted composite 0-100
detectAlerts(plant, env, existing)       // threshold breach alerts
```
Scale parameter: `1×` for 24h (live), `2.5×` for 7d synthetic, `5×` for 30d synthetic — creates visually distinct variance patterns for each time range.

### Playback Mode (removed)
- Playback toggle and `PlaybackScrubber` were removed from the UI. Batch history is tracked via the Traceability tab in BuyerView.

---

## Compliance Domain Knowledge

| Standard | Requirement | Aether OS field |
|---|---|---|
| US DoD NDAA 2027 | 0% Chinese-origin REE in defense supply | `feoc_percentage === 0.00` |
| IRA Rule-of-Origin | Exclude FEOC entities | `ira_compliant: boolean` |
| EU Battery Reg 2023/1542 | Digital Battery Passport, batch carbon intensity | `eu_dbp_ready`, `carbon_intensity` |
| FEAM (MG) | Aquifer depth monitoring, water quality | `aquifer.sensors`, `water_quality` |
| INB/CNEN | UDC radiation monitoring | `legacy_infrastructure.radiation_usv_h` |

---

## Known Issues / Tech Debt

- **MapTiler API key required** — without a key in `.env`, the map falls back to CARTO Dark Matter (no terrain, but still functional). Water feature highlighting works with both styles. Get a free key at [maptiler.com](https://maptiler.com).
- **Tile loading behind sandbox** — dev tiles require full network access. The map works normally outside the Cursor sandbox (normal `npm run dev`).
- GeoJSON assets may be refined for production. Springs in `hydro-springs.geojson` use public FBDS/CAR reference points filtered to the Caldeira boundary (not a substitute for site-specific survey without field verification).
- Chunk size warning in build — bundle ~800KB+ (maplibre-gl adds ~200KB). Use `React.lazy()` + code splitting before production.
- Operations map uses a **terrain-aligned master** GeoJSON set (`ops_reality_*` in `DATA_SOURCES.md`); features are **non-survey** until ANM/IEF vectors replace schematic rectangles. Older “~500m” guidance still applies to any legacy schematic nodes not tied to that master.
- GeoJSON files are fetched as static assets at runtime. If these overlays ever need offline packaging or tenant-specific geometry, move them behind a proper data loader / API.

---

## Open / Future Features

| Feature | Priority | Notes |
|---|---|---|
| ~~Real backend / WebSocket feed~~ | ~~High~~ | ✅ Done — Fastify server + WebSocket broadcast + engine tick loop |
| ~~LiveDataService (full)~~ | ~~High~~ | ✅ Done — `LiveDataService` uses `fetch()` + `WebSocket` against real endpoints |
| Multi-tenancy / auth | High | Add Clerk or Supabase Auth before client handoff |
| MapTiler custom style | Medium | Build a bespoke Aether style in MapTiler Studio matching exactly W.canvas palette |
| Satellite toggle | Medium | Add map style switcher (dark vector ↔ satellite+labels) in map header |
| PDF export polish | Medium | Currently `window.print()`; replace with `jsPDF` or Puppeteer |
| Localization (i18n) | Low | EN/PT toggle was deliberately removed; re-add via a proper i18n library if needed |
| Mobile layout | Low | Currently optimized for 1440px+; 16:9 pitch screens |
| Expand test coverage | Low | 151 tests (129 frontend + 22 server). Run `npm run test:run` (frontend) and `cd server && npm test` (server). Add heavier RTL coverage for map shells when stable. |
| Overlay throttle optimization | Low | Throttle `tick` updates with `requestAnimationFrame` for smoother panning |
| ~~IR Disclosure Mode~~ | ~~Done~~ | ✅ `VITE_DISCLOSURE_MODE=1` — hides simulated panels, violet banner, DISCLOSURE badge in header |
| ~~Community disclaimer card~~ | ~~Done~~ | ✅ Always-visible in EnvironmentPanel — explains modeled spring status + data provenance |
| ~~JORC reference badges~~ | ~~Done~~ | ✅ ASX citation badges in GeologyPanel linking to issuer snapshot URL |
| ~~Platform roadmap~~ | ~~Done~~ | ✅ Phase 1/2/3 stepper in DFS tab with milestones, costs, timelines |
| ~~Audit trail viewer~~ | ~~Done~~ | ✅ ExecutiveView Audit tab — 15 seed events, filterable (incl. system_event, offtake_update), hash-verified |
| ~~ESG framework alignment~~ | ~~Done~~ | ✅ ExecutiveView ESG tab — GRI 303/306, SASB EM-MM, TCFD, ISSB S2 |
| ~~Financial scenario modeling~~ | ~~Done~~ | ✅ ExecutiveView Financials — Spot/Consensus/Forecast toggle, NPV sensitivity table |
| ~~Risk register~~ | ~~Done~~ | ✅ ExecutiveView Risk tab — top 10 risks, L×I scoring |
| ~~Water feature highlighting~~ | ~~Done~~ | ✅ StyleController highlights base-map water to `rgb(0,212,200)` on Hydro Twin tab |
| ~~Public-reference springs~~ | ~~Done~~ | ✅ ~1,092 FBDS/CAR points in `hydro-springs.geojson`; modeled status overlay; honesty strip + copy |
| ~~Time range selector~~ | ~~Done~~ | ✅ 24h/7d/30d with distinct synthetic variance patterns |

---

## Chat History Reference

| Chat | Summary |
|---|---|
| [Aether OS V1 Build](9219c628-d567-478d-ad0b-a34fb10726d9) | Full Phase 1–7 build: project scaffold, design system, all 4 views, ESG score, alert system, playback mode, PDF export, blockchain timeline, green premium card |
| [SVG Maps + UI Polish](f2e5e3b2-0000-0000-0000-000000000000) | Operator view redesigned as Control Panel with CaldeiraSiteMap (geo SVG, hex nodes, animated flow, zoom/pan). Regulator view redesigned with HydroTwinMap (same geo, hydrology features). UI/UX review pass: map centering, legend compacted, scan lines removed, executive title clipping fixed, full-height layouts across all views. |
| [MapLibre Merge + Cleanup](07a2c9a7-3a9a-4ffb-bdb0-f5fb945a03c6) | Merged Operator + Regulator into single `FieldView` powered by MapLibre GL JS (react-map-gl v8). `PlantOverlay` and `HydroOverlay` SVG components project lat/lng to screen via `useMap().project()`, recomputed on map move events via `tick` state. Two right-panel tabs (Control Panel / Environment) switch both the active overlay and panel data. Fixed SVG rendering bug: removed `viewBox`/`preserveAspectRatio` so SVG coordinate space matches CSS pixels directly. Removed PT/EN language toggle and all related state/LABELS from `FieldView`. Deleted `OperatorView.tsx` and `RegulatorView.tsx`. ViewSwitcher reduced to 3 tabs. `ViewMode` 'regulator' removed from types. MapTiler Dataviz Dark style + terrain DEM. Dark-themed `NavigationControl` via CSS overrides. |
| Map Interaction Fix + Cleanup | Removed redundant HTML hit-target button system from both overlays. Deleted 4 dead files: `CaldeiraSiteMap.tsx`, `HydroTwinMap.tsx`, `DigitalTwinMap.tsx`, `flowVisual.ts`. Fixed `PlaybackScrubber` to accept actual batch timeline step labels. |
| Interaction Architecture Refactor | **Redesigned map interaction from scratch using react-map-gl's official `interactiveLayerIds` API.** Previous approach (imperative `map.on()` inside overlays, `motion.div` wrappers, projected HTML hit-targets) was structurally broken by DOM layering. New architecture: `MapBase` accepts `interactiveLayerIds`, `cursor`, and event callbacks (`onMouseEnter`/`onMouseLeave`/`onClick`), passing them directly to `<Map>`. `FieldView` lifts all interaction state (`hoveredNodeId`, `selectedPlantNode`, `selectedHydroNode`) and wires callbacks to `MapBase`. `PlantOverlay` and `HydroOverlay` are now pure rendering components — they accept `hoveredNodeId`/`selectedNodeId` as props and render layers + tooltip, with zero event-binding code. Removed `AnimatePresence`/`motion.div` wrappers from the map overlay area (they were invisible for canvas layers and caused the event-blocking). Exports: each overlay exports its layer ID constant and a `toNodeDetail()` helper. Build passes, 0 TS/lint errors. |
| Navbar consolidation + phrase cleanup | Removed "Caldeira is not geology-constrained. It is trust-constrained." from ExecutiveView heading, mockData, HeaderStrip pill, and BuyerView description. Removed duplicate batch selector from BuyerView (canonical selector stays in HeaderStrip). Merged ViewSwitcher into HeaderStrip — entire nav now resolves in a single 56px row: logo | ViewSwitcher tabs | sim toggle + batch + ESG + alerts. Removed standalone view-switcher-bar div from App.tsx. |
| Geographic Data Integration | Added 5 new GeoJSON files: caldeira-deposits (5 deposit polygons with grade/tonnage/status from PFS), caldeira-licenses (3 licence group polygons: Southern LP approved Dec 2025, Acquired South 49 km², Northern 80 km²), caldeira-drillholes (~32 collar points with TREO/MREO/depth from published ASX announcements — including AGOAC0107 @ 19,183 ppm), caldeira-infrastructure (pilot plant, office, CEMIG, access roads, Santos port + full export route), caldeira-environmental (APA Pedra Branca + 3 km buffer zone + water monitoring zone). Added PolygonGeometry to geojson.ts. Extended MapBase with id and initialViewState props; exported FIELD/BUYER/EXEC_VIEW_STATE constants. Built 4 new overlay components: DepositOverlay (grade fill + status outline + resource labels + hover glow), LicenseOverlay (status fill + status outline + labels), DrillHoleOverlay (TREO colour ramp + depth-radius circles + hole labels at zoom 13+), InfraOverlay (pilot plant pulse, roads, supply route). Added DEPOSIT_DATA array to mockData.ts. FieldView expanded to 4 tabs (Operations / Geology / Licenses / Environment): Geology shows DepositOverlay + DrillHoleOverlay + click-to-select deposit resource cards; Licenses shows LicenseOverlay + click-to-select zone cards; Operations and Environment unchanged. BuyerView gains 220px supply-chain map hero (origin deposit highlighted + full Santos route) above TradeTech content. ExecutiveView headline replaced with split layout — left 58% MapLibre execField showing all deposits + licences + infra, right 42% headline text + ESG ring + status chips. 0 TypeScript errors. |
| Map fixes + Hydro Twin restore | Fixed three regressions from the geographic integration session. (1) **Black page on TradeTech/Board Options**: root cause was `react-map-gl` v8 requiring a `<MapProvider>` wrapper when multiple `<Map>` instances exist across views — added `MapProvider` import and wrap in `App.tsx`. (2) **ReferenceError: aetherField is not defined at TerrainLoader line 86**: the `useEffect` dependency array was not updated when TerrainLoader was refactored to use `mapRef` — changed `[aetherField, maptilerKey]` to `[mapRef, maptilerKey]`. (3) **Map perspective removed**: set `pitch: 0, bearing: 0` on `FIELD_VIEW_STATE` and `EXEC_VIEW_STATE` in MapBase.tsx for flat top-down view across all instances. (4) **Hydro Digital Twin label restored**: renamed the 4th FieldView tab from "Environment" to "Hydro Twin" and updated header overlay text to "Hydro Digital Twin → cumulative aquifer + spring model → LI defense"; also updated the active-asset hint for that tab. 0 TypeScript errors. |
| [Code Review & Refactor](81706a0d-0810-4587-974a-595f48aa5f1a) | Comprehensive code review and refactoring session. **UI fix**: widened FieldView right panel from 244px to 300px and compacted tab button styling to fix Hydro Digital Twin button overflow. **Design system**: replaced all hardcoded hex colors with `W` design tokens across 16+ components (StatusChip, MetricDisplay, GlowingIcon, CountdownTimer, EsgScoreRing, GreenPremiumCard, BlockchainTimeline, GaugeChart, BarComparison, AlertPanel, HeaderStrip, ViewSwitcher, BuyerView, ExecutiveView). **Component splitting**: decomposed monolithic FieldView.tsx (1024 lines) into 4 tab-specific sub-components (`OperationsPanel`, `GeologyPanel`, `LicensesPanel`, `EnvironmentPanel`) in `src/views/field/` with shared `constants.ts`. **Performance**: added `React.memo` to pure components, `useMemo` for derived data, `useCallback` for event handlers. **Cleanup**: deleted unused files (App.css, index.css, useViewModeTransition.ts, vite.svg, react.svg). **Testing**: added Vitest + @testing-library/react + happy-dom infrastructure; wrote 65 tests across 9 files covering mockGenerator, canvasTheme tokens, GlassCard, StatusChip, MetricDisplay, CountdownTimer, GlowingIcon, EsgScoreRing, and useSimulatedTelemetry hook. 0 TypeScript errors. |
| [Pitch-Ready Refactor](067aced3-574f-4d8a-b68d-58157bf70f92) | Comprehensive pitch-readiness refactor implementing 14-task plan. **Phase 1 — Geolocation Enrichment:** Added Cupim Vermelho Norte (2,600×5,000m, 340 Mt) and Dona Maria 1&2 (500×4,800m, 226 Mt) deposit polygons to GeoJSON + DEPOSIT_DATA. Added 5 exploration drill results outside resource boundary (CVSDD001 8,912 ppm, BDPDD001 3,939 ppm, CRDD001/002, CDMDD003). Created EnvironmentalOverlay.tsx wiring orphaned caldeira-environmental.geojson (APA Pedra Branca + 3km buffer + water monitoring zone) into Hydro Twin and Executive views. Created NeighborOverlay.tsx + caldeira-neighbors.geojson for Axel REE Caldas Project (232 km²) district-scale context in Geology tab. **Phase 2 — Data Accuracy:** Updated PROJECT_FINANCIALS with pre-tax/post-tax NPV/IRR ranges (pre-tax $821M–$1,985M, post-tax $488M–$1,256M, IRR 21–39%), mine life 20yr, throughput 6.0 Mtpa, LOM TREO 271,687t, EXIM $350M + EFA A$70M funding. Updated Soberbo from 68 Mt to 229 Mt @ 2,601 ppm. Fixed BuyerView BATCH_DEPOSIT_MAP keys to match actual BATCHES IDs. Added PILOT_PLANT_PERFORMANCE (Nd 70%/Pr 71%/Tb 61%/Dy 56%, 2.0 kg/day nameplate, 32.7% MREO), U_TH_SAFETY (bastnaesite, no U/Th at pH 4.0), PROJECT_TIMELINE (LP Dec 2025 → First Production 2028), RESOURCE_CLASSIFICATION (1.5 Bt global, 666 Mt M&I, 37 Mt Measured, 7 deposits). **Phase 3 — View Enhancements:** GeologyPanel enriched with BarComparison resource waterfall + exploration highlights section. OperationsPanel gets pilot vs ANSTO recovery BarComparison. ExecutiveView Financials tab expanded with funding & milestones timeline, resource classification waterfall, pre/post-tax NPV/IRR ranges. ExecutiveView Readiness tab gets GaugeChart trio (Funding 94%, DFS Progress, LP Status). BuyerView Compliance tab gets U/Th radioactivity safety card. BuyerView Supply Chain tab gets Strategic Backing section (EXIM + EFA funding). **Phase 4:** 0 TypeScript errors, 65 tests pass, HANDOFF.md updated. |
| View Consistency Refactor | Redesigned BuyerView (TradeTech) and ExecutiveView (Board Options) to match FieldView's layout pattern: map-left + tabbed right panel + bottom KPI strip. **BuyerView**: supply-chain MapLibre hero (zoom 7.5, origin highlight + Santos route) fills the left side; 400px right panel with 3 tabs (Compliance, Supply Chain, Batch Ledger); countdown strip (DoD NDAA + EU DBP) pinned below tabs; 5-tile bottom KPI strip (FEOC/IRA/carbon/premium/batch). **ExecutiveView**: overview MapLibre hero (zoom 10.8, deposits + licences + infra) fills the left side; 400px right panel with 3 tabs (Financials, Readiness, Strategy); headline card with gradient title pinned below tabs; 5-tile bottom KPI strip (NPV/IRR/CAPEX/ESG/payback). **App.tsx**: all three view wrappers now use `overflow: 'hidden'` (scrolling is isolated to right panel content area). All views now share the same visual pattern: top bar → flex-row (map hero + bottom strip | tabbed right panel). 0 TypeScript errors, 65 tests pass. |
| Top Nav Consolidation | Refactored global layout by streamlining the top bars. Changed app name to "Aether Dashboard" and updated icon gradient to a solid violet styleguide color. Removed the global batch selector and playback toggle as batch history is already tracked within the Traceability tab and telemetry playback was no longer needed. Removed the secondary top bar component across all three views (FieldView, BuyerView, ExecutiveView) to fit the page structure more cleanly. Relocated "Export PDF" button to the BuyerView's right panel tab switcher area. |
| Pitch Removal & Layout Refactor | Cleaned up all views to present a purely professional operations and metrics dashboard. **HeaderStrip & ViewSwitcher:** Removed all subheadings/sublabels from tabs and the app title. Updated tab titles to better reflect actual content ("Field Operations", "Compliance & Traceability", "Executive Overview"). **ExecutiveView:** Completely removed the Map component to focus on displaying the relevant information in the tabs. Refactored into a full-width 2-column dashboard layout displaying Assets, Permits, and Financials. Removed "pitch-related" cards including "The Trap", "Partnership Options", "Clock Is Ticking", "Solution Fit", and "Security & Sovereignty Brief". **BuyerView & FieldView:** Removed pitch-oriented cards such as "Strategic Backing", "Export Narrative", and "Board Narrative". **Interactivity Enhancement:** Added click-to-expand details in `GeologyPanel` (Deposits list) and `LicensesPanel` (Zones list) using `AnimatePresence` to reveal deeper context (depth, area, structural/resource notes) dynamically without navigating away. |
| [Interactivity & Content Enrichment](02e165f9-09f6-4d35-8d0e-e3a7175832ef) | Enhanced pinned detail cards with hardware specs, batch selector in BuyerView, timeline-map click interactivity, hardware sensor architecture card, predictive modeling detail, defense-grade cybersecurity pillars, Scope 3 reagent tracking. |
| Board-Ready Architecture Upgrade | Data Service Layer (`AetherDataService` interface + `MockDataService` + `DataServiceProvider` context). Financial Scenario Modeling (Spot/Consensus/Forecast). Risk Register (top 10, L×I scoring). TimeRangeSelector (24h/7d/30d). Incident Log lifecycle. Benchmarks (Caldeira vs Lynas vs MP). Off-taker Pipeline (Ucore + Neo). Capital Tracker. DFS & Regulatory (Ausenco + COPAM/SUPRAM/FEAM/MPF). Audit Trail (15 events, hash-verified). ESG Framework Alignment (GRI/SASB/TCFD/ISSB). ExecutiveView expanded to 8 tabs. |
| CTO Click-Through Audit | PFS data alignment (NdPr prices $67/$86/$135, NPV, IRR, OPEX $22/kg). Realistic 66-char SHA-256 hashes. Time range selector fix (distinct 7d/30d variance patterns). Warning pulse glow on map nodes. UI fixes: hash overflow, dot alignment, card reordering, default Assets tab. |
| Water Feature Highlighting | `StyleController` replaces `TerrainLoader`+`WaterFeatureHighlight`. Base-map water features (CARTO dark-matter layers) highlighted to `rgb(0,212,200)` on Hydro Twin tab. Zoom-interpolated waterway line-width. Robust property capture/restore via `useRef<Map>`. |
| 98 Interactive Springs | Generated 98 spring points spread inside Caldeira boundary polygon. Springs clickable (`HYDRO_SPRING_LAYER_ID` + `toSpringDetail`). `SPRING_COUNT` constant extracted to `mockData.ts`. |
| CTO roadmap & trust pass (2026-04) | App shell (`AppShell.module.css`), `getDataMode` + `createLiveDataService`, `env.ts` / `liveTelemetry.ts`, Field splits (`FieldBottomMetrics`, `FieldPinnedAssetCard`, `MonitoringNetworkCard`), hydro mappers + `MAP_STACKING`, Open-Meteo + `useSiteWeather`, expanded Vitest coverage, `.github/workflows/ci.yml`, **FieldView = two map tabs** (Operations \| Hydro Twin), field `FIELD_VIEW_STATE.zoom` **10.98**. |
| [Pre-Pitch Sprint](9671ef66-ee46-4dfd-8484-ad20c71491bc) | **12-task pre-pitch sprint.** Data integrity: fixed 10 inconsistencies (resource 1.537 Bt sum, IAC mineralogy, deposit notes, FCF/FEOC data-driven, funded_m alignment, spring count in ESG). Refactors: audit filter chips, keyboard a11y on expandable cards, NeighborOverlay wired, CSS token sync, DFS regulatory log differentiation, MapLibre `readonly` tuple build fixes. New features: IR disclosure mode (`VITE_DISCLOSURE_MODE`), community disclaimer card, ASX citation badges, platform roadmap stepper. Demo polish: branded loading skeleton, BuyerView empty state + hooks order fix. Quality gate: 0 lint errors, 131 tests, clean production build. |
| [Synthetic Data Bridge](c7b1afd8-1a6a-4e0e-a1f3-0ffec8cc219a) | **Production elevation: 3-process architecture.** Scaffolded `server/` (Fastify 5.8 + SQLite + WebSocket), `engine/` (simulation bot + 4 external API enrichers: Open-Meteo, BCB PTAX, USGS Seismic, Alpha Vantage). Rewrote `liveDataService.ts` to use real `fetch()` + `WebSocket`. 40+ REST endpoints seeded from mockData. LAPOC ingestion contract (`LapocTelemetryPayload`). Docker Compose (3 services). `npm run dev:all`. Vite proxy. Dynamic provenance. Persona re-evaluation: weighted avg 6.8 → 7.3. **Live App Deployment:** 5 code fixes (DB_PATH, WS URL, CORS, ingest guard, backoff), 22 server tests, engine API key, frontend resilience (connectionStatus), CI update. |

---

## Persona-Driven Quality Feedback Loop (2026-04-08)

Nine stakeholder personas have been evaluated against the current release (see `docs/Personas.md`). **Weighted average score: 7.3 / 10** (up from 6.8 after the Synthetic Data Bridge). The top gaps that should drive the next iteration:

| Priority | Action | Personas driving it | Effort | Status |
|----------|--------|---------------------|--------|--------|
| 1 | ~~**Implement IR disclosure mode**~~ | Chairman, CEO, all external | Medium | ✅ Done — `VITE_DISCLOSURE_MODE=1` |
| 2 | ~~**Community disclaimer card**~~ on Hydro Twin tab | NGO, community, Chief Geologist | Low | ✅ Done — always-visible in EnvironmentPanel |
| 3 | **DPP field-mapping table** in Compliance tab — which Aether fields map to CEN/CENELEC mandatory passport fields | EU regulator, buyer | Medium | Pending |
| 4 | ~~**Roadmap with milestones and costs**~~ | CEO, PF analyst, investor | Low (copy) | ✅ Done — Phase 1/2/3 in DFS tab |
| 5 | ~~**JORC reference badges**~~ | Chief Geologist, journalist | Low | ✅ Done — ASX citation in GeologyPanel |
| 6 | **Source TAM/SAM/SOM** — add methodology footnote or analyst report citation | Journalist, investor | Low (copy) | Pending |
| 7 | **Portuguese community context card** for Brazil-facing deployments | NGO, Brazil stakeholders | Medium | Pending |
| 8 | **OpenAPI / OPC-UA ingestion spec** — document data ingestion contract for integrator scoping | SCADA integrator | Medium | Pending |

### How to use the persona evaluations

- Before any demo, read the **Cross-persona demo checklist** in `docs/Personas.md`.
- After each major release, update the **Persona Evaluations** section with fresh scores.
- Use the **Priority actions** list as a backlog input — sort by audience for the next pitch.

---

## The Founder

**Carlos Toledo** — born and raised in Pocos de Caldas, inside the Caldeira. Brazilian Air Force Academy pilot (18-22), full-stack developer, Bachelor's in Product Design, extreme self-learner. 40 years of local geology, community, and political context. Builds the entire product solo. See `docs/Personas.md` Part 0 for the full profile.

**Why this matters for context:** Carlos is not an outside consultant. He has Pocos-scale literacy that is not in any dataset — community dynamics, water politics, local geological knowledge accumulated over a lifetime. When he says "I know the place," it is not a figure of speech. Advisors should leverage this local knowledge as competitive moat and prompt Carlos to surface it when relevant to stakeholder conversations.

---

## Team (ready to deploy at pilot activation)

| Member | Role | Strategic value |
|--------|------|----------------|
| **Carlos Toledo** | Founder, Product & Technical Lead | Pocos native, Air Force pilot, full-stack dev, Product Design. Builds the product. |
| **Dr. Heber Caponi** | Chief Scientific Advisor (LAPOC) | Decades of active Caldeira field research. **Most strategic member** — converts "simulated" into "field-verified." LAPOC instruments are the first live data channel. |
| **Thiago A.** | CEO (designated) | Brazilian/international law, enterprise ops, dev team management. Business, legal, and commercial execution. |
| **Full-Stack Developer** | Engineering (designated) | Ready at pilot. Codebase architected for immediate second-developer productivity. |

**Why Dr. Caponi is the most strategic:** Every persona gap in the aggregate scorecard (6.8/10 weighted avg) improves when LAPOC field data flows through `AetherDataService`. He is the person who turns disclaimer labels into instrument-backed labels. See `docs/Personas.md` Part 0 for the full team analysis.

---

## Internal Advisor Personas

Three persona roles are defined in `docs/Personas.md`. They are invoked by the user during conversations to get role-specific guidance:

| Persona | Where | Purpose |
|---------|-------|---------|
| **Carlos (Founder)** | Part 0 | The founder profile — background, strengths, how advisors should interact. Always-on context for all conversations. |
| **Business Expert** | Part 1 — invoke with "Act as the Business Expert" | Strategic business counsel: GTM, stakeholder management, positioning, pricing, partnerships, investor relations, competitive dynamics. |
| **CTO / Product Leader** | Part 1 — invoke with "Act as the CTO" | Technical product leadership: planning, execution, quality gates, architecture decisions. Translates complex needs into clean UI and code. |

### Rules for advisor personas

1. **Read `docs/Personas.md` Part 1 fully** before adopting either role. The persona defines communication style, decision frameworks, and signature questions.
2. **Stay in character** for the duration of the request. Don't break role to offer generic assistant commentary.
3. **The Business Expert** always answers with: Recommendation, Why, Risk, Alternative, Next action.
4. **The CTO** always follows: Plan before coding, quality checklist after every change, HANDOFF update at session end.
5. **They can be combined** ("Business Expert + CTO, evaluate this approach") — in that case, clearly label which lens each piece of advice comes from.
6. **Reference external personas by name** when relevant. "Gale would want..." or "This would concern the NGO persona because..."

---

## Context Continuity Protocol

> **For AI assistants picking up this project in a new chat window.**

### Files to read first (in order)

1. **`HANDOFF.md`** (this file) — full project state, architecture, data, views, known issues.
2. **`docs/Personas.md`** — **Part 0:** founder profile (Carlos). **Part 1:** internal advisor personas (Business Expert + CTO). **Part 2:** external stakeholder profiles + evaluations + priority gaps.
3. **`docs/copy/PITCH_DECK_COPY.md`** — narrative strategy, honesty framing, stakeholder grid.
4. **`docs/copy/WEBSITE_COPY.md`** — messaging principles, feature list, CTAs.
5. **`docs/STYLING.md`** — design token contract (W vs CSS vars).
6. **`docs/data/caldeira/DATA_SOURCES.md`** — GeoJSON registry and citation methodology.

### Key architectural decisions to preserve

- **Data honesty banner** — never remove or weaken. The demo/mock/live distinction is governance infrastructure.
- **Geology / hydro firewall** — Assets tab and Hydro Twin must never share panels or imply cross-validation.
- **AetherDataService interface** — all data flows through this contract. Never bypass with direct imports from mockData.
- **Design tokens** — all colors must use `W.*` tokens (TS) or `var(--w-*)` (CSS). No raw hex values.
- **CSS Modules** — layout styles live in `.module.css` files, not inline. Inline styles only for truly dynamic values.
- **Accessibility** — `type="button"` on all buttons, ARIA roles on interactive elements, reduced-motion support.
- **Test coverage** — 151 tests (129 frontend + 22 server) across 23 files (all passing). Never reduce. Add tests for new logic.
- **Advisor personas** — when the user says "act as the Business Expert" or "act as the CTO," read and adopt the full persona from `docs/Personas.md` Part 1 before responding.

### Session handoff checklist

When ending a session, update this file with:
1. What was completed (features, fixes, refactors).
2. What is in progress (partially done work).
3. What should be done next (priority order).
4. Any decisions made that aren't obvious from the code.

---

## Session Log — 2026-04-08 (Persona & Strategy Session)

**What was completed this session:**

1. **9 external persona evaluations** — each Meteoric leadership member and 6 broader stakeholders evaluated the current release in-voice with sentiment, reactions, value, changes, rank/10, and insights. Weighted average: **6.8/10**. Added to `docs/Personas.md` Part 2.

2. **8 priority actions synthesized** from persona gaps — ranked by governance ROI and stakeholder impact. Added to `docs/Personas.md` and mirrored in HANDOFF.

3. **Internal advisor personas created** — Business Expert (strategic advisor) and CTO/Product Leader (technical executor) with communication styles, decision frameworks, signature questions, and collaboration protocol. Added to `docs/Personas.md` Part 1.

4. **Founder profile written** — Carlos Toledo: Pocos native (40 years), Air Force pilot, full-stack dev, Product Design degree. Includes "How the advisors should treat me" guidelines. Added to `docs/Personas.md` Part 0.

5. **Team profiles added** — Dr. Heber Caponi (LAPOC, Chief Scientific Advisor), Thiago A. (CEO), Full-Stack Developer. Detailed analysis of Dr. Caponi's strategic impact on every persona gap. Added to `docs/Personas.md` Part 0.

6. **Pitch deck updated** — Slide 8.75 evolved from "Founder" to "Team" with all four members. Traction slide updated to 131 tests. TAM/SAM/SOM methodology note added. New Appendix E with persona scorecard.

7. **Website copy updated** — "Built by" section expanded to include team. Persona feedback table added. Iteration checklist expanded.

8. **HANDOFF.md expanded** — Founder section, team section, persona feedback loop, context continuity protocol, advisor persona rules, session handoff checklist.

9. **Business Expert strategic evaluation delivered** — assessed codebase quality as top 5-10% of AI-assisted projects, cataloged 13 distinct skills deployed, and identified the founder's profile as primary competitive moat.

---

## Session Log — 2026-04-08 (Pre-Pitch Sprint Execution)

**What was completed this session (12 tasks from the Pre-Pitch Sprint Plan):**

### Data Integrity (10 fixes)
1. **Resource sum corrected** — `RESOURCE_CLASSIFICATION.global_bt` updated from `1.5` to `1.537` (37 + 666 + 834 = 1,537 Mt). Synced across `mockData.ts` and `issuerSnapshot.ts`.
2. **Deposit resource notes clarified** — Capão do Mel and Barra do Pacu notes now distinguish total tonnage vs high-grade core.
3. **Mineralogy corrected** — `U_TH_SAFETY.primary_mineral` changed from "Bastnaesite" to "Ionic adsorption clay (IAC) — REE adsorbed on halloysite/kaolinite" to reflect correct Caldeira geology.
4. **Legacy financial aliases removed** — `npv_low_m`, `npv_high_m`, `irr_pct` removed from `ProjectFinancials` interface and `PROJECT_FINANCIALS`.
5. **Capital funded_m aligned** — corrected from `420` to `443` to match `total_capex_m`.
6. **ESG spring metric** — Water stress metric now uses dynamic `SPRING_COUNT` instead of hardcoded "98 Springs Monitor."
7. **LOM FCF data-driven** — `FinancialsTab.tsx` now computes from `PROJECT_FINANCIALS.lom_fcf_m` instead of hardcoded `$2.0B`.
8. **FEOC % data-driven** — `ComplianceTab.tsx` now uses `batch.feoc_percentage.toFixed(2)` instead of hardcoded `0.00%`.
9. **GeologyPanel data-driven** — Global MRE display replaced hardcoded values with `RESOURCE_CLASSIFICATION` lookups.
10. **issuerSnapshot global_bt** — synced from `1.5` to `1.537`.

### Targeted Refactors (6)
1. **Audit filter chips** — added `system_event` and `offtake_update` to `AuditTab.tsx` filter list.
2. **Keyboard accessibility** — added `role="button"`, `tabIndex={0}`, `onKeyDown` to expandable `GlassCard` instances in `GeologyPanel`, `LicensesPanel`, and `BlockchainTimeline`. Fixed `GlassCard.tsx` itself to pass `jsx-a11y` lint with explicit prop assignment.
3. **NeighborOverlay wired** — added `neighbors` toggle to `fieldMapLayers.ts`, rendered in `FieldView.tsx`, toggle in `OperationsPanel.tsx`.
4. **CSS token sync** — added `--w-text-inverse`, `--w-red-border-soft`, `--w-red-badge-bg` to `theme.css`. Licence/License rename deferred (low risk/reward before pitch).
5. **DFS regulatory log differentiation** — added introductory paragraph to `DfsTab.tsx` distinguishing its regulatory log scope from the Agencies tab.
6. **MapLibre build fixes** — resolved pre-existing `TS2322` errors in `HydroOverlay.tsx` and `PlantOverlay.tsx` by removing `as const` from paint/layout objects and casting props `as never` at usage sites.

### High-ROI New Features (4)
1. **IR Disclosure Mode** — `VITE_DISCLOSURE_MODE=1` flag via `getDisclosureMode()` in `env.ts`. `DataContext.disclosureMode` flows through `mockDataService.ts` and `liveDataService.ts`. Violet-themed banner in `DataModeBanner.tsx`. DISCLOSURE badge in `HeaderStrip.tsx`. Alert count suppressed to 0.
2. **Community & Stakeholder Notice** — always-visible disclaimer card in `EnvironmentPanel.tsx` explaining that spring status is modeled from reference geometry, not field-verified telemetry.
3. **ASX Citation Badges** — clickable "ASX [date]" badge in `GeologyPanel.tsx` next to "Global Mineral Resource" label, linking to `issuerSnapshot.resource.citation.url`.
4. **Aether Platform Roadmap** — Phase 1/2/3 vertical stepper in `DfsTab.tsx` with milestones, costs, timelines, and status indicators.

### Demo Flow Polish (4)
1. **Branded loading skeleton** — `App.tsx` Suspense fallback replaced with Aether "Æ" logo + pulse animation.
2. **BuyerView empty state** — replaced `return null` with styled "No batches available" fallback.
3. **BuyerView hooks order fix** — all React hooks moved above conditional returns to resolve `react-hooks/rules-of-hooks` lint error.
4. **Map tile verification** — noted as manual check (requires `VITE_MAPTILER_KEY` in `.env`).

### Quality Gate
- **0 lint errors / 0 warnings** (`npm run lint`)
- **131 tests passing** (`npm run test:run`)
- **Clean production build** (`npm run build`)

**What is in progress:** Nothing — sprint is complete.

**What should be done next (priority order):**

1. **2-minute video walkthrough** — Loom/screen recording narrated by Carlos. The founder story needs a shareable artifact.
2. **One real stakeholder conversation** — geologist, compliance officer, or integrator. 30 days max.
3. **DPP field-mapping table** in Compliance tab — which Aether fields map to CEN/CENELEC mandatory passport fields.
4. **Source TAM/SAM/SOM** — add methodology footnote or analyst report citation.
5. **Portuguese community context card** for Brazil-facing deployments.
6. **OpenAPI / OPC-UA ingestion spec** — document data ingestion contract for integrator scoping.
7. **Re-evaluate persona scores** — re-run the 9-persona evaluation loop with the new features and update weighted average.

**Decisions made this session:**

- **`as never` cast pattern for MapLibre types** — chosen over `as const` or manual type assertions because MapLibre's `paint`/`layout` types use mutable arrays that conflict with TypeScript's `readonly` inference in `tsc -b` mode. The `as never` cast is safe because MapLibre validates at runtime.
- **Licence/License naming consistency deferred** — renaming all "licence" → "license" (or vice versa) would touch GeoJSON files, types, components, and tests. Risk of regression outweighs cosmetic benefit before the pitch.
- **Disclosure mode is an env flag, not a UI toggle** — for the pitch, `VITE_DISCLOSURE_MODE=1` is set in `.env` before launching. A runtime toggle can be added later but adds complexity around what data gets cached/shown.
- **Dr. Heber Caponi is designated most strategic team member.** His LAPOC field data is the bridge from "simulated" labels to "field-verified" labels — the single transition that improves every persona score.
- **Founder story is the opening frame, not a bio slide.** Business Expert recommended leading every conversation with the Caldeira-native narrative before showing the demo.
- **Persona evaluations are a living feedback loop.** After each major release, re-evaluate all 9 external personas and update scores. Use the aggregate scorecard to track progress toward pitch-readiness.
- **Two advisor personas (Business Expert + CTO) are invocable by name.** They have defined communication styles and decision frameworks documented in Personas.md Part 1.

---

## Session Log — 2026-04-08 (Synthetic Data Bridge / Production Elevation)

**What was completed this session:**

### Architecture: Three-Process Backend (server + engine + frontend)
1. **`server/` — Fastify API backend** — Fastify 5.8 + `better-sqlite3` 12.x + `@fastify/websocket` + `@fastify/cors`. SQLite database (`aether.db`) with schema for telemetry (latest + ring buffer history), domain state (25+ seeded keys), weather, market, and seismic data.
2. **40+ REST endpoints** — `/api/health`, `/api/telemetry/current`, `/api/telemetry/history`, plus every `AetherDataService` method mapped to a GET endpoint (`/api/financials`, `/api/risks`, `/api/batches`, `/api/audit`, `/api/esg`, etc.).
3. **WebSocket broadcast** — `/ws/telemetry` channel. Server receives engine telemetry via POST, stores it, and broadcasts to all connected frontend clients.
4. **Ingest webhooks** — `POST /ingest/telemetry` (engine tick), `/ingest/weather` (Open-Meteo), `/ingest/market` (BCB/Alpha Vantage), `/ingest/seismic` (USGS), `/ingest/lapoc` (LAPOC instruments).
5. **SQLite seed on first boot** — `seed.ts` populates all 25+ domain state keys from `mockData.ts` and `mockDataService.ts` so the API serves complete data immediately.

### Engine: Simulation Bot + External API Enrichers
6. **`engine/` — Aether Simulation Engine** — standalone Node.js process. 2-second tick loop generates realistic plant + environment telemetry (generators lifted from `mockGenerator.ts`), calculates ESG scores, detects alerts, and POSTs to server.
7. **Open-Meteo enricher** — real precipitation data for Caldeira coordinates (every 30 min).
8. **BCB PTAX enricher** — real BRL/USD exchange rate from Banco Central do Brasil (every 1 hour).
9. **USGS Seismic enricher** — M2.5+ earthquake events within 200 km (every 6 hours).
10. **Alpha Vantage enricher** — MEI.AX stock quotes (daily, API key gated).
11. **LAPOC adapter skeleton** — `LapocTelemetryPayload` interface + synthetic data generator, swap-ready for real LAPOC instruments.

### Frontend: LiveDataService Rewrite
12. **`liveDataService.ts` fully rewritten** — now uses `fetch()` for all REST domain data (with 60s TTL cache) and `WebSocket` for real-time telemetry. Falls back to mock data if backend is unreachable.
13. **Vite proxy configured** — `/api/*` → `http://localhost:3001`, `/ws/*` → `ws://localhost:3001` in `vite.config.ts`.
14. **Dynamic provenance** — `/api/provenance` and `/api/context` update based on actual enricher data ingestion. Banner evolves from "Aether Simulation Engine" to "enriched with Open-Meteo, BCB" etc.

### Deployment Infrastructure
15. **Docker Compose** — 3 services: `api` (Fastify), `engine` (simulation bot), `ui` (Vite build + Nginx). Health checks, dependency ordering.
16. **Dockerfiles** — separate multi-stage Dockerfiles for server, engine, and frontend.
17. **Nginx reverse proxy** — production config routes `/api/*` and `/ws/*` to the API service.
18. **Root scripts** — `npm run dev:all` (concurrently), `npm run build:all`, `npm run install:all`.

### Documentation
19. **LAPOC Ingestion Contract** — `docs/data/caldeira/LAPOC_INGESTION.md` documenting payload interface, endpoint, integration modes, and provenance evolution.
20. **`.env.example` updated** — all new variables documented (PORT, AETHER_API_URL, TICK_MS, enricher flags, Alpha Vantage key).

### Persona Re-Evaluation
21. **All 9 external personas + 2 internal advisors re-evaluated** — assessed impact of the Synthetic Data Bridge on each stakeholder. Weighted average rose from **6.8 → 7.3 / 10**. Updated `docs/Personas.md`.

**What is in progress:** Nothing — all 7 plan phases complete.

**What should be done next (priority order):**

1. ~~**Run `npm run dev:all` end-to-end**~~ — ✅ Code fixes applied (see Live App Deployment session). Manual `npm run dev:all` verification pending.
2. **Deploy to Railway + Vercel** — see Live App Deployment plan and session log.
3. **DPP field-mapping table** in Compliance tab — CEN/CENELEC mandatory passport field mapping.
4. **2-minute video walkthrough** — Loom/screen recording showing the live three-process system.
4. **One real stakeholder conversation** — geologist, compliance officer, or integrator. 30 days max.
5. **Source TAM/SAM/SOM** — add methodology footnote or analyst report citation.
6. **Portuguese community context card** for Brazil-facing deployments.
7. **Connect real LAPOC instruments** — replace `lapocAdapter.ts` synthetic generator with actual instrument polling.

**Decisions made this session:**

- **Fastify over Express** — chosen for TypeScript-first DX, built-in JSON schema validation, and OpenAPI generation path.
- **SQLite over Postgres** — zero-config local dev, single-file database, perfectly adequate for current scale. Postgres migration path is straightforward when needed.
- **Engine as separate process** — decouples data generation from API serving. When real sensors arrive, only the engine changes. The server and frontend are untouched.
- **Enricher enablement via env vars** — each external API enricher can be toggled independently (`ENRICHER_OPENMETEO=1`, etc.). No enrichers run by default if env vars are unset.
- **WebSocket for telemetry, REST for domain data** — telemetry needs sub-second latency; domain data (financials, risks, etc.) is static enough for cached REST.
- **LAPOC contract defined early** — even though synthetic, the `LapocTelemetryPayload` interface locks the data shape so Dr. Caponi's team can target it.

---

## Session Log — 2026-04-08 (Live App Deployment — Code Preparation)

**What was completed this session:**

### Phase 0: Local End-to-End Code Fixes (5 fixes)
1. **SQLite DB_PATH env** — `server/src/store/db.ts` now respects `process.env.DB_PATH` for Railway persistent volumes.
2. **WebSocket URL derivation** — `liveDataService.ts` uses `getWsUrl()` from `env.ts` when `VITE_WS_URL` is set (production), falls back to `location.host` (dev).
3. **CORS origin tightening** — `server/src/index.ts` reads `CORS_ORIGIN` env var (production: Vercel domain). Defaults to `true` for local dev.
4. **Ingest API key guard** — `server/src/index.ts` adds an `onRequest` hook that rejects `/ingest/*` requests without a valid `x-api-key` header when `INGEST_API_KEY` is set. Frictionless in local dev (empty = no guard).
5. **WebSocket exponential backoff** — `liveDataService.ts` reconnects with 1s → 2s → 4s → ... → 30s cap, with random jitter to avoid thundering herd.

### Phase 1: Server-Side Integration Tests (22 tests)
6. **`server/vitest.config.ts`** — Vitest config for Node environment.
7. **`server/src/__tests__/health.test.ts`** — health endpoint shape and response.
8. **`server/src/__tests__/telemetry.test.ts`** — ingest + current + history round-trip, invalid range/payload rejection.
9. **`server/src/__tests__/domain.test.ts`** — 12 seeded domain endpoints (risks, batches, scenarios, audit, ESG, project financials, springs, context, provenance).
10. **`server/src/__tests__/ingest-guard.test.ts`** — API key guard rejects unauthorized/wrong key, accepts correct key.
11. **`buildApp()` factory exported** from `server/src/index.ts` — `main()` only runs when executed directly, enabling test harness via Fastify `.inject()`.
12. **CI updated** — `.github/workflows/ci.yml` now runs `cd server && npm ci && npm test` after frontend tests.

### Phase 3: Engine API Key Integration
13. **`engine/src/config.ts`** — added `ingestApiKey` field + `ingestHeaders()` helper function.
14. **All 6 engine fetch calls updated** — main tick loop + 5 enrichers (openMeteo, bcbExchange, usgsSeismic, alphaVantage, lapocAdapter) now send `x-api-key` header via `ingestHeaders()`.

### Phase 4: Frontend Resilience
15. **`ConnectionStatus` type** added to `dataService.ts` — `'connected' | 'degraded' | 'offline'`.
16. **`liveDataService.ts`** — `api<T>()` helper now tracks connection status: successful fetch = `connected`, failed fetch with cache = `degraded`, failed fetch without cache = `offline`. WebSocket `onopen` resets to `connected`.
17. **`DataModeBanner.tsx`** — displays status-aware banner: amber background + "Backend unreachable — showing cached data" (degraded), red background + "Backend offline — reconnecting..." (offline). Normal banner when connected.
18. **`getConnectionStatus()` + `onConnectionStatusChange()`** exported for external consumers.

### Quality Gate
- **0 lint errors** (`npm run lint`)
- **151 tests passing** (129 frontend + 22 server)
- **Clean production build** (`npm run build`)
- **Clean type-check** (frontend + server + engine)

**What is in progress:** Nothing code-wise — all implementable phases complete.

**What should be done next (manual steps by Carlos):**

1. **Sign up for Railway** — create 2 services (aether-api, aether-engine), connect GitHub, set env vars, deploy. See deployment plan Phase 2a.
2. **Configure Vercel** — set `VITE_DATA_MODE=live`, `VITE_API_BASE_URL`, `VITE_WS_URL`, `VITE_MAPTILER_KEY`. Deploy.
3. **Password protection** — Vercel Pro ($20/mo) or client-side gate.
4. **UptimeRobot** — free health check on Railway API.
5. **Run production smoke test** — 12-item checklist in deployment plan Phase 5.

**Decisions made this session:**

- **`buildApp()` pattern** — server entry point exports a factory function for test harness use, with `main()` guarded by direct-execution check. Avoids port conflicts and `process.exit` during tests.
- **Ingest guard is opt-in** — when `INGEST_API_KEY` is empty, the guard is skipped entirely. Local dev stays frictionless; production sets the key in env vars.
- **Connection status is module-level** — not React state. This avoids re-render storms; the banner reads it via `getDataContext()` which is already called per render cycle.
- **Exponential backoff with jitter** — prevents thundering herd on WS reconnect. Cap at 30s, reset on successful open.

---

*Last updated: 2026-04-08 — Live App Deployment code preparation complete: 5 production code fixes (DB_PATH, WS URL, CORS, ingest guard, WS backoff), 22 server integration tests, engine API key on all ingest calls, frontend connection resilience (degraded/offline states in banner), CI updated. 151 total tests, 0 lint errors. Next: Railway + Vercel deployment (manual), password protection, UptimeRobot, production smoke test.*
