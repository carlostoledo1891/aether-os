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
  ai_predicted: W.amber,
}

interface ProvenanceBadgeProps {
  kind: DataProvenanceKind
  title?: string
  className?: string
  style?: CSSProperties
}

export function ProvenanceBadge({ kind, title, className = '', style }: ProvenanceBadgeProps) {
  const c = KIND_COLOR[kind]
  const isPredicted = kind === 'ai_predicted'
  return (
    <span
      title={title ?? PROVENANCE_SHORT_LABEL[kind]}
      className={`inline-flex max-w-full items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-wide ${className}`}
      style={{ color: W.text4, ...style }}
    >
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: isPredicted ? 'transparent' : c,
          border: isPredicted ? `1.5px dashed ${c}` : undefined,
        }}
      />
      {PROVENANCE_SHORT_LABEL[kind]}
    </span>
  )
}
