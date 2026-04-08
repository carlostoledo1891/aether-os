import { useMemo } from 'react'
import { FileText, FlaskConical, QrCode, Send } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { BlockchainTimeline } from '../../components/BlockchainTimeline'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import type { ComplianceLedger } from '../../types/telemetry'

interface TraceabilityTabProps {
  batch: ComplianceLedger
  selectedStepIndex: number | null
  onStepClick: (index: number) => void
}

export function TraceabilityTab({ batch, selectedStepIndex, onStepClick }: TraceabilityTabProps) {
  const service = useAetherService()
  const API_HANDOFFS = useMemo(() => service.getApiHandoffs(), [service])
  const SCOPE_3_TRACKING = useMemo(() => service.getScope3Tracking(), [service])

  if (!Array.isArray(API_HANDOFFS) || !SCOPE_3_TRACKING) {
    return <div style={{ padding: 24, color: 'var(--w-text4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Loading traceability...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <BlockchainTimeline timeline={batch.molecular_timeline} selectedStepIndex={selectedStepIndex} onStepClick={onStepClick} />
      </GlassCard>

      {/* Scope 3 Reagent Provenance */}
      <GlassCard glow="amber" animate={false} style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <GlowingIcon icon={FlaskConical} color="amber" size={13} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
            Scope 3 Reagent Provenance
          </span>
          <StatusChip label="FEOC CLEAR" variant="green" size="sm" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            ['Reagent', SCOPE_3_TRACKING.reagent],
            ['Supplier', SCOPE_3_TRACKING.supplier],
            ['Origin', SCOPE_3_TRACKING.supplier_origin],
            ['FEOC Status', SCOPE_3_TRACKING.feoc_status],
            ['Verification', SCOPE_3_TRACKING.verification_method],
            ['Carbon', `${SCOPE_3_TRACKING.carbon_footprint_kg.toFixed(2)} kg CO₂e/kg`],
            ['Sanctions', SCOPE_3_TRACKING.sanctions_check],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 10, color: W.text3, flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 10, color: W.text1, fontWeight: 600, textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: W.text4, marginBottom: 6 }}>
            Inbound Supply Chain
          </span>
          {SCOPE_3_TRACKING.supply_chain.map((s, i) => {
            const sc = s.status === 'verified' ? W.green : W.violet
            return (
              <div key={s.step} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc, boxShadow: `0 0 5px ${sc}60`, flexShrink: 0 }} />
                  {i < SCOPE_3_TRACKING.supply_chain.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 10, background: `${sc}40` }} />}
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: W.text1 }}>{s.step}</span>
                  <span style={{ fontSize: 10, color: W.text3, marginLeft: 6 }}>{s.entity}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 8, padding: '7px 9px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.18)', borderRadius: W.radius.sm }}>
          <p style={{ margin: 0, fontSize: 10, color: W.text2, lineHeight: 1.45 }}>{SCOPE_3_TRACKING.risk_note}</p>
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
            border: '2px solid rgba(124,92,252,0.4)', borderRadius: W.radius.sm, padding: 3,
            display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 1,
            background: 'rgba(124,92,252,0.06)',
          }}>
            {Array.from({ length: 36 }, (_, i) => (
              <span key={i} style={{ background: (i * 7) % 5 > 1 ? 'rgba(157,128,255,0.8)' : 'transparent', borderRadius: W.radius.xs }} />
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
              fontSize: 10, color: W.text3, padding: '2px 6px',
              background: W.glass04, border: W.chromeBorder, borderRadius: W.radius.xs,
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
            <div key={handoff.system} style={{ padding: '7px 9px', borderRadius: W.radius.sm, background: W.glass03, border: `1px solid ${W.glass07}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 9.5, color: W.text1, fontWeight: 700 }}>{handoff.system}</span>
                <StatusChip label={handoff.status.toUpperCase()} variant={handoff.status === 'queued' ? 'amber' : 'green'} size="sm" />
              </div>
              <div style={{ fontSize: 10, color: W.violetSoft, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{handoff.endpoint}</div>
              <div style={{ fontSize: 10, color: W.text3, lineHeight: 1.4 }}>{handoff.payload} · {handoff.latency_ms} ms</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
