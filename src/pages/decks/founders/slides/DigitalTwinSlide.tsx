import { W, V } from '../shared'
import { StatCard } from '../../../../components/deck'

const TWIN_STATS = [
  { v: 'Full', l: 'AMSUL Process', s: 'Metso · Andritz · GEA · Outotec' },
  { v: 'Live', l: 'Telemetry', s: 'Mapped to sensor channels' },
  { v: '7', l: 'Process Steps', s: 'AMSUL ion-exchange' },
  { v: 'Animated', l: 'SVG Flow', s: 'Interactive connections' },
]

const PROCESS_NODES = [
  { label: 'ROM Pad', sub: 'Crushing', x: 20 },
  { label: 'Leach', sub: 'H₂SO₄', x: 180 },
  { label: 'SX Circuit', sub: 'Separation', x: 340 },
  { label: 'Precipitation', sub: 'AMSUL', x: 500 },
  { label: 'Product', sub: 'REO Conc.', x: 660 },
]

export default function DigitalTwinSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>Pilot Plant Digital Twin</h2>
    <p style={{ fontSize: 12, color: W.text3, marginBottom: 20, maxWidth: 600 }}>Interactive Control Room — full pilot plant process, every sensor mapped, animated SVG flow</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 16 }}>
      {TWIN_STATS.map(s => <StatCard key={s.l} value={s.v} label={s.l} sub={s.s} />)}
    </div>
    <svg viewBox="0 0 800 120" style={{ maxWidth: 860, width: '100%' }}>
      <defs>
        <marker id="flowA" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d={`M0,0 L6,2.5 L0,5`} fill={V} /></marker>
      </defs>
      {PROCESS_NODES.map((n, i) => (
        <g key={n.label}>
          <rect x={n.x} y="30" width="120" height="56" rx="8" fill={W.glass04} stroke={`${V}25`} strokeWidth="1" />
          <text x={n.x + 60} y="54" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{n.label}</text>
          <text x={n.x + 60} y="70" textAnchor="middle" fill={W.text4} fontSize="8">{n.sub}</text>
          <circle cx={n.x + 40} cy="92" r="3" fill={`${W.green}80`} />
          <circle cx={n.x + 60} cy="92" r="3" fill={`${W.green}80`} />
          <circle cx={n.x + 80} cy="92" r="3" fill={`${W.green}80`} />
          <text x={n.x + 60} y="108" textAnchor="middle" fill={W.text4} fontSize="7">{3 + i} sensors</text>
          {i < 4 && <line x1={n.x + 120} y1="58" x2={n.x + 176} y2="58" stroke={V} strokeWidth="1" markerEnd="url(#flowA)" strokeDasharray="4 2" />}
        </g>
      ))}
      <text x="400" y="18" textAnchor="middle" fill={`${V}40`} fontSize="9" fontFamily="var(--font-mono)">Full AMSUL process — live version includes all equipment with animated flow paths</text>
    </svg>
  </>)
}
