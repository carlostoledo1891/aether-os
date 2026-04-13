/**
 * Server-side environment validation.
 * In production: refuses to boot if critical variables are missing.
 * In development: warns but continues.
 */

interface EnvSchema {
  PORT: number
  HOST: string
  NODE_ENV: string
  INGEST_API_KEY: string
  CHAT_API_KEY: string
  CORS_ORIGIN: string
  WS_API_KEY: string
  GOOGLE_GENERATIVE_AI_API_KEY: string
  ADMIN_API_KEY: string
  DB_PATH: string
}

interface ValidationResult {
  valid: boolean
  values: Partial<EnvSchema>
  errors: string[]
  warnings: string[]
}

const REQUIRED_IN_PRODUCTION: Array<keyof EnvSchema> = [
  'INGEST_API_KEY',
]

const RECOMMENDED: Array<[keyof EnvSchema, string]> = [
  ['CORS_ORIGIN', 'CORS will use restrictive defaults'],
  ['GOOGLE_GENERATIVE_AI_API_KEY', 'AI chat will return 501'],
  ['CHAT_API_KEY', 'Chat endpoint unprotected in production'],
  ['WS_API_KEY', 'WebSocket endpoint unprotected in production (falls back to INGEST_API_KEY)'],
]

export function validateServerEnv(): ValidationResult {
  const isProduction = process.env.NODE_ENV === 'production'
  const errors: string[] = []
  const warnings: string[] = []

  const values: Partial<EnvSchema> = {
    PORT: parseInt(process.env.PORT ?? '3001', 10),
    HOST: process.env.HOST ?? '0.0.0.0',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    INGEST_API_KEY: process.env.INGEST_API_KEY ?? '',
    CHAT_API_KEY: process.env.CHAT_API_KEY ?? '',
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? '',
    WS_API_KEY: process.env.WS_API_KEY ?? process.env.INGEST_API_KEY ?? '',
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
    ADMIN_API_KEY: process.env.ADMIN_API_KEY ?? '',
    DB_PATH: process.env.DB_PATH ?? '',
  }

  if (isNaN(values.PORT as number) || (values.PORT as number) < 1 || (values.PORT as number) > 65535) {
    errors.push(`PORT must be a valid port number (1-65535), got: ${process.env.PORT}`)
  }

  for (const key of REQUIRED_IN_PRODUCTION) {
    if (!process.env[key]) {
      if (isProduction) {
        errors.push(`${key} is required in production but not set`)
      } else {
        warnings.push(`${key} not set — required in production`)
      }
    }
  }

  for (const [key, hint] of RECOMMENDED) {
    if (!process.env[key]) {
      warnings.push(`${key} not set — ${hint}`)
    }
  }

  return {
    valid: errors.length === 0,
    values,
    errors,
    warnings,
  }
}

export function enforceEnvOrExit(): void {
  const result = validateServerEnv()

  for (const w of result.warnings) {
    console.warn(`⚠ [env] ${w}`)
  }

  if (!result.valid) {
    for (const e of result.errors) {
      console.error(`✗ [env] ${e}`)
    }
    console.error('\n[env] Server cannot start — fix the errors above.\n')
    process.exit(1)
  }

  if (result.warnings.length > 0) {
    console.log(`[env] ${result.warnings.length} warning(s) — see above. Continuing in ${result.values.NODE_ENV} mode.`)
  }
}
