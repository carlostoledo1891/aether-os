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
        E_API[Enrichers:<br>Open-Meteo<br>BCB PTAX<br>USGS Seismic<br>Alpha Vantage<br>LAPOC]
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
              └── AppShell (div.AppShell.module.css — var(--w-bg), grid via --w-app-shell-grid)
                    ├── HeaderStrip → ViewSwitcher (+ Reports dropdown)
                    ├── DataModeBanner     — getDataContext() from injected service
                    ├── main (flex:1) → AnimatePresence → motion.div.viewLayer → active view
                    ├── AlertPanel
                    ├── ChatPanel
                    └── DeckRunner (lazy, portal — rendered when route matches /pages/decks/*)
```

`createDataService()` uses **`getDataMode()`** from `src/config/env.ts`: **`createMockDataService()`** or **`createLiveDataService()`**.

**State held in `AppShell`:**
- `view: ViewMode` — passed to `HeaderStrip` / `ViewSwitcher`
- `reportOpen: ReportType | null` — which report lightbox is open (environment / operations / drill-tests)
- `alertOpen: boolean` — alert drawer
- `chatOpen: boolean` — AI chat drawer
- Telemetry via `DataServiceProvider` (`useTelemetry()` / `useAetherService()`)

### Data honesty (`getDataContext()`)

- [`AetherDataService`](src/services/dataService.ts) exposes **`getDataContext(): DataContext`** with `mode` (`mock` | `live`), `telemetry` (`simulated` until a real backend), **`presentationMode`** (from `VITE_PRESENTATION_MODE`), **`disclosureMode`** (from `VITE_DISCLOSURE_MODE`), `bannerLabel`, and `detail`.
- **`VITE_PRESENTATION_MODE=1`:** banner shifts to **stakeholder / mixed illustrative** wording for MPF–agency style demos while keeping the same data pipeline.
- **`VITE_DISCLOSURE_MODE=1`:** IR disclosure mode — hides simulated telemetry panels, suppresses alert count to 0, changes banner to **"Disclosure mode — board-approved facts only"** (violet theme), and adds a **DISCLOSURE** badge to HeaderStrip. Only board-approved data is surfaced.
- **`getProvenanceProfile()`** returns per-area provenance kinds (`from_public_record`, `simulated`, etc.) for **`ProvenanceBadge`** on Field Hydro Twin and Executive surfaces.
- **`getRegulatoryExportBundle()`** packs regulatory log + audit slice + permitting risks for **JSON download**.
- **`VITE_DATA_MODE=live`:** `createLiveDataService()` is used; **`getDataContext()`** surfaces live mode.

### Future: credential scopes (RBAC) — not implemented

When auth lands, prefer **one UI** with **scoped data** from `AetherDataService` implementations (not separate apps):

| Scope (proposed) | Typical access |
|------------------|----------------|
| `regulator.read` | Agency matrix, monitoring annex methodology, submitted doc IDs, public geometry — hide draft financials and unreleased lab data. |
| `issuer.internal` | Full register, risks, capital, simulated telemetry as today. |
| `community.public` | High-level monitoring narrative, grievance entry points — no competitive detail. |

Filter or redact in **service/DTO** layers; keep view components dumb.
