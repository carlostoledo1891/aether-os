/**
 * Vero Unit Model — Shared Type Definitions
 *
 * These types are consumed by both the server (store, routes, seeder)
 * and the frontend (hooks, inspector, lens system). They define the
 * universal schema for units, state machines, evidence, and bundles.
 *
 * The UnitTypeDef is the central contract: it drives the database schema
 * validation, API shape, and every inspector section in the UI.
 */

/* ─── Severity ────────────────────────────────────────────────────────────── */

export type Severity = 'nominal' | 'attention' | 'action_required' | 'blocked'

/* ─── Unit Type Definition (drives everything) ────────────────────────────── */

export interface StateDef {
  id: string
  label: string
  severity: Severity
}

export interface TransitionRule {
  from: string
  to: string
  label: string
  requiredEvidence?: string[]
  actorRole?: string
}

export interface FieldDef {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'enum' | 'coordinates'
  unit?: string
  enumValues?: string[]
  format?: string
}

export interface MetricDef {
  key: string
  label: string
  unit: string
  format?: string
}

export type InspectorSectionType =
  | 'fields'
  | 'timeline'
  | 'evidence'
  | 'graph'
  | 'telemetry'
  | 'children'
  | 'risks'

export interface InspectorSectionDef {
  type: InspectorSectionType
  label: string
  filter?: string
}

export interface AutoTriggerRule {
  on: string
  condition: string
  action: string
  targetState?: string
}

export interface UnitTypeDef {
  id: string
  label: string
  color: string
  icon: string
  states: StateDef[]
  transitions: TransitionRule[]
  schema: FieldDef[]
  metrics: MetricDef[]
  inspectorSections: InspectorSectionDef[]
  autoTriggers?: AutoTriggerRule[]
}

/* ─── Unit Records ────────────────────────────────────────────────────────── */

export interface UnitSummary {
  id: string
  typeId: string
  label: string
  currentState: string
  severity: Severity
  placeId?: string
  owner?: string
  updatedAt: string
  /** [lng, lat] extracted from data_json.coordinates / data_json.center if available */
  coordinates?: [number, number]
}

export interface UnitDetail extends UnitSummary {
  data: Record<string, unknown>
  typeDef: UnitTypeDef
  edgeCount: number
  evidenceCount: number
  lastTransition?: TransitionRecord
}

/* ─── Edges ───────────────────────────────────────────────────────────────── */

export interface EdgeSummary {
  id: number
  fromId: string
  toId: string
  rel: string
  metadata?: Record<string, unknown>
}

/* ─── Transitions ─────────────────────────────────────────────────────────── */

export interface TransitionRecord {
  id: number
  unitId: string
  fromState: string
  toState: string
  actor: string
  reason?: string
  auditEventId?: string
  createdAt: string
}

/* ─── Evidence ────────────────────────────────────────────────────────────── */

export interface EvidenceRef {
  id: number
  unitId: string
  transitionId?: number
  docType: string
  docId: string
  label: string
  hash?: string
  attachedAt: string
}

/* ─── Consequence Graph ───────────────────────────────────────────────────── */

export interface ConsequenceNode {
  unitId: string
  label: string
  typeId: string
  severity: Severity
  depth: number
  edges: EdgeSummary[]
}

/* ─── Evidence Bundles ────────────────────────────────────────────────────── */

export type BundleVerificationStatus = 'pending' | 'valid' | 'invalid'

/**
 * Whether the bundle was generated against live operational data or a mock
 * fixture. Wave 1 final-sprint rule: only `live` bundles are publishable
 * through the public verifier (`/api/public/bundles/*`). The server
 * enforces this with a 403 (see `server/src/routes/units.ts`).
 */
export type BundleDataMode = 'live' | 'mock'

export interface EvidenceBundleSummary {
  id: string
  rootUnitId: string
  claim: string
  createdAt: string
  verificationStatus: BundleVerificationStatus
  /**
   * Optional for back-compat with bundles created before the data_mode
   * column was added. Defaults to `'live'` server-side for those rows.
   */
  dataMode?: BundleDataMode
}

export interface ChainProof {
  startSequence: number
  endSequence: number
  eventCount: number
  startHash: string
  endHash: string
  valid: boolean
}

/**
 * Full audit-event row shape exposed to bundle consumers (in particular the
 * public verifier). Mirrors `AuditEventRow` from `shared/audit/types.ts` but
 * is duplicated here so the unit type module stays free of cross-imports.
 * Server-side code should treat this as structurally equivalent to
 * `AuditEventRow`.
 */
export interface BundleAuditEvent {
  sequence: number
  event_id: string
  timestamp: string
  type: string
  actor: string
  action: string
  detail: string
  payload_hash: string
  prev_hash: string
  chain_hash: string
  relatedEntityId?: string
  anchor_batch_id: number | null
}

export interface EvidenceBundleDetail extends EvidenceBundleSummary {
  snapshot: Record<string, unknown>
  chainProof: ChainProof
  narrative: string | null
  verifiedAt: string | null
  /**
   * Full audit-event rows referenced by the bundle, in ascending sequence
   * order. Populated by the public read endpoint so that browsers can re-walk
   * the chain end-to-end without further server round trips. Optional for
   * backward compatibility with the in-app `BundleExporter` flow.
   */
  events?: BundleAuditEvent[]
}

/* ─── Lens (frontend view filter) ─────────────────────────────────────────── */

export interface Lens {
  id: string
  label: string
  unitTypes: string[]
  /** Subset of unitTypes that should start toggled OFF (still selectable by the user). */
  defaultOffTypes?: string[]
  severityFilter?: Severity[]
  kpiMetrics: string[]
}

/* ─── Validation ──────────────────────────────────────────────────────────── */

export type TransitionValidationResult =
  | { valid: true }
  | { valid: false; reason: string }
