import type { FastifyInstance } from 'fastify'
import {
  getDomainState, getLatestWeather, getMarketData, getRecentSeismic,
  dismissAlert, dismissAllAlerts,
} from '../store/db.js'

export async function domainRoutes(app: FastifyInstance) {
  /* ─── Financial scenarios ───────────────────────────────────────────── */
  app.get<{ Params: { key: string } }>('/api/financials/scenario/:key', async (req, reply) => {
    const scenarios = getDomainState<Record<string, unknown>>('financial_scenarios')
    if (!scenarios) return reply.code(503).send({ error: 'Not seeded' })
    const s = (scenarios as Record<string, unknown>)[req.params.key]
    return s ?? reply.code(404).send({ error: 'Unknown scenario key' })
  })

  app.get('/api/financials/sensitivity', async (_req, reply) => {
    const data = getDomainState('sensitivity_table')
    return data ?? reply.code(503).send({ error: 'Not seeded' })
  })

  /* ─── Risk & Incident ───────────────────────────────────────────────── */
  app.get('/api/risks', async () => getDomainState('risks') ?? [])
  app.get('/api/incidents', async () => getDomainState('incidents') ?? [])

  /* ─── Pipeline & Capital ────────────────────────────────────────────── */
  app.get('/api/offtakers', async () => getDomainState('offtakers') ?? [])
  app.get('/api/capital', async () => getDomainState('capital') ?? {})

  /* ─── DFS & Regulatory ──────────────────────────────────────────────── */
  app.get('/api/dfs/workstreams', async () => getDomainState('dfs_workstreams') ?? [])
  app.get('/api/regulatory', async () => getDomainState('regulatory_log') ?? [])

  /* ─── Benchmarks, Audit, ESG ────────────────────────────────────────── */
  app.get('/api/benchmarks', async () => getDomainState('benchmarks') ?? [])
  app.get('/api/audit', async () => getDomainState('audit_trail') ?? [])
  app.get('/api/esg', async () => getDomainState('esg_frameworks') ?? [])

  /* ─── Batches ───────────────────────────────────────────────────────── */
  app.get('/api/batches', async () => getDomainState('batches') ?? [])
  app.get<{ Params: { id: string } }>('/api/batches/:id', async (req, reply) => {
    const batches = getDomainState<Array<{ batch_id: string }>>('batches')
    const batch = batches?.find(b => b.batch_id === req.params.id)
    return batch ?? reply.code(404).send({ error: 'Batch not found' })
  })

  /* ─── Project-level static data ─────────────────────────────────────── */
  app.get('/api/project/financials', async () => getDomainState('project_financials') ?? {})
  app.get('/api/project/timeline', async () => getDomainState('project_timeline') ?? [])
  app.get('/api/project/deposits', async () => getDomainState('deposit_data') ?? [])
  app.get('/api/project/resources', async () => getDomainState('resource_classification') ?? {})
  app.get('/api/project/hydrology', async () => getDomainState('hydrology_scenarios') ?? [])
  app.get('/api/project/plant-performance', async () => getDomainState('plant_performance') ?? {})
  app.get('/api/project/safety', async () => getDomainState('u_th_safety') ?? {})
  app.get('/api/project/thresholds', async () => getDomainState('thresholds') ?? {})
  app.get('/api/project/springs/count', async () => ({ count: getDomainState<number>('spring_count') ?? 0 }))
  app.get('/api/project/market-prices', async () => getDomainState('market_prices') ?? {})
  app.get('/api/project/scale-up', async () => getDomainState('scale_up_pathway') ?? {})
  app.get('/api/project/hardware-sensors', async () => getDomainState('hardware_sensors') ?? [])
  app.get('/api/project/cyber-pillars', async () => getDomainState('cyber_pillars') ?? [])
  app.get('/api/project/api-handoffs', async () => getDomainState('api_handoffs') ?? [])
  app.get('/api/project/scope3', async () => getDomainState('scope3_tracking') ?? {})

  /* ─── Context & Provenance (dynamic based on enricher state) ─────────── */
  app.get('/api/context', async () => {
    const base = getDomainState<Record<string, unknown>>('data_context') ?? {}
    const weather = getLatestWeather()
    const fx = getMarketData('BRL/USD')
    const seismic = getRecentSeismic(1)

    const sources: string[] = ['Engine']
    if (weather) sources.push('Open-Meteo')
    if (fx) sources.push('BCB')
    if (seismic.length > 0) sources.push('USGS')

    return {
      ...base,
      bannerLabel: `Live pipeline — ${sources.join(' + ')}`,
    }
  })

  app.get('/api/provenance', async () => {
    const base = getDomainState<{ presentationMode: boolean; sections: Record<string, { kind: string; hint: string }> }>('provenance_profile')
    if (!base) return {}

    const weather = getLatestWeather()
    const fx = getMarketData('BRL/USD')

    const sections = { ...base.sections }
    if (weather) {
      sections['precip_field'] = { kind: 'verified_real', hint: `Open-Meteo live data (updated ${weather.updatedAt})` }
      sections['hydro_spring_status'] = { kind: 'modeled', hint: 'Active/Reduced/Suppressed overlay — modeled with real precip input from Open-Meteo' }
    }
    if (fx) {
      sections['fx_rate'] = { kind: 'verified_real', hint: `BCB PTAX rate (updated ${fx.updatedAt})` }
    }

    return { ...base, sections }
  })

  /* ─── Issuer & Spatial ──────────────────────────────────────────────── */
  app.get('/api/issuer-snapshot', async () => getDomainState('issuer_snapshot') ?? {})
  app.get('/api/spatial-insights', async () => getDomainState('spatial_insights') ?? {})

  /* ─── Export bundle ─────────────────────────────────────────────────── */
  app.get('/api/export/regulatory', async () => getDomainState('regulatory_export_bundle') ?? {})

  /* ─── Spring history ────────────────────────────────────────────────── */
  app.get<{ Params: { id: string } }>('/api/springs/:id/history', async (req) => {
    const allEvents = getDomainState<Array<{ springId: string }>>('spring_events') ?? []
    return allEvents.filter(e => e.springId === req.params.id)
  })

  /* ─── Weather, Market, Seismic (from enrichers) ─────────────────────── */
  app.get('/api/weather/current', async (_req, reply) => {
    const data = getLatestWeather()
    return data ?? reply.code(503).send({ error: 'No weather data ingested' })
  })

  app.get('/api/market/fx', async (_req, reply) => {
    const data = getMarketData('BRL/USD')
    return data ?? reply.code(503).send({ error: 'No FX data' })
  })

  app.get('/api/market/stock', async (_req, reply) => {
    const data = getMarketData('MEI.AX')
    return data ?? reply.code(503).send({ error: 'No stock data' })
  })

  app.get('/api/seismic/recent', async () => getRecentSeismic(20))

  /* ─── LAPOC latest ───────────────────────────────────────────────────── */
  app.get('/api/lapoc/latest', async (_req, reply) => {
    const data = getDomainState('lapoc_latest')
    return data ?? reply.code(503).send({ error: 'No LAPOC data ingested' })
  })

  /* ─── Alert actions ─────────────────────────────────────────────────── */
  app.post<{ Params: { id: string } }>('/api/alerts/dismiss/:id', async (req) => {
    dismissAlert(req.params.id)
    return { ok: true }
  })

  app.post('/api/alerts/dismiss-all', async () => {
    dismissAllAlerts()
    return { ok: true }
  })
}
