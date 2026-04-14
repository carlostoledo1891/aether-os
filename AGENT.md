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

*   **Focus:** Caldeira maps now support snapshot-first Esri-compatible metadata, identify, legend, and admin catalog flows on top of the manifest-driven runtime.
*   **Recent Changes (Apr 14 2026):**
    - Added external-layer capability metadata in `shared/sites/caldeiraLayers.ts`, routed snapshot/live behaviors through `layerRuntime.tsx`, and added proxied ArcGIS identify plus layer-health/status surfaces.
    - Added `/admin/map-layers`, refactored the external snapshot build script to read shared config, and updated integration/data-source docs for snapshot-first plus proxied identify behavior.
    - Simplified the Founders deck, unified all current team presentations behind `src/components/team/TeamShowcase.tsx`, and extended `PasswordGate` session validity to 30 days.
*   **Next Steps:**
    - Manually smoke-test `FieldView`, `BuyerView`, `FoundersDeck`, `MeteoricDeck`, and the landing page to confirm external-layer interactions and team-card spacing feel right in the browser.
    - If more approved agencies need live identify, extend `server/src/routes/mapLayers.ts` and the shared layer manifest instead of adding one-off frontend logic.

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
