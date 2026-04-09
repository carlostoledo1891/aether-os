import type { FastifyInstance } from 'fastify'
import type { WebSocket } from '@fastify/websocket'
import type { TelemetryTick } from '../types/shared.js'

const MAX_WS_CLIENTS = parseInt(process.env.MAX_WS_CLIENTS ?? '100', 10)

const clients = new Set<WebSocket>()

export async function telemetryWsRoutes(app: FastifyInstance) {
  app.get('/ws/telemetry', { websocket: true }, (socket) => {
    if (clients.size >= MAX_WS_CLIENTS) {
      socket.close(1013, 'Max connections reached')
      return
    }
    clients.add(socket)
    socket.on('close', () => clients.delete(socket))
    socket.on('error', () => clients.delete(socket))
  })
}

export function broadcastTelemetry(tick: TelemetryTick) {
  const msg = JSON.stringify(tick)
  for (const client of clients) {
    if (client.readyState === 1) {
      try {
        client.send(msg)
      } catch {
        clients.delete(client)
      }
    }
  }
}
