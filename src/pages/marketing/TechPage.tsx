import { marketingStyles } from '../../components/layout/MarketingShared'
import { MarketingShell } from '../../components/marketing/MarketingShell'
import { TechHeroSlide } from './decks/techDeckContent'

const heroSection: React.CSSProperties = {
  ...marketingStyles.heroSectionTransparent,
  ['--marketing-slide-bg' as string]: 'transparent',
}

/** Below-the-hero sections temporarily hidden while iterating on the globe-led hero. */
export default function TechPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <MarketingShell section="tech" embedded={embedded}>
      <section style={heroSection}><TechHeroSlide /></section>
    </MarketingShell>
  )
}
