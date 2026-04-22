# Frontend Architecture & Views

## UI Architecture & Paradigms

Two surfaces, each with its own owner:

1. **App workspace (`/app/*`):** Standalone, full-bleed single-map product surface rendered directly by `src/pages/unit/UnitPage.tsx`. Lens switching (Field / Compliance / Environmental / Executive / Buyer Room / Everything) happens in-page via `UnitChrome` + `useLens()` — no URL-backed scene tabs. The unit-backed right-side `UnitInspector` slides in on unit click. This is the canonical product surface.
2. **Shared experience runtime (`src/experience/*`):** Decks-only. `PresentationShell` resolves `/deck/*` routes and the public marketing paths (`/deck/home|business|tech|trust`) into a shared `ExperienceManifest`:
   - **`horizontalSlides`** — pitch decks (Founders, Meteoric) and public marketing deck variants with hash deep links (`#slide-id`), rendered through `HorizontalSlidesRenderer`. Top chrome can show **`showPublicDeckNav`** (four route pills) plus in-deck slide progress.

Marketing pages at `/`, `/business`, `/tech`, `/trust` render standalone snap-scroll components (`LandingPage`, `BusinessPage`, `TechPage`, `TrustCenterPage`) and no longer import from `components/deck` or `experience/*`. Syntax primitives are shared via `src/components/presentation/` so decks and marketing can consume them without cross-coupling.

The `/app` workspace is intentionally outside `PresentationShell`. The `DataModeBanner`, `AlertPanel`, and `VeroChat` drawers currently only render for deck manifests; re-inheriting them for `/app` is an open decision tracked in `AGENT.md`.

Core runtime files:

- `src/experience/types.ts`
- `src/experience/routeModel.ts`
- `src/experience/manifestRegistry.tsx`
- `src/experience/PresentationShell.tsx`
- `src/experience/renderers/*`
- `src/experience/map/OptionalMapLayer.tsx`

*Rule: new major surfaces should plug into the shared experience runtime. Do not introduce a fourth route-owned shell.*

## Workspace (`/app`)

