import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const TOOL_CATEGORIES = [
  { label: 'Geology', y: 20 },
  { label: 'Financial', y: 56 },
  { label: 'Compliance', y: 92 },
  { label: 'Operations', y: 128 },
  { label: 'Environmental', y: 164 },
  { label: 'Env. Intelligence', y: 200 },
  { label: 'Market', y: 236 },
]

export default function AiAgentSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>AI Architecture</Tag></div>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>AI Agent — Domain-Grounded</h2>
    <svg viewBox="0 0 860 300" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
      <defs>
        <marker id="aiArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
      </defs>
      <rect x="20" y="120" width="120" height="48" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="80" y="142" textAnchor="middle" fill={W.text2} fontSize="11" fontWeight="600">User Query</text>
      <text x="80" y="156" textAnchor="middle" fill={W.text4} fontSize="8">Natural language</text>

      <rect x="178" y="68" width="160" height="152" rx="12" fill="none" stroke={`${W.amber}30`} strokeWidth="1" strokeDasharray="5 3" />
      <text x="258" y="86" textAnchor="middle" fill={`${W.amber}60`} fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.05em">HALLUCINATION FENCE</text>

      <rect x="198" y="104" width="120" height="44" rx="8" fill={`${V}10`} stroke={`${V}30`} strokeWidth="1" />
      <text x="258" y="124" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">LLM Gateway</text>
      <text x="258" y="138" textAnchor="middle" fill={W.text4} fontSize="8">streamText() · AI SDK</text>
      <line x1="140" y1="144" x2="194" y2="128" stroke={V} strokeWidth="1" markerEnd="url(#aiArrow)" />

      <rect x="198" y="160" width="120" height="36" rx="6" fill={W.glass04} stroke={`${V}15`} strokeWidth="0.8" />
      <text x="258" y="178" textAnchor="middle" fill={W.text3} fontSize="9" fontFamily="var(--font-mono)">Honesty guardrails</text>
      <text x="258" y="190" textAnchor="middle" fill={W.text4} fontSize="7">System prompt rules</text>

      <rect x="400" y="104" width="120" height="44" rx="8" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="460" y="124" textAnchor="middle" fill={V} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">Tool Router</text>
      <text x="460" y="138" textAnchor="middle" fill={W.text4} fontSize="8">Domain tools</text>
      <line x1="318" y1="126" x2="396" y2="126" stroke={V} strokeWidth="1" markerEnd="url(#aiArrow)" />

      {TOOL_CATEGORIES.map((t) => (
        <g key={t.label}>
          <rect x="580" y={t.y} width="110" height="28" rx="6" fill={W.glass04} stroke={`${V}15`} strokeWidth="0.8" />
          <text x="635" y={t.y + 18} textAnchor="middle" fill={W.text2} fontSize="9" fontFamily="var(--font-mono)">{t.label}</text>
          <line x1="520" y1="126" x2="576" y2={t.y + 14} stroke={`${V}25`} strokeWidth="0.8" />
        </g>
      ))}

      <rect x="720" y="104" width="120" height="44" rx="8" fill={`${V}14`} stroke={`${V}30`} strokeWidth="0.8" />
      <text x="780" y="122" textAnchor="middle" fill={V} fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">Provenance</text>
      <text x="780" y="136" textAnchor="middle" fill={W.text3} fontSize="8">Source citation required by prompt</text>
      {[20, 56, 92, 128, 164, 200, 236].map(y => (
        <line key={y} x1="690" y1={y + 14} x2="716" y2={120} stroke={`${V}15`} strokeWidth="0.6" />
      ))}

      <rect x="178" y="256" width="160" height="24" rx="6" fill={`${W.amber}10`} stroke={`${W.amber}20`} strokeWidth="0.8" />
      <text x="258" y="272" textAnchor="middle" fill={W.amber} fontSize="9" fontFamily="var(--font-mono)">Hallucination guardrail tests · current suite passing</text>
    </svg>
  </>)
}
