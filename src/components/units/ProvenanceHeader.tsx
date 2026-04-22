import type { UnitDetail } from 'shared/units/types'
import { getUnitProvenance } from './provenance'

/**
 * Provenance chips for geological / drillhole units. Renders up to 3 chips
 * (source, classification, verifier) plus an optional deeplink to the source
 * document (ASX release, drill log, Dr. Caponi report).
 *
 * Data contract — read from `unit.data.provenance`:
 *   source         short label, e.g. "ASX 2024-11-08"
 *   classification e.g. "JORC Inferred", "JORC Indicated"
 *   verifier       e.g. "Dr. Caponi, LAPOC"
 *   url            optional link, opens in a new tab
 */

interface ProvenanceHeaderProps {
  unit: UnitDetail
}

export function ProvenanceHeader({ unit }: ProvenanceHeaderProps) {
  const provenance = getUnitProvenance(unit)
  if (!provenance) return null

  const { source, classification, verifier, url } = provenance

  return (
    <div
      data-testid="provenance-header"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: '8px 16px',
        borderBottom: '1px solid var(--w-border)',
        background: 'var(--w-glass-04, rgba(255,255,255,0.02))',
      }}
    >
      {classification && (
        <Chip label={classification} variant="classification" />
      )}
      {source && (
        <Chip label={source} variant="source" href={url} />
      )}
      {verifier && (
        <Chip label={verifier} variant="verifier" />
      )}
    </div>
  )
}

type ChipVariant = 'classification' | 'source' | 'verifier'

interface ChipProps {
  label: string
  variant: ChipVariant
  href?: string
}

const VARIANT_STYLES: Record<ChipVariant, { color: string; border: string; bg: string }> = {
  classification: {
    color: 'var(--w-violet-soft, #c9b3ff)',
    border: 'var(--w-violet, rgba(124,92,252,0.6))',
    bg: 'var(--w-violet-subtle, rgba(124,92,252,0.12))',
  },
  source: {
    color: 'var(--w-cyan, #6ce6ff)',
    border: 'rgba(108,230,255,0.45)',
    bg: 'rgba(108,230,255,0.08)',
  },
  verifier: {
    color: 'var(--w-text2, #d8d8e0)',
    border: 'var(--w-border2, rgba(255,255,255,0.15))',
    bg: 'rgba(255,255,255,0.03)',
  },
}

function Chip({ label, variant, href }: ChipProps) {
  const s = VARIANT_STYLES[variant]
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: s.color,
    border: `1px solid ${s.border}`,
    background: s.bg,
    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)',
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        data-provenance-variant={variant}
        style={{ ...baseStyle, textDecoration: 'none', cursor: 'pointer' }}
        aria-label={`${variant}: ${label} (opens in a new tab)`}
      >
        {label}
        <span aria-hidden style={{ opacity: 0.6, fontSize: 9 }}>{'\u2197'}</span>
      </a>
    )
  }

  return (
    <span data-provenance-variant={variant} style={baseStyle}>
      {label}
    </span>
  )
}
