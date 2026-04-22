import type { DataProvenanceKind } from '../../services/dataService'

export interface ToolPart {
  toolName: string
  toolCallId: string
  state: string
  input?: unknown
  output?: unknown
}

const TOOL_LABELS: Record<string, string> = {
  queryFinancials: 'Financials',
  queryResourceClassification: 'Resource Classification',
  queryPlantPerformance: 'Plant Performance',
  queryBatches: 'Compliance Batches',
  queryRisks: 'Risk Register',
  queryTimeline: 'Project Timeline',
  queryOfftakers: 'Offtakers',
  queryCapital: 'Capital Structure',
  queryDfsWorkstreams: 'DFS Workstreams',
  queryBenchmarks: 'Benchmarks',
  queryIssuerSnapshot: 'Issuer Snapshot',
  queryTelemetry: 'Telemetry',
  queryWeather: 'Weather',
  queryMarketData: 'Market Data',
  queryRegulatory: 'Regulatory',
  queryUThSafety: 'U/Th Safety',
  webSearch: 'Web Search',
  queryDSCR: 'DSCR Projections',
  queryDrawdown: 'Drawdown Schedule',
  queryPricing: 'Pricing Model',
  queryMarketSizing: 'Market Sizing',
  queryLithology: 'Lithology',
  queryDPPValidation: 'DPP Validation',
  queryStakeholders: 'Stakeholders',
  querySecurityArchitecture: 'Security',
  queryWeatherForecast: 'Weather Forecast',
  queryWeatherHistory: 'Climate History',
  analyzeEnvironmentalRisk: 'Environmental Risk',
  querySpringHealthPrediction: 'Spring Prediction',
  queryKnowledgeBase: 'Knowledge Base',
  mapAction: 'Map Viewport',
}

export function getToolLabel(toolName: string): string {
  return TOOL_LABELS[toolName] ?? toolName.replace(/^query/, '').replace(/([A-Z])/g, ' $1').trim()
}

export function summarizeOutput(output: unknown): string {
  if (output == null) return 'No data'
  const str = typeof output === 'string' ? output : JSON.stringify(output)
  return str.length > 120 ? str.slice(0, 117) + '...' : str
}

export function extractToolParts(parts: Array<{ type: string; [k: string]: unknown }>): ToolPart[] {
  return parts
    .filter(p => p.type === 'dynamic-tool' || (typeof p.type === 'string' && p.type.startsWith('tool-')))
    .map(p => ({
      toolName: (p.toolName as string) ?? p.type.replace(/^tool-/, ''),
      toolCallId: p.toolCallId as string,
      state: (p.state as string) ?? 'unknown',
      input: p.input,
      output: p.output,
    }))
}

export interface KBResult {
  id: string
  title: string
  authority: string
  provenance_kind?: string
  source_url?: string | null
}

export function extractKBResults(output: unknown): KBResult[] {
  if (!output || typeof output !== 'object') return []
  const obj = output as Record<string, unknown>
  if (!Array.isArray(obj.results)) return []
  return (obj.results as KBResult[]).filter(r => r.id && r.title)
}

export type { DataProvenanceKind }
