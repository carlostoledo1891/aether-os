import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ShieldCheck, Leaf, Server, BarChart3 } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { GreenPremiumCard } from '../../components/GreenPremiumCard'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import type { ComplianceLedger } from '../../types/telemetry'

interface ComplianceTabProps {
  batch: ComplianceLedger
}

export function ComplianceTab({ batch }: ComplianceTabProps) {
  const service = useAetherService()
  const benchmarks = useMemo(() => service.getBenchmarks(), [service])
  const CYBER_TRUST_PILLARS = useMemo(() => service.getCyberPillars(), [service])
  const U_TH_SAFETY = useMemo(() => service.getUThSafety(), [service])
  const MARKET_PRICES = useMemo(() => service.getMarketPrices(), [service])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* FEOC Badge */}
      <GlassCard glow="green" animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={ShieldCheck} color="green" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            FEOC Compliance
          </span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div>
            <svg width={72} height={72}>
              <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(34,214,138,0.1)" strokeWidth={4.5} />
              <motion.circle
                cx={36} cy={36} r={30}
                fill="none" stroke={W.green} strokeWidth={4.5}
                strokeLinecap="round"
                strokeDasharray="189 0"
                strokeDashoffset={47}
                style={{ filter: 'drop-shadow(0 0 8px rgba(34,214,138,0.5))' }}
                animate={{ strokeDasharray: ['0 189', '189 0'] }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
              <text x={36} y={33} textAnchor="middle" fill={W.green} fontSize={12} fontWeight={800} fontFamily="JetBrains Mono, monospace">
                {batch.feoc_percentage.toFixed(2)}%
              </text>
              <text x={36} y={46} textAnchor="middle" fill={W.text4} fontSize={10} fontFamily="var(--font-ui)">
                Chinese Origin
              </text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <StatusChip label="0% FEOC" variant="green" dot size="md" />
            <StatusChip label={batch.ira_compliant ? 'IRA COMPLIANT' : 'NON-COMPLIANT'} variant={batch.ira_compliant ? 'green' : 'red'} size="md" />
            <StatusChip label={batch.eu_dbp_ready ? 'EU DBP READY' : 'DBP PENDING'} variant={batch.eu_dbp_ready ? 'violet' : 'amber'} size="md" />
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '7px 9px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.2)', borderRadius: W.radius.sm }}>
          <p style={{ margin: 0, fontSize: 11, color: W.text2, lineHeight: 1.5 }}>
            US DoD Mandate (Jan 1, 2027): Zero tolerance for Chinese-origin REEs across the full multi-tier chain.
          </p>
        </div>
      </GlassCard>

      {/* Carbon Intensity */}
      <GlassCard glow="green" animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={Leaf} color="green" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Carbon Intensity
          </span>
          <StatusChip label={batch.carbon_intensity.tier} variant="green" />
        </div>
        <MetricDisplay value={batch.carbon_intensity.value} unit="kg CO₂e/kg TREO" label="Carbon Intensity" decimals={2} size="lg" color="green" />
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: W.text3 }}>vs. Chinese hard-rock baseline</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)' }}>
              -{batch.carbon_intensity.vs_chinese_baseline}%
            </span>
          </div>
          <div style={{ height: 5, background: W.glass05, borderRadius: W.radius.xs, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${100 - batch.carbon_intensity.vs_chinese_baseline}%` }}
              transition={{ duration: 0.8 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${W.green}80, ${W.green})`, borderRadius: W.radius.xs }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Defense-Grade Cybersecurity */}
      <GlassCard animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={Server} color="green" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Defense-Grade Cybersecurity
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CYBER_TRUST_PILLARS.map((pillar) => (
            <div key={pillar.title} style={{ padding: '7px 9px', borderRadius: W.radius.sm, background: 'rgba(34,214,138,0.05)', border: '1px solid rgba(34,214,138,0.14)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: W.text1, fontWeight: 700 }}>{pillar.title}</span>
                <StatusChip label={pillar.status} variant="green" size="sm" />
              </div>
              <div style={{ fontSize: 11, color: W.text2, lineHeight: 1.45, marginBottom: 3 }}>{pillar.detail}</div>
              <span style={{ fontSize: 10, color: W.green, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pillar.protocol}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.18)', borderRadius: W.radius.sm }}>
          <p style={{ margin: 0, fontSize: 10, color: W.text3, lineHeight: 1.4 }}>
            Houses critical U.S. Defense supply chain data (GPS, extraction yields, molecular DNA). All data encrypted in TEEs before leaving sensor array.
          </p>
        </div>
      </GlassCard>

      {/* U/Th Safety */}
      <GlassCard glow="green" animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={ShieldCheck} color="green" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Radioactivity Profile
          </span>
          <StatusChip label="SAFE" variant="green" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['Primary Mineral', U_TH_SAFETY.primary_mineral],
            ['U/Th Profile', U_TH_SAFETY.u_th_profile],
            ['Process Safety', U_TH_SAFETY.solubilization],
            ['MREC Transport', U_TH_SAFETY.mrec_classification],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 10, color: W.text3, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 10, color: W.text1, fontWeight: 600, textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.18)', borderRadius: W.radius.sm }}>
          <p style={{ margin: 0, fontSize: 10, color: W.text3, lineHeight: 1.4 }}>{U_TH_SAFETY.advantage_vs_hardrock}</p>
        </div>
      </GlassCard>

      {/* Comparative Benchmarks */}
      <GlassCard animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={BarChart3} color="green" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Competitive Benchmarks
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 55px 55px 45px 55px', gap: 4, padding: '4px 0', borderBottom: `1px solid ${W.text4}30` }}>
          {['Operator', 'CO₂/t', 'H₂O L/t', 'FEOC', '$/kg'].map(h => (
            <span key={h} style={{ fontSize: 9, fontWeight: 700, color: W.text4, textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {benchmarks.map((b, i) => {
          const isCaldeira = i === 0
          return (
            <div key={b.name} style={{
              display: 'grid', gridTemplateColumns: '1fr 55px 55px 45px 55px', gap: 4, padding: '5px 0',
              borderBottom: `1px solid ${W.glass04}`,
              background: isCaldeira ? `${W.green}08` : 'transparent',
              borderRadius: isCaldeira ? 5 : 0,
            }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: isCaldeira ? 800 : 600, color: isCaldeira ? W.green : W.text2 }}>{b.name}</span>
                <div style={{ fontSize: 9, color: W.text4 }}>{b.location}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: isCaldeira ? W.green : W.text2, fontFamily: 'var(--font-mono)' }}>{b.carbon_intensity}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: isCaldeira ? W.green : W.text2, fontFamily: 'var(--font-mono)' }}>{b.water_l_per_t}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: b.feoc_pct === 0 ? W.green : W.red, fontFamily: 'var(--font-mono)' }}>{b.feoc_pct}%</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: isCaldeira ? W.green : W.text2, fontFamily: 'var(--font-mono)' }}>${b.cost_per_kg}</span>
            </div>
          )
        })}
        <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(34,214,138,0.06)', border: '1px solid rgba(34,214,138,0.15)', borderRadius: W.radius.sm }}>
          <p style={{ margin: 0, fontSize: 10, color: W.text3, lineHeight: 1.4 }}>
            Caldeira's ionic clay deposit enables 75% lower carbon intensity and 94% less water consumption versus conventional hard-rock operations.
          </p>
        </div>
      </GlassCard>

      <GreenPremiumCard prices={MARKET_PRICES} />
    </div>
  )
}
