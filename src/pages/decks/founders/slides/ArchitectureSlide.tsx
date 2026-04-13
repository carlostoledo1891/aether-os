import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const ENRICHERS = [
  { label: 'CPTEC / INPE', y: 64 },
  { label: 'Open-Meteo', y: 80 },
  { label: 'ECMWF ERA5', y: 96 },
  { label: 'BCB PTAX', y: 112 },
  { label: 'USGS Seismic', y: 128 },
  { label: 'Alpha Vantage', y: 144 },
]

const SEC_BADGES = ['CSP', 'CORS', 'Rate Limit', 'Fail-closed']

export default function ArchitectureSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Architecture</Tag></div>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>Architecture Deep Dive</h2>
    <svg viewBox="0 0 880 340" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
      <defs>
        <marker id="arrowV" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
        <marker id="arrowT4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={W.text4} /></marker>
      </defs>
      <rect x="118" y="20" width="520" height="300" rx="16" fill="none" stroke={`${V}20`} strokeWidth="1" strokeDasharray="6 4" />
      <text x="130" y="42" fill={`${V}40`} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.06em">INTERNAL TRUST ZONE</text>

      <rect x="140" y="60" width="160" height="100" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="220" y="96" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">aether-engine</text>
      <text x="220" y="112" textAnchor="middle" fill={W.text3} fontSize="10">Simulation Bot</text>
      <text x="220" y="128" textAnchor="middle" fill={W.text4} fontSize="9">Node.js · 2s tick cycle</text>

      <rect x="380" y="80" width="160" height="72" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="460" y="106" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">aether-api</text>
      <text x="460" y="122" textAnchor="middle" fill={W.text3} fontSize="10">Fastify + SQLite</text>
      <text x="460" y="138" textAnchor="middle" fill={W.text4} fontSize="9">REST · WS · 40+ endpoints</text>

      <line x1="300" y1="116" x2="376" y2="116" stroke={V} strokeWidth="1.2" markerEnd="url(#arrowV)" />
      <text x="338" y="110" textAnchor="middle" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">POST /ingest</text>

      <rect x="390" y="188" width="140" height="44" rx="8" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
      <text x="460" y="212" textAnchor="middle" fill={W.text3} fontSize="10" fontFamily="var(--font-mono)">SQLite + TTL Cache</text>
      <text x="460" y="224" textAnchor="middle" fill={W.text4} fontSize="8">Ring buffer · WAL mode</text>
      <line x1="460" y1="152" x2="460" y2="184" stroke={`${V}40`} strokeWidth="1" strokeDasharray="3 2" />

      {ENRICHERS.map(e => (
        <g key={e.label}>
          <text x="22" y={e.y + 4} fill={W.text4} fontSize="9" fontFamily="var(--font-mono)">{e.label}</text>
          <line x1="108" y1={e.y} x2="136" y2={e.y} stroke={W.text4} strokeWidth="0.8" strokeDasharray="3 2" markerEnd="url(#arrowT4)" />
        </g>
      ))}

      <rect x="660" y="80" width="180" height="72" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="750" y="106" textAnchor="middle" fill={V} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">Vite Frontend</text>
      <text x="750" y="122" textAnchor="middle" fill={W.text3} fontSize="10">React 19 · MapLibre</text>
      <text x="750" y="138" textAnchor="middle" fill={W.text4} fontSize="9">Motion · Recharts · Memoized overlays</text>

      <line x1="540" y1="104" x2="656" y2="104" stroke={V} strokeWidth="1.2" markerEnd="url(#arrowV)" />
      <text x="598" y="98" textAnchor="middle" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">fetch + WS</text>

      {SEC_BADGES.map((s, i) => (
        <g key={s}>
          <rect x={160 + i * 115} y="268" width={100} height="24" rx="6" fill={`${V}10`} stroke={`${V}20`} strokeWidth="0.8" />
          <text x={210 + i * 115} y="284" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">{s}</text>
        </g>
      ))}

      <text x="750" y="176" textAnchor="middle" fill={W.text4} fontSize="9" fontFamily="var(--font-mono)">LAPOC · Meteoric · Prefeitura</text>
      <line x1="750" y1="152" x2="750" y2="166" stroke={`${V}30`} strokeWidth="0.8" strokeDasharray="3 2" />
    </svg>
  </>)
}
