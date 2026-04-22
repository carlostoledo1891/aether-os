/**
 * Unit Store — core data layer for the Vero unit model.
 *
 * transitionUnit() is the ONLY way to change a unit's current_state.
 * It validates against the type's state machine, writes the transition
 * row, appends to the audit chain, and updates the unit atomically.
 */
import { randomUUID } from 'node:crypto'
import { getDb } from './db.js'
import { appendAuditEvent } from './auditChain.js'
import type {
  UnitTypeDef,
  Severity,
  UnitSummary,
  UnitDetail,
  EdgeSummary,
  TransitionRecord,
  EvidenceRef,
  ConsequenceNode,
  ChainProof,
  BundleAuditEvent,
  EvidenceBundleSummary,
  EvidenceBundleDetail,
  TransitionValidationResult,
  BundleVerificationStatus,
  BundleDataMode,
} from '../types/unitTypes.js'

export type {
  UnitTypeDef,
  UnitSummary,
  UnitDetail,
  EdgeSummary,
  TransitionRecord,
  EvidenceRef,
  ConsequenceNode,
  BundleAuditEvent,
  EvidenceBundleSummary,
  EvidenceBundleDetail,
  TransitionValidationResult,
  BundleDataMode,
}

/**
 * Resolve the data mode the *server* is running in. Wave 1 final-sprint
 * policy (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 2.2):
 * any bundle generated while `AETHER_DATA_MODE=mock` is stamped `'mock'`
 * and rejected by the public verifier route. Default is `'live'`.
 *
 * Exported so tests can flip the mode without poking globals from outside.
 */
export function resolveServerDataMode(): BundleDataMode {
  const raw = (process.env.AETHER_DATA_MODE ?? '').trim().toLowerCase()
  return raw === 'mock' ? 'mock' : 'live'
}

/* ─── Pure Validation (no DB) ─────────────────────────────────────────────── */

export function validateTransition(
  typeDef: UnitTypeDef,
  currentState: string,
  targetState: string,
  attachedEvidence: EvidenceRef[],
): TransitionValidationResult {
  const rule = typeDef.transitions.find(
    t => t.from === currentState && t.to === targetState,
  )
  if (!rule) {
    return {
      valid: false,
      reason: `No transition from '${currentState}' to '${targetState}' defined for type '${typeDef.id}'`,
    }
  }
  if (rule.requiredEvidence && rule.requiredEvidence.length > 0) {
    const attachedTypes = new Set(attachedEvidence.map(e => e.docType))
    const missing = rule.requiredEvidence.filter(r => !attachedTypes.has(r))
    if (missing.length > 0) {
      return {
        valid: false,
        reason: `Missing required evidence: ${missing.join(', ')}`,
      }
    }
  }
  return { valid: true }
}

/* ─── Row mappers ─────────────────────────────────────────────────────────── */

function extractCoordinates(dataJson: string): [number, number] | undefined {
  try {
    const data = JSON.parse(dataJson) as Record<string, unknown>
    const coords = (data.coordinates ?? data.center) as [number, number] | undefined
    if (Array.isArray(coords) && coords.length >= 2 && typeof coords[0] === 'number') {
      return [coords[0], coords[1]]
    }
  } catch { /* invalid JSON — skip */ }
  return undefined
}

function rowToUnitSummary(row: Record<string, unknown>): UnitSummary {
  return {
    id: row.id as string,
    typeId: row.type_id as string,
    label: row.label as string,
    currentState: row.current_state as string,
    severity: row.severity as Severity,
    placeId: (row.place_id as string) ?? undefined,
    owner: (row.owner as string) ?? undefined,
    updatedAt: row.updated_at as string,
    coordinates: extractCoordinates(row.data_json as string),
  }
}

function rowToEdge(row: Record<string, unknown>): EdgeSummary {
  return {
    id: row.id as number,
    fromId: row.from_id as string,
    toId: row.to_id as string,
    rel: row.rel as string,
    metadata: row.metadata_json
      ? (JSON.parse(row.metadata_json as string) as Record<string, unknown>)
      : undefined,
  }
}

function rowToTransition(row: Record<string, unknown>): TransitionRecord {
  return {
    id: row.id as number,
    unitId: row.unit_id as string,
    fromState: row.from_state as string,
    toState: row.to_state as string,
    actor: row.actor as string,
    reason: (row.reason as string) ?? undefined,
    auditEventId: (row.audit_event_id as string) ?? undefined,
    createdAt: row.created_at as string,
  }
}

function rowToEvidenceRef(row: Record<string, unknown>): EvidenceRef {
  return {
    id: row.id as number,
    unitId: row.unit_id as string,
    transitionId: (row.transition_id as number) ?? undefined,
    docType: row.doc_type as string,
    docId: row.doc_id as string,
    label: row.label as string,
    hash: (row.hash as string) ?? undefined,
    attachedAt: row.attached_at as string,
  }
}

/* ─── Unit Types ──────────────────────────────────────────────────────────── */

export function seedUnitType(def: UnitTypeDef): void {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO unit_types (id, label, color, icon, def_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label,
      color = excluded.color,
      icon = excluded.icon,
      def_json = excluded.def_json,
      updated_at = excluded.updated_at
  `).run(def.id, def.label, def.color, def.icon, JSON.stringify(def), now)
}

export function getUnitTypeDef(typeId: string): UnitTypeDef | null {
  const db = getDb()
  const row = db.prepare('SELECT def_json FROM unit_types WHERE id = ?').get(typeId) as
    { def_json: string } | undefined
  if (!row) return null
  return JSON.parse(row.def_json) as UnitTypeDef
}

export function getAllUnitTypeDefs(): UnitTypeDef[] {
  const db = getDb()
  const rows = db.prepare('SELECT def_json FROM unit_types ORDER BY id').all() as
    Array<{ def_json: string }>
  return rows.map(r => JSON.parse(r.def_json) as UnitTypeDef)
}

/* ─── Units CRUD ──────────────────────────────────────────────────────────── */

export function createUnit(opts: {
  id: string
  typeId: string
  label: string
  initialState: string
  severity?: Severity
  placeId?: string
  owner?: string
  data?: Record<string, unknown>
}): UnitSummary {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO units (id, type_id, label, current_state, severity, place_id, owner, data_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    opts.id,
    opts.typeId,
    opts.label,
    opts.initialState,
    opts.severity ?? 'nominal',
    opts.placeId ?? null,
    opts.owner ?? null,
    JSON.stringify(opts.data ?? {}),
    now,
    now,
  )
  return {
    id: opts.id,
    typeId: opts.typeId,
    label: opts.label,
    currentState: opts.initialState,
    severity: opts.severity ?? 'nominal',
    placeId: opts.placeId,
    owner: opts.owner,
    updatedAt: now,
  }
}

export function getUnit(id: string): UnitDetail | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM units WHERE id = ?').get(id) as
    Record<string, unknown> | undefined
  if (!row) return null

  const typeDef = getUnitTypeDef(row.type_id as string)
  if (!typeDef) return null

  const edgeCount = (db.prepare(
    'SELECT COUNT(*) as cnt FROM unit_edges WHERE from_id = ? OR to_id = ?',
  ).get(id, id) as { cnt: number }).cnt

  const evidenceCount = (db.prepare(
    'SELECT COUNT(*) as cnt FROM evidence_refs WHERE unit_id = ?',
  ).get(id) as { cnt: number }).cnt

  const lastTransRow = db.prepare(
    'SELECT * FROM unit_transitions WHERE unit_id = ? ORDER BY id DESC LIMIT 1',
  ).get(id) as Record<string, unknown> | undefined

  return {
    ...rowToUnitSummary(row),
    data: JSON.parse(row.data_json as string) as Record<string, unknown>,
    typeDef,
    edgeCount,
    evidenceCount,
    lastTransition: lastTransRow ? rowToTransition(lastTransRow) : undefined,
  }
}

export function listUnits(filters?: {
  typeId?: string
  state?: string
  severity?: string
  owner?: string
}): UnitSummary[] {
  const db = getDb()
  const conditions: string[] = []
  const params: unknown[] = []

  if (filters?.typeId) { conditions.push('type_id = ?'); params.push(filters.typeId) }
  if (filters?.state) { conditions.push('current_state = ?'); params.push(filters.state) }
  if (filters?.severity) { conditions.push('severity = ?'); params.push(filters.severity) }
  if (filters?.owner) { conditions.push('owner = ?'); params.push(filters.owner) }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = db.prepare(
    `SELECT * FROM units ${where} ORDER BY type_id, label`,
  ).all(...params) as Array<Record<string, unknown>>

  return rows.map(rowToUnitSummary)
}

export function getUnitByPlace(placeId: string): UnitDetail | null {
  const db = getDb()
  const row = db.prepare('SELECT id FROM units WHERE place_id = ? LIMIT 1').get(placeId) as
    { id: string } | undefined
  if (!row) return null
  return getUnit(row.id)
}

export function getUnitStats(): Record<string, Record<string, number>> {
  const db = getDb()
  const rows = db.prepare(
    'SELECT type_id, severity, COUNT(*) as cnt FROM units GROUP BY type_id, severity',
  ).all() as Array<{ type_id: string; severity: string; cnt: number }>

  const result: Record<string, Record<string, number>> = {}
  for (const r of rows) {
    if (!result[r.type_id]) result[r.type_id] = {}
    result[r.type_id][r.severity] = r.cnt
  }
  return result
}

/* ─── Edges ───────────────────────────────────────────────────────────────── */

export function createEdge(
  fromId: string,
  toId: string,
  rel: string,
  metadata?: Record<string, unknown>,
): void {
  const db = getDb()
  db.prepare(`
    INSERT OR IGNORE INTO unit_edges (from_id, to_id, rel, metadata_json)
    VALUES (?, ?, ?, ?)
  `).run(fromId, toId, rel, metadata ? JSON.stringify(metadata) : null)
}

export function getEdges(unitId: string): { incoming: EdgeSummary[]; outgoing: EdgeSummary[] } {
  const db = getDb()
  const outgoing = (db.prepare(
    'SELECT * FROM unit_edges WHERE from_id = ?',
  ).all(unitId) as Array<Record<string, unknown>>).map(rowToEdge)
  const incoming = (db.prepare(
    'SELECT * FROM unit_edges WHERE to_id = ?',
  ).all(unitId) as Array<Record<string, unknown>>).map(rowToEdge)
  return { incoming, outgoing }
}

/* ─── Transitions ─────────────────────────────────────────────────────────── */

export function transitionUnit(
  unitId: string,
  toState: string,
  actor: string,
  reason?: string,
): TransitionRecord {
  const db = getDb()

  const unitRow = db.prepare('SELECT * FROM units WHERE id = ?').get(unitId) as
    Record<string, unknown> | undefined
  if (!unitRow) throw new Error(`Unit '${unitId}' not found`)

  const typeDef = getUnitTypeDef(unitRow.type_id as string)
  if (!typeDef) throw new Error(`Unit type '${unitRow.type_id}' not found`)

  const currentState = unitRow.current_state as string
  const evidence = getEvidence(unitId)

  const validation = validateTransition(typeDef, currentState, toState, evidence)
  if (!validation.valid) {
    throw new Error(validation.reason)
  }

  const targetStateDef = typeDef.states.find(s => s.id === toState)
  const newSeverity: Severity = targetStateDef?.severity ?? 'nominal'

  const now = new Date().toISOString()
  const eventId = `unit-trans-${randomUUID()}`

  const record = db.transaction(() => {
    const insertResult = db.prepare(`
      INSERT INTO unit_transitions (unit_id, from_state, to_state, actor, reason, audit_event_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(unitId, currentState, toState, actor, reason ?? null, eventId, now)

    db.prepare(`
      UPDATE units SET current_state = ?, severity = ?, updated_at = ? WHERE id = ?
    `).run(toState, newSeverity, now, unitId)

    appendAuditEvent({
      event_id: eventId,
      timestamp: now,
      type: 'unit_transition',
      actor,
      action: `Transition ${unitId}: ${currentState} → ${toState}`,
      detail: reason ?? `State change on unit ${unitId}`,
      relatedEntityId: unitId,
    })

    return {
      id: Number(insertResult.lastInsertRowid),
      unitId,
      fromState: currentState,
      toState,
      actor,
      reason,
      auditEventId: eventId,
      createdAt: now,
    } satisfies TransitionRecord
  })()

  return record
}

