import { ENGINE_CONFIG, ingestHeaders } from '../config.js'

function formatDateForBcb(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${mm}-${dd}-${yyyy}`
}

export async function fetchAndIngestFx(): Promise<void> {
  const dateStr = formatDateForBcb(new Date())
  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dateStr}'&$format=json`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`BCB HTTP ${res.status}`)

  const json = await res.json() as {
    value?: Array<{ cotacaoCompra: number; cotacaoVenda: number; dataHoraCotacao: string }>
  }

  const latest = json.value?.[json.value.length - 1]
  if (!latest) {
    console.log('[bcb] No quote for today (may be non-business day)')
    return
  }

  const rate = (latest.cotacaoCompra + latest.cotacaoVenda) / 2

  const payload = {
    source: 'bcb-ptax',
    provenance: 'verified_real',
    timestamp: new Date().toISOString(),
    kind: 'fx',
    symbol: 'BRL/USD',
    value: rate,
    currency: 'BRL',
    detail: { buy: latest.cotacaoCompra, sell: latest.cotacaoVenda, asOf: latest.dataHoraCotacao },
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/market`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest FX failed: ${ingestRes.status}`)

  console.log(`[bcb] BRL/USD = ${rate.toFixed(4)}`)
}

export function startBcbEnricher() {
  if (!ENGINE_CONFIG.bcb.enabled) {
    console.log('[bcb] Disabled')
    return
  }

  console.log(`[bcb] Starting (interval: ${ENGINE_CONFIG.bcb.intervalMs / 60000} min)`)

  const run = () => fetchAndIngestFx().catch(err => console.warn('[bcb]', err.message))
  run()
  setInterval(run, ENGINE_CONFIG.bcb.intervalMs)
}
