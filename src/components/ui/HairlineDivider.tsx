import { W } from '../../app/canvas/canvasTheme'

interface HairlineDividerProps {
  vertical?: boolean
}

/** 1px separator using border token — horizontal by default. */
export function HairlineDivider({ vertical }: HairlineDividerProps) {
  if (vertical) {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: 1,
          alignSelf: 'stretch',
          background: W.border2,
          flexShrink: 0,
        }}
      />
    )
  }
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      style={{
        width: '100%',
        height: 1,
        background: W.border2,
        flexShrink: 0,
      }}
    />
  )
}
