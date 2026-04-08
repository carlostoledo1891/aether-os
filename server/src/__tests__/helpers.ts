import { buildApp } from '../index.js'
import type { FastifyInstance } from 'fastify'

export async function createTestApp(): Promise<FastifyInstance> {
  const app = await buildApp({ logger: false })
  await app.ready()
  return app
}
