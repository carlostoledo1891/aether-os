# Vero — AI Agent Bootstrap

> **Welcome.** Read this file to understand the project at a high level. 
> **Do not read historical archives unless specifically instructed.**
> Follow the Documentation Map below to load context on-demand for your specific task.

---

## Project Overview

**Commercial brand: Vero** (from Latin *verus*, 'true'). Codebase retains `aether-os` as internal name. User-facing strings, copy, and pitch materials use Vero.

**Vero** is a B2B SaaS platform — **the field-operations command center for regulated industries.** *Map every asset. Stream every sensor. Prove every change.*

Its **lead reference deployment** is **Meteoric Resources' Caldeira Project** in Poços de Caldas, Minas Gerais, Brazil (ASX: MEI), a critical-minerals operation. The same product runs on agriculture (paddocks, water, organic certification), defense (AOIs, sensor feeds, audit-chain reporting), and adjacent industrial operations.

**Public positioning (v19, Apr 2026):** Buyer-facing surfaces lead with field-ops + monitoring + evidence. Investor surfaces (Founders Deck, valuation docs) keep the "operational truth layer" / "four primitives" framing. See [`docs/strategy.md`](docs/strategy.md) §0 for full positioning, three pillars, and lead-vs-adjacent vertical map.

The prototype is built to pitch to:
- **Operators** in mining, agriculture, defense, energy/infrastructure, and industrial ops needing field-asset monitoring with verifiable evidence
- **Buyers** (DoD, EV OEMs, magnet manufacturers, food OEMs) needing FEOC-clean, traceable, audit-backed supply
- **Regulators** (MPF, FEAM, IBAMA, FDA-style oversight bodies) needing real-time monitoring with provenance labels
- **Executives & Boards** needing a pitch-ready financial / ESG / operational overview from the same runtime

## How to Run

**Dev server:** `http://localhost:5175/` (frontend via Vite proxy → API at `:3001`)  
**Working directory:** `/Users/carlostoledo/Documents/Aether Project/aether-os`  
**Start all:** `npm run dev:all` (concurrently: API server + simulation engine + Vite frontend)  
**Node version:** `nvm use` (repo pin: `.nvmrc` -> `22.12.0`)  
**Release check:** `npm run verify:release`

**Marketing / deck copy (iterate in repo):** `docs/messaging-strategy.md` and `src/config/marketing.ts`

## Out of Scope — Not Part of This Project

The word "unit" in this repo refers **only** to the first-party Vero unit model (`src/components/units/*`, `server/src/store/unitStore.ts`, `shared/units/types.ts`, the workspace inspector flow). It is **not** related to the third-party visual programming project:

- `samuelmtimbo/unit` (GitHub) / `@_unit/unit` / `unit.software` / `unit.land` / `unit.tools` / `unit.moe` — not a dependency. Do not add it back. `scripts/check-deploy-config.mjs` fails the release gate if these tokens reappear in `package.json`.

## Deployment Model

- **Local:** leave `VITE_API_BASE_URL` / `VITE_WS_URL` empty and use the Vite proxy at `localhost:5175`.
- **Hosted production:** set `VITE_API_BASE_URL` explicitly to the production API; `VITE_WS_URL` is only needed when websockets live on a different origin.
- **Release path:** push releasable work to `main`, then run the prod-only rollout helper.
- **Reference doc:** `docs/DEPLOYMENT.md`
- **One-command rollout helper:** `npm run update:all` (see `docs/UPDATE_ALL.md`)

### Canonical Environment Matrix

| Environment | Frontend origin | Backend origin | Notes |
|-------------|------------------|----------------|-------|
| Local | `http://localhost:5175` | `http://localhost:3001` | Use Vite proxy; keep `VITE_API_BASE_URL` and `VITE_WS_URL` empty. |
| Production | `https://verochain.co` | `https://aether-api-production-295d.up.railway.app` | Keep production domains and secrets isolated from local development. |

### Deployment Parity Done Checklist

