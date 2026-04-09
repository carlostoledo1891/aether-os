/** Normalise hole IDs across ASX tables (hyphens, historic 3-digit suffixes). */
const ALIASES: Record<string, string> = {
  CVSDD001: 'CVSDD0001',
  BDPDD001: 'BDPDD0001',
  BDPDD002: 'BDPDD0002',
  BDPDD003: 'BDPDD0003',
  BDPDD004: 'BDPDD0004',
  BDPDD005: 'BDPDD0005',
  BDPDD006: 'BDPDD0006',
}

export function normalizeHoleId(raw: string): string {
  let id = raw.toUpperCase().replace(/[\s-]/g, '')
  id = ALIASES[id] ?? id
  return id
}
