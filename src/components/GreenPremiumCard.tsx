import { GlassCard } from './ui/GlassCard'
import { TrendingUp } from 'lucide-react'
import { W } from '../app/canvas/canvasTheme'
import type { MarketPrices } from '../services/dataService'

interface GreenPremiumCardProps {
  compact?: boolean
  prices: MarketPrices
}

export function GreenPremiumCard({ compact = false, prices }: GreenPremiumCardProps) {
  const delta = prices.green_ndpr_kg - prices.spot_ndpr_kg
  const deltaPercent = Math.round((delta / prices.spot_ndpr_kg) * 100)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Green Premium
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)' }}>
              +{deltaPercent}%
            </span>
            <span style={{ fontSize: 10, color: W.text3 }}>NdPr</span>
          </div>
        </div>
        <TrendingUp size={16} style={{ color: W.green, filter: `drop-shadow(0 0 4px ${W.greenGlow})` }} />
      </div>
    )
  }

  return (
    <GlassCard glow="green" style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Green Premium Delta
          </span>
          <TrendingUp size={14} style={{ color: W.green }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Spot NdPr (unverified)', value: prices.spot_ndpr_kg, color: W.text2, glow: false },
            { label: 'Certified Green NdPr', value: prices.green_ndpr_kg, color: W.green, glow: true },
          ].map(({ label, value, color, glow }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: W.text2 }}>{label}</span>
              <span style={{
                fontSize: 16, fontWeight: 700, color,
                fontFamily: 'var(--font-mono)',
                filter: glow ? `drop-shadow(0 0 4px ${W.greenGlow})` : undefined,
              }}>
                ${value}/kg
              </span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '8px 12px',
          background: W.greenSubtle,
          border: `1px solid ${W.green}33`,
          borderRadius: W.radius.sm,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: W.green, fontWeight: 600 }}>Premium Uplift</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)' }}>
            +${delta}/kg &nbsp;(+{deltaPercent}%)
          </span>
        </div>

        <p style={{ fontSize: 11, color: W.text4, lineHeight: 1.5, margin: 0 }}>
          Meteoric captures this premium when Caldeira shipments can prove origin, input provenance,
          and carbon intensity in a board-defensible digital passport.
        </p>
      </div>
    </GlassCard>
  )
}
