import { MarketingShell } from '../../components/marketing/MarketingShell'
import { ScrollyExperience } from '../../components/marketing/globe'

/**
 * Public landing page — "Every line you see is provable."
 *
 * Five-act scrollytelling experience built on the marketing globe:
 *
 *   1. Cold-open thesis (Manhattan camera, hero copy on the basemap)
 *   2. The pulse — pin field activates, audit ribbon starts streaming
 *   3. The chain — pulled-back tri-state view, trails accumulate
 *   4. The field — flyTo Caldeira (Brazil), pin set swaps to drillholes
 *   5. The promise — pulled out to globe view, CTA
 *   6. Coda — visit-hash receipt + CTA
 *
 * The shell mounts the persistent ProvenanceChip / LiveCounter /
 * AuditTicker / ProvenanceCardOverlay.
 */
export default function LandingPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <MarketingShell embedded={embedded} experience={!embedded}>
      <ScrollyExperience />
    </MarketingShell>
  )
}