The `/app` surface is a single full-bleed `MapBase` instance (`veroUnit`) rendered by `src/pages/unit/UnitPage.tsx`. It uses `useLens()` to switch between Field, Compliance, Environmental, Executive, Buyer Room, and Everything lenses. `UnitMarkers` renders the unit graph as a GeoJSON circle layer and hover/click is brokered by the still-active `src/views/field/useMapInteraction.ts` hook (which survived the legacy-view cleanup because it's the only remaining consumer of `FieldMapGeoSelection`, `LicenseDetail`, and the shared layer store).

- **Layer catalog:** manifest-driven via `shared/sites/caldeiraLayers.ts`; rendered by `layerRuntime.tsx` and toggled through `MapLayerPanel`.
- **Overlays:** `CaldeiraBoundary` · `DrillHoleOverlay` · `OpsPlantSitesOverlay` · `PfsEngineeringOverlay` · `HydroOverlay` · `EnvironmentalOverlay`.
- **Inspector:** `UnitInspector` slides in on unit click; populated through `AetherDataService.getUnit*` and the unit graph.
- **Registry:** `docs/data/caldeira/DATA_SOURCES.md` indexes datasets; `src/data/geojson/geoJsonSchema.test.ts` guards key schemas.

## Decks And Site

- **Decks (`/deck/founders`, `/deck/meteoric`):** Slide modules are rendered through `PresentationShell` + `HorizontalSlidesRenderer`.
- **Public marketing:** `/`, `/business`, `/tech`, `/trust` render standalone snap-scroll pages. The matching `/deck/home|business|tech|trust` paths expose the same slide content in immersive horizontal mode.

## Key Components Detail

### `MapBase` (`src/components/map/MapBase.tsx`)
- **Wraps:** `react-map-gl` v8 with MapLibre GL JS adapter
- **Map id:** `"aetherField"` — overlay components access it via `useMap().aetherField`
- **Style selector (3 modes):** `MapStylePicker` lives in the shared right-center floating control column. Styles: Satellite (default), Operations (dataviz-dark), Topography (topo-v2). Selected style persisted in `localStorage` (`vero-map-style`).
- **Terrain:** MapTiler terrain-rgb-v2 DEM, exaggeration 1.4x (applied on `map.load`)
- **Controls:** Custom `MapNavigationControl` (zoom+compass), `ResetCameraButton`, bookmark trigger, layer panel, and basemap picker in one right-center stack.
- **Interaction props:** `interactiveLayerIds`, `cursor`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onClick` — all passed through to `<Map>`.
- **Initial field view:** `CALDEIRA_VIEW_STATE` is derived from `shared/sites/caldeira.ts` → `CALDEIRA_GEO` (`center: [-46.57290021799997, -21.895454154846426]`, `zoom: 8.5`, `pitch: 0`, `bearing: 0`).
- **`highlightWater` prop:** When `true`, the internal `StyleController` recolours base-map water features.
- **`StyleController`:** Accepts `activeStyleId` and handles terrain loading.

### Workspace Chrome Contract

- **Ownership:** `PresentationShell` owns the floating chat shell and injects the workspace chrome CSS variables. `MapBase` owns in-map controls only.
- **Layout:** The chat remains viewport-fixed at bottom-center. `MapControlStack` owns map slots such as `rightCenter`, `topLeft`, and `bottomRight`; workspace maps reserve bottom clearance so lower HUD content does not drift into the chat band.
- **Slot naming:** Workspace views should use `rightCenterPrimary` / `rightCenterSecondary` when injecting bookmark or layer controls. Legacy `topRight*` names are compatibility aliases only.
- **Stacking:** Chat, control popovers, and map HUD follow the shared z-index contract from `src/components/map/mapStacking.ts` plus the workspace CSS vars from `src/components/map/mapControlStyles.ts`.
- **Chat behavior:** `VeroChat` keeps sticky autoscroll only while the user is near the bottom, grows the composer to fit longer prompts, and surfaces upload / map-command failures inline.
- **Map commands:** Chat emits targeted `mapAction` commands toward the active workspace map (`aetherField` or `buyerField`). `useMapCommands` validates them at the scene boundary and publishes user-visible errors for unsupported commands.

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

## Map Layer Contract

The Caldeira map stack is manifest-driven. Treat these files as one contract, not isolated edits:

1. `shared/sites/caldeiraLayers.ts` — canonical layer ids, groups, bindings, and external metadata
2. `src/components/map/layerRegistry.ts` — UI-facing layer catalog derived from the manifest
3. `src/components/map/layerRuntime.tsx` — runtime renderer and interactive ids for every `LayerId`
4. `src/components/map/mapPresets.ts` — surface defaults using concrete `layerIds`
5. `src/components/map/useMapLayers.ts` and `src/components/map/sharedLayerStore.ts` — local vs shared-store state wiring (the thin `src/views/field/fieldMapLayers.ts` type re-export is retained solely for `useMapInteraction`)
6. `src/components/map/__tests__/overlayContracts.test.ts` and `src/components/map/useMapLayers.test.tsx` — regression coverage

Checklist for any new or renamed layer:

- Update the manifest first.
- Confirm `LAYER_RUNTIMES` covers the new `LayerId`.
- Update presets or shared-store bindings if the layer is user-toggleable.
- Update snapshot/external wiring if the layer is not component-backed.
- Run `npm run test:run` and `npm run build` before push.

## Foundation Regression Checklist

- Verify the floating chat stays bottom-center and does not overlap the right-center control column on standard desktop and narrow mobile viewports.
- Verify bottom-right workspace HUD content still clears the reserved bottom band.
- Verify chat scroll does not yank the transcript downward when the user scrolls up during streaming.
- Verify file-upload failures and unsupported map commands appear inline in the chat surface.
- Verify chat-issued map commands only affect the active workspace scene (`aetherField` vs `buyerField`).

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

### Unit Model Frontend

The unit model adds a parallel data layer to the frontend:

- **`AetherDataService` extension:** 10 new methods (`getUnits`, `getUnit`, `getUnitByPlace`, `getUnitStats`, `getUnitTypes`, `transitionUnit`, `getUnitTransitions`, `getUnitEvidence`, `getUnitEdges`, `getUnitConsequences`) implemented in both mock and live services.
- **Lens system:** `src/units/lensRegistry.ts` defines 6 preset lenses (Field, Compliance, Environmental, Executive, Buyer Room, Everything). `useLens()` hook manages active lens, type toggles, and severity filters with URL hash persistence.
- **Workspace components:** `LensBar` (lens + type + severity selectors), `KpiStrip` (aggregated stats from `getUnitStats()`).
- **Map integration:** `UnitMarkers` renders units as a GeoJSON circle layer via MapLibre. `useUnitLookup` resolves map features to units.
- **Inspector:** `UnitInspector` is a generic, type-driven panel with 7 section types (fields, timeline, evidence, graph, telemetry, children, risks) + `TransitionDialog` for state changes.
- **Bundles:** `BundleExporter` modal generates, verifies, and downloads evidence bundles.