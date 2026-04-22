import { useServiceQueryWithArg } from '../../../hooks/useServiceQuery'
import type { EvidenceRef } from 'shared/units/types'
import { SectionShell } from './SectionShell'

interface EvidenceSectionProps {
  unitId: string
  label: string
}

export function EvidenceSection({ unitId, label }: EvidenceSectionProps) {
  const { data: evidence, isLoading } = useServiceQueryWithArg<EvidenceRef[], string>(
    'unitEvidence', unitId, (s, id) => s.getUnitEvidence(id),
  )

  return (
    <SectionShell label={label} defaultOpen={false}>
      {isLoading && <div style={{ fontSize: 12, opacity: 0.4 }}>Loading...</div>}
      {evidence && evidence.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.4 }}>No evidence attached.</div>
      )}
      {evidence && evidence.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {evidence.map(e => (
            <div key={e.id} style={{
              padding: '6px 10px', borderRadius: 6,
              background: 'var(--w-surface)',
              fontSize: 12,
            }}>
              <div style={{ color: 'var(--w-text1)', fontWeight: 500 }}>{e.label}</div>
              <div style={{ opacity: 0.45, fontSize: 11 }}>
                {e.docType} · {e.docId}
                {e.hash && ` · ${e.hash.slice(0, 12)}...`}
              </div>
              <div style={{ opacity: 0.35, fontSize: 10 }}>
                {new Date(e.attachedAt).toLocaleDateString()}
                {e.transitionId && ` · transition #${e.transitionId}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
