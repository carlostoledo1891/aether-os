import { marketingStyles } from '../../components/layout/MarketingShared'
import { MarketingShell } from '../../components/marketing/MarketingShell'
import { BizHeroSlide } from './decks/businessDeckContent'

const heroSection: React.CSSProperties = {
  ...marketingStyles.heroSectionTransparent,
  ['--marketing-slide-bg' as string]: 'transparent',
}

/** Below-the-hero sections temporarily hidden while iterating on the globe-led hero. */
export default function BusinessPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <MarketingShell section="business" embedded={embedded}>
      <section style={heroSection}><BizHeroSlide /></section>
    </MarketingShell>
  )
}