export function getTransitions(unitId: string): TransitionRecord[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM unit_transitions WHERE unit_id = ? ORDER BY id DESC',
  ).all(unitId) as Array<Record<string, unknown>>
  return rows.map(rowToTransition)
}

/* ─── Evidence ────────────────────────────────────────────────────────────── */

export function attachEvidence(
  unitId: string,
  evidence: {
    transitionId?: number
    docType: string
    docId: string
    label: string
    hash?: string
  },
): EvidenceRef {
  const db = getDb()
  const now = new Date().toISOString()
  const eventId = `evidence-${randomUUID()}`

  const result = db.transaction(() => {
    const insertResult = db.prepare(`
      INSERT INTO evidence_refs (unit_id, transition_id, doc_type, doc_id, label, hash, attached_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      unitId,
      evidence.transitionId ?? null,
      evidence.docType,
      evidence.docId,
      evidence.label,
      evidence.hash ?? null,
      now,
    )

    appendAuditEvent({
      event_id: eventId,
      timestamp: now,
      type: 'evidence_attached',
      actor: 'system',
      action: `Evidence attached to ${unitId}`,
      detail: `${evidence.docType}: ${evidence.label}`,
      relatedEntityId: unitId,
    })

    return {
      id: Number(insertResult.lastInsertRowid),
      unitId,
      transitionId: evidence.transitionId,
      docType: evidence.docType,
      docId: evidence.docId,
      label: evidence.label,
      hash: evidence.hash,
      attachedAt: now,
    } satisfies EvidenceRef
  })()

  return result
}

export function getEvidence(unitId: string): EvidenceRef[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM evidence_refs WHERE unit_id = ? ORDER BY id DESC',
  ).all(unitId) as Array<Record<string, unknown>>
  return rows.map(rowToEvidenceRef)
}

/* ─── Consequence Graph (BFS) ─────────────────────────────────────────────── */

export function getConsequences(unitId: string, maxDepth = 5): ConsequenceNode[] {
  const db = getDb()
  const visited = new Set<string>()
  const result: ConsequenceNode[] = []

  const queue: Array<{ id: string; depth: number }> = [{ id: unitId, depth: 0 }]
  visited.add(unitId)

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current.depth > maxDepth) continue

    const outEdges = (db.prepare(
      'SELECT * FROM unit_edges WHERE from_id = ?',
    ).all(current.id) as Array<Record<string, unknown>>).map(rowToEdge)

    for (const edge of outEdges) {
      if (visited.has(edge.toId)) continue
      visited.add(edge.toId)

      const targetRow = db.prepare(
        'SELECT id, label, type_id, severity FROM units WHERE id = ?',
      ).get(edge.toId) as { id: string; label: string; type_id: string; severity: string } | undefined

      if (!targetRow) continue

      const nodeEdges = (db.prepare(
        'SELECT * FROM unit_edges WHERE from_id = ? OR to_id = ?',
      ).all(edge.toId, edge.toId) as Array<Record<string, unknown>>).map(rowToEdge)

      result.push({
        unitId: targetRow.id,
        label: targetRow.label,
        typeId: targetRow.type_id,
        severity: targetRow.severity as Severity,
        depth: current.depth + 1,
        edges: nodeEdges,
      })

      if (current.depth + 1 < maxDepth) {
        queue.push({ id: edge.toId, depth: current.depth + 1 })
      }
    }
  }

  return result
}

/* ─── Evidence Bundles ────────────────────────────────────────────────────── */

export function createBundle(rootUnitId: string, claim: string): EvidenceBundleDetail {
  const db = getDb()
  const bundleId = `BDL-${Date.now()}-${randomUUID().slice(0, 8)}`
  const now = new Date().toISOString()

  const rootUnit = getUnit(rootUnitId)
  if (!rootUnit) throw new Error(`Root unit '${rootUnitId}' not found`)

  const consequences = getConsequences(rootUnitId, 3)
  const allUnitIds = [rootUnitId, ...consequences.map(c => c.unitId)]

  const unitSnapshots: Record<string, unknown> = {}
  const allEdges: EdgeSummary[] = []
  const allEvidence: EvidenceRef[] = []

  for (const uid of allUnitIds) {
    const u = getUnit(uid)
    if (u) {
      unitSnapshots[uid] = {
        id: u.id,
        typeId: u.typeId,
        label: u.label,
        currentState: u.currentState,
        severity: u.severity,
        data: u.data,
      }
      const edges = getEdges(uid)
      allEdges.push(...edges.outgoing)
      allEvidence.push(...getEvidence(uid))
    }
  }

  const snapshot = {
    units: unitSnapshots,
    edges: allEdges,
    evidence: allEvidence,
    generatedAt: now,
  }

  const auditRows = db.prepare(
    'SELECT * FROM audit_events WHERE related_entity_id IN (' +
    allUnitIds.map(() => '?').join(',') +
    ') ORDER BY sequence ASC',
  ).all(...allUnitIds) as Array<Record<string, unknown>>

  const chainProof: ChainProof = auditRows.length > 0
    ? {
        startSequence: auditRows[0].sequence as number,
        endSequence: auditRows[auditRows.length - 1].sequence as number,
        eventCount: auditRows.length,
        startHash: auditRows[0].chain_hash as string,
        endHash: auditRows[auditRows.length - 1].chain_hash as string,
        valid: true,
      }
    : {
        startSequence: 0,
        endSequence: 0,
        eventCount: 0,
        startHash: '',
        endHash: '',
        valid: true,
      }

  const narrative = generateNarrative(rootUnit, consequences, allEvidence)

  const eventId = `bundle-${randomUUID()}`
  const dataMode = resolveServerDataMode()

  db.transaction(() => {
    db.prepare(`
      INSERT INTO evidence_bundles (id, root_unit_id, claim, snapshot_json, chain_proof_json, narrative, created_at, verification_status, data_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(
      bundleId,
      rootUnitId,
      claim,
      JSON.stringify(snapshot),
      JSON.stringify(chainProof),
      narrative,
      now,
      dataMode,
    )

    appendAuditEvent({
      event_id: eventId,
      timestamp: now,
      type: 'bundle_generated',
      actor: 'system',
      action: `Evidence bundle ${bundleId} generated`,
      detail: `Root unit: ${rootUnitId}. Claim: ${claim}. Mode: ${dataMode}`,
      relatedEntityId: rootUnitId,
    })
  })()

  return {
    id: bundleId,
    rootUnitId,
    claim,
    createdAt: now,
    verificationStatus: 'pending',
    snapshot,
    chainProof,
    narrative,
    verifiedAt: null,
    dataMode,
  }
}

function rowDataMode(row: Record<string, unknown>): BundleDataMode {
  // Historical rows pre-date the data_mode column; default to 'live'.
  const v = (row.data_mode as string | undefined)?.toLowerCase()
  return v === 'mock' ? 'mock' : 'live'
}

export function getBundle(id: string): EvidenceBundleDetail | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM evidence_bundles WHERE id = ?').get(id) as
    Record<string, unknown> | undefined
  if (!row) return null

  return {
    id: row.id as string,
    rootUnitId: row.root_unit_id as string,
    claim: row.claim as string,
    createdAt: row.created_at as string,
    verificationStatus: row.verification_status as BundleVerificationStatus,
    snapshot: JSON.parse(row.snapshot_json as string) as Record<string, unknown>,
    chainProof: JSON.parse(row.chain_proof_json as string) as ChainProof,
    narrative: (row.narrative as string) ?? null,
    verifiedAt: (row.verified_at as string) ?? null,
    dataMode: rowDataMode(row),
  }
}

/**
 * Map a raw `audit_events` row into the public `BundleAuditEvent` shape.
 * Mirrors `rowToEvent` in `auditChain.ts` but produces the bundle-friendly
 * type so the public verifier can re-walk the chain client-side.
 */
function rowToBundleAuditEvent(row: Record<string, unknown>): BundleAuditEvent {
  return {
    sequence: row.sequence as number,
    event_id: row.event_id as string,
    timestamp: row.timestamp as string,
    type: row.type as string,
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

/**
 * Fetch every audit_events row covered by a bundle's chain proof in ascending
 * sequence order. Returns an empty array when the bundle covers no events.
 */
export function getBundleAuditEvents(bundle: EvidenceBundleDetail): BundleAuditEvent[] {
  const proof = bundle.chainProof
  if (proof.eventCount <= 0) return []
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM audit_events WHERE sequence BETWEEN ? AND ? ORDER BY sequence ASC',
  ).all(proof.startSequence, proof.endSequence) as Array<Record<string, unknown>>
  return rows.map(rowToBundleAuditEvent)
}

/**
 * Fetch a bundle by its content-addressed root — the `chainProof.endHash` of
 * the latest event the bundle vouches for. This is the canonical public
 * address used by the verifier UI (`verochain.co/verify/<chain_hash>`).
 *
 * Implementation note: SQLite does not extract JSON natively without the
 * json1 extension, so we use the LIKE-on-snippet trick. The endHash is a
 * 64-hex string that appears verbatim in `chain_proof_json` exactly once
 * inside `"endHash":"<hash>"`, so this is safe and unambiguous.
 */
export function getBundleByChainHash(hash: string): EvidenceBundleDetail | null {
  if (!/^[0-9a-f]{64}$/i.test(hash)) return null
  const db = getDb()
  const needle = `%"endHash":"${hash}"%`
  const row = db.prepare(
    'SELECT id FROM evidence_bundles WHERE chain_proof_json LIKE ? ORDER BY created_at DESC LIMIT 1',
  ).get(needle) as { id: string } | undefined
  if (!row) return null
  return getBundle(row.id)
}

export function verifyBundle(id: string): EvidenceBundleDetail | null {
  const db = getDb()
  const bundle = getBundle(id)
  if (!bundle) return null

  const now = new Date().toISOString()
  const proof = bundle.chainProof
  let isValid = true

  if (proof.eventCount > 0) {
    const rows = db.prepare(
      'SELECT sequence, chain_hash FROM audit_events WHERE sequence BETWEEN ? AND ? ORDER BY sequence ASC',
    ).all(proof.startSequence, proof.endSequence) as Array<{ sequence: number; chain_hash: string }>

    isValid = rows.length === proof.eventCount
      && rows[0]?.chain_hash === proof.startHash
      && rows[rows.length - 1]?.chain_hash === proof.endHash
  }

  const status: BundleVerificationStatus = isValid ? 'valid' : 'invalid'
  const eventId = `verify-${randomUUID()}`

  db.transaction(() => {
    db.prepare(`
      UPDATE evidence_bundles SET verified_at = ?, verification_status = ?, chain_proof_json = ? WHERE id = ?
    `).run(now, status, JSON.stringify({ ...proof, valid: isValid }), id)

    appendAuditEvent({
      event_id: eventId,
      timestamp: now,
      type: 'bundle_verified',
      actor: 'system',
      action: `Bundle ${id} verified: ${status}`,
      detail: `Chain proof: ${proof.eventCount} events, ${isValid ? 'valid' : 'INVALID'}`,
      relatedEntityId: bundle.rootUnitId,
    })
  })()

  return {
    ...bundle,
    verifiedAt: now,
    verificationStatus: status,
    chainProof: { ...proof, valid: isValid },
  }
}

/* ─── Narrative Generation (deterministic, no LLM) ────────────────────────── */

function generateNarrative(
  root: UnitDetail,
  consequences: ConsequenceNode[],
  evidence: EvidenceRef[],
): string {
  const lines: string[] = []
  lines.push(`Evidence bundle for ${root.typeDef.label}: ${root.label}.`)
  lines.push(`Current state: ${root.currentState} (${root.severity}).`)

  if (root.data && Object.keys(root.data).length > 0) {
    const highlights = Object.entries(root.data)
      .slice(0, 5)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    lines.push(`Key data: ${highlights}.`)
  }

  if (consequences.length > 0) {
    lines.push(`Dependency graph includes ${consequences.length} connected units:`)
    for (const c of consequences.slice(0, 10)) {
      lines.push(`  - ${c.label} (${c.typeId}, ${c.severity})`)
    }
    if (consequences.length > 10) {
      lines.push(`  ... and ${consequences.length - 10} more.`)
    }
  }

  if (evidence.length > 0) {
    lines.push(`${evidence.length} evidence document(s) attached.`)
  }

  return lines.join('\n')
}

/* ─── Helpers for seeder ──────────────────────────────────────────────────── */

export function getUnitCount(): number {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as cnt FROM units').get() as { cnt: number }
  return row.cnt
}

export function getEdgeCount(): number {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as cnt FROM unit_edges').get() as { cnt: number }
  return row.cnt
}
