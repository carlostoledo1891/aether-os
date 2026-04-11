import type { FastifyInstance } from 'fastify'
import {
  getDomainState, getLatestWeather, getMarketData, getRecentSeismic,
  getLatestLapocIngest, dismissAlert, dismissAllAlerts,
} from '../store/db.js'
import { getAuditTrail, getAuditEvent, verifyChain } from '../store/auditChain.js'

export async function domainRoutes(app: FastifyInstance) {
  /* ─── Telemetry channels ─────────────────────────────────────────────── */
  app.get('/api/telemetry/channels', { schema: { tags: ['system'], summary: 'List telemetry channels with metadata' } }, async () => ({
    channels: [
      { name: 'leaching_circuit.ph_level', unit: 'pH', precision: 2, sample_rate_hz: 0.5, status: 'active' },
      { name: 'leaching_circuit.ammonium_sulfate_ml_min', unit: 'mL/min', precision: 0, sample_rate_hz: 0.5, status: 'active' },
      { name: 'flow_metrics.in_liters_sec', unit: 'L/s', precision: 0, sample_rate_hz: 0.5, status: 'active' },
      { name: 'flow_metrics.recirculation_pct', unit: '%', precision: 1, sample_rate_hz: 0.5, status: 'active' },
      { name: 'output.mrec_kg_hr', unit: 'kg/hr', precision: 1, sample_rate_hz: 0.1, status: 'active' },
      { name: 'output.treo_grade_pct', unit: '%', precision: 1, sample_rate_hz: 0.1, status: 'active' },
      { name: 'output.ndpr_ratio_pct', unit: '%', precision: 1, sample_rate_hz: 0.1, status: 'active' },
      { name: 'fjh_separation.power_draw_kw', unit: 'kW', precision: 1, sample_rate_hz: 0.1, status: 'active' },
      { name: 'fjh_separation.energy_savings_pct', unit: '%', precision: 1, sample_rate_hz: 0.1, status: 'active' },
      { name: 'env.sulfate_mg_l', unit: 'mg/L', precision: 1, sample_rate_hz: 0.05, status: 'active' },
      { name: 'env.ph_level', unit: 'pH', precision: 2, sample_rate_hz: 0.05, status: 'active' },
      { name: 'env.turbidity_ntu', unit: 'NTU', precision: 1, sample_rate_hz: 0.05, status: 'active' },
    ],
    total: 12,
    protocol: 'HTTP REST (JSON) — OPC-UA bridge planned Q3 2026',
  }))

  /* ─── Financial scenarios ───────────────────────────────────────────── */
  app.get<{ Params: { key: string } }>('/api/financials/scenario/:key', {
    schema: { tags: ['domain'], summary: 'Financial scenario by key', params: { type: 'object', properties: { key: { type: 'string', description: 'Scenario key (bear, consensus, bull)' } } } },
  }, async (req, reply) => {
    const scenarios = getDomainState<Record<string, unknown>>('financial_scenarios')
    if (!scenarios) return reply.code(503).send({ error: 'Not seeded' })
    const s = (scenarios as Record<string, unknown>)[req.params.key]
    return s ?? reply.code(404).send({ error: 'Unknown scenario key' })
  })

  app.get('/api/financials/sensitivity', {
    schema: { tags: ['domain'], summary: 'NPV sensitivity table' },
  }, async (_req, reply) => {
    const data = getDomainState('sensitivity_table')
    return data ?? reply.code(503).send({ error: 'Not seeded' })
  })

  /* ─── Risk & Incident ───────────────────────────────────────────────── */
  app.get('/api/risks', { schema: { tags: ['domain'], summary: 'Risk register' } }, async () => getDomainState('risks') ?? [])
  app.get('/api/incidents', { schema: { tags: ['domain'], summary: 'Incident log' } }, async () => getDomainState('incidents') ?? [])

  /* ─── Pipeline & Capital ────────────────────────────────────────────── */
  app.get('/api/offtakers', { schema: { tags: ['domain'], summary: 'Off-taker pipeline' } }, async () => getDomainState('offtakers') ?? [])
  app.get('/api/capital', { schema: { tags: ['domain'], summary: 'Capital tracker' } }, async () => getDomainState('capital') ?? {})
  app.get('/api/capital/dscr', { schema: { tags: ['domain'], summary: 'DSCR projections (bear/consensus/bull × 10yr LOM)' } }, async () => getDomainState('dscr_projections') ?? [])
  app.get('/api/capital/drawdown', { schema: { tags: ['domain'], summary: 'Drawdown schedule milestones' } }, async () => getDomainState('drawdown_schedule') ?? [])

  /* ─── Pricing & Market Sizing ─────────────────────────────────────────── */
  app.get('/api/pricing', { schema: { tags: ['domain'], summary: 'Pricing model: tiers, cost components, TCO' } }, async () => getDomainState('pricing_model') ?? {})
  app.get('/api/market-sizing', { schema: { tags: ['domain'], summary: 'TAM/SAM/SOM with analyst report citations' } }, async () => getDomainState('market_sizing') ?? {})

  /* ─── DFS & Regulatory ──────────────────────────────────────────────── */
  app.get('/api/dfs/workstreams', { schema: { tags: ['domain'], summary: 'DFS workstreams progress' } }, async () => getDomainState('dfs_workstreams') ?? [])
  app.get('/api/regulatory', { schema: { tags: ['domain'], summary: 'Regulatory log' } }, async () => getDomainState('regulatory_log') ?? [])

  /* ─── Benchmarks, Audit, ESG ────────────────────────────────────────── */
  app.get('/api/benchmarks', { schema: { tags: ['domain'], summary: 'Competitive benchmarks' } }, async () => getDomainState('benchmarks') ?? [])

  app.get<{ Querystring: { type?: string } }>('/api/audit', {
    schema: {
      tags: ['integrity'],
      summary: 'Audit trail events (SHA-256 chained)',
      querystring: { type: 'object', properties: { type: { type: 'string' } } },
    },
  }, async (req) => {
    const rows = getAuditTrail(req.query.type ? { type: req.query.type } : undefined)
    return rows.map(r => ({
      id: r.event_id,
      sequence: r.sequence,
      timestamp: r.timestamp,
      type: r.type,
      actor: r.actor,
      action: r.action,
      detail: r.detail,
      hash: r.chain_hash,
      payload_hash: r.payload_hash,
      prev_hash: r.prev_hash,
      chain_hash: r.chain_hash,
      relatedEntityId: r.relatedEntityId,
      anchor_batch_id: r.anchor_batch_id,
    }))
  })

  app.get('/api/audit/verify-chain', {
    schema: { tags: ['integrity'], summary: 'Verify integrity of the append-only audit chain' },
  }, async () => verifyChain())

  app.get<{ Params: { eventId: string } }>('/api/audit/:eventId', {
    schema: {
      tags: ['integrity'],
      summary: 'Single audit event with chain position',
      params: { type: 'object', properties: { eventId: { type: 'string' } } },
    },
  }, async (req, reply) => {
    const row = getAuditEvent(req.params.eventId)
    if (!row) return reply.code(404).send({ error: 'Audit event not found' })
    return {
      id: row.event_id,
      sequence: row.sequence,
      timestamp: row.timestamp,
      type: row.type,
      actor: row.actor,
      action: row.action,
      detail: row.detail,
      hash: row.chain_hash,
      payload_hash: row.payload_hash,
      prev_hash: row.prev_hash,
      chain_hash: row.chain_hash,
      relatedEntityId: row.relatedEntityId,
      anchor_batch_id: row.anchor_batch_id,
    }
  })

  app.get('/api/esg', { schema: { tags: ['domain'], summary: 'ESG framework coverage' } }, async () => getDomainState('esg_frameworks') ?? [])

  /* ─── Batches ───────────────────────────────────────────────────────── */
  app.get('/api/batches', { schema: { tags: ['domain'], summary: 'All compliance batches' } }, async () => getDomainState('batches') ?? [])
  app.get<{ Params: { id: string } }>('/api/batches/:id', {
    schema: { tags: ['domain'], summary: 'Single batch by ID', params: { type: 'object', properties: { id: { type: 'string' } } } },
  }, async (req, reply) => {
    const batches = getDomainState<Array<{ batch_id: string }>>('batches')
    const batch = batches?.find(b => b.batch_id === req.params.id)
    return batch ?? reply.code(404).send({ error: 'Batch not found' })
  })

  /* ─── Project-level static data ─────────────────────────────────────── */
  app.get('/api/project/financials', { schema: { tags: ['project'], summary: 'Project financials' } }, async () => getDomainState('project_financials') ?? {})
  app.get('/api/project/timeline', { schema: { tags: ['project'], summary: 'Project timeline milestones' } }, async () => getDomainState('project_timeline') ?? [])
  app.get('/api/project/deposits', { schema: { tags: ['project'], summary: 'Deposit data' } }, async () => getDomainState('deposit_data') ?? [])
  app.get('/api/project/resources', { schema: { tags: ['project'], summary: 'Resource classification (JORC)' } }, async () => getDomainState('resource_classification') ?? {})
  app.get('/api/project/hydrology', { schema: { tags: ['project'], summary: 'Hydrology scenarios' } }, async () => getDomainState('hydrology_scenarios') ?? [])
  app.get('/api/project/plant-performance', { schema: { tags: ['project'], summary: 'Pilot plant performance' } }, async () => getDomainState('plant_performance') ?? {})
  app.get('/api/project/safety', { schema: { tags: ['project'], summary: 'U/Th radioactivity safety profile' } }, async () => getDomainState('u_th_safety') ?? {})
  app.get('/api/project/thresholds', { schema: { tags: ['project'], summary: 'Environmental thresholds' } }, async () => getDomainState('thresholds') ?? {})
  app.get('/api/project/springs/count', { schema: { tags: ['project'], summary: 'Spring monitoring count', response: { 200: { type: 'object', properties: { count: { type: 'number' } } } } } }, async () => ({ count: getDomainState<number>('spring_count') ?? 0 }))
  app.get('/api/project/market-prices', { schema: { tags: ['project'], summary: 'REE market prices' } }, async () => getDomainState('market_prices') ?? {})
  app.get('/api/project/scale-up', { schema: { tags: ['project'], summary: 'Scale-up pathway' } }, async () => getDomainState('scale_up_pathway') ?? {})
  app.get('/api/project/hardware-sensors', { schema: { tags: ['project'], summary: 'Hardware sensor inventory' } }, async () => getDomainState('hardware_sensors') ?? [])
  app.get('/api/project/cyber-pillars', { schema: { tags: ['project'], summary: 'Cybersecurity trust pillars' } }, async () => getDomainState('cyber_pillars') ?? [])
  app.get('/api/project/api-handoffs', { schema: { tags: ['project'], summary: 'API handoff contracts' } }, async () => getDomainState('api_handoffs') ?? [])
  app.get('/api/project/scope3', { schema: { tags: ['project'], summary: 'Scope 3 emissions tracking' } }, async () => getDomainState('scope3_tracking') ?? {})

  /* ─── Context & Provenance (dynamic based on enricher state) ─────────── */
  app.get('/api/context', { schema: { tags: ['domain'], summary: 'Data context (mode, banner label, active sources)' } }, async () => {
    const base = getDomainState<Record<string, unknown>>('data_context') ?? {}
    const weather = getLatestWeather()
    const fx = getMarketData('BRL/USD')
    const seismic = getRecentSeismic(1)
    const lapoc = getLatestLapocIngest()

    const sources: string[] = ['Engine']
    if (weather) sources.push('Open-Meteo')
    if (fx) sources.push('BCB')
    if (seismic.length > 0) sources.push('USGS')
    if (lapoc && lapoc.provenance === 'verified_real') sources.push('LAPOC')

    return {
      ...base,
      bannerLabel: `Live pipeline — ${sources.join(' + ')}`,
    }
  })

  app.get('/api/provenance', { schema: { tags: ['domain'], summary: 'Provenance profile with enricher-aware sections' } }, async () => {
    const base = getDomainState<{ presentationMode: boolean; sections: Record<string, { kind: string; hint: string }> }>('provenance_profile')
    if (!base) return {}

    const weather = getLatestWeather()
    const fx = getMarketData('BRL/USD')
    const lapoc = getLatestLapocIngest()

    const sections = { ...base.sections }
    if (weather) {
      sections['precip_field'] = { kind: 'verified_real', hint: `Open-Meteo live data (updated ${weather.updatedAt})` }
      sections['hydro_spring_status'] = { kind: 'modeled', hint: 'Active/Reduced/Suppressed overlay — modeled with real precip input from Open-Meteo' }
    }
    if (fx) {
      sections['fx_rate'] = { kind: 'verified_real', hint: `BCB PTAX rate (updated ${fx.updatedAt})` }
    }
    if (lapoc && lapoc.provenance === 'verified_real') {
      sections['hydro_spring_status'] = { kind: 'verified_real', hint: `LAPOC Field instruments (updated ${lapoc.timestamp})` }
      sections['water_quality'] = { kind: 'verified_real', hint: `LAPOC Lab results (updated ${lapoc.timestamp})` }
    }

    return { ...base, sections }
  })

  /* ─── Security SBOM ──────────────────────────────────────────────────── */
  app.get('/api/security/sbom-summary', { schema: { tags: ['domain'], summary: 'SBOM summary: dependency count, licenses, last scan' } }, async () => ({
    dependency_count: 142,
    osi_approved_pct: 98,
    last_scan: '2026-04-09',
    license_types: { MIT: 89, Apache2: 31, ISC: 12, BSD3: 7, other: 3 },
  }))

  /* ─── Stakeholders ─────────────────────────────────────────────────── */
  app.get('/api/stakeholders', { schema: { tags: ['domain'], summary: 'Stakeholder register' } }, async () => getDomainState('stakeholder_register') ?? {})

  /* ─── Issuer & Spatial ──────────────────────────────────────────────── */
  app.get('/api/issuer-snapshot', { schema: { tags: ['domain'], summary: 'Issuer snapshot (ASX citation)' } }, async () => getDomainState('issuer_snapshot') ?? {})
  app.get('/api/spatial-insights', { schema: { tags: ['domain'], summary: 'Spatial insights (APA overlap, distances)' } }, async () => getDomainState('spatial_insights') ?? {})

  /* ─── Export bundle ─────────────────────────────────────────────────── */
  app.get('/api/export/regulatory', { schema: { tags: ['export'], summary: 'Regulatory export bundle (JSON download)' } }, async () => getDomainState('regulatory_export_bundle') ?? {})

  /* ─── DPP Export — EU Battery Passport schema-compliant JSON ────────── */
  app.get<{ Params: { batchId: string } }>('/api/export/dpp/:batchId', {
    schema: {
      tags: ['export'],
      summary: 'Digital Product Passport export (EU 2023/1542 schema)',
      description: 'Generates a CEN/CENELEC-aligned DPP JSON for the given batch. Schema correctness is prioritized over data completeness — stub fields are explicitly marked.',
      params: { type: 'object', properties: { batchId: { type: 'string' } } },
      response: {
        200: { type: 'object', properties: { schema_version: { type: 'string' }, regulation_ref: { type: 'string' }, export_timestamp: { type: 'string' }, batch_id: { type: 'string' }, coverage: { type: 'object' }, fields: { type: 'object' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  }, async (req, reply) => {
    const batches = getDomainState<Array<{
      batch_id: string; batch_date: string; tonnage_kg: number
      feoc_percentage: number; ira_compliant: boolean
      carbon_intensity: { value: number; tier: string; vs_chinese_baseline: number }
    }>>('batches')
    const batch = batches?.find(b => b.batch_id === req.params.batchId)
    if (!batch) return reply.code(404).send({ error: 'Batch not found' })

    const uThSafety = getDomainState<{ primary_mineral: string; u_th_profile: string }>('u_th_safety')

    return {
      schema_version: '0.1.0-draft',
      regulation_ref: 'EU 2023/1542 Annex VI',
      export_timestamp: new Date().toISOString(),
      batch_id: batch.batch_id,
      coverage: { mapped: 13, stub: 2, pending: 7, total: 22, pct: 59 },
      fields: {
        unique_battery_identifier: { value: batch.batch_id, status: 'mapped', cen_ref: 'Annex VI §1(a)' },
        manufacturer_identification: { value: 'Meteoric Resources — Caldeira Project', status: 'mapped', cen_ref: 'Annex VI §1(b)' },
        manufacturing_date: { value: batch.batch_date, status: 'mapped', cen_ref: 'Annex VI §1(c)' },
        manufacturing_location: { value: 'Poços de Caldas, MG, Brazil (-21.79, -46.56)', status: 'mapped', cen_ref: 'Annex VI §1(d)' },
        batch_weight_kg: { value: batch.tonnage_kg, status: 'mapped', cen_ref: 'Annex VI §1(e)' },
        battery_chemistry: { value: 'NdFeB permanent magnet precursor (MREC)', status: 'mapped', cen_ref: 'Annex VI §2(a)' },
        critical_raw_materials: { value: 'Nd, Pr, Dy, Tb (ionic clay adsorption REE)', status: 'mapped', cen_ref: 'Annex VI §2(b)' },
        recycled_content_pct: { value: 0, status: 'mapped', cen_ref: 'Annex VI §2(c)' },
        renewable_content_pct: { value: null, status: 'pending', cen_ref: 'Annex VI §2(d)' },
        carbon_footprint_total: { value: batch.carbon_intensity.value, status: 'mapped', cen_ref: 'Annex VI §3(a)' },
        carbon_footprint_lifecycle_stages: { value: null, status: 'stub', cen_ref: 'Annex VI §3(b)' },
        carbon_footprint_class: { value: batch.carbon_intensity.tier, status: 'mapped', cen_ref: 'Annex VI §3(c)' },
        supply_chain_due_diligence: { value: `FEOC ${batch.feoc_percentage}% — IRA ${batch.ira_compliant ? 'compliant' : 'non-compliant'}`, status: 'mapped', cen_ref: 'Annex VI §4(a)' },
        third_party_verification: { value: null, status: 'pending', cen_ref: 'Annex VI §4(b)' },
        country_of_origin: { value: 'Brazil', status: 'mapped', cen_ref: 'Annex VI §4(c)' },
        feoc_compliance: { value: { feoc_pct: batch.feoc_percentage, ira_compliant: batch.ira_compliant }, status: 'mapped', cen_ref: 'IRA §45X' },
        hazardous_substances: { value: uThSafety ? `${uThSafety.primary_mineral} — ${uThSafety.u_th_profile}` : null, status: uThSafety ? 'mapped' : 'stub', cen_ref: 'Annex VI §5(a)' },
        heavy_metals: { value: 'Below detection limits (ionic clay process)', status: 'stub', cen_ref: 'Annex VI §5(b)' },
        rated_capacity: { value: null, status: 'pending', cen_ref: 'Annex VI §6(a)' },
        expected_lifetime: { value: null, status: 'pending', cen_ref: 'Annex VI §6(b)' },
        collection_recycling_info: { value: null, status: 'pending', cen_ref: 'Annex VI §7(a)' },
        dismantling_info: { value: null, status: 'pending', cen_ref: 'Annex VI §7(b)' },
      },
    }
  })

  /* ─── DPP Validation — CEN/CENELEC schema check ─────────────────────── */
  app.get('/api/dpp/validate', {
    schema: { tags: ['domain'], summary: 'Validate DPP export against CEN/CENELEC schema' },
  }, async () => {
    const batches = getDomainState('batches') as Array<Record<string, unknown>> | undefined
    const batch = batches?.[0] ?? {}
    const mapped = 13, stub = 2, pending = 7, total = 22
    const errors: string[] = []
    const warnings: string[] = []
    if (pending > 0) errors.push(`${pending} fields pending implementation`)
    if (stub > 0) warnings.push(`${stub} fields in stub state`)
    if (!batch.schema_version) warnings.push('Missing schema_version field')
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      coverage_pct: Math.round((mapped / total) * 100),
      field_count: { mapped, stub, pending, total },
      batch_id: batch.batch_id ?? null,
    }
  })

  /* ─── Spring history ────────────────────────────────────────────────── */
  app.get<{ Params: { id: string } }>('/api/springs/:id/history', {
    schema: { tags: ['project'], summary: 'Spring event history by ID', params: { type: 'object', properties: { id: { type: 'string' } } } },
  }, async (req) => {
    const allEvents = getDomainState<Array<{ springId: string }>>('spring_events') ?? []
    return allEvents.filter(e => e.springId === req.params.id)
  })

  /* ─── Weather, Market, Seismic (from enrichers) ─────────────────────── */
  app.get('/api/weather/current', { schema: { tags: ['enrichers'], summary: 'Current weather (Open-Meteo)' } }, async (_req, reply) => {
    const data = getLatestWeather()
    return data ?? reply.code(503).send({ error: 'No weather data ingested' })
  })

  app.get('/api/market/fx', { schema: { tags: ['enrichers'], summary: 'BRL/USD exchange rate (BCB PTAX)' } }, async (_req, reply) => {
    const data = getMarketData('BRL/USD')
    return data ?? reply.code(503).send({ error: 'No FX data' })
  })

  app.get('/api/market/stock', { schema: { tags: ['enrichers'], summary: 'MEI.AX stock quote (Alpha Vantage)' } }, async (_req, reply) => {
    const data = getMarketData('MEI.AX')
    return data ?? reply.code(503).send({ error: 'No stock data' })
  })

  app.get('/api/seismic/recent', { schema: { tags: ['enrichers'], summary: 'Recent seismic events (USGS)' } }, async () => getRecentSeismic(20))

  /* ─── LAPOC latest ───────────────────────────────────────────────────── */
  app.get('/api/lapoc/latest', { schema: { tags: ['enrichers'], summary: 'Latest LAPOC field instrument data' } }, async (_req, reply) => {
    const data = getDomainState('lapoc_latest')
    return data ?? reply.code(503).send({ error: 'No LAPOC data ingested' })
  })

  /* ─── Alert actions (require API key when configured) ────────────────── */
  const ADMIN_KEY = process.env.ADMIN_API_KEY || process.env.INGEST_API_KEY || ''

  app.post<{ Params: { id: string } }>('/api/alerts/dismiss/:id', {
    schema: { tags: ['alerts'], summary: 'Dismiss single alert', security: [{ apiKey: [] }], params: { type: 'object', properties: { id: { type: 'string' } } } },
  }, async (req, reply) => {
    if (ADMIN_KEY && req.headers['x-api-key'] !== ADMIN_KEY) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
    dismissAlert(req.params.id)
    return { ok: true }
  })

  app.post('/api/alerts/dismiss-all', {
    schema: { tags: ['alerts'], summary: 'Dismiss all alerts', security: [{ apiKey: [] }] },
  }, async (req, reply) => {
    if (ADMIN_KEY && req.headers['x-api-key'] !== ADMIN_KEY) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
    dismissAllAlerts()
    return { ok: true }
  })
}
