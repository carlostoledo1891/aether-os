/**
 * Unified z-index contract for the entire app.
 * Every numeric zIndex / z-index value should reference Z.* instead of magic numbers.
 */
export const Z = {
  // ─── Base layers (0-5) ───
  tabIndicator: 1,
  viewSwitcherPill: 2,
  mapStyleControl: 5,

  // ─── Map chrome (8-20) ───
  mapHud: 8,
  mapLayerPicker: 10,
  hud: 9,
  fieldTitle: 10,
  pitchOverlay: 10,
  plantBadge: 12,
  plantLegend: 15,
  hudMetrics: 16,
  tooltip: 20,
  executivePanel: 20,

  // ─── Header / nav (30-50) ───
  buyerPanel: 30,
  header: 50,

  // ─── Popups / floating (60) ───
  mapPopup: 60,
  controlRoom: 60,
  hydroStation: 60,
  workspaceChat: 80,

  // ─── Overlays / drawers (90-100) ───
  backdrop: 90,
  overlay: 100,
  viewEngine: 100,

  // ─── Modals (200) ───
  modal: 200,
} as const

/** @deprecated Use Z.* directly */
export const MAP_STACKING = {
  hud: Z.hud,
  fieldTitle: Z.fieldTitle,
  plantBadge: Z.plantBadge,
  plantLegend: Z.plantLegend,
  hudMetrics: Z.hudMetrics,
  tooltip: Z.tooltip,
} as const
