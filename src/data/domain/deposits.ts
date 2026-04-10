export type DepositStatus = 'measured' | 'indicated' | 'inferred' | 'exploration'

export interface DepositRecord {
  id: string
  name: string
  status: DepositStatus
  treo_ppm: number
  mreo_pct: number
  tonnage_mt: number
  clay_depth_avg_m: number
  clay_depth_max_m: number
  area_km2: number
  dimensions: string
  orientation: string
  resource_note: string
  /** Center coordinates [lon, lat] for map fly-to */
  center: [number, number]
}

export const DEPOSIT_DATA: DepositRecord[] = [
  {
    id: 'capao-do-mel',
    name: 'Capão do Mel',
    status: 'measured',
    treo_ppm: 3034,
    mreo_pct: 24,
    tonnage_mt: 85,
    clay_depth_avg_m: 23.4,
    clay_depth_max_m: 50,
    area_km2: 9.9,
    dimensions: '2,600 × 3,800 m',
    orientation: 'NE-SW',
    resource_note: 'Total 85 Mt. High-grade core 36 Mt @ 4,345 ppm TREO. First mining area in PFS 20-yr plan.',
    center: [-46.565, -21.848],
  },
  {
    id: 'soberbo',
    name: 'Soberbo',
    status: 'indicated',
    treo_ppm: 2601,
    mreo_pct: 26,
    tonnage_mt: 229,
    clay_depth_avg_m: 16.9,
    clay_depth_max_m: 77.4,
    area_km2: 9.9,
    dimensions: '2,600 × 3,800 m',
    orientation: 'NE-SW',
    resource_note: 'Highest-grade hub: 229 Mt @ 2,601 ppm TREO. MREO above 24% project average. Shallow depth favourable for OpEx.',
    center: [-46.615, -21.882],
  },
  {
    id: 'figueira',
    name: 'Figueira',
    status: 'indicated',
    treo_ppm: 2480,
    mreo_pct: 23,
    tonnage_mt: 44,
    clay_depth_avg_m: 28.2,
    clay_depth_max_m: 62.5,
    area_km2: 3.1,
    dimensions: '2,600 × 1,200 m',
    orientation: 'N-S',
    resource_note: 'Included in 20-year mine plan. Updated resources improve DFS financial metrics.',
    center: [-46.590, -21.818],
  },
  {
    id: 'barra-do-pacu',
    name: 'Barra do Pacu',
    status: 'indicated',
    treo_ppm: 2204,
    mreo_pct: 22,
    tonnage_mt: 389,
    clay_depth_avg_m: 29.2,
    clay_depth_max_m: 50,
    area_km2: 7.6,
    dimensions: '1,900 × 4,000 m',
    orientation: 'N-S',
    resource_note: 'Maiden resource Apr 2025 (389 Mt total). Southern extension of Capão do Mel. High-grade subset: 32 Mt @ 4,130 ppm.',
    center: [-46.555, -21.878],
  },
  {
    id: 'agostinho',
    name: 'Agostinho',
    status: 'exploration',
    treo_ppm: 5200,
    mreo_pct: 30,
    tonnage_mt: 0,
    clay_depth_avg_m: 0,
    clay_depth_max_m: 24,
    area_km2: 5.0,
    dimensions: '~2,000 × 2,500 m',
    orientation: 'N-S',
    resource_note: '116 holes. Peak 19,183 ppm TREO. MREO up to 38% — highest in project. MRE pending.',
    center: [-46.520, -21.778],
  },
  {
    id: 'cupim-vermelho-norte',
    name: 'Cupim Vermelho Norte',
    status: 'inferred',
    treo_ppm: 2200,
    mreo_pct: 24,
    tonnage_mt: 340,
    clay_depth_avg_m: 20,
    clay_depth_max_m: 55,
    area_km2: 13.0,
    dimensions: '2,600 × 5,000 m',
    orientation: 'NW-SE',
    resource_note: 'Largest resource block by area. Part of 566 Mt northern resource @ 2,200 ppm TREO.',
    center: [-46.5855, -21.7229],
  },
  {
    id: 'dona-maria',
    name: 'Dona Maria 1 & 2',
    status: 'inferred',
    treo_ppm: 2100,
    mreo_pct: 23,
    tonnage_mt: 226,
    clay_depth_avg_m: 18,
    clay_depth_max_m: 45,
    area_km2: 2.4,
    dimensions: '500 × 4,800 m',
    orientation: 'E-W',
    resource_note: 'Narrow high-grade corridor. Part of 566 Mt northern resource. Near-term operations potential.',
    center: [-46.546, -21.7485],
  },
]

export const RESOURCE_CLASSIFICATION = {
  global_bt: 1.537,
  global_treo_ppm: 2359,
  measured_mt: 37,
  measured_treo_ppm: 2983,
  mi_mt: 666,
  mi_treo_ppm: 2685,
  inferred_mt: 834,
  mreo_avg_pct: 24,
  deposits_count: 7,
  drill_holes_total: 750,
} as const
