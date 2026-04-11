# Frontend Architecture & Views

## UI Architecture & Paradigms

The frontend is separated into three distinct paradigms, each with a different interaction model:

1. **Platform (Views):** Stateful, data-driven, full-screen map & dashboard applications (`AppShell`, `MapBase`, `FieldView`). Uses global layout and navigation.
2. **Decks (Slides):** Horizontal pagination, keyboard-navigable, fixed-aspect-ratio presentations (`DeckRunner`, `Slide`, `FoundersDeck`). Reports and Mini-Dashboards also use fixed layouts but without pagination.
3. **Pages (Marketing):** Vertical scrolling, SEO-friendly, responsive text-heavy websites (`LandingPage`, `TechPage`, `BusinessPage`, `MarketingPrimitives`). Enforces consistent typography and alignment via `<SectionHeader />`.

*Rule: Do not mix paradigms. Pages use scrolling sections; Views use absolute positioned flex/grid layouts; Decks use fixed slide bounds.*

## Three Main Views

### 1. Field Operations View (`FieldView.tsx`) — License-to-Operate command center
**Layout:** Column → [flex row: MapLibre hero + bottom KPI strip | 300px right panel]

- **Hero:** `MapBase` (react-map-gl + MapLibre, 3-style picker defaulting to Satellite, pitch 0°, terrain DEM). Clean map canvas — no title scrims, hover hints, or footnotes overlaying the map. Passes `highlightWater={mapTab === 'environment'}` for Hydro Twin.
- **Map tabs (2):** **Operations** | **Hydro Twin** (`MapTab` in `field/constants.ts`). Deposit/licence **cards** (not map pickers) live under **ExecutiveView → Assets** (`GeologyPanel`, `LicensesPanel`).
- **Map overlays (tab-driven + `fieldMapLayers` / `DEFAULT_FIELD_OPS_LAYERS`):**
  - **Operations (defaults):** `CaldeiraBoundary` · optional `LicenceEnvelopeOverlay` · `LicenseOverlay` · `PfsEngineeringOverlay` · `AccessRoutesOverlay` · `DrillHoleOverlay` · `OpsPlantSitesOverlay` · optional `InfraOverlay` · optional `PlantOverlay` (schematic). **Terrain-aligned** layers on by default.
  - **Hydro Twin:** `CaldeiraBoundary` + `EnvironmentalOverlay` (APA, buffer, monitoring, urban centroid, UDC — each gated by `envMapLayers`) + `HydroOverlay` — ~1,092 springs, piezometers; optional **Open-Meteo** precip via `useSiteWeather` when `VITE_WEATHER_ENABLED=1`.
- **Right panel:** `TabSwitcher` → **`FieldPinnedAssetCard`** (plant/hydro node pin) → **`FieldMapGeoInspector`** (GeoJSON click selection) → `OperationsPanel` or `EnvironmentPanel` (includes **`MonitoringNetworkCard`** + always-visible **Community & Stakeholder Notice** disclaimer card).
- **Bottom strip:** **`FieldBottomMetrics`** — five KPI tiles (operations vs hydro scenario metrics).
- **Interactivity:** `FieldView` owns hover/click; `interactiveLayerIds` + `pickFeatureByPriority` for licences, drills, PFS, plant sites, infra, routes, envelope, env polygons, springs/nodes.
- **Registry:** `docs/data/caldeira/DATA_SOURCES.md` indexes datasets; `src/data/geojson/geoJsonSchema.test.ts` guards key schemas.

### 2. Buyer View (`BuyerView.tsx`) — TradeTech & Compliance-as-a-Service
**Layout:** Column → [top bar] + [flex row: MapLibre supply-chain hero | right panel (400px)]

- **Hero:** `MapBase` (buyerField, `CALDEIRA_VIEW_STATE`) showing Caldeira site with trace route overlay, origin license highlight. Clean map canvas. Map markers sync with blockchain timeline steps.
- **Right panel (400px, 2 tabs: Compliance | Traceability):**
  - **Compliance** — FEOC ring gauge (0.00%), IRA/EU DBP status chips, carbon intensity bar, trust controls, **U/Th radioactivity safety profile**, green premium, **defense-grade cybersecurity pillars**, **competitive benchmarks**.
  - **Traceability** — Batch selector dropdown + molecular-to-magnet blockchain timeline, upstream **Scope 3 reagent provenance**, digital passport issuance, API handoff layer.
