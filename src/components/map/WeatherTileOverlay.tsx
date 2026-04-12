/**
 * WeatherTileOverlay — renders OpenWeatherMap raster tiles on the MapLibre map.
 *
 * Layers: temperature, precipitation, wind, clouds, pressure.
 * Tiles served from tile.openweathermap.org (free tier, 1000 calls/day).
 */

import { useState, memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from './mapStacking'

const OWM_KEY = import.meta.env.VITE_OWM_KEY as string | undefined

export type WeatherLayerId =
  | 'temp_new'
  | 'precipitation_new'
  | 'wind_new'
  | 'clouds_new'
  | 'pressure_new'

interface WeatherLayerDef {
  id: WeatherLayerId
  label: string
  shortLabel: string
}

const WEATHER_LAYERS: WeatherLayerDef[] = [
  { id: 'temp_new',          label: 'Temperature',   shortLabel: 'Temp' },
  { id: 'precipitation_new', label: 'Precipitation', shortLabel: 'Precip' },
  { id: 'wind_new',          label: 'Wind Speed',    shortLabel: 'Wind' },
  { id: 'clouds_new',        label: 'Cloud Cover',   shortLabel: 'Clouds' },
  { id: 'pressure_new',      label: 'Pressure',      shortLabel: 'Press' },
]

function tileUrl(layer: WeatherLayerId): string {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`
}

interface WeatherTileOverlayProps {
  /** If true, show the floating layer picker UI */
  showPicker?: boolean
}

export const WeatherTileOverlay = memo(function WeatherTileOverlay({
  showPicker = true,
}: WeatherTileOverlayProps) {
  const [activeLayers, setActiveLayers] = useState<Set<WeatherLayerId>>(
    () => new Set(['temp_new']),
  )
  const [opacity, setOpacity] = useState(0.6)

  if (!OWM_KEY) return null

  const toggle = (id: WeatherLayerId) => {
    setActiveLayers(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      {WEATHER_LAYERS.map(layer =>
        activeLayers.has(layer.id) ? (
          <Source
            key={layer.id}
            id={`owm-${layer.id}`}
            type="raster"
            tiles={[tileUrl(layer.id)]}
            tileSize={256}
            attribution="© OpenWeatherMap"
          >
            <Layer
              id={`owm-layer-${layer.id}`}
              type="raster"
              paint={{ 'raster-opacity': opacity }}
            />
          </Source>
        ) : null,
      )}

      {showPicker && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 130,
            zIndex: Z.mapLayerPicker,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: W.mapControlBg,
            border: W.mapControlBorder,
            borderRadius: W.radius.sm,
            padding: 6,
            minWidth: 120,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: W.cyan,
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            Weather
          </div>

          {WEATHER_LAYERS.map(layer => {
            const active = activeLayers.has(layer.id)
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggle(layer.id)}
                aria-pressed={active}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 6px',
                  background: active ? `${W.cyan}18` : 'transparent',
                  border: active ? `1px solid ${W.cyan}35` : '1px solid transparent',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? W.cyan : W.text4,
                  fontFamily: 'var(--font-ui)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: active ? W.cyan : W.glass08,
                    flexShrink: 0,
                  }}
                />
                {layer.shortLabel}
              </button>
            )
          })}

          <div style={{ marginTop: 4 }}>
            <label
              style={{
                fontSize: 9,
                color: W.text4,
                fontFamily: 'var(--font-ui)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Opacity
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                style={{ width: 60, accentColor: W.cyan }}
              />
              <span style={{ minWidth: 24, textAlign: 'right' }}>
                {Math.round(opacity * 100)}%
              </span>
            </label>
          </div>
        </div>
      )}
    </>
  )
})
