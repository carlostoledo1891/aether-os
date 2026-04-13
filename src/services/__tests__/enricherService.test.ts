import { describe, it, expect } from 'vitest'
import { createMockDataService } from '../mockDataService'
import type { MarketFxSnapshot, MarketStockSnapshot, SeismicSnapshot } from '../dataService'

describe('Enricher service methods (mock)', () => {
  const svc = createMockDataService()

  it('getMarketFx returns a valid MarketFxSnapshot', () => {
    const fx = svc.getMarketFx() as MarketFxSnapshot
    expect(fx).not.toBeNull()
    expect(fx.symbol).toBe('BRL/USD')
    expect(typeof fx.value).toBe('number')
    expect(fx.currency).toBe('BRL')
    expect(fx.source).toBe('mock')
    expect(typeof fx.updated_at).toBe('string')
  })

  it('getMarketStock returns a valid MarketStockSnapshot', () => {
    const stock = svc.getMarketStock() as MarketStockSnapshot
    expect(stock).not.toBeNull()
    expect(stock.symbol).toBe('MEI.AX')
    expect(typeof stock.value).toBe('number')
    expect(stock.currency).toBe('AUD')
    expect(stock.source).toBe('mock')
    expect(typeof stock.updated_at).toBe('string')
  })

  it('getSeismicRecent returns a valid SeismicSnapshot', () => {
    const seismic = svc.getSeismicRecent() as SeismicSnapshot
    expect(seismic).not.toBeNull()
    expect(Array.isArray(seismic.events)).toBe(true)
    expect(seismic.source).toBe('mock')
    expect(typeof seismic.updated_at).toBe('string')
  })

  it('getHistoricalWeather returns null in mock mode', () => {
    expect(svc.getHistoricalWeather()).toBeNull()
  })

  it('all enricher sources are "mock"', () => {
    const fx = svc.getMarketFx() as MarketFxSnapshot
    const stock = svc.getMarketStock() as MarketStockSnapshot
    const seismic = svc.getSeismicRecent() as SeismicSnapshot

    for (const snap of [fx, stock, seismic]) {
      expect(snap.source).toBe('mock')
    }
  })
})
