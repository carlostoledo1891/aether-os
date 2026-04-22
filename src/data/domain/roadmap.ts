export interface RoadmapItem {
  title: string
  description: string
  tag?: 'tech' | 'business' | 'compliance' | 'ai' | 'infra'
}

export interface RoadmapPhase {
  id: string
  quarter: string
  title: string
  status: 'shipped' | 'active' | 'planned' | 'future'
  items: RoadmapItem[]
}

export const PRODUCT_ROADMAP: RoadmapPhase[] = [
  {
    id: 'pilot-ready',
    quarter: 'Q2 2026',
    title: 'Pilot Ready',
    status: 'active',
    items: [
      { title: 'Multi-Instance Shell', description: 'One /app shell hosts multiple instances — /app/meteoric (mining) and /app/maritime (Atlantic ISR) ship from the same audit-chain runtime, with per-instance fixtures, lenses, and reference bundles.', tag: 'tech' },
      { title: 'LAPOC Live Instruments', description: 'Piezometers, water quality sensors — real-time data from ANSN field stations. Active development, first live channel for Caldeira pilot.', tag: 'infra' },
      { title: 'OPC-UA / MQTT Bridge', description: 'Industrial protocol bridge for SCADA historians and plant telemetry', tag: 'tech' },
      { title: 'Multi-Tenant Architecture', description: 'Project isolation with per-tenant data boundaries and access controls', tag: 'tech' },
      { title: 'Covenant Monitoring Dashboard', description: 'DSCR automation, financial covenant tracking with alert thresholds', tag: 'compliance' },
    ],
  },
  {
    id: 'enterprise-grade',
    quarter: 'Q3 2026',
    title: 'Enterprise Grade',
    status: 'planned',
    items: [
      { title: 'Government & Institutional Data APIs', description: 'Integration with ANM (mining titles), IBGE (terrain/demographics), ANA (hydrology permits), INMET (meteorological stations), and ANSN/LAPOC live sensors', tag: 'infra' },
      { title: 'Blockchain Anchoring', description: 'Merkle-root anchoring for audit chain immutability — tamper-proof provenance', tag: 'compliance' },
      { title: 'FedRAMP Moderate Pathway', description: 'AWS GovCloud deployment for US government supply chain requirements', tag: 'infra' },
      { title: 'Role-Based Access Control', description: 'Admin / Analyst / Viewer / Auditor roles with granular permissions', tag: 'tech' },
      { title: 'CEN/CENELEC Schema Validation', description: 'Automated validation against published EU DPP standard fields', tag: 'compliance' },
      { title: 'Server-Side PDF Generation', description: 'Puppeteer-based report export for offline audits and board packages', tag: 'tech' },
    ],
  },
  {
    id: 'market-expansion',
    quarter: 'Q4 2026',
    title: 'Market Expansion',
    status: 'planned',
    items: [
      { title: 'Multi-Commodity Support', description: 'Lithium, cobalt, nickel, graphite — same platform, new deposit profiles', tag: 'business' },
      { title: 'Multi-Project Dashboard', description: 'Portfolio view across multiple mining sites with cross-project analytics', tag: 'business' },
      { title: 'Community Portal', description: 'Public-facing transparency view for local communities and regulators', tag: 'compliance' },
      { title: 'Spatial Cross-Section Visualization', description: 'True geological cross-sections with drill trace overlay and lithology', tag: 'tech' },
      { title: 'Alarm Acknowledgement Workflow', description: 'Structured alert handling with audit trail and escalation rules', tag: 'infra' },
    ],
  },
  {
    id: 'platform-standard',
    quarter: '2027+',
    title: 'Platform Standard',
    status: 'future',
    items: [
      { title: 'Full DPP Compliance', description: '100% CEN/CENELEC field coverage — production-ready Digital Product Passports', tag: 'compliance' },
      { title: 'On-Chain Provenance', description: 'Public Merkle root verification — any buyer can validate the supply chain', tag: 'compliance' },
      { title: 'AI Covenant Reports', description: 'LLM-generated monitoring reports with source citations and approval workflow', tag: 'ai' },
      { title: 'Conference & Board Mode', description: 'Presentation themes for investor meetings, board sessions, and conferences', tag: 'business' },
      { title: 'White-Label Deployment', description: 'Enterprise clients deploy VeroChain under their own brand and domain', tag: 'business' },
      { title: 'Multi-Language', description: 'English, Portuguese, Spanish, French — full UI and report localization', tag: 'business' },
    ],
  },
]
