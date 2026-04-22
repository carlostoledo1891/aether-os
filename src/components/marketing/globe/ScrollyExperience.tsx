import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { W } from '../../../theme/publicTheme'
import { subscribeToProgress } from './globeBus'
import { useScrollDriver } from './useScrollDriver'
import { RequestDemoButton } from '../RequestDemo'

/**
 * Scroll-driven scrollytelling for the marketing globe.
 *
 * Architecture (Pudding / NYT / Mapbox-storytelling pattern):
 *
 *   <ScrollyExperience>
 *     ├── <Track ref> ─ a tall spacer that *creates* the scroll real
 *     │                 estate. Its height is the entire story.
 *     │   └── <Sticky panel> ─ stays pinned to the top of the
 *     │                        scroll viewport for the full track.
 *     │       └── one absolutely-positioned <Beat> per chapter,
 *     │             stacked in z; opacity driven by scroll progress.
 *     └── <FinalCoda> ─ "your visit hash" receipt, sits below the
 *                       track and gets normal scroll behaviour.
 *
 * The camera *is* the scrollbar:
 *   - useScrollDriver reads the container's scrollTop, eases it,
 *     and publishes progress 0..1.
 *   - cameraAt(t) (in cameraPath.ts) maps progress → camera state.
 *   - CameraDriver subscribes and calls map.jumpTo() per frame.
 *   - Each beat panel subscribes to the same progress channel and
 *     fades in/out within its declared range — direct DOM writes,
 *     no React re-renders per frame.
 */

interface Beat {
  id: string
  /** [start, end] in scroll progress space, 0..1. */
  range: [number, number]
  /** Soft fade window (in scroll-progress units) at each end. */
  fade?: number
  align: 'left' | 'right' | 'center'
  hero?: boolean
  eyebrow: string
  headline: ReactNode
  body: ReactNode
  cta?: 'demo' | 'see'
}

/**
 * Total scroll height of the story track, in viewport heights. Spreads the
 * six beats across more pixels so the camera moves slowly per scroll tick
 * and the cross-fades have room to breathe. Bump this for a slower read.
 */
const TRACK_VH = 880

const BEATS: Beat[] = [
  {
    id: 'thesis',
    range: [0.00, 0.18],
    fade: 0.06,
    align: 'left',
    hero: true,
    eyebrow: 'thesis',
    headline: (
      <>
        The field is where{' '}
        <em style={{ color: '#7C5CFC', fontStyle: 'normal' }}>evidence dies.</em>
      </>
    ),
    body: (
      <>
        Every regulated industry depends on what happens in the field —
        and almost none of it survives the trip back to head office
        unchanged. We rebuilt the trip.
      </>
    ),
    cta: 'demo',
  },
  {
    id: 'pulse',
    range: [0.18, 0.32],
    fade: 0.05,
    align: 'left',
    eyebrow: 'act i · the pulse',
    headline: <>Every motion is a witnessed event.</>,
    body: (
      <>
        Each pin you see is an asset, sensor or alert under continuous
        attestation. Vehicles sign by their device, sensors by their
        firmware, operators by their key.
      </>
    ),
  },
  {
    id: 'chain',
    range: [0.32, 0.46],
    fade: 0.05,
    align: 'left',
    eyebrow: 'act ii · the chain',
    headline: <>Each trail is a SHA-chain block.</>,
    body: (
      <>
        Pull back. The trails accumulate into the operations chain —
        every block linked to the last by signed hash. Click any chip
        on the right rail to see the receipt.
      </>
    ),
  },
  {
    id: 'transit',
    range: [0.46, 0.62],
    fade: 0.07,
    align: 'center',
    eyebrow: 'act iii · cross-tenant',
    headline: <>One ledger. Crosses oceans.</>,
    body: (
      <>
        The chain doesn&apos;t care about borders. The same witness
        model holds in New York, Pará, anywhere a tenant operates.
      </>
    ),
  },
  {
    id: 'caldeira',
    range: [0.62, 0.82],
    fade: 0.06,
    align: 'left',
    eyebrow: 'act iv · the field',
    headline: <>Same ledger. Different field.</>,
    body: (
      <>
        Caldeira, Pará. Sixteen drillholes, three spring sensors, two
        active turbidity alerts. Different geography, identical chain
        — because the witness model is the field, not the city.
      </>
    ),
  },
  {
    id: 'promise',
    range: [0.82, 1.00],
    fade: 0.07,
    align: 'left',
    eyebrow: 'act v · the promise',
    headline: (
      <>
        Vero. The truth layer<br />for regulated industries.
      </>
    ),
    body: (
      <>
        One signed chain per tenant. One operator per witness. One
        cryptographic memory of what the field actually did.
      </>
    ),
    cta: 'demo',
  },
]

export function ScrollyExperience() {
  const trackRef = useRef<HTMLDivElement>(null)

  useScrollDriver({ trackRef })

  return (
    <>
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: `${TRACK_VH}vh`,
          width: '100%',
          // No background — the globe shows through.
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {BEATS.map((beat) => (
            <BeatPanel key={beat.id} beat={beat} />
          ))}
        </div>
      </div>
      <FinalCoda />
    </>
  )
}

