import { useServiceQueryWithArg } from '../../../hooks/useServiceQuery'
import type { TransitionRecord } from 'shared/units/types'
import { SectionShell } from './SectionShell'

interface TimelineSectionProps {
  unitId: string
  label: string
}

export function TimelineSection({ unitId, label }: TimelineSectionProps) {
  const { data: transitions, isLoading } = useServiceQueryWithArg<TransitionRecord[], string>(
    'unitTransitions', unitId, (s, id) => s.getUnitTransitions(id),
  )

  return (
    <SectionShell label={label} defaultOpen={false}>
      {isLoading && <div style={{ fontSize: 12, opacity: 0.4 }}>Loading...</div>}
      {transitions && transitions.length === 0 && (
        <div style={{ fontSize: 12, opacity: 0.4 }}>No transitions recorded.</div>
      )}
      {transitions && transitions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transitions.slice(0, 20).map(t => (
            <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                background: 'var(--w-violet)',
              }} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--w-text1)' }}>
                  {t.fromState.replace(/_/g, ' ')} → {t.toState.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: 11, opacity: 0.45 }}>
                  {t.actor} · {new Date(t.createdAt).toLocaleDateString()}
                  {t.reason && ` · ${t.reason}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
