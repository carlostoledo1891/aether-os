# update:all Command

Use this when you want production refreshed after local changes are green.

## What it does

`npm run update:all` runs:

1. `npm run verify:release`
2. Vercel redeploy for `https://verochain.co`
3. Railway production API redeploy (`aether-api`)

## Required env vars

```bash
export RAILWAY_TOKEN="<production-token>"
export CONFIRM_UPDATE_ALL=YES
```

Optional override:

```bash
export PRODUCTION_RAILWAY_TOKEN="<production-token>"
```

## Run

```bash
npm run update:all
```

## Preconditions

- You are logged in to Vercel CLI (`npx vercel whoami` works for the correct team/project).
- Railway token has access to the production environment for project `aether-os`.
- `main` already contains the code you want to ship.
