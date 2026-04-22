import type { UnitDetail } from 'shared/units/types'
import { SectionShell } from './SectionShell'

interface TelemetrySectionProps {
  unit: UnitDetail
  label: string
}

/**
 * Telemetry section for types with live sensors (spring, piezometer, plant_node).
 * Currently shows a placeholder — future integration will use the existing
 * useTelemetry() hook bound to the unit's sensor ID.
 */
export function TelemetrySection({ unit, label }: TelemetrySectionProps) {
  const sensorId = (unit.data.sensor_id ?? unit.data.spring_id ?? unit.placeId) as string | undefined

  return (
    <SectionShell label={label} defaultOpen={false}>
      <div style={{ fontSize: 12, opacity: 0.5, padding: '8px 0' }}>
        {sensorId
          ? `Live telemetry for sensor ${sensorId} — connect via SCADA bridge.`
          : 'No telemetry source configured for this unit.'}
      </div>
      {unit.typeDef.metrics.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
          {unit.typeDef.metrics.map(m => (
            <div key={m.key} style={{
              padding: '4px 10px', borderRadius: 6,
              background: 'var(--w-surface)',
              fontSize: 12,
            }}>
              <span style={{ opacity: 0.5 }}>{m.label}:</span>{' '}
              <span style={{ color: 'var(--w-text1)' }}>
                {unit.data[m.key] != null ? `${unit.data[m.key]} ${m.unit}` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
