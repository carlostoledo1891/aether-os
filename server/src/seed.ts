/**
 * Seeds the SQLite database with the same static data that the frontend's
 * mockDataService uses. This ensures the backend serves identical data on
 * first boot while the engine generates live telemetry.
 */
import { getDb, setDomainState, getDomainState } from './store/db.js'

export function seedIfNeeded() {
  getDb()

  if (getDomainState('spring_count') !== null) {
    console.log('[seed] Database already seeded — skipping.')
    return
  }

  console.log('[seed] Seeding domain state from static data...')

  /* ─── Thresholds ──────────────────────────────────────────────────── */
  setDomainState('thresholds', {
    sulfate_warning_ppm: 250,
    nitrate_warning_ppm: 50,
    radiation_critical_usv_h: 0.18,
    ph_low: 3.9,
    ph_high: 5.1,
    recirculation_warning_pct: 94,
  })

  setDomainState('spring_count', 1092)

  /* ─── Market Prices ───────────────────────────────────────────────── */
  setDomainState('market_prices', {
    spot_ndpr_kg: 67, green_ndpr_kg: 135,
    spot_dytb_kg: 350, green_dytb_kg: 680,
  })

  /* ─── Project Financials ──────────────────────────────────────────── */
  setDomainState('project_financials', {
    npv_pretax_consensus_m: 821, npv_pretax_forecast_m: 1985,
    npv_posttax_consensus_m: 488, npv_posttax_forecast_m: 1256,
    irr_pretax_consensus_pct: 28, irr_pretax_forecast_pct: 39,
    irr_posttax_consensus_pct: 21, irr_posttax_forecast_pct: 31,
    capex_m: 443, payback_yrs: 3, lom_fcf_m: 2000,
    opex_per_kg: 8.91, ndpr_opex: 22,
    annual_treo_t: 13584, annual_ndpr_t: 4228, annual_dytb_t: 130,
    lom_treo_t: 271687, mine_life_years: 20, throughput_mtpa: 6.0,
    exim_usd_m: 350, efa_aud_m: 70,
  })

  /* ─── Financial Scenarios ─────────────────────────────────────────── */
  setDomainState('financial_scenarios', {
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
  })

  setDomainState('sensitivity_table', [
    { ndpr_price: 50, npv_pretax_m: 48, npv_posttax_m: -15 },
    { ndpr_price: 67, npv_pretax_m: 251, npv_posttax_m: 109 },
    { ndpr_price: 86, npv_pretax_m: 821, npv_posttax_m: 488 },
    { ndpr_price: 100, npv_pretax_m: 1130, npv_posttax_m: 695 },
    { ndpr_price: 110, npv_pretax_m: 1347, npv_posttax_m: 835 },
    { ndpr_price: 120, npv_pretax_m: 1620, npv_posttax_m: 1020 },
    { ndpr_price: 135, npv_pretax_m: 1985, npv_posttax_m: 1256 },
  ])

  /* ─── Risk Register ───────────────────────────────────────────────── */
  setDomainState('risks', [
    { id: 'R01', title: 'MPF cumulative EIA objection blocks LI', category: 'permitting', likelihood: 3, impact: 5, score: 15, mitigation: 'Hydro digital twin + 1092 spring reference points + illustrative monitoring narrative for permitting dialogue.', status: 'mitigating', owner: 'VP Environment', relatedRegulatoryIds: ['REG-04'], relatedAuditIds: ['AUD-010'] },
    { id: 'R02', title: 'NdPr price decline below breakeven', category: 'market', likelihood: 2, impact: 5, score: 10, mitigation: 'Green premium offtakes with floor price clauses; diversified DyTb revenue stream', status: 'mitigating', owner: 'CFO' },
    { id: 'R03', title: 'FEOC policy change expands restricted entities', category: 'geopolitical', likelihood: 2, impact: 4, score: 8, mitigation: 'Full Scope 3 reagent provenance tracking; allied-only supply chain architecture', status: 'mitigating', owner: 'VP Compliance' },
    { id: 'R04', title: 'DFS completion delayed beyond mid-2026', category: 'technical', likelihood: 3, impact: 4, score: 12, mitigation: 'Ausenco acceleration package; parallel workstreams; weekly progress tracking', status: 'mitigating', owner: 'Project Director' },
    { id: 'R05', title: 'Water quality exceedance at discharge point', category: 'environmental', likelihood: 2, impact: 4, score: 8, mitigation: 'ISE real-time monitoring; automated throttle at 200 ppm sulfate; contingency treatment', status: 'mitigating', owner: 'Environmental Manager' },
    { id: 'R06', title: 'UDC legacy radiation above background', category: 'environmental', likelihood: 2, impact: 3, score: 6, mitigation: 'Continuous scintillation monitoring; 3 km exclusion buffer; INB/CNEN compliance', status: 'accepted', owner: 'HSE Director' },
    { id: 'R07', title: 'Ammonium sulfate supply chain disruption', category: 'operational', likelihood: 2, impact: 3, score: 6, mitigation: 'Dual-supplier qualification (AdvanSix + backup); 90-day strategic inventory', status: 'mitigating', owner: 'Supply Chain Manager' },
    { id: 'R08', title: 'Key personnel retention during scale-up', category: 'operational', likelihood: 3, impact: 3, score: 9, mitigation: 'Long-term incentive plans; knowledge transfer protocols; deputy role assignments', status: 'open', owner: 'CHRO' },
    { id: 'R09', title: 'BRL/USD FX exposure on operating costs', category: 'market', likelihood: 3, impact: 3, score: 9, mitigation: 'Natural hedge (USD revenue / BRL costs); rolling 12-month hedging policy', status: 'mitigating', owner: 'Treasury' },
    { id: 'R10', title: 'Community opposition to mine expansion', category: 'permitting', likelihood: 2, impact: 4, score: 8, mitigation: 'Community liaison program; local employment commitment; environmental offset fund', status: 'mitigating', owner: 'Community Relations' },
  ])

  /* ─── Resource Classification ─────────────────────────────────────── */
  setDomainState('resource_classification', {
    global_bt: 1.537, global_treo_ppm: 2359,
    measured_mt: 37, measured_treo_ppm: 2983,
    mi_mt: 666, mi_treo_ppm: 2685, inferred_mt: 834,
    mreo_avg_pct: 24, deposits_count: 7, drill_holes_total: 750,
  })

  /* ─── Pilot Plant Performance ─────────────────────────────────────── */
  setDomainState('plant_performance', {
    nameplate_kg_day: 2.0, peak_kg_day: 2.6,
    mrec_mreo_pct: 32.7, mrec_dytb_pct: 1.0,
    recoveries: [
      { element: 'Nd', pilot_pct: 70, ansto_pct: 84 },
      { element: 'Pr', pilot_pct: 71, ansto_pct: 85 },
      { element: 'Tb', pilot_pct: 61, ansto_pct: 75 },
      { element: 'Dy', pilot_pct: 56, ansto_pct: 72 },
    ],
    avg_magnet_recovery_pct: 70, status: 'Operating — MREC production',
  })

  /* ─── U/Th Safety ─────────────────────────────────────────────────── */
  setDomainState('u_th_safety', {
    primary_mineral: 'Ionic adsorption clay (IAC) — REE adsorbed on halloysite/kaolinite',
    u_th_profile: 'U and Th remain locked in host clay matrix at pH 4.0',
    solubilization: 'U/Th do not solubilize at ammonium sulfate ion-exchange operating pH (4.0)',
    mrec_classification: 'Non-radioactive — safe for international transport (IAEA exempt)',
    radioactive_tailings: false,
    advantage_vs_hardrock: 'No U/Th in MREC product; no radioactive tailings; simplified logistics',
  })

  /* ─── Project Timeline ────────────────────────────────────────────── */
  setDomainState('project_timeline', [
    { milestone: 'LP Approved', date: '2025-12-19', status: 'completed', detail: 'Unanimous COPAM approval.' },
    { milestone: 'LI Application', date: '2026-02-14', status: 'completed', detail: 'SUPRAM lodged.' },
    { milestone: 'DFS Completion', date: '2026-06-30', status: 'active', detail: 'Ausenco-led, 5 workstreams.' },
    { milestone: 'FID', date: '2026-09-30', status: 'pending', detail: 'Board + funding CPs.' },
    { milestone: 'Construction Start', date: '2027-01-01', status: 'pending', detail: 'Post-FID.' },
    { milestone: 'First Production', date: '2028-01-01', status: 'pending', detail: '6.0 Mtpa nameplate.' },
  ])

  /* ─── Offtakers ────────────────────────────────────────────────────── */
  setDomainState('offtakers', [
    { id: 'ucore', name: 'Ucore Rare Metals', location: 'Louisiana SMC, USA', stage: 'binding', volumeCommitment: '2,000 tpa TREO', qualificationStatus: 'Qualification samples delivered', deliverySchedule: 'H2 2028', product: 'MREC', notes: 'Strategic partner for US DoD supply chain.' },
    { id: 'neo', name: 'Neo Performance Materials', location: 'Narva, Estonia (EU)', stage: 'loi', volumeCommitment: '1,500 tpa TREO', qualificationStatus: 'LOI executed — awaiting DFS', deliverySchedule: 'H1 2029', product: 'MREC → separated oxides', notes: 'EU DPP integration.' },
  ])

  /* ─── Capital ──────────────────────────────────────────────────────── */
  setDomainState('capital', {
    total_capex_m: 443, funded_m: 443, drawn_m: 28, remaining_m: 415,
    funding_sources: [
      { name: 'US EXIM Bank', committed_m: 350, drawn_m: 15, currency: 'USD' },
      { name: 'Export Finance Australia', committed_m: 70, drawn_m: 8, currency: 'AUD' },
      { name: 'Equity / Working Capital', committed_m: 23, drawn_m: 5, currency: 'AUD' },
    ],
    conditions_precedent: [
      { id: 'CP-01', description: 'DFS completion and Board approval', status: 'in_progress', target_date: '2026-06-30' },
      { id: 'CP-02', description: 'Installation License (LI) granted', status: 'pending', target_date: '2026-06-30' },
      { id: 'CP-03', description: 'Final Investment Decision (FID)', status: 'pending', target_date: '2026-09-30' },
      { id: 'CP-04', description: 'Environmental bond posted', status: 'met', target_date: '2026-03-31' },
      { id: 'CP-05', description: 'Binding offtake agreements', status: 'in_progress', target_date: '2026-08-31' },
    ],
    monthly_spend: [
      { month: 'Jan 2026', budget_m: 2.1, actual_m: 1.8 },
      { month: 'Feb 2026', budget_m: 2.4, actual_m: 2.6 },
      { month: 'Mar 2026', budget_m: 3.0, actual_m: 2.9 },
      { month: 'Apr 2026', budget_m: 3.5, actual_m: 3.2 },
      { month: 'May 2026', budget_m: 4.0, actual_m: 0 },
      { month: 'Jun 2026', budget_m: 5.2, actual_m: 0 },
    ],
  })

  /* ─── DFS & Regulatory ────────────────────────────────────────────── */
  setDomainState('dfs_workstreams', [
    { id: 'DFS-01', name: 'Mining & Reserves', lead: 'Ausenco', progress_pct: 85, status: 'on_track', target_date: '2026-05-15' },
    { id: 'DFS-02', name: 'Process Engineering', lead: 'Ausenco / Meteoric', progress_pct: 72, status: 'on_track', target_date: '2026-05-30' },
    { id: 'DFS-03', name: 'Infrastructure & Logistics', lead: 'Ausenco', progress_pct: 60, status: 'at_risk', target_date: '2026-06-15' },
    { id: 'DFS-04', name: 'Environmental & Permitting', lead: 'Meteoric / FEAM', progress_pct: 55, status: 'at_risk', target_date: '2026-06-30' },
    { id: 'DFS-05', name: 'Financial Model', lead: 'Ausenco / CFO', progress_pct: 45, status: 'on_track', target_date: '2026-06-30' },
  ])

  setDomainState('regulatory_log', [
    { id: 'REG-01', body: 'COPAM', type: 'LP Hearing', date: '2025-12-19', status: 'approved', detail: 'Unanimous approval of Preliminary License.' },
    { id: 'REG-02', body: 'SUPRAM', type: 'LI Application', date: '2026-02-14', status: 'submitted', detail: 'Installation License application lodged.' },
    { id: 'REG-03', body: 'FEAM', type: 'Technical Review', date: '2026-03-20', status: 'in_review', detail: 'Environmental conditions review.' },
    { id: 'REG-04', body: 'MPF', type: 'Cumulative EIA Request', date: '2026-01-15', status: 'in_review', detail: 'Federal prosecutor requested cumulative EIA.' },
    { id: 'REG-05', body: 'INB/CNEN', type: 'Radiation Clearance', date: '2026-03-01', status: 'approved', detail: 'UDC legacy site monitoring protocol accepted.' },
    { id: 'REG-06', body: 'IBAMA', type: 'APA Consultation', date: '2026-04-02', status: 'pending', detail: 'APA Pedra Branca buffer zone consultation scheduled.' },
  ])

  /* ─── Benchmarks ──────────────────────────────────────────────────── */
  setDomainState('benchmarks', [
    { name: 'Caldeira (Meteoric)', carbon_intensity: 2.14, water_l_per_t: 50, feoc_pct: 0, cost_per_kg: 8.91, location: 'Brazil' },
    { name: 'Mt. Weld (Lynas)', carbon_intensity: 8.5, water_l_per_t: 320, feoc_pct: 0, cost_per_kg: 12.40, location: 'Australia' },
    { name: 'Mountain Pass (MP)', carbon_intensity: 11.2, water_l_per_t: 480, feoc_pct: 0, cost_per_kg: 14.80, location: 'USA' },
    { name: 'Chinese Hard-Rock Avg', carbon_intensity: 13.4, water_l_per_t: 850, feoc_pct: 100, cost_per_kg: 7.20, location: 'China' },
  ])

  /* ─── Data Context (live pipeline mode) ───────────────────────────── */
  setDomainState('data_context', {
    mode: 'live',
    telemetry: 'simulated',
    presentationMode: false,
    disclosureMode: false,
    bannerLabel: 'Live pipeline — Aether Simulation Engine',
    detail: 'Telemetry flows through the Aether API via the simulation engine. Weather data from Open-Meteo, FX from BCB. Plant/env streams are synthetic until LAPOC instruments connect.',
  })

  /* ─── Provenance Profile ──────────────────────────────────────────── */
  setDomainState('provenance_profile', {
    presentationMode: false,
    sections: {
      hydro_spring_geometry: { kind: 'from_public_record', hint: 'Spring locations from FBDS/CAR-derived GeoJSON inside Caldeira boundary' },
      hydro_spring_status: { kind: 'modeled', hint: 'Active/Reduced/Suppressed overlay from simulation engine — not field-verified' },
      hydro_piezo_telemetry: { kind: 'simulated', hint: 'Aquifer/piezo metrics from simulation engine — swap for LAPOC when wired' },
      plant_telemetry: { kind: 'simulated', hint: 'Pilot plant channels from Aether Simulation Engine' },
      precip_field: { kind: 'illustrative', hint: 'Open-Meteo when engine enricher is active; otherwise synthetic' },
      regulatory_log: { kind: 'issuer_attested', hint: 'Structured engagement log — align dates/refs with counsel' },
      audit_ledger: { kind: 'illustrative', hint: 'Demonstration event log with stub hashes' },
      map_geometry: { kind: 'illustrative', hint: 'Bundled GeoJSON — see docs/data/caldeira/DATA_SOURCES.md' },
    },
  })

  /* ─── Issuer Snapshot (simplified) ────────────────────────────────── */
  setDomainState('issuer_snapshot', {
    issuer: 'Meteoric Resources NL', ticker: 'ASX: MEI',
    resource: {
      headline: '1.537 Bt @ 2,359 ppm TREO',
      citation: { date: '2025-07-29', title: 'Updated MRE', url: 'https://meteoric.com.au/asx-announcements/' },
    },
    pfs: {
      headline: 'Pre-tax NPV₈ $821M (consensus) | Post-tax $488M',
      citation: { date: '2025-07-29', title: 'PFS Results', url: 'https://meteoric.com.au/asx-announcements/' },
    },
  })

  /* ─── Spatial Insights ────────────────────────────────────────────── */
  setDomainState('spatial_insights', {
    pilotToPfsPlantKm: 9.6,
    licenceZonesInApaBuffer: 2,
    summary: 'Pilot plant (ops reality) is ~9.6 km from the PFS commercial plant collar. 2 licence zones intersect the APA buffer.',
    apaHeuristicNote: 'Schematic buffer — not official APA boundary.',
  })

  /* ─── Batches (Compliance Ledger) ──────────────────────────────────── */
  setDomainState('batches', [
    {
      batch_id: 'BATCH-MREC-8X9', batch_date: '2026-04-06T03:00:00Z', tonnage_kg: 487,
      feoc_percentage: 0.00, ira_compliant: true, eu_dbp_ready: true,
      carbon_intensity: { value: 2.14, tier: 'Premium', vs_chinese_baseline: 84 },
      molecular_timeline: [
        { step: 'Extraction', description: 'IAC ore excavated — Caldeira Site, Block 14-C, Poços de Caldas, MG, Brazil', timestamp: '2026-04-05T06:12:00Z', status: 'verified', coordinates: { lat: -21.795, lng: -46.567 }, hash: '0x4f3a7c91b28e6d054a1f8c93d720eb4561cf9da8b53e271094f6a8d2e3c0d92c' },
        { step: 'Leaching', description: 'Ammonium sulfate ion-exchange leach. pH 4.3. Recovery: 71% Magnetic REO', timestamp: '2026-04-05T09:45:00Z', status: 'verified', coordinates: { lat: -21.797, lng: -46.568 }, hash: '0x7b1e4d9f2a8c63057e1b94a0d5f2c87136ea4b9d82c0f61573e9a4d8b2a3f1e0' },
        { step: 'Precipitation', description: 'Mixed Rare Earth Carbonate (MREC) precipitated. Grade >90% TREO, <2% impurity', timestamp: '2026-04-05T14:20:00Z', status: 'verified', coordinates: { lat: -21.797, lng: -46.568 }, hash: '0x2c9d5e84f1a3b7602d4e91c8a6f0d35724be8c19f73a0652e4d1b98ca7f0e7b0' },
        { step: 'FJH Separation', description: 'Flash Joule Heating separation. 80%+ LREE removal. 81% Tb recovery.', timestamp: '2026-04-05T18:30:00Z', status: 'verified', coordinates: { lat: -21.799, lng: -46.570 }, hash: '0x9a4f1b7e3d2c86a0594e1f8b27d3c96041ea5f8b29d7c31a064e8f2b1a9fc21d' },
        { step: 'Quality Assurance', description: 'Inline XRF analysis. TREO grade: 91.4%. Certificate issued.', timestamp: '2026-04-05T21:00:00Z', status: 'active', coordinates: { lat: -21.799, lng: -46.570 }, hash: '0x1d8b3f6a2e7c940518d2b4a9c6e1f07835da9c2b4f6e180a73d5b92c4e8af49a' },
        { step: 'Export Logistics', description: 'Containerized MREC — Port of Santos, SP. MRS Logística rail connection.', timestamp: '2026-04-07T08:00:00Z', status: 'pending', coordinates: { lat: -23.960, lng: -46.333 } },
        { step: 'Ucore SMC Delivery', description: 'Louisiana Strategic Metals Complex — oxide production for US DoD supply chain.', timestamp: '2026-04-14T12:00:00Z', status: 'pending', coordinates: { lat: 30.391, lng: -91.028 } },
      ],
      offtake_destination: 'Ucore Rare Metals — Louisiana SMC, USA',
      certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'OECD-GRE Compliant', 'IRA Rule-of-Origin Certified'],
    },
    {
      batch_id: 'BATCH-MREC-7W2', batch_date: '2026-04-04T22:00:00Z', tonnage_kg: 512,
      feoc_percentage: 0.00, ira_compliant: true, eu_dbp_ready: true,
      carbon_intensity: { value: 2.08, tier: 'Premium', vs_chinese_baseline: 84 },
      molecular_timeline: [
        { step: 'Extraction', description: 'IAC ore excavated — Caldeira Site, Block 12-A', timestamp: '2026-04-03T07:00:00Z', status: 'verified', coordinates: { lat: -21.793, lng: -46.565 }, hash: '0x5e2a8b6c4d1f937028e4a9c1d3b7f06542ae8d1c9f3b7042e6d5a81b94c3b11c' },
        { step: 'Leaching', description: 'Ammonium sulfate ion-exchange leach. pH 4.5.', timestamp: '2026-04-03T11:00:00Z', status: 'verified', hash: '0x8c4d2f1a6e9b73058d2c4a1f7e0b93d64528cf1a9e7b340862d5f18c4a7be29f' },
        { step: 'Precipitation', description: 'MREC precipitated. Grade 90.8% TREO.', timestamp: '2026-04-03T15:30:00Z', status: 'verified', hash: '0x3f7b9c2e1d4a860573e1f4b8a2c9d60741fe3b8c2d9a47061e5d4b28a9c1a80d' },
        { step: 'FJH Separation', description: 'FJH cycle complete. Tb recovery: 79%.', timestamp: '2026-04-03T20:00:00Z', status: 'verified', hash: '0xb2c14e8f3a7d960524e1b9f4c8d2a37061fb4e9c2a8d370615e4c1b8f29ad44e' },
        { step: 'Quality Assurance', description: 'TREO grade: 90.8%. Certificate issued.', timestamp: '2026-04-03T23:00:00Z', status: 'verified', hash: '0x6a9e1c4b2f8d7305a4e1c9b3d7f2a06841ec5b9a2d8f430716e5a4c1b39ef73b' },
        { step: 'Export Logistics', description: 'Shipped to Neo Performance Materials — Estonia, EU.', timestamp: '2026-04-05T06:00:00Z', status: 'verified', coordinates: { lat: 59.437, lng: 24.754 }, hash: '0xd4f02e9c1a7b83064d2e1f9b4a8c73052e1da9c4b7f380261d5e4a9c8b1f9c1a' },
        { step: 'EU DBP Issued', description: 'Digital Battery Passport issued. QR linked. Catena-X registered.', timestamp: '2026-04-06T00:00:00Z', status: 'verified', coordinates: { lat: 59.437, lng: 24.754 }, hash: '0xe7c31d4a2b9f86057e2c1a4d8b3f970624ae1c5d9b7f28031e4d5a2c8f912b5f' },
      ],
      offtake_destination: 'Neo Performance Materials — Narva, Estonia (EU)',
      certificates: ['ISO 14001:2015', 'REIA-PCR-001', 'EU DBP Reg 2023/1542', 'Catena-X Registered'],
    },
  ])

  /* ─── Incident Log ────────────────────────────────────────────────── */
  setDomainState('incidents', [
    { id: 'INC-001', alertId: 'alert-ph-high', title: 'pH Level Elevated — Leach Circuit', severity: 'warning', triggeredAt: '2026-04-04T14:22:00Z', acknowledgedAt: '2026-04-04T14:25:00Z', resolvedAt: '2026-04-04T14:58:00Z', status: 'resolved', assignee: 'J. Santos (Process Eng.)', responseNote: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4 within 36 minutes.', slaMinutes: 30 },
    { id: 'INC-002', alertId: 'alert-sulfate', title: 'Sulfate Containment Near Threshold', severity: 'critical', triggeredAt: '2026-04-03T09:10:00Z', acknowledgedAt: '2026-04-03T09:12:00Z', resolvedAt: '2026-04-03T10:45:00Z', status: 'resolved', assignee: 'M. Costa (Env. Manager)', responseNote: 'Discharge flow reduced 30%. Activated contingency filtration. Sulfate dropped to 218 ppm.', slaMinutes: 15 },
    { id: 'INC-003', alertId: 'alert-recirc', title: 'Water Recirculation Below Target', severity: 'warning', triggeredAt: '2026-04-02T16:44:00Z', acknowledgedAt: '2026-04-02T16:50:00Z', resolvedAt: '2026-04-02T17:30:00Z', status: 'resolved', assignee: 'A. Lima (Operations)', responseNote: 'Filter blockage cleared. Recirculation recovered to 95.6% within 46 minutes.', slaMinutes: 30 },
    { id: 'INC-004', alertId: 'alert-radiation', title: 'UDC Radiation Elevated', severity: 'critical', triggeredAt: '2026-03-28T11:05:00Z', acknowledgedAt: '2026-03-28T11:08:00Z', resolvedAt: '2026-03-28T12:20:00Z', status: 'resolved', assignee: 'R. Ferreira (HSE)', responseNote: 'Wind-carried particulate event. Personnel evacuated from 500m zone. Levels normalized after 75 min.', slaMinutes: 15 },
    { id: 'INC-005', alertId: 'alert-aquifer', title: 'Aquifer Depth Critical — PIZ-E04', severity: 'critical', triggeredAt: '2026-03-25T08:30:00Z', acknowledgedAt: '2026-03-25T08:33:00Z', resolvedAt: '2026-03-25T11:00:00Z', status: 'resolved', assignee: 'Dr. L. Oliveira (Hydro.)', responseNote: 'Seasonal drawdown event. Pumping throttled 20%. East margin piezometer stabilized at +1.8m delta.', slaMinutes: 15 },
  ])

  /* ─── Audit Trail ─────────────────────────────────────────────────── */
  function sha256Stub(input: string): string {
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i)
      h0 = (h0 ^ (c * 0x01000193)) >>> 0; h1 = (h1 ^ ((c << 8) * 0x01000193)) >>> 0
      h2 = (h2 ^ ((c << 16) * 0x811c9dc5)) >>> 0; h3 = (h3 ^ ((c << 24) * 0x01000193)) >>> 0
      h4 = ((h4 << 5) - h4 + c) >>> 0; h5 = ((h5 << 7) ^ (c * 0x5bd1e995)) >>> 0
      h6 = ((h6 >>> 3) ^ (c * 0x1b873593)) >>> 0; h7 = ((h7 << 11) ^ (c * 0xcc9e2d51)) >>> 0
    }
    return [h0, h1, h2, h3, h4, h5, h6, h7].map(v => v.toString(16).padStart(8, '0')).join('')
  }

  setDomainState('audit_trail', [
    { id: 'AUD-001', timestamp: '2026-04-06T08:00:00Z', type: 'system_event', actor: 'System', action: 'Aether OS instance started', detail: 'Production environment boot — all sensor feeds connected.', hash: sha256Stub('AUD-001-system-start') },
    { id: 'AUD-002', timestamp: '2026-04-06T08:02:14Z', type: 'compliance_check', actor: 'System', action: 'FEOC compliance sweep completed', detail: 'Full supply chain re-verified against FEOC database. 0 flagged entities. 47 suppliers checked.', hash: sha256Stub('AUD-002-feoc-sweep') },
    { id: 'AUD-003', timestamp: '2026-04-05T16:30:00Z', type: 'batch_created', actor: 'J. Santos (Process Eng.)', action: 'Batch BATCH-MREC-8X9 initiated', detail: 'MREC precipitation run started. Feed material from Capão do Mel pit.', hash: sha256Stub('AUD-003-batch-create'), relatedEntityId: 'BATCH-MREC-8X9' },
    { id: 'AUD-004', timestamp: '2026-04-05T14:12:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'pH exceedance alert triggered', detail: 'Leach circuit pH rose to 5.12, exceeding 5.0 threshold.', hash: sha256Stub('AUD-004-alert-ph'), relatedEntityId: 'alert-ph-high' },
    { id: 'AUD-005', timestamp: '2026-04-05T14:58:00Z', type: 'alert_resolved', actor: 'J. Santos (Process Eng.)', action: 'pH exceedance alert resolved', detail: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4.', hash: sha256Stub('AUD-005-alert-resolve'), relatedEntityId: 'alert-ph-high' },
    { id: 'AUD-006', timestamp: '2026-04-04T10:00:00Z', type: 'passport_issued', actor: 'Aether OS', action: 'Digital Battery Passport DBP-2026-0042 issued', detail: 'EU-compliant DBP JSON payload generated for batch BATCH-MREC-7W2.', hash: sha256Stub('AUD-006-dbp-issue'), relatedEntityId: 'BATCH-MREC-7W2' },
    { id: 'AUD-007', timestamp: '2026-04-04T10:05:00Z', type: 'api_handoff', actor: 'Aether OS', action: 'DBP payload pushed to Ucore SAP', detail: 'Automated ABI pre-filing to US CBP. HTTP 200.', hash: sha256Stub('AUD-007-api-push'), relatedEntityId: 'ucore' },
    { id: 'AUD-008', timestamp: '2026-04-03T09:10:00Z', type: 'alert_triggered', actor: 'Sensor Array', action: 'Sulfate containment critical alert', detail: 'Discharge sulfate reached 247 ppm, approaching 250 ppm regulatory limit.', hash: sha256Stub('AUD-008-sulfate-alert') },
    { id: 'AUD-009', timestamp: '2026-04-03T10:45:00Z', type: 'alert_resolved', actor: 'M. Costa (Env. Manager)', action: 'Sulfate containment resolved', detail: 'Discharge flow reduced 30%. Contingency filtration activated. Sulfate dropped to 218 ppm.', hash: sha256Stub('AUD-009-sulfate-resolve') },
    { id: 'AUD-010', timestamp: '2026-04-02T11:30:00Z', type: 'regulatory_submission', actor: 'VP Environment', action: 'Additional hydrological data submitted to FEAM', detail: 'Piezometer data package (Q1 2026) and updated hydrological model delivered.', hash: sha256Stub('AUD-010-feam-submit'), relatedEntityId: 'REG-03' },
    { id: 'AUD-011', timestamp: '2026-04-01T09:00:00Z', type: 'compliance_check', actor: 'System', action: 'SOC 2 Type II automated audit cycle', detail: 'Continuous compliance checks passed. 0 findings.', hash: sha256Stub('AUD-011-soc2-audit') },
    { id: 'AUD-012', timestamp: '2026-03-28T12:20:00Z', type: 'alert_resolved', actor: 'R. Ferreira (HSE)', action: 'UDC radiation event resolved', detail: 'Wind-carried particulate event. Levels normalized after 75 min.', hash: sha256Stub('AUD-012-radiation-resolve') },
    { id: 'AUD-013', timestamp: '2026-03-25T08:33:00Z', type: 'user_action', actor: 'Dr. L. Oliveira (Hydro.)', action: 'Pumping throttle applied — PIZ-E04', detail: 'Seasonal drawdown event. Pumping reduced 20%.', hash: sha256Stub('AUD-013-pump-throttle') },
    { id: 'AUD-014', timestamp: '2026-03-20T15:00:00Z', type: 'offtake_update', actor: 'VP Commercial', action: 'Neo Performance LOI executed', detail: 'LOI signed for 1,500 tpa TREO. Binding terms contingent on DFS.', hash: sha256Stub('AUD-014-neo-loi'), relatedEntityId: 'neo' },
    { id: 'AUD-015', timestamp: '2026-03-15T10:00:00Z', type: 'batch_created', actor: 'A. Lima (Operations)', action: 'Batch BATCH-MREC-7W2 initiated', detail: 'MREC precipitation run started. Feed material from Soberbo pit.', hash: sha256Stub('AUD-015-batch-create'), relatedEntityId: 'BATCH-MREC-7W2' },
  ])

  /* ─── ESG Frameworks ──────────────────────────────────────────────── */
  setDomainState('esg_frameworks', [
    { id: 'gri-303', name: 'GRI 303: Water & Effluents', standard: 'GRI', category: 'water', coverage_pct: 92, metrics: [
      { metric: 'Water withdrawal by source', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Water recycled and reused', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Water discharge quality', dashboardSource: 'FieldView → Hydro Twin → Sulfate/Nitrate ppm', status: 'mapped' },
      { metric: 'Water stress area assessment', dashboardSource: 'FieldView → Hydro Twin → 1092 Springs Monitor', status: 'mapped' },
    ] },
    { id: 'gri-306', name: 'GRI 306: Waste', standard: 'GRI', category: 'waste', coverage_pct: 78, metrics: [
      { metric: 'Waste generated', dashboardSource: 'FieldView → Operations → Dry-stack tailings volume', status: 'mapped' },
      { metric: 'Waste diverted from disposal', dashboardSource: 'FieldView → Operations → Recirculation %', status: 'mapped' },
      { metric: 'Significant spills', dashboardSource: 'Alert Panel → Incident Log', status: 'mapped' },
      { metric: 'Hazardous waste transport', dashboardSource: 'Not applicable (ionic clay)', status: 'partial' },
    ] },
    { id: 'sasb-em-mm', name: 'SASB EM-MM: Metals & Mining', standard: 'SASB', category: 'governance', coverage_pct: 85, metrics: [
      { metric: 'GHG Scope 1 + 2 emissions', dashboardSource: 'BuyerView → Green Premium → Carbon Intensity', status: 'mapped' },
      { metric: 'Total fresh water withdrawn', dashboardSource: 'FieldView → Hydro Twin → Flow Metrics', status: 'mapped' },
      { metric: 'Community engagement & permits', dashboardSource: 'ExecutiveView → DFS → Regulatory Log', status: 'mapped' },
      { metric: 'Workforce health & safety', dashboardSource: 'Alert Panel → Incident Log → SLA Metrics', status: 'partial' },
      { metric: 'Reserves & resource estimation', dashboardSource: 'ExecutiveView → Assets → Geology Panel', status: 'mapped' },
    ] },
    { id: 'tcfd', name: 'TCFD: Climate-Related Disclosures', standard: 'TCFD', category: 'climate', coverage_pct: 70, metrics: [
      { metric: 'Governance: Board oversight of climate risks', dashboardSource: 'ExecutiveView → Risk Register', status: 'mapped' },
      { metric: 'Strategy: Climate scenario analysis', dashboardSource: 'FieldView → Hydro Twin → Predictive Modeling', status: 'mapped' },
      { metric: 'Risk management: Integration of climate risk', dashboardSource: 'ExecutiveView → Risk Register → Environmental', status: 'mapped' },
      { metric: 'Metrics: Scope 3 emissions tracking', dashboardSource: 'BuyerView → Scope 3 Reagent Provenance', status: 'partial' },
    ] },
    { id: 'issb-s2', name: 'ISSB S2: Climate Disclosures', standard: 'ISSB', category: 'climate', coverage_pct: 62, metrics: [
      { metric: 'Physical climate risk assessment', dashboardSource: 'FieldView → Hydro Twin → Drought Forecast 2030–2050', status: 'mapped' },
      { metric: 'Transition risk: Commodity price sensitivity', dashboardSource: 'ExecutiveView → Financials → Sensitivity Table', status: 'mapped' },
      { metric: 'Cross-industry emissions metrics', dashboardSource: 'BuyerView → Competitive Benchmarks → CO₂/t', status: 'mapped' },
      { metric: 'Financed emissions', dashboardSource: 'Not yet tracked — requires EXIM/EFA integration', status: 'pending' },
    ] },
  ])

  /* ─── Deposit Data ────────────────────────────────────────────────── */
  setDomainState('deposit_data', [
    { id: 'capao-do-mel', name: 'Capão do Mel', status: 'measured', treo_ppm: 3034, mreo_pct: 24, tonnage_mt: 85, clay_depth_avg_m: 23.4, clay_depth_max_m: 50, area_km2: 9.9, dimensions: '2,600 × 3,800 m', orientation: 'NE-SW', resource_note: 'Total 85 Mt. High-grade core 36 Mt @ 4,345 ppm TREO.', center: [-46.565, -21.848] },
    { id: 'soberbo', name: 'Soberbo', status: 'indicated', treo_ppm: 2601, mreo_pct: 26, tonnage_mt: 229, clay_depth_avg_m: 16.9, clay_depth_max_m: 77.4, area_km2: 9.9, dimensions: '2,600 × 3,800 m', orientation: 'NE-SW', resource_note: 'Highest-grade hub: 229 Mt @ 2,601 ppm TREO.', center: [-46.615, -21.882] },
    { id: 'figueira', name: 'Figueira', status: 'indicated', treo_ppm: 2480, mreo_pct: 23, tonnage_mt: 44, clay_depth_avg_m: 28.2, clay_depth_max_m: 62.5, area_km2: 3.1, dimensions: '2,600 × 1,200 m', orientation: 'N-S', resource_note: 'Included in 20-year mine plan.', center: [-46.590, -21.818] },
    { id: 'barra-do-pacu', name: 'Barra do Pacu', status: 'indicated', treo_ppm: 2204, mreo_pct: 22, tonnage_mt: 389, clay_depth_avg_m: 29.2, clay_depth_max_m: 50, area_km2: 7.6, dimensions: '1,900 × 4,000 m', orientation: 'N-S', resource_note: 'Maiden resource Apr 2025 (389 Mt total).', center: [-46.555, -21.878] },
    { id: 'agostinho', name: 'Agostinho', status: 'exploration', treo_ppm: 5200, mreo_pct: 30, tonnage_mt: 0, clay_depth_avg_m: 0, clay_depth_max_m: 24, area_km2: 5.0, dimensions: '~2,000 × 2,500 m', orientation: 'N-S', resource_note: '116 holes. Peak 19,183 ppm TREO.', center: [-46.520, -21.778] },
    { id: 'cupim-vermelho-norte', name: 'Cupim Vermelho Norte', status: 'inferred', treo_ppm: 2200, mreo_pct: 24, tonnage_mt: 340, clay_depth_avg_m: 20, clay_depth_max_m: 55, area_km2: 13.0, dimensions: '2,600 × 5,000 m', orientation: 'NW-SE', resource_note: 'Largest resource block by area.', center: [-46.5855, -21.7229] },
    { id: 'dona-maria', name: 'Dona Maria 1 & 2', status: 'inferred', treo_ppm: 2100, mreo_pct: 23, tonnage_mt: 226, clay_depth_avg_m: 18, clay_depth_max_m: 45, area_km2: 2.4, dimensions: '500 × 4,800 m', orientation: 'E-W', resource_note: 'Narrow high-grade corridor.', center: [-46.546, -21.7485] },
  ])

  /* ─── Hydrology Scenarios ─────────────────────────────────────────── */
  setDomainState('hydrology_scenarios', [
    { horizon: '2030 drought case', drought_index: 0.42, recirculation_pct: 95.2, spring_preservation_pct: 97, active_springs: 1059, sulfate_guardband_ppm: 78, permitting_signal: 'Copam-ready', recommendation: 'Maintain dry-stacking and current drawdown caps.', status: 'stable' },
    { horizon: '2040 severe dry cycle', drought_index: 0.58, recirculation_pct: 95.8, spring_preservation_pct: 95, active_springs: 1037, sulfate_guardband_ppm: 61, permitting_signal: 'Monitor closely', recommendation: 'Add contingency wells and seasonal pumping throttles.', status: 'watch' },
    { horizon: '2050 plateau stress test', drought_index: 0.71, recirculation_pct: 96.4, spring_preservation_pct: 93, active_springs: 1016, sulfate_guardband_ppm: 44, permitting_signal: 'Needs mitigation package', recommendation: 'Pre-negotiate adaptive operating envelope before LI hearing.', status: 'action' },
  ])

  /* ─── Scale-Up Pathway ────────────────────────────────────────────── */
  setDomainState('scale_up_pathway', {
    pilot_name: 'CIP pilot circuit', pilot_throughput_kg_hr: 25,
    current_digital_coverage_pct: 91, commercial_target_mtpa: 6.0,
    water_recirculation_target_pct: 95, springs_monitored: 1092,
    board_message: 'Use pilot telemetry and mocked predictive scenarios to prove Caldeira can scale without losing environmental legitimacy.',
  })

  /* ─── Hardware Sensors ────────────────────────────────────────────── */
  setDomainState('hardware_sensors', [
    { category: 'Core Process Sensors', items: [
      { name: 'Ultrasonic Flow Meters', location: 'Clamped onto exterior of water intake/outflow pipes', measures: '95% water recirculation', frequency: '2s' },
      { name: 'Industrial pH & ORP Probes', location: 'Dropped directly into leaching vats', measures: 'pH 4.0–5.0 maintenance', frequency: '2s' },
      { name: 'Inline XRF Analyzers', location: 'MREC precipitation output', measures: '>90% TREO grade', frequency: 'Per batch' },
    ] },
    { category: 'Environmental & Regulator (MPF)', items: [
      { name: 'Ion-Selective Electrodes', location: 'Wastewater discharge', measures: 'Trace nitrates + sulfates', frequency: '10s' },
      { name: 'Telemetry Piezometers', location: 'Groundwater monitoring wells', measures: 'Hydrostatic pressure', frequency: '10s' },
      { name: 'Scintillation Detectors', location: 'UDC legacy site perimeter', measures: 'Gamma radiation (μSv/h)', frequency: '10s' },
    ] },
  ])

  /* ─── Cyber Trust Pillars ─────────────────────────────────────────── */
  setDomainState('cyber_pillars', [
    { title: 'Zero-Trust Edge Gateways', detail: 'IoT gateways utilize hardware-based TEEs to encrypt data before it leaves the sensor array.', status: 'Active', protocol: 'TEE + mTLS' },
    { title: 'Data Sovereignty', detail: 'All servers processing defense-bound material localized in allied jurisdictions.', status: 'Enforced', protocol: 'Geo-fenced routing' },
    { title: 'SOC 2 Type II Compliance', detail: 'Continuous automated auditing proving data security, availability, and processing integrity.', status: 'Compliant', protocol: 'Automated audit trail' },
    { title: 'Immutable Ledger', detail: 'Molecular-to-Magnet timeline hashed onto permissioned enterprise blockchain.', status: 'Active', protocol: 'Permissioned blockchain' },
  ])

  /* ─── API Handoffs ────────────────────────────────────────────────── */
  setDomainState('api_handoffs', [
    { system: 'US CBP Filing', endpoint: 'POST /v1/customs/us-cbp/attestations', payload: 'Digital origin affidavit + FEOC score + carbon intensity', status: 'delivered', latency_ms: 420, last_sync: '2026-04-06T03:14:00Z' },
    { system: 'Ucore SAP SMC', endpoint: 'POST /v1/partners/ucore/sap-batch-ledger', payload: 'Batch passport + assay + chain-of-custody hash', status: 'delivered', latency_ms: 610, last_sync: '2026-04-06T03:15:26Z' },
    { system: 'Neo Passport Inbox', endpoint: 'POST /v1/partners/neo/eu-dbp', payload: 'QR-ready battery passport bundle', status: 'queued', latency_ms: 890, last_sync: '2026-04-06T03:17:12Z' },
    { system: 'Board Audit Vault', endpoint: 'GET /v1/audit/caldera-risk-room', payload: 'Permit pack + hydrology scenarios + immutable event log', status: 'verified', latency_ms: 180, last_sync: '2026-04-06T03:18:40Z' },
  ])

  /* ─── Scope 3 Tracking ────────────────────────────────────────────── */
  setDomainState('scope3_tracking', {
    reagent: 'Ammonium Sulfate (NH₄)₂SO₄', supplier: 'AdvanSix Inc.',
    supplier_origin: 'Hopewell, Virginia, USA',
    feoc_status: 'Clear — no FEOC-flagged entities in ownership chain',
    verification_method: 'EDI/API integration with supplier ERP systems',
    carbon_footprint_kg: 0.94,
    sanctions_check: 'Cross-referenced against U.S. FEOC database',
    risk_note: 'If (NH₄)₂SO₄ is sourced from a FEOC-flagged supplier, the green premium is destroyed.',
    supply_chain: [
      { step: 'Manufacture', entity: 'AdvanSix · Hopewell, VA', status: 'verified' },
      { step: 'Shipping', entity: 'FOB Houston → Santos port', status: 'verified' },
      { step: 'Inland transport', entity: 'Bonded truck → Poços de Caldas', status: 'verified' },
      { step: 'Plant intake', entity: 'CIP Pilot Circuit · leach vats', status: 'active' },
    ],
  })

  /* ─── Regulatory Export Bundle ─────────────────────────────────────── */
  setDomainState('regulatory_export_bundle', {
    exportedAt: new Date().toISOString(),
    bannerNote: 'Live pipeline — Aether Simulation Engine',
    regulatoryLog: getDomainState('regulatory_log'),
    auditEvents: (getDomainState<Array<{ id: string; type: string }>>('audit_trail') ?? [])
      .filter(e => e.type === 'regulatory_submission' || e.id === 'AUD-008' || e.id === 'AUD-009' || e.id === 'AUD-010'),
    permittingRisks: (getDomainState<Array<{ category: string; id: string }>>('risks') ?? [])
      .filter(r => r.category === 'permitting' || r.id === 'R01'),
    provenanceSummary: 'Illustrative bundle for briefing. Replace with signed PDFs and portal exports for official use.',
  })

  /* ─── Spring Events ───────────────────────────────────────────────── */
  setDomainState('spring_events', [
    { springId: 'spring-0001', ts: '2026-03-18T14:00:00Z', type: 'field_visit', note: 'Quarterly flow — within seasonal band' },
    { springId: 'spring-0006', ts: '2026-03-25T08:00:00Z', type: 'sensor_proxy', note: 'PIZ-E04 drawdown correlated; spring class held Active→watch' },
    { springId: 'spring-0014', ts: '2026-03-24T11:00:00Z', type: 'model_refresh', note: 'Twin recalibrated after east-margin piezo stress' },
    { springId: 'spring-0002', ts: '2026-03-20T09:00:00Z', type: 'audit_note', note: 'CAR geometry verified against FBDS point' },
  ])

  console.log('[seed] Domain state seeded successfully.')
}
