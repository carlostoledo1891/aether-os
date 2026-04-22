import { describe, it, expect, afterAll } from 'vitest'

process.env.DB_PATH = ':memory:'

const { getDb } = await import('../store/db.js')
const { seedUnitsIfNeeded } = await import('../store/unitSeeder.js')
const { getUnitCount, getEdgeCount, listUnits, getAllUnitTypeDefs } = await import('../store/unitStore.js')

afterAll(() => {
  try { getDb().close() } catch { /* already closed */ }
})

describe('unit seeder', () => {
  it('seeds units from domain data', () => {
    seedUnitsIfNeeded()
    const count = getUnitCount()
    expect(count).toBeGreaterThan(100)
    console.log(`[test] Total units seeded: ${count}`)
  })

  it('seeds all unit types (mining + maritime)', () => {
    const types = getAllUnitTypeDefs()
    // 15 mining types (Caldeira) + 5 maritime types
    expect(types.length).toBe(20)
  })

  it('seeds correct unit counts by type', () => {
    const sites = listUnits({ typeId: 'site' })
    // SITE-CALDEIRA + SITE-MARITIME
    expect(sites.length).toBe(2)

    const deposits = listUnits({ typeId: 'deposit' })
    expect(deposits.length).toBe(7)

    const drillholes = listUnits({ typeId: 'drillhole' })
    expect(drillholes.length).toBeGreaterThan(100)

    const tenements = listUnits({ typeId: 'tenement' })
    expect(tenements.length).toBe(6)

    const springs = listUnits({ typeId: 'spring' })
    expect(springs.length).toBe(1092)

    const piezometers = listUnits({ typeId: 'piezometer' })
    expect(piezometers.length).toBe(4)

    const plantNodes = listUnits({ typeId: 'plant_node' })
    expect(plantNodes.length).toBe(4)

    const protectedAreas = listUnits({ typeId: 'protected_area' })
    expect(protectedAreas.length).toBe(3)

    const batches = listUnits({ typeId: 'batch' })
    expect(batches.length).toBe(4)

    const conditions = listUnits({ typeId: 'permit_condition' })
    expect(conditions.length).toBe(5)

    const regulatory = listUnits({ typeId: 'regulatory_submission' })
    expect(regulatory.length).toBe(6)

    const risks = listUnits({ typeId: 'risk' })
    expect(risks.length).toBe(10)

    const incidents = listUnits({ typeId: 'incident' })
    expect(incidents.length).toBe(5)

    const offtakes = listUnits({ typeId: 'offtake' })
    expect(offtakes.length).toBe(2)

    const milestones = listUnits({ typeId: 'milestone' })
    expect(milestones.length).toBe(12)

    // Maritime instance
    const maritimeAois = listUnits({ typeId: 'maritime_aoi' })
    expect(maritimeAois.length).toBe(11)

    const vessels = listUnits({ typeId: 'vessel' })
    expect(vessels.length).toBe(12)

    const sensorStations = listUnits({ typeId: 'sensor_station' })
    expect(sensorStations.length).toBe(6)

    const incidentAlerts = listUnits({ typeId: 'incident_alert' })
    expect(incidentAlerts.length).toBe(4)

    const isrProducts = listUnits({ typeId: 'isr_product' })
    expect(isrProducts.length).toBe(2)
  })

  it('seeds edges linking units', () => {
    const edgeCount = getEdgeCount()
    expect(edgeCount).toBeGreaterThan(50)
    console.log(`[test] Total edges seeded: ${edgeCount}`)
  })

  it('is idempotent — second call does not duplicate', () => {
    const countBefore = getUnitCount()
    const edgesBefore = getEdgeCount()

    seedUnitsIfNeeded()

    expect(getUnitCount()).toBe(countBefore)
    expect(getEdgeCount()).toBe(edgesBefore)
  })

  it('refreshes unit type definitions even when units already exist', () => {
    const db = getDb()
    const staleDepositType = {
      id: 'deposit',
      label: 'Deposit',
      color: '#D97706',
      icon: 'layers',
      states: [],
      transitions: [],
      schema: [],
      metrics: [],
      inspectorSections: [{ type: 'fields', label: 'Stale Fields' }],
    }

    db.prepare('UPDATE unit_types SET def_json = ? WHERE id = ?').run(
      JSON.stringify(staleDepositType),
      'deposit',
    )

    seedUnitsIfNeeded()

    const depositType = getAllUnitTypeDefs().find(type => type.id === 'deposit')
    expect(depositType).toBeDefined()
    expect(depositType?.inspectorSections.some(section => section.type === 'graph')).toBe(true)
  })
})
