import { useServiceQueryWithArg } from '../../../hooks/useServiceQuery'
import type { EdgeSummary } from 'shared/units/types'
import { SectionShell } from './SectionShell'

const RISK_RELS = new Set(['affects', 'threatens', 'mitigates'])

interface RisksSectionProps {
  unitId: string
  label: string
  onNavigate?: (unitId: string) => void
}

export function RisksSection({ unitId, label, onNavigate }: RisksSectionProps) {
  const { data, isLoading } = useServiceQueryWithArg<
    { incoming: EdgeSummary[]; outgoing: EdgeSummary[] },
    string
  >(
    'unitEdges', unitId, (s, id) => s.getUnitEdges(id),
  )

  const riskEdges = data
    ? [
        ...data.incoming.filter(e => RISK_RELS.has(e.rel)),
        ...data.outgoing.filter(e => RISK_RELS.has(e.rel)),
      ]
    : []

  return (
    <SectionShell label={label} defaultOpen={false}>
      {isLoading && <div style={{ fontSize: 12, opacity: 0.4 }}>Loading...</div>}
      {!isLoading && riskEdges.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.4 }}>No associated risks.</div>
      )}
      {riskEdges.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {riskEdges.map(edge => {
            const riskId = edge.fromId === unitId ? edge.toId : edge.fromId
            return (
              <button
                key={edge.id}
                onClick={() => onNavigate?.(riskId)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: 'var(--w-red)', padding: '2px 0', fontSize: 12,
                }}
              >
                {riskId} <span style={{ opacity: 0.4, fontSize: 10 }}>({edge.rel.replace(/_/g, ' ')})</span>
              </button>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}
