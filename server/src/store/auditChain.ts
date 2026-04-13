import { createHash } from 'node:crypto'
import { getDb } from './db.js'

/* ─── Types ───────────────────────────────────────────────────────────────── */

export type AuditEventType =
  | 'batch_created'
  | 'passport_issued'
  | 'api_handoff'
  | 'alert_triggered'
  | 'alert_resolved'
  | 'compliance_check'
  | 'user_action'
  | 'system_event'
  | 'regulatory_submission'
  | 'offtake_update'
  | 'dpp_export'
  | 'regulatory_bundle_export'
  | 'auth_failure'
  | 'ws_connection'
  | 'chain_verification'
  | 'audit_export'
  | 'knowledge_ingested'
  | 'knowledge_verified'
  | 'knowledge_cited'
  | 'knowledge_updated'
  | 'knowledge_deleted'

export interface AuditEventInput {
  event_id: string
  timestamp: string
  type: AuditEventType
  actor: string
  action: string
  detail: string
  relatedEntityId?: string
}

export interface AuditEventRow extends AuditEventInput {
  sequence: number
  payload_hash: string
  prev_hash: string
  chain_hash: string
  anchor_batch_id: number | null
}

const GENESIS_HASH = '0'.repeat(64)

/* ─── Hashing ─────────────────────────────────────────────────────────────── */

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

/**
 * Canonical JSON: sorted keys, no whitespace. Guarantees deterministic hashing
 * regardless of property insertion order.
 */
export function computePayloadHash(event: AuditEventInput): string {
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
  return sha256(JSON.stringify(canonical))
}

function computeChainHash(sequence: number, payloadHash: string, prevHash: string): string {
  return sha256(`${sequence}|${payloadHash}|${prevHash}`)
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

export interface ChainVerification {
  valid: boolean
  length: number
  brokenAt?: number
  detail?: string
}

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
