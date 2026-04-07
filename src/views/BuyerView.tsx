import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck, FileText, Download, QrCode, Leaf, FlaskConical,
  CloudCog, Send, LockKeyhole, Package, Globe,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowingIcon } from '../components/ui/GlowingIcon'
import { StatusChip } from '../components/ui/StatusChip'
import { MetricDisplay } from '../components/ui/MetricDisplay'
import { BlockchainTimeline } from '../components/BlockchainTimeline'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { GreenPremiumCard } from '../components/GreenPremiumCard'
import { MapBase, BUYER_VIEW_STATE } from '../components/map/MapBase'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { DepositOverlay } from '../components/map/DepositOverlay'
import { InfraOverlay } from '../components/map/InfraOverlay'
import { API_HANDOFFS, BATCHES, CYBER_TRUST_PILLARS, DEPOSIT_DATA, PROJECT_FINANCIALS, REAGENT_PROVENANCE, U_TH_SAFETY } from '../data/mockData'
import { W } from '../app/canvas/canvasTheme'

const BATCH_DEPOSIT_MAP: Record<string, string> = {
  'BATCH-MREC-8X9': 'capao-do-mel',
  'BATCH-MREC-7W2': 'soberbo',
}

type BuyerTab = 'compliance' | 'supply' | 'timeline'

const TAB_ITEMS: { id: BuyerTab; label: string; icon: typeof ShieldCheck; color: string }[] = [
  { id: 'compliance', label: 'Compliance',    icon: ShieldCheck,  color: W.green },
  { id: 'supply',     label: 'Supply Chain',  icon: Package,      color: W.cyan },
  { id: 'timeline',   label: 'Batch Ledger',  icon: FileText,     color: W.violet },
]

const TAB_COLOR: Record<BuyerTab, string> = {
  compliance: W.green,
  supply:     W.cyan,
  timeline:   W.violet,
}

const MAP_HEADER_TEXT: Record<BuyerTab, string> = {
  compliance: 'FEOC-clean chain · IRA-ready · EU Digital Battery Passport',
  supply:     'Caldeira → Santos export route · reagent provenance · partner APIs',
  timeline:   'Molecular-to-magnet ledger · immutable batch attestation',
}

interface BuyerViewProps {
  batchId: string
}

