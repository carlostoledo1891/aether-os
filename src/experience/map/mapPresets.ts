import { CALDEIRA_VIEW_STATE } from '../../components/map/MapBase'
import type { ExperienceMapPresetId } from '../types'

export const EXPERIENCE_MAP_PRESETS: Record<ExperienceMapPresetId, typeof CALDEIRA_VIEW_STATE> = {
  'caldeira-default': CALDEIRA_VIEW_STATE,
  'caldeira-close': {
    ...CALDEIRA_VIEW_STATE,
    zoom: CALDEIRA_VIEW_STATE.zoom + 0.8,
  },
  'caldeira-hero': {
    ...CALDEIRA_VIEW_STATE,
    zoom: CALDEIRA_VIEW_STATE.zoom + 1.35,
  },
  'caldeira-technical': {
    ...CALDEIRA_VIEW_STATE,
    zoom: CALDEIRA_VIEW_STATE.zoom + 0.25,
  },
}
