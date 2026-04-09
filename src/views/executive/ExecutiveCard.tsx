import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
type Glow = 'violet' | 'cyan' | 'green' | 'amber' | 'red' | 'none'

interface ExecutiveCardProps {
  children: ReactNode
  className?: string
  title?: string
  icon?: LucideIcon
  iconColor?: 'violet' | 'cyan' | 'green' | 'amber' | 'red'
  glow?: Glow
  /** Extra classes on header row */
  headerClassName?: string
}

export function ExecutiveCard({
  children,
  className = '',
  title,
  icon: Icon,
  iconColor = 'green',
  glow = 'none',
  headerClassName = '',
}: ExecutiveCardProps) {
  return (
    <GlassCard glow={glow} animate={false} className={`p-3 md:p-4 ${className}`}>
      {title ? (
        <div className={`mb-3 flex items-center gap-2 ${headerClassName}`}>
          {Icon ? <GlowingIcon icon={Icon} color={iconColor} size={14} /> : null}
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--w-text3)]">
            {title}
          </span>
        </div>
      ) : null}
      {children}
    </GlassCard>
  )
}
