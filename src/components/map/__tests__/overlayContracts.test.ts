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

  it('DepositOverlay exports DEPOSIT_LAYER_ID', async () => {
    const mod = await import('../DepositOverlay')
    expect(mod.DEPOSIT_LAYER_ID).toBe('deposit-fill')
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

  it('AccessRoutesOverlay exports ACCESS_ROUTE_LINE_LAYER_ID', async () => {
    const mod = await import('../AccessRoutesOverlay')
    expect(mod.ACCESS_ROUTE_LINE_LAYER_ID).toBe('access-route-line')
  })

  it('LicenceEnvelopeOverlay exports LICENCE_ENVELOPE_FILL_LAYER_ID', async () => {
    const mod = await import('../LicenceEnvelopeOverlay')
    expect(mod.LICENCE_ENVELOPE_FILL_LAYER_ID).toBe('licence-envelope-fill')
  })

  it('PlantOverlay exports PLANT_NODE_LAYER_ID', async () => {
    const mod = await import('../PlantOverlay')
    expect(mod.PLANT_NODE_LAYER_ID).toBe('plant-node-core')
  })

  it('all overlays export a component (function or memo object)', async () => {
    const overlays = [
      () => import('../CaldeiraBoundary'),
      () => import('../LicenseOverlay'),
      () => import('../DepositOverlay'),
      () => import('../DrillHoleOverlay'),
      () => import('../EnvironmentalOverlay'),
      () => import('../HydroOverlay'),
      () => import('../InfraOverlay'),
      () => import('../OpsPlantSitesOverlay'),
      () => import('../PfsEngineeringOverlay'),
      () => import('../AccessRoutesOverlay'),
      () => import('../LicenceEnvelopeOverlay'),
      () => import('../PlantOverlay'),
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
