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
- **One-command rollout helper:** `npm run update:all` (see `docs/UPDATE_ALL.md`)

### Canonical Environment Matrix

| Environment | Frontend origin | Backend origin | Notes |
|-------------|------------------|----------------|-------|
| Local | `http://localhost:5175` | `http://localhost:3001` | Use Vite proxy; keep `VITE_API_BASE_URL` and `VITE_WS_URL` empty. |
| Staging (preview) | `https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app` | `https://aether-api-staging.up.railway.app` | `server` `CORS_ORIGIN` should include staging preview origin. |
| Production | `https://verochain.co` | `https://aether-api-production-295d.up.railway.app` | Keep production domains and secrets isolated from staging. |

### Deployment Parity Done Checklist

- `npm run verify:release` passes locally under repo Node version.
- Vercel deploys for `staging`/preview and `main`/production are green.
- Runtime config confirms expected backend target (`__VERO_RUNTIME_CONFIG__`).
- Hosted API `/api/health` responds from the expected backend.
- API CORS allows the intended frontend origin(s) for each environment.
- Manual smoke passes on `LandingPage`, `FieldView`, `BuyerView`, `FoundersDeck`, and `MeteoricDeck`.

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

*   **Focus:** Chat reliability in production (CORS + auth-key parity) and smoother rollout automation.
*   **Recent Changes (Apr 14 2026):**
    - Hardened `requestGuards` to bypass `OPTIONS` preflight, added chat CORS regression tests, and documented a chat CORS debug checklist in deployment docs.
    - Verified both prod and staging `/api/chat` preflight responses return `204` with correct `Access-Control-Allow-Origin`; no current preflight CORS regression.
    - Added and shipped `npm run update:all` automation with docs and auth-wall-aware staging smoke skip support.
*   **Next Steps:**
    - Confirm `VITE_CHAT_API_KEY` (frontend) and `CHAT_API_KEY` (API) parity for the active production deployment; current browser failure pattern is 401 auth, not missing CORS headers.
    - Manually smoke-test chat send + upload flows on production and staging preview after each rollout.
    - Optionally make `update:all` resilient to dual staging token contexts (primary token fallback) to avoid partial Railway failures.
*   **Open Decisions:**
    - Keep staging CORS preview-only or allow both preview + `aether-os-blond`.
    - Keep mandatory chat API key in production UX or introduce a safer, origin-bound alternative auth pattern.

*(Update this section during session handoffs using the `.cursor/skills/handoff` skill)*
