/**
 * Browser-side audit-chain verifier — Wave 1 of the Vero public verifier.
 *
 * Spec: `docs/spec/audit-event-v1.md`. MIT-licensed. The cryptography runs in
 * the user's tab via `crypto.subtle` so the server is never the one that says
 * "valid" — that is the entire point of the chirp moment.
 *
 * Mirrors the server algorithm in `server/src/store/auditChain.ts` (function
 * `verifyChain`). Both implementations call into `shared/audit/canonicalJson`
 * for the wire format so the contract has a single source of truth.
 */

import {
  canonicalEventJson,
  chainHashInput,
} from 'shared/audit/canonicalJson'
import {
  GENESIS_HASH,
  type AuditEventInput,
  type AuditEventRow,
  type ChainVerification,
} from 'shared/audit/types'

/**
 * Hex-encoded sha256 using the WebCrypto SubtleCrypto API. Available in every
 * modern browser, including mobile Safari, on secure origins.
 */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const view = new Uint8Array(digest)
  let hex = ''
  for (let i = 0; i < view.length; i++) {
    hex += view[i].toString(16).padStart(2, '0')
  }
  return hex
}

export async function computePayloadHashClient(event: AuditEventInput): Promise<string> {
  return sha256Hex(canonicalEventJson(event))
}

export async function computeChainHashClient(
  sequence: number,
  payloadHash: string,
  prevHash: string,
): Promise<string> {
  return sha256Hex(chainHashInput(sequence, payloadHash, prevHash))
}

/**
 * Recompute every payload_hash and chain_hash in a chain segment and verify
 * the prev_hash linkage.
 *
 * `events` MUST be a continuous segment in ascending `sequence` order, with
 * the first event's `prev_hash` matching either the prior chain segment's
 * end_hash or `GENESIS_HASH` for genesis. The public endpoint at
 * `/api/public/bundles/by-hash/:hash` returns events that satisfy this
 * invariant.
 *
 * Returns the same shape the server produces from `verifyChain()` so the UI
 * can treat them interchangeably.
 *
 * The optional `onProgress` callback is invoked after every event is
 * verified, useful for streaming progress to the UI without blocking the
 * main thread on large chains. We yield to the event loop every 50 events.
 */
export async function verifyChainClient(
  events: AuditEventRow[],
  options: {
    /** Override the expected prev_hash for the first event. Defaults to GENESIS_HASH if the first event's sequence === 1, otherwise uses events[0].prev_hash unmodified. */
    expectedFirstPrevHash?: string
    onProgress?: (current: number, total: number) => void
  } = {},
): Promise<ChainVerification> {
  if (events.length === 0) {
    return { valid: true, length: 0 }
  }

  const sortedEvents = [...events].sort((a, b) => a.sequence - b.sequence)

  const expectedFirstPrev =
    options.expectedFirstPrevHash
    ?? (sortedEvents[0].sequence === 1 ? GENESIS_HASH : sortedEvents[0].prev_hash)

  let expectedPrevHash = expectedFirstPrev

  for (let i = 0; i < sortedEvents.length; i++) {
    const row = sortedEvents[i]

    if (row.prev_hash !== expectedPrevHash) {
      return {
        valid: false,
        length: sortedEvents.length,
        brokenAt: row.sequence,
        detail: `prev_hash mismatch at sequence ${row.sequence}`,
      }
    }

    const expectedPayloadHash = await computePayloadHashClient(row)
    if (row.payload_hash !== expectedPayloadHash) {
      return {
        valid: false,
        length: sortedEvents.length,
        brokenAt: row.sequence,
        detail: `payload_hash mismatch at sequence ${row.sequence}`,
      }
    }

    const expectedChainHash = await computeChainHashClient(
      row.sequence,
      row.payload_hash,
      row.prev_hash,
    )
    if (row.chain_hash !== expectedChainHash) {
      return {
        valid: false,
        length: sortedEvents.length,
        brokenAt: row.sequence,
        detail: `chain_hash mismatch at sequence ${row.sequence}`,
      }
    }

    expectedPrevHash = row.chain_hash

    options.onProgress?.(i + 1, sortedEvents.length)

    // Yield to the event loop every 50 events so the UI stays responsive on
    // chains of several thousand entries.
    if ((i + 1) % 50 === 0) {
      await new Promise<void>(resolve => setTimeout(resolve, 0))
    }
  }

  return { valid: true, length: sortedEvents.length }
}
