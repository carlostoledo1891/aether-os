import type { CSSProperties } from 'react'
import type { DataProvenanceKind } from '../../services/dataService'
import { PROVENANCE_SHORT_LABEL } from '../../services/dataService'
import { W } from '../../app/canvas/canvasTheme'

const KIND_COLOR: Record<DataProvenanceKind, string> = {
  verified_real: W.green,
  from_public_record: W.cyan,
  issuer_attested: W.violetSoft,
  modeled: W.amber,
  illustrative: W.text3,
  simulated: W.text4,
}

interface ProvenanceBadgeProps {
  kind: DataProvenanceKind
  title?: string
  className?: string
  style?: CSSProperties
}

export function ProvenanceBadge({ kind, title, className = '', style }: ProvenanceBadgeProps) {
  const c = KIND_COLOR[kind]
  return (
    <span
      title={title ?? PROVENANCE_SHORT_LABEL[kind]}
      className={`inline-flex max-w-full items-center rounded px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wide ${className}`}
      style={{
        color: c,
        background: `${c}18`,
        border: `1px solid ${c}40`,
        ...style,
      }}
    >
      {PROVENANCE_SHORT_LABEL[kind]}
    </span>
  )
}
