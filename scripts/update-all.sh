#!/usr/bin/env bash
set -euo pipefail

if [[ "${CONFIRM_UPDATE_ALL:-}" != "YES" ]]; then
  echo "Refusing to run without explicit confirmation."
  echo "Set CONFIRM_UPDATE_ALL=YES and run again."
  exit 1
fi

production_token="${PRODUCTION_RAILWAY_TOKEN:-${RAILWAY_TOKEN:-}}"

if [[ -z "${production_token}" ]]; then
  echo "Missing Railway token for production."
  echo "Set PRODUCTION_RAILWAY_TOKEN or RAILWAY_TOKEN."
  exit 1
fi

if [[ -n "${RAILWAY_TOKEN:-}" ]] && [[ -z "${PRODUCTION_RAILWAY_TOKEN:-}" ]]; then
  echo "Using shared RAILWAY_TOKEN for production."
fi

echo "==> Running local release gate"
npm run verify:release

echo "==> Redeploying Vercel production alias"
npx vercel redeploy "verochain.co"

echo "==> Redeploying Railway production API"
RAILWAY_TOKEN="${production_token}" \
RAILWAY_API_TOKEN="${production_token}" \
  npx @railway/cli redeploy --service aether-api --yes

echo "==> update:all completed"
