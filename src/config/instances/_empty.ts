/**
 * Empty / unconfigured instance — what /app renders when no use case is
 * picked. The camera opens on a global view; there are no KPIs because
 * "no instance" has nothing to count. Not selectable from the picker
 * (it IS the picker).
 */

import type { InstanceConfig } from './types'

export const EMPTY_INSTANCE: InstanceConfig = {
  slug: '_empty',
  label: 'No instance',
  brand: {
    brandLine: 'Vero',
    productLine: 'No instance loaded — pick a use case to begin',
  },
  cameraPreset: {
    // Global view, slightly tilted so the user sees this is a real map
    // surface rather than an empty placeholder. Atlantic-centred so both
    // Caldeira (Brazil) and the maritime instance (US east coast) sit
    // inside the visible frame.
    longitude: -45,
    latitude: 5,
    zoom: 1.6,
    pitch: 0,
    bearing: 0,
  },
  kpis: [],
  pickerCard: {
    eyebrow: '',
    title: 'Pick a use case',
    description: 'No instance loaded.',
    tenant: '',
    ctaLabel: '',
  },
  selectable: false,
  glyph: '·',
}
