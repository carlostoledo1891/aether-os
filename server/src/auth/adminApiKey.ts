interface AdminKeyRequest {
  headers: Record<string, string | undefined>
}

interface AdminKeyReply {
  code: (statusCode: number) => { send: (payload: unknown) => unknown }
}

export function requireAdminKey(req: AdminKeyRequest, reply: AdminKeyReply): boolean {
  const key = process.env.ADMIN_API_KEY || process.env.INGEST_API_KEY || ''
  const isProduction = process.env.NODE_ENV === 'production'
  if (!key) {
    if (isProduction) {
      reply.code(503).send({ error: 'Admin API disabled — ADMIN_API_KEY not configured' })
      return false
    }
    return true
  }
  if (req.headers['x-api-key'] !== key) {
    reply.code(401).send({ error: 'Unauthorized' })
    return false
  }
  return true
}
