import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { GlowingIcon } from './GlowingIcon'
import { SectionLabel } from './SectionLabel'

/** Matches accent keys accepted by `GlowingIcon` (theme-derived strokes). */
export type SectionBlockIconColor = 'violet' | 'cyan' | 'green' | 'amber' | 'red' | 'text2'

export interface SectionBlockProps {
  icon?: LucideIcon
  iconColor?: SectionBlockIconColor
  label: string
  rightSlot?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionBlock({
  icon,
  iconColor = 'violet',
  label,
  rightSlot,
  children,
  className,
}: SectionBlockProps) {
  return (
    <div className={className}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minWidth: 0,
          }}
        >
          {icon ? <GlowingIcon icon={icon} color={iconColor} size={11} /> : null}
          <SectionLabel>{label}</SectionLabel>
        </div>
        {rightSlot}
      </div>
      {children}
    </div>
  )
}
