import { useServiceQueryWithArg } from '../../../hooks/useServiceQuery'
import type { EdgeSummary } from 'shared/units/types'
import { SectionShell } from './SectionShell'

interface GraphSectionProps {
  unitId: string
  label: string
  onNavigate?: (unitId: string) => void
  defaultOpen?: boolean
}

export function GraphSection({ unitId, label, onNavigate, defaultOpen = false }: GraphSectionProps) {
  const { data, isLoading } = useServiceQueryWithArg<
    { incoming: EdgeSummary[]; outgoing: EdgeSummary[] },
    string
  >(
    'unitEdges', unitId, (s, id) => s.getUnitEdges(id),
  )

  const allEdges = data ? [...data.incoming, ...data.outgoing] : []

  return (
    <SectionShell label={label} defaultOpen={defaultOpen} resetKey={unitId}>
      {isLoading && <div style={{ fontSize: 12, opacity: 0.4 }}>Loading...</div>}
      {!isLoading && allEdges.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.4 }}>No connections.</div>
      )}
      {allEdges.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {allEdges.slice(0, 30).map(edge => {
            const isOutgoing = edge.fromId === unitId
            const targetId = isOutgoing ? edge.toId : edge.fromId
            return (
              <div key={edge.id} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
                <span style={{ opacity: 0.35, fontSize: 10, minWidth: 12 }}>
                  {isOutgoing ? '→' : '←'}
                </span>
                <button
                  onClick={() => onNavigate?.(targetId)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--w-violet)', padding: 0, fontSize: 12,
                    textDecoration: 'underline', textDecorationColor: 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.textDecorationColor = 'var(--w-violet)')}
                  onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
                >
                  {targetId}
                </button>
                <span style={{ opacity: 0.45, fontSize: 11, fontStyle: 'italic' }}>
                  {edge.rel.replace(/_/g, ' ')}
                </span>
              </div>
            )
          })}
          {allEdges.length > 30 && (
            <div style={{ fontSize: 11, opacity: 0.35 }}>
              ...and {allEdges.length - 30} more
            </div>
          )}
        </div>
      )}
    </SectionShell>
  )
}
