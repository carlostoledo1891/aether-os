import { useServiceQueryWithArg } from '../../../hooks/useServiceQuery'
import type { EdgeSummary } from 'shared/units/types'
import { SectionShell } from './SectionShell'

const CHILD_RELS = new Set(['contains', 'drilled_at', 'monitors', 'covers', 'holds'])

interface ChildrenSectionProps {
  unitId: string
  label: string
  onNavigate?: (unitId: string) => void
}

export function ChildrenSection({ unitId, label, onNavigate }: ChildrenSectionProps) {
  const { data, isLoading } = useServiceQueryWithArg<
    { incoming: EdgeSummary[]; outgoing: EdgeSummary[] },
    string
  >(
    'unitEdges', unitId, (s, id) => s.getUnitEdges(id),
  )

  const children = data
    ? [
        ...data.outgoing.filter(e => CHILD_RELS.has(e.rel)),
        ...data.incoming.filter(e => CHILD_RELS.has(e.rel)),
      ]
    : []

  return (
    <SectionShell label={label} defaultOpen={false}>
      {isLoading && <div style={{ fontSize: 12, opacity: 0.4 }}>Loading...</div>}
      {!isLoading && children.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.4 }}>No child units.</div>
      )}
      {children.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {children.slice(0, 50).map(edge => {
            const childId = edge.fromId === unitId ? edge.toId : edge.fromId
            return (
              <button
                key={edge.id}
                onClick={() => onNavigate?.(childId)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: 'var(--w-violet)', padding: '2px 0', fontSize: 12,
                }}
              >
                {childId} <span style={{ opacity: 0.4, fontSize: 10 }}>({edge.rel.replace(/_/g, ' ')})</span>
              </button>
            )
          })}
          {children.length > 50 && (
            <div style={{ fontSize: 11, opacity: 0.35 }}>...and {children.length - 50} more</div>
          )}
        </div>
      )}
    </SectionShell>
  )
}
