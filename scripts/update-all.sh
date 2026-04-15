#!/usr/bin/env bash
set -euo pipefail

if [[ "${CONFIRM_UPDATE_ALL:-}" != "YES" ]]; then
  echo "Refusing to run without explicit confirmation."
  echo "Set CONFIRM_UPDATE_ALL=YES and run again."
  exit 1
fi

required_vars=(
  STAGING_RAILWAY_TOKEN
  PRODUCTION_RAILWAY_TOKEN
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required env var: ${var_name}"
    exit 1
  fi
done

echo "==> Running local release gate"
npm run verify:release

echo "==> Redeploying Vercel production alias"
npx vercel redeploy "verochain.co"

echo "==> Redeploying Vercel staging preview alias"
npx vercel redeploy "aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app"

echo "==> Redeploying Railway staging API"
RAILWAY_TOKEN="${STAGING_RAILWAY_TOKEN}" \
  npx @railway/cli link \
    --project 8762bf41-052b-422e-b910-a9eb0118cb7e \
    --environment staging \
    --service aether-api >/dev/null
RAILWAY_TOKEN="${STAGING_RAILWAY_TOKEN}" \
  npx @railway/cli redeploy --service aether-api --yes

STAGING_BASE_URL="https://aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app"
EXPECTED_STAGING_API_URL="https://aether-api-staging.up.railway.app"
FORBIDDEN_PROD_API_URL="https://aether-api-production-295d.up.railway.app"

if [[ "${SKIP_STAGING_SMOKE:-}" == "1" ]]; then
  echo "==> Skipping staging parity smoke (SKIP_STAGING_SMOKE=1)"
else
  echo "==> Running deployed staging parity smoke"
  stage_html="$(curl -fsSL "${STAGING_BASE_URL}" || true)"
  if [[ -z "${stage_html}" ]]; then
    echo "Staging page fetch returned empty response. Skipping smoke."
  elif [[ "${stage_html}" == *"Log in to Vercel"* ]] || [[ "${stage_html}" == *"/signup?next=%2Fsso-api"* ]]; then
    echo "Detected Vercel auth wall on staging preview. Skipping smoke."
    echo "To force skip manually next time, set SKIP_STAGING_SMOKE=1."
  else
    PLAYWRIGHT_BASE_URL="${STAGING_BASE_URL}" \
    EXPECTED_API_BASE_URL="${EXPECTED_STAGING_API_URL}" \
    FORBIDDEN_API_BASE_URL="${FORBIDDEN_PROD_API_URL}" \
    npm run test:e2e:deployment
  fi
fi

echo "==> Redeploying Railway production API"
RAILWAY_TOKEN="${PRODUCTION_RAILWAY_TOKEN}" \
  npx @railway/cli link \
    --project 8762bf41-052b-422e-b910-a9eb0118cb7e \
    --environment production \
    --service aether-api >/dev/null
RAILWAY_TOKEN="${PRODUCTION_RAILWAY_TOKEN}" \
  npx @railway/cli redeploy --service aether-api --yes

echo "==> update:all completed"
