import { ENGINE_CONFIG, ingestHeaders } from './config.js'
import { generatePlantTelemetry, INITIAL_PLANT } from './generators/plantGenerator.js'
import { generateEnvTelemetry, INITIAL_ENV } from './generators/envGenerator.js'
import { detectAlerts, calculateEsgScore } from './generators/alertGenerator.js'
import { startOpenMeteoEnricher } from './enrichers/openMeteo.js'
import { startBcbEnricher } from './enrichers/bcbExchange.js'
import { startUsgsEnricher } from './enrichers/usgsSeismic.js'
import { startAlphaVantageEnricher } from './enrichers/alphaVantage.js'
import { startLapocSimulator } from './enrichers/lapocAdapter.js'
import { startForecastEnricher } from './enrichers/openMeteoForecast.js'
import { startArchiveEnricher } from './enrichers/openMeteoArchive.js'
import type { AlertItem } from './generators/types.js'

const API = ENGINE_CONFIG.apiBaseUrl
const TICK_MS = ENGINE_CONFIG.tickMs

let plant = INITIAL_PLANT
let env = INITIAL_ENV
let alerts: AlertItem[] = []
let tickCount = 0

async function tick() {
  plant = generatePlantTelemetry(plant)
  env = generateEnvTelemetry(env)
  const esg = calculateEsgScore(plant, env)
  alerts = detectAlerts(plant, env, alerts)

  const payload = {
    source: ENGINE_CONFIG.source,
    provenance: 'simulated',
    timestamp: new Date().toISOString(),
    plant,
    env,
    esg,
    alerts,
  }

  try {
    const res = await fetch(`${API}/ingest/telemetry`, {
      method: 'POST',
      headers: ingestHeaders(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.warn(`[tick ${tickCount}] Ingest failed: HTTP ${res.status}`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[tick ${tickCount}] Server unreachable: ${msg}`)
  }

  tickCount++
  if (tickCount % 30 === 0) {
    console.log(`[engine] ${tickCount} ticks | pH=${plant.leaching_circuit.ph_level.toFixed(2)} | sulfate=${env.water_quality.sulfate_ppm.toFixed(0)}ppm | ESG=${esg.overall}`)
  }
}

async function waitForServer(maxRetries = 30, delayMs = 2000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${API}/api/health`)
      if (res.ok) return true
    } catch { /* server not up yet */ }
    console.log(`[engine] Waiting for server at ${API}... (${i + 1}/${maxRetries})`)
    await new Promise(r => setTimeout(r, delayMs))
  }
  return false
}

async function main() {
  console.log(`\n  VeroChain Simulation Engine`)
  console.log(`  Target API: ${API}`)
  console.log(`  Tick interval: ${TICK_MS}ms\n`)

  const serverUp = await waitForServer()
  if (!serverUp) {
    console.error('[engine] Server did not start. Exiting.')
    process.exit(1)
  }
  console.log('[engine] Server is up. Starting tick loop.\n')

  async function loop() {
    await tick()
    setTimeout(loop, TICK_MS)
  }
  loop()

  startOpenMeteoEnricher()
  startForecastEnricher()
  startArchiveEnricher()
  startBcbEnricher()
  startUsgsEnricher()
  startAlphaVantageEnricher()
  startLapocSimulator()
}

main()
