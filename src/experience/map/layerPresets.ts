import type { LayerId } from '../../components/map/layerRegistry'

export const EXPERIENCE_LAYER_PRESETS: Record<string, LayerId[]> = {
  background: [],
  geology: ['boundary', 'drillholes', 'geosgbGeology'],
  operations: ['boundary', 'plantSites', 'pfs'],
  hydrology: ['boundary', 'hydroSprings', 'apa'],
}
