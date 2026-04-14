import { describe, expect, it } from 'vitest'
import { buildExternalLayerPresentation } from './externalLayerPresentation'

describe('externalLayerPresentation', () => {
  it('builds a snapshot presentation for SIGMINE features', () => {
    const presentation = buildExternalLayerPresentation('sigmine', {
      id: '832.111/2024',
      process_number: '832.111/2024',
      holder_name: 'Meteoric Resources',
      substance: 'REE',
      phase: 'research',
      area_ha: 482.5,
      source_ref: 'sigmine_processos_minerarios_ativos',
    })

    expect(presentation?.title).toBe('832.111/2024')
    expect(presentation?.subtitle).toBe('research')
    expect(presentation?.rows).toEqual(
      expect.arrayContaining([
        { label: 'Process', value: '832.111/2024' },
        { label: 'Holder', value: 'Meteoric Resources' },
      ]),
    )
    expect(presentation?.sourceBadge?.label).toBe('Snapshot')
  })

  it('labels live query results as ArcGIS query', () => {
    const presentation = buildExternalLayerPresentation(
      'sigmine',
      {
        process_number: '832.111/2024',
        label: '832.111/2024 · REE',
        holder_name: 'Meteoric Resources',
        substance: 'REE',
      },
      { mode: 'live-query' },
    )

    expect(presentation?.sourceBadge?.label).toBe('ArcGIS query')
    expect(presentation?.provenanceBadge?.kind).toBe('from_public_record')
  })
})
