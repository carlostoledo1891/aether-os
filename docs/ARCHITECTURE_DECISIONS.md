# Vero — Architecture Decision Records

> Key decisions in the Vero codebase with reasoning. Updated alongside major sprints.

---

## 1. No Redux / Zustand / Jotai — Service Layer Pattern

**Decision:** Use `AetherDataService` interface + React Context instead of a dedicated state management library.

**Reasoning:** Vero's data flow is primarily unidirectional: the simulation engine generates telemetry, the API stores it, the frontend reads it via REST/WebSocket. There is no complex client-side state graph that requires normalized stores or atomic updates. The `DataServiceProvider` context + `useServiceQuery` hook provides async-aware data fetching with dedup caching, which covers all current use cases.

**When to revisit:** If the number of API endpoints exceeds ~80, or if multiple components need to write-back to the same server state simultaneously, consider migrating to TanStack Query for server-state management. The `AetherDataService` interface would remain — TanStack Query would wrap it, not replace it.

---

## 2. Inline Styles via W Tokens — Not Anti-Pattern

**Decision:** Allow inline `style={{}}` objects using `W.*` tokens from `canvasTheme.ts`. Document this in `STYLING.md`.

**Reasoning:** Vero's design system has ~107 semantic tokens. Inline styles with these tokens are type-safe (TypeScript catches typos), co-located with the component (no CSS file jumping), and theme-swappable (change `W.violet` in one file, every component updates). At current component tree depth (~3-4 levels), object recreation per render is negligible. The alternative — CSS Modules for every style — would fragment the token system across two languages.

**Guardrails:** Static style objects must be hoisted to module scope in files >300 lines. Raw `rgba`/`#hex` literals are allowed only for MapLibre paint properties or one-off blends with a comment referencing the nearest `W` equivalent. See `STYLING.md` for the full contract.

---

## 3. Three-Process Architecture — Synthetic Data Bridge

**Decision:** Run frontend, API, and simulation engine as three independent processes connected via HTTP/WebSocket.

**Reasoning:** The engine generates telemetry that looks and behaves like real sensor data, posted to real HTTP endpoints. The frontend talks to real REST/WebSocket endpoints. When actual sensor data (LAPOC, SCADA) arrives, the engine's synthetic generators are replaced — no frontend or server changes needed. This architecture makes the "simulated → field-verified" transition a config change, not a rewrite.

**Scaling model:** When Vero serves N clients, the deployment model is: 1 frontend (CDN), 1 API (multi-tenant by project ID or 1 per enterprise client), N engine instances (one per active project generating telemetry). Data isolation comes from the engine and database layer, not the frontend.

---

## 4. Unified Deck Engine — Not Separate Mini Engine + Report System

**Decision:** Consolidate all outbound rendering (pitch decks, public dashboards, reports) into a single Deck Engine with three modes: `slides`, `dashboard`, `report`. Delete the previous JSON-manifest Mini Engine.

**Reasoning:** The Mini Engine (JSON → React via WidgetRegistry, removed in v0.16) had zero real users — the only public dashboard (Prefeitura) bypassed it entirely via a dedicated page component. The report system (ReportViewer + portal + light theme, also removed) was architecturally identical to a single-page deck with `theme: 'light'`. Maintaining three separate rendering patterns for outbound content created complexity without value.

The Deck Engine provides:
- `mode: 'slides'` — keyboard nav, progress bar, slide transitions (pitch decks)
- `mode: 'dashboard'` — single-page scroll, no nav chrome (public dashboards)
- `mode: 'report'` — portal lightbox, light theme, print styles, time range selector

Every improvement to the engine (animations, responsiveness, PDF export, white-labeling) benefits all three use cases. Adding a new deck = adding a manifest + content components, not learning a separate system.

---

## 5. SPA Instead of Next.js / Server Components

**Decision:** Vero is a Vite single-page application, not a Next.js app.

**Reasoning:** Vero is an observability dashboard, not a content website. It has:
- No SEO requirements (behind auth in production)
- No server-side data fetching needs (WebSocket telemetry is client-side by nature)
- No per-page server functions (all data comes via the Fastify API)
- No static generation needs (all data is dynamic)

Next.js would add routing complexity (App Router vs Pages), deployment constraints (requires Node runtime), and bundle overhead without solving any actual problem. The `/lp` marketing page is the only SEO-relevant route, and it works fine as a lazy-loaded SPA page. If SEO becomes critical for marketing, a separate lightweight site (Astro/11ty) for `/lp` is simpler than migrating the entire app.

---

## 6. DeckManifest Type — Three Modes and Future Extensibility

**Decision:** The `DeckManifest` type includes a `mode` field with current values `slides | dashboard | report`, plus optional fields for each mode's specific needs (`portal`, `timeRange`, `printable`).

**Future modes this unblocks:**
- `embedded` — iframe-embeddable deck for partner sites
- `email` — static HTML snapshot for email campaigns
- `kiosk` — auto-advancing dashboard for conference displays

The type is a discriminated union by `mode`, so adding a new mode requires adding a variant — not modifying existing ones.

---

## 7. Tenant Config — Single-File Project Boundary

**Decision:** Create `src/config/tenant.ts` with project-level settings (name, map center, logo, available views) resolved from `VITE_PROJECT_ID` env var. Default: Caldeira.

**Reasoning:** This is NOT multi-tenancy. It is a single config file that prevents hardcoded project references from spreading across the codebase. Every `FIELD_VIEW_STATE` center coordinate, every project name string, every logo reference reads from tenant config. When a second project (e.g., an energy client) is onboarded, the change is: add a new config block to `tenant.ts` and set `VITE_PROJECT_ID=energy-client` in the environment.

**What this is not:** A database-driven tenant system, a runtime tenant switcher, or a multi-tenant API. Those are product decisions for the Growth tier and beyond.

---

## 8. Feature Flags — Environment Variable Based

**Decision:** Create `src/config/features.ts` with boolean flags read from `VITE_FEATURE_*` env vars. Wrap optional features (chat, reports, control room) with flag checks.

**Reasoning:** Enterprise clients need per-deployment feature customization. A database-driven feature flag service (LaunchDarkly, Flagsmith) is premature at current scale. Env vars are:
- Zero-dependency
- Build-time resolved (no runtime latency)
- Deployable per environment (Vercel env vars per branch)
- Auditable in version control (`.env.example`)

**When to revisit:** When Vero has 10+ active deployments with different feature matrices, or when non-engineering stakeholders need to toggle features without deploys.
