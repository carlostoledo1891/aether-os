import type { ScenarioKey, FinancialScenario, SensitivityPoint } from '../../services/dataService'

export const PROJECT_FINANCIALS = {
  npv_pretax_consensus_m: 821,
  npv_pretax_forecast_m: 1985,
  npv_posttax_consensus_m: 488,
  npv_posttax_forecast_m: 1256,
  irr_pretax_consensus_pct: 28,
  irr_pretax_forecast_pct: 39,
  irr_posttax_consensus_pct: 21,
  irr_posttax_forecast_pct: 31,
  capex_m: 443,
  payback_yrs: 3,
  lom_fcf_m: 2000,
  opex_per_kg: 8.91,
  ndpr_opex: 22,
  annual_treo_t: 13584,
  annual_ndpr_t: 4228,
  annual_dytb_t: 130,
  lom_treo_t: 271687,
  mine_life_years: 20,
  throughput_mtpa: 6.0,
  exim_usd_m: 350,
  efa_aud_m: 70,
}

export const MARKET_PRICES = {
  spot_ndpr_kg:    67,
  green_ndpr_kg:  135,
  spot_dytb_kg:   350,
  green_dytb_kg:  680,
}

export const PROJECT_TIMELINE = [
  { milestone: 'LP Approved', date: 'Dec 2025', status: 'completed' as const, detail: 'Unanimous COPAM vote Dec 19, 2025' },
  { milestone: 'Pilot Plant Online', date: 'Dec 2025', status: 'completed' as const, detail: 'Innovation & Research Center, Poços de Caldas' },
  { milestone: 'LI Application', date: 'Q1 2026', status: 'active' as const, detail: 'Installation license lodged with SUPRAM' },
  { milestone: 'DFS Completion', date: 'Mid 2026', status: 'pending' as const, detail: 'Ausenco-led Definitive Feasibility Study' },
  { milestone: 'LI Approval', date: 'Jun 2026', status: 'pending' as const, detail: 'Construction clearance target' },
  { milestone: 'Final Investment Decision', date: 'H2 2026', status: 'pending' as const, detail: 'Board FID following DFS and LI' },
  { milestone: 'Construction Start', date: '2027', status: 'pending' as const, detail: 'EXIM US$350M + EFA A$70M funding secured' },
  { milestone: 'First Production', date: '2028', status: 'pending' as const, detail: '6.0 Mtpa throughput · 13,584 tpa TREO' },
] as const

export const SCENARIOS: Record<ScenarioKey, FinancialScenario> = {
  consensus: {
    key: 'consensus', label: 'Consensus', ndpr_price_kg: 86, dytb_price_kg: 480,
    npv_pretax_m: 821, npv_posttax_m: 488, irr_pretax_pct: 28, irr_posttax_pct: 21,
    payback_yrs: 3, annual_revenue_m: 315, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
  bull: {
    key: 'bull', label: 'Bull (Forecast)', ndpr_price_kg: 135, dytb_price_kg: 680,
    npv_pretax_m: 1985, npv_posttax_m: 1256, irr_pretax_pct: 39, irr_posttax_pct: 31,
    payback_yrs: 2, annual_revenue_m: 485, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
  bear: {
    key: 'bear', label: 'Bear (Spot)', ndpr_price_kg: 67, dytb_price_kg: 350,
    npv_pretax_m: 251, npv_posttax_m: 109, irr_pretax_pct: 15, irr_posttax_pct: 11,
    payback_yrs: 5, annual_revenue_m: 245, opex_per_kg: 8.91, breakeven_ndpr_kg: 22,
  },
}

export const SENSITIVITY_TABLE: SensitivityPoint[] = [
  { ndpr_price: 50, npv_pretax_m: 48, npv_posttax_m: -15 },
  { ndpr_price: 67, npv_pretax_m: 251, npv_posttax_m: 109 },
  { ndpr_price: 86, npv_pretax_m: 821, npv_posttax_m: 488 },
  { ndpr_price: 100, npv_pretax_m: 1130, npv_posttax_m: 695 },
  { ndpr_price: 110, npv_pretax_m: 1347, npv_posttax_m: 835 },
  { ndpr_price: 120, npv_pretax_m: 1620, npv_posttax_m: 1020 },
  { ndpr_price: 135, npv_pretax_m: 1985, npv_posttax_m: 1256 },
]
