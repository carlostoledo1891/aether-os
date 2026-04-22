import { useServiceQueryWithArg } from './useServiceQuery'
import type { UnitSummary } from 'shared/units/types'

export interface UseUnitsFilters {
  typeId?: string
  state?: string
  severity?: string
}

export function useUnits(filters?: UseUnitsFilters) {
  return useServiceQueryWithArg<UnitSummary[], UseUnitsFilters | undefined>(
    'units',
    filters,
    (s, f) => s.getUnits(f ?? undefined),
  )
}
