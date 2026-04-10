import { SPRING_COUNT } from './thresholds'

export const PREDICTIVE_HYDROLOGY_SCENARIOS = [
  {
    horizon: '2030 drought case',
    drought_index: 0.42,
    recirculation_pct: 95.2,
    spring_preservation_pct: 97,
    active_springs: 1059,
    sulfate_guardband_ppm: 78,
    permitting_signal: 'Copam-ready',
    recommendation: 'Maintain dry-stacking and current drawdown caps.',
    status: 'stable',
  },
  {
    horizon: '2040 severe dry cycle',
    drought_index: 0.58,
    recirculation_pct: 95.8,
    spring_preservation_pct: 95,
    active_springs: 1037,
    sulfate_guardband_ppm: 61,
    permitting_signal: 'Monitor closely',
    recommendation: 'Add contingency wells and seasonal pumping throttles.',
    status: 'watch',
  },
  {
    horizon: '2050 plateau stress test',
    drought_index: 0.71,
    recirculation_pct: 96.4,
    spring_preservation_pct: 93,
    active_springs: 1016,
    sulfate_guardband_ppm: 44,
    permitting_signal: 'Needs mitigation package',
    recommendation: 'Pre-negotiate adaptive operating envelope before LI hearing.',
    status: 'action',
  },
] as const

export const SCALE_UP_PATHWAY = {
  pilot_name: 'CIP pilot circuit',
  pilot_throughput_kg_hr: 25,
  current_digital_coverage_pct: 91,
  commercial_target_mtpa: 6.0,
  water_recirculation_target_pct: 95,
  springs_monitored: SPRING_COUNT,
  board_message: 'Use pilot telemetry and mocked predictive scenarios to prove Caldeira can scale without losing environmental legitimacy.',
}
