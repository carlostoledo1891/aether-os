import { useState, useCallback, useMemo } from 'react'
import type { Lens, Severity } from 'shared/units/types'
import { ALL_LENSES, LENS_FIELD, getLensById } from './lensRegistry'

export interface LensState {
  activeLens: Lens
  typeToggles: Record<string, boolean>
  severityFilter: Severity[]
}

export interface UseLensReturn extends LensState {
  setLens: (id: string) => void
  toggleType: (typeId: string) => void
  setSeverityFilter: (severities: Severity[]) => void
  allLenses: Lens[]
  activeTypeIds: string[]
}

/**
 * Optional configuration to override the default (Caldeira-shaped)
 * lens registry. Used by non-mining instances like Atlantic Maritime
 * to render their own LensBar / KpiStrip without polluting the global
 * mining lens registry.
 */
export interface UseLensConfig {
  /** Custom lens set. Falls back to the global ALL_LENSES if omitted. */
  lenses?: Lens[]
  /** Lens to use on first paint (and when the URL hash doesn't match). */
  defaultLensId?: string
}

function resolveLensSet(config?: UseLensConfig): Lens[] {
  return config?.lenses && config.lenses.length > 0 ? config.lenses : ALL_LENSES
}

function resolveDefaultLens(set: Lens[], config?: UseLensConfig): Lens {
  if (config?.defaultLensId) {
    const found = set.find(l => l.id === config.defaultLensId)
    if (found) return found
  }
  if (config?.lenses && config.lenses.length > 0) return config.lenses[0]
  return LENS_FIELD
}

function getInitialLens(set: Lens[], config?: UseLensConfig): Lens {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    const fromHash = set.find(l => l.id === hash) ?? getLensById(hash)
    if (fromHash) return fromHash
  }
  return resolveDefaultLens(set, config)
}

function buildToggles(lens: Lens): Record<string, boolean> {
  const off = new Set(lens.defaultOffTypes ?? [])
  const toggles: Record<string, boolean> = {}
  for (const t of lens.unitTypes) toggles[t] = !off.has(t)
  return toggles
}

export function useLens(config?: UseLensConfig): UseLensReturn {
  const lensSet = useMemo(() => resolveLensSet(config), [config])

  const [activeLens, setActiveLens] = useState<Lens>(() => getInitialLens(lensSet, config))

  const [typeToggles, setTypeToggles] = useState<Record<string, boolean>>(() => buildToggles(activeLens))

  const [severityFilter, setSeverityFilter] = useState<Severity[]>(
    activeLens.severityFilter ?? [],
  )

  const setLens = useCallback((id: string) => {
    const lens = lensSet.find(l => l.id === id) ?? resolveDefaultLens(lensSet, config)
    setActiveLens(lens)
    setTypeToggles(buildToggles(lens))
    setSeverityFilter(lens.severityFilter ?? [])
    if (typeof window !== 'undefined') {
      window.location.hash = id
    }
  }, [lensSet, config])

  const toggleType = useCallback((typeId: string) => {
    setTypeToggles(prev => ({ ...prev, [typeId]: !prev[typeId] }))
  }, [])

  const activeTypeIds = useMemo(
    () => Object.entries(typeToggles).filter(([, on]) => on).map(([id]) => id),
    [typeToggles],
  )

  return {
    activeLens,
    typeToggles,
    severityFilter,
    setLens,
    toggleType,
    setSeverityFilter,
    allLenses: lensSet,
    activeTypeIds,
  }
}
