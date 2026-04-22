/**
 * Re-export unit model types from the shared canonical location.
 * The server tsconfig only includes `src/`, so this barrel bridges
 * the gap for server-side code that needs unit model types.
 */
export type {
  Severity,
  StateDef,
  TransitionRule,
  FieldDef,
  MetricDef,
  InspectorSectionType,
  InspectorSectionDef,
  AutoTriggerRule,
  UnitTypeDef,
  UnitSummary,
  UnitDetail,
  EdgeSummary,
  TransitionRecord,
  EvidenceRef,
  ConsequenceNode,
  BundleVerificationStatus,
  BundleDataMode,
  EvidenceBundleSummary,
  ChainProof,
  BundleAuditEvent,
  EvidenceBundleDetail,
  Lens,
  TransitionValidationResult,
} from '../../../shared/units/types.js'
