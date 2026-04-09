import { useCallback } from 'react'
import { motion } from 'motion/react'
import { ShieldCheck, Leaf, Server, BarChart3, FileDown, ClipboardList } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { GreenPremiumCard } from '../../components/GreenPremiumCard'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import { DPP_FIELD_MAPPINGS, DPP_CATEGORIES, getDppCoverage, buildDppExport } from '../../data/dppSchema'
import type { ComplianceLedger } from '../../types/telemetry'
import css from './ComplianceTab.module.css'

interface ComplianceTabProps {
  batch: ComplianceLedger
}

export function ComplianceTab({ batch }: ComplianceTabProps) {
  const { data: benchmarks, isLoading: l1, error: e1 } = useServiceQuery('benchmarks', s => s.getBenchmarks())
  const { data: CYBER_TRUST_PILLARS, isLoading: l2, error: e2 } = useServiceQuery('cyber-pillars', s => s.getCyberPillars())
  const { data: U_TH_SAFETY, isLoading: l3, error: e3 } = useServiceQuery('uth-safety', s => s.getUThSafety())
  const { data: MARKET_PRICES, isLoading: l4, error: e4 } = useServiceQuery('market-prices', s => s.getMarketPrices())

  const firstError = e1 || e2 || e3 || e4
  if (firstError) return <ErrorFallback error={firstError} label="Compliance data" />
  if (l1 || l2 || l3 || l4 || !benchmarks || !CYBER_TRUST_PILLARS || !U_TH_SAFETY || !MARKET_PRICES) {
    return <LoadingSkeleton variant="card" label="Loading compliance..." />
  }

  return (
    <div className={css.root}>
      {/* FEOC Badge */}
      <GlassCard glow="green" animate={false} className={css.cardPad}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={ShieldCheck} color="green" size={13} />
          <span className={css.sectionTitle} style={{ color: W.text3 }}>
            FEOC Compliance
          </span>
        </div>
        <div className={css.feocRow}>
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
          <div className={css.chipCol}>
            <StatusChip label="0% FEOC" variant="green" dot size="md" />
            <StatusChip label={batch.ira_compliant ? 'IRA COMPLIANT' : 'NON-COMPLIANT'} variant={batch.ira_compliant ? 'green' : 'red'} size="md" />
            <StatusChip label={batch.eu_dbp_ready ? 'EU DBP READY' : 'DBP PENDING'} variant={batch.eu_dbp_ready ? 'violet' : 'amber'} size="md" />
          </div>
        </div>
        <div className={css.infoBox} style={{ borderRadius: W.radius.sm }}>
          <p className={css.infoParagraph} style={{ color: W.text2 }}>
            US DoD Mandate (Jan 1, 2027): Zero tolerance for Chinese-origin REEs across the full multi-tier chain.
          </p>
        </div>
      </GlassCard>

      {/* Carbon Intensity */}
      <GlassCard glow="green" animate={false} className={css.cardPad}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={Leaf} color="green" size={13} />
          <span className={css.sectionTitle} style={{ color: W.text3 }}>
            Carbon Intensity
          </span>
          <StatusChip label={batch.carbon_intensity.tier} variant="green" />
        </div>
        <MetricDisplay value={batch.carbon_intensity.value} unit="kg CO₂e/kg TREO" label="Carbon Intensity" decimals={2} size="lg" color="green" />
        <div className={css.carbonMetrics}>
          <div className={css.spaceBetween}>
            <span style={{ fontSize: 10, color: W.text3 }}>vs. Chinese hard-rock baseline</span>
            <span className={css.monoLg} style={{ color: W.green }}>
              -{batch.carbon_intensity.vs_chinese_baseline}%
            </span>
          </div>
          <div className={css.progressTrack} style={{ background: W.glass05, borderRadius: W.radius.xs }}>
            <motion.div
              animate={{ width: `${100 - batch.carbon_intensity.vs_chinese_baseline}%` }}
              transition={{ duration: 0.8 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${W.green}80, ${W.green})`, borderRadius: W.radius.xs }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Defense-Grade Cybersecurity */}
      <GlassCard animate={false} className={css.cardPad}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={Server} color="green" size={13} />
          <span className={css.sectionTitle} style={{ color: W.text3 }}>
            Defense-Grade Cybersecurity
          </span>
        </div>
        <div className={css.colStack7}>
          {(CYBER_TRUST_PILLARS ?? []).map((pillar) => (
            <div key={pillar.title} className={css.pillarCard} style={{ borderRadius: W.radius.sm }}>
              <div className={css.pillarHeader}>
                <span className={css.pillarTitle} style={{ color: W.text1 }}>{pillar.title}</span>
                <StatusChip label={pillar.status} variant="green" size="sm" />
              </div>
              <div className={css.pillarDetail} style={{ color: W.text2 }}>{pillar.detail}</div>
              <span className={css.protocolText} style={{ color: W.green }}>{pillar.protocol}</span>
            </div>
          ))}
        </div>
        <div className={`${css.footnoteBox} ${css.footnoteGreen}`} style={{ borderRadius: W.radius.sm }}>
          <p className={css.footnoteP} style={{ color: W.text3 }}>
            Houses critical U.S. Defense supply chain data (GPS, extraction yields, molecular DNA). All data encrypted in TEEs before leaving sensor array.
          </p>
        </div>
      </GlassCard>

      {/* U/Th Safety */}
      <GlassCard glow="green" animate={false} className={css.cardPad}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={ShieldCheck} color="green" size={13} />
          <span className={css.sectionTitle} style={{ color: W.text3 }}>
            Radioactivity Profile
          </span>
          <StatusChip label="SAFE" variant="green" />
        </div>
        <div className={css.colStack6}>
          {[
            ['Primary Mineral', U_TH_SAFETY?.primary_mineral ?? '—'],
            ['U/Th Profile', U_TH_SAFETY?.u_th_profile ?? '—'],
            ['Process Safety', U_TH_SAFETY?.solubilization ?? '—'],
            ['MREC Transport', U_TH_SAFETY?.mrec_classification ?? '—'],
          ].map(([label, value]) => (
            <div key={label} className={css.rowSpaced}>
              <span className={css.labelSm} style={{ color: W.text3 }}>{label}</span>
              <span className={css.valueSm} style={{ color: W.text1 }}>{value}</span>
            </div>
          ))}
        </div>
        <div className={`${css.footnoteBox} ${css.footnoteGreen}`} style={{ borderRadius: W.radius.sm }}>
          <p className={css.footnoteP} style={{ color: W.text3 }}>{U_TH_SAFETY?.advantage_vs_hardrock ?? '—'}</p>
        </div>
      </GlassCard>

      {/* Comparative Benchmarks */}
      <GlassCard animate={false} className={css.cardPad}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={BarChart3} color="green" size={13} />
          <span className={css.sectionTitle} style={{ color: W.text3 }}>
            Competitive Benchmarks
          </span>
        </div>
        <div className={`${css.benchGrid} ${css.benchGridHeader}`} style={{ borderBottom: `1px solid ${W.text4}30` }}>
          {['Operator', 'CO₂/t', 'H₂O L/t', 'FEOC', '$/kg'].map(h => (
            <span key={h} className={css.gridLabel} style={{ color: W.text4 }}>{h}</span>
          ))}
        </div>
        {(benchmarks ?? []).map((b, i) => {
          const isCaldeira = i === 0
          return (
            <div key={b.name} className={`${css.benchGrid} ${css.benchGridRow}`} style={{
              borderBottom: `1px solid ${W.glass04}`,
              background: isCaldeira ? `${W.green}08` : 'transparent',
              borderRadius: isCaldeira ? 5 : 0,
            }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: isCaldeira ? 800 : 600, color: isCaldeira ? W.green : W.text2 }}>{b.name}</span>
                <div style={{ fontSize: 9, color: W.text4 }}>{b.location}</div>
              </div>
              <span className={css.monoCell} style={{ color: isCaldeira ? W.green : W.text2 }}>{b.carbon_intensity}</span>
              <span className={css.monoCell} style={{ color: isCaldeira ? W.green : W.text2 }}>{b.water_l_per_t}</span>
              <span className={css.monoCell} style={{ color: b.feoc_pct === 0 ? W.green : W.red }}>{b.feoc_pct}%</span>
              <span className={css.monoCell} style={{ color: isCaldeira ? W.green : W.text2 }}>${b.cost_per_kg}</span>
            </div>
          )
        })}
        <div className={`${css.footnoteBox} ${css.footnoteGreenAlt}`} style={{ borderRadius: W.radius.sm }}>
          <p className={css.footnoteP} style={{ color: W.text3 }}>
            Caldeira's ionic clay deposit enables 75% lower carbon intensity and 94% less water consumption versus conventional hard-rock operations.
          </p>
        </div>
      </GlassCard>

      {MARKET_PRICES && (
        <GreenPremiumCard prices={MARKET_PRICES} />
      )}

      {/* Digital Product Passport — EU 2023/1542 Field Mapping */}
      <DppPassportSection batch={batch} uThSafety={U_TH_SAFETY} />
    </div>
  )
}

/* ─── DPP Passport Sub-Component ──────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = { mapped: W.green, stub: W.amber, pending: W.text4 }

function DppPassportSection({ batch, uThSafety }: { batch: ComplianceLedger; uThSafety: UThSafetyT | null }) {
  const coverage = getDppCoverage()

  const handleExport = useCallback(() => {
    const json = buildDppExport(batch, uThSafety)
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dpp-${batch.batch_id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [batch, uThSafety])

  return (
    <GlassCard glow="violet" animate={false} className={css.cardPad}>
      <div className={css.sectionHeader}>
        <GlowingIcon icon={ClipboardList} color="violet" size={13} />
        <span className={css.sectionTitle} style={{ color: W.text3 }}>
          Digital Product Passport
        </span>
        <StatusChip label="EU 2023/1542" variant="violet" size="sm" />
      </div>

      {/* Coverage bar */}
      <div className={css.coverageRow}>
        <div className={css.coverageBar} style={{ background: W.glass05, borderRadius: W.radius.xs }}>
          <div className={css.coverageSegment} style={{ width: `${(coverage.mapped / coverage.total) * 100}%`, background: W.green }} />
          <div className={css.coverageSegment} style={{ width: `${(coverage.stub / coverage.total) * 100}%`, background: W.amber }} />
        </div>
        <span className={css.coverageLabel} style={{ color: W.violet }}>
          {coverage.mapped}/{coverage.total}
        </span>
      </div>

      <div className={css.statusRow}>
        {(['mapped', 'stub', 'pending'] as const).map(s => (
          <span key={s} className={css.statusDot} style={{ color: STATUS_COLORS[s] }}>
            ● {s} ({coverage[s]})
          </span>
        ))}
      </div>

      {/* Field mapping table by category */}
      {DPP_CATEGORIES.map(cat => (
        <div key={cat} className={css.categoryBlock}>
          <div className={css.categoryTitle} style={{ color: W.text4 }}>
            {cat}
          </div>
          {DPP_FIELD_MAPPINGS.filter(f => f.category === cat).map(f => (
            <div key={f.id} className={css.dppFieldGrid} style={{ borderBottom: `1px solid ${W.glass04}` }}>
              <div>
                <span style={{ fontSize: 10, color: W.text2 }}>{f.field}</span>
                <span className={css.dppCenRef} style={{ color: W.text4 }}>{f.cenRef}</span>
              </div>
              <span className={css.dppSource} style={{ color: W.text3 }}
                title={f.aetherSource}
              >
                {f.aetherSource}
              </span>
              <span className={css.dppStatus} style={{ color: STATUS_COLORS[f.status] }}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Export button */}
      <button
        type="button"
        onClick={handleExport}
        className={css.exportBtn}
        style={{
          borderRadius: W.radius.sm, border: `1px solid ${W.violet}40`,
          background: `${W.violet}14`, color: W.violet,
        }}
        aria-label={`Export DPP JSON for batch ${batch.batch_id}`}
      >
        <FileDown size={13} />
        Export DPP JSON — {batch.batch_id}
      </button>

      <div className={css.footnoteBox} style={{ background: `${W.violet}08`, border: `1px solid ${W.violet}18`, borderRadius: W.radius.sm }}>
        <p className={css.footnoteP} style={{ color: W.text3 }}>
          Schema aligned to EU Battery Regulation 2023/1542 Annex VI. Fields marked "stub" contain placeholder values;
          "pending" fields require downstream data not yet in the Vero pipeline. Enforcement begins Feb 2027.
        </p>
      </div>
    </GlassCard>
  )
}

type UThSafetyT = { primary_mineral: string; u_th_profile: string; solubilization: string; mrec_classification: string; radioactive_tailings: boolean; advantage_vs_hardrock: string }
