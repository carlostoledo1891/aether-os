import { marketingStyles } from '../../components/layout/MarketingShared'
import { MarketingShell } from '../../components/marketing/MarketingShell'
import { TrustHeroSlide } from './decks/trustDeckContent'

const heroSection: React.CSSProperties = {
  ...marketingStyles.heroSectionTransparent,
  ['--marketing-slide-bg' as string]: 'transparent',
}

/** Below-the-hero sections temporarily hidden while iterating on the globe-led hero. */
export default function TrustCenterPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <MarketingShell section="trust" embedded={embedded}>
      <section style={heroSection}><TrustHeroSlide /></section>
    </MarketingShell>
  )
}
