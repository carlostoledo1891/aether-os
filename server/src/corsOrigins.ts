const DEFAULT_LOCAL_ORIGINS = ['http://localhost:5175', 'http://localhost:5173'] as const
const DEFAULT_PRODUCTION_ORIGINS = ['https://verochain.co', 'https://www.verochain.co'] as const

export function parseCorsOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function unique(origins: readonly string[]): string[] {
  return Array.from(new Set(origins))
}

export function resolveCorsOrigins(opts: {
  isProduction: boolean
  allowLocalhostInProduction: boolean
  configuredOrigins?: string
}): string | string[] {
  const configured = parseCorsOrigins(opts.configuredOrigins)

  if (opts.isProduction) {
    const productionOrigins = unique([
      ...DEFAULT_PRODUCTION_ORIGINS,
      ...configured,
      ...(opts.allowLocalhostInProduction ? DEFAULT_LOCAL_ORIGINS : []),
    ])
    return productionOrigins
  }

  return configured.length > 0 ? unique(configured) : '*'
}

export function getDefaultProductionOrigins(): readonly string[] {
  return DEFAULT_PRODUCTION_ORIGINS
}
