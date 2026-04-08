import { W } from '../../app/canvas/canvasTheme'
import type { ConditionPrecedent, AuditEventType, ScenarioKey } from '../../services/dataService'
import {
  DollarSign, Mountain, ShieldAlert, Handshake, Landmark, FileBarChart, ScrollText, Leaf, Building2,
} from 'lucide-react'

export type ExecTab = 'assets' | 'financials' | 'risk' | 'pipeline' | 'capital' | 'dfs' | 'permits' | 'audit' | 'esg'

export const TAB_ITEMS: { id: ExecTab; label: string; icon: typeof DollarSign; color: string }[] = [
  { id: 'assets',     label: 'Assets',      icon: Mountain,     color: W.amber },
  { id: 'financials', label: 'Financials',   icon: DollarSign,   color: W.green },
  { id: 'risk',       label: 'Risk',         icon: ShieldAlert,  color: W.red },
  { id: 'pipeline',   label: 'Pipeline',     icon: Handshake,    color: W.cyan },
  { id: 'capital',    label: 'Capital',      icon: Landmark,     color: W.violet },
  { id: 'dfs',        label: 'DFS',          icon: FileBarChart, color: W.green },
  { id: 'permits',    label: 'Agencies',     icon: Building2,    color: W.amber },
  { id: 'audit',      label: 'Audit',        icon: ScrollText,   color: W.text2 },
  { id: 'esg',        label: 'ESG',          icon: Leaf,         color: W.cyan },
]

export const SCENARIO_LABELS: { key: ScenarioKey; label: string }[] = [
  { key: 'bear', label: 'Spot' },
  { key: 'consensus', label: 'Consensus' },
  { key: 'bull', label: 'Forecast' },
]

export const RISK_COLOR: Record<string, string> = {
  permitting: W.amber, market: W.red, technical: W.violet,
  geopolitical: W.cyan, environmental: W.green, operational: W.text3,
}

export const CP_STATUS_COLOR: Record<ConditionPrecedent['status'], string> = {
  met: W.green, in_progress: W.violet, pending: W.text4,
}
export const CP_STATUS_LABEL: Record<ConditionPrecedent['status'], string> = {
  met: 'MET', in_progress: 'IN PROGRESS', pending: 'PENDING',
}

export const AUDIT_TYPE_COLOR: Record<AuditEventType, string> = {
  batch_created: W.violet, passport_issued: W.green, api_handoff: W.cyan,
  alert_triggered: W.red, alert_resolved: W.green, compliance_check: W.green,
  user_action: W.amber, system_event: W.text3, regulatory_submission: W.violet,
  offtake_update: W.cyan,
}

export const AUDIT_TYPE_LABEL: Record<AuditEventType, string> = {
  batch_created: 'BATCH', passport_issued: 'PASSPORT', api_handoff: 'API',
  alert_triggered: 'ALERT', alert_resolved: 'RESOLVED', compliance_check: 'COMPLIANCE',
  user_action: 'ACTION', system_event: 'SYSTEM', regulatory_submission: 'REGULATORY',
  offtake_update: 'OFFTAKE',
}

export const ESG_CATEGORY_COLOR: Record<string, string> = {
  water: W.cyan, waste: W.amber, climate: W.green, governance: W.violet, social: W.text2,
}

export const COVERAGE_STATUS_COLOR: Record<string, string> = {
  mapped: W.green, partial: W.amber, pending: W.red,
}

export function riskScoreColor(score: number) {
  if (score >= 12) return W.red
  if (score >= 8) return W.amber
  return W.green
}
