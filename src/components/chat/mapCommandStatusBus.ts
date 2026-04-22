export interface MapCommandStatus {
  level: 'error' | 'info'
  message: string
  targetMapId?: string
}

type StatusHandler = (status: MapCommandStatus) => void

const handlers = new Set<StatusHandler>()

export const mapCommandStatusBus = {
  publish(status: MapCommandStatus) {
    for (const handler of handlers) handler(status)
  },

  subscribe(handler: StatusHandler) {
    handlers.add(handler)
    return () => { handlers.delete(handler) }
  },
}