- **Timeline ↔ Map interactivity:** Clicking a timeline step highlights the corresponding map marker; clicking a map marker highlights the corresponding trace step.
- **Countdown strip** — DoD NDAA and EU DBP countdowns pinned below tabs

### 3. Executive View (`ExecutiveView.tsx`) — Board decision screen
**Layout:** Full-width tabbed dashboard (no map — focuses entirely on data and metrics)

- **Default tab:** Assets (on load)
- **9 tabs:** Assets | Financials | Risk | Pipeline | Capital | DFS | **Agencies** (permits / MPF–FEAM–IBAMA matrix, `getSpatialInsights` card, MPF thread, monitoring annex, exports) | Audit | ESG

## Key Components Detail

### `MapBase` (`src/components/map/MapBase.tsx`)
- **Wraps:** `react-map-gl` v8 with MapLibre GL JS adapter
- **Map id:** `"aetherField"` — overlay components access it via `useMap().aetherField`
- **Style selector (3 modes):** `MapStylePicker` floating pill (bottom-left). Styles: Satellite (default), Operations (dataviz-dark), Topography (topo-v2). Selected style persisted in `localStorage` (`vero-map-style`).
- **Terrain:** MapTiler terrain-rgb-v2 DEM, exaggeration 1.4x (applied on `map.load`)
- **Controls:** `NavigationControl` (zoom+compass), dark-themed via `index.css` overrides
- **Interaction props:** `interactiveLayerIds`, `cursor`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onClick` — all passed through to `<Map>`.
- **Initial field view:** `CALDEIRA_VIEW_STATE` — `longitude: -46.555, latitude: -21.88, zoom: 10.98, pitch: 35, bearing: 0` (shared by all platform map views)
- **`highlightWater` prop:** When `true`, the internal `StyleController` recolours base-map water features.
- **`StyleController`:** Accepts `activeStyleId` and handles terrain loading.

### `PlantOverlay` (`src/components/map/PlantOverlay.tsx`)
- **Props:** `{ plant, env, hoveredNodeId, selectedNodeId }` — pure rendering, no interaction logic
- **Geometry source:** `src/data/geojson/plant-nodes.geojson` + `plant-edges.geojson`
- **Render path:** native MapLibre `Source` / `Layer` stack (no SVG projection math)
- **Exports:** `PLANT_NODE_LAYER_ID`, `toPlantNodeDetail()`

### `HydroOverlay` (`src/components/map/HydroOverlay.tsx`)
- **Props:** `{ env, hoveredNodeId, selectedNodeId, weatherStrip? }` — pure rendering
- **Geometry source:** `src/data/geojson/hydro-nodes.geojson`, `hydro-springs.geojson`
- **Render path:** native MapLibre `Source` / `Layer` stack for springs (many clickable points), monitoring nodes, and the UDC zone
- **Exports:** layer IDs and mappers are defined in **`hydroDetailMappers.ts`** / **`hydroLayerIds.ts`**

### `GlassCard`
- Base style: `background: rgba(255,255,255,0.035)`, `backdropFilter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, `borderRadius: 14`
- Glow variants apply `box-shadow` with matching color
- `animate={false}` skips motion.div (use for map containers to avoid re-render)

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
| `W.text1–4` | `#ECECF8 → #6464A0` | Text hierarchy |

### Theme System (Dark + Report Light)

Primary dark mode. The `:root` variables in `theme.css` define the palette.

**Report Light Mode (`WL`)** — a second palette in `src/components/reports/reportTheme.ts` mirrors the `W` token shape with light-mode colors. Used exclusively inside the Report lightbox (portal).

### Domain Colors (SVG maps)

| Domain | Color | Used for |
|---|---|---|
| `extraction` | cyan | Mine blocks |
| `processing` | violet | Leach, Precip, CIP, FJH |
| `compliance` | green | XRF/QA |
| `transport` | violetSoft | Container/Export |
| `monitor` | amber | Piezometers, UDC |
| `external` | border3 | Competitor projects (muted) |