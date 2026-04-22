import { W } from '../theme/publicTheme'

const V = W.violet

export const HERO_STATS = [
  { value: 'Geofenced', label: 'Every Asset', sub: 'Typed unit · spatial layer · bound-aware' },
  { value: 'Real-Time', label: 'Every Sensor', sub: 'REST · WebSocket · CSV · SCADA-ready' },
  { value: 'SHA-256', label: 'Evidence Chain', sub: 'Append-only · downstream-verifiable' },
  { value: '5-Mode', label: 'Provenance', sub: 'Mock · modeled · simulated · live · field-verified' },
]

export type IndustryTier = 'lead' | 'adjacent'

export const INDUSTRIES: Array<{ title: string; tier: IndustryTier; tagline: string; desc: string; useCases: string[]; accent: string }> = [
  {
    title: 'Mining & Critical Minerals',
    tier: 'lead',
    tagline: 'Lead vertical · Caldeira reference deployment',
    desc: 'Drill collars, license polygons, permit evidence, JORC-grade reports. The deployed reference for rare earth, lithium, and battery metals.',
    useCases: ['Drill collar telemetry', 'License & permit evidence', 'JORC resource dossiers', 'FEOC origin tracking'],
    accent: V,
  },
  {
    title: 'Agriculture & Water',
    tier: 'lead',
    tagline: 'Lead vertical · Hydrology stack ready',
    desc: 'Paddocks, soil moisture, irrigation events, organic and regenerative certification chain. Built on the same hydrology and environmental layers as Caldeira.',
    useCases: ['Paddock geofencing', 'Soil & water monitoring', 'Organic / regenerative certification chain', 'Water-rights compliance evidence'],
    accent: V,
  },
  {
    title: 'Defense & Public Sector',
    tier: 'lead',
    tagline: 'Lead vertical · NIST 800-53 + CMMC L2 mapped',
    desc: 'Areas of interest, sensor feeds, asset state changes, audit-chain reporting. Security posture mapped for federal procurement pathways.',
    useCases: ['AOI geofencing', 'Asset state monitoring', 'Audit-chain reporting', 'FEOC / supply-chain assurance'],
    accent: V,
  },
  {
    title: 'Logistics & Cold Chain',
    tier: 'adjacent',
    tagline: 'Also runs on Vero',
    desc: 'Routes, batch handoffs, cold-chain telemetry, delivery evidence. The same typed-unit + audit-chain pattern handles batch lots and fleet assets.',
    useCases: ['Batch handoff ledger', 'Cold-chain telemetry', 'Delivery evidence dossiers'],
    accent: V,
  },
  {
    title: 'Transportation & Infrastructure',
    tier: 'adjacent',
    tagline: 'Also runs on Vero',
    desc: 'Asset registries, permit evidence, change logs for roads, rail, pipelines, and grid build-outs. Map-first inspection workflows with provenance.',
    useCases: ['Asset registries', 'Inspection workflows', 'Permit & change-log evidence'],
    accent: V,
  },
  {
    title: 'Industrial Operations',
    tier: 'adjacent',
    tagline: 'Also runs on Vero',
    desc: 'Process plant telemetry, equipment lifecycle, batch traceability, and HSE evidence — for any operation that has to prove what happened, when.',
    useCases: ['Equipment lifecycle', 'Batch traceability', 'HSE evidence dossiers'],
    accent: V,
  },
]

