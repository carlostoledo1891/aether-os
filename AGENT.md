# Vero — AI Agent Bootstrap

> **Welcome.** Read this file to understand the project at a high level. 
> **Do not read historical archives unless specifically instructed.**
> Follow the Documentation Map below to load context on-demand for your specific task.

---

## Project Overview

**Commercial brand: Vero** (from Latin *verus*, 'true'). Codebase retains `aether-os` as internal name. User-facing strings, copy, and pitch materials use Vero.

**Vero** is a B2B SaaS platform — the trust layer for critical mineral supply chains. Its flagship deployment is **Meteoric Resources' Caldeira Project** in Poços de Caldas, Minas Gerais, Brazil (ASX: MEI).

The prototype is built to pitch to:
- **Buyers** (DoD, EV OEMs, magnet manufacturers) needing FEOC-clean, IRA-compliant supply
- **Regulators** (MPF, FEAM, IBAMA) needing real-time environmental compliance telemetry
- **Operators** (Meteoric Resources, Ucore, Neo Performance Materials) needing plant efficiency visibility
- **Executives** needing a pitch-ready financial / ESG overview

## How to Run

**Dev server:** `http://localhost:5175/` (frontend via Vite proxy → API at `:3001`)  
**Working directory:** `/Users/carlostoledo/Documents/Aether Project/aether-os`  
**Start all:** `npm run dev:all` (concurrently: API server + simulation engine + Vite frontend)  

**Marketing / deck copy (iterate in repo):** `docs/messaging-strategy.md` and `src/config/marketing.ts`

## Documentation Map

To avoid context bloat, read only what you need:

| If you are working on... | Read this file |
|--------------------------|----------------|
| **Overall Architecture & App shell** | `docs/architecture/overview.md` |
| **Data Services, API, Mock vs Live** | `docs/architecture/data-service.md` |
| **Frontend Views, MapLibre, UI Cards** | `docs/architecture/frontend.md` |
| **RBAC Design (scopes, JWT, middleware)** | `docs/architecture/rbac-design.md` |
| **Brand Strategy or Pitch Materials** | `docs/messaging-strategy.md` |
| **Core Personas (Founders/Advisors)** | `docs/personas/core-personas.md` |
| **Stakeholder Feedback** | `docs/personas/current-evaluation.md` and `docs/personas/stakeholders.md` |
| **Design Tokens and Styling** | `docs/STYLING.md` |
| **Historical Session Logs** | `docs/archive/session-history.md` (only if necessary) |
| **Data Sources & GeoJSON** | `docs/data/caldeira/DATA_SOURCES.md` |
| **Security Policy & Disclosure** | `SECURITY.md` |
| **Integration / API Guide** | `docs/INTEGRATION_GUIDE.md` |
| **NIST 800-53 Control Mapping** | `docs/compliance/nist-800-53-mapping.md` |
| **CMMC Level 2 Mapping** | `docs/compliance/cmmc-level2-mapping.md` |
| **Incident Response Plan** | `docs/compliance/incident-response.md` |
| **Data Processing Addendum** | `docs/compliance/data-processing-addendum.md` |
| **SBIR/STTR Readiness** | `docs/compliance/sbir-readiness.md` |

## Current Status & Sprint Focus

*   **Focus:** Map Surface Control sprint complete (8 tasks). Build, TypeScript (0 errors), and 249 tests pass.
*   **Recent Changes (Map Surface Control sprint — Apr 12 2026):**
    - **BuyerView layer isolation:** Switched from shared `useMapLayers()` to local `usePresetLayers('buyer')`. Layer toggles in FieldView no longer bleed into BuyerView.
    - **Tab-scoped overlay rendering:** `deriveOverlayKeys` now accepts optional `activeGroups` param. FieldView passes ops/env group sets so toggling `cprmGeology` on ops tab doesn't render on env tab (and vice versa).
    - **HUD cards into MapControlStack:** Removed `position: absolute` from `.hudCard` CSS. `PilotPlantCard` and `HydroMonitoringCard` now flow through `controlSlots.topLeft` on every map surface (FieldView, GeologySlide, HydroSlide). No more orphaned absolute-positioned cards.
    - **HydroOverlay purified:** Extracted `.hudColumn` (WQ badge, rain stress badge) and `HydroMonitoringCard` render out of `HydroOverlay.tsx`. The overlay now renders only MapLibre Source/Layer elements and hover tooltips — pure rendering per `map-interactions.mdc` rule.
    - **Deck slides unified:** GeologySlide and HydroSlide info panels + HUD cards moved from standalone absolute-positioned `<div>` blocks into `controlSlots.topLeft`. `MapControlStack.topLeft` gained `maxHeight`/`overflowY` for tall content.
    - **Card visual tokens unified:** Both cards now use `W.overlay88` for background. Removed stale `zIndex` from `HydroMonitoringCard`.
*   **Previous Sprint (Map System Refactor):**
    - Unified layer catalog, consolidated overlay mounting, site-scoped layer config, `ExternalRasterOverlay`, `MapControlStack` with compact mode.
*   **Next Steps:**
    - Visual smoke test all 7 map surfaces to verify zero overlaps.
    - Consider deleting legacy per-service overlay files (`CprmGeologyOverlay.tsx`, `MacrostratOverlay.tsx`, `UsgsReeOverlay.tsx`) once `ExternalRasterOverlay` is validated in production.
    - **API Registry Architecture (deferred):** Design `ApiSourceDef` type + central registry (`shared/apis/registry.ts`) for pluggable external API integration (NOAA, INMET, Open-Meteo, BCB, etc.). Each API declares domains (weather, hydrology, geology, environment, finance) and capabilities (map-raster, time-series, ai-context, enricher). Layer panel, AI context, and prediction panels consume from the registry by domain + capability. Build when the 6th API integration creates the pull.
    - Prepare Meteoric pitch for Apr 16 send.

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
