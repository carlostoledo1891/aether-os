#!/usr/bin/env bash
set -euo pipefail

if [[ "${CONFIRM_UPDATE_ALL:-}" != "YES" ]]; then
  echo "Refusing to run without explicit confirmation."
  echo "Set CONFIRM_UPDATE_ALL=YES and run again."
  exit 1
fi

staging_token="${STAGING_RAILWAY_TOKEN:-${RAILWAY_TOKEN:-}}"
production_token="${PRODUCTION_RAILWAY_TOKEN:-${RAILWAY_TOKEN:-}}"

if [[ -z "${staging_token}" ]]; then
  echo "Missing Railway token for staging."
  echo "Set STAGING_RAILWAY_TOKEN or RAILWAY_TOKEN."
  exit 1
fi

if [[ -z "${production_token}" ]]; then
  echo "Missing Railway token for production."
  echo "Set PRODUCTION_RAILWAY_TOKEN or RAILWAY_TOKEN."
  exit 1
fi

if [[ -n "${RAILWAY_TOKEN:-}" ]] && [[ -z "${STAGING_RAILWAY_TOKEN:-}" ]] && [[ -z "${PRODUCTION_RAILWAY_TOKEN:-}" ]]; then
  echo "Using shared RAILWAY_TOKEN for staging and production."
fi

echo "==> Running local release gate"
npm run verify:release

echo "==> Redeploying Vercel production alias"
npx vercel redeploy "verochain.co"

echo "==> Redeploying Vercel staging preview alias"
npx vercel redeploy "aether-os-git-staging-carlos-toledos-projects-840d56ff.vercel.app"

echo "==> Redeploying Railway staging API"
RAILWAY_TOKEN="${staging_token}" \
RAILWAY_API_TOKEN="${staging_token}" \
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
RAILWAY_TOKEN="${production_token}" \
RAILWAY_API_TOKEN="${production_token}" \
  npx @railway/cli redeploy --service aether-api --yes

echo "==> update:all completed"
