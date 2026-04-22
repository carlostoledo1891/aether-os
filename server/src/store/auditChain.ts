import { createHash } from 'node:crypto'
import { getDb } from './db.js'
import {
  canonicalEventJson,
  chainHashInput,
} from '../_shared/audit/canonicalJson.js'
import {
  GENESIS_HASH,
  type AuditEventInput,
  type AuditEventRow,
  type AuditEventType,
  type ChainVerification,
} from '../_shared/audit/types.js'

/* ─── Re-exports for backwards compatibility ──────────────────────────────── */

export type { AuditEventInput, AuditEventRow, AuditEventType, ChainVerification }

/* ─── Hashing ─────────────────────────────────────────────────────────────── */

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

/**
 * Compute the payload hash for an audit event using the shared canonical-JSON
 * encoder. The wire format is defined in `docs/spec/audit-event-v1.md` and
 * implemented identically in `shared/audit/canonicalJson.ts` for the browser
 * verifier.
 */
export function computePayloadHash(event: AuditEventInput): string {
  return sha256(canonicalEventJson(event))
}

function computeChainHash(sequence: number, payloadHash: string, prevHash: string): string {
  return sha256(chainHashInput(sequence, payloadHash, prevHash))
}

/* ─── Append ──────────────────────────────────────────────────────────────── */

export function appendAuditEvent(event: AuditEventInput): AuditEventRow {
  const db = getDb()

  const row = db.transaction(() => {
    const lastRow = db.prepare(
      'SELECT sequence, chain_hash FROM audit_events ORDER BY sequence DESC LIMIT 1',
    ).get() as { sequence: number; chain_hash: string } | undefined

    const prevHash = lastRow?.chain_hash ?? GENESIS_HASH
    const payloadHash = computePayloadHash(event)

    const insertResult = db.prepare(`
      INSERT INTO audit_events
        (event_id, timestamp, type, actor, action, detail, payload_hash, prev_hash, chain_hash, related_entity_id, anchor_batch_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
    `).run(
      event.event_id,
      event.timestamp,
      event.type,
      event.actor,
      event.action,
      event.detail,
      payloadHash,
      prevHash,
      '', // placeholder — we need the sequence first
      event.relatedEntityId ?? null,
    )

    const sequence = Number(insertResult.lastInsertRowid)
    const chainHash = computeChainHash(sequence, payloadHash, prevHash)

    db.prepare('UPDATE audit_events SET chain_hash = ? WHERE sequence = ?')
      .run(chainHash, sequence)

    return {
      ...event,
      sequence,
      payload_hash: payloadHash,
      prev_hash: prevHash,
      chain_hash: chainHash,
      anchor_batch_id: null,
    }
  })()

  return row
}

/* ─── Query ───────────────────────────────────────────────────────────────── */

function rowToEvent(row: Record<string, unknown>): AuditEventRow {
  return {
    sequence: row.sequence as number,
    event_id: row.event_id as string,
    timestamp: row.timestamp as string,
    type: row.type as AuditEventType,
    actor: row.actor as string,
    action: row.action as string,
    detail: row.detail as string,
    payload_hash: row.payload_hash as string,
    prev_hash: row.prev_hash as string,
    chain_hash: row.chain_hash as string,
    relatedEntityId: (row.related_entity_id as string) ?? undefined,
    anchor_batch_id: (row.anchor_batch_id as number) ?? null,
  }
}

export function getAuditTrail(filter?: { type?: string }): AuditEventRow[] {
  const db = getDb()
  if (filter?.type) {
    return (db.prepare('SELECT * FROM audit_events WHERE type = ? ORDER BY sequence DESC')
      .all(filter.type) as Record<string, unknown>[]).map(rowToEvent)
  }
  return (db.prepare('SELECT * FROM audit_events ORDER BY sequence DESC')
    .all() as Record<string, unknown>[]).map(rowToEvent)
}

export function getAuditEvent(eventId: string): AuditEventRow | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM audit_events WHERE event_id = ?')
    .get(eventId) as Record<string, unknown> | undefined
  return row ? rowToEvent(row) : null
}

/* ─── Verification ────────────────────────────────────────────────────────── */

export function verifyChain(): ChainVerification {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM audit_events ORDER BY sequence ASC',
  ).all() as Record<string, unknown>[]

  if (rows.length === 0) {
    return { valid: true, length: 0 }
  }

  let expectedPrevHash = GENESIS_HASH

  for (const raw of rows) {
    const row = rowToEvent(raw)

    if (row.prev_hash !== expectedPrevHash) {
      return {
        valid: false,
        length: rows.length,
        brokenAt: row.sequence,
        detail: `prev_hash mismatch at sequence ${row.sequence}`,
      }
    }

    const expectedPayloadHash = computePayloadHash(row)
    if (row.payload_hash !== expectedPayloadHash) {
      return {
        valid: false,
        length: rows.length,
        brokenAt: row.sequence,
        detail: `payload_hash mismatch at sequence ${row.sequence}`,
      }
    }

    const expectedChainHash = computeChainHash(row.sequence, row.payload_hash, row.prev_hash)
    if (row.chain_hash !== expectedChainHash) {
      return {
        valid: false,
        length: rows.length,
        brokenAt: row.sequence,
        detail: `chain_hash mismatch at sequence ${row.sequence}`,
      }
    }

    expectedPrevHash = row.chain_hash
  }

  return { valid: true, length: rows.length }
}
