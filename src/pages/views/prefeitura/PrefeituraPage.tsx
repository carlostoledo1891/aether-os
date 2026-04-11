import { memo } from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import { Share2, TrendingUp, Mountain, Leaf, Users, Heart, Phone } from 'lucide-react'
import { MapBase } from '../../../components/map/MapBase'
import { CaldeiraBoundary } from '../../../components/map/CaldeiraBoundary'
import { LicenseOverlay } from '../../../components/map/LicenseOverlay'
import { OpsPlantSitesOverlay } from '../../../components/map/OpsPlantSitesOverlay'
import { EnvironmentalOverlay } from '../../../components/map/EnvironmentalOverlay'
import data from './data.json'
import css from './prefeitura.module.css'

const COLORS: Record<string, string> = {
  green: '#22D68A',
  cyan: '#00D4C8',
  violet: '#7C5CFC',
  amber: '#F5A623',
}

const ICONS: Record<string, React.ComponentType<{ size: number; color?: string }>> = {
  'trending-up': TrendingUp,
  mountain: Mountain,
  leaf: Leaf,
  users: Users,
  heart: Heart,
  phone: Phone,
}

const MAP_VIEW = {
  longitude: -46.56,
  latitude: -21.87,
  zoom: 11.5,
  pitch: 30,
  bearing: 0,
} as const

export const PrefeituraPage = memo(function PrefeituraPage() {
  const { hero, mapHighlights, bottomMetrics, sidebar, footer, meta } = data

  return (
    <div className={css.page}>
      <div className={css.topBar}>
        <div className={css.logoWrap}>
          <div className={css.logoBlock}>
            <span className={css.logoName}>Meteoric Resources</span>
            <span className={css.logoPartner}>{meta.partner}</span>
          </div>
        </div>
        <button className={css.shareBtn} onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <Share2 size={12} />
          Compartilhar
        </button>
      </div>

      <div className={css.titleBar}>
        <div>
          <h1 className={css.titleText}>{hero.title}</h1>
          <span className={css.titleSub}>{hero.subtitle}</span>
        </div>
        <span className={css.titleUpdate}>Atualizado: {meta.updated}</span>
      </div>

      <div className={css.main}>
        <div className={css.mapColumn}>
          <MapProvider>
            <div className={css.mapWrap}>
              <MapBase
                initialViewState={MAP_VIEW}
                interactiveLayerIds={[]}
                highlightWater={false}
              >
                <CaldeiraBoundary />
                <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                <EnvironmentalOverlay showApa showBuffer={false} showMonitoring={false} showUrban={false} />
                <OpsPlantSitesOverlay hoveredId={null} selectedId={null} />
              </MapBase>

              <div className={css.mapHighlights}>
                {mapHighlights.map((h) => {
                  const color = COLORS[h.color] ?? h.color
                  return (
                    <div key={h.label} className={css.highlightCard}>
                      <div className={css.highlightDot} style={{ background: color, color }} />
                      <div>
                        <div className={css.highlightLabel}>{h.label}</div>
                        <div className={css.highlightValue} style={{ color }}>
                          {h.value}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </MapProvider>

          <div className={css.bottomStrip}>
            {bottomMetrics.map((m) => (
              <div key={m.label} className={css.bottomCard}>
                <div className={css.bottomLabel}>{m.label}</div>
                <div className={css.bottomValue}>{m.value}</div>
                <div className={css.bottomCaption}>{m.caption}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={css.sidebar}>
          {sidebar.map((card) => {
            const Icon = ICONS[card.icon]
            const color = COLORS[card.color] ?? card.color

            return (
              <div key={card.title} className={css.sideCard}>
                <div className={css.sideCardHeader}>
                  {Icon && (
                    <div className={css.sideCardIcon} style={{ background: `${color}18` }}>
                      <Icon size={13} color={color} />
                    </div>
                  )}
                  <h3 className={css.sideCardTitle}>{card.title}</h3>
                </div>
                <div className={css.sideCardItems}>
                  {'items' in card && card.items?.map((item) => (
                    <div key={item.label} className={css.sideItem}>
                      <span className={css.sideItemLabel}>{item.label}</span>
                      <span className={css.sideItemValue}>{item.value}</span>
                    </div>
                  ))}
                  {'contacts' in card && card.contacts?.map((c) => (
                    <div key={c.name} className={css.contactRow}>
                      <span className={css.contactName}>{c.name}</span>
                      <span className={css.contactDetail}>{c.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={css.footer}>
        <span className={css.footerPartners}>
          {footer.partners[0]} <span className={css.footerX}>&times;</span> {footer.partners[1]}
        </span>
      </div>
    </div>
  )
})
