import { motion } from 'motion/react'
import { W } from '../../app/canvas/canvasTheme'
import type { LucideIcon } from 'lucide-react'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon: LucideIcon
  color: string
}

export type TabSwitcherLayout = 'compact' | 'scroll'

interface TabSwitcherProps<T extends string> {
  items: readonly TabItem<T>[]
  active: T
  onSelect: (id: T) => void
  layoutId: string
  /** compact: equal-width tabs (Field). scroll: horizontal scroll, no flex squeeze (Executive). */
  layout?: TabSwitcherLayout
}

export function TabSwitcher<T extends string>({
  items, active, onSelect, layoutId, layout = 'compact',
}: TabSwitcherProps<T>) {
  const scroll = layout === 'scroll'
  const iconSize = scroll ? 12 : 10
  const fontSize = scroll ? 11 : 9
  const padY = scroll ? 8 : 5
  const padX = scroll ? 12 : 8

  return (
    <div
      role="tablist"
      className={scroll ? 'flex max-w-full flex-nowrap gap-0.5 overflow-x-auto overflow-y-hidden py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''}
      style={{
        display: 'flex',
        background: W.glass04,
        border: `1px solid ${W.glass07}`,
        borderRadius: W.radius.md,
        padding: 3,
        gap: scroll ? 4 : 2,
        ...(scroll ? { width: '100%' } : {}),
      }}
    >
      {items.map(({ id, label, icon: Icon, color }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={label}
            onClick={() => onSelect(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: `${padY}px ${padX}px`,
              borderRadius: W.radius.sm,
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              outline: 'none',
              background: 'transparent',
              transition: 'background 0.2s',
              minWidth: 0,
              flex: scroll ? '0 0 auto' : 1,
              flexShrink: scroll ? 0 : undefined,
            }}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: W.radius.sm,
                  background: `linear-gradient(135deg, ${color}22, ${color}0F)`,
                  border: `1px solid ${color}35`,
                  boxShadow: `0 0 8px ${color}18`,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <Icon
              size={iconSize}
              style={{
                color: isActive ? color : W.text4,
                filter: isActive ? `drop-shadow(0 0 3px ${color}80)` : undefined,
                zIndex: 1,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize,
                fontWeight: 600,
                zIndex: 1,
                color: isActive ? W.text1 : W.text4,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
