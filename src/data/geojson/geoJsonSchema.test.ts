import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadJson(name: string): unknown {
  const p = join(__dirname, name)
  return JSON.parse(readFileSync(p, 'utf8')) as unknown
}

const HOLE_TYPES = new Set(['DD', 'AC', 'AUGER'])
const LICENCE_CONFIDENCE = new Set(['verified_vector', 'georeferenced_figure', 'approximate', 'illustrative'])

describe('Caldeira GeoJSON schema', () => {
  it('caldeira-licenses features have source_ref, as_of, confidence', () => {
    const fc = loadJson('caldeira-licenses.geojson') as {
      type: string
      features: { properties: Record<string, unknown> }[]
    }
    expect(fc.type).toBe('FeatureCollection')
    expect(fc.features.length).toBeGreaterThan(0)
    for (const f of fc.features) {
      const p = f.properties
      expect(typeof p.source_ref).toBe('string')
      expect((p.source_ref as string).length).toBeGreaterThan(0)
      expect(typeof p.as_of).toBe('string')
      expect(LICENCE_CONFIDENCE.has(p.confidence as string)).toBe(true)
    }
  })

  it('caldeira-drillholes features have hole_type DD|AC|AUGER and source_ref', () => {
    const fc = loadJson('caldeira-drillholes.geojson') as {
      type: string
      features: { properties: Record<string, unknown> }[]
    }
    expect(fc.type).toBe('FeatureCollection')
    expect(fc.features.length).toBeGreaterThan(0)
    for (const f of fc.features) {
      const p = f.properties
      expect(HOLE_TYPES.has(p.hole_type as string)).toBe(true)
      expect(typeof p.source_ref).toBe('string')
    }
  })

  it('split environmental / PFS GeoJSON are valid FeatureCollections', () => {
    for (const file of [
      'caldeira-environmental.geojson',
      'caldeira-apa-pedra-branca.geojson',
      'caldeira-apa-buffer.geojson',
      'caldeira-pfs-engineering.geojson',
      'caldeira-reference-udc.geojson',
      'caldeira-urban-context.geojson',
      'caldeira-boundary.geojson',
      'caldeira-ops-plant-sites.geojson',
      'caldeira-access-routes.geojson',
      'caldeira-licence-envelope.geojson',
    ]) {
      const fc = loadJson(file) as { type: string; features: unknown[] }
      expect(fc.type).toBe('FeatureCollection')
      expect(Array.isArray(fc.features)).toBe(true)
    }
  })

  it('caldeira-ops-plant-sites has pilot + commercial Points with Infra-shaped props', () => {
    const fc = loadJson('caldeira-ops-plant-sites.geojson') as {
      features: { geometry: { type: string }; properties: Record<string, unknown> }[]
    }
    expect(fc.features.length).toBe(2)
    for (const f of fc.features) {
      expect(f.geometry.type).toBe('Point')
      expect(typeof f.properties.id).toBe('string')
      expect(typeof f.properties.label).toBe('string')
      expect(typeof f.properties.kind).toBe('string')
    }
  })

  it('caldeira-access-routes is LineString', () => {
    const fc = loadJson('caldeira-access-routes.geojson') as {
      features: { geometry: { type: string } }[]
    }
    expect(fc.features[0].geometry.type).toBe('LineString')
  })
})
