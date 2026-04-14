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
**Node version:** `nvm use` (repo pin: `.nvmrc` -> `22.12.0`)  
**Release check:** `npm run verify:release`

**Marketing / deck copy (iterate in repo):** `docs/messaging-strategy.md` and `src/config/marketing.ts`

## Deployment Model

- **Local:** leave `VITE_API_BASE_URL` / `VITE_WS_URL` empty and use the Vite proxy at `localhost:5175`.
- **Hosted staging/prod:** set `VITE_API_BASE_URL` explicitly per environment; `VITE_WS_URL` is only needed when websockets live on a different origin.
- **Release path:** merge to `staging`, smoke-test the staging deployment, then promote to `main`.
- **Reference doc:** `docs/DEPLOYMENT.md`

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

*   **Focus:** Public demo surfaces are now narrowed to the active decks, with map/runtime stability and cleaner UI chrome prioritized over adding new presentation branches.
*   **Recent Changes (Apr 14 2026):**
    - Shipped the Vercel/deploy hardening pass: Node pinning, explicit Vercel install/build commands, release verification, and map runtime regression coverage; `main` and `staging` were pushed and used as the demo release path.
    - Simplified public team/deck content so Carlos is the only named public team member, advisor references are anonymous, Founders deck slides 17/18 were removed from the active sequence, and only Founders + Meteoric remain as the public deck routes.
    - Removed template-like top card accents, tightened color usage so provenance remains the main colored metadata signal, restored spring hover cards across map surfaces, and eliminated frontend test noise from eager mock GeoJSON fetches.
*   **Next Steps:**
    - Manually smoke-test `LandingPage`, `FieldView`, `BuyerView`, `FoundersDeck`, and `MeteoricDeck` in-browser to confirm spacing, hover cards, and neutral text hierarchy feel right visually.
    - If hydrology needs richer federal context, reuse the existing ANA/SNIRH Hidroweb station pipeline for spring enrichment instead of replacing the MG spring geometry source.
    - Review the remaining local-only edits in `shared/sites/caldeira.ts` and `src/pages/decks/founders/slides/BookendSlides.tsx` before the next commit so they do not drift unnoticed.

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
