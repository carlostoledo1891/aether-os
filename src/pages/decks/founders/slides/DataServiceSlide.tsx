import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

export default function DataServiceSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Service Layer</Tag></div>
    <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>Data Service Architecture</h2>
    <svg viewBox="0 0 820 280" style={{ maxWidth: 940, width: '100%', overflow: 'visible' }}>
      <defs>
        <marker id="dsArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d={`M0,0 L8,3 L0,6`} fill={V} /></marker>
      </defs>
      <rect x="20" y="20" width="160" height="56" rx="10" fill={W.glass04} stroke={`${V}30`} strokeWidth="1" />
      <text x="100" y="44" textAnchor="middle" fill={V} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">React Views</text>
      <text x="100" y="60" textAnchor="middle" fill={W.text4} fontSize="9">FieldView · ExecView · Buyer</text>

      <rect x="240" y="20" width="160" height="56" rx="10" fill={`${V}10`} stroke={`${V}30`} strokeWidth="1" />
      <text x="320" y="44" textAnchor="middle" fill={V} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">useServiceQuery</text>
      <text x="320" y="60" textAnchor="middle" fill={W.text4} fontSize="9">Hook · dedup cache</text>
      <line x1="180" y1="48" x2="236" y2="48" stroke={V} strokeWidth="1" markerEnd="url(#dsArrow)" />

      <rect x="270" y="110" width="220" height="52" rx="10" fill={W.glass04} stroke={V} strokeWidth="1.5" />
      <text x="380" y="132" textAnchor="middle" fill={W.text1} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">AetherDataService</text>
      <text x="380" y="148" textAnchor="middle" fill={W.text4} fontSize="9">MaybeAsync{'<T>'} · 40+ methods</text>
      <line x1="320" y1="76" x2="360" y2="106" stroke={`${V}50`} strokeWidth="1" strokeDasharray="4 2" />

      <rect x="120" y="200" width="180" height="52" rx="10" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
      <text x="210" y="222" textAnchor="middle" fill={W.text3} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">MockDataService</text>
      <text x="210" y="238" textAnchor="middle" fill={W.text4} fontSize="9">Returns T · in-memory</text>
      <line x1="320" y1="162" x2="260" y2="196" stroke={`${V}40`} strokeWidth="1" strokeDasharray="4 2" />
      <text x="270" y="178" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">implements</text>

      <rect x="460" y="200" width="180" height="52" rx="10" fill={W.glass04} stroke={`${V}20`} strokeWidth="1" />
      <text x="550" y="222" textAnchor="middle" fill={W.text3} fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">LiveDataService</text>
      <text x="550" y="238" textAnchor="middle" fill={W.text4} fontSize="9">{'Promise<T>'} · fetch + WS</text>
      <line x1="440" y1="162" x2="500" y2="196" stroke={`${V}40`} strokeWidth="1" strokeDasharray="4 2" />
      <text x="490" y="178" fill={W.text4} fontSize="8" fontFamily="var(--font-mono)">implements</text>

      <rect x="700" y="190" width="100" height="28" rx="6" fill={`${V}08`} stroke={`${V}15`} strokeWidth="0.8" />
      <text x="750" y="208" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">REST API</text>
      <rect x="700" y="228" width="100" height="28" rx="6" fill={`${V}08`} stroke={`${V}15`} strokeWidth="0.8" />
      <text x="750" y="246" textAnchor="middle" fill={V} fontSize="9" fontFamily="var(--font-mono)">WebSocket</text>
      <line x1="640" y1="218" x2="696" y2="206" stroke={V} strokeWidth="0.8" markerEnd="url(#dsArrow)" />
      <line x1="640" y1="228" x2="696" y2="240" stroke={V} strokeWidth="0.8" markerEnd="url(#dsArrow)" />

      <rect x="250" y="262" width="260" height="16" rx="4" fill="none" />
      <text x="380" y="274" textAnchor="middle" fill={`${V}60`} fontSize="10" fontFamily="var(--font-mono)">Swap implementation → zero frontend changes</text>
    </svg>
  </>)
}
