/**
 * Versioned public / issuer-facing facts for executive UI and citations.
 * See docs/data/caldeira/DATA_SOURCES.md — replace figures when ASX announcements update.
 */
export interface DataCitation {
  label: string
  url?: string
  retrieved: string
}

export interface IssuerSnapshot {
  as_of: string
  /** Mineral resource headline — align with latest JORC table on ASX */
  resource: {
    global_bt: number
    global_treo_ppm: number
    measured_indicated_bt: number
    inferred_bt: number
    citation: DataCitation
  }
  /** Corporate website / annual report style footprint (cross-check ANM) */
  projectFootprint: {
    licence_count_narrative: number
    area_km2_narrative: number
    citation: DataCitation
  }
  /** PFS-aligned economics already in mock scenarios — narrative only */
  economics: {
    pfs_document_label: string
    sensitivity_aligned: boolean
    citation: DataCitation
  }
  /** Stakeholder / disclosure context (not license outcomes) */
  stakeholder: {
    lp_summary: string
    lp_citation: DataCitation
    mpf_summary: string
    mpf_citation: DataCitation
  }
}

/** Static snapshot bundled with the app — update on each material announcement */
export const CALDEIRA_ISSUER_SNAPSHOT: IssuerSnapshot = {
  as_of: '2026-04-07',
  resource: {
    global_bt: 1.537,
    global_treo_ppm: 2359,
    measured_indicated_bt: 0.703,
    inferred_bt: 0.834,
    citation: {
      label: 'Aligned to in-app RESOURCE_CLASSIFICATION / deposit tables — verify against latest ASX mineral resource announcement',
      url: 'https://wcsecure.weblink.com.au/pdf/MEI/02969122.pdf',
      retrieved: '2026-04-07',
    },
  },
  projectFootprint: {
    licence_count_narrative: 69,
    area_km2_narrative: 193,
    citation: {
      label: 'Meteoric — Projeto Caldeira (public narrative)',
      url: 'https://meteoric.com.au/pt-pt/projeto-calderia/',
      retrieved: '2026-04-07',
    },
  },
  economics: {
    pfs_document_label: 'Caldeira PFS (Jul 2025) — sensitivity table mirrored in Financials tab',
    sensitivity_aligned: true,
    citation: {
      label: 'PFS PDF (third-party index)',
      url: 'https://minedocs.com/29/Caldeira-PFS-07212025.pdf',
      retrieved: '2026-04-07',
    },
  },
  stakeholder: {
    lp_summary:
      'Press reports COPAM unanimous preliminary license (LP) for Caldeira in Dec 2025, allowing LI application pathway — confirm against issuer filings and FEAM records.',
    lp_citation: {
      label: 'Minera Brasil — Copam LP Caldeira / Colossus',
      url: 'https://minerabrasil.com.br/copam-concede-licenca-previa-a-projetos-de-terras-raras-da-viridis-e-meteoric-no-sul-de-minas-gerais/2025/12/22/',
      retrieved: '2026-04-07',
    },
    mpf_summary:
      'MPF (Nov 2025) published recommendations on plateau rare-earth licensing (cumulative impacts, UDC proximity, consultation). This is prosecutorial input, not a permit decision.',
    mpf_citation: {
      label: 'MPF / PR-MG — recomendação retirada de pauta',
      url: 'https://www.mpf.mp.br/o-mpf/unidades/pr-mg/noticias/mpf-recomenda-a-retirada-de-pauta-de-votacao-de-processos-de-licenciamento-sobre-terras-raras-em-mg',
      retrieved: '2026-04-07',
    },
  },
}
