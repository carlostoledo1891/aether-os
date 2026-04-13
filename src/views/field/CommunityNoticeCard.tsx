import { AlertTriangle, Globe, Phone } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { W } from '../../app/canvas/canvasTheme'
import { COMMUNITY_STRINGS, type CommunityLang } from '../../data/communityTranslations'
import css from './EnvironmentPanel.module.css'

export function CommunityNoticeCard({ lang, onToggleLang }: { lang: CommunityLang; onToggleLang: () => void }) {
  const t = COMMUNITY_STRINGS[lang]

  return (
    <GlassCard animate={false} glow="amber" className={css.cardBodySm}>
      <div className={css.flexStart} style={{ gap: 6 }}>
        <AlertTriangle size={12} style={{ color: W.amber, marginTop: 1, flexShrink: 0 }} />
        <div className={css.flex1}>
          <div className={css.sectionHeadBetween} style={{ marginBottom: 4 }}>
            <div className={css.labelUpperBold} style={{ color: W.amber, letterSpacing: '0.06em' }}>
              {t.title}
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={`Switch language to ${t.toggle_label}`}
              className={css.langToggle}
              style={{
                color: W.violet, background: `${W.violet}14`,
                border: `1px solid ${W.violet}30`, borderRadius: W.radius.xs,
              }}
            >
              <Globe size={9} />
              {t.toggle_label}
            </button>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 10, color: W.text3, lineHeight: 1.5 }}>
            {t.disclaimer}{' '}
            <strong style={{ color: W.text2 }}>{t.disclaimer_bold}</strong>{' '}
            {t.disclaimer_rest}
          </p>

          {/* Grievance path */}
          <div className={css.grievanceBox} style={{ background: `${W.amber}08`, border: `1px solid ${W.amber}1A`, borderRadius: W.radius.sm, marginBottom: 8 }}>
            <div className={css.sectionHead} style={{ gap: 5, marginBottom: 5 }}>
              <Phone size={10} style={{ color: W.amber, flexShrink: 0 }} />
              <span className={css.labelUpperBold} style={{ color: W.amber }}>
                {t.grievance_title}
              </span>
            </div>
            <p style={{ margin: '0 0 5px', fontSize: 10, color: W.text3, lineHeight: 1.45 }}>
              {t.grievance_intro}
            </p>
            <ol className={css.grievanceList} style={{ color: W.text3 }}>
              {t.grievance_steps.map((step, i) => (
                <li key={i} className={css.grievanceStep}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Contact directory */}
          <div className={css.labelUpperBold} style={{ color: W.text3, marginBottom: 5 }}>
            {t.contacts_title}
          </div>
          <div className={css.flexCol} style={{ gap: 4 }}>
            {t.contacts.map(c => (
              <div key={c.label} className={css.infoCell} style={{ background: W.glass03, borderRadius: W.radius.sm, border: W.hairlineBorder }}>
                <div style={{ fontSize: 10, color: W.text2, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: W.cyan, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.value}</div>
                {c.note && <div style={{ fontSize: 9, color: W.text4, marginTop: 1 }}>{c.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
