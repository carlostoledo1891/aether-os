/**
 * mapCommandBus — module-scoped event emitter that bridges AI tool results
 * to map state.  Same subscribe/emit pattern as sharedLayerStore.
 */
import type { MapCommand } from './mapActionTypes'

export interface MapCommandDispatchMeta {
  targetMapId?: string
  source?: 'chat' | 'ui'
}

export interface MapCommandEnvelope extends MapCommandDispatchMeta {
  command: MapCommand
}

type CommandHandler = (dispatch: MapCommandEnvelope) => void

const handlers = new Set<CommandHandler>()

function normalizeDispatch(
  commandOrEnvelope: MapCommand | MapCommandEnvelope,
  meta?: MapCommandDispatchMeta,
): MapCommandEnvelope {
  if ('command' in commandOrEnvelope) return commandOrEnvelope
  return { command: commandOrEnvelope, ...meta }
}

export const mapCommandBus = {
  dispatch(commandOrEnvelope: MapCommand | MapCommandEnvelope, meta?: MapCommandDispatchMeta) {
    const dispatch = normalizeDispatch(commandOrEnvelope, meta)
    for (const handler of handlers) handler(dispatch)
  },

  subscribe(handler: CommandHandler) {
    handlers.add(handler)
    return () => { handlers.delete(handler) }
  },
}
