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

**Dev server:** `http://localhost:5175/`  
**Working directory:** `/Users/carlostoledo/Documents/Aether Project/aether-os`

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite` plugin) |
| Animation | Motion (`motion/react`) 12.x |
| Charts | Recharts |
| Icons | `lucide-react` |
| Map | `react-map-gl` v8 + `maplibre-gl` |
| Map tiles | MapTiler (Dataviz Dark style + terrain DEM) |
| Testing | Vitest 4.x + `@testing-library/react` + `happy-dom` |
| Font: UI | Inter (Google Fonts) |
| Font: Mono | JetBrains Mono (Google Fonts) |

---

## File Structure

```
aether-os/
├── index.html
├── vite.config.ts
├── .env                                VITE_MAPTILER_KEY (fill in at maptiler.com)
├── HANDOFF.md                          ← this file
├── src/
│   ├── main.tsx                        entry point
│   ├── App.tsx                         root: global state, view routing, layout
│   ├── types/
│   │   └── telemetry.ts                all TS interfaces — ViewMode: 'operator'|'buyer'|'executive'
│   ├── data/
│   │   ├── mockData.ts                 BATCHES, INITIAL_PLANT_TELEMETRY, PROJECT_FINANCIALS, MARKET_PRICES, DEPOSIT_DATA, PILOT_PLANT_PERFORMANCE, U_TH_SAFETY, PROJECT_TIMELINE, RESOURCE_CLASSIFICATION
│   │   ├── mockGenerator.ts            drift(), generatePlantTelemetry(), detectAlerts(), calculateEsgScore()
│   │   └── geojson/                    static Caldeira map geometry for MapLibre sources/layers
│   │       ├── caldeira-boundary.geojson     outer project limit polygon (real surveyed coords)
│   │       ├── caldeira-deposits.geojson     7 deposit polygons (Capão do Mel, Soberbo, Figueira, Barra do Pacu, Agostinho, Cupim Vermelho Norte, Dona Maria 1&2)
│   │       ├── caldeira-licenses.geojson     3 licence group polygons (Southern LP, Acquired, Northern)
│   │       ├── caldeira-drillholes.geojson   ~37 drill collar points incl. 5 exploration targets outside resource boundary
│   │       ├── caldeira-neighbors.geojson    Axel REE Caldas Project adjacent tenement polygon (district-scale context)
│   │       ├── caldeira-infrastructure.geojson  pilot plant, office, CEMIG, access roads, supply route to Santos
│   │       ├── caldeira-environmental.geojson   APA Pedra Branca polygon, 3 km buffer zone, water monitoring zone
│   │       ├── plant-nodes.geojson      plant / competitor / sensor points
│   │       ├── plant-edges.geojson      plant process + monitoring linework
│   │       ├── hydro-nodes.geojson      hydro monitoring nodes + UDC point
│   │       ├── hydro-rivers.geojson     rivers + groundwater flow lines
│   │       └── hydro-springs.geojson    representative spring points
│   ├── hooks/
│   │   └── useSimulatedTelemetry.ts    main data hook — 2s interval, ESG calc, alert detection
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
│   │   │   └── CountdownTimer.tsx      countdown to target ISO date
│   │   ├── charts/
│   │   │   ├── SparkLine.tsx           Recharts LineChart with threshold bands
│   │   │   ├── GaugeChart.tsx          circular SVG gauge
│   │   │   └── BarComparison.tsx       horizontal bar comparison
│   │   ├── layout/
│   │   │   ├── HeaderStrip.tsx         single-row navbar: logo | ViewSwitcher | live toggle, batch, ESG, alerts
│   │   │   ├── ViewSwitcher.tsx        3-tab nav (Field Ops | Compliance | Executive) + alert badge
│   │   │   ├── AlertPanel.tsx          right-side sliding alert drawer
│   │   │   └── PlaybackScrubber.tsx    floating bottom scrubber for playback mode
│   │   ├── map/                        GeoJSON-driven MapLibre overlay system
│   │   │   ├── MapBase.tsx             react-map-gl + MapLibre wrapper; props: id, initialViewState; exports FIELD/BUYER/EXEC_VIEW_STATE
│   │   │   ├── geojson.ts              GeoJSON loader + PointGeometry/LineStringGeometry/PolygonGeometry typings
│   │   │   ├── CaldeiraBoundary.tsx    outer project-limit polygon (fill + glow + dashed edge)
│   │   │   ├── PlantOverlay.tsx        native MapLibre plant sources/layers + hover card
│   │   │   ├── HydroOverlay.tsx        native MapLibre hydro sources/layers + hover card
│   │   │   ├── DepositOverlay.tsx      7 deposit polygons; grade-fill + status-outline + labels; exports DEPOSIT_LAYER_ID, toDepositDetail()
│   │   │   ├── LicenseOverlay.tsx      3 licence group polygons; status-fill + outline + labels; exports LICENSE_LAYER_ID, toLicenseDetail()
│   │   │   ├── DrillHoleOverlay.tsx    ~37 drill collar circles; TREO colour ramp + depth-radius; exports DRILL_LAYER_ID
│   │   │   ├── InfraOverlay.tsx        pilot plant (pulse), project office, CEMIG, access roads, supply-chain route (showRoute prop)
│   │   │   ├── EnvironmentalOverlay.tsx  APA Pedra Branca polygon (green) + 3km buffer (amber dashed) + water monitoring zone (cyan); shown in Hydro Twin + Executive views
│   │   │   └── NeighborOverlay.tsx     Axel REE Caldas Project adjacent tenement polygon (muted styling); shown in Geology tab
│   │   ├── EsgScoreRing.tsx            composite ESG ring gauge
│   │   ├── GreenPremiumCard.tsx        spot vs certified NdPr price delta card
│   │   └── BlockchainTimeline.tsx      molecular-to-magnet vertical timeline
│   └── views/
│       ├── FieldView.tsx               4-tab MapLibre view: Operations | Geology | Licenses | Hydro Twin
│       ├── field/                      extracted FieldView sub-components (one per tab)
│       │   ├── constants.ts            shared types, color maps, license/chain data for field panels
│       │   ├── OperationsPanel.tsx     Operations tab — plant telemetry metrics + process chain
│       │   ├── GeologyPanel.tsx        Geology tab — deposit cards + resource data
│       │   ├── LicensesPanel.tsx       Licenses tab — license zone cards + status timeline
│       │   └── EnvironmentPanel.tsx    Hydro Twin tab — aquifer, water quality, UDC, springs
│       ├── BuyerView.tsx               supply-chain map hero (origin → plant → Santos) above TradeTech compliance content
│       └── ExecutiveView.tsx           split hero: MapLibre overview map (left 58%) + headline text/ESG (right 42%)
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
- `.map-flow-edge`, `.map-flow-edge-med`, `.map-flow-edge-slow` — edge speed classes

