# Technical Debt Backlog

This file tracks debt tickets identified during the baseline pass.
Status values: `todo`, `in_progress`, `done`.

## TD-001 Deploy Parity Policy Hardening
- **Status:** `in_progress`
- **Scope:** enforce safer production env policy and canonical parity checks.
- **Files:** `server/src/validateEnv.ts`, `server/src/index.ts`, `docs/DEPLOYMENT.md`, `scripts/check-deploy-config.mjs`.
- **Acceptance:**
  - Production cannot boot with implicit localhost-only CORS.
  - Staging smoke examples use canonical env-variable wiring.

## TD-002 Map Runtime Complexity
- **Status:** `in_progress`
- **Scope:** reduce runtime duplicate resolution, host-key ambiguity, and duplicated terrain runtime logic.
- **Files:** `src/components/map/MapOverlays.tsx`, `src/components/map/layerRuntime.tsx`, `src/components/map/useMapLayers.ts`, `src/views/field/fieldMapLayers.ts`.
- **Acceptance:**
  - `MapOverlays` resolves each runtime once per rendered host.
  - Terrain/hillshade host rendering is defined in one place.
  - Shared field-layer store is not imported from a view-specific path.

## TD-003 Server Auth/Test Determinism
- **Status:** `in_progress`
- **Scope:** remove duplicated admin guards, reduce test drift, improve ingest route coverage.
- **Files:** `server/src/routes/knowledgeAdmin.ts`, `server/src/routes/mapLayers.ts`, `server/src/index.ts`, `server/src/__tests__/helpers.ts`, `server/src/__tests__/ingest-guard.test.ts`.
- **Acceptance:**
  - Shared admin guard module used by both admin routes.
  - Test app setup uses deterministic DB path and API-key policy.
  - Focused ingest route tests cover all ingest endpoints.

## TD-004 CI/Test Hygiene
- **Status:** `in_progress`
- **Scope:** add explicit server coverage command and optional deployment parity CI lane.
- **Files:** `server/package.json`, `.github/workflows/ci.yml`.
- **Acceptance:**
  - `server` exposes `test:coverage`.
  - CI has an explicit deployment parity job path (manual/scheduled) with expected env inputs.
