import type { FastifyInstance } from 'fastify'
import type { WebSocket } from '@fastify/websocket'
import type { TelemetryTick } from '../types/shared.js'

const MAX_WS_CLIENTS = parseInt(process.env.MAX_WS_CLIENTS ?? '100', 10)
const WS_API_KEY = process.env.WS_API_KEY || process.env.INGEST_API_KEY || ''
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const clients = new Set<WebSocket>()

export async function telemetryWsRoutes(app: FastifyInstance) {
  app.get('/ws/telemetry', { websocket: true }, (socket, req) => {
    if (IS_PRODUCTION && WS_API_KEY) {
      const url = new URL(req.url ?? '', `http://${req.headers.host}`)
      const token = url.searchParams.get('token') ?? req.headers['x-api-key'] as string | undefined
      if (token !== WS_API_KEY) {
        socket.close(4401, 'Unauthorized — invalid or missing token')
        return
      }
    }

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
