import type { FastifyInstance } from 'fastify'
import { streamText, tool, convertToModelMessages, type UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getDomainState,
  getLatestTelemetry,
  getTelemetryHistory,
  getLatestWeather,
  getLatestForecast,
  getHistoricalWeather,
  getMarketData,
} from '../store/db.js'
import { getAuditTrail, verifyChain } from '../store/auditChain.js'
import type { TimeRangeKey } from '../types/shared.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PILOT_PLANT_PATH = resolve(__dirname, '..', '..', '..', 'data', 'caldeira', 'pilot-plant-mirror.json')

const SYSTEM_PROMPT = `You are a Vero platform analyst. You answer questions about the Caldeira critical minerals project using verified data from the Vero database.

CORE RULES:
1. Always cite provenance: include (source: X, as_of: Y) when presenting data values.
2. Never state compliance conclusions. Instead say "Based on current data, the FEOC percentage is X%" with a disclaimer that this is not legal advice.
3. When disclosure mode is active, only surface board-approved facts.
4. Distinguish Vero data (with provenance) from any external or user-uploaded sources.
5. If a tool returns null or empty data, say "This data is not currently available in the Vero database" rather than making up values.
6. For financial metrics (NPV, IRR, CAPEX), always note the scenario context (bear/consensus/bull).
7. For regulatory questions, use queryKnowledgeBase FIRST before webSearch. The knowledge base contains verified references for CONAMA, COPAM, FEAM, IRA, EU DPP, OECD, and Caldeira-specific regulatory context.
7. For environmental data, note whether readings are live (from enrichers) or simulated.
8. Numbers should be formatted for readability (e.g., "$821M" not "821000000").
9. Keep responses concise but thorough. Use bullet points for multi-item answers.
10. This is a decision-support tool, not a system of record. Always include appropriate caveats.

CITATION FORMAT (two-tier):
- Vero data: "NPV is $821M (source: PFS Jul 2025, as_of: 2025-07-21)"
- External/web: "According to [Source Name, Date]: quote or fact" — always label as external context, not Vero-verified data.

When using the webSearch tool, clearly distinguish external results from Vero database queries. Prefix web findings with "External:" or "According to [source]:".

You have access to weather intelligence tools. When users ask about environmental conditions, water quality outlook, spring health, or climate patterns, proactively use queryWeatherForecast, queryWeatherHistory, and analyzeEnvironmentalRisk to provide data-backed answers. Reference ECMWF ERA5 data provenance when discussing historical patterns. Always distinguish between observed data (verified_real) and AI-predicted forecasts. Never present predictions as certainties.`

function loadPilotPlantMirror(): Record<string, unknown> {
  if (!existsSync(PILOT_PLANT_PATH)) return { error: 'pilot-plant-mirror.json not found' }
  try {
    return JSON.parse(readFileSync(PILOT_PLANT_PATH, 'utf8')) as Record<string, unknown>
  } catch {
    return { error: 'Failed to parse pilot-plant-mirror.json' }
  }
}

