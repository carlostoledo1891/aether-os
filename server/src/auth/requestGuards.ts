import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { appendAuditEvent } from '../store/auditChain.js'

function validateApiKey(
  req: FastifyRequest,
  reply: FastifyReply,
  expectedKey: string,
  action: 'ingest_auth_rejected' | 'chat_auth_rejected',
) {
  const key = req.headers['x-api-key']
  if (key !== expectedKey) {
    try {
      appendAuditEvent({
        event_id: `auth-fail-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'auth_failure',
        actor: req.ip ?? 'unknown',
        action,
        detail: `Failed auth on ${req.method} ${req.url}`,
      })
    } catch {
      // best-effort
    }
    return reply.code(401).send({ error: 'Invalid or missing API key' })
  }
}

export function registerRequestGuards(app: FastifyInstance) {
  app.addHook('onRequest', async (req, reply) => {
    const isProduction = process.env.NODE_ENV === 'production'
    const ingestApiKey = process.env.INGEST_API_KEY ?? ''
    const chatApiKey = process.env.CHAT_API_KEY ?? ''

    if (req.url.startsWith('/ingest/')) {
      if (!ingestApiKey) {
        if (isProduction) {
          return reply.code(503).send({ error: 'Ingest disabled — INGEST_API_KEY not configured' })
        }
        return
      }
      return validateApiKey(req, reply, ingestApiKey, 'ingest_auth_rejected')
    }

    if (req.url.startsWith('/api/chat')) {
      if (!chatApiKey) {
        if (isProduction) {
          return reply.code(503).send({ error: 'Chat auth disabled — CHAT_API_KEY not configured' })
        }
        return
      }
      return validateApiKey(req, reply, chatApiKey, 'chat_auth_rejected')
    }
  })
}
