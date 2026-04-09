import { FileText, FlaskConical, QrCode, Send } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { BlockchainTimeline } from '../../components/BlockchainTimeline'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import type { ComplianceLedger } from '../../types/telemetry'
import css from './TraceabilityTab.module.css'

interface TraceabilityTabProps {
  batch: ComplianceLedger
  selectedStepIndex: number | null
  onStepClick: (index: number) => void
}

export function TraceabilityTab({ batch, selectedStepIndex, onStepClick }: TraceabilityTabProps) {
  const { data: API_HANDOFFS, isLoading: l1, error: e1 } = useServiceQuery('api-handoffs', s => s.getApiHandoffs())
  const { data: SCOPE_3_TRACKING, isLoading: l2, error: e2 } = useServiceQuery('scope3', s => s.getScope3Tracking())

  const firstError = e1 || e2
  if (firstError) return <ErrorFallback error={firstError} label="Traceability data" />
  if (l1 || l2 || !API_HANDOFFS || !SCOPE_3_TRACKING) {
    return <LoadingSkeleton variant="card" label="Loading traceability..." />
  }

  return (
    <div className={css.root}>
      {/* Blockchain timeline */}
      <GlassCard animate={false} className={css.card}>
        <div className={css.sectionHeader} style={{ marginBottom: 12 }}>
          <GlowingIcon icon={FileText} color="violet" size={13} />
          <span className={css.sectionTitle}>
            Molecular-to-Magnet Ledger
          </span>
          <StatusChip label="Immutable" variant="violet" />
        </div>
        <div className={css.batchInfo}>
          <span className={css.monoLabel}>
            {batch.batch_id} · {batch.tonnage_kg} kg MREC
          </span>
        </div>
        <BlockchainTimeline timeline={batch.molecular_timeline} selectedStepIndex={selectedStepIndex} onStepClick={onStepClick} />
      </GlassCard>

      {/* Scope 3 Reagent Provenance */}
      <GlassCard glow="amber" animate={false} className={css.card}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={FlaskConical} color="amber" size={13} />
          <span className={css.sectionTitle}>
            Scope 3 Reagent Provenance
          </span>
          <StatusChip label="FEOC CLEAR" variant="green" size="sm" />
        </div>
        <div className={css.kvList}>
          {[
            ['Reagent', SCOPE_3_TRACKING?.reagent ?? '—'],
            ['Supplier', SCOPE_3_TRACKING?.supplier ?? '—'],
            ['Origin', SCOPE_3_TRACKING?.supplier_origin ?? '—'],
            ['FEOC Status', SCOPE_3_TRACKING?.feoc_status ?? '—'],
            ['Verification', SCOPE_3_TRACKING?.verification_method ?? '—'],
            ['Carbon', `${(SCOPE_3_TRACKING?.carbon_footprint_kg ?? 0).toFixed(2)} kg CO₂e/kg`],
            ['Sanctions', SCOPE_3_TRACKING?.sanctions_check ?? '—'],
          ].map(([label, value]) => (
            <div key={label} className={css.kvRow}>
              <span className={css.kvLabel}>{label}</span>
              <span className={css.kvValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={css.supplyChainSection}>
          <span className={css.subsectionTitle}>
            Inbound Supply Chain
          </span>
          {SCOPE_3_TRACKING.supply_chain.map((s, i) => {
            const sc = s.status === 'verified' ? W.green : W.violet
            return (
              <div key={s.step} className={css.chainStep}>
                <div className={css.chainDotCol}>
                  <div className={css.chainDot} style={{ background: sc, boxShadow: `0 0 5px ${sc}60` }} />
                  {i < (SCOPE_3_TRACKING?.supply_chain?.length ?? 0) - 1 && <div className={css.chainLine} style={{ background: `${sc}40` }} />}
                </div>
                <div className={css.chainStepContent}>
                  <span className={css.chainStepName}>{s.step}</span>
                  <span className={css.chainStepEntity}>{s.entity}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className={css.riskNote}>
          <p className={css.riskNoteText}>{SCOPE_3_TRACKING?.risk_note ?? '—'}</p>
        </div>
      </GlassCard>

      {/* Digital Passport */}
      <GlassCard glow="violet" animate={false} className={css.card}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={QrCode} color="violet" size={13} />
          <span className={css.sectionTitle}>
            Passport Issuance
          </span>
        </div>
        <div className={css.passportRow}>
          <div className={css.qrGrid}>
            {Array.from({ length: 36 }, (_, i) => (
              <span key={i} className={css.qrCell} style={{ background: (i * 7) % 5 > 1 ? 'rgba(157,128,255,0.8)' : 'transparent' }} />
            ))}
          </div>
          <div className={css.passportInfo}>
            <div>
              <div className={css.fieldLabel}>Batch ID</div>
              <div className={css.batchIdValue}>{batch.batch_id}</div>
            </div>
            <div>
              <div className={css.fieldLabel}>Destination</div>
              <div className={css.fieldValue}>{batch.offtake_destination.split('—')[0]}</div>
            </div>
          </div>
        </div>
        <div className={css.certList}>
          {batch.certificates.map(cert => (
            <span key={cert} className={css.certChip}>
              {cert}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* API Handoffs */}
      <GlassCard glow="cyan" animate={false} className={css.card}>
        <div className={css.sectionHeader}>
          <GlowingIcon icon={Send} color="cyan" size={13} />
          <span className={css.sectionTitle}>
            API Handoff Layer
          </span>
        </div>
        <div className={css.kvList}>
          {(API_HANDOFFS ?? []).map((handoff) => (
            <div key={handoff.system} className={css.handoffCard}>
              <div className={css.handoffHeader}>
                <span className={css.handoffSystem}>{handoff.system}</span>
                <StatusChip label={handoff.status.toUpperCase()} variant={handoff.status === 'queued' ? 'amber' : 'green'} size="sm" />
              </div>
              <div className={css.handoffEndpoint}>{handoff.endpoint}</div>
              <div className={css.handoffMeta}>{handoff.payload} · {handoff.latency_ms} ms</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
