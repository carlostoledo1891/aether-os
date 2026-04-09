/**
 * Boundary DTOs for a future live telemetry feed.
 * Map adapters here → {@link PlantTelemetry} / {@link EnvTelemetry} before touching UI.
 * Base URLs: see `getWsUrl` in `src/config/env.ts`. API uses relative `/api/*` paths.
 */

/** Example wire shape; replace when backend contract is fixed */
export interface LiveTelemetryEnvelope {
  schema_version: string
  received_at: string
  plant?: Record<string, unknown>
  env?: Record<string, unknown>
}
