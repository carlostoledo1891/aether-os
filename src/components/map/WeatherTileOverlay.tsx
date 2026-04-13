/**
 * WeatherTileOverlay — renders OpenWeatherMap raster tiles on the MapLibre map.
 *
 * Layers: temperature, precipitation, wind, clouds, pressure.
 * Tiles served from tile.openweathermap.org (free tier, 1000 calls/day).
 *
 * The embedded picker UI has been removed; weather sub-layer toggles are
 * now managed by the unified MapLayerPanel. This component only mounts
 * the raster sources/layers for the active set.
 */

import { useState, memo } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

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

export const WEATHER_LAYERS: WeatherLayerDef[] = [
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
  /** Opacity 0–1 for all active weather raster layers. */
  opacity?: number
  /** Externally-controlled set of active OWM layer IDs. Falls back to temp_new. */
  activeWeatherLayers?: Set<WeatherLayerId>
}

export const WeatherTileOverlay = memo(function WeatherTileOverlay({
  opacity: externalOpacity,
  activeWeatherLayers,
}: WeatherTileOverlayProps) {
  const [internalLayers] = useState<Set<WeatherLayerId>>(
    () => new Set(['temp_new']),
  )

  const activeLayers = activeWeatherLayers ?? internalLayers
  const opacity = externalOpacity ?? 0.6

  if (!OWM_KEY) return null

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
    </>
  )
})
