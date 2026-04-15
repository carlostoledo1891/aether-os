# update:all Command

Use this when you want staging and production refreshed after local changes are green.

## What it does

`npm run update:all` runs:

1. `npm run verify:release`
2. Vercel redeploy for:
   - `https://verochain.co`
   - `https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app`
3. Railway staging API redeploy (`aether-api`)
4. Staging deployed parity smoke:
   - `PLAYWRIGHT_BASE_URL=https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app`
   - `EXPECTED_API_BASE_URL=https://aether-api-staging.up.railway.app`
   - `FORBIDDEN_API_BASE_URL=https://aether-api-production-295d.up.railway.app`
5. Railway production API redeploy (`aether-api`)

## Required env vars

```bash
export RAILWAY_TOKEN="<token-with-staging-and-production-access>"
export CONFIRM_UPDATE_ALL=YES
```

Optional overrides (only if you want different tokens per environment):

```bash
export STAGING_RAILWAY_TOKEN="<staging-token>"
export PRODUCTION_RAILWAY_TOKEN="<production-token>"
```

Optional:

```bash
# Skip deployed staging parity smoke explicitly
export SKIP_STAGING_SMOKE=1
```

## Run

```bash
npm run update:all
```

## Staging Preview Auth Note

If staging preview is protected by Vercel login, the script now auto-detects the auth wall and skips the Playwright staging smoke step instead of failing the whole run.

## Preconditions

- You are logged in to Vercel CLI (`npx vercel whoami` works for the correct team/project).
- Railway tokens have access to project `aether-os`.
- `main` / `staging` branch promotion has already been done according to your release policy.
