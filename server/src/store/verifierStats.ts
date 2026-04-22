/**
 * Wave 1 conversion-metric instrumentation.
 *
 * The "external verifications per published bundle" metric is the Wave-1
 * north star (see plan.md and AGENT.md). Every time a stranger fetches a
 * bundle through the public verifier endpoint we want one durable record on
 * the audit chain so the metric itself is provable.
 *
 * Two safeguards:
 *  - **Per-(bundle, ip) dedupe within a 1h window.** Stops the chain from
 *    becoming a refresh-counter and keeps the metric semantically meaningful
 *    ("distinct verifier sessions" rather than "page reloads").
 *  - **Best-effort.** Any failure in the audit append is swallowed; the
 *    public read must never fail because instrumentation failed.
 */

import { randomUUID } from 'node:crypto'
import { appendAuditEvent } from './auditChain.js'
import { getDb } from './db.js'

const DEDUPE_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const recentFetches = new Map<string, number>()

function dedupeKey(bundleId: string, sourceIp: string): string {
  return `${bundleId}::${sourceIp}`
}

function isRecent(key: string): boolean {
  const at = recentFetches.get(key)
  if (!at) return false
  return Date.now() - at < DEDUPE_WINDOW_MS
}

function pruneOld(): void {
  const cutoff = Date.now() - DEDUPE_WINDOW_MS
  for (const [k, t] of recentFetches.entries()) {
    if (t < cutoff) recentFetches.delete(k)
  }
}

export function recordBundlePublished(opts: {
  bundleId: string
  chainHash: string
  sourceIp: string
}): void {
  const key = dedupeKey(opts.bundleId, opts.sourceIp)
  if (isRecent(key)) return
  recentFetches.set(key, Date.now())
  pruneOld()

  try {
    appendAuditEvent({
      event_id: `bundle-published-${randomUUID()}`,
      timestamp: new Date().toISOString(),
      type: 'bundle_published',
      actor: 'public-verifier',
      action: `Bundle ${opts.bundleId} fetched by external verifier`,
      detail: `chain_hash=${opts.chainHash || '(none)'}; source_ip=${opts.sourceIp}`,
      relatedEntityId: opts.bundleId,
    })
  } catch {
    // Best-effort. Public read must succeed even if the audit append fails
    // (eg. duplicate event_id race, transient DB lock).
  }
}

/* ─── Telemetry: client-side verification timing ──────────────────────────── */

/**
 * Outcomes the client may report. `unavailable` means `crypto.subtle` was
 * missing (in-app webview, locked-down browser); `error` is a network or
 * parse failure before verification could complete.
 */
export type VerifierTelemetryOutcome = 'valid' | 'broken' | 'unavailable' | 'error'

/** Coarse buckets so we can spot mobile-Safari regressions without PII. */
export type UserAgentClass = 'safari' | 'chromium' | 'firefox' | 'webview' | 'other'

const ALLOWED_OUTCOMES: ReadonlySet<VerifierTelemetryOutcome> = new Set([
  'valid', 'broken', 'unavailable', 'error',
])
const ALLOWED_UA_CLASSES: ReadonlySet<UserAgentClass> = new Set([
  'safari', 'chromium', 'firefox', 'webview', 'other',
])

/**
 * Coerce an arbitrary client `User-Agent` string into one of the allowed
 * coarse buckets. We do this server-side so a malicious client cannot
 * inject arbitrary bucket strings via the JSON body.
 */
export function classifyUserAgent(ua: string | undefined | null): UserAgentClass {
  if (!ua) return 'other'
  const s = ua.toLowerCase()
  // Order matters: webview detection must precede safari/chromium.
  if (s.includes('fbav') || s.includes('instagram') || s.includes('linkedinapp') || s.includes('wv)')) return 'webview'
  if (s.includes('firefox') || s.includes('fxios')) return 'firefox'
  if (s.includes('chrome') || s.includes('crios') || s.includes('edg/')) return 'chromium'
  if (s.includes('safari')) return 'safari'
  return 'other'
}

export interface RecordTelemetryInput {
  chainHash: string
  durationMs: number
  eventCount: number
  outcome: VerifierTelemetryOutcome
  userAgent?: string | null
}

/**
 * Persist a single client-reported verifier measurement.
 *
 * Validation is paranoid because the route is public. Anything that
 * smells wrong is silently dropped — the public verifier UI must never
 * surface a "telemetry failed" error to the visitor.
 */
