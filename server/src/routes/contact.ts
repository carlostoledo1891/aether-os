import type { FastifyInstance } from 'fastify'
import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const LOG_PATH = resolve(process.cwd(), 'data', 'contact-requests.jsonl')

interface ContactPayload {
  name?: unknown
  email?: unknown
  message?: unknown
  source?: unknown
}

function asString(v: unknown, max = 4000): string {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, max)
}

function isLikelyEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function contactRoutes(app: FastifyInstance) {
  app.post<{ Body: ContactPayload }>('/api/contact', {
    config: {
      rateLimit: { max: 10, timeWindow: '1 minute' },
    },
    schema: {
      tags: ['contact'],
      summary: 'Submit a demo request',
      description: 'Accepts {name, email, message} from the marketing demo overlay and persists to a JSONL log.',
      body: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 200 },
          email: { type: 'string', minLength: 3, maxLength: 200 },
          message: { type: 'string', minLength: 1, maxLength: 4000 },
          source: { type: 'string', maxLength: 200 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
          },
        },
      },
    },
  }, async (req, reply) => {
    const body = (req.body ?? {}) as ContactPayload
    const name = asString(body.name, 200)
    const email = asString(body.email, 200)
    const message = asString(body.message, 4000)
    const source = asString(body.source, 200)

    if (!name || !email || !message) {
      reply.code(400)
      return { error: 'name, email, and message are required' }
    }
    if (!isLikelyEmail(email)) {
      reply.code(400)
      return { error: 'invalid email' }
    }

    const entry = {
      ts: new Date().toISOString(),
      name,
      email,
      message,
      source,
      ip: req.ip,
      userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : null,
    }

    try {
      await mkdir(dirname(LOG_PATH), { recursive: true })
      await appendFile(LOG_PATH, JSON.stringify(entry) + '\n', 'utf8')
    } catch (err) {
      app.log.error({ err }, 'failed to persist contact request')
    }

    app.log.info({ name, email, source }, 'demo request received')

    return { ok: true }
  })
}
