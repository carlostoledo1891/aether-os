import type { CSSProperties } from 'react'
import type { DataProvenanceKind } from '../../services/dataService'
import { PROVENANCE_SHORT_LABEL } from '../../services/dataService'
import { KIND_COLOR } from './provenanceColors'

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
      style={{ color: `${c}cc`, ...style }}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{
          background: isPredicted ? 'transparent' : c,
          border: isPredicted ? `1.5px dashed ${c}` : undefined,
        }}
      />
      {PROVENANCE_SHORT_LABEL[kind]}
    </span>
  )
}
