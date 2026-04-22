/**
 * Canonical JSON encoder for Vero audit events.
 *
 * Spec: `docs/spec/audit-event-v1.md`. MIT-licensed. The contract here is the
 * single source of truth for the wire format that the server's
 * `auditChain.ts` and the browser's `clientVerifier.ts` both implement
 * against.
 *
 * Pure string operations — no `node:crypto`, no DOM. Safe in any JS runtime.
 */

import type { AuditEventInput } from './types.js'

/**
 * Build the canonical JSON string for an audit event payload.
 *
 * Invariants:
 *  - Object keys are inserted in fixed alphabetical order.
 *  - `JSON.stringify` is called with no spacing.
 *  - Optional `relatedEntityId` is emitted only when present (matches the
 *    historical server behaviour). The key still appears in alphabetical
 *    position when included.
 *
 * Hashing the returned string with sha256 (hex) yields `payload_hash`.
 */
export function canonicalEventJson(event: AuditEventInput): string {
  const canonical: Record<string, unknown> = {
    action: event.action,
    actor: event.actor,
    detail: event.detail,
    event_id: event.event_id,
    timestamp: event.timestamp,
    type: event.type,
  }
  if (event.relatedEntityId !== undefined) {
    canonical.relatedEntityId = event.relatedEntityId
  }
  return JSON.stringify(canonical)
}

/**
 * Build the input string that is sha256'd to produce `chain_hash`.
 *
 * Format: `${sequence}|${payload_hash}|${prev_hash}` — pipe-separated, no
 * trailing newline. The previous hash for the genesis row is `GENESIS_HASH`
 * (64 zeroes).
 */
export function chainHashInput(
  sequence: number,
  payloadHash: string,
  prevHash: string,
): string {
  return `${sequence}|${payloadHash}|${prevHash}`
}
