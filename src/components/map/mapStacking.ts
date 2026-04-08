/**
 * Stacking order for Field map chrome (title strip vs HUD vs MapLibre controls).
 * Keep in sync with FieldView + HydroOverlay + PlantOverlay z-index values.
 */
export const MAP_STACKING = {
  /** Springs counter & legend — below title legibility */
  hud: 9,
  /** Field map title gradient row */
  fieldTitle: 10,
  /** Plant map bottom-center project badge */
  plantBadge: 12,
  /** Plant map domain legend (bottom-left) */
  plantLegend: 15,
  /** WQ / precip column — above default map UI */
  hudMetrics: 16,
  /** Hover cards */
  tooltip: 20,
} as const
