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
  getMarketData,
} from '../store/db.js'
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
7. For environmental data, note whether readings are live (from enrichers) or simulated.
8. Numbers should be formatted for readability (e.g., "$821M" not "821000000").
9. Keep responses concise but thorough. Use bullet points for multi-item answers.
10. This is a decision-support tool, not a system of record. Always include appropriate caveats.

CITATION FORMAT (two-tier):
- Vero data: "NPV is $821M (source: PFS Jul 2025, as_of: 2025-07-21)"
- External/web: "According to [Source Name, Date]: quote or fact" — always label as external context, not Vero-verified data.

When using the webSearch tool, clearly distinguish external results from Vero database queries. Prefix web findings with "External:" or "According to [source]:".`

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
      description: 'Get the immutable audit trail: timestamped events with actor and action',
      inputSchema: z.object({}),
      execute: async () => getDomainState('audit_trail') ?? [],
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

    const modelId = process.env.AI_MODEL ?? 'gemini-2.5-flash'
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
