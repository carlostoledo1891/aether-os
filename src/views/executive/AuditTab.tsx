import { useState, useMemo } from 'react'
import { ScrollText } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import { AUDIT_TYPE_COLOR, AUDIT_TYPE_LABEL } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import ty from './executiveTypography.module.css'

export function AuditTab() {
  const service = useAetherService()
  const dataCtx = useMemo(() => service.getDataContext(), [service])
  const auditTrail = useMemo(() => service.getAuditTrail(), [service])
  const [auditFilter, setAuditFilter] = useState<string>('all')

  const filteredAudit = useMemo(
    () => (auditFilter === 'all' ? auditTrail : auditTrail.filter((e) => e.type === auditFilter)),
    [auditTrail, auditFilter],
  )

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            'all',
            'batch_created',
            'passport_issued',
            'api_handoff',
            'alert_triggered',
            'alert_resolved',
            'compliance_check',
            'user_action',
            'regulatory_submission',
            'system_event',
            'offtake_update',
          ] as const
        ).map((filterKey) => (
          <button
            key={filterKey}
            type="button"
            onClick={() => setAuditFilter(filterKey)}
            className="rounded-md border-none px-3 py-2 text-[10px] font-bold uppercase tracking-[0.04em] transition-all"
            style={{
              cursor: 'pointer',
              background: auditFilter === filterKey ? `${W.text2}20` : W.glass04,
              color: auditFilter === filterKey ? W.text1 : W.text4,
              outline:
                auditFilter === filterKey ? `1px solid ${W.text2}40` : W.hairlineBorder,
            }}
          >
            {filterKey === 'all' ? 'All' : AUDIT_TYPE_LABEL[filterKey]}
          </button>
        ))}
      </div>

      <ExecutiveCard>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <GlowingIcon icon={ScrollText} color="violet" size={14} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--w-text3)]">
            {dataCtx.telemetry === 'simulated' ? 'Demonstration event log' : 'Event log'}
          </span>
          <span className="text-[11px] text-[var(--w-text4)]">({filteredAudit.length} events)</span>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[720px]">
            <div
              className="grid gap-3 border-b border-[color-mix(in_srgb,var(--w-text4)_30%,transparent)] px-1 py-2"
              style={{ gridTemplateColumns: 'minmax(132px,0.9fr) 72px minmax(160px,1.4fr) minmax(120px,1fr)' }}
            >
              {['Timestamp', 'Type', 'Event', 'Hash'].map((h) => (
                <span key={h} className={ty.th}>
                  {h}
                </span>
              ))}
            </div>

            {filteredAudit.map((evt) => {
              const typeColor = AUDIT_TYPE_COLOR[evt.type]
              return (
                <div
                  key={evt.id}
                  className="grid gap-3 border-b px-1 py-3"
                  style={{
                    gridTemplateColumns: 'minmax(132px,0.9fr) 72px minmax(160px,1.4fr) minmax(120px,1fr)',
                    borderBottomColor: W.glass04,
                  }}
                >
                  <span className={`${ty.mono} text-[11px] text-[var(--w-text4)]`}>
                    {new Date(evt.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span
                    className="h-fit self-start rounded px-1.5 py-0.5 text-center text-[9px] font-extrabold uppercase tracking-[0.06em]"
                    style={{
                      color: typeColor,
                      background: `${typeColor}15`,
                      border: `1px solid ${typeColor}30`,
                    }}
                  >
                    {AUDIT_TYPE_LABEL[evt.type]}
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1 text-[11px] font-bold text-[var(--w-text1)]">{evt.action}</div>
                    <div className={`${ty.body} text-[var(--w-text3)]`}>{evt.detail}</div>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="text-[10px] text-[var(--w-text4)]">
                        Actor:{' '}
                        <span className="font-semibold text-[var(--w-text3)]">{evt.actor}</span>
                      </span>
                      {evt.relatedEntityId && (
                        <span className="text-[10px] text-[var(--w-text4)]">
                          Ref:{' '}
                          <span className="font-mono font-semibold" style={{ color: typeColor }}>
                            {evt.relatedEntityId}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="break-all font-mono text-[10px] leading-snug text-[var(--w-text4)]">
                      {evt.hash}
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.04em] text-[var(--w-green)]">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: W.green, boxShadow: `0 0 4px ${W.green}60` }}
                      />
                      VERIFIED
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ExecutiveCard>

      <div className="rounded-lg px-4 py-3" style={{ border: `1px solid ${W.glass07}`, background: W.glass03 }}>
        <p className={`${ty.body} m-0 text-[var(--w-text3)]`}>
          {dataCtx.telemetry === 'simulated' ? (
            <>
              Events below use <strong style={{ color: W.text2 }}>stub hashes for demonstration</strong>. They illustrate how a
              controlled, append-only ledger could support regulatory and board review once wired to your WORM / blockchain and
              identity systems. For official inquiries, use filed submissions and portal confirmations — not this screen alone.
            </>
          ) : (
            <>
              Material events are cryptographically hashed and anchored to the permissioned enterprise blockchain. Entries are
              immutable — post-creation tampering is mathematically impossible. The audit trail supports regulatory inquiries,
              board audits, and off-taker due diligence alongside primary records.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