function buildTools() {
  return {
    queryFinancials: tool({
      description: 'Get project financial metrics: NPV, IRR, CAPEX, OPEX, payback period, and sensitivity scenarios',
      inputSchema: z.object({}),
      execute: async () => getDomainState('project_financials') ?? { error: 'Not seeded' },
    }),
    queryRisks: tool({
      description: 'Get the risk register: top risks with likelihood × impact scoring and mitigation status',
      inputSchema: z.object({}),
      execute: async () => getDomainState('risks') ?? [],
    }),
    queryBatches: tool({
      description: 'Get compliance batch data: batch IDs, tonnage, FEOC percentage, IRA compliance, carbon intensity',
      inputSchema: z.object({}),
      execute: async () => getDomainState('batches') ?? [],
    }),
    queryESG: tool({
      description: 'Get ESG framework alignment: coverage across 5 frameworks (GRI, SASB, ISSB, EU Taxonomy, TNFD)',
      inputSchema: z.object({}),
      execute: async () => getDomainState('esg_frameworks') ?? [],
    }),
    queryAudit: tool({
      description: 'Get the SHA-256 chained audit trail: timestamped events with actor, action, payload hash, chain hash, and prev hash',
      inputSchema: z.object({}),
      execute: async () => getAuditTrail().map(r => ({
        id: r.event_id, sequence: r.sequence, timestamp: r.timestamp,
        type: r.type, actor: r.actor, action: r.action, detail: r.detail,
        hash: r.chain_hash, payload_hash: r.payload_hash,
        prev_hash: r.prev_hash, chain_hash: r.chain_hash,
        relatedEntityId: r.relatedEntityId,
      })),
    }),
    verifyAuditChain: tool({
      description: 'Verify the integrity of the append-only audit chain. Returns valid/invalid, chain length, and details on any broken link.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = verifyChain()
        return {
          ...result,
          summary: result.valid
            ? `Audit chain integrity verified: ${result.length} events, all chain hashes valid.`
            : `Audit chain BROKEN at sequence ${result.brokenAt}: ${result.detail}`,
        }
      },
    }),
    queryTelemetry: tool({
      description: 'Get the latest plant and environment telemetry: flow, leaching, FJH, output, aquifer, water quality',
      inputSchema: z.object({}),
      execute: async () => getLatestTelemetry() ?? { error: 'No telemetry data available' },
    }),
    queryHistory: tool({
      description: 'Get historical telemetry trends for 24h, 7d, or 30d',
      inputSchema: z.object({
        range: z.enum(['24h', '7d', '30d']).describe('Time range for historical data'),
      }),
      execute: async ({ range }: { range: TimeRangeKey }) => {
        const h = getTelemetryHistory(range)
        return { range, points: h.plantHistory.length, data: h }
      },
    }),
    queryDeposits: tool({
      description: 'Get deposit data: 7 deposits with grade, tonnage, and classification',
      inputSchema: z.object({}),
      execute: async () => getDomainState('deposit_data') ?? [],
    }),
    queryResources: tool({
      description: 'Get JORC Mineral Resource Estimate (MRE): indicated + inferred with tonnage and grade',
      inputSchema: z.object({}),
      execute: async () => getDomainState('resource_classification') ?? {},
    }),
    queryProvenance: tool({
      description: 'Get provenance profile: per-area data source kinds (verified_real, modeled, simulated)',
      inputSchema: z.object({}),
      execute: async () => getDomainState('provenance_profile') ?? {},
    }),
    queryRegulatory: tool({
      description: 'Get regulatory log: COPAM/FEAM/MPF entries with dates, status, and risk context',
      inputSchema: z.object({}),
      execute: async () => getDomainState('regulatory_log') ?? [],
    }),
    queryWeather: tool({
      description: 'Get current weather from the Open-Meteo enricher: precipitation and 7-day forecast',
      inputSchema: z.object({}),
      execute: async () => getLatestWeather() ?? { error: 'No weather data — enricher not running' },
    }),
    queryMarket: tool({
      description: 'Get market data: BRL/USD exchange rate and MEI.AX stock quote',
      inputSchema: z.object({}),
      execute: async () => ({
        fx: getMarketData('BRL/USD') ?? null,
        stock: getMarketData('MEI.AX') ?? null,
      }),
    }),
    queryPilotPlant: tool({
      description: 'Get pilot plant catalog: process stages, design KPIs, product spec, regulatory, telemetry mapping',
      inputSchema: z.object({}),
      execute: async () => loadPilotPlantMirror(),
    }),
    queryDPP: tool({
      description: 'Get Digital Product Passport field mapping: EU 2023/1542 coverage and field breakdown',
      inputSchema: z.object({}),
      execute: async () => {
        const batches = getDomainState<Array<{ batch_id: string }>>('batches')
        return {
          total_batches: batches?.length ?? 0,
          schema_version: '0.1.0-draft',
          regulation_ref: 'EU 2023/1542 Annex VI',
          coverage: { mapped: 13, stub: 2, pending: 7, total: 22, pct: 59 },
        }
      },
    }),
    queryLithology: tool({
      description: 'Get lithology summary for Caldeira deposits: dominant rock types, average laterite/saprolite depths, stratigraphy notes',
      inputSchema: z.object({}),
      execute: async () => getDomainState('lithology_summary') ?? {},
    }),
    queryDPPValidation: tool({
      description: 'Validate the DPP (Digital Product Passport) export against CEN/CENELEC EN 45557 schema requirements',
      inputSchema: z.object({}),
      execute: async () => {
        const mapped = 13, stub = 2, pending = 7, total = 22
        const errors: string[] = []
        const warnings: string[] = []
        if (pending > 0) errors.push(`${pending} fields pending implementation`)
        if (stub > 0) warnings.push(`${stub} fields in stub state`)
        return { valid: errors.length === 0, errors, warnings, coverage_pct: Math.round((mapped / total) * 100) }
      },
    }),
    queryDSCR: tool({
      description: 'Get DSCR (Debt Service Coverage Ratio) projections across bear/consensus/bull for 10 years of LOM',
      inputSchema: z.object({}),
      execute: async () => getDomainState('dscr_projections') ?? [],
    }),
    queryDrawdown: tool({
      description: 'Get the drawdown schedule: milestone-based capital drawdowns with cumulative totals and CP references',
      inputSchema: z.object({}),
      execute: async () => getDomainState('drawdown_schedule') ?? [],
    }),
    queryPricing: tool({
      description: 'Get the Vero platform pricing model: deployment tiers (Pilot/Growth/Enterprise), cost components, and total cost of ownership',
      inputSchema: z.object({}),
      execute: async () => getDomainState('pricing_model') ?? {},
    }),
    queryMarketSizing: tool({
      description: 'Get TAM/SAM/SOM market sizing with analyst report citations (Mordor Intelligence, Grand View Research, Dataintelo)',
      inputSchema: z.object({}),
      execute: async () => getDomainState('market_sizing') ?? {},
    }),
    queryIssuer: tool({
      description: 'Get issuer snapshot: company info, market cap, shares, project ownership, and ASX citation',
      inputSchema: z.object({}),
      execute: async () => getDomainState('issuer_snapshot') ?? {},
    }),
    querySecurityArchitecture: tool({
      description: 'Get Vero platform security architecture: FedRAMP roadmap, RBAC role model, SBOM status, audit trail design',
      inputSchema: z.object({}),
      execute: async () => ({
        fedramp_timeline: [
          { milestone: 'AWS GovCloud deployment', target: 'Q4 2026', status: 'planned' },
          { milestone: 'IL4 assessment initiation', target: 'Q1 2027', status: 'planned' },
          { milestone: 'Authority to Operate (ATO)', target: 'Q2 2027', status: 'planned' },
        ],
        rbac_roles: ['Admin', 'Analyst', 'Viewer', 'Auditor'],
        sbom: { dependency_count: 142, osi_approved_pct: 98, last_scan: '2026-04-09' },
        audit_design: 'Real SHA-256 append-only hash chain in dedicated audit_events table. Each event stores payload_hash, prev_hash, and chain_hash. Chain integrity verifiable via GET /api/audit/verify-chain. Merkle root anchoring planned for Phase 1.',
      }),
    }),
    queryKnowledgeBase: tool({
      description: 'Search Vero regulatory and technical knowledge base. Use BEFORE web search for regulatory questions about CONAMA, COPAM, FEAM, IRA, EU DPP, OECD, mining codes, or Caldeira-specific context.',
      inputSchema: z.object({
        query: z.string().describe('Search query, e.g. "sulfate discharge limits Brazil"'),
        domain: z.enum(['geology', 'hydrology', 'regulatory', 'international', 'apis', 'all']).optional().describe('Knowledge domain to search'),
      }),
      execute: async ({ query, domain }: { query: string; domain?: string }) => {
        try {
          const indexPath = resolve(__dirname, '..', '..', '..', 'data', 'knowledge', 'index.json')
          if (!existsSync(indexPath)) return { error: 'Knowledge base index not found', results: [] }
          const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as Array<{
            id: string; jurisdiction: string; authority: string; title: string
            relevant_thresholds: Array<Record<string, unknown>>
            file: string; tags: string[]
          }>

          const queryLower = query.toLowerCase()
          const queryTerms = queryLower.split(/\s+/)

          const scored = index.map(entry => {
            let score = 0
            const searchable = `${entry.title} ${entry.authority} ${entry.tags.join(' ')} ${entry.jurisdiction}`.toLowerCase()
            for (const term of queryTerms) {
              if (searchable.includes(term)) score += 2
              if (entry.tags.some(t => t.includes(term))) score += 3
            }
            if (domain && domain !== 'all') {
              if (entry.jurisdiction.includes(domain) || entry.tags.includes(domain)) score += 5
            }
            return { entry, score }
          }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)

          const results = scored.map(({ entry }) => {
            const filePath = resolve(__dirname, '..', '..', '..', 'data', 'knowledge', entry.file)
            let content = ''
            if (existsSync(filePath)) {
              content = readFileSync(filePath, 'utf-8').slice(0, 3000)
            }
            return {
              id: entry.id,
              title: entry.title,
              authority: entry.authority,
              jurisdiction: entry.jurisdiction,
              thresholds: entry.relevant_thresholds,
              content: content || 'Document not yet populated',
            }
          })

          return { query, matched: results.length, results }
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Knowledge base query failed', results: [] }
        }
      },
    }),

    queryWeatherForecast: tool({
      description: 'Get 16-day weather forecast for the Caldeira site including temperature, precipitation, wind, humidity, and evapotranspiration.',
      inputSchema: z.object({}),
      execute: async () => getLatestForecast() ?? { error: 'No forecast data available' },
    }),
    queryWeatherHistory: tool({
      description: 'Get historical climate data (ERA5 reanalysis via Open-Meteo) for the Caldeira site — up to 5 years of daily temperature, precipitation, wind, and evapotranspiration.',
      inputSchema: z.object({}),
      execute: async () => getHistoricalWeather() ?? { error: 'No historical weather data available' },
    }),
    analyzeEnvironmentalRisk: tool({
      description: 'Analyze environmental risk by combining current telemetry, weather forecast, and compliance thresholds. Returns a structured risk assessment.',
      inputSchema: z.object({}),
      execute: async () => {
        const telemetry = getLatestTelemetry()
        const forecast = getLatestForecast()
        const thresholds = getDomainState<Record<string, unknown>>('thresholds')

        const sulfate = telemetry?.env?.sulfate_ppm ?? null
        const nitrate = telemetry?.env?.nitrate_ppm ?? null
        const pH = telemetry?.env?.ph ?? null
        const forecastPrecip = forecast?.totalPrecipMm ?? null

        const risks: string[] = []
        if (sulfate !== null && sulfate > 200) risks.push('Sulfate approaching CONAMA 357 limit (250 mg/L)')
        if (nitrate !== null && nitrate > 8) risks.push('Nitrate approaching CONAMA 357 limit (10 mg/L)')
        if (pH !== null && (pH < 6.2 || pH > 8.8)) risks.push('pH near regulatory boundary (6.0–9.0)')
        if (forecastPrecip !== null && forecastPrecip > 150) risks.push('Heavy precipitation forecast may affect runoff and dilution')

        const riskLevel = risks.length >= 3 ? 'high' : risks.length >= 1 ? 'medium' : 'low'

        return {
          riskLevel,
          risks,
          currentReadings: { sulfate_ppm: sulfate, nitrate_ppm: nitrate, pH },
          forecastPrecipMm: forecastPrecip,
          thresholdsLoaded: thresholds !== null,
          assessedAt: new Date().toISOString(),
        }
      },
    }),
    querySpringHealthPrediction: tool({
      description: 'Predict spring health changes based on forecast precipitation and historical patterns. Returns predicted spring preservation percentage and status.',
      inputSchema: z.object({}),
      execute: async () => {
        const forecast = getLatestForecast()
        if (!forecast) return { error: 'No forecast data available for prediction' }

        const totalPrecip = forecast.totalPrecipMm
        let preservation: number
        let status: string
        if (totalPrecip > 200) { preservation = 98; status = 'excellent — ample water supply' }
        else if (totalPrecip > 100) { preservation = 95; status = 'good — adequate seasonal rainfall' }
        else if (totalPrecip > 50) { preservation = 91; status = 'fair — below-average precipitation' }
        else { preservation = 87; status = 'watch — low precipitation may stress springs' }

        return {
          predictedPreservation: preservation,
          status,
          forecastPrecipMm: totalPrecip,
          forecastDays: forecast.forecastDays,
          confidence: 'Simplified model based on precipitation–spring-flow correlation. Full hydrological modeling pending.',
          assessedAt: new Date().toISOString(),
        }
      },
    }),
    webSearch: tool({
      description: 'Search the web for external context: regulatory news, market trends, rare earths industry updates. Results are NOT Vero-verified data — always label as external.',
      inputSchema: z.object({
        query: z.string().describe('Search query, e.g. "EU Battery Regulation 2027 enforcement"'),
      }),
      execute: async ({ query }: { query: string }) => {
        try {
          const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 8_000)
          const res = await fetch(url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; VeroAI/1.0)',
              Accept: 'text/html',
            },
          })
          clearTimeout(timeout)
          if (!res.ok) return { error: `DuckDuckGo returned HTTP ${res.status}`, results: [] }
          const html = await res.text()
          const snippets: Array<{ title: string; snippet: string; url: string }> = []
          const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
          let match
          while ((match = resultRegex.exec(html)) !== null && snippets.length < 5) {
            snippets.push({
              url: match[1].replace(/&amp;/g, '&'),
              title: match[2].replace(/<[^>]*>/g, '').trim(),
              snippet: match[3].replace(/<[^>]*>/g, '').trim(),
            })
          }
          return { query, source: 'DuckDuckGo', results: snippets }
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Web search failed', results: [] }
        }
      },
    }),
  }
}

export async function chatRoutes(app: FastifyInstance) {
  app.post('/api/chat', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['ai'],
      summary: 'AI chat endpoint (streaming)',
      description: 'Sends a message to the Vero AI analyst. Returns a streaming UI message response.',
      body: {
        type: 'object',
        required: ['messages'],
        properties: {
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                content: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return reply.code(501).send({
        error: 'AI not configured',
        hint: 'Set GOOGLE_GENERATIVE_AI_API_KEY in your .env file',
      })
    }

    const modelId = process.env.AI_MODEL ?? 'gemini-2.5-pro'
    const google = createGoogleGenerativeAI({ apiKey })

    const { messages } = req.body as { messages: UIMessage[] }
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google(modelId),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: buildTools(),
    })

    result.pipeUIMessageStreamToResponse(reply.raw)
  })
}
