import { useServiceQueryWithArg } from './useServiceQuery'
import type { UnitDetail } from 'shared/units/types'

/**
 * Given a map feature ID (place_id), resolves the corresponding unit.
 * Returns null if no unit is associated with this place.
 */
export function useUnitLookup(placeId: string | null) {
  return useServiceQueryWithArg<UnitDetail | null, string | null>(
    'unitByPlace',
    placeId,
    (s, id) => (id ? s.getUnitByPlace(id) : null),
  )
}
