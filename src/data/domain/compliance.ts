import type { ComplianceLedger } from '../../types/telemetry'
import type { BenchmarkOperator, AuditEvent, ESGFramework } from '../../services/dataService'
import { SPRING_COUNT } from './thresholds'

export const BATCH_LICENSE_MAP: Record<string, string> = {
  'BATCH-MREC-8X9': 'LIC-CDM-01',
  'BATCH-MREC-7W2': 'LIC-SOB-01',
  'BATCH-MREC-4K1': 'LIC-CDM-01',
  'BATCH-MREC-2A7': 'LIC-CDM-01',
}

export const LICENSE_DEPOSIT_MAP: Record<string, string> = {
  'LIC-CDM-01': 'capao-do-mel',
  'LIC-SOB-01': 'soberbo',
  'LIC-CVN-01': 'cupim-vermelho-norte',
  'LIC-FIG-01': 'figueira',
  'LIC-DM1-01': 'dona-maria-1',
  'LIC-DM2-01': 'dona-maria-2',
}

export const BATCHES: ComplianceLedger[] = [
  {
    batch_id: 'BATCH-MREC-8X9',
    batch_date: '2026-04-06T03:00:00Z',
    tonnage_kg: 487,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: true,
    carbon_intensity: {
      value: 2.14,
      tier: 'Premium',
      vs_chinese_baseline: 84,
    },
    molecular_timeline: [
      {
        step: 'Extraction',
        description: 'IAC ore excavated — Caldeira Site, Block 14-C, Poços de Caldas, MG, Brazil',
        timestamp: '2026-04-05T06:12:00Z',
        status: 'verified',
        coordinates: { lat: -21.992, lng: -46.483 },
        hash: '0x4f3a7c91b28e6d054a1f8c93d720eb4561cf9da8b53e271094f6a8d2e3c0d92c',
        linked_drills: ['CDMDD0007', 'CDMDD0005', 'CDMDD0008'],
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.3. Recovery: 71% Magnetic REO',
        timestamp: '2026-04-05T09:45:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x7b1e4d9f2a8c63057e1b94a0d5f2c87136ea4b9d82c0f61573e9a4d8b2a3f1e0',
      },
      {
        step: 'Precipitation',
        description: 'Mixed Rare Earth Carbonate (MREC) precipitated. Grade >90% TREO, <2% impurity',
        timestamp: '2026-04-05T14:20:00Z',
        status: 'verified',
        coordinates: { lat: -21.797, lng: -46.568 },
        hash: '0x2c9d5e84f1a3b7602d4e91c8a6f0d35724be8c19f73a0652e4d1b98ca7f0e7b0',
      },
      {
        step: 'FJH Separation',
        description: 'Flash Joule Heating separation. 80%+ LREE removal. 81% Tb recovery.',
        timestamp: '2026-04-05T18:30:00Z',
        status: 'verified',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x9a4f1b7e3d2c86a0594e1f8b27d3c96041ea5f8b29d7c31a064e8f2b1a9fc21d',
      },
      {
        step: 'Quality Assurance',
        description: 'Inline XRF analysis. TREO grade: 91.4%. Certificate issued.',
        timestamp: '2026-04-05T21:00:00Z',
        status: 'active',
        coordinates: { lat: -21.799, lng: -46.570 },
        hash: '0x1d8b3f6a2e7c940518d2b4a9c6e1f07835da9c2b4f6e180a73d5b92c4e8af49a',
      },
      {
        step: 'Export Logistics',
        description: 'Containerized MREC — Port of Santos, SP. MRS Logística rail connection.',
        timestamp: '2026-04-07T08:00:00Z',
        status: 'pending',
        coordinates: { lat: -23.960, lng: -46.333 },
      },
      {
        step: 'Ucore SMC Delivery',
        description: 'Louisiana Strategic Metals Complex — oxide production for US DoD supply chain.',
        timestamp: '2026-04-14T12:00:00Z',
        status: 'pending',
        coordinates: { lat: 30.391, lng: -91.028 },
      },
    ],
    offtake_destination: 'Ucore Rare Metals — Louisiana SMC, USA',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant', 'IRA Rule-of-Origin Certified'],
  },
  {
    batch_id: 'BATCH-MREC-7W2',
    batch_date: '2026-04-04T22:00:00Z',
    tonnage_kg: 512,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: true,
    carbon_intensity: {
      value: 2.08,
      tier: 'Premium',
      vs_chinese_baseline: 84,
    },
    molecular_timeline: [
      {
        step: 'Extraction',
        description: 'IAC ore excavated — Caldeira Site, Block 12-A',
        timestamp: '2026-04-03T07:00:00Z',
        status: 'verified',
        hash: '0x5e2a8b6c4d1f937028e4a9c1d3b7f06542ae8d1c9f3b7042e6d5a81b94c3b11c',
      },
      {
        step: 'Leaching',
        description: 'Ammonium sulfate ion-exchange leach. pH 4.5.',
        timestamp: '2026-04-03T11:00:00Z',
        status: 'verified',
        hash: '0x8c4d2f1a6e9b73058d2c4a1f7e0b93d64528cf1a9e7b340862d5f18c4a7be29f',
      },
      {
        step: 'Precipitation',
        description: 'MREC precipitated. Grade 90.8% TREO.',
        timestamp: '2026-04-03T15:30:00Z',
        status: 'verified',
        hash: '0x3f7b9c2e1d4a860573e1f4b8a2c9d60741fe3b8c2d9a47061e5d4b28a9c1a80d',
      },
      {
        step: 'FJH Separation',
        description: 'FJH cycle complete. Tb recovery: 79%.',
        timestamp: '2026-04-03T20:00:00Z',
        status: 'verified',
        hash: '0xb2c14e8f3a7d960524e1b9f4c8d2a37061fb4e9c2a8d370615e4c1b8f29ad44e',
      },
      {
        step: 'Quality Assurance',
        description: 'TREO grade: 90.8%. Certificate issued.',
        timestamp: '2026-04-03T23:00:00Z',
        status: 'verified',
        hash: '0x6a9e1c4b2f8d7305a4e1c9b3d7f2a06841ec5b9a2d8f430716e5a4c1b39ef73b',
      },
      {
        step: 'Export Logistics',
        description: 'Shipped to Neo Performance Materials — Estonia, EU.',
        timestamp: '2026-04-05T06:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xd4f02e9c1a7b83064d2e1f9b4a8c73052e1da9c4b7f380261d5e4a9c8b1f9c1a',
      },
      {
        step: 'EU DBP Issued',
        description: 'Digital Battery Passport issued. QR linked. Catena-X registered.',
        timestamp: '2026-04-06T00:00:00Z',
        status: 'verified',
        coordinates: { lat: 59.437, lng: 24.754 },
        hash: '0xe7c31d4a2b9f86057e2c1a4d8b3f970624ae1c5d9b7f28031e4d5a2c8f912b5f',
      },
    ],
    offtake_destination: 'Neo Performance Materials — Narva, Estonia (EU)',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'EU DBP Reg 2023/1542', 'Catena-X Registered'],
  },
  {
    batch_id: 'BATCH-MREC-4K1',
    batch_date: '2026-03-10T08:00:00Z',
    tonnage_kg: 1850,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: false,
    carbon_intensity: {
      value: 3.1,
      tier: 'Premium',
      vs_chinese_baseline: 77,
    },
    molecular_timeline: [
      { step: 'Production', description: 'NdPr Oxide produced — Caldeira Plant, MG', timestamp: '2026-03-10T08:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 } },
      { step: 'Quality Certified', description: 'Inline XRF + ICP-MS analysis. NdPr oxide grade certified.', timestamp: '2026-03-11T10:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 } },
      { step: 'Export Cleared', description: 'Santos Port — export documentation filed and cleared.', timestamp: '2026-03-12T06:00:00Z', status: 'verified', coordinates: { lat: -23.95, lng: -46.33 } },
      { step: 'In Transit', description: 'Pacific crossing — container vessel en route to Japan.', timestamp: '2026-03-18T00:00:00Z', status: 'active', coordinates: { lat: 5.0, lng: -160.0 } },
      { step: 'ETA Destination', description: 'Shin-Etsu Chemical — Takefu, Japan. Final delivery.', timestamp: '2026-04-28T00:00:00Z', status: 'pending', coordinates: { lat: 35.90, lng: 136.17 } },
    ],
    offtake_destination: 'Shin-Etsu Chemical — Takefu, Japan',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant'],
  },
  {
    batch_id: 'BATCH-MREC-2A7',
    batch_date: '2026-02-03T08:00:00Z',
    tonnage_kg: 920,
    feoc_percentage: 0.00,
    ira_compliant: true,
    eu_dbp_ready: false,
    carbon_intensity: {
      value: 3.4,
      tier: 'Premium',
      vs_chinese_baseline: 75,
    },
    molecular_timeline: [
      { step: 'Production', description: 'Mixed REO produced — Caldeira Plant, MG', timestamp: '2026-02-03T08:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 } },
      { step: 'Quality Certified', description: 'Inline XRF analysis. Mixed REO grade certified.', timestamp: '2026-02-04T10:00:00Z', status: 'verified', coordinates: { lat: -21.08, lng: -46.43 } },
      { step: 'Export Cleared', description: 'Santos Port — export documentation filed and cleared.', timestamp: '2026-02-05T06:00:00Z', status: 'verified', coordinates: { lat: -23.95, lng: -46.33 } },
      { step: 'Customs Cleared', description: 'Long Beach, CA — US customs clearance completed.', timestamp: '2026-02-20T12:00:00Z', status: 'verified', coordinates: { lat: 33.76, lng: -118.19 } },
      { step: 'Delivered', description: 'MP Materials — Mountain Pass, NV. Delivery confirmed.', timestamp: '2026-02-28T14:00:00Z', status: 'verified', coordinates: { lat: 35.47, lng: -115.53 } },
    ],
    offtake_destination: 'MP Materials — Mountain Pass, USA',
    certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant', 'IRA Rule-of-Origin Certified'],
  },
]

export const BENCHMARKS: BenchmarkOperator[] = [
  { name: 'Caldeira (Meteoric)', carbon_intensity: 2.14, water_l_per_t: 50, feoc_pct: 0, cost_per_kg: 8.91, location: 'Brazil' },
  { name: 'Mt. Weld (Lynas)', carbon_intensity: 8.5, water_l_per_t: 320, feoc_pct: 0, cost_per_kg: 12.40, location: 'Australia' },
  { name: 'Mountain Pass (MP)', carbon_intensity: 11.2, water_l_per_t: 480, feoc_pct: 0, cost_per_kg: 14.80, location: 'USA' },
  { name: 'Chinese Hard-Rock Avg', carbon_intensity: 13.4, water_l_per_t: 850, feoc_pct: 100, cost_per_kg: 7.20, location: 'China' },
]

export function sha256Stub(input: string): string {
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    h0 = (h0 ^ (c * 0x01000193)) >>> 0
    h1 = (h1 ^ ((c << 8) * 0x01000193)) >>> 0
    h2 = (h2 ^ ((c << 16) * 0x811c9dc5)) >>> 0
    h3 = (h3 ^ ((c << 24) * 0x01000193)) >>> 0
    h4 = ((h4 << 5) - h4 + c) >>> 0
    h5 = ((h5 << 7) ^ (c * 0x5bd1e995)) >>> 0
    h6 = ((h6 >>> 3) ^ (c * 0x1b873593)) >>> 0
    h7 = ((h7 << 11) ^ (c * 0xcc9e2d51)) >>> 0
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map(v => v.toString(16).padStart(8, '0')).join('')
}

export const AUDIT_TRAIL: AuditEvent[] = [
  { id: 'AUD-001', timestamp: '2026-04-06T08:00:00Z', type: 'system_event', actor: 'System', action: 'Vero instance started', detail: 'Production environment boot — all sensor feeds connected. Firmware v2.4.1.', hash: sha256Stub('AUD-001-system-start') },
  { id: 'AUD-002', timestamp: '2026-04-06T08:02:14Z', type: 'compliance_check', actor: 'System', action: 'FEOC compliance sweep completed', detail: 'Full supply chain re-verified against FEOC database v2026-04-05. 0 flagged entities. 47 suppliers checked.', hash: sha256Stub('AUD-002-feoc-sweep') },
  { id: 'AUD-003', timestamp: '2026-04-05T16:30:00Z', type: 'batch_created', actor: 'J. Santos (Process Eng.)', action: 'Batch BATCH-MREC-8X9 initiated', detail: 'MREC precipitation run started. Feed material from Capão do Mel pit. Target: 142 kg MREC.', hash: sha256Stub('AUD-003-batch-create'), relatedEntityId: 'BATCH-MREC-8X9' },
  { id: 'AUD-004', timestamp: '2026-04-05T14:12:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'pH exceedance alert triggered', detail: 'Leach circuit pH rose to 5.12, exceeding 5.0 threshold. Alert dispatched to on-call process engineer.', hash: sha256Stub('AUD-004-alert-ph'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-005', timestamp: '2026-04-05T14:58:00Z', type: 'alert_resolved', actor: 'J. Santos (Process Eng.)', action: 'pH exceedance alert resolved', detail: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4. Total response time: 46 min.', hash: sha256Stub('AUD-005-alert-resolve'), relatedEntityId: 'alert-ph-high' },
  { id: 'AUD-006', timestamp: '2026-04-04T10:00:00Z', type: 'passport_issued', actor: 'Vero', action: 'Digital Battery Passport DBP-2026-0042 issued', detail: 'EU-compliant DBP JSON payload generated for batch BATCH-MREC-7W2. Hash anchored to permissioned ledger.', hash: sha256Stub('AUD-006-dbp-issue'), relatedEntityId: 'BATCH-MREC-7W2' },
  { id: 'AUD-007', timestamp: '2026-04-04T10:05:00Z', type: 'api_handoff', actor: 'Vero', action: 'DBP payload pushed to Ucore SAP', detail: 'Automated ABI pre-filing to US CBP. Digital Battery Passport synchronized to Ucore ERP via REST API. HTTP 200.', hash: sha256Stub('AUD-007-api-push'), relatedEntityId: 'ucore' },
  { id: 'AUD-008', timestamp: '2026-04-03T09:10:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'Sulfate containment critical alert', detail: 'Discharge sulfate reached 247 ppm, approaching 250 ppm regulatory limit. Automatic flow reduction triggered.', hash: sha256Stub('AUD-008-sulfate-alert') },
  { id: 'AUD-009', timestamp: '2026-04-03T10:45:00Z', type: 'alert_resolved', actor: 'M. Costa (Env. Manager)', action: 'Sulfate containment resolved', detail: 'Discharge flow reduced 30%. Contingency filtration activated. Sulfate dropped to 218 ppm. FEAM notified.', hash: sha256Stub('AUD-009-sulfate-resolve') },
  { id: 'AUD-010', timestamp: '2026-04-02T11:30:00Z', type: 'regulatory_submission', actor: 'VP Environment', action: 'Additional hydrological data submitted to FEAM', detail: 'Piezometer data package (Q1 2026) and updated hydrological model delivered to FEAM via SUPRAM portal.', hash: sha256Stub('AUD-010-feam-submit'), relatedEntityId: 'REG-03' },
  { id: 'AUD-011', timestamp: '2026-04-01T09:00:00Z', type: 'compliance_check', actor: 'System', action: 'SOC 2 Type II automated audit cycle', detail: 'Continuous compliance checks passed. Data security, availability, and processing integrity validated. 0 findings.', hash: sha256Stub('AUD-011-soc2-audit') },
  { id: 'AUD-012', timestamp: '2026-03-28T12:20:00Z', type: 'alert_resolved', actor: 'R. Ferreira (HSE)', action: 'UDC radiation event resolved', detail: 'Wind-carried particulate event. Personnel evacuated from 500m zone. Levels normalized after 75 min. CNEN incident form filed.', hash: sha256Stub('AUD-012-radiation-resolve') },
  { id: 'AUD-013', timestamp: '2026-03-25T08:33:00Z', type: 'user_action', actor: 'Dr. L. Oliveira (Hydro.)', action: 'Pumping throttle applied — PIZ-E04', detail: 'Seasonal drawdown event. East margin piezometer critical. Pumping reduced 20%. Aquifer stabilized at +1.8m delta.', hash: sha256Stub('AUD-013-pump-throttle') },
  { id: 'AUD-014', timestamp: '2026-03-20T15:00:00Z', type: 'offtake_update', actor: 'VP Commercial', action: 'Neo Performance LOI executed', detail: 'Letter of Intent signed for 1,500 tpa TREO. Binding terms contingent on DFS completion.', hash: sha256Stub('AUD-014-neo-loi'), relatedEntityId: 'neo' },
  { id: 'AUD-015', timestamp: '2026-03-15T10:00:00Z', type: 'batch_created', actor: 'A. Lima (Operations)', action: 'Batch BATCH-MREC-7W2 initiated', detail: 'MREC precipitation run started. Feed material from Soberbo pit. Target: 155 kg MREC.', hash: sha256Stub('AUD-015-batch-create'), relatedEntityId: 'BATCH-MREC-7W2' },
]

export const ESG_FRAMEWORKS: ESGFramework[] = [
  {
    id: 'gri-303', name: 'GRI 303: Water & Effluents', standard: 'GRI', category: 'water', coverage_pct: 92,
    metrics: [
      { metric: 'Water withdrawal by source', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Water recycled and reused', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Water discharge quality', dashboardSource: 'FieldView → Hydro Twin → Sulfate/Nitrate ppm', status: 'mapped' },
      { metric: 'Water stress area assessment', dashboardSource: `FieldView → Hydro Twin → ${SPRING_COUNT} Springs Monitor`, status: 'mapped' },
    ],
  },
  {
    id: 'gri-306', name: 'GRI 306: Waste', standard: 'GRI', category: 'waste', coverage_pct: 78,
    metrics: [
      { metric: 'Waste generated', dashboardSource: 'FieldView → Operations → Dry-stack tailings volume', status: 'mapped' },
      { metric: 'Waste diverted from disposal', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Significant spills', dashboardSource: 'Alert Panel → Incident Log', status: 'mapped' },
      { metric: 'Hazardous waste transport', dashboardSource: 'Not applicable (ionic clay — no hazardous waste)', status: 'partial' },
    ],
  },
  {
    id: 'sasb-em-mm', name: 'SASB EM-MM: Metals & Mining', standard: 'SASB', category: 'governance', coverage_pct: 85,
    metrics: [
      { metric: 'GHG Scope 1 + 2 emissions', dashboardSource: 'BuyerView → Green Premium → Carbon Intensity', status: 'mapped' },
      { metric: 'Total fresh water withdrawn', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Community engagement & permits', dashboardSource: 'ExecutiveView → DFS → Regulatory Log', status: 'mapped' },
      { metric: 'Workforce health & safety', dashboardSource: 'Alert Panel → Incident Log → SLA Metrics', status: 'partial' },
      { metric: 'Reserves & resource estimation', dashboardSource: 'ExecutiveView → Assets → Geology Panel', status: 'mapped' },
    ],
  },
  {
    id: 'tcfd', name: 'TCFD: Climate-Related Disclosures', standard: 'TCFD', category: 'climate', coverage_pct: 70,
    metrics: [
      { metric: 'Governance: Board oversight of climate risks', dashboardSource: 'ExecutiveView → Risk Register', status: 'mapped' },
      { metric: 'Strategy: Climate scenario analysis', dashboardSource: 'FieldView → Hydro Twin → Predictive Modeling (drought)', status: 'mapped' },
      { metric: 'Risk management: Integration of climate risk', dashboardSource: 'ExecutiveView → Risk Register → Environmental', status: 'mapped' },
      { metric: 'Metrics: Scope 3 emissions tracking', dashboardSource: 'BuyerView → Scope 3 Reagent Provenance', status: 'partial' },
    ],
  },
  {
    id: 'issb-s2', name: 'ISSB S2: Climate Disclosures', standard: 'ISSB', category: 'climate', coverage_pct: 62,
    metrics: [
      { metric: 'Physical climate risk assessment', dashboardSource: 'FieldView → Hydro Twin → Drought Forecast 2030–2050', status: 'mapped' },
      { metric: 'Transition risk: Commodity price sensitivity', dashboardSource: 'ExecutiveView → Financials → Sensitivity Table', status: 'mapped' },
      { metric: 'Cross-industry emissions metrics', dashboardSource: 'BuyerView → Competitive Benchmarks → CO₂/t', status: 'mapped' },
      { metric: 'Financed emissions', dashboardSource: 'Not yet tracked — requires EXIM/EFA integration', status: 'pending' },
    ],
  },
]
