# Vero — Critical Mineral OS

**The trust layer for critical mineral supply chains.**

A pitch-ready B2B SaaS prototype providing real-time telemetry, ESG compliance, molecular traceability, and financial modeling for the Caldeira Project REE supply chain (Meteoric Resources, ASX: MEI). Commercial brand: **Vero** (from Latin *verus*, 'true'). Codebase retains `aether-os` as internal name.

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:5175
npm run build        # TypeScript + production bundle
npm run lint         # ESLint
npm run test:run     # Vitest (same as `npx vitest run`)
```

CI (GitHub Actions) runs `lint`, `test:run`, and `build` on push and pull requests.

### Environment (`.env` / `.env.example`)

| Variable | Purpose |
|----------|---------|
| `VITE_MAPTILER_KEY` | MapTiler vector + terrain (optional; falls back to CARTO Dark Matter) |
| `VITE_DATA_MODE` | `mock` (default) or `live` — live uses `createLiveDataService()` (demo pipeline + honest banner until real ingestion) |
| `VITE_API_BASE_URL` / `VITE_WS_URL` | Reserved for future HTTP/WebSocket wiring |
| `VITE_WEATHER_ENABLED` | `1` or `true` to fetch precip from Open-Meteo for the Hydro Twin site point |
| `VITE_PRESENTATION_MODE` | `1` or `true` for stakeholder-demo banner copy (mixed illustrative / agency rehearsal) |

Sign up at [maptiler.com](https://maptiler.com) for a free API key if you want MapTiler terrain and the Dataviz Dark style.

## 3 Views

| View | Tab Label (UI) | Audience | Purpose |
|------|----------------|----------|---------|
| **Field Operations** | Field Operations | Meteoric Resources, plant operators | Two map modes: **Operations** (terrain-aligned plant sites, per-block licences, named drill collars, PFS pit/spent clay, optional access road & licence envelope; legacy deposit/infra/schematic layers off by default) and **Hydro Twin** (springs, hydro nodes, APA/buffer/monitoring, urban centroid, optional Open-Meteo precip) |
| **Compliance & Traceability** | Compliance & Traceability | US DoD, EU Customs, off-takers | FEOC 0.00%, IRA compliance, EU Digital Battery Passport, blockchain ledger, Scope 3 tracking |
| **Executive Overview** | Executive Overview | C-suite, board, investors | Full-width tabbed dashboard: assets, financials (issuer snapshot + PFS scenarios), risk, pipeline, capital, DFS, **Agencies** (exports, spatial cross-check), audit, ESG — **no map** in this view |

## Key Features

- **Live simulation** — 2s IoT telemetry pulse with realistic drift across 10+ sensor channels
- **Hydro Digital Twin** — ~1,092 public-reference spring points (GeoJSON), piezometer network, UDC legacy site, base-map water highlighting on the Hydro Twin tab
- **Alert system** — threshold breach detection (pH, sulfate, radiation, aquifer) with incident lifecycle tracking
- **Financial scenario modeling** — Bear/Consensus/Bull NPV sensitivity at 7 NdPr price points
- **Data service architecture** — `AetherDataService` with `MockDataService` and `createLiveDataService()` (`VITE_DATA_MODE=live`; banner reflects live while telemetry stays on the demo pipeline until ingestion ships)
- **Molecular traceability** — blockchain timeline from pit to magnet with full SHA-256 hash chain
- **Green Premium tracking** — spot vs certified NdPr/DyTb pricing with carbon intensity tiers
- **Interactive map overlays** — Operations defaults to **per-block mining licences**, **8 named drill collars** (DD/AC), **pilot + commercial plant points**, PFS pit/spent clay, alkaline-complex boundary; Hydro Twin uses split APA/buffer GeoJSON + monitoring + springs; **map feature inspector** with provenance; optional legacy deposit polygons and full logistics mesh via toggles
- **Issuer snapshot & spatial insights** — `getIssuerSnapshot()` / `getSpatialInsights()` for executive copy and cross-layer distance/heuristics (see `src/data/caldeira/`)
- **Time range selector** — 24h / 7d / 30d historical views with distinct variance patterns

## Stack

React 19 · Vite 8 · TypeScript (strict) · Tailwind CSS 4 · Motion 12 · Recharts · lucide-react · react-map-gl v8 · MapLibre GL JS

## Design System

Near-black indigo glass palette, violet primary, cyan hydrology accent — authored as **`W` tokens** in `src/app/canvas/canvasTheme.ts` (keep in sync with `src/styles/theme.css` `:root` / `@theme inline`). The app shell uses **`AppShell.module.css`** plus those CSS variables (avoid raw hex in layout code). Inter + JetBrains Mono typography; Motion for transitions.

## Documentation

| Doc | Purpose |
|-----|---------|
| [HANDOFF.md](HANDOFF.md) | Architecture, data model, components, handoff checklist |
| [docs/STYLING.md](docs/STYLING.md) | Design tokens (`W` vs CSS vars), primitives |
| [docs/data/caldeira/DATA_SOURCES.md](docs/data/caldeira/DATA_SOURCES.md) | GeoJSON / dataset registry + key URLs |
| [docs/data/caldeira/GLOSSARY.md](docs/data/caldeira/GLOSSARY.md) | Permitting & project terms |
| [docs/copy/WEBSITE_COPY.md](docs/copy/WEBSITE_COPY.md) | Marketing & in-product copy — iterate here, then sync UI |
| [docs/copy/PITCH_DECK_COPY.md](docs/copy/PITCH_DECK_COPY.md) | Slide-style narrative for decks |
