import type { UnitDetail } from 'shared/units/types'
import { SectionShell } from './SectionShell'

interface FieldsSectionProps {
  unit: UnitDetail
  label: string
}

export function FieldsSection({ unit, label }: FieldsSectionProps) {
  const fields = unit.typeDef.schema
  if (fields.length === 0) return null

  return (
    <SectionShell label={label}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
        {fields.map(f => {
          const val = unit.data[f.key]
          const display = val != null ? formatFieldValue(val, f.type, f.unit) : '—'
          return (
            <div key={f.key} style={{ padding: '3px 0' }}>
              <div style={{ fontSize: 10, opacity: 0.45, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: 'var(--w-text1)' }}>{display}</div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

function formatFieldValue(val: unknown, type: string, unit?: string): string {
  if (type === 'coordinates' && Array.isArray(val)) {
    return `${(val as number[])[1]?.toFixed(4) ?? '?'}°, ${(val as number[])[0]?.toFixed(4) ?? '?'}°`
  }
  if (type === 'number' && typeof val === 'number') {
    const formatted = val >= 1000 ? val.toLocaleString() : String(val)
    return unit ? `${formatted} ${unit}` : formatted
  }
  return String(val)
}
