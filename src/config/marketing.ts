import { W } from '../app/canvas/canvasTheme'

const V = W.violet

export const HERO_STATS = [
  { value: 'Strict', label: 'TypeScript', sub: 'Zero errors, CI-enforced' },
  { value: 'Live', label: 'Sensor Ingestion' },
  { value: 'Dynamic', label: 'Provenance' },
  { value: '< 2 s', label: 'Data Refresh' },
]

export const INDUSTRIES = [
  { title: 'Critical Minerals', desc: 'Rare earth, lithium, cobalt — from drill collar to compliance passport. Field ops, Digital Product Passports, and audit-ready provenance.', accent: V },
  { title: 'Oil & Gas', desc: 'Production monitoring, SCADA integration, environmental compliance, and community engagement dashboards for upstream operations.', accent: V },
  { title: 'Renewable Energy', desc: 'Wind and solar asset monitoring, supply chain traceability, carbon audit trails, and regulatory reporting across geographies.', accent: V },
  { title: 'Defense & Procurement', desc: 'FEOC supply chain verification, security-hardened architecture, and origin tracking for strategic material procurement.', accent: V },
]

export const CAPABILITIES = [
  {
    tag: 'Ingest',
    headline: 'Connect any data source',
    desc: 'Seamlessly transition from synthetic modeling to real-world sensor telemetry (SCADA/LAPOC) with zero architectural changes.',
    features: ['Live Sensor Ingestion (LAPOC)', 'REST / WebSocket / MQTT connectors', 'Hybrid real/simulated telemetry', 'CSV / Excel batch upload'],
    metrics: [{ value: 'REST + WS', label: 'API' }, { value: 'Multi-source', label: 'Enrichers' }, { value: '< 2s', label: 'Refresh' }],
  },
  {
    tag: 'Visualize',
    headline: 'Maps, charts, digital twins',
    desc: 'Interactive 3D terrain, process flow diagrams, time series, and custom overlays — all driven by your data, not our templates.',
    features: ['3D terrain with custom overlays', 'Process flow digital twins', 'Time series & gauge dashboards', 'Custom view builder (JSON-driven)'],
    metrics: [{ value: 'Full', label: 'Digital Twin' }, { value: 'Multi-layer', label: 'Map Engine' }, { value: 'Real-time', label: 'Dashboards' }],
  },
  {
    tag: 'Verify',
    headline: 'Prove it with evidence',
    desc: 'SHA-256 audit chains, schema-validated compliance exports, and dynamic provenance labeling for real-time trust.',
    features: ['Dynamic Provenance badges', 'SHA-256 append-only audit ledger', 'EU DPP JSON export (22 fields)', 'Explicit data honesty labels'],
    metrics: [{ value: 'SHA-256', label: 'Audit' }, { value: '22', label: 'DPP Fields' }, { value: 'JSON', label: 'Schema Export' }],
  },
  {
    tag: 'Environment',
    headline: 'Predictive environmental intelligence',
    desc: 'Forecast horizons and ERA5-backed baselines connect weather, hydrology, and risk to operations — not generic dashboard widgets.',
    features: ['16-day weather forecast', '5-year ERA5 climate history', 'Environmental risk analysis', 'Spring health prediction'],
    metrics: [{ value: '16-day', label: 'Forecast' }, { value: 'ERA5', label: 'Baseline' }, { value: 'Predictive', label: 'Risk Model' }],
  },
]

export const ARCH_NODES = [
  { label: 'Fastify API', sub: 'REST + WebSocket', icon: '⚡' },
  { label: 'Simulation Engine', sub: '2s tick · 4 enrichers', icon: '🔄' },
  { label: 'React 19 Frontend', sub: 'MapLibre GL · Recharts', icon: '🖥' },
  { label: 'SQLite + Cache', sub: 'Ring buffer · TTL', icon: '🗄' },
  { label: 'AI Agent', sub: 'Domain-grounded', icon: '🤖' },
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
    desc: 'Air Force pilot, full-stack engineer, product designer. Built the entire platform solo — production architecture, full pilot plant digital twin, NIST 800-53 mapped.',
    bg: 'Air Force pilot, full-stack engineer, product designer. Born and raised in the Caldeira — 40 years of local context. Built the entire platform solo: production architecture, full pilot plant digital twin, NIST 800-53 mapped.',
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
  { cat: 'Geology', tools: 'deposits, resources, lithology, drill logs, JORC classification' },
  { cat: 'Financial', tools: 'scenario modeling, NPV sensitivity, CAPEX tracking, DSCR projections' },
  { cat: 'Compliance', tools: 'DPP validation, FEOC verification, SHA-256 audit chain' },
  { cat: 'Operations', tools: 'plant telemetry, equipment status, sensor channels' },
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
  { name: 'Environment', desc: 'APA zones, water quality, springs monitoring, permitting timeline, community acceptance. Light mode PDF export.', accent: W.green },
  { name: 'Operations', desc: 'NPV/IRR, CAPEX breakdown, C1/AISC costs, process flow, pilot plant recovery data.', accent: V },
  { name: 'Drill Tests', desc: 'JORC table, grade distribution, RE recovery, lithology summary, Pilot vs ANSTO comparisons.', accent: W.cyan },
]

export const MARKETING_COPY = {
  heroTagline: 'Verified Origin. Trusted Supply.',
  heroHeadline: 'The trust layer for critical operations',
  heroSubhead: 'Predictive environmental intelligence on a hybrid telemetry engine — digital twins, proven compliance, and a clear path from simulation to live field data.',
  heroFooter: 'TypeScript strict · CI quality gates · NIST 800-53 mapped · SBOM on every build · Provenance on every data point',

  dppFieldCount: '22',

  platformTagline: 'Ingest. Visualize. Verify.',
  aiTagline: 'Domain-grounded AI. Every response cites its source.',
  architectureTagline: 'Production-grade hybrid architecture',
  marketTagline: 'Regulation creates the market',
  forecastHorizon: '16-day',
  climateBaseline: '5yr ERA5',
}
