import type { LithologySummary } from '../../services/dataService'

export const PILOT_PLANT_PERFORMANCE = {
  nameplate_kg_day: 2.0,
  peak_kg_day: 2.6,
  mrec_mreo_pct: 32.7,
  mrec_dytb_pct: 1.0,
  recoveries: [
    { element: 'Nd', pilot_pct: 70, ansto_pct: 70 },
    { element: 'Pr', pilot_pct: 71, ansto_pct: 71 },
    { element: 'Tb', pilot_pct: 61, ansto_pct: 57 },
    { element: 'Dy', pilot_pct: 56, ansto_pct: 49 },
  ],
  avg_magnet_recovery_pct: 70,
  status: 'Operational — providing samples to offtake partners for product qualification',
} as const

export const HARDWARE_SENSORS = [
  {
    category: 'Core Process Sensors',
    items: [
      { name: 'Ultrasonic Flow Meters', location: 'Clamped onto exterior of water intake/outflow pipes', measures: '95% water recirculation', frequency: '2s' },
      { name: 'Industrial pH & ORP Probes', location: 'Dropped directly into leaching vats', measures: 'pH 4.0–5.0 maintenance', frequency: '2s' },
      { name: 'Inline XRF Analyzers', location: 'MREC precipitation output', measures: '>90% TREO grade', frequency: 'Per batch' },
    ],
  },
  {
    category: 'Environmental & Regulator (MPF)',
    items: [
      { name: 'Ion-Selective Electrodes', location: 'Wastewater discharge', measures: 'Trace nitrates + sulfates', frequency: '10s' },
      { name: 'Telemetry Piezometers', location: 'Groundwater monitoring wells', measures: 'Hydrostatic pressure', frequency: '10s' },
      { name: 'Scintillation Detectors', location: 'UDC legacy site perimeter', measures: 'Gamma radiation (μSv/h)', frequency: '10s' },
    ],
  },
] as const

export const LITHOLOGY_SUMMARY: LithologySummary = {
  deposits: [
    { deposit: 'agostinho', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 14.5, total_holes: 121 },
    { deposit: 'soberbo', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.8, avg_saprolite_depth_m: 12.0, total_holes: 11 },
    { deposit: 'capao-do-mel', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.2, total_holes: 13 },
    { deposit: 'figueira', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 11.8, total_holes: 9 },
    { deposit: 'barra-do-pacu', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 14.0, total_holes: 6 },
    { deposit: 'cupim-vermelho-norte', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.3, avg_saprolite_depth_m: 15.1, total_holes: 5 },
    { deposit: 'cupim-vermelho-sul', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.8, total_holes: 5 },
    { deposit: 'dona-maria-1', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.7, avg_saprolite_depth_m: 12.4, total_holes: 7 },
    { deposit: 'dona-maria-2', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 14.2, total_holes: 4 },
    { deposit: 'cercado', dominant_lithology: 'fresh_phonolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 12.6, total_holes: 5 },
    { deposit: 'piao', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 13.5, total_holes: 5 },
    { deposit: 'coqueirinho', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.4, avg_saprolite_depth_m: 14.8, total_holes: 3 },
    { deposit: 'tamandua', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 13.0, total_holes: 3 },
    { deposit: 'fazenda-limoeiro', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.2, avg_saprolite_depth_m: 14.4, total_holes: 2 },
    { deposit: 'cipo', dominant_lithology: 'weathered_phonolite', avg_laterite_depth_m: 2.8, avg_saprolite_depth_m: 11.5, total_holes: 1 },
    { deposit: 'cipo-3', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.5, avg_saprolite_depth_m: 15.0, total_holes: 1 },
    { deposit: 'donana', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.0, avg_saprolite_depth_m: 12.8, total_holes: 1 },
    { deposit: 'pinheiro', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.1, avg_saprolite_depth_m: 13.6, total_holes: 1 },
    { deposit: 'pitangueira', dominant_lithology: 'saprolite', avg_laterite_depth_m: 2.9, avg_saprolite_depth_m: 12.2, total_holes: 1 },
    { deposit: 'tatu', dominant_lithology: 'saprolite', avg_laterite_depth_m: 3.3, avg_saprolite_depth_m: 14.0, total_holes: 1 },
  ],
  lithology_types: ['laterite', 'saprolite', 'weathered_phonolite', 'fresh_phonolite', 'tinguaite', 'nepheline_syenite', 'alluvium'],
  stratigraphy_note: 'Caldeira alkaline complex: laterite cap → saprolite → weathered phonolite → fresh phonolite/nepheline syenite. Tinguaite dykes intersect locally.',
}
