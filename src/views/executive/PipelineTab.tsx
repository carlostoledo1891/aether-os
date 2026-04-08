import { useMemo } from 'react'
import { Handshake } from 'lucide-react'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

export function PipelineTab() {
  const service = useAetherService()
  const offtakers = useMemo(() => service.getOfftakerPipeline(), [service])

  if (!Array.isArray(offtakers)) {
    return <div style={{ padding: 24, color: 'var(--w-text4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Loading pipeline...</div>
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2">
      {(Array.isArray(offtakers) ? offtakers : []).map((o) => (
        <ExecutiveCard key={o.id} glow="cyan" className="flex min-h-[220px] flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <GlowingIcon icon={Handshake} color="cyan" size={14} />
              <span className="truncate text-[13px] font-bold text-[var(--w-text1)]">{o.name}</span>
            </div>
            <StatusChip
              label={o.stage.toUpperCase()}
              variant={o.stage === 'binding' ? 'green' : o.stage === 'loi' ? 'violet' : 'amber'}
              size="sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            {(
              [
                ['Location', o.location],
                ['Volume', o.volumeCommitment],
                ['Product', o.product],
                ['Delivery', o.deliverySchedule],
                ['Qualification', o.qualificationStatus],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className={`${ty.label} shrink-0 normal-case tracking-normal`}>{k}</span>
                <span className="text-right text-[11px] font-semibold text-[var(--w-text2)]">{v}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 rounded-lg px-3 py-2.5"
            style={{
              background: 'rgba(0,212,200,0.06)',
              border: `1px solid ${W.cyan}26`,
            }}
          >
            <p className={`${ty.body} m-0 text-[var(--w-text3)]`}>{o.notes}</p>
          </div>
        </ExecutiveCard>
      ))}
    </div>
  )
}