---

## Geographic Coordinate System

Both `CaldeiraSiteMap` and `HydroTwinMap` share the same projection:

```typescript
const SW = 780, SH = 540
const LAT_MAX = -21.610, LAT_MIN = -21.965   // 0.355° N-S ≈ 39 km
const LNG_MIN = -46.730, LNG_MAX = -46.390   // 0.340° E-W ≈ 30 km

function geo(lat: number, lng: number) {
  return {
    x: (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * SW,
    y: (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * SH,
  }
}
```

**Key site positions (SVG pixels at default zoom):**

| Site | Lat, Lng | SVG x, y |
|---|---|---|
| CIP Plant (hub) | −21.793, −46.555 | ~402, 275 |
| Block 14-C (mine) | −21.848, −46.618 | ~258, 358 |
| UDC legacy site | −21.912, −46.648 | ~191, 453 |
| Poços de Caldas city | −21.789, −46.561 | ~390, 269 |
| PCAC center | −21.790, −46.580 | ~353, 270 |

---

## Data Architecture

### `useSimulatedTelemetry` hook
- Interval: 2 seconds (live mode only)
- Returns: `{ plant, env, esg, activeAlerts, plantHistory, envHistory, simMode, setSimMode, dismissAlert, dismissAllAlerts }`
- History: last 60 data points stored for sparklines

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
OPEX: $8.91/kg NdPr
```

### Resource Classification (`RESOURCE_CLASSIFICATION`)
```
Global: 1.5 Bt @ 2,359 ppm TREO | M&I: 666 Mt @ 2,685 ppm | Measured: 37 Mt @ 2,983 ppm
7 deposits | 750+ drill holes | 24% MREO avg
```

### Pilot Plant Performance (`PILOT_PLANT_PERFORMANCE`)
```
Nameplate: 2.0 kg/day MREC | Peak: 2.6 kg/day | MREC: 32.7% MREO, 1.0% DyTb
Recovery: Nd 70% | Pr 71% | Tb 61% | Dy 56% | Avg magnet: 70%
```

### Uranium/Thorium Safety (`U_TH_SAFETY`)
```
Primary mineral: Bastnaesite | U/Th do not solubilize at pH 4.0
MREC safe for international transport | No radioactive tailings
```

### Project Timeline (`PROJECT_TIMELINE`)
```
LP Approved Dec 2025 → LI Application Q1 2026 → DFS Mid 2026 → FID H2 2026 → Construction 2027 → First Production 2028
```

### Market Prices (`MARKET_PRICES`)
```
NdPr Spot: $65/kg | NdPr Green: $94/kg (+$29 green premium)
DyTb Spot: $850/kg | DyTb Green: $1,180/kg
```

---

## Four Views

### 1. Field Operations View (`FieldView.tsx`) — License-to-Operate command center
**Layout:** Column → [top bar] + [flex row: MapLibre hero | right panel] + [bottom KPI strip (control tab only)]

- **Hero:** `MapBase` (react-map-gl + MapLibre, MapTiler Dataviz Dark, pitch 40°, terrain DEM) fills all remaining width
- **Map overlays (tab-driven, AnimatePresence fade between them):**
  - `PlantOverlay` — GeoJSON-backed MapLibre layers for plant nodes, monitoring nodes, competitor points, and process/monitoring/risk linework; node styling and metric labels are derived from live telemetry at render time
  - `HydroOverlay` — GeoJSON-backed MapLibre layers for hydro nodes, UDC zone, rivers, groundwater flow lines, and representative spring points; water quality and sensor state update layer styling in real time
- **Right panel (300px, 4 tabs: Operations | Geology | Licenses | Hydro Twin):**
  - **Operations** (`OperationsPanel`) — Board narrative + pilot-to-scale framing + **pilot vs ANSTO recovery comparison (BarComparison)** + process chain + proof-that-scales telemetry
  - **Geology** (`GeologyPanel`) — **resource classification waterfall (BarComparison)** + **exploration highlights (5 outside-resource drill results)** + 7 deposit cards with resource data
  - **Licenses** (`LicensesPanel`) — license zone status cards + LP-LI-LO timeline
  - **Hydro Twin** (`EnvironmentPanel`) — **EnvironmentalOverlay** (APA Pedra Branca + 3km buffer + water monitoring zone) + cumulative impact forecast + LI hearing readiness + aquifer / water quality / UDC / springs
- **Language:** English only (PT-BR toggle was removed)
- **Map overlays per tab:**
  - **Geology:** NeighborOverlay (Axel REE district) + DepositOverlay + DrillHoleOverlay
  - **Hydro Twin:** EnvironmentalOverlay (APA/buffer/monitoring) + HydroOverlay
- **Bottom KPI strip:** 5 tiles per tab (Operations: MREC/NdPr/inflow/NH₄/annual; Geology: resource/M&I/MREO/measured/7 deposits; Licenses: count/LP/LI/south/LO; Hydro: springs/preservation/guardband/recirc/LI signal)
- **Navigation:** ViewSwitcher has 3 tabs: Field Ops | Compliance | Executive

### 2. Buyer View (`BuyerView.tsx`) — TradeTech & Compliance-as-a-Service
**Layout:** Column → [top bar] + [flex row: MapLibre supply-chain hero | right panel (400px)] + [bottom KPI strip]

- **Hero:** `MapBase` (buyerField, BUYER_VIEW_STATE zoom 7.5) showing Caldeira → Santos export route, origin deposit highlight
- **Right panel (400px, 3 tabs: Compliance | Supply Chain | Batch Ledger):**
  - **Compliance** — FEOC ring gauge (0.00%), IRA/EU DBP status chips, carbon intensity bar, trust controls, **U/Th radioactivity safety profile**, green premium
  - **Supply Chain** — upstream reagent provenance, digital passport issuance, API handoff layer, **Strategic Backing (EXIM $350M + EFA A$70M)**, export narrative
  - **Batch Ledger** — molecular-to-magnet blockchain timeline (`BlockchainTimeline`)
- **Countdown strip** — DoD NDAA and EU DBP countdowns pinned below tabs
- **Bottom KPI strip:** 5 tiles (FEOC score, IRA status, carbon intensity, green premium, active batch)
- **Navigation:** ViewSwitcher tabs: Field Ops | TradeTech | Board Options

### 3. Executive View (`ExecutiveView.tsx`) — Board decision screen
**Layout:** Column → [top bar + ESG ring] + [flex row: MapLibre overview hero | right panel (400px)] + [bottom KPI strip]

- **Hero:** `MapBase` (execField, EXEC_VIEW_STATE zoom 10.8) showing deposits, licences, infrastructure, **EnvironmentalOverlay**
- **Right panel (400px, 3 tabs: Financials | Readiness | Strategy):**
  - **Financials** — value-at-risk grid, PFS economics (**pre-tax/post-tax NPV/IRR ranges**), **funding & milestones timeline (PROJECT_TIMELINE)**, **resource classification waterfall**, trap/release narrative, revenue protection
  - **Readiness** — **GaugeChart trio (Funding 94%, DFS Progress, LP Status)** + ESG solution fit bars (operator/regulator/buyer scores), overall readiness gauge, security & sovereignty brief
  - **Strategy** — DoD/EU countdown timers, partnership deal scenarios (pilot/strategic/acquisition), board prompt
- **Headline card** — "Caldeira Value Release · Board Decision Framework" with gradient title, pinned below tabs
- **Bottom KPI strip:** 5 tiles (NPV, IRR, CAPEX, ESG score, payback)

---

## Global Layout (`App.tsx`)

```
div[height:100vh, overflow:hidden, bg:#07070E, grid bg]
  ├── HeaderStrip          (flexShrink:0) — single row: logo | ViewSwitcher | controls
  ├── Playback banner      (AnimatePresence, height:0→32)
  ├── Content area         (flex:1, overflow:hidden, position:relative)
  │   └── AnimatePresence  (mode:"wait")
  │       └── motion.div   (position:absolute, inset:0)
  │           └── [Active View]  — overflow:hidden for all views (content scrolls inside right panel only)
  ├── AlertPanel           (fixed right drawer)
  └── PlaybackScrubber     (floating bottom, visible in playback mode only)
```

**State held in App:**
- `view: ViewMode` — active tab (passed to HeaderStrip → ViewSwitcher)
- `batchId: string` — selected compliance batch (single selector in HeaderStrip only)
- `alertOpen: boolean` — alert drawer open
- All telemetry via `useSimulatedTelemetry()`

---

## Key Components Detail

### `MapBase` (`src/components/map/MapBase.tsx`)
- **Wraps:** `react-map-gl` v8 with MapLibre GL JS adapter
- **Map id:** `"aetherField"` — overlay components access it via `useMap().aetherField`
- **Style:** MapTiler Dataviz Dark (`VITE_MAPTILER_KEY`) or CARTO Dark fallback (no key)
- **Terrain:** MapTiler terrain-rgb-v2 DEM, exaggeration 1.4x (applied on `map.load`)
- **Controls:** `NavigationControl` (zoom+compass), dark-themed via `index.css` overrides
- **Interaction props:** `interactiveLayerIds`, `cursor`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onClick` — all passed through to `<Map>`. This is the single entry point for all map node interaction; overlay components never bind imperative events
- **Initial view:** `longitude: -46.585, latitude: -21.815, zoom: 12.05, pitch: 40, bearing: -8`

### `PlantOverlay` (`src/components/map/PlantOverlay.tsx`)
- **Props:** `{ plant, env, hoveredNodeId, selectedNodeId }` — pure rendering, no interaction logic
- **Geometry source:** `src/data/geojson/plant-nodes.geojson` + `plant-edges.geojson`
- **Render path:** native MapLibre `Source` / `Layer` stack (no SVG projection math)
- **Styling:** telemetry maps each node to a live `status`, `metric`, `fillColor`, and `statusColor`; linework is split into process / monitor / risk variants
- **Exports:** `PLANT_NODE_LAYER_ID`, `toPlantNodeDetail()` — used by FieldView to wire interaction
- **Interaction:** none — hover/click state is driven by FieldView → MapBase via react-map-gl's `interactiveLayerIds`

### `HydroOverlay` (`src/components/map/HydroOverlay.tsx`)
- **Props:** `{ env, hoveredNodeId, selectedNodeId }` — pure rendering, no interaction logic
- **Geometry source:** `src/data/geojson/hydro-nodes.geojson`, `hydro-rivers.geojson`, `hydro-springs.geojson`
- **Render path:** native MapLibre `Source` / `Layer` stack for rivers, groundwater lines, springs, monitoring nodes, and the UDC zone
- **Styling:** piezometer colors and labels come from `env.aquifer.sensors`; UDC zone size/intensity derives from `radiation_usv_h`; representative spring points reflect live Active/Reduced/Suppressed states
- **Exports:** `HYDRO_NODE_LAYER_ID`, `toHydroNodeDetail()` — used by FieldView to wire interaction
- **Interaction:** none — hover/click state is driven by FieldView → MapBase via react-map-gl's `interactiveLayerIds`

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
drift(value, variance, min, max)   // bounded random walk
generatePlantTelemetry(prev)       // realistic plant drift
generateEnvTelemetry(prev)         // realistic env drift
calculateEsgScore(plant, env)      // weighted composite 0-100
detectAlerts(plant, env, existing) // threshold breach alerts
```

### Playback Mode
- Toggle in header (Live / ⏮ Playback)
- `PlaybackScrubber` floats at bottom when in playback mode
- Steps through `batch.molecular_timeline` array
- Pauses telemetry generation

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

- **MapTiler API key required** — without a key in `.env`, the map falls back to CARTO Dark Matter (no terrain, but still functional). Get a free key at [maptiler.com](https://maptiler.com).
- **Tile loading behind sandbox** — dev tiles require full network access. The map works normally outside the Cursor sandbox (normal `npm run dev`).
- GeoJSON assets are still approximate demo geometry. Replace with surveyed mine, hydrology, and compliance geometries before production. All 7 deposits and environmental polygons are now wired and rendering.
- Chunk size warning in build — bundle ~800KB+ (maplibre-gl adds ~200KB). Use `React.lazy()` + code splitting before production.
- All map coordinates are approximate (within ~500m). Replace with verified surveyed coordinates from MEI data room for production.
- GeoJSON files are fetched as static assets at runtime. If these overlays ever need offline packaging or tenant-specific geometry, move them behind a proper data loader / API.

---

## Open / Future Features

| Feature | Priority | Notes |
|---|---|---|
| Real backend / WebSocket feed | High | Replace `useSimulatedTelemetry` with real IIoT stream |
| MapTiler custom style | Medium | Build a bespoke Aether style in MapTiler Studio matching exactly W.canvas palette |
| Satellite toggle | Medium | Add map style switcher (dark vector ↔ satellite+labels) in map header |
| PDF export polish | Medium | Currently `window.print()`; replace with `jsPDF` or Puppeteer |
| Multi-tenancy / auth | High | Add Clerk or Supabase Auth before client handoff |
| Localization (i18n) | Low | EN/PT toggle was deliberately removed; re-add via a proper i18n library if needed |
| Mobile layout | Low | Currently optimized for 1440px+; 16:9 pitch screens |
| Expand test coverage | Low | Vitest + RTL infrastructure in place; 65 tests across 9 files covering data layer, UI primitives, and hooks. Expand to views and map overlays. |
| Node detail drawer | Medium | Clicking a map node opens a right-side detail drawer with full sensor history |
| Overlay throttle optimization | Low | Throttle `tick` updates with `requestAnimationFrame` for smoother panning |

---

## Chat History Reference

| Chat | Summary |
|---|---|
| [Aether OS V1 Build](9219c628-d567-478d-ad0b-a34fb10726d9) | Full Phase 1–7 build: project scaffold, design system, all 4 views, ESG score, alert system, playback mode, PDF export, blockchain timeline, green premium card |
| [SVG Maps + UI Polish](f2e5e3b2-0000-0000-0000-000000000000) | Operator view redesigned as Control Panel with CaldeiraSiteMap (geo SVG, hex nodes, animated flow, zoom/pan). Regulator view redesigned with HydroTwinMap (same geo, hydrology features). UI/UX review pass: map centering, legend compacted, scan lines removed, executive title clipping fixed, full-height layouts across all views. |
| [MapLibre Merge + Cleanup](07a2c9a7-3a9a-4ffb-bdb0-f5fb945a03c6) | Merged Operator + Regulator into single `FieldView` powered by MapLibre GL JS (react-map-gl v8). `PlantOverlay` and `HydroOverlay` SVG components project lat/lng to screen via `useMap().project()`, recomputed on map move events via `tick` state. Two right-panel tabs (Control Panel / Environment) switch both the active overlay and panel data. Fixed SVG rendering bug: removed `viewBox`/`preserveAspectRatio` so SVG coordinate space matches CSS pixels directly. Removed PT/EN language toggle and all related state/LABELS from `FieldView`. Deleted `OperatorView.tsx` and `RegulatorView.tsx`. ViewSwitcher reduced to 3 tabs. `ViewMode` 'regulator' removed from types. MapTiler Dataviz Dark style + terrain DEM. Dark-themed `NavigationControl` via CSS overrides. |
| Map Interaction Fix + Cleanup | Removed redundant HTML hit-target button system from both overlays. Deleted 4 dead files: `CaldeiraSiteMap.tsx`, `HydroTwinMap.tsx`, `DigitalTwinMap.tsx`, `flowVisual.ts`. Fixed `PlaybackScrubber` to accept actual batch timeline step labels. |
| Interaction Architecture Refactor | **Redesigned map interaction from scratch using react-map-gl's official `interactiveLayerIds` API.** Previous approach (imperative `map.on()` inside overlays, `motion.div` wrappers, projected HTML hit-targets) was structurally broken by DOM layering. New architecture: `MapBase` accepts `interactiveLayerIds`, `cursor`, and event callbacks (`onMouseEnter`/`onMouseLeave`/`onClick`), passing them directly to `<Map>`. `FieldView` lifts all interaction state (`hoveredNodeId`, `selectedPlantNode`, `selectedHydroNode`) and wires callbacks to `MapBase`. `PlantOverlay` and `HydroOverlay` are now pure rendering components — they accept `hoveredNodeId`/`selectedNodeId` as props and render layers + tooltip, with zero event-binding code. Removed `AnimatePresence`/`motion.div` wrappers from the map overlay area (they were invisible for canvas layers and caused the event-blocking). Exports: each overlay exports its layer ID constant and a `toNodeDetail()` helper. Build passes, 0 TS/lint errors. |

---

*Last updated: 2026-04-06 — session: Pitch-Ready Refactor*
| Navbar consolidation + phrase cleanup | Removed "Caldeira is not geology-constrained. It is trust-constrained." from ExecutiveView heading, mockData, HeaderStrip pill, and BuyerView description. Removed duplicate batch selector from BuyerView (canonical selector stays in HeaderStrip). Merged ViewSwitcher into HeaderStrip — entire nav now resolves in a single 56px row: logo | ViewSwitcher tabs | sim toggle + batch + ESG + alerts. Removed standalone view-switcher-bar div from App.tsx. |
| Geographic Data Integration | Added 5 new GeoJSON files: caldeira-deposits (5 deposit polygons with grade/tonnage/status from PFS), caldeira-licenses (3 licence group polygons: Southern LP approved Dec 2025, Acquired South 49 km², Northern 80 km²), caldeira-drillholes (~32 collar points with TREO/MREO/depth from published ASX announcements — including AGOAC0107 @ 19,183 ppm), caldeira-infrastructure (pilot plant, office, CEMIG, access roads, Santos port + full export route), caldeira-environmental (APA Pedra Branca + 3 km buffer zone + water monitoring zone). Added PolygonGeometry to geojson.ts. Extended MapBase with id and initialViewState props; exported FIELD/BUYER/EXEC_VIEW_STATE constants. Built 4 new overlay components: DepositOverlay (grade fill + status outline + resource labels + hover glow), LicenseOverlay (status fill + status outline + labels), DrillHoleOverlay (TREO colour ramp + depth-radius circles + hole labels at zoom 13+), InfraOverlay (pilot plant pulse, roads, supply route). Added DEPOSIT_DATA array to mockData.ts. FieldView expanded to 4 tabs (Operations / Geology / Licenses / Environment): Geology shows DepositOverlay + DrillHoleOverlay + click-to-select deposit resource cards; Licenses shows LicenseOverlay + click-to-select zone cards; Operations and Environment unchanged. BuyerView gains 220px supply-chain map hero (origin deposit highlighted + full Santos route) above TradeTech content. ExecutiveView headline replaced with split layout — left 58% MapLibre execField showing all deposits + licences + infra, right 42% headline text + ESG ring + status chips. 0 TypeScript errors. |
| Map fixes + Hydro Twin restore | Fixed three regressions from the geographic integration session. (1) **Black page on TradeTech/Board Options**: root cause was `react-map-gl` v8 requiring a `<MapProvider>` wrapper when multiple `<Map>` instances exist across views — added `MapProvider` import and wrap in `App.tsx`. (2) **ReferenceError: aetherField is not defined at TerrainLoader line 86**: the `useEffect` dependency array was not updated when TerrainLoader was refactored to use `mapRef` — changed `[aetherField, maptilerKey]` to `[mapRef, maptilerKey]`. (3) **Map perspective removed**: set `pitch: 0, bearing: 0` on `FIELD_VIEW_STATE` and `EXEC_VIEW_STATE` in MapBase.tsx for flat top-down view across all instances. (4) **Hydro Digital Twin label restored**: renamed the 4th FieldView tab from "Environment" to "Hydro Twin" and updated header overlay text to "Hydro Digital Twin → cumulative aquifer + spring model → LI defense"; also updated the active-asset hint for that tab. 0 TypeScript errors. |
|| [Code Review & Refactor](81706a0d-0810-4587-974a-595f48aa5f1a) | Comprehensive code review and refactoring session. **UI fix**: widened FieldView right panel from 244px to 300px and compacted tab button styling to fix Hydro Digital Twin button overflow. **Design system**: replaced all hardcoded hex colors with `W` design tokens across 16+ components (StatusChip, MetricDisplay, GlowingIcon, CountdownTimer, EsgScoreRing, GreenPremiumCard, BlockchainTimeline, GaugeChart, BarComparison, AlertPanel, HeaderStrip, ViewSwitcher, BuyerView, ExecutiveView). **Component splitting**: decomposed monolithic FieldView.tsx (1024 lines) into 4 tab-specific sub-components (`OperationsPanel`, `GeologyPanel`, `LicensesPanel`, `EnvironmentPanel`) in `src/views/field/` with shared `constants.ts`. **Performance**: added `React.memo` to pure components, `useMemo` for derived data, `useCallback` for event handlers. **Cleanup**: deleted unused files (App.css, index.css, useViewModeTransition.ts, vite.svg, react.svg). **Testing**: added Vitest + @testing-library/react + happy-dom infrastructure; wrote 65 tests across 9 files covering mockGenerator, canvasTheme tokens, GlassCard, StatusChip, MetricDisplay, CountdownTimer, GlowingIcon, EsgScoreRing, and useSimulatedTelemetry hook. 0 TypeScript errors. |
|| [Pitch-Ready Refactor](067aced3-574f-4d8a-b68d-58157bf70f92) | Comprehensive pitch-readiness refactor implementing 14-task plan. **Phase 1 — Geolocation Enrichment:** Added Cupim Vermelho Norte (2,600×5,000m, 340 Mt) and Dona Maria 1&2 (500×4,800m, 226 Mt) deposit polygons to GeoJSON + DEPOSIT_DATA. Added 5 exploration drill results outside resource boundary (CVSDD001 8,912 ppm, BDPDD001 3,939 ppm, CRDD001/002, CDMDD003). Created EnvironmentalOverlay.tsx wiring orphaned caldeira-environmental.geojson (APA Pedra Branca + 3km buffer + water monitoring zone) into Hydro Twin and Executive views. Created NeighborOverlay.tsx + caldeira-neighbors.geojson for Axel REE Caldas Project (232 km²) district-scale context in Geology tab. **Phase 2 — Data Accuracy:** Updated PROJECT_FINANCIALS with pre-tax/post-tax NPV/IRR ranges (pre-tax $821M–$1,985M, post-tax $488M–$1,256M, IRR 21–39%), mine life 20yr, throughput 6.0 Mtpa, LOM TREO 271,687t, EXIM $350M + EFA A$70M funding. Updated Soberbo from 68 Mt to 229 Mt @ 2,601 ppm. Fixed BuyerView BATCH_DEPOSIT_MAP keys to match actual BATCHES IDs. Added PILOT_PLANT_PERFORMANCE (Nd 70%/Pr 71%/Tb 61%/Dy 56%, 2.0 kg/day nameplate, 32.7% MREO), U_TH_SAFETY (bastnaesite, no U/Th at pH 4.0), PROJECT_TIMELINE (LP Dec 2025 → First Production 2028), RESOURCE_CLASSIFICATION (1.5 Bt global, 666 Mt M&I, 37 Mt Measured, 7 deposits). **Phase 3 — View Enhancements:** GeologyPanel enriched with BarComparison resource waterfall + exploration highlights section. OperationsPanel gets pilot vs ANSTO recovery BarComparison. ExecutiveView Financials tab expanded with funding & milestones timeline, resource classification waterfall, pre/post-tax NPV/IRR ranges. ExecutiveView Readiness tab gets GaugeChart trio (Funding 94%, DFS Progress, LP Status). BuyerView Compliance tab gets U/Th radioactivity safety card. BuyerView Supply Chain tab gets Strategic Backing section (EXIM + EFA funding). **Phase 4:** 0 TypeScript errors, 65 tests pass, HANDOFF.md updated. |
|| View Consistency Refactor | Redesigned BuyerView (TradeTech) and ExecutiveView (Board Options) to match FieldView's layout pattern: map-left + tabbed right panel + bottom KPI strip. **BuyerView**: supply-chain MapLibre hero (zoom 7.5, origin highlight + Santos route) fills the left side; 400px right panel with 3 tabs (Compliance, Supply Chain, Batch Ledger); countdown strip (DoD NDAA + EU DBP) pinned below tabs; 5-tile bottom KPI strip (FEOC/IRA/carbon/premium/batch). **ExecutiveView**: overview MapLibre hero (zoom 10.8, deposits + licences + infra) fills the left side; 400px right panel with 3 tabs (Financials, Readiness, Strategy); headline card with gradient title pinned below tabs; 5-tile bottom KPI strip (NPV/IRR/CAPEX/ESG/payback). **App.tsx**: all three view wrappers now use `overflow: 'hidden'` (scrolling is isolated to right panel content area). All views now share the same visual pattern: top bar → flex-row (map hero + bottom strip | tabbed right panel). 0 TypeScript errors, 65 tests pass. |
