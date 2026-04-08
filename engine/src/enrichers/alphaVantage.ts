import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

export async function fetchAndIngestStock(): Promise<void> {
  const { apiKey, symbol } = ENGINE_CONFIG.alphaVantage
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`)

  const json = await res.json() as {
    'Global Quote'?: { '05. price'?: string; '07. latest trading day'?: string; '10. change percent'?: string }
  }

  const quote = json['Global Quote']
  if (!quote?.['05. price']) {
    console.log('[alpha-vantage] No quote data returned')
    return
  }

  const price = parseFloat(quote['05. price'])

  const payload = {
    source: 'alpha-vantage',
    provenance: 'verified_real',
    timestamp: new Date().toISOString(),
    kind: 'stock',
    symbol,
    value: price,
    currency: 'AUD',
    detail: {
      tradingDay: quote['07. latest trading day'],
      changePercent: quote['10. change percent'],
    },
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/market`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest stock failed: ${ingestRes.status}`)

  console.log(`[alpha-vantage] ${symbol} = A$${price.toFixed(3)}`)
}

export function startAlphaVantageEnricher() {
  if (!ENGINE_CONFIG.alphaVantage.enabled) {
    console.log('[alpha-vantage] Disabled (no ALPHA_VANTAGE_KEY)')
    return
  }

  console.log(`[alpha-vantage] Starting for ${ENGINE_CONFIG.alphaVantage.symbol}`)

  const run = () => fetchAndIngestStock().catch(err => console.warn('[alpha-vantage]', err.message))
  run()
  setInterval(run, ENGINE_CONFIG.alphaVantage.intervalMs)
}
