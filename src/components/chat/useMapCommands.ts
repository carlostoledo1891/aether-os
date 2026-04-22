import { useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { sharedLayerStore } from '../map/sharedLayerStore'
import type { FieldOpsMapLayers, FieldEnvMapLayers } from '../map/sharedLayerStore'
import { mapCommandBus } from './mapCommandBus'
import { mapCommandStatusBus } from './mapCommandStatusBus'
import { LAYER_TO_STORE_KEY, NAMED_BOOKMARKS } from './mapActionTypes'
import type { MapCommand } from './mapActionTypes'

interface UseMapCommandsOptions {
  mapId?: string
  onHighlight?: (featureId: string | null) => void
  onSetLayerVisibility?: (layerId: string, visible: boolean) => boolean | void
  onCommandError?: (message: string) => void
}

/**
 * Subscribes to mapCommandBus and wires each command to the real map state:
 * - toggleLayer  -> sharedLayerStore
 * - flyTo        -> map.flyTo()
 * - fitBounds    -> map.fitBounds()
 * - highlight    -> onHighlight callback
 * - clearHighlight -> onHighlight(null)
 */
export function useMapCommands({
  mapId = 'aetherField',
  onHighlight,
  onSetLayerVisibility,
  onCommandError,
}: UseMapCommandsOptions = {}) {
  const maps = useMap()

  useEffect(() => {
    const reportCommandError = (message: string) => {
      onCommandError?.(message)
      mapCommandStatusBus.publish({ level: 'error', message, targetMapId: mapId })
    }

    const getMap = () => {
      const ref = maps[mapId as keyof typeof maps] ?? maps.current
      if (!ref) return null
      return (ref as unknown as { getMap(): unknown }).getMap() as {
        flyTo: (opts: Record<string, unknown>) => void
        fitBounds: (bbox: [[number, number], [number, number]], opts: Record<string, unknown>) => void
        getPitch: () => number
        getBearing: () => number
      } | null
    }

    const unsubscribe = mapCommandBus.subscribe(({ command, targetMapId }) => {
      if (targetMapId && targetMapId !== mapId) return
      const cmd: MapCommand = command

      try {
        switch (cmd.type) {
          case 'toggleLayer': {
            if (onSetLayerVisibility) {
              const handled = onSetLayerVisibility(cmd.layerId, cmd.visible)
              if (handled !== false) break
            }
            const mapping = LAYER_TO_STORE_KEY[cmd.layerId]
            if (!mapping) {
              reportCommandError(`Layer "${cmd.layerId}" is not available in the active workspace view.`)
              break
            }
            if (mapping.store === 'ops') {
              sharedLayerStore.setOps(prev => ({
                ...prev,
                [mapping.key]: cmd.visible,
              } as FieldOpsMapLayers))
            } else {
              sharedLayerStore.setEnv(prev => ({
                ...prev,
                [mapping.key]: cmd.visible,
              } as FieldEnvMapLayers))
            }
            break
          }

          case 'flyTo': {
            const map = getMap()
            if (!map) {
              reportCommandError('The active workspace map is not ready yet.')
              break
            }
            map.flyTo({
              center: [cmd.center.lng, cmd.center.lat],
              zoom: cmd.zoom,
              pitch: cmd.pitch ?? map.getPitch(),
              bearing: cmd.bearing ?? map.getBearing(),
              duration: 1800,
              essential: true,
            })
            break
          }

          case 'bookmark': {
            const bookmark = NAMED_BOOKMARKS[cmd.bookmarkId]
            if (!bookmark) {
              reportCommandError(`Bookmark "${cmd.bookmarkId}" is not available.`)
              break
            }
            const map = getMap()
            if (!map) {
              reportCommandError('The active workspace map is not ready yet.')
              break
            }
            map.flyTo({
              center: [bookmark.center.lng, bookmark.center.lat],
              zoom: bookmark.zoom,
              pitch: bookmark.pitch,
              bearing: map.getBearing(),
              duration: 1800,
              essential: true,
            })
            break
          }

          case 'fitBounds': {
            const map = getMap()
            if (!map) {
              reportCommandError('The active workspace map is not ready yet.')
              break
            }
            map.fitBounds(
              [[cmd.bbox.west, cmd.bbox.south], [cmd.bbox.east, cmd.bbox.north]],
              { padding: 60, duration: 1800 },
            )
            break
          }

          case 'highlight':
            onHighlight?.(cmd.featureId)
            break

          case 'clearHighlight':
            onHighlight?.(null)
            break
        }
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : 'The map command could not be completed.'
        reportCommandError(message)
      }
    })

    return unsubscribe
  }, [maps, mapId, onCommandError, onHighlight, onSetLayerVisibility])
}