export const CAPABILITIES = [
  {
    tag: 'Map & Geofence',
    headline: 'Every asset on the map. Every boundary as a unit.',
    desc: 'Typed operational units — drill collars, paddocks, AOIs, license polygons, equipment, batches, springs — with spatial layers, geofencing, and per-vertical lenses. Map-first by default; tabular when you need it.',
    features: ['Typed units with state machines', 'Spatial layers (vector + raster)', 'Geofencing with bound alerts', 'Vertical-specific lenses (mining / ag / defense)'],
    metrics: [{ value: 'Typed', label: 'Records' }, { value: 'Geo', label: 'Aware' }, { value: 'Per-Vertical', label: 'Lenses' }],
  },
  {
    tag: 'Monitor & Verify',
    headline: 'Stream every sensor. Hash every change.',
    desc: 'Ingestion from REST, WebSocket, CSV, and SCADA-ready adapters. Every reading lands as a typed unit with a provenance label. Every state change appends to a SHA-256 audit chain that anyone can verify — without trusting our database.',
    features: ['REST · WebSocket · CSV · SCADA-ready', 'SHA-256 append-only audit chain', 'Provenance label on every reading', 'Self-verifying snapshot exports'],
    metrics: [{ value: 'SHA-256', label: 'Hash Chain' }, { value: 'Verify', label: 'API' }, { value: '5-Mode', label: 'Provenance' }],
  },
  {
    tag: 'Decide & Report',
    headline: 'Tool-grounded AI. Exportable evidence.',
    desc: 'A domain-grounded AI agent that cites the unit and evidence record behind every answer. One scene runtime renders the operator workspace, the marketing site, and pitch decks — and exports light-mode evidence dossiers (PDF) from any unit type.',
    features: ['Tool-grounded AI agent (no speculation)', 'One scene runtime — app · decks · site', 'Evidence dossiers · 1-click PDF', 'Disclosure-safe board mode'],
    metrics: [{ value: 'Tool', label: 'Grounded' }, { value: 'One', label: 'Runtime' }, { value: 'Export', label: 'Ready' }],
  },
]

export const ARCH_NODES = [
  { label: 'Fastify API', sub: 'REST + WebSocket', icon: '⚡' },
  { label: 'Ingestion Engine', sub: '2s tick · 4 enrichers', icon: '🔄' },
  { label: 'React 19 Frontend', sub: 'MapLibre GL · Recharts', icon: '🖥' },
  { label: 'SQLite + Cache', sub: 'Ring buffer · TTL', icon: '🗄' },
  { label: 'AI Agent', sub: 'Tool-grounded', icon: '🤖' },
  { label: 'OpenAPI Spec', sub: 'Auto-generated', icon: '📄' },
]

export const QUALITY = [
  { value: 'CI', label: 'Quality Gates', sub: 'Lint, type-check, test, scan' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'NIST', label: '800-53 Mapped', sub: '8 control families' },
  { value: 'SBOM', label: 'Every CI Build', sub: 'Syft + Grype' },
  { value: 'SHA-256', label: 'Audit Chain', sub: 'Append-only, verifiable' },
]

export interface TeamMember {
  name: string
  role: string
  desc: string
  bg?: string
  accent: string
  onboarding?: boolean
}

export const TEAM: TeamMember[] = [
  {
    name: 'Carlos Toledo',
    role: 'Founder · Product & Technical Lead',
    desc: 'Full-stack engineer and product designer. Built the entire platform solo — production architecture, full pilot plant digital twin, NIST 800-53 mapped.',
    bg: 'Full-stack engineer and product designer. Born and raised in the Caldeira — 40 years of local context. Built the entire platform solo: production architecture, full pilot plant digital twin, NIST 800-53 mapped.',
    accent: V,
    onboarding: false,
  },
  {
    name: 'Scientific Advisor',
    role: 'Field Science · LAPOC',
    desc: 'Decades of active geological and hydrological work in the Caldeira. The bridge from simulated data to field-verified readings.',
    bg: 'Field science leadership across the Caldeira through LAPOC and ANSN work. Supports piezometers, water quality validation, geological sampling, and the transition from simulated to live evidence.',
    accent: V,
    onboarding: false,
  },
  {
    name: 'ESG & Human Rights Advisor',
    role: 'Community Rights · ESG Governance',
    desc: 'Sustainability leadership spanning companies, governments, and communities, with a focus on human rights and policy integration.',
    bg: 'Advisory support for sustainability strategy, human rights integration, community engagement, and policy design across public and private stakeholders.',
    accent: V,
    onboarding: false,
  },
  {
    name: 'Sustainability Strategy Advisor',
    role: 'Socio-Environmental Due Diligence',
    desc: 'ESG governance, socio-environmental diligence, and long-horizon community development strategy for critical operations.',
    bg: 'Advisory support for ESG governance, socio-environmental due diligence, social innovation, and community-based development strategy across complex territories.',
    accent: V,
    onboarding: false,
  },
]