export function recordVerifierTelemetry(input: RecordTelemetryInput): boolean {
  if (!input || typeof input !== 'object') return false
  if (typeof input.chainHash !== 'string') return false
  if (!/^[0-9a-f]{64}$/i.test(input.chainHash)) return false
  if (!Number.isFinite(input.durationMs) || input.durationMs < 0) return false
  // Cap at 5 minutes — anything larger is almost certainly a paused tab
  // or a buggy clock and would skew percentiles.
  const durationMs = Math.min(Math.round(input.durationMs), 5 * 60 * 1000)
  if (!Number.isInteger(input.eventCount) || input.eventCount < 0) return false
  if (!ALLOWED_OUTCOMES.has(input.outcome)) return false

  const uaClass = classifyUserAgent(input.userAgent)
  if (!ALLOWED_UA_CLASSES.has(uaClass)) return false

  try {
    const db = getDb()
    db.prepare(`
      INSERT INTO verifier_telemetry
        (chain_hash, duration_ms, event_count, outcome, user_agent_class, reported_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      input.chainHash.toLowerCase(),
      durationMs,
      input.eventCount,
      input.outcome,
      uaClass,
      new Date().toISOString(),
    )
    return true
  } catch {
    // Best-effort. Telemetry write failures must not break the public route.
    return false
  }
}

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0
  if (sortedAsc.length === 1) return sortedAsc[0]
  // Nearest-rank percentile — good enough for "is the verifier fast?"
  // dashboards and matches the simple definition we cite in the launch post.
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((p / 100) * sortedAsc.length) - 1),
  )
  return sortedAsc[rank]
}

export interface VerifierTelemetrySummary {
  sampleSize: number
  p50DurationMs: number
  p95DurationMs: number
  outcomes: Record<VerifierTelemetryOutcome, number>
  byUserAgent: Record<UserAgentClass, number>
}

/**
 * Aggregate the last `windowDays` of telemetry for the admin dashboard.
 * Defaults to 30 days so a single launch-day spike doesn't dominate the
 * percentiles for the rest of the quarter.
 */
export function getVerifierTelemetrySummary(windowDays = 30): VerifierTelemetrySummary {
  const db = getDb()
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString()

  const rows = db.prepare(`
    SELECT duration_ms, outcome, user_agent_class
    FROM verifier_telemetry
    WHERE reported_at >= ?
    ORDER BY duration_ms ASC
  `).all(cutoff) as Array<{ duration_ms: number; outcome: VerifierTelemetryOutcome; user_agent_class: UserAgentClass }>

  // Percentiles are computed only over outcomes where the verifier
  // actually ran end-to-end; otherwise an `unavailable` row (where the
  // browser bailed in <1ms) would falsely lower the median.
  const completedDurations = rows
    .filter(r => r.outcome === 'valid' || r.outcome === 'broken')
    .map(r => r.duration_ms)

  const outcomes: Record<VerifierTelemetryOutcome, number> = {
    valid: 0, broken: 0, unavailable: 0, error: 0,
  }
  const byUserAgent: Record<UserAgentClass, number> = {
    safari: 0, chromium: 0, firefox: 0, webview: 0, other: 0,
  }
  for (const r of rows) {
    outcomes[r.outcome] = (outcomes[r.outcome] ?? 0) + 1
    byUserAgent[r.user_agent_class] = (byUserAgent[r.user_agent_class] ?? 0) + 1
  }

  return {
    sampleSize: rows.length,
    p50DurationMs: percentile(completedDurations, 50),
    p95DurationMs: percentile(completedDurations, 95),
    outcomes,
    byUserAgent,
  }
}

/* ─── Stats reader for the admin widget ───────────────────────────────────── */

export interface VerifierStats {
  totalPublishedEvents: number
  uniqueBundles: number
  perBundle: Array<{ bundleId: string; verifications: number; lastSeen: string }>
  telemetry: VerifierTelemetrySummary
  generatedAt: string
}

/**
 * Compute "external verifications per published bundle" by querying
 * audit_events of type 'bundle_published'. Excludes related_entity_id NULLs.
 * Returned shape is small enough to render in a single admin widget.
 */
export function getVerifierStats(): VerifierStats {
  const db = getDb()
  const rows = db.prepare(`
    SELECT related_entity_id AS bundle_id, COUNT(*) AS cnt, MAX(timestamp) AS last_seen
    FROM audit_events
    WHERE type = 'bundle_published' AND related_entity_id IS NOT NULL
    GROUP BY related_entity_id
    ORDER BY cnt DESC, last_seen DESC
  `).all() as Array<{ bundle_id: string; cnt: number; last_seen: string }>

  const perBundle = rows.map(r => ({
    bundleId: r.bundle_id,
    verifications: r.cnt,
    lastSeen: r.last_seen,
  }))
  const totalPublishedEvents = perBundle.reduce((sum, r) => sum + r.verifications, 0)

  return {
    totalPublishedEvents,
    uniqueBundles: perBundle.length,
    perBundle,
    telemetry: getVerifierTelemetrySummary(),
    generatedAt: new Date().toISOString(),
  }
}
