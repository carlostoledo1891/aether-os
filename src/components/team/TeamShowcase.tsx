import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { TEAM } from '../../config/marketing'

interface TeamShowcaseProps {
  title: string
  eyebrow?: string
  align?: 'left' | 'center'
}

export function TeamShowcase({
  title,
  eyebrow = 'Team',
  align = 'left',
}: TeamShowcaseProps) {
  return (
    <div style={{ width: '100%', maxWidth: 1040 }}>
      <div style={{ textAlign: align, marginBottom: 32 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: W.text4,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
            color: W.text1,
          }}
        >
          {title}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, width: '100%', alignItems: 'stretch' }}>
        {TEAM.map((member, index) => {
          const isOnboarding = member.onboarding
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              style={{
                background: isOnboarding ? 'rgba(124,92,252,0.08)' : W.glass04,
                border: isOnboarding ? '1px dashed rgba(124,92,252,0.30)' : `1px solid ${W.glass06}`,
                borderRadius: 14,
                padding: '18px 18px 16px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 182,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <div style={{ paddingRight: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 4, lineHeight: 1.25 }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: W.text2, fontWeight: 600, lineHeight: 1.45 }}>{member.role}</div>
                </div>
                {isOnboarding && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: `${member.accent}20`,
                      border: `1px solid ${member.accent}40`,
                      padding: '3px 7px',
                      borderRadius: 5,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: member.accent }}
                    >
                      <Loader2 size={10} strokeWidth={3} />
                    </motion.div>
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: member.accent,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Pitching
                    </span>
                  </div>
                )}
              </div>

              <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.6, margin: 0 }}>
                {member.desc}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
