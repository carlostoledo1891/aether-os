import { MapBase } from '../../components/map/MapBase'
import { EXPERIENCE_MAP_PRESETS } from './mapPresets'
import type { ExperienceScene } from '../types'

interface OptionalMapLayerProps {
  scene: ExperienceScene
}

export function OptionalMapLayer({ scene }: OptionalMapLayerProps) {
  const mapConfig = scene.map

  if (!mapConfig?.enabled) {
    return null
  }

  const initialViewState = EXPERIENCE_MAP_PRESETS[mapConfig.preset ?? 'caldeira-default']
  const dimOpacity = mapConfig.dimOpacity ?? 0

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <MapBase
        id={`experience-${scene.id}`}
        initialViewState={initialViewState}
        interactive={mapConfig.interactive ?? false}
        disableZoomControls={!mapConfig.interactive}
        hideControls={!mapConfig.interactive}
        containerStyle={{ position: 'absolute', inset: 0 }}
        forceStyle="satellite"
      />
      {(dimOpacity > 0 || mapConfig.scrim) && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: mapConfig.scrim ?? `rgba(4, 8, 20, ${dimOpacity})`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
