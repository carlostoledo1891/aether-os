# Deployment Guide

## Runtime Parity

- Local, CI, and Vercel should use Node `22.12.0`.
- Use `nvm use` at the repo root before running release commands.
- CI reads `.nvmrc`.
- Vercel should use the same Node version in project settings.
- Optional one-command rollout helper: `npm run update:all` (setup + caveats in `docs/UPDATE_ALL.md`).

## Supported Topology

The supported deployment model is:

- Local frontend -> Vite proxy -> local API/WebSocket server
- Hosted production frontend -> explicit `VITE_API_BASE_URL` / optional `VITE_WS_URL` -> production API

`vercel.json` is no longer allowed to proxy `/api/*` to a fixed backend. Hosted builds must declare their backend targets through environment variables so production stays explicit and auditable.

## Environment Matrix

| Environment | Branch | Frontend host | Backend host | Database | Frontend env | Server env |
|-------------|--------|---------------|--------------|----------|--------------|------------|
| Local | any local branch | `http://localhost:5175` | `http://localhost:3001` | local SQLite | leave `VITE_API_BASE_URL` / `VITE_WS_URL` empty | `CORS_ORIGIN` optional |
| Production | `main` | `https://verochain.co` | `https://aether-api-production-295d.up.railway.app` | production DB only | set `VITE_API_BASE_URL`; set `VITE_WS_URL` only if WS origin differs | set `CORS_ORIGIN` to the production frontend origin; server also falls back to canonical Vero production domains |

Rules:

- If `VITE_WS_URL` is omitted, the frontend derives it from `VITE_API_BASE_URL`.
- Only leave `VITE_API_BASE_URL` empty when the host really reverse-proxies `/api` and `/ws`.

## Vercel Settings

- Production branch: `main`
- Install command: `npm ci`
- Build command: `npm run build`
- Node version: `22.12.0` or the current repo `.nvmrc` value
- Production env vars should target only the production backend

Recommended domain mapping:

- Primary production domain -> `main`
- Do not point branded staging or production domains at feature branches

## Railway / API Settings

For the hosted production API:

- Use the production database path or managed database
- Set `CORS_ORIGIN` to the matching frontend origin
- In production, the server always allows the canonical Vero domains (`https://verochain.co`, `https://www.verochain.co`) and can optionally merge additional origins from `CORS_ORIGIN`.
- Localhost fallback still requires explicit override via `ALLOW_LOCALHOST_CORS_IN_PRODUCTION=1` (debug-only).
- Set `CHAT_API_KEY`, `INGEST_API_KEY`, and admin secrets explicitly for production

## Local Release Checklist

Run this before pushing anything intended for production:

```sh
npm run verify:release
```

That command runs:

- `npm run lint`
- `npm run test:run`
- `npm run check:deploy-config`
- `npm run build`
- `npm --prefix server test`
- `npm --prefix engine test`

The default `server` test script excludes the live Gemini hallucination suite so release verification stays deterministic. Run `npm --prefix server run test:ai` separately when you explicitly want to exercise the live model.

## Production CORS Debug Checklist

If chat, Operations, Hydro Twin, telemetry history, provenance, or market reads fail from `verochain.co` with a browser CORS error:

1. Check runtime config in browser console: `window.__VERO_RUNTIME_CONFIG__` and confirm `apiBaseUrl` points to production API.
2. Verify production API responds with `Access-Control-Allow-Origin: https://verochain.co` on both preflight and normal reads:
   - `OPTIONS /api/chat` with `Origin: https://verochain.co`
   - `Access-Control-Request-Method: POST`
   - `Access-Control-Request-Headers: content-type,x-api-key`
   - `GET /api/project/hydrology`
   - `GET /api/telemetry/history?range=24h`
   - `GET /api/provenance`
3. Confirm `CORS_ORIGIN` only adds extra hosted origins you actually need; the canonical Vero domains are already allowed in production.
4. Confirm `CHAT_API_KEY` on API matches frontend `VITE_CHAT_API_KEY` expectation.
5. Distinguish true CORS from auth failures by inspecting response status/body (`401`/`503` can appear as CORS in DevTools if headers are missing).

## CSP Eval Audit

- The production bundle was scanned for `eval`, `new Function`, and string-based `setTimeout` / `setInterval` usage after the theme/runtime changes.
- No matches were found in `src`, `dist`, or installed dependencies.
- Current interpretation: if DevTools still reports an `unsafe-eval` warning, treat it as a runtime/browser instrumentation warning first and capture the exact offending stack before relaxing `script-src`.

## Promotion Runbook

1. Branch from `main` for feature work.
2. Run `npm run verify:release`.
3. Push only the releasable files to `main`.
4. Run `npm run update:all` to redeploy production frontend + API.
5. Watch the new Vercel production deployment for the intended SHA.
6. Manually click through `LandingPage`, `UnitPage` at `/app`, `FoundersDeck`, and `MeteoricDeck`.
7. Manually smoke-test chat send + upload flow on production.

## Map Layer Change Checklist

The Caldeira map system is a multi-file contract. For any layer change, update and verify:

1. `shared/sites/caldeiraLayers.ts`
2. `src/components/map/layerRegistry.ts`
3. `src/components/map/layerRuntime.tsx`
4. `src/components/map/mapPresets.ts`
5. `src/components/map/useMapLayers.ts`
6. `src/views/field/fieldMapLayers.ts`
7. `src/components/map/__tests__/overlayContracts.test.ts`
8. `src/components/map/useMapLayers.test.tsx`

## When Vercel Fails

Triage in this order:

1. Capture the failing deploy SHA and exact log.
2. Confirm the failing SHA matches what is on `main`.
3. Re-run `npm run verify:release` locally under the repo Node version.
4. If `npm run check:deploy-config` fails, fix deployment wiring before redeploying.
5. If `tsc` fails, check map layer manifest/runtime/preset drift first.
6. If local is green but Vercel is red, check Node version plus Vercel production env vars.
7. Only redeploy after the local release path is green.

## Send Live Safely

1. Run `npm run verify:release`.
2. Push only the releasable files.
3. Run `npm run update:all`.
4. Watch the new Vercel production deployment for the pushed SHA.
5. Confirm production uses the production backend and passes the manual smoke path.
