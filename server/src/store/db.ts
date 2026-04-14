import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { mkdirSync } from 'node:fs'
import type {
  PlantTelemetry, EnvTelemetry, EsgScore, AlertItem,
  TelemetryTick, HistoricalTelemetry, TimeRangeKey,
  WeatherIngestPayload, MarketIngestPayload, SeismicIngestPayload,
  ForecastIngestPayload, HistoricalWeatherIngestPayload,
} from '../types/shared.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH
  ?? path.join(__dirname, '..', '..', 'data', 'aether.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(path.dirname(DB_PATH), { recursive: true })
    console.log(`[db] Opening database at ${DB_PATH}`)
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('synchronous = NORMAL')
    initSchema()
  }
  return db
}

const SCHEMA_VERSION = 4

const MIGRATIONS: Array<(d: Database.Database) => void> = [
  // v0 → v1: initial schema
  (d) => {
    d.exec(`
    CREATE TABLE IF NOT EXISTS telemetry_latest (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      plant_json TEXT NOT NULL,
      env_json TEXT NOT NULL,
      esg_json TEXT NOT NULL,
      alerts_json TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'unknown',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS telemetry_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      range_key TEXT NOT NULL,
      plant_json TEXT NOT NULL,
      env_json TEXT NOT NULL,
      precip_mm REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_history_range ON telemetry_history(range_key);

    CREATE TABLE IF NOT EXISTS domain_state (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weather_latest (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      source TEXT NOT NULL,
      provenance TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      precip_mm REAL NOT NULL,
      series_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS market_data (
      symbol TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      provenance TEXT NOT NULL,
      kind TEXT NOT NULL,
      value REAL NOT NULL,
      currency TEXT NOT NULL,
      detail_json TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seismic_events (
      id TEXT PRIMARY KEY,
      magnitude REAL NOT NULL,
      place TEXT NOT NULL,
      event_time TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      depth_km REAL NOT NULL,
      source TEXT NOT NULL,
      ingested_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weather_forecast (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      source TEXT NOT NULL,
      provenance TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      forecast_days INTEGER NOT NULL,
      total_precip_mm REAL NOT NULL,
      series_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weather_historical (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      source TEXT NOT NULL,
      provenance TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      day_count INTEGER NOT NULL,
      total_precip_mm REAL NOT NULL,
      avg_annual_precip_mm REAL NOT NULL,
      series_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
  },

  // v1 → v2: append-only audit event chain (Phase 0 blockchain foundation)
  (d) => {
    d.exec(`
    CREATE TABLE IF NOT EXISTS audit_events (
      sequence          INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id          TEXT    NOT NULL UNIQUE,
      timestamp         TEXT    NOT NULL,
      type              TEXT    NOT NULL,
      actor             TEXT    NOT NULL,
      action            TEXT    NOT NULL,
      detail            TEXT    NOT NULL,
      payload_hash      TEXT    NOT NULL,
      prev_hash         TEXT    NOT NULL,
      chain_hash        TEXT    NOT NULL,
      related_entity_id TEXT,
      anchor_batch_id   INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_audit_type ON audit_events(type);
    CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_events(timestamp);
  `)
  },

  // v2 → v3: lapoc telemetry tables
  (d) => {
    d.exec(`
    CREATE TABLE IF NOT EXISTS lapoc_piezometer (
      sensor_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      depth_meters REAL NOT NULL,
      temperature_c REAL NOT NULL,
      conductivity_us_cm REAL NOT NULL,
      PRIMARY KEY (sensor_id, timestamp)
    );

    CREATE TABLE IF NOT EXISTS lapoc_water_quality (
      sample_id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      location TEXT NOT NULL,
      ph REAL NOT NULL,
      sulfate_ppm REAL NOT NULL,
      nitrate_ppm REAL NOT NULL,
      iron_ppm REAL NOT NULL,
      manganese_ppm REAL NOT NULL,
      turbidity_ntu REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lapoc_field_observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      observer TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      spring_id TEXT NOT NULL,
      flow_status TEXT NOT NULL,
      photo_ref TEXT,
      notes TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lapoc_ingest_latest (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      source TEXT NOT NULL,
      provenance TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `)
  },
  // v3 → v4: knowledge chunks for RAG
  (d) => {
    d.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      heading TEXT,
      token_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(doc_id, chunk_index)
    );

    CREATE INDEX IF NOT EXISTS idx_kc_doc ON knowledge_chunks(doc_id);
    CREATE INDEX IF NOT EXISTS idx_kc_content ON knowledge_chunks(content);
  `)
  },
]

function initSchema() {
  const currentVersion = (db.pragma('user_version', { simple: true }) as number) ?? 0
  for (let v = currentVersion; v < SCHEMA_VERSION; v++) {
    MIGRATIONS[v](db)
  }
  db.pragma(`user_version = ${SCHEMA_VERSION}`)
}

/* ─── Telemetry operations ──────────────────────────────────────────────── */

const HISTORY_LIMITS: Record<TimeRangeKey, number> = { '24h': 60, '7d': 120, '30d': 200 }

export const upsertTelemetry = (tick: TelemetryTick, source: string) => {
  const db = getDb()
  const now = new Date().toISOString()
  const plantJson = JSON.stringify(tick.plant)
  const envJson = JSON.stringify(tick.env)

  const txn = db.transaction(() => {
    db.prepare(`
      INSERT INTO telemetry_latest (id, plant_json, env_json, esg_json, alerts_json, source, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        plant_json = excluded.plant_json,
        env_json = excluded.env_json,
        esg_json = excluded.esg_json,
        alerts_json = excluded.alerts_json,
        source = excluded.source,
        updated_at = excluded.updated_at
    `).run(plantJson, envJson, JSON.stringify(tick.esg), JSON.stringify(tick.alerts), source, now)

    const histStmt = db.prepare(`
      INSERT INTO telemetry_history (range_key, plant_json, env_json, precip_mm, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    histStmt.run('24h', plantJson, envJson, 0, now)
    histStmt.run('7d', plantJson, envJson, 0, now)
    histStmt.run('30d', plantJson, envJson, 0, now)

    trimHistory('24h')
    trimHistory('7d')
    trimHistory('30d')
  })
  txn()
}

function trimHistory(rangeKey: TimeRangeKey) {
  const limit = HISTORY_LIMITS[rangeKey]
  getDb().prepare(`
    DELETE FROM telemetry_history
    WHERE range_key = ? AND id NOT IN (
      SELECT id FROM telemetry_history WHERE range_key = ? ORDER BY id DESC LIMIT ?
    )
  `).run(rangeKey, rangeKey, limit)
}

function safeParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T }
  catch { console.warn('[db] corrupt JSON in row, using fallback'); return fallback }
}

export function getLatestTelemetry(): (TelemetryTick & { source: string; updated_at: string }) | null {
  const row = getDb().prepare('SELECT * FROM telemetry_latest WHERE id = 1').get() as {
    plant_json: string; env_json: string; esg_json: string; alerts_json: string
    source: string; updated_at: string
  } | undefined

  if (!row) return null
  return {
    plant: safeParse<PlantTelemetry>(row.plant_json, {} as PlantTelemetry),
    env: safeParse<EnvTelemetry>(row.env_json, {} as EnvTelemetry),
    esg: safeParse<EsgScore>(row.esg_json, { overall: 0, breakdown: {} } as unknown as EsgScore),
    alerts: safeParse<AlertItem[]>(row.alerts_json, []),
    source: row.source,
    updated_at: row.updated_at,
  }
}

export function getTelemetryHistory(rangeKey: TimeRangeKey): HistoricalTelemetry {
  const rows = getDb().prepare(
    'SELECT plant_json, env_json, precip_mm FROM telemetry_history WHERE range_key = ? ORDER BY id ASC',
  ).all(rangeKey) as { plant_json: string; env_json: string; precip_mm: number }[]

  return {
    plantHistory: rows.map(r => safeParse<PlantTelemetry>(r.plant_json, {} as PlantTelemetry)),
    envHistory: rows.map(r => safeParse<EnvTelemetry>(r.env_json, {} as EnvTelemetry)),
    precipMmSeries: rows.map(r => r.precip_mm),
  }
}

/* ─── Domain state (static seed data) ────────────────────────────────── */

export function setDomainState(key: string, value: unknown) {
  getDb().prepare(`
    INSERT INTO domain_state (key, value_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
  `).run(key, JSON.stringify(value), new Date().toISOString())
}

export function getDomainState<T>(key: string): T | null {
  const row = getDb().prepare('SELECT value_json FROM domain_state WHERE key = ?').get(key) as
    { value_json: string } | undefined
  if (!row) return null
  return safeParse<T>(row.value_json, null as unknown as T)
}

/* ─── Weather ──────────────────────────────────────────────────────────── */

export function upsertWeather(payload: WeatherIngestPayload) {
  getDb().prepare(`
    INSERT INTO weather_latest (id, source, provenance, latitude, longitude, precip_mm, series_json, updated_at)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source, provenance = excluded.provenance,
      latitude = excluded.latitude, longitude = excluded.longitude,
      precip_mm = excluded.precip_mm, series_json = excluded.series_json,
      updated_at = excluded.updated_at
  `).run(
    payload.source, payload.provenance, payload.latitude, payload.longitude,
    payload.precipMm, JSON.stringify(payload.series), payload.timestamp,
  )
}

export function getLatestWeather() {
  const row = getDb().prepare('SELECT * FROM weather_latest WHERE id = 1').get() as {
    source: string; provenance: string; latitude: number; longitude: number
    precip_mm: number; series_json: string; updated_at: string
  } | undefined
  if (!row) return null
  return {
    source: row.source, provenance: row.provenance,
    latitude: row.latitude, longitude: row.longitude,
    precipMm: row.precip_mm,
    series: safeParse(row.series_json, { time: [] as string[], precipitation_sum: [] as number[] }),
    updatedAt: row.updated_at,
  }
}

/* ─── Weather Forecast ──────────────────────────────────────────────── */

export function upsertForecast(payload: ForecastIngestPayload) {
  getDb().prepare(`
    INSERT INTO weather_forecast (id, source, provenance, latitude, longitude, forecast_days, total_precip_mm, series_json, updated_at)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source, provenance = excluded.provenance,
      latitude = excluded.latitude, longitude = excluded.longitude,
      forecast_days = excluded.forecast_days, total_precip_mm = excluded.total_precip_mm,
      series_json = excluded.series_json, updated_at = excluded.updated_at
  `).run(
    payload.source, payload.provenance, payload.latitude, payload.longitude,
    payload.forecastDays, payload.totalPrecipMm, JSON.stringify(payload.series), payload.timestamp,
  )
}

export function getLatestForecast() {
  const row = getDb().prepare('SELECT * FROM weather_forecast WHERE id = 1').get() as {
    source: string; provenance: string; latitude: number; longitude: number
    forecast_days: number; total_precip_mm: number; series_json: string; updated_at: string
  } | undefined
  if (!row) return null
  return {
    source: row.source, provenance: row.provenance,
    latitude: row.latitude, longitude: row.longitude,
    forecastDays: row.forecast_days, totalPrecipMm: row.total_precip_mm,
    series: safeParse(row.series_json, {
      time: [] as string[], temperature_2m_max: [] as number[],
      temperature_2m_min: [] as number[], precipitation_sum: [] as number[],
      wind_speed_10m_max: [] as number[], relative_humidity_2m_max: [] as number[],
      et0_fao_evapotranspiration: [] as number[],
    }),
    updatedAt: row.updated_at,
  }
}

/* ─── Weather Historical ───────────────────────────────────────────── */

export function upsertHistoricalWeather(payload: HistoricalWeatherIngestPayload) {
  getDb().prepare(`
    INSERT INTO weather_historical (id, source, provenance, latitude, longitude, start_date, end_date, day_count, total_precip_mm, avg_annual_precip_mm, series_json, updated_at)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source, provenance = excluded.provenance,
      latitude = excluded.latitude, longitude = excluded.longitude,
      start_date = excluded.start_date, end_date = excluded.end_date,
      day_count = excluded.day_count, total_precip_mm = excluded.total_precip_mm,
      avg_annual_precip_mm = excluded.avg_annual_precip_mm,
      series_json = excluded.series_json, updated_at = excluded.updated_at
  `).run(
    payload.source, payload.provenance, payload.latitude, payload.longitude,
    payload.startDate, payload.endDate, payload.dayCount,
    payload.totalPrecipMm, payload.avgAnnualPrecipMm,
    JSON.stringify(payload.series), payload.timestamp,
  )
}

export function getHistoricalWeather() {
  const row = getDb().prepare('SELECT * FROM weather_historical WHERE id = 1').get() as {
    source: string; provenance: string; latitude: number; longitude: number
    start_date: string; end_date: string; day_count: number
    total_precip_mm: number; avg_annual_precip_mm: number
    series_json: string; updated_at: string
  } | undefined
  if (!row) return null
  return {
    source: row.source, provenance: row.provenance,
    latitude: row.latitude, longitude: row.longitude,
    startDate: row.start_date, endDate: row.end_date,
    dayCount: row.day_count, totalPrecipMm: row.total_precip_mm,
    avgAnnualPrecipMm: row.avg_annual_precip_mm,
    series: safeParse(row.series_json, {
      time: [] as string[], temperature_2m_max: [] as number[],
      temperature_2m_min: [] as number[], precipitation_sum: [] as number[],
      wind_speed_10m_max: [] as number[], et0_fao_evapotranspiration: [] as number[],
    }),
    updatedAt: row.updated_at,
  }
}

/* ─── Market ──────────────────────────────────────────────────────────── */

export function upsertMarket(payload: MarketIngestPayload) {
  getDb().prepare(`
    INSERT INTO market_data (symbol, source, provenance, kind, value, currency, detail_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(symbol) DO UPDATE SET
      source = excluded.source, provenance = excluded.provenance, kind = excluded.kind,
      value = excluded.value, currency = excluded.currency,
      detail_json = excluded.detail_json, updated_at = excluded.updated_at
  `).run(
    payload.symbol, payload.source, payload.provenance, payload.kind,
    payload.value, payload.currency,
    payload.detail ? JSON.stringify(payload.detail) : null,
    payload.timestamp,
  )
}

export function getMarketData(symbol: string) {
  const row = getDb().prepare('SELECT * FROM market_data WHERE symbol = ?').get(symbol) as {
    symbol: string; source: string; provenance: string; kind: string
    value: number; currency: string; detail_json: string | null; updated_at: string
  } | undefined
  if (!row) return null
  return {
    symbol: row.symbol, source: row.source, provenance: row.provenance,
    kind: row.kind, value: row.value, currency: row.currency,
    detail: row.detail_json ? safeParse(row.detail_json, null) : null,
    updatedAt: row.updated_at,
  }
}

/* ─── Seismic ──────────────────────────────────────────────────────────── */

const MAX_SEISMIC_EVENTS = 500

export function upsertSeismic(payload: SeismicIngestPayload) {
  const d = getDb()
  const stmt = d.prepare(`
    INSERT OR REPLACE INTO seismic_events (id, magnitude, place, event_time, latitude, longitude, depth_km, source, ingested_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertMany = d.transaction((events: SeismicIngestPayload['events']) => {
    for (const e of events) {
      stmt.run(e.id, e.magnitude, e.place, e.time, e.latitude, e.longitude, e.depth_km, payload.source, payload.timestamp)
    }
    d.prepare(`
      DELETE FROM seismic_events WHERE id NOT IN (
        SELECT id FROM seismic_events ORDER BY event_time DESC LIMIT ?
      )
    `).run(MAX_SEISMIC_EVENTS)
  })
  insertMany(payload.events)
}

export function getRecentSeismic(limit = 20) {
  return getDb().prepare(
    'SELECT * FROM seismic_events ORDER BY event_time DESC LIMIT ?',
  ).all(limit) as Array<{
    id: string; magnitude: number; place: string; event_time: string
    latitude: number; longitude: number; depth_km: number; source: string
  }>
}

/* ─── LAPOC ─────────────────────────────────────────────────────────────── */

export interface LapocIngestPayload {
  source: string
  provenance: string
  timestamp: string
  piezometer_readings: Array<{
    sensor_id: string; timestamp: string; depth_meters: number
    temperature_c: number; conductivity_us_cm: number
  }>
  water_quality_samples: Array<{
    sample_id: string; timestamp: string; location: string
    ph: number; sulfate_ppm: number; nitrate_ppm: number
    iron_ppm: number; manganese_ppm: number; turbidity_ntu: number
  }>
  field_observations: Array<{
    observer: string; timestamp: string; spring_id: string
    flow_status: string; photo_ref?: string; notes: string
  }>
}

export function upsertLapoc(payload: LapocIngestPayload) {
  const d = getDb()
  const txn = d.transaction(() => {
    d.prepare(`
      INSERT INTO lapoc_ingest_latest (id, source, provenance, timestamp)
      VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        source = excluded.source, provenance = excluded.provenance, timestamp = excluded.timestamp
    `).run(payload.source, payload.provenance, payload.timestamp)

    if (payload.piezometer_readings?.length > 0) {
      const piezoStmt = d.prepare(`
        INSERT OR REPLACE INTO lapoc_piezometer (sensor_id, timestamp, depth_meters, temperature_c, conductivity_us_cm)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const p of payload.piezometer_readings) {
        piezoStmt.run(p.sensor_id, p.timestamp, p.depth_meters, p.temperature_c, p.conductivity_us_cm)
      }
    }

    if (payload.water_quality_samples?.length > 0) {
      const wqStmt = d.prepare(`
        INSERT OR REPLACE INTO lapoc_water_quality (sample_id, timestamp, location, ph, sulfate_ppm, nitrate_ppm, iron_ppm, manganese_ppm, turbidity_ntu)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const w of payload.water_quality_samples) {
        wqStmt.run(w.sample_id, w.timestamp, w.location, w.ph, w.sulfate_ppm, w.nitrate_ppm, w.iron_ppm, w.manganese_ppm, w.turbidity_ntu)
      }
    }

    if (payload.field_observations?.length > 0) {
      const obsStmt = d.prepare(`
        INSERT INTO lapoc_field_observations (observer, timestamp, spring_id, flow_status, photo_ref, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      for (const o of payload.field_observations) {
        obsStmt.run(o.observer, o.timestamp, o.spring_id, o.flow_status, o.photo_ref ?? null, o.notes)
      }
    }
  })
  txn()
}

export function getLatestLapocIngest() {
  const row = getDb().prepare('SELECT * FROM lapoc_ingest_latest WHERE id = 1').get() as {
    source: string; provenance: string; timestamp: string
  } | undefined
  return row ?? null
}

/* ─── Alert operations ──────────────────────────────────────────────────── */

export function dismissAlert(alertId: string) {
  const d = getDb()
  d.transaction(() => {
    const latest = getLatestTelemetry()
    if (!latest) return
    const alerts = latest.alerts.map(a => a.id === alertId ? { ...a, dismissed: true } : a)
    d.prepare('UPDATE telemetry_latest SET alerts_json = ?, updated_at = ? WHERE id = 1')
      .run(JSON.stringify(alerts), new Date().toISOString())
  })()
}

export function dismissAllAlerts() {
  const d = getDb()
  d.transaction(() => {
    const latest = getLatestTelemetry()
    if (!latest) return
    const alerts = latest.alerts.map(a => ({ ...a, dismissed: true }))
    d.prepare('UPDATE telemetry_latest SET alerts_json = ?, updated_at = ? WHERE id = 1')
      .run(JSON.stringify(alerts), new Date().toISOString())
  })()
}
