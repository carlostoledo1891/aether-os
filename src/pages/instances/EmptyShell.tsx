/**
 * EmptyShell — what /app renders when no use case has been picked.
 *
 * Composition: chrome strip + MapBase (global view) + a centred GlassCard
 * "Pick a use case" picker. No new design primitives, no new component
 * primitives — every visual element is a composition of pieces that
 * already exist in the codebase.
 *
 * Sprint plan reference: w1_empty_shell todo.
 */

import { useNavigate } from 'react-router-dom'
import { MapBase } from '../../components/map/MapBase'
import { GlassCard } from '../../components/ui/GlassCard'
import { useInstance } from '../../contexts/InstanceContext'
import { rememberInstance, SELECTABLE_INSTANCES } from '../../config/instances'
import type { InstanceConfig } from '../../config/instances'
import { InstanceShellChrome } from './InstanceShellChrome'

export default function EmptyShellPage() {
  const instance = useInstance()
  const navigate = useNavigate()

  const handlePick = (target: InstanceConfig) => {
    rememberInstance(target.slug)
    navigate(`/app/${target.slug}`)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--w-bg)',
      }}
    >
      <MapBase
        id="veroEmptyShell"
        initialViewState={{
          longitude: instance.cameraPreset.longitude,
          latitude: instance.cameraPreset.latitude,
          zoom: instance.cameraPreset.zoom,
          pitch: instance.cameraPreset.pitch,
          bearing: instance.cameraPreset.bearing,
        }}
        interactive={false}
        disableZoomControls
        hideControls
        containerStyle={{ top: 0, bottom: 0, left: 0, right: 0 }}
      />

      <InstanceShellChrome instance={instance} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          pointerEvents: 'none',
        }}
      >
        <GlassCard
          glow="violet"
          animate={false}
          style={{
            pointerEvents: 'auto',
            width: 'min(880px, 100%)',
            padding: '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--w-violet-soft)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Vero · multi-instance shell
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--w-text1)',
                letterSpacing: '-0.01em',
              }}
            >
              Pick a use case
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--w-text3)',
                maxWidth: 620,
              }}
            >
              One Vero runtime, two live instances. Each instance is a separate
              workspace — same chrome, same audit chain, same public verifier.
              The empty shell you're looking at is the canonical "no data"
              state of the platform.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {SELECTABLE_INSTANCES.map(card => (
              <GlassCard
                key={card.slug}
                onClick={() => handlePick(card)}
                glow="violet"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'var(--w-violet-subtle)',
                      color: 'var(--w-violet-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {card.glyph ?? '·'}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--w-text4)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {card.pickerCard.eyebrow}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--w-text1)',
                  }}
                >
                  {card.pickerCard.title}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: 'var(--w-text3)',
                    flex: 1,
                  }}
                >
                  {card.pickerCard.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--w-text4)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {card.pickerCard.tenant}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--w-violet-soft)',
                    }}
                  >
                    {card.pickerCard.ctaLabel} →
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              color: 'var(--w-text4)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              borderTop: '1px solid var(--w-border2)',
              paddingTop: 14,
            }}
          >
            All instances share a single audit chain. Bundles published from
            either instance verify at the same /verify/&lt;hash&gt; URL.
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
