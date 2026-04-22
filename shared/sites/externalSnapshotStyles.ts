export interface ExternalSnapshotStyle {
  fillColor?: string
  lineColor?: string
  circleColor?: string
}

export const EXTERNAL_SNAPSHOT_STYLES = {
  geosgbGeology: {
    fillColor: 'rgba(250,204,21,0.10)',
    lineColor: 'rgba(250,204,21,0.88)',
  },
  sigmine: {
    fillColor: 'rgba(124,92,252,0.025)',
    lineColor: 'rgba(124,92,252,0.46)',
  },
  sigmineTargets: {
    // No fill: target tenements should read as outlines so they don't
    // wash over the underlying basemap or the live SIGMINE polygons.
    fillColor: 'rgba(0,0,0,0)',
    // Brand violet (#7C5CFC) outline so they stand out as Vero-curated targets.
    lineColor: '#7C5CFC',
  },
  anmGeology: {
    fillColor: 'rgba(34,211,238,0.08)',
    lineColor: 'rgba(34,211,238,0.92)',
  },
  hidroweb: {
    circleColor: '#22d3ee',
  },
} as const satisfies Record<string, ExternalSnapshotStyle>
