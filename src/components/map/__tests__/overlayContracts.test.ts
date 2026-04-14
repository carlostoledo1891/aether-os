import { describe, it, expect } from 'vitest'

describe('Map overlay layer ID contracts', () => {
  it('CaldeiraBoundary exports CALDEIRA_BOUNDARY_LAYER_ID', async () => {
    const mod = await import('../CaldeiraBoundary')
    expect(mod.CALDEIRA_BOUNDARY_LAYER_ID).toBe('caldeira-boundary-line')
  })

  it('LicenseOverlay exports LICENSE_LAYER_ID', async () => {
    const mod = await import('../LicenseOverlay')
    expect(mod.LICENSE_LAYER_ID).toBe('license-fill')
  })

  it('DrillHoleOverlay exports DRILL_LAYER_ID', async () => {
    const mod = await import('../DrillHoleOverlay')
    expect(mod.DRILL_LAYER_ID).toBe('drill-hole-core')
  })

  it('EnvironmentalOverlay exports all layer IDs', async () => {
    const mod = await import('../EnvironmentalOverlay')
    expect(mod.ENV_APA_FILL_LAYER_ID).toBe('env-apa-fill')
    expect(mod.ENV_BUFFER_FILL_LAYER_ID).toBe('env-buffer-fill')
    expect(mod.ENV_MONITORING_FILL_LAYER_ID).toBe('env-monitoring-fill')
    expect(mod.ENV_URBAN_FILL_LAYER_ID).toBe('env-urban-fill')
    expect(mod.ENV_URBAN_CENTROID_CORE_LAYER_ID).toBe('env-urban-centroid-core')
  })

  it('HydroOverlay layer IDs from hydroLayerIds', async () => {
    const mod = await import('../hydroLayerIds')
    expect(mod.HYDRO_NODE_LAYER_ID).toBe('hydro-node-core')
    expect(mod.HYDRO_SPRING_LAYER_ID).toBe('hydro-springs')
  })

  it('InfraOverlay exports INFRA_POINT_CORE_LAYER_ID', async () => {
    const mod = await import('../InfraOverlay')
    expect(mod.INFRA_POINT_CORE_LAYER_ID).toBe('infra-point-core')
  })

  it('OpsPlantSitesOverlay exports OPS_PLANT_SITE_CORE_LAYER_ID', async () => {
    const mod = await import('../OpsPlantSitesOverlay')
    expect(mod.OPS_PLANT_SITE_CORE_LAYER_ID).toBe('ops-plant-site-core')
  })

  it('PfsEngineeringOverlay exports PFS_ENGINEERING_FILL_LAYER_ID', async () => {
    const mod = await import('../PfsEngineeringOverlay')
    expect(mod.PFS_ENGINEERING_FILL_LAYER_ID).toBe('pfs-engineering-fill')
  })

  it('layerRegistry exports approved geology layer IDs', async () => {
    const mod = await import('../layerRegistry')
    expect(mod.GEOSGB_GEOLOGY_LAYER_ID).toBe('geosgb-geology')
    expect(mod.SIGMINE_LAYER_ID).toBe('sigmine-tenements')
    expect(mod.ANM_GEOLOGY_LAYER_ID).toBe('anm-geology')
  })

  it('external geology and hidroweb layers are snapshot-backed in the registry', async () => {
    const mod = await import('../layerRegistry')
    const externals = mod.ALL_LAYERS.filter((layer: { id: string }) =>
      ['geosgbGeology', 'sigmine', 'anmGeology', 'hidroweb'].includes(layer.id),
    )
    expect(externals).toHaveLength(4)
    expect(externals.every((layer: { sourceType: string }) => layer.sourceType === 'geojson-snapshot')).toBe(true)
  })

  it('Caldeira site config advertises snapshot-backed external layers', async () => {
    const mod = await import('shared/sites/caldeira')
    expect(
      mod.CALDEIRA_EXTERNAL_LAYERS.every((layer: { sourceType: string; snapshotPath?: string; renderMode?: string }) =>
        layer.sourceType === 'geojson-snapshot' && typeof layer.snapshotPath === 'string',
      ),
    ).toBe(true)
    expect(mod.CALDEIRA_EXTERNAL_LAYERS.every((layer: { renderMode?: string }) => layer.renderMode === 'snapshot-geojson')).toBe(true)
  })

  it('map registry defaults to boundary, licenses, and APA while hiding monitoring and urban', async () => {
    const mod = await import('../layerRegistry')
    const byId = new Map(mod.ALL_LAYERS.map((layer: { id: string; defaultOn: boolean; available: boolean }) => [layer.id, layer]))
    expect(byId.get('boundary')?.defaultOn).toBe(true)
    expect(byId.get('licenses')?.defaultOn).toBe(true)
    expect(byId.get('apa')?.defaultOn).toBe(true)
    expect(byId.get('monitoring')?.available).toBe(false)
    expect(byId.get('urban')?.available).toBe(false)
  })

  it('Caldeira layer manifest is the canonical source for external layers', async () => {
    const manifestMod = await import('shared/sites/caldeiraLayers')
    const siteMod = await import('shared/sites/caldeira')
    const manifestSnapshotIds = manifestMod.CALDEIRA_LAYER_MANIFEST
      .filter((layer: { sourceType: string }) => layer.sourceType === 'geojson-snapshot')
      .map((layer: { id: string }) => layer.id)
    expect(siteMod.CALDEIRA_EXTERNAL_LAYERS.map((layer: { id: string }) => layer.id)).toEqual(manifestSnapshotIds)
  })

  it('external layer manifest exposes identify, legend, and snapshot build metadata', async () => {
    const manifestMod = await import('shared/sites/caldeiraLayers')
    const sigmine = manifestMod.getCaldeiraLayer('sigmine')
    expect(sigmine?.identifyMode).toBe('arcgis-query')
    expect(sigmine?.supportsLegend).toBe(true)
    expect(sigmine?.supportsHealth).toBe(true)
    expect(sigmine?.legendItems?.length).toBeGreaterThan(0)
    expect(manifestMod.CALDEIRA_EXTERNAL_SNAPSHOT_SOURCES.map((layer: { id: string }) => layer.id)).toEqual(
      expect.arrayContaining(['geosgbGeology', 'sigmine', 'anmGeology', 'hidroweb']),
    )
  })

  it('map presets use concrete layer ids only', async () => {
    const presetMod = await import('../mapPresets')
    const registryMod = await import('../layerRegistry')
    const validLayerIds = new Set(registryMod.ALL_LAYERS.map((layer: { id: string }) => layer.id))
    const allPresetLayerIds = Object.values(presetMod.MAP_PRESETS).flatMap(preset => preset.layerIds.map(String))
    expect(allPresetLayerIds).not.toContain('environmental')
    expect(allPresetLayerIds).toContain('apa')
    expect(allPresetLayerIds.every(layerId => validLayerIds.has(layerId))).toBe(true)
  })

  it('InmetStationOverlay exports INMET_STATION_LAYER_ID', async () => {
    const mod = await import('../InmetStationOverlay')
    expect(mod.INMET_STATION_LAYER_ID).toBe('inmet-station-circle')
  })

  it('TerrainOverlay exports a renderable component', async () => {
    const mod = await import('../TerrainOverlay')
    const exported = Object.values(mod).filter(
      v => typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in v),
    )
    expect(exported.length).toBeGreaterThan(0)
  })

  it('TerrainOverlay resolves a safe hillshade anchor when present', async () => {
    const mod = await import('../TerrainOverlay')
    expect(mod.resolveHillshadeBeforeId(['background', 'water', 'road-label'])).toBe('water')
    expect(mod.resolveHillshadeBeforeId(['background', 'building'])).toBeUndefined()
  })

  it('external snapshot registry resolves all supported local datasets', async () => {
    const mod = await import('../../../data/geo/externalRegistry')
    expect(mod.getExternalSnapshotLayer('geosgbGeology')?.url).toContain('caldeira-geosgb-geology.geojson')
    expect(mod.getExternalSnapshotLayer('sigmine')?.url).toContain('caldeira-sigmine-tenements.geojson')
    expect(mod.getExternalSnapshotLayer('anmGeology')?.url).toContain('caldeira-anm-geology.geojson')
    expect(mod.getExternalSnapshotLayer('hidroweb')?.url).toContain('caldeira-snirh-stations.geojson')
  })

  it('layer runtime derives interactive ids for concrete layers', async () => {
    const mod = await import('../layerRuntime')
    expect(mod.collectInteractiveLayerIds(['boundary', 'licenses', 'apa'])).toEqual(
      expect.arrayContaining(['caldeira-boundary-line', 'license-fill', 'env-apa-fill']),
    )
    expect(mod.collectInteractiveLayerIds(['sigmine'])).toEqual(
      expect.arrayContaining(['ext-snapshot-sigmine-fill', 'ext-snapshot-sigmine-line']),
    )
  })

  it('all active overlays export a component (function or memo object)', async () => {
    const overlays = [
      () => import('../CaldeiraBoundary'),
      () => import('../LicenseOverlay'),
      () => import('../DrillHoleOverlay'),
      () => import('../EnvironmentalOverlay'),
      () => import('../HydroOverlay'),
      () => import('../InfraOverlay'),
      () => import('../OpsPlantSitesOverlay'),
      () => import('../PfsEngineeringOverlay'),
      () => import('../InmetStationOverlay'),
      () => import('../TerrainOverlay'),
    ]

    for (const load of overlays) {
      const mod = await load()
      const exportedComponents = Object.values(mod).filter(
        v => typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in v),
      )
      expect(exportedComponents.length).toBeGreaterThan(0)
    }
  })
})
