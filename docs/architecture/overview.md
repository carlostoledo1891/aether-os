# Vero Architecture Overview

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
| Map tiles | MapTiler (Satellite/Operations/Topography; terrain DEM; 3-style selector) |
| Testing | Vitest 4.x + `@testing-library/react` + `happy-dom` |
| **Backend** | **Fastify 5.8 + `better-sqlite3` 12.x** |
| **Engine** | **Node.js + TypeScript (standalone process)** |
| **Server testing** | **Vitest 4.x + Fastify `.inject()` (50 route-level tests)** |
| **Dev runner** | **`concurrently` (runs all 3 processes via `npm run dev:all`)** |
| Font: UI | Inter (Google Fonts) |
| Font: Mono | JetBrains Mono (Google Fonts) |

## Three-Process Architecture (Synthetic Data Bridge)

The system runs as three independent processes connected via HTTP and WebSocket:

```mermaid
graph TD
    subgraph engine [aether-engine (Simulation Bot)]
        E_API[Enrichers:<br>CPTEC / INPE<br>Open-Meteo<br>ECMWF ERA5<br>BCB PTAX<br>USGS Seismic<br>Alpha Vantage<br>LAPOC]
    end

    subgraph api [aether-api (Fastify + SQLite)]
        A_REST[REST: /api/*]
        A_WS[WS: /ws/telemetry]
        A_DB[(aether.db)]
    end

    subgraph ui [Vite Frontend (React 19)]
        U_LDS[LiveDataService]
    end

    E_API -- "POST /ingest/* (every 2s)" --> api
    api -- "fetch()" --> U_LDS
    api -- "WebSocket" --> U_LDS
```

**Why this architecture:** The engine generates data that looks and behaves like real sensor/instrument telemetry, posted to real HTTP endpoints. The frontend talks to real REST/WebSocket endpoints. When actual sensor data (LAPOC, SCADA) arrives, the engine's synthetic generators are replaced — no frontend or server changes needed. Data provenance tags track every source.

## Global Layout (`App.tsx`)

```text
ErrorBoundary
  └── DataServiceProvider   service = useMemo(() => createDataService(), [])
        └── MapProvider
              └── MapCameraProvider
                    └── Routes
                          ├── /app/* → UnitPage (standalone, full-bleed single map)
                          │     ├── UnitChrome (in-page lens switcher)
                          │     ├── MapBase id="veroUnit" + UnitMarkers
                          │     └── UnitInspector (slide-in right)
                          ├── /, /business, /tech, /trust → standalone marketing (LandingPage, BusinessPage, TechPage, TrustCenterPage)
                          └── /deck/* → PresentationShell
                                ├── Manifest registry + route model
                                ├── TopChrome
                                ├── DataModeBanner (deck manifests that opt in)
                                ├── OptionalMapLayer
                                ├── HorizontalSlidesRenderer
                                ├── AlertPanel (only when showAppUtilities)
                                └── DeckRunner report lightbox (Technical Appendix)
```

`createDataService()` still uses **`getDataMode()`** from `src/config/env.ts`: **`createMockDataService()`** or **`createLiveDataService()`**.

**State held in `PresentationShell`:**
- active experience manifest + active scene
- `appendixOpen: boolean` — shared report lightbox
- `alertOpen: boolean` — alert drawer
- `chatOpen: boolean` — AI chat drawer
- `highlightFeatureId: string | null` — alert-to-scene handoff for geology review
- telemetry via `DataServiceProvider` (`useTelemetry()` / `useAetherService()`)

## Scene-First Runtime

The frontend no longer treats app, deck, and site as three unrelated layout systems. The shared runtime in `src/experience/*` is now authoritative for decks; the app workspace is a standalone page:

- **`/app/*`** → `src/pages/unit/UnitPage.tsx` — a full-bleed single-map workspace (`MapBase id="veroUnit"`) with `UnitChrome` + `useLens()` handling lens switching in-page and a slide-in `UnitInspector` on the right. No URL-backed scene tabs. This is the canonical product surface.
- **`horizontalSlides`** is the only active experience mode. It powers `/deck/founders`, `/deck/meteoric` pitch decks, and `/deck/home|business|tech|trust` marketing deck variants (optional `showPublicDeckNav` chrome).
- **Marketing pages** (`/`, `/business`, `/tech`, `/trust`) render standalone snap-scroll components outside the experience runtime and do not import from `components/deck` or `experience/*`.

