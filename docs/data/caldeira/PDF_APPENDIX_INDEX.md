# ASX PDF appendix index — Caldeira extraction

Index of Meteoric (ASX: MEI) PDFs referenced for GeoJSON staging. Use with [`data/caldeira/staging/README.md`](../../../data/caldeira/staging/README.md) and `npm run build:caldeira-geojson`.

| File / ID | ASX date | Appendix / table | Content type | Datum / CRS notes |
|-----------|----------|------------------|--------------|-------------------|
| **02614652** | 20 Dec 2022 | Fig 1–3, body | Regional geology, 30 licences narrative (21 + 9 applications), metallurgy context | Illustrative maps — not survey grids |
| **02621685** | 17 Jan 2023 | Table 1 | Historic auger twin list (prospect, hole #, EOH, TREO) — **no collar UTM** in main text | Check full PDF for any collar appendix |
| **02663422** | 8 May 2023 | Fig 1, Table 1 | Drilling progress, auger vs DD depth comparison | Fig 1: licence/MRE context on imagery |
| **02705559** | 31 Aug 2023 | Tables 1–2, **Appendix 1** (collars) | Intercepts brownfields/greenfields; collar table cited | **SIRGAS 2000, UTM zone 23S** (JORC text) |
| **02766588** | 30 Jan 2024 | **Table 2** (pp. 12–13) | DD collar locations: target, type, hole ID, depth, easting, northing, elevation, status | **SIRGAS_2000_23S** (footnote p. 13) |
| **02909601** | 5 Feb 2025 | **Appendix 1** (pp. 8–9), **Appendix 2** (p. 10+), Appendix 3 (tenure) | AC collars (116 holes); mineralised intercept table; tenure list ref | **SIRGAS 2000 / UTM z23S** (Appendix 1 footnote) |
| **02933327** | 7 Apr 2025 | Table 1 | Mineral Resource **by licence** (Mt, TREO ppm, oxides, JORC category) | Tabular only — sync `caldeira-licenses.geojson` **properties** |
| **02969114** | 21 Jul 2025 | Body + embedded tables | PFS metrics, reserve narrative, drilling/sample counts | Cross-check scalars; figures often non-survey |
| **02969122** | Jul 2025 deck | Slides + disclaimer | Citation index to prior ASX dates | Maps illustrative unless georeferenced |

## Build inputs committed in repo

| Staging asset | Source PDF | Purpose |
|---------------|------------|---------|
| [`scripts/caldeira-build/sources/jan2024Rows.ts`](../../../scripts/caldeira-build/sources/jan2024Rows.ts) | 02766588 Table 2 | Diamond drill collars (UTM) |
| [`data/caldeira/staging/appendix_02909601_agostinho_ac_collars.txt`](../../../data/caldeira/staging/appendix_02909601_agostinho_ac_collars.txt) | 02909601 Appendix 1 | Aircore collar lines (parsed at build) |
| [`data/caldeira/staging/appendix_02909601_agostinho_intercepts.txt`](../../../data/caldeira/staging/appendix_02909601_agostinho_intercepts.txt) | 02909601 Appendix 2 | Per-hole intercept summary for Agostinho AC |
| [`data/caldeira/staging/licence_metrics.csv`](../../../data/caldeira/staging/licence_metrics.csv) | 02933327 Table 1 | Licence-level MRE text fields |

## Refresh workflow

1. Obtain new ASX PDF → add rows to staging JSON/CSV/txt (or new file per announcement).
2. Run `npm run build:caldeira-geojson`.
3. Update [`DATA_SOURCES.md`](DATA_SOURCES.md) `retrieved_on` and citation rows.
4. Run `npm run test:run` (includes GeoJSON schema tests).