export const AI_TOOLS = [
  { cat: 'Operations', tools: 'unit lookup, state transitions, dependency graph, evidence query' },
  { cat: 'Compliance', tools: 'audit chain queries, evidence verification, schema validation' },
  { cat: 'Geology', tools: 'deposits, resources, lithology, drill logs, JORC classification' },
  { cat: 'Financial', tools: 'scenario modeling, NPV sensitivity, CAPEX tracking, DSCR projections' },
  { cat: 'Environmental', tools: 'water quality, springs monitoring, hydrology scenarios' },
  { cat: 'Market', tools: 'sizing, pricing, benchmarks, comparable analysis' },
  { name: 'queryWeatherForecast', label: '16-Day Weather Forecast', category: 'Environmental Intelligence' },
  { name: 'queryWeatherHistory', label: 'ERA5 Climate History', category: 'Environmental Intelligence' },
  { name: 'analyzeEnvironmentalRisk', label: 'Environmental Risk Analysis', category: 'Environmental Intelligence' },
  { name: 'querySpringHealthPrediction', label: 'Spring Health Prediction', category: 'Environmental Intelligence' },
]

export const MARKET_DATA = [
  { tier: 'TAM', value: '$4.8 B → $9.6 B', desc: 'ESG Compliance in Mining', cagr: '8.9%', src: 'Grand View Research (Nov 2025)', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$150 M → $450 M', desc: '150 Critical Mineral projects × $102k avg ACV', cagr: '—', src: 'Internal analysis — ASX/TSX database', pct: 15 },
]

export const REPORT_CARDS = [
  { name: 'Technical Appendix', desc: 'Light-mode, printable evidence dossier — drill grade distribution, lithology summary, lab validation references, and a one-click PDF export. Same template adapts to any unit type.', accent: W.cyan },
]

export const MARKETING_COPY = {
  heroTagline: 'One runtime. Two live instances. Your category-defining platform.',
  heroHeadline: 'Map every asset. Stream every sensor. Prove every change.',
  heroSubhead: 'Vero is the field-operations command center for regulated industries — and your instance of a category-defining platform. The same runtime that powers Meteoric\'s Caldeira mining workspace also runs an Atlantic Maritime ISR sibling: typed units on a map, sensor streams in real time, and a SHA-256 evidence chain on every change.',
  heroFooter: 'Two live instances on one runtime · Mining, agriculture, defense lead · Logistics, transportation, infrastructure ride · NIST 800-53 + CMMC L2 mapped',

  dppFieldCount: '22',

  platformTagline: 'Map. Monitor. Decide. With evidence.',
  pillarsLabel: 'Three Capability Pillars',
  industriesLabel: 'Built for regulated field operations',
  industriesHeadline: 'Same platform. Different field.',
  industriesBody: 'GIS shows you where things are. Telemetry shows you what they are doing. Vero shows you both — and proves the data did not change without an audit trail. Two live instances today (Caldeira mining, Atlantic Maritime ISR) running on a single runtime; the same primitives run any field operation.',
  aiTagline: 'Tool-grounded AI. Every response cites its source.',
  architectureTagline: 'One scene-first runtime over a production-grade evidence stack',
  marketTagline: 'Regulation creates the market',
  forecastHorizon: '16-day',
  climateBaseline: '5yr ERA5',
}