Each route resolves to an **`ExperienceManifest`** and one or more **`SceneManifest`** entries. Scene data decides:

- whether the map is enabled
- which camera preset the map uses
- whether the surface is transparent, glass, or solid
- which content module renders inside the shell

### Data honesty (`getDataContext()`)

- [`AetherDataService`](src/services/dataService.ts) exposes **`getDataContext(): DataContext`** with `mode` (`mock` | `live`), `telemetry` (`simulated` until a real backend), **`presentationMode`** (from `VITE_PRESENTATION_MODE`), **`disclosureMode`** (from `VITE_DISCLOSURE_MODE`), `bannerLabel`, and `detail`.
- **`VITE_PRESENTATION_MODE=1`:** banner shifts to **stakeholder / mixed illustrative** wording for MPF–agency style demos while keeping the same data pipeline.
- **`VITE_DISCLOSURE_MODE=1`:** IR disclosure mode — hides simulated telemetry panels, suppresses alert count to 0, changes banner to **"Disclosure mode — board-approved facts only"** (violet theme), and adds a **DISCLOSURE** badge to HeaderStrip. Only board-approved data is surfaced.
- **`getProvenanceProfile()`** returns per-area provenance kinds (`from_public_record`, `simulated`, etc.) for **`ProvenanceBadge`** on Field Hydro Twin and Executive surfaces.
- **`getRegulatoryExportBundle()`** packs regulatory log + audit slice + permitting risks for **JSON download**.
- **`VITE_DATA_MODE=live`:** `createLiveDataService()` is used; **`getDataContext()`** surfaces live mode.

### Unit Model

The unit model is a parallel data layer that models every operational object (deposit, drill hole, tenement, spring, batch, risk, etc.) as a typed **unit** with:

- **State machine:** Each unit type defines states with severity mappings and transition rules. Transitions can require evidence.
- **Evidence chain:** Documents, reports, and certificates attached to units, linked to transitions, all audited via SHA-256 chain.
- **Dependency graph:** Units are connected by typed edges (`contains`, `drilled_at`, `covers`, `affects`, etc.). BFS traversal enables consequence analysis.
- **Evidence bundles:** Self-verifying snapshots of a unit and its dependency graph, with chain proofs and deterministic narratives.

**Key files:**
- `shared/units/types.ts` — canonical type definitions shared by server and frontend
- `server/src/store/unitStore.ts` — core store module (CRUD, state machine validation, audit chain integration)
- `server/src/store/unitTypeSeeds.ts` — 15 unit type definitions
- `server/src/store/unitSeeder.ts` — idempotent seeder mapping existing domain data to ~1,350 units
- `server/src/routes/units.ts` — 15 REST endpoints
- `src/units/lensRegistry.ts` — 6 preset lens definitions for filtering units
- `src/components/units/UnitInspector.tsx` — generic type-driven inspector

**API endpoints:** `/api/units`, `/api/units/:id`, `/api/unit-types`, `/api/units/:id/transition`, `/api/units/:id/evidence`, `/api/units/:id/edges`, `/api/units/:id/consequences`, `/api/bundles`, `/api/bundles/:id/verify`, etc.

### Future: credential scopes (RBAC) — not implemented

When auth lands, prefer **one UI** with **scoped data** from `AetherDataService` implementations (not separate apps):

| Scope (proposed) | Typical access |
|------------------|----------------|
| `regulator.read` | Agency matrix, monitoring annex methodology, submitted doc IDs, public geometry — hide draft financials and unreleased lab data. |
| `issuer.internal` | Full register, risks, capital, simulated telemetry as today. |
| `community.public` | High-level monitoring narrative, grievance entry points — no competitive detail. |

Filter or redact in **service/DTO** layers; keep view components dumb.
