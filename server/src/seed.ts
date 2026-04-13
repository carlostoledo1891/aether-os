/**
 * Seeds the SQLite database with Caldeira domain data on first boot.
 *
 * All site-specific data is defined in server/src/sites/caldeiraSeed.ts.
 * Canonical thresholds and geography live in shared/sites/caldeira.ts.
 * This file is a thin orchestrator — it never defines domain literals.
 */
import { getDb, setDomainState, getDomainState } from './store/db.js'
import { appendAuditEvent } from './store/auditChain.js'
import { CALDEIRA_SEED, CALDEIRA_AUDIT_SEED } from './sites/caldeiraSeed.js'

export function seedIfNeeded() {
  getDb()

  if (getDomainState('spring_count') !== null) {
    console.log('[seed] Database already seeded — skipping.')
    return
  }

  console.log('[seed] Seeding domain state from Caldeira site data...')

  for (const [key, value] of Object.entries(CALDEIRA_SEED)) {
    setDomainState(key, value)
  }

  // Regulatory export bundle (depends on other domain state being seeded first)
  setDomainState('regulatory_export_bundle', {
    exportedAt: new Date().toISOString(),
    bannerNote: 'Live pipeline — VeroChain Simulation Engine',
    regulatoryLog: getDomainState('regulatory_log'),
    auditEvents: (getDomainState<Array<{ id: string; type: string }>>('audit_trail') ?? [])
      .filter(e => e.type === 'regulatory_submission' || e.id === 'AUD-008' || e.id === 'AUD-009' || e.id === 'AUD-010'),
    permittingRisks: (getDomainState<Array<{ category: string; id: string }>>('risks') ?? [])
      .filter(r => r.category === 'permitting' || r.id === 'R01'),
    provenanceSummary: 'Illustrative bundle for briefing. Replace with signed PDFs and portal exports for official use.',
  })

  // Audit chain (append in chronological order for correct SHA-256 chaining)
  for (const evt of CALDEIRA_AUDIT_SEED) {
    appendAuditEvent(evt)
  }

  console.log('[seed] Domain state seeded successfully.')
}