- `npm run verify:release` passes locally under repo Node version.
- Vercel production deploy is green for the intended SHA.
- Runtime config confirms expected backend target (`__VERO_RUNTIME_CONFIG__`).
- Hosted production API `/api/health` responds from the expected backend.
- API CORS allows the intended production frontend origin(s).
- Manual smoke passes on `LandingPage`, `/app` (canonical workspace — `UnitPage`), `FoundersDeck`, and `MeteoricDeck`.
- Manual smoke passes on `/verify/<reference-bundle-hash>` — the boot log of a fresh DB prints the canonical hash (also persisted in `docs/REFERENCE_BUNDLE_HASH.txt`). Run the deterministic procedure in `docs/launch/mobile-safari-smoke.md` on a real iPhone running iOS Safari and record the result row before launch. (Wave 1 public verifier — see `.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md`, `.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md`, and `docs/spec/audit-event-v1.md`.)
- Manual smoke passes on `/app/maritime` per the addendum in `docs/launch/mobile-safari-smoke.md` (workspace renders chrome + AOI polygons + animated vessels + dark-vessel ribbon, all four KPI chips populated; `/verify/<maritime-reference-hash>` opens green). Record the addendum result row before announcing the multi-instance shell. *(Multi-Instance Vero Shell + Maritime ISR sprint — week 3.)*

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

- **Completed (Apr 18 2026 — Wave 1 Final Sprint):** All 10 sprint tasks landed. Public verifier `/verify/<hash>` is hardened: `crypto.subtle` capability fallback (`src/pages/verify/cryptoCapability.ts`); deterministic reference hash `c1a32f57…12d1a` committed to `docs/REFERENCE_BUNDLE_HASH.txt` and gated by `server/src/__tests__/referenceBundle.test.ts`; live-mode-only guard (`403 mock_mode_bundle_not_publishable`) on public bundle routes with `data_mode` column (schema v6); anonymous timing telemetry via `POST /api/public/verifier-telemetry` (schema v7) surfacing p50/p95 + outcomes histogram on `/admin/verifier-stats`. Spec governance: CTO named in `docs/spec/README.md`, `docs/spec/CHANGELOG.md` opened at v1.0.0.
- **Completed (Apr 18 2026):** Marketing routes consolidated. `vercel.json` 308s `/business → /` (permanent) and 307s `/tech → /` (90-day temporary); `App.tsx` mirrors the redirect via `<Navigate>` for local/preview parity. `/trust` repointed: `TrustHeroSlide` + Trust CTA now lead with the verifier URL.
- **Completed (Apr 18 2026):** Launch package authored: `docs/launch/wave-1-public-verifier.md` (CTO-owned copy + cross-publish checklist), `docs/launch/screen-recording-runbook.md` (90-second shot list, hosted-mirror table), `docs/launch/mobile-safari-smoke.md` referenced from the deployment-parity checklist. README has a "Verify this build" block. Wave 2 brief at `docs/wave-2-kickoff.md` proposes `/fork/<hash>` with 5 new primitives, `forks/verification` north star, and 8-week kill criterion.
- **Completed (Apr 18 2026 — Multi-Instance Vero Shell + Maritime ISR sprint):** `/app` is now a multi-instance shell. `/app/meteoric` is the byte-identical Caldeira workspace (no behavior change), `/app` is a chrome-only "Pick a use case" landing with a 308 hint for returning Meteoric users, and **`/app/maritime` is a live Atlantic Maritime ISR sibling instance** built on the same primitives (no new graph engine, no new slide types, no new map primitives). `DataServiceProvider` now accepts a per-instance factory; `useLens` accepts per-instance lens sets. Server seeds five new unit types (`maritime_aoi`, `vessel`, `sensor_station`, `incident_alert`, `isr_product`) and a `SITE-MARITIME` reference site. `POST /api/bundles/preset { preset: "maritimeIsr" }` returns a real chain hash anchored at a deterministic seed event (mirrors `ensureReferenceBundle`); the bundle opens green at `/verify/<hash>` with the existing client-side verifier untouched. Founders Deck narrates "two live instances, one runtime" via edits to `PlatformSlide`, `MoatSlide`, `RoadmapSlides`, `CaldeiraSlide` plus a sibling `MaritimeSiblingSlide` built from the existing WhiteBoxSlide template; Meteoric Deck cover/CTA reframed as "your instance of a category-defining platform"; `src/config/marketing.ts` hero copy updated.
- **Next:** Stage the build, run the mobile-Safari smoke procedure on a real iPhone — both for `/verify/<hash>` (Wave 1) and for the new `/app/maritime` workspace (Multi-Instance sprint, see addendum in `docs/launch/mobile-safari-smoke.md`) — capture the 90-second screen recording per the runbook, then publish the launch post on the named cross-publish channels.
- **Open Decision:** When the screen recording is captured — commit `docs/launch/wave-1-verifier.mp4` (≤25MB to keep clones cheap) or rely on a hosted mirror only and link from the runbook's "Hosted mirror" table?
- **Open Decision:** `BusinessPage.tsx` / `TechPage.tsx` source files are still in the tree but no longer routed. Delete them in the next housekeeping pass, or leave them as a 90-day insurance window matching the `/tech` redirect TTL?

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
