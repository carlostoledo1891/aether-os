import { W } from '../app/canvas/canvasTheme'

const V = W.violet

export const HERO_STATS = [
  { value: '310', label: 'Automated Tests' },
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
    metrics: [{ value: '40+', label: 'Endpoints' }, { value: '4', label: 'Enrichers' }, { value: '< 2s', label: 'Refresh' }],
  },
  {
    tag: 'Visualize',
    headline: 'Maps, charts, digital twins',
    desc: 'Interactive 3D terrain, process flow diagrams, time series, and custom overlays — all driven by your data, not our templates.',
    features: ['3D terrain with custom overlays', 'Process flow digital twins', 'Time series & gauge dashboards', 'Custom view builder (JSON-driven)'],
    metrics: [{ value: '14', label: 'Overlay Types' }, { value: '17', label: 'Equipment' }, { value: '28', label: 'Sensors' }],
  },
  {
    tag: 'Verify',
    headline: 'Prove it with evidence',
    desc: 'SHA-256 audit chains, schema-validated compliance exports, and dynamic provenance labeling for real-time trust.',
    features: ['Dynamic Provenance badges', 'SHA-256 append-only audit ledger', 'EU DPP JSON export (22 fields)', 'Explicit data honesty labels'],
    metrics: [{ value: 'SHA-256', label: 'Audit' }, { value: '22', label: 'DPP Fields' }, { value: '100%', label: 'Export' }],
  },
]

export const ARCH_NODES = [
  { label: 'Fastify API', sub: 'REST + WebSocket', icon: '⚡' },
  { label: 'Simulation Engine', sub: '2s tick · 4 enrichers', icon: '🔄' },
  { label: 'React 19 Frontend', sub: 'MapLibre GL · Recharts', icon: '🖥' },
  { label: 'SQLite + Cache', sub: 'Ring buffer · TTL', icon: '🗄' },
  { label: '27 AI Tools', sub: 'Domain-grounded', icon: '🤖' },
  { label: 'OpenAPI Spec', sub: 'Auto-generated', icon: '📄' },
]

export const QUALITY = [
  { value: '310', label: 'Tests', sub: '260 + 50' },
  { value: '0', label: 'TS Errors', sub: 'Strict mode' },
  { value: 'CSP', label: 'Headers', sub: 'Security policy' },
  { value: '120', label: 'Rate Limit', sub: 'req / min' },
  { value: '14', label: 'Memo\'d', sub: 'Map overlays' },
]

export const TEAM = [
  { name: 'Carlos Toledo', role: 'Founder & Product Lead', desc: 'Air Force pilot, full-stack engineer, product designer. Built the entire platform solo — 310 tests, 27 AI tools. Domain expert with decades of field context.' },
  { name: 'Dr. Heber Caponi', role: 'Scientific Advisor', desc: 'Field researcher with decades of active geological and hydrological work. The bridge from simulated to field-verified data.' },
]

export const AI_TOOLS = [
  { cat: 'Geology', tools: 'deposits, resources, lithology, drill logs, JORC classification' },
  { cat: 'Financial', tools: 'scenario modeling, NPV sensitivity, CAPEX tracking, DSCR projections' },
  { cat: 'Compliance', tools: 'DPP validation, FEOC verification, SHA-256 audit chain' },
  { cat: 'Operations', tools: 'plant telemetry, equipment status, sensor channels' },
  { cat: 'Environmental', tools: 'water quality, springs monitoring, hydrology scenarios' },
  { cat: 'Market', tools: 'sizing, pricing, benchmarks, comparable analysis' },
]

export const MARKET_DATA = [
  { tier: 'TAM', value: '$18.8 B → $31.9 B', desc: 'Digital Mining & Smart Mining Technology', cagr: '11.2%', src: 'Mordor Intelligence + Grand View Research', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$15 M → $45 M', desc: '15 REE projects × $102k avg ACV', cagr: '—', src: 'Internal analysis — ASX/TSX database', pct: 15 },
]

export const REPORT_CARDS = [
  { name: 'Environment', desc: 'APA zones, water quality, springs monitoring, permitting timeline, community acceptance. Light mode PDF export.', accent: W.green },
  { name: 'Operations', desc: 'NPV/IRR, CAPEX breakdown, C1/AISC costs, process flow, pilot plant recovery data.', accent: V },
  { name: 'Drill Tests', desc: 'JORC table, grade distribution, RE recovery, lithology summary, Pilot vs ANSTO comparisons.', accent: W.cyan },
]

export const MARKETING_COPY = {
  heroTagline: 'Verified Origin. Trusted Supply.',
  heroHeadline: 'The trust layer for critical operations',
  heroSubhead: 'Hybrid telemetry engine. Build digital twins. Prove compliance. Seamlessly transition from simulated models to real-world sensor data for field operations and board-level decisions.',
  heroFooter: '310 automated tests · Zero compilation errors · TypeScript strict · One developer',
  
  // Metrics explicitly defined for easier reuse in decks
  testCount: '310',
  aiToolCount: '27',
  overlayCount: '14',
  equipmentCount: '17',
  sensorCount: '28',
  dppFieldCount: '22',
  
  // Reusable taglines
  platformTagline: 'Ingest. Visualize. Verify.',
  aiTagline: '27 domain tools. Grounded in truth.',
  architectureTagline: 'Production-grade hybrid architecture',
  marketTagline: 'Regulation creates the market',
}