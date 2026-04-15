import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { createTestApp } from './helpers.js'

const INGEST_KEY = 'ingest-routes-test-key'
const nowIso = new Date().toISOString()

let app: FastifyInstance

beforeAll(async () => {
  process.env.INGEST_API_KEY = INGEST_KEY
  app = await createTestApp()
})

afterAll(async () => {
  delete process.env.INGEST_API_KEY
  await app.close()
})

const headers = { 'x-api-key': INGEST_KEY }

describe('ingest routes', () => {
  it('validates /ingest/weather payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/weather', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/weather',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        latitude: -21.84,
        longitude: -46.55,
        precipMm: 1.2,
        series: { time: [nowIso], precipitation_sum: [1.2] },
      },
    })
    expect(good.statusCode).toBe(200)
  })

  it('validates /ingest/forecast payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/forecast', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/forecast',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        latitude: -21.84,
        longitude: -46.55,
        forecastDays: 16,
        totalPrecipMm: 24.1,
        series: {
          time: [nowIso],
          temperature_2m_max: [27],
          temperature_2m_min: [18],
          precipitation_sum: [1.2],
          wind_speed_10m_max: [7],
          relative_humidity_2m_max: [71],
          et0_fao_evapotranspiration: [2.2],
        },
      },
    })
    expect(good.statusCode).toBe(200)
  })

  it('validates /ingest/historical-weather payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/historical-weather', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/historical-weather',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        latitude: -21.84,
        longitude: -46.55,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        dayCount: 366,
        totalPrecipMm: 1200,
        avgAnnualPrecipMm: 1080,
        series: {
          time: [nowIso],
          temperature_2m_max: [27],
          temperature_2m_min: [18],
          precipitation_sum: [1.2],
          wind_speed_10m_max: [7],
          et0_fao_evapotranspiration: [2.2],
        },
      },
    })
    expect(good.statusCode).toBe(200)
  })

  it('validates /ingest/market payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/market', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/market',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        kind: 'fx',
        symbol: 'BRLUSD',
        value: 5.23,
        currency: 'BRL',
      },
    })
    expect(good.statusCode).toBe(200)
  })

  it('validates /ingest/seismic payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/seismic', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/seismic',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        events: [
          {
            id: 'eq-1',
            magnitude: 2.4,
            place: 'Caldeira',
            time: nowIso,
            latitude: -21.8,
            longitude: -46.5,
            depth_km: 4.2,
          },
        ],
      },
    })
    expect(good.statusCode).toBe(200)
  })

  it('validates /ingest/lapoc payload shape', async () => {
    const bad = await app.inject({ method: 'POST', url: '/ingest/lapoc', payload: {}, headers })
    expect(bad.statusCode).toBe(400)

    const good = await app.inject({
      method: 'POST',
      url: '/ingest/lapoc',
      headers,
      payload: {
        source: 'test',
        provenance: 'simulated',
        timestamp: nowIso,
        piezometer_readings: [],
        water_quality_samples: [
          {
            sample_id: 'wq-1',
            timestamp: nowIso,
            location: 'PZ-1',
            ph: 7.1,
            sulfate_ppm: 160,
            nitrate_ppm: 21,
            iron_ppm: 1.2,
            manganese_ppm: 0.4,
            turbidity_ntu: 2.1,
          },
        ],
        field_observations: [],
      },
    })
    expect(good.statusCode).toBe(200)
  })
})
