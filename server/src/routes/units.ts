import type { FastifyInstance } from 'fastify'
import {
  listUnits,
  getUnit,
  getUnitByPlace,
  getUnitStats,
  getAllUnitTypeDefs,
  getUnitTypeDef,
  transitionUnit,
  getTransitions,
  getEvidence,
  attachEvidence,
  getEdges,
  getConsequences,
  createBundle,
  getBundle,
  getBundleAuditEvents,
  getBundleByChainHash,
  verifyBundle,
} from '../store/unitStore.js'
import {
  recordBundlePublished,
  getVerifierStats,
  recordVerifierTelemetry,
  type VerifierTelemetryOutcome,
} from '../store/verifierStats.js'

export async function unitRoutes(app: FastifyInstance) {

  /* ─── Unit Types ────────────────────────────────────────────────────────── */

  app.get('/api/unit-types', {
    schema: { tags: ['units'], summary: 'List all unit type definitions' },
  }, async () => {
    return getAllUnitTypeDefs()
  })

  app.get<{ Params: { id: string } }>('/api/unit-types/:id', {
    schema: { tags: ['units'], summary: 'Get a single unit type definition' },
  }, async (req, reply) => {
    const def = getUnitTypeDef(req.params.id)
    if (!def) return reply.status(404).send({ error: 'Unit type not found' })
    return def
  })

  /* ─── Units ─────────────────────────────────────────────────────────────── */

  app.get<{ Querystring: { type?: string; state?: string; severity?: string; owner?: string } }>(
    '/api/units',
    { schema: { tags: ['units'], summary: 'List units with optional filters' } },
    async (req) => {
      const { type, state, severity, owner } = req.query
      return listUnits({ typeId: type, state, severity, owner })
    },
  )

  app.get<{ Params: { id: string } }>('/api/units/:id', {
    schema: { tags: ['units'], summary: 'Get full unit detail' },
  }, async (req, reply) => {
    const unit = getUnit(req.params.id)
    if (!unit) return reply.status(404).send({ error: 'Unit not found' })
    return unit
  })

  app.get('/api/units/stats', {
    schema: { tags: ['units'], summary: 'Aggregate unit counts by type and severity' },
  }, async () => {
    return getUnitStats()
  })

  app.get<{ Params: { placeId: string } }>('/api/units/by-place/:placeId', {
    schema: { tags: ['units'], summary: 'Look up a unit by its map place ID' },
  }, async (req, reply) => {
    const unit = getUnitByPlace(req.params.placeId)
    if (!unit) return reply.status(404).send({ error: 'No unit at this place' })
    return unit
  })

  /* ─── Transitions ───────────────────────────────────────────────────────── */

  app.post<{
    Params: { id: string }
    Body: { toState: string; actor: string; reason?: string }
  }>('/api/units/:id/transition', {
    schema: { tags: ['units'], summary: 'Transition a unit to a new state' },
  }, async (req, reply) => {
    try {
      const record = transitionUnit(req.params.id, req.body.toState, req.body.actor, req.body.reason)
      return record
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transition failed'
      return reply.status(400).send({ error: message })
    }
  })

  app.get<{ Params: { id: string } }>('/api/units/:id/transitions', {
    schema: { tags: ['units'], summary: 'Get transition history for a unit' },
  }, async (req) => {
    return getTransitions(req.params.id)
  })

  /* ─── Evidence ──────────────────────────────────────────────────────────── */

  app.get<{ Params: { id: string } }>('/api/units/:id/evidence', {
    schema: { tags: ['units'], summary: 'List evidence refs for a unit' },
  }, async (req) => {
    return getEvidence(req.params.id)
  })

  app.post<{
    Params: { id: string }
    Body: { docType: string; docId: string; label: string; hash?: string; transitionId?: number }
  }>('/api/units/:id/evidence', {
    schema: { tags: ['units'], summary: 'Attach evidence to a unit' },
  }, async (req) => {
    return attachEvidence(req.params.id, {
      docType: req.body.docType,
      docId: req.body.docId,
      label: req.body.label,
      hash: req.body.hash,
      transitionId: req.body.transitionId,
    })
  })

  /* ─── Edges & Graph ─────────────────────────────────────────────────────── */

  app.get<{ Params: { id: string } }>('/api/units/:id/edges', {
    schema: { tags: ['units'], summary: 'Get incoming and outgoing edges for a unit' },
  }, async (req) => {
    return getEdges(req.params.id)
  })

  app.get<{
    Params: { id: string }
    Querystring: { maxDepth?: string }
  }>('/api/units/:id/consequences', {
    schema: { tags: ['units'], summary: 'Forward graph traversal from a unit' },
  }, async (req) => {
    const maxDepth = req.query.maxDepth ? parseInt(req.query.maxDepth, 10) : 5
    return getConsequences(req.params.id, maxDepth)
  })

  /* ─── Evidence Bundles ──────────────────────────────────────────────────── */

  app.post<{ Body: { rootUnitId: string; claim: string } }>('/api/bundles', {
    schema: { tags: ['units'], summary: 'Generate an evidence bundle' },
  }, async (req, reply) => {
    try {
      return createBundle(req.body.rootUnitId, req.body.claim)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bundle generation failed'
      return reply.status(400).send({ error: message })
    }
  })

  /**
   * Preset bundles — curated entry points for board-facing evidence packages.
   * Today only `boardPack` is supported; it roots the bundle at the project-level
   * site unit so the bundle includes deposits, milestones, risks, and offtakes
   * reachable from the site graph.
   */
  app.post<{ Body: { preset: string; claim?: string } }>('/api/bundles/preset', {
    schema: { tags: ['units'], summary: 'Generate a curated evidence bundle (e.g. boardPack)' },
  }, async (req, reply) => {
    const preset = req.body.preset
    const PRESETS: Record<string, { rootUnitId: string; defaultClaim: string }> = {
      boardPack: {
        rootUnitId: 'SITE-CALDEIRA',
        defaultClaim: 'Caldeira Project board pack: consolidated state of deposits, milestones, risks, offtakes, and permit conditions as of bundle creation.',
      },
      maritimeIsr: {
        rootUnitId: 'SITE-MARITIME',
        defaultClaim: 'Atlantic Maritime ISR product handoff: AOIs, vessel detections (incl. dark-vessel events), sensor station coverage, and ISR product status as of bundle creation.',
      },
    }
    const def = PRESETS[preset]
    if (!def) {
      return reply.status(400).send({ error: `Unknown preset '${preset}'. Available: ${Object.keys(PRESETS).join(', ')}` })
    }
    try {
      return createBundle(def.rootUnitId, req.body.claim ?? def.defaultClaim)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bundle generation failed'
      return reply.status(400).send({ error: message })
    }
  })

  app.get<{ Params: { id: string } }>('/api/bundles/:id', {
    schema: { tags: ['units'], summary: 'Get a full evidence bundle' },
  }, async (req, reply) => {
    const bundle = getBundle(req.params.id)
    if (!bundle) return reply.status(404).send({ error: 'Bundle not found' })
    return bundle
  })

  app.get<{ Params: { id: string } }>('/api/bundles/:id/verify', {
    schema: { tags: ['units'], summary: 'Verify a bundle against the current audit chain' },
  }, async (req, reply) => {
    const result = verifyBundle(req.params.id)
    if (!result) return reply.status(404).send({ error: 'Bundle not found' })
    return result
  })

  /* ─── Public verifier endpoints (Wave 1 — no auth) ──────────────────────── */

  /**
   * Canonical, content-addressed read for the public verifier UI at
   * `verochain.co/verify/<chain_hash>`. The response embeds every audit_events
   * row covered by the bundle's chain proof so the browser can re-walk and
   * recompute payload_hash + chain_hash without further round trips.
   *
   * Visibility model: all bundles are publicly readable by their canonical
   * hash. This route does NOT call requestGuards (only `/ingest/` and
   * `/api/chat` are gated, see server/src/auth/requestGuards.ts).
   */
  app.get<{ Params: { hash: string } }>('/api/public/bundles/by-hash/:hash', {
    schema: { tags: ['units'], summary: 'Public verifier: fetch a bundle by its canonical chain_hash' },
  }, async (req, reply) => {
    const bundle = getBundleByChainHash(req.params.hash)
    if (!bundle) return reply.status(404).send({ error: 'Bundle not found for given chain_hash' })
    // Wave 1 final-sprint policy (.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md § 2.2):
    // mock-mode bundles must NEVER be served from the public verifier
    // route, even if their chain hash is shared. The verifier UI promises
    // "this came from live operational data" and we keep the promise here.
    if (bundle.dataMode === 'mock') {
      return reply.status(403).send({ error: 'mock_mode_bundle_not_publishable' })
    }
    const events = getBundleAuditEvents(bundle)
    recordBundlePublished({
      bundleId: bundle.id,
      chainHash: bundle.chainProof.endHash,
      sourceIp: req.ip ?? 'unknown',
    })
    return { ...bundle, events }
  })

  /**
   * Backwards-compatible public alias. Accepts a bundle UUID and 302-redirects
   * to the canonical hash URL so any in-app share link degrades gracefully.
   */
  app.get<{ Params: { id: string } }>('/api/public/bundles/:id', {
    schema: { tags: ['units'], summary: 'Public verifier: redirect bundle UUID to canonical hash URL' },
  }, async (req, reply) => {
    const bundle = getBundle(req.params.id)
    if (!bundle) return reply.status(404).send({ error: 'Bundle not found' })
    if (bundle.dataMode === 'mock') {
      return reply.status(403).send({ error: 'mock_mode_bundle_not_publishable' })
    }
    const hash = bundle.chainProof.endHash
    if (!hash) {
      const events = getBundleAuditEvents(bundle)
      recordBundlePublished({
        bundleId: bundle.id,
        chainHash: hash,
        sourceIp: req.ip ?? 'unknown',
      })
      return { ...bundle, events }
    }
    return reply.redirect(`/api/public/bundles/by-hash/${hash}`, 302)
  })

  /**
   * Public verifier telemetry sink. Accepts a single client-reported
   * measurement of the in-tab verification flow (chain hash, duration,
   * outcome, browser bucket). Always returns 204 — telemetry must never
   * surface a "submission failed" toast to the visitor, and the response
   * carries no information a hostile client could probe.
   *
   * Day-3 sprint deliverable
   * (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 3.2). The
   * payload schema and validation are documented in
   * `server/src/store/verifierStats.ts:recordVerifierTelemetry`.
   */
  app.post<{
    Body: {
      chainHash?: string
      durationMs?: number
      eventCount?: number
      outcome?: string
    }
  }>('/api/public/verifier-telemetry', {
    schema: { tags: ['units'], summary: 'Public verifier: anonymous client-side verify timing' },
  }, async (req, reply) => {
    const body = req.body ?? {}
    recordVerifierTelemetry({
      chainHash: typeof body.chainHash === 'string' ? body.chainHash : '',
      durationMs: typeof body.durationMs === 'number' ? body.durationMs : -1,
      eventCount: typeof body.eventCount === 'number' ? body.eventCount : -1,
      outcome: body.outcome as VerifierTelemetryOutcome,
      userAgent: req.headers['user-agent'] ?? null,
    })
    return reply.status(204).send()
  })

  /**
   * Admin-facing read of the conversion metric: external verifications per
   * published bundle plus client-side timing percentiles (p50/p95) from
   * the public verifier UI. Aggregates `bundle_published` audit-event rows
   * appended by `recordBundlePublished` and the rows persisted by
   * `/api/public/verifier-telemetry`. Office-dashboard, not buyer-facing.
   */
  app.get('/api/admin/verifier-stats', {
    schema: { tags: ['units'], summary: 'Admin: external verifications per published bundle + timing percentiles' },
  }, async () => {
    return getVerifierStats()
  })
}
