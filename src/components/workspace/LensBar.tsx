import type { UseLensReturn } from '../../units/useLens'
import type { Severity } from 'shared/units/types'

const SEVERITY_COLORS: Record<Severity, string> = {
  nominal: 'var(--status-nominal, #22c55e)',
  attention: 'var(--status-attention, #f59e0b)',
  action_required: 'var(--status-action, #ef4444)',
  blocked: 'var(--status-blocked, #94a3b8)',
}

interface LensBarProps {
  lens: UseLensReturn
}

export function LensBar({ lens }: LensBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 12px' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {lens.allLenses.map(l => (
          <button
            key={l.id}
            onClick={() => lens.setLens(l.id)}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: 'none',
              fontSize: 13,
              fontWeight: lens.activeLens.id === l.id ? 600 : 400,
              cursor: 'pointer',
              background: lens.activeLens.id === l.id ? 'var(--accent, #7c5cfc)' : 'var(--surface-2, rgba(255,255,255,0.08))',
              color: lens.activeLens.id === l.id ? '#fff' : 'var(--text-secondary, rgba(255,255,255,0.65))',
              transition: 'all 150ms ease',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {lens.activeLens.unitTypes.map(typeId => (
          <button
            key={typeId}
            onClick={() => lens.toggleType(typeId)}
            style={{
              padding: '2px 8px',
              borderRadius: 10,
              border: '1px solid var(--border, rgba(255,255,255,0.12))',
              fontSize: 11,
              cursor: 'pointer',
              opacity: lens.typeToggles[typeId] ? 1 : 0.4,
              background: 'transparent',
              color: 'var(--text-secondary, rgba(255,255,255,0.65))',
              transition: 'opacity 150ms ease',
            }}
          >
            {typeId.replace(/_/g, ' ')}
          </button>
        ))}
        <span style={{ width: 1, height: 16, background: 'var(--border, rgba(255,255,255,0.12))', margin: '0 4px' }} />
        {(['nominal', 'attention', 'action_required', 'blocked'] as Severity[]).map(sev => {
          const active = lens.severityFilter.length === 0 || lens.severityFilter.includes(sev)
          return (
            <button
              key={sev}
              onClick={() => {
                const current = lens.severityFilter
                const next = current.includes(sev) ? current.filter(s => s !== sev) : [...current, sev]
                lens.setSeverityFilter(next)
              }}
              style={{
                width: 10, height: 10,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: SEVERITY_COLORS[sev],
                opacity: active ? 1 : 0.25,
                transition: 'opacity 150ms ease',
              }}
              title={sev.replace(/_/g, ' ')}
            />
          )
        })}
      </div>
    </div>
  )
}
