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
| **Brand Strategy or Pitch Materials** | `docs/messaging-strategy.md` |
| **Core Personas (Founders/Advisors)** | `docs/personas/core-personas.md` |
| **Stakeholder Feedback** | `docs/personas/current-evaluation.md` and `docs/personas/stakeholders.md` |
| **Design Tokens and Styling** | `docs/STYLING.md` |
| **Historical Session Logs** | `docs/archive/session-history.md` (only if necessary) |
| **Data Sources & GeoJSON** | `docs/data/caldeira/DATA_SOURCES.md` |

## Current Status & Sprint Focus

*   **Focus:** Advisors onboarding sprint complete. Founders pitch (Juliano & Guilherme) ready for Apr 13. Meteoric pitch (Dr. Carvalho & Dr. Tunks) targeted for Apr 16.
*   **Recent Changes:**
    - Onboarded **Milca Neves Tavares** and **Alexandre Quevedo** (Mil Caminhos) as ESG/HRDD advisors across all surfaces: website, Founders Deck, Meteoric Deck, personas.
    - Created unified `TeamMember` interface and shared `TEAM` roster in `src/config/marketing.ts` — single source of truth for 6 team members across 4 surfaces.
    - Deleted Investors Deck entirely (`src/pages/decks/investors/`, route, references). Only Founders + Meteoric decks remain.
    - Removed Thiago A. from all active docs (core-personas.md, VALUATION.md). Archives untouched.
    - Consolidated persona docs: fixed Aether->Vero title, standardized Caponi to "Scientific Advisor", updated team config and advisor collaboration table.
    - Fixed stale stats: "27 AI tools" -> 31, hardcoded values replaced with `MARKETING_COPY` constants in BookendSlides/CloseSlide.
    - Updated RiskSlide from "Solo founder risk" to "Key-person risk" with advisory bench mitigation.
    - Added ESG lane to WhyINeedYouSlide (LANES + CANNOT_ITEMS).
*   **Next Steps:**
    - Visual smoke test across Platform, Decks, and Reports before Apr 13 send.
    - Draft and send Founders pitch email to Juliano & Guilherme.
    - Small improvements sprint (user-led) across all pages.
    - Prepare Meteoric pitch for Apr 16 send.

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
