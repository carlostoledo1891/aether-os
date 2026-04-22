# Vero — Critical Mineral OS

![CI](https://github.com/carlostoledo/aether-os/actions/workflows/ci.yml/badge.svg)

**The trust layer for critical mineral supply chains.**

A pitch-ready B2B SaaS prototype providing real-time telemetry, ESG compliance, molecular traceability, and financial modeling for the Caldeira Project REE supply chain (Meteoric Resources, ASX: MEI). Commercial brand: **Vero** (from Latin *verus*, 'true'). Codebase retains `aether-os` as internal name.

**Enterprise Readiness:** Controls mapped to NIST 800-53 Rev 5 and CMMC Level 2. SBOM generated via Syft on every CI build. See [Trust Center](/trust) and [SECURITY.md](SECURITY.md).

## Verify this build

Open [`https://verochain.co/verify/c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a`](https://verochain.co/verify/c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a)
in any modern browser.

Your browser will recompute the SHA-256 chain locally with `crypto.subtle`
and either confirm the audit chain is intact or pinpoint the broken
sequence. The server is never the one that says "valid". If your browser
lacks `crypto.subtle` (in-app webviews, locked-down corp builds), the
page degrades to a "Verifier unavailable" card with the chain hash and a
`curl` snippet — we never silently fall back to "trust the server".

The wire format and verification algorithm are MIT-licensed in
[`docs/spec/`](docs/spec/) (`audit-event-v1.md`, `bundle-v1.md`, plus
JSON Schemas). The committed reference hash lives in
[`docs/REFERENCE_BUNDLE_HASH.txt`](docs/REFERENCE_BUNDLE_HASH.txt) and is
gated against drift by
[`server/src/__tests__/referenceBundle.test.ts`](server/src/__tests__/referenceBundle.test.ts) —
any change to the canonical bundle's shape fails CI in the same PR. To
reproduce the hash on a fresh clone:

```bash
npm install
cd server && npm install && cd ..
rm -f server/data/aether.db
npm run server   # logs `[seed] /verify/<hash>` on first boot
```

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
| `VITE_API_BASE_URL` / `VITE_WS_URL` | Hosted backend targets. Leave empty locally to use the Vite proxy; set them on staging/prod when the frontend and API are on different origins |
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
| [AGENT.md](AGENT.md) | AI agent bootstrap — project overview, run instructions, doc map |
| [docs/STYLING.md](docs/STYLING.md) | Design tokens (`W` vs CSS vars), primitives |
| [docs/data/caldeira/DATA_SOURCES.md](docs/data/caldeira/DATA_SOURCES.md) | GeoJSON / dataset registry + key URLs |
| [docs/data/caldeira/GLOSSARY.md](docs/data/caldeira/GLOSSARY.md) | Permitting & project terms |
| [docs/messaging-strategy.md](docs/messaging-strategy.md) | Brand messaging, copy guidelines |
