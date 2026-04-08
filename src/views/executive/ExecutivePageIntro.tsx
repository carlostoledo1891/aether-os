import type { ReactNode } from 'react'
import { MutedCaption } from '../../components/ui/MutedCaption'
import { HairlineDivider } from '../../components/ui/HairlineDivider'

/** Disclaimer / helper block at top of executive tabs. */
export function ExecutivePageIntro({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <MutedCaption style={{ fontSize: 11, lineHeight: 1.5 }}>{children}</MutedCaption>
      <HairlineDivider />
    </div>
  )
}