/**
 * One scroll-keyed text panel. Mounts once; its opacity + transform
 * are written directly to the DOM by a progress subscription, never
 * via React state. This keeps the per-frame work to two `.style`
 * assignments and zero reconciliation.
 */
function BeatPanel({ beat }: { beat: Beat }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const [a, b] = beat.range
    const fade = beat.fade ?? 0.04
    const apply = (t: number) => {
      let opacity = 0
      let lift = 18
      if (t >= a - fade && t <= b + fade) {
        const u = (t - a) / (b - a)
        // In/out fade windows are in scroll-progress units, normalised
        // to the beat's own range.
        const window = fade / (b - a)
        if (u < 0) opacity = Math.max(0, 1 + u / window)
        else if (u > 1) opacity = Math.max(0, 1 - (u - 1) / window)
        else if (u < window) opacity = u / window
        else if (u > 1 - window) opacity = (1 - u) / window
        else opacity = 1
        // Subtle lift while content settles in (off-screen → 0).
        lift = (1 - opacity) * 18
      }
      el.style.opacity = String(opacity)
      el.style.transform = `translateY(${lift}px)`
      el.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none'
      el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden'
    }
    apply(0) // initial paint
    return subscribeToProgress(apply)
  }, [beat])

  const align = beat.align
  const justify =
    align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end'

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: justify,
        padding: '120px 56px 200px',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={wrapRef}
        style={{
          ...panelStyle(align, beat.hero ?? false),
          willChange: 'opacity, transform',
          opacity: 0,
          transform: 'translateY(18px)',
        }}
      >
        <div style={eyebrowStyle}>{beat.eyebrow}</div>
        <h2 style={headlineStyle}>{beat.headline}</h2>
        <p style={bodyStyle}>{beat.body}</p>
        {beat.cta === 'demo' && (
          <div style={{ marginTop: 22 }}>
            <RequestDemoButton size="lg" label="Request a demo" />
          </div>
        )}
      </div>
    </div>
  )
}

function panelStyle(align: Beat['align'], hero: boolean): CSSProperties {
  if (hero) {
    return {
      width: 'min(720px, 100%)',
      padding: '8px 0',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      textAlign: align === 'center' ? 'center' : 'left',
    }
  }
  return {
    width: 'min(560px, 100%)',
    padding: '28px 32px',
    borderRadius: 18,
    border: `1px solid ${W.glass08}`,
    background: 'rgba(8, 11, 22, 0.55)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
    textAlign: align === 'center' ? 'center' : 'left',
  }
}

const eyebrowStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.18em',
  color: W.text4,
  textTransform: 'uppercase',
  marginBottom: 14,
  fontFamily: 'var(--font-mono)',
}

const headlineStyle: CSSProperties = {
  fontSize: 'clamp(36px, 5.2vw, 68px)',
  fontWeight: 800,
  lineHeight: 1.04,
  margin: 0,
  color: W.text1,
  letterSpacing: '-0.015em',
}

const bodyStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: W.text3,
  marginTop: 16,
  maxWidth: 480,
}

// ─── Coda ─────────────────────────────────────────────────────────────────

function FinalCoda() {
  const visitHash =
    typeof window !== 'undefined'
      ? makeVisitHash()
      : '0000000000000000000000000000000000000000000000000000000000000000'

  return (
    <section
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '80px 56px 220px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          ...panelStyle('left', false),
          width: 'min(620px, 100%)',
          background: 'rgba(8, 11, 22, 0.6)',
        }}
      >
        <div style={eyebrowStyle}>your visit · receipt</div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: W.text2,
            wordBreak: 'break-all',
            lineHeight: 1.6,
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${W.glass08}`,
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 16,
          }}
        >
          0x{visitHash}
        </div>
        <p style={{ ...bodyStyle, textAlign: 'left', maxWidth: 'none' }}>
          We hashed your visit the same way Vero hashes a field event —
          deterministic, signed, replayable. Want one for your fleet?
        </p>
        <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <RequestDemoButton size="lg" />
        </div>
      </div>
    </section>
  )
}

let cachedVisitHash: string | null = null
function makeVisitHash(): string {
  if (cachedVisitHash) return cachedVisitHash
  const seed = `${navigator.userAgent}|${Date.now()}|${Math.random()}`
  let h = 0xcbf29ce484222325n
  const PRIME = 0x100000001b3n
  for (let i = 0; i < seed.length; i++) {
    h ^= BigInt(seed.charCodeAt(i))
    h = BigInt.asUintN(64, h * PRIME)
  }
  const mix = (salt: string) => {
    let s = h
    for (let i = 0; i < salt.length; i++) {
      s ^= BigInt(salt.charCodeAt(i))
      s = BigInt.asUintN(64, s * PRIME)
    }
    return s.toString(16).padStart(16, '0')
  }
  cachedVisitHash = mix(':a') + mix(':b') + mix(':c') + mix(':d')
  return cachedVisitHash
}
