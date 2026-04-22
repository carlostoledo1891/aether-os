import { motion } from 'motion/react'
import { W, V, ease } from '../shared'
import { Tag } from '../../../../components/deck'

const MARKET_TIERS = [
  { tier: 'TAM', value: '$4.8 B → $9.6 B', desc: 'ESG Compliance in Mining', cagr: '8.9%', src: 'Grand View Research (Nov 2025)', pct: 100 },
  { tier: 'SAM', value: '$1.6 B → $5.2 B', desc: 'Critical Minerals Compliance SaaS', cagr: '14.2%', src: 'Dataintelo + Growth Market Reports', pct: 52 },
  { tier: 'SOM', value: '$150 M → $450 M', desc: '150 Critical Mineral projects × $102k avg ACV', cagr: 'Bottom-up', src: 'Internal analysis — ASX/TSX project database', pct: 15 },
]

export default function MarketSlide() {
  return (<>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><Tag>Sourced TAM/SAM/SOM</Tag></div>
    <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>The Market</h2>
    <div style={{ maxWidth: 860, width: '100%' }}>
      {MARKET_TIERS.map(m => (
        <div key={m.tier} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{m.tier}</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: W.text1 }}>{m.value}</span>
          </div>
          <div style={{ height: 6, background: W.glass04, borderRadius: 3, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 1.2, ease }}
              style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${V}, ${V}80)` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: W.text3 }}>{m.desc}{m.cagr !== 'Bottom-up' ? ` · ${m.cagr} CAGR` : ''}</span>
            <span style={{ fontSize: 11, color: W.text3, fontFamily: 'var(--font-mono)' }}>{m.src}</span>
          </div>
        </div>
      ))}
    </div>
  </>)
}
