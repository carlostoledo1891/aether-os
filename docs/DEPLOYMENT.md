# Deployment Guide

## Runtime Parity

- Local, CI, and Vercel should use Node `22.12.0`.
- Use `nvm use` at the repo root before running release commands.
- CI reads `.nvmrc`.
- Vercel should use the same Node version in project settings.

## Required Vercel Settings

- Production branch: `main`
- Install command: `npm ci`
- Build command: `npm run build`
- Node version: `22.12.0` or the current repo `.nvmrc` value

`vercel.json` also pins the install and build commands so repo defaults match the dashboard.

## Staging Setup

Use the same Vercel project for both production and staging during demo week:

- Production branch/domain: `main`
- Staging branch/domain: `staging`
- All other branches: preview deployments only

Branch dropdown guidance in Vercel:

- For the production domain, choose `main`
- For the staging domain, choose `staging`
- Do not point either domain at `dependabot/...` or feature branches

Recommended sequence:

1. Create `staging` from the current `main`.
2. Assign `staging.<your-domain>` to branch `staging` in Vercel Domains.
3. Keep the primary production domain attached to `main`.
4. Validate demo-critical routes on `staging` before promoting anything to `main`.

## Preview Workaround

If you cannot create a dedicated Vercel staging environment, use the existing `Preview` environment as a low-risk workaround:

1. Keep `Production` unchanged on branch `main`.
2. Leave `Preview` branch tracking on `All unassigned branches`.
3. Use the latest deployment for branch `staging` in the Vercel Deployments list as the staging URL.
4. Validate the demo-critical routes on that `staging` preview deployment before promoting anything to `main`.

This keeps production stable and avoids rewiring Preview behavior for every other branch during demo week.

### Optional branded staging link

Only after the plain `staging` Preview URL is working, you can attach `staging.verochain.co` to the existing `Preview` environment as a temporary branded demo URL.

### Temporary fallback

If a branded staging link is mandatory and you accept the tradeoff, temporarily change `Preview` branch tracking from `All unassigned branches` to `staging`, attach `staging.verochain.co`, and restore the old Preview behavior after demo week.

## Local Release Checklist

Run this before pushing anything intended for production:

```sh
npm run verify:release
```

That command runs:

- `npm run lint`
- `npm run test:run`
- `npm run build`
- `npm --prefix server test`
- `npm --prefix engine test`

The default `server` test script excludes the live Gemini hallucination suite so release verification stays deterministic. Run `npm --prefix server run test:ai` separately when you explicitly want to exercise the live model.

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
4. If `tsc` fails, check map layer manifest/runtime/preset drift first.
5. If local is green but Vercel is red, check Node version and install/build command parity in Vercel.
6. Only redeploy after the local release path is green.

## Send Live Safely

1. Run `npm run verify:release`.
2. Push only the releasable files.
3. Watch the new Vercel production deployment for the pushed SHA.
4. Click through the live app and at minimum verify `FieldView`, `BuyerView`, and the Meteoric deck map slides.
