import type { UnitDetail } from 'shared/units/types'

export interface UnitProvenance {
  source?: string
  classification?: string
  verifier?: string
  url?: string
}

/**
 * Read `data.provenance` off a unit and coerce into a safe subset of string
 * fields. Returns null when none of source/classification/verifier is present,
 * which is the signal for ProvenanceHeader to render nothing.
 */
export function getUnitProvenance(unit: UnitDetail): UnitProvenance | null {
  const raw = (unit.data as Record<string, unknown>).provenance
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  const out: UnitProvenance = {}
  if (typeof p.source === 'string') out.source = p.source
  if (typeof p.classification === 'string') out.classification = p.classification
  if (typeof p.verifier === 'string') out.verifier = p.verifier
  if (typeof p.url === 'string') out.url = p.url
  if (!out.source && !out.classification && !out.verifier) return null
  return out
}
