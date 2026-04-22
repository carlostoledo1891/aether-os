/**
 * Seeds the SQLite database with Caldeira domain data on first boot.
 *
 * All site-specific data is defined in server/src/sites/caldeiraSeed.ts.
 * Canonical thresholds and geography live in shared/sites/caldeira.ts.
 * This file is a thin orchestrator — it never defines domain literals.
 */
import { getDb, setDomainState, getDomainState, upsertMarket } from './store/db.js'
import { appendAuditEvent } from './store/auditChain.js'
import { CALDEIRA_SEED, CALDEIRA_AUDIT_SEED } from './sites/caldeiraSeed.js'
import { seedUnitsIfNeeded } from './store/unitSeeder.js'
import { createBundle, getBundleByChainHash } from './store/unitStore.js'

const REFERENCE_BUNDLE_CLAIM =
  'Wave 1 reference bundle: Caldeira board pack — consolidated state of deposits, ' +
  'milestones, risks, offtakes, and permit conditions. Generated at first boot for ' +
  'use as the canonical /verify/<hash> demo.'

const MARITIME_REFERENCE_BUNDLE_CLAIM =
  'Atlantic Maritime ISR reference bundle: AOIs, vessel detections (incl. dark-vessel ' +
  'events), sensor station coverage, and ISR product status. Generated at first boot ' +
  'so /verify/<hash> demonstrates the same audit-chain semantics for the Maritime ISR instance.'

/**
 * Deterministic seed-anchor event appended right before `createBundle` so
 * the reference bundle covers a non-empty chain segment. Without this, the
 * SELECT inside createBundle returns zero rows (no seeded audit event has
 * `related_entity_id = 'SITE-CALDEIRA'`), the chain proof is empty, and
 * `chainProof.endHash` is the empty string — which silently breaks the
 * shareable `/verify/<hash>` URL story the launch post relies on.
 *
 * Fixed event_id + timestamp + payload guarantee the same chain hash on
 * every fresh-DB boot, so `docs/REFERENCE_BUNDLE_HASH.txt` can be a true
 * drift gate (see `server/src/__tests__/referenceBundle.test.ts`).
 */
const REFERENCE_ANCHOR_EVENT = {
  event_id: 'AUD-WAVE1-REF-001',
  timestamp: '2026-04-18T00:00:00.000Z',
  type: 'system_event' as const,
  actor: 'system',
  action: 'Wave 1 reference bundle anchor',
  detail:
    'Seeded marker so the canonical /verify/<hash> bundle covers a ' +
    'reproducible chain segment rooted at SITE-CALDEIRA.',
  relatedEntityId: 'SITE-CALDEIRA',
}

/**
 * Maritime instance counterpart to REFERENCE_ANCHOR_EVENT. Same purpose
 * (so `createBundle('SITE-MARITIME')` covers a non-empty chain segment
 * on first call), same determinism (fixed event_id + timestamp).
 */
const MARITIME_REFERENCE_ANCHOR_EVENT = {
  event_id: 'AUD-MARITIME-REF-001',
  timestamp: '2026-04-18T00:00:01.000Z',
  type: 'system_event' as const,
  actor: 'system',
  action: 'Atlantic Maritime reference bundle anchor',
  detail:
    'Seeded marker so the maritime /verify/<hash> bundle covers a ' +
    'reproducible chain segment rooted at SITE-MARITIME.',
  relatedEntityId: 'SITE-MARITIME',
}

