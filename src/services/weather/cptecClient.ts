/**
 * CPTEC/INPE municipal forecast via BrasilAPI (CORS-friendly proxy).
 *
 * CPTEC (Centro de Previsão de Tempo e Estudos Climáticos) is Brazil's
 * official weather forecasting centre, run by INPE.  BrasilAPI wraps
 * CPTEC's XML endpoints into a clean JSON API with CORS headers.
 *
 * Poços de Caldas city code on CPTEC's system = 4685.
 */

const BRASIL_API = 'https://brasilapi.com.br/api/cptec/v1'
const POCOS_CITY_CODE = 4685
const FORECAST_DAYS = 6

export interface CptecDayForecast {
  /** ISO date string yyyy-MM-dd */
  date: string
  /** Weather condition (e.g. "pn" = partly cloudy, "c" = rain) */
  condition: string
  conditionDesc: string
  tempMin: number
  tempMax: number
  /** UV index (0-14+) */
  uvIndex: number
}

export interface CptecForecast {
  city: string
  state: string
  updatedAt: string
  days: CptecDayForecast[]
}

const CONDITION_MAP: Record<string, string> = {
  ec: 'Encoberto com chuvas isoladas',
  ci: 'Chuvas isoladas',
  c:  'Chuva',
  in: 'Instável',
  pp: 'Possibilidade de pancadas de chuva',
  cm: 'Chuva pela manhã',
  cn: 'Chuva à noite',
  pt: 'Pancadas de chuva à tarde',
  pm: 'Pancadas de chuva pela manhã',
  np: 'Nublado com pancadas',
  pc: 'Pancadas de chuva',
  pn: 'Parcialmente nublado',
  cv: 'Chuvisco',
  ch: 'Chuvoso',
  t:  'Tempestade',
  ps: 'Predomínio de sol',
  e:  'Encoberto',
  n:  'Nublado',
  cl: 'Céu claro',
  nv: 'Nevoeiro',
  g:  'Geada',
  ne: 'Neve',
  nd: 'Não definido',
  pnt: 'Pancadas de chuva à noite',
  psc: 'Possibilidade de chuva',
  pcm: 'Possibilidade de chuva pela manhã',
  pct: 'Possibilidade de chuva à tarde',
  pcn: 'Possibilidade de chuva à noite',
  npt: 'Nublado com pancadas à tarde',
  npn: 'Nublado com pancadas à noite',
  ncn: 'Nublado com possibilidade de chuva à noite',
  nct: 'Nublado com possibilidade de chuva à tarde',
  ncm: 'Nublado com possibilidade de chuva pela manhã',
  npm: 'Nublado com pancadas pela manhã',
  npp: 'Nublado com possibilidade de pancadas',
  vn:  'Variação de nebulosidade',
  ct:  'Chuva à tarde',
  ppn: 'Possibilidade de pancadas à noite',
  ppm: 'Possibilidade de pancadas pela manhã',
  ppt: 'Possibilidade de pancadas à tarde',
}

function describeCondition(code: string): string {
  return CONDITION_MAP[code.toLowerCase()] ?? code
}

export async function fetchCptecForecast(
  cityCode = POCOS_CITY_CODE,
  days = FORECAST_DAYS,
): Promise<CptecForecast> {
  const url = `${BRASIL_API}/clima/previsao/${cityCode}/${days}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CPTEC ${res.status}: ${res.statusText}`)

  const json = await res.json()

  return {
    city: json.cidade ?? 'Poços de Caldas',
    state: json.estado ?? 'MG',
    updatedAt: json.atualizado_em ?? new Date().toISOString(),
    days: (json.clima ?? []).map((d: Record<string, unknown>) => ({
      date: d.data as string,
      condition: (d.condicao as string) ?? 'nd',
      conditionDesc: describeCondition((d.condicao_desc as string) ?? (d.condicao as string) ?? 'nd'),
      tempMin: Number(d.min) || 0,
      tempMax: Number(d.max) || 0,
      uvIndex: Number(d.indice_uv) || 0,
    })),
  }
}
