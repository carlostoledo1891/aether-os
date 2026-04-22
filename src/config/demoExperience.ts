import { W } from '../app/canvas/canvasTheme'
import type { ViewMode } from '../types/telemetry'

export const APP_VIEW_CONFIG: Record<ViewMode, {
  label: string
  description: string
  icon: 'map' | 'shield'
  color: string
}> = {
  operator: {
    label: 'Geology Review',
    description: 'Drill collars, resource classification, and field context for technical committee review.',
    icon: 'map',
    color: W.amber,
  },
  buyer: {
    label: 'Traceability Review',
    description: 'Supply-chain provenance, buyer-facing compliance evidence, and export tooling.',
    icon: 'shield',
    color: W.green,
  },
}

export const FIELD_RAIL_TABS = [
  {
    id: 'geology',
    label: 'Geology',
    description: 'JORC resource, drill evidence, and ASX-linked deposit context.',
    icon: 'mountain',
    color: W.amber,
  },
  {
    id: 'operations',
    label: 'Pilot Plant',
    description: 'Recovery validation, process telemetry, and pilot-to-plant readiness.',
    icon: 'settings',
    color: W.violet,
  },
  {
    id: 'environment',
    label: 'Hydro Twin',
    description: 'Hydrology remains visible, but clearly separated from geology claims.',
    icon: 'layers',
    color: W.cyan,
  },
] as const

export const TECHNICAL_APPENDIX = {
  id: 'technical-appendix' as const,
  navLabel: 'Technical Appendix',
  buttonLabel: 'Open Technical Appendix',
  kicker: 'Printable geology evidence',
  title: 'Technical Appendix',
  subtitle: 'JORC resource, drill results, lithology, and lab validation references',
  description: 'A printable geology dossier for technical committee review.',
}

export function getViewConfig(view: ViewMode) {
  return APP_VIEW_CONFIG[view]
}