export function BuyerView({ batchId }: BuyerViewProps) {
  const batch = BATCHES.find(b => b.batch_id === batchId) ?? BATCHES[0]
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<BuyerTab>('compliance')
  const originDepositId = BATCH_DEPOSIT_MAP[batchId] ?? 'capao-do-mel'
  const originDeposit = DEPOSIT_DATA.find(d => d.id === originDepositId)

  function handleExport() {
    setExporting(true)
    window.print()
    setTimeout(() => setExporting(false), 1500)
  }

  const bottomMetrics = [
    { label: 'FEOC Score', value: '0.00%', sub: 'Zero Chinese origin' },
    { label: 'IRA Status', value: batch.ira_compliant ? 'Compliant' : 'Pending', sub: 'Inflation Reduction Act' },
    { label: 'Carbon', value: `${batch.carbon_intensity.value.toFixed(1)} kg`, sub: `CO₂e/kg · ${batch.carbon_intensity.tier}` },
    { label: 'Green Premium', value: '+$29/kg', sub: 'NdPr certified vs spot' },
    { label: 'Active Batch', value: batch.batch_id, sub: `${batch.tonnage_kg} kg MREC` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden', padding: '12px 14px', gap: 10,
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: W.text1, letterSpacing: '-0.01em' }}>
            TradeTech & Compliance-as-a-Service
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: W.text4, marginTop: 1 }}>
            Reagent provenance, digital passport issuance, and partner API handoff for Caldeira offtake conversion
          </p>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <StatusChip label="0% FEOC" variant="green" dot />
          <StatusChip label={batch.ira_compliant ? 'IRA COMPLIANT' : 'NON-COMPLIANT'} variant={batch.ira_compliant ? 'green' : 'red'} />
          <StatusChip label={batch.eu_dbp_ready ? 'EU DBP READY' : 'DBP PENDING'} variant={batch.eu_dbp_ready ? 'violet' : 'amber'} />
          <button
            onClick={handleExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px',
              background: exporting ? 'rgba(34,214,138,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${exporting ? 'rgba(34,214,138,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 7, cursor: 'pointer', outline: 'none',
              color: exporting ? W.green : W.text2, fontSize: 10, fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <Download size={10} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main body: Map + Right panel */}
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        {/* Left: Map + bottom strip */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {/* Map hero */}
          <div style={{
            flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden',
            borderRadius: 14,
            border: `1px solid ${TAB_COLOR[activeTab]}30`,
            boxShadow: `0 0 22px ${TAB_COLOR[activeTab]}14, inset 0 1px 0 rgba(255,255,255,0.04)`,
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}>
            {/* Map header overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: 'linear-gradient(to bottom, rgba(6,6,16,0.88), transparent)',
              zIndex: 10, pointerEvents: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <GlowingIcon
                  icon={activeTab === 'compliance' ? ShieldCheck : activeTab === 'supply' ? Globe : FileText}
                  color={activeTab === 'compliance' ? 'green' : activeTab === 'supply' ? 'cyan' : 'violet'}
                  size={11}
                />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: W.text3,
                  transition: 'color 0.3s',
                }}>
                  {MAP_HEADER_TEXT[activeTab]}
                </span>
              </div>
            </div>

            <MapBase id="buyerField" initialViewState={BUYER_VIEW_STATE}>
              <CaldeiraBoundary />
              <DepositOverlay highlightId={originDepositId} />
              <InfraOverlay showRoute />
            </MapBase>

            {/* Origin badge */}
            <div style={{
              position: 'absolute', bottom: 10, left: 12, zIndex: 10,
              display: 'flex', gap: 8, alignItems: 'center', pointerEvents: 'none',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 10px',
                background: 'rgba(6,6,16,0.88)',
                backdropFilter: 'blur(8px)',
                borderRadius: 8,
                border: '1px solid rgba(0,212,200,0.25)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.cyan, boxShadow: `0 0 6px ${W.cyan}` }}/>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.cyan, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Origin
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
                  {originDeposit?.name ?? 'Caldeira'}
                </span>
                {originDeposit && (
                  <span style={{ fontSize: 10, color: W.text3, borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 7 }}>
                    {originDeposit.treo_ppm.toLocaleString()} ppm · {originDeposit.tonnage_mt} Mt
                  </span>
                )}
              </div>
            </div>

            {/* Route legend */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10, zIndex: 10,
              display: 'flex', gap: 10, pointerEvents: 'none',
              padding: '4px 10px',
              background: 'rgba(6,6,16,0.80)',
              backdropFilter: 'blur(8px)',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {[
                { color: W.amber, label: 'Deposit' },
                { color: W.green, label: 'Plant' },
                { color: W.cyan, label: 'Route → Santos' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}/>
                  <span style={{ fontSize: 10, color: W.text3 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom KPI strip */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {bottomMetrics.map(({ label, value, sub }) => (
                <GlassCard key={label} animate={false} style={{ padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: W.text3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{sub}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel (400px) */}
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minHeight: 0 }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
            padding: 3, gap: 2, flexShrink: 0,
          }}>
            {TAB_ITEMS.map(({ id, label, icon: Icon, color }) => {
              const isActive = activeTab === id
              return (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '6px 8px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', position: 'relative', outline: 'none',
                  background: 'transparent', transition: 'background 0.2s',
                  minWidth: 0,
                }}>
                  {isActive && (
                    <motion.div
                      layoutId="buyer-tab-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 7,
                        background: `linear-gradient(135deg, ${color}22, ${color}0F)`,
                        border: `1px solid ${color}35`,
                        boxShadow: `0 0 8px ${color}18`,
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon size={11} style={{
                    color: isActive ? color : W.text4,
                    filter: isActive ? `drop-shadow(0 0 3px ${color}80)` : undefined,
                    zIndex: 1, flexShrink: 0,
                  }}/>
                  <span style={{
                    fontSize: 10, fontWeight: 600, zIndex: 1,
                    color: isActive ? W.text1 : W.text4,
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Countdown strip */}
          <GlassCard animate={false} style={{ padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <CountdownTimer targetDate="2027-01-01T00:00:00Z" label="DoD NDAA Ban" color="amber" />
              <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)' }} />
              <CountdownTimer targetDate="2027-02-18T00:00:00Z" label="EU DBP Mandate" color="violet" />
            </div>
          </GlassCard>

          {/* Tab content */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {activeTab === 'compliance' && (
                <motion.div key="compliance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

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
                            0.00%
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
                    <div style={{ marginTop: 10, padding: '7px 9px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.2)', borderRadius: 8 }}>
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
                    <MetricDisplay
                      value={batch.carbon_intensity.value}
                      unit="kg CO₂e/kg TREO"
                      label="Carbon Intensity"
                      decimals={2}
                      size="lg"
                      color="green"
                    />
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: W.text3 }}>vs. Chinese hard-rock baseline</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: W.green, fontFamily: 'var(--font-mono)' }}>
                          -{batch.carbon_intensity.vs_chinese_baseline}%
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div
                          animate={{ width: `${100 - batch.carbon_intensity.vs_chinese_baseline}%` }}
                          transition={{ duration: 0.8 }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${W.green}80, ${W.green})`, borderRadius: 3 }}
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Trust Controls */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={LockKeyhole} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Trust Controls
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {CYBER_TRUST_PILLARS.slice(0, 3).map((pillar) => (
                        <div key={pillar.title} style={{ padding: '7px 9px', borderRadius: 7, background: 'rgba(34,214,138,0.05)', border: '1px solid rgba(34,214,138,0.14)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: W.text1, fontWeight: 700 }}>{pillar.title}</span>
                            <StatusChip label={pillar.status} variant="green" size="sm" />
                          </div>
                          <div style={{ fontSize: 11, color: W.text2, lineHeight: 1.45 }}>{pillar.detail}</div>
                        </div>
                      ))}
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
                    <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.18)', borderRadius: 7 }}>
                      <p style={{ margin: 0, fontSize: 10, color: W.text3, lineHeight: 1.4 }}>
                        {U_TH_SAFETY.advantage_vs_hardrock}
                      </p>
                    </div>
                  </GlassCard>

                  {/* Green Premium */}
                  <GreenPremiumCard />
                </motion.div>
              )}

              {activeTab === 'supply' && (
                <motion.div key="supply" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Reagent Provenance */}
                  <GlassCard glow="amber" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={FlaskConical} color="amber" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Upstream Reagent Provenance
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        ['Material', REAGENT_PROVENANCE.material],
                        ['Supplier', REAGENT_PROVENANCE.supplier],
                        ['Origin', REAGENT_PROVENANCE.origin_country],
                        ['Lot ID', REAGENT_PROVENANCE.lot_id],
                        ['Carbon', `${REAGENT_PROVENANCE.carbon_intensity_kg.toFixed(2)} kg CO2e/kg`],
                        ['Sanctions', REAGENT_PROVENANCE.sanctions_screening],
                      ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontSize: 10, color: W.text3 }}>{label}</span>
                          <span style={{ fontSize: 11, color: W.text1, fontWeight: 600, textAlign: 'right' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, padding: '7px 9px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.18)', borderRadius: 8 }}>
                      <p style={{ margin: 0, fontSize: 11, color: W.text2, lineHeight: 1.45 }}>
                        {REAGENT_PROVENANCE.board_risk}
                      </p>
                    </div>
                  </GlassCard>

                  {/* Digital Passport */}
                  <GlassCard glow="violet" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={QrCode} color="violet" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Passport Issuance
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 56, height: 56, flexShrink: 0,
                        border: '2px solid rgba(124,92,252,0.4)',
                        borderRadius: 7, padding: 3,
                        display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 1,
                        background: 'rgba(124,92,252,0.06)',
                      }}>
                        {Array.from({ length: 36 }, (_, i) => (
                          <span key={i} style={{ background: (i * 7) % 5 > 1 ? 'rgba(157,128,255,0.8)' : 'transparent', borderRadius: 1 }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div>
                          <div style={{ fontSize: 10, color: W.text3 }}>Batch ID</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: W.violetSoft, fontFamily: 'var(--font-mono)' }}>{batch.batch_id}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: W.text3 }}>Destination</div>
                          <div style={{ fontSize: 10, color: W.text2 }}>{batch.offtake_destination.split('—')[0]}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {batch.certificates.map(cert => (
                        <span key={cert} style={{
                          fontSize: 10, color: W.text3,
                          padding: '2px 6px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 4,
                        }}>
                          {cert}
                        </span>
                      ))}
                    </div>
                  </GlassCard>

                  {/* API Handoffs */}
                  <GlassCard glow="cyan" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={Send} color="cyan" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        API Handoff Layer
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {API_HANDOFFS.map((handoff) => (
                        <div key={handoff.system} style={{ padding: '7px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 9.5, color: W.text1, fontWeight: 700 }}>{handoff.system}</span>
                            <StatusChip label={handoff.status.toUpperCase()} variant={handoff.status === 'queued' ? 'amber' : 'green'} size="sm" />
                          </div>
                          <div style={{ fontSize: 10, color: W.violetSoft, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
                            {handoff.endpoint}
                          </div>
                          <div style={{ fontSize: 10, color: W.text3, lineHeight: 1.4 }}>
                            {handoff.payload} · {handoff.latency_ms} ms
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Strategic Backing */}
                  <GlassCard glow="green" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={Globe} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Strategic Backing
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        { name: 'US EXIM Bank', amount: `US$${PROJECT_FINANCIALS.exim_usd_m}M`, note: 'Critical minerals supply chain financing', color: W.cyan },
                        { name: 'Export Finance Australia', amount: `A$${PROJECT_FINANCIALS.efa_aud_m}M`, note: 'Project development and construction', color: W.green },
                      ].map(({ name, amount, note, color }) => (
                        <div key={name} style={{ padding: '8px 10px', borderRadius: 8, background: `${color}08`, border: `1px solid ${color}20` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{name}</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{amount}</span>
                          </div>
                          <div style={{ fontSize: 10, color: W.text4 }}>{note}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: W.text4, textAlign: 'center' }}>
                      ~94% of ${PROJECT_FINANCIALS.capex_m}M CAPEX covered by allied-nation financing
                    </div>
                  </GlassCard>

                  {/* Partner Handoffs */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={CloudCog} color="cyan" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Export Narrative
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: W.text2, lineHeight: 1.5 }}>
                      Passport packet bundles ore origin, reagent provenance, carbon intensity, and partner-ready payloads into a single attestation object for customs, OEMs, and offtake partners.
                    </p>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div key="timeline" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Blockchain timeline */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <GlowingIcon icon={FileText} color="violet" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Molecular-to-Magnet Ledger
                      </span>
                      <StatusChip label="Immutable" variant="violet" />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: W.violetSoft, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {batch.batch_id} · {batch.tonnage_kg} kg MREC
                      </span>
                    </div>
                    <BlockchainTimeline timeline={batch.molecular_timeline} />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
