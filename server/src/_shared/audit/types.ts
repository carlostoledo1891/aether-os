/**
 * Vero audit-chain types — shared between server (node) and frontend (browser).
 *
 * These types are part of the OPEN AUDIT EVENT v1 specification documented in
 * `docs/spec/audit-event-v1.md`. They are MIT-licensed and intended for
 * external implementations that wish to verify Vero-issued evidence bundles.
 *
 * The server's existing implementation lives in
 * `server/src/store/auditChain.ts` and now imports the canonical-JSON helpers
 * from `shared/audit/canonicalJson.ts` so the wire contract is single-sourced.
 */

/* ─── Audit event types ───────────────────────────────────────────────────── */

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
  | 'unit_transition'
  | 'evidence_attached'
  | 'bundle_generated'
  | 'bundle_verified'
  | 'bundle_published'

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

/* ─── Verification result ─────────────────────────────────────────────────── */

export interface ChainVerification {
  valid: boolean
  length: number
  brokenAt?: number
  detail?: string
}

/* ─── Constants from the spec ─────────────────────────────────────────────── */

/** Hex-encoded sha256 of the empty pre-genesis state. 64 zero characters. */
export const GENESIS_HASH = '0'.repeat(64)
