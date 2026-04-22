/**
 * Day-3 sprint drift gate
 * (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 3.1).
 *
 * The reference bundle hash is the URL the README, the launch post, and
 * the `/trust` page point at. If the canonical bundle ever changes shape —
 * a different anchor event, a different claim string, a different root
 * unit, a different audit-chain dependency — the publicly cited URL
 * silently breaks. This test fails loudly the moment that happens, so the
 * README/CHANGELOG/launch-post update is forced into the same PR.
 *
 * On a fresh in-memory DB:
 *   - seed the world with `seedIfNeeded`
 *   - read the persisted `reference_bundle_chain_hash` from `domain_state`
 *   - compare it byte-for-byte to `docs/REFERENCE_BUNDLE_HASH.txt`
 *
 * If you intentionally changed the reference bundle (new anchor, new
 * claim, etc.), regenerate the file:
 *
 *   1. `rm server/data/aether.db` (or use a fresh container)
 *   2. Boot the server; copy the `[seed] /verify/<hash>` line.
 *   3. Replace `docs/REFERENCE_BUNDLE_HASH.txt` with the new hash.
 *   4. Update README "Verify this build", `docs/launch/wave-1-public-verifier.md`,
 *      and `docs/spec/CHANGELOG.md` in the same commit.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REFERENCE_HASH_FILE = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'docs',
  'REFERENCE_BUNDLE_HASH.txt',
)

// Local stand-in for the `getBundleByChainHash` return shape. We can't
// import the store types at the top level because doing so would also
// import `db.ts` and capture `process.env.DB_PATH` BEFORE the
// `beforeAll` hook gets a chance to point it at `:memory:`. Anything
// stronger than this minimal shape is checked by the unitStore tests.
type BundleProbe = {
  rootUnitId: string
  dataMode: string
  chainProof: { endHash: string; eventCount: number }
} | null

describe('reference bundle drift gate', () => {
  let seededHash: string | null = null
  let committedHash = ''
  let bundleByHash: BundleProbe = null

  beforeAll(async () => {
    process.env.NODE_ENV = process.env.NODE_ENV ?? 'test'
    process.env.DB_PATH = ':memory:'
    const { seedIfNeeded } = await import('../seed.js')
    const { getDomainState } = await import('../store/db.js')
    const { getBundleByChainHash } = await import('../store/unitStore.js')
    seedIfNeeded()
    seededHash = getDomainState<string>('reference_bundle_chain_hash')
    committedHash = readFileSync(REFERENCE_HASH_FILE, 'utf-8').trim()
    bundleByHash = getBundleByChainHash(committedHash) as BundleProbe
  })

  it('docs/REFERENCE_BUNDLE_HASH.txt is a 64-character lowercase hex string', () => {
    expect(committedHash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('seedIfNeeded persists a 64-character lowercase hex chain hash', () => {
    expect(seededHash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('the seeded reference bundle hash matches the committed anchor file', () => {
    // If this fails: either the canonical bundle changed shape (anchor
    // event, claim string, root unit, or upstream audit-chain dependency)
    // OR the docs/REFERENCE_BUNDLE_HASH.txt drifted independently. Resolve
    // by following the rebuild instructions at the top of this file.
    expect(seededHash).toBe(committedHash)
  })

  it('the committed reference hash resolves to a real bundle in the seeded DB', () => {
    expect(bundleByHash).not.toBeNull()
    expect(bundleByHash?.rootUnitId).toBe('SITE-CALDEIRA')
    expect(bundleByHash?.dataMode).toBe('live')
    expect(bundleByHash?.chainProof.endHash).toBe(committedHash)
    expect(bundleByHash?.chainProof.eventCount).toBeGreaterThan(0)
  })
})
