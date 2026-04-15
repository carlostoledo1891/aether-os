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
- Hosted staging frontend -> explicit `VITE_API_BASE_URL` / optional `VITE_WS_URL` -> staging API
- Hosted production frontend -> explicit `VITE_API_BASE_URL` / optional `VITE_WS_URL` -> production API

`vercel.json` is no longer allowed to proxy `/api/*` to a fixed backend. Hosted builds must declare their backend targets through environment variables so staging and production can be isolated.

## Environment Matrix

| Environment | Branch | Frontend host | Backend host | Database | Frontend env | Server env |
|-------------|--------|---------------|--------------|----------|--------------|------------|
| Local | any local branch | `http://localhost:5175` | `http://localhost:3001` | local SQLite | leave `VITE_API_BASE_URL` / `VITE_WS_URL` empty | `CORS_ORIGIN` optional |
| Staging | `staging` | `https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app` | `https://aether-api-staging.up.railway.app` | staging DB only | set `VITE_API_BASE_URL`; set `VITE_WS_URL` only if WS origin differs | set `CORS_ORIGIN` to the staging frontend origin |
| Production | `main` | `https://verochain.co` | `https://aether-api-production-295d.up.railway.app` | production DB only | set `VITE_API_BASE_URL`; set `VITE_WS_URL` only if WS origin differs | set `CORS_ORIGIN` to the production frontend origin |

Rules:

- `staging` must never point at the production API or production DB.
- `main` must never point at the staging API or staging DB.
- If `VITE_WS_URL` is omitted, the frontend derives it from `VITE_API_BASE_URL`.
- Only leave `VITE_API_BASE_URL` empty when the host really reverse-proxies `/api` and `/ws`.

## Vercel Settings

- Production branch: `main`
- Install command: `npm ci`
- Build command: `npm run build`
- Node version: `22.12.0` or the current repo `.nvmrc` value
- Production env vars should target only the production backend
- Preview/staging env vars should target only the staging backend

Recommended domain mapping:

- Primary production domain -> `main`
- Staging domain -> `staging`
- Do not point branded staging or production domains at feature branches

## Railway / API Settings

For each hosted API environment:

- Use a separate database path or managed database
- Set `CORS_ORIGIN` to the matching frontend origin
- In production, `CORS_ORIGIN` must be explicit. Localhost fallback requires explicit override via `ALLOW_LOCALHOST_CORS_IN_PRODUCTION=1` (debug-only).
- Set `CHAT_API_KEY`, `INGEST_API_KEY`, and admin secrets independently per environment
- Keep staging and production secrets separate

## Local Release Checklist

Run this before pushing anything intended for staging or production:

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

## Staging Smoke Check

After the `staging` deployment is live, verify that the deployed frontend exposes the expected backend target:

```sh
PLAYWRIGHT_BASE_URL="https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app" \
EXPECTED_API_BASE_URL="https://aether-api-staging.up.railway.app" \
FORBIDDEN_API_BASE_URL="https://aether-api-production-295d.up.railway.app" \
npm run test:e2e:deployment
```

This smoke test checks:

- the frontend runtime config points at the expected API origin
- the runtime config does not point at a forbidden API origin
- the configured backend responds on `/api/health`

This deployment smoke is currently a manual or scheduled check (not part of the default pull request CI lane).

## Chat CORS Debug Checklist

If chat fails from `verochain.co` with a browser CORS error:

1. Check runtime config in browser console: `window.__VERO_RUNTIME_CONFIG__` and confirm `apiBaseUrl` points to production API.
2. Verify production API preflight responds with CORS headers:
   - `OPTIONS /api/chat` with `Origin: https://verochain.co`
   - `Access-Control-Request-Method: POST`
   - `Access-Control-Request-Headers: content-type,x-api-key`
3. Confirm `CORS_ORIGIN` includes exact production origin(s) (and `www` variant only if used).
4. Confirm `CHAT_API_KEY` on API matches frontend `VITE_CHAT_API_KEY` expectation.
5. Distinguish true CORS from auth failures by inspecting response status/body (`401`/`503` can appear as CORS in DevTools if headers are missing).

## Promotion Runbook

1. Branch from `main` for feature work.
2. Merge releasable work into `staging`.
3. Run `npm run verify:release`.
4. Deploy `staging` and run the staging smoke check.
5. Manually click through `LandingPage`, `FieldView`, `BuyerView`, `FoundersDeck`, and `MeteoricDeck`.
6. Promote `staging` to `main`.
7. Watch the new Vercel production deployment for the promoted SHA.
8. Re-run the same manual smoke on production.
9. After any production hotfix, re-sync `staging` from `main` immediately.

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
2. Confirm the failing SHA matches what is on `main` or `staging`.
3. Re-run `npm run verify:release` locally under the repo Node version.
4. If `npm run check:deploy-config` fails, fix deployment wiring before redeploying.
5. If `tsc` fails, check map layer manifest/runtime/preset drift first.
6. If local is green but Vercel is red, check Node version plus Vercel env vars for the target environment.
7. Only redeploy after the local release path is green.

## Send Live Safely

1. Run `npm run verify:release`.
2. Push only the releasable files.
3. Verify the `staging` deployment uses the staging backend.
4. Promote to `main` only after staging is green.
5. Watch the new Vercel production deployment for the pushed SHA.
6. Confirm production uses the production backend and passes the manual smoke path.
