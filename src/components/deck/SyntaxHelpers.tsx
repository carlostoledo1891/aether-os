import type { ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

export function Kw({ children }: { children: ReactNode }) { return <span style={{ color: V }}>{children}</span> }
export function Str({ children }: { children: ReactNode }) { return <span style={{ color: W.green }}>{children}</span> }
export function Num({ children }: { children: ReactNode }) { return <span style={{ color: W.cyan }}>{children}</span> }
export function Cmt({ children }: { children: ReactNode }) { return <span style={{ color: W.text4 }}>{children}</span> }
export function Fn({ children }: { children: ReactNode }) { return <span style={{ color: W.amber }}>{children}</span> }
