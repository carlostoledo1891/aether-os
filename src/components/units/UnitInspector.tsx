import { useState } from 'react'
import { useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import type { UnitDetail, InspectorSectionDef } from 'shared/units/types'
import { FieldsSection } from './sections/FieldsSection'
import { TimelineSection } from './sections/TimelineSection'
import { EvidenceSection } from './sections/EvidenceSection'
import { GraphSection } from './sections/GraphSection'
import { TelemetrySection } from './sections/TelemetrySection'
import { ChildrenSection } from './sections/ChildrenSection'
import { RisksSection } from './sections/RisksSection'
import { ProvenanceHeader } from './ProvenanceHeader'
import { TransitionDialog } from './TransitionDialog'

const SEVERITY_COLORS: Record<string, string> = {
  nominal: '#22c55e',
  attention: '#f59e0b',
  action_required: '#ef4444',
  blocked: '#94a3b8',
}

interface UnitInspectorProps {
  unitId: string
  onClose?: () => void
  onNavigate?: (unitId: string) => void
  openGraphByDefault?: boolean
}

export function UnitInspector({ unitId, onClose, onNavigate, openGraphByDefault = false }: UnitInspectorProps) {
  const { data: unit, isLoading, error } = useServiceQueryWithArg<UnitDetail | null, string>(
    'unitDetail', unitId, (s, id) => s.getUnit(id),
  )
  const [showTransition, setShowTransition] = useState(false)

  if (isLoading) {
    return (
      <div style={{ padding: 20, color: 'var(--w-text3)' }}>
        Loading unit...
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div style={{ padding: 20, color: 'var(--w-text3)' }}>
        {error ? `Error: ${error.message}` : 'Unit not found'}
      </div>
    )
  }

  const severityColor = SEVERITY_COLORS[unit.severity] ?? '#888'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--w-panel)',
      borderLeft: '1px solid var(--w-border)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6,
        borderBottom: '1px solid var(--w-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.5, color: unit.typeDef.color }}>
              {unit.typeDef.label}
            </span>
          </div>
          {onClose && (
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: 'var(--w-text3)', cursor: 'pointer', fontSize: 16, padding: 4,
            }}>✕</button>
          )}
        </div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--w-text1)' }}>{unit.label}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 10,
            fontSize: 11, fontWeight: 500,
            background: `${severityColor}22`, color: severityColor, border: `1px solid ${severityColor}44`,
          }}>
            {unit.currentState.replace(/_/g, ' ')}
          </span>
          <span style={{ fontSize: 11, opacity: 0.45 }}>
            {unit.edgeCount} edges · {unit.evidenceCount} evidence
          </span>
        </div>
      </div>

      {/* Provenance chips (JORC / source / verifier) — only when data.provenance is present */}
      <ProvenanceHeader unit={unit} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 16px', borderBottom: '1px solid var(--w-border)' }}>
        <button
          onClick={() => setShowTransition(true)}
          style={{
            padding: '4px 12px', borderRadius: 6, border: '1px solid var(--w-violet)',
            background: 'transparent', color: 'var(--w-violet)', fontSize: 12, cursor: 'pointer',
          }}
        >
          Transition
        </button>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 16px 0' }}>
        {unit.typeDef.inspectorSections.map((section, i) => (
          <InspectorSection
            key={`${section.type}-${i}`}
            section={section}
            unit={unit}
            onNavigate={onNavigate}
            openGraphByDefault={openGraphByDefault}
          />
        ))}
      </div>

      {showTransition && (
        <TransitionDialog
          unit={unit}
          onClose={() => setShowTransition(false)}
        />
      )}
    </div>
  )
}

function InspectorSection({ section, unit, onNavigate, openGraphByDefault }: {
  section: InspectorSectionDef
  unit: UnitDetail
  onNavigate?: (unitId: string) => void
  openGraphByDefault?: boolean
}) {
  switch (section.type) {
    case 'fields':
      return <FieldsSection unit={unit} label={section.label} />
    case 'timeline':
      return <TimelineSection unitId={unit.id} label={section.label} />
    case 'evidence':
      return <EvidenceSection unitId={unit.id} label={section.label} />
    case 'graph':
      return (
        <GraphSection
          unitId={unit.id}
          label={section.label}
          onNavigate={onNavigate}
          defaultOpen={openGraphByDefault}
        />
      )
    case 'telemetry':
      return <TelemetrySection unit={unit} label={section.label} />
    case 'children':
      return <ChildrenSection unitId={unit.id} label={section.label} onNavigate={onNavigate} />
    case 'risks':
      return <RisksSection unitId={unit.id} label={section.label} onNavigate={onNavigate} />
    default:
      return null
  }
}