export function seedIfNeeded() {
  getDb()

  if (getDomainState('spring_count') !== null) {
    console.log('[seed] Domain state already seeded — skipping domain seed.')
  } else {
    console.log('[seed] Seeding domain state from Caldeira site data...')

    for (const [key, value] of Object.entries(CALDEIRA_SEED)) {
      setDomainState(key, value)
    }

    // Regulatory export bundle (depends on other domain state being seeded first)
    setDomainState('regulatory_export_bundle', {
      exportedAt: new Date().toISOString(),
      bannerNote: 'Live pipeline — VeroChain Simulation Engine',
      regulatoryLog: getDomainState('regulatory_log'),
      auditEvents: (getDomainState<Array<{ id: string; type: string }>>('audit_trail') ?? [])
        .filter(e => e.type === 'regulatory_submission' || e.id === 'AUD-008' || e.id === 'AUD-009' || e.id === 'AUD-010'),
      permittingRisks: (getDomainState<Array<{ category: string; id: string }>>('risks') ?? [])
        .filter(r => r.category === 'permitting' || r.id === 'R01'),
      provenanceSummary: 'Illustrative bundle for briefing. Replace with signed PDFs and portal exports for official use.',
    })

    // Audit chain (append in chronological order for correct SHA-256 chaining)
    for (const evt of CALDEIRA_AUDIT_SEED) {
      appendAuditEvent(evt)
    }

    // Seed fallback market data so /api/market/* never 503s on a fresh DB.
    // Real enricher data (Alpha Vantage, BCB) overwrites via ON CONFLICT upsert.
    upsertMarket({
      symbol: 'MEI.AX', source: 'seed', provenance: 'simulated',
      timestamp: new Date().toISOString(), kind: 'stock',
      value: 0.029, currency: 'AUD',
      detail: { open: 0.028, high: 0.030, low: 0.027, volume: 312000 },
    })
    upsertMarket({
      symbol: 'BRL/USD', source: 'seed', provenance: 'simulated',
      timestamp: new Date().toISOString(), kind: 'fx',
      value: 5.68, currency: 'BRL',
    })

    console.log('[seed] Domain state seeded successfully.')
  }

  // Always runs — seedUnitsIfNeeded has its own getUnitCount() > 0 guard.
  seedUnitsIfNeeded()

  ensureReferenceBundle()
  ensureMaritimeReferenceBundle()
}

/**
 * Wave 1 reference bundle (see plan: `wave_1_public_verifier_3da0c0e1`).
 *
 * Generates exactly one canonical Caldeira board-pack bundle on first boot
 * and prints its `chain_hash` so that `verochain.co/verify/<known-hash>` is a
 * shareable demo from day one. We persist the chain hash in `domain_state`
 * under `reference_bundle_chain_hash` so subsequent boots can re-print it
 * without creating a new bundle.
 *
 * If the audit chain advances after the bundle was generated, the existing
 * bundle still verifies — it captures a slice of the chain at creation time
 * and does not need re-issuance.
 */
function ensureReferenceBundle() {
  const existingHash = getDomainState<string>('reference_bundle_chain_hash')
  if (existingHash && getBundleByChainHash(existingHash)) {
    console.log(`[seed] Reference verifier bundle already present.`)
    console.log(`       /verify/${existingHash}`)
    return
  }

  try {
    // Append the deterministic anchor event (idempotent: appendAuditEvent
    // de-dupes by event_id, so subsequent boots are no-ops).
    appendAuditEvent(REFERENCE_ANCHOR_EVENT)

    const bundle = createBundle('SITE-CALDEIRA', REFERENCE_BUNDLE_CLAIM)
    const hash = bundle.chainProof.endHash
    if (!hash) {
      console.warn('[seed] Reference bundle generated but has no chain hash; skipping persistence.')
      return
    }
    setDomainState('reference_bundle_chain_hash', hash)
    console.log(`[seed] Generated Wave 1 reference verifier bundle ${bundle.id}.`)
    console.log(`       /verify/${hash}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[seed] Could not generate reference verifier bundle: ${msg}`)
  }
}

/**
 * Atlantic Maritime instance reference bundle — same shape and lifecycle
 * as `ensureReferenceBundle()`. Persists the chain hash under
 * `maritime_reference_bundle_chain_hash` so subsequent boots reprint it
 * without creating a duplicate.
 */
function ensureMaritimeReferenceBundle() {
  const existingHash = getDomainState<string>('maritime_reference_bundle_chain_hash')
  if (existingHash && getBundleByChainHash(existingHash)) {
    console.log(`[seed] Maritime reference verifier bundle already present.`)
    console.log(`       /verify/${existingHash}`)
    return
  }

  try {
    appendAuditEvent(MARITIME_REFERENCE_ANCHOR_EVENT)
    const bundle = createBundle('SITE-MARITIME', MARITIME_REFERENCE_BUNDLE_CLAIM)
    const hash = bundle.chainProof.endHash
    if (!hash) {
      console.warn('[seed] Maritime reference bundle generated but has no chain hash; skipping persistence.')
      return
    }
    setDomainState('maritime_reference_bundle_chain_hash', hash)
    console.log(`[seed] Generated Atlantic Maritime reference verifier bundle ${bundle.id}.`)
    console.log(`       /verify/${hash}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[seed] Could not generate maritime reference verifier bundle: ${msg}`)
  }
}
