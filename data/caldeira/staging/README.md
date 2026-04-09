# Caldeira GeoJSON staging

Authoritative **tabular** inputs for `npm run build:caldeira-geojson`. PDFs are not committed; paste appendix extracts here after each ASX release.

See also:

- [`SCHEMA.md`](SCHEMA.md) — column definitions and ID rules
- [`docs/data/caldeira/PDF_APPENDIX_INDEX.md`](../../docs/data/caldeira/PDF_APPENDIX_INDEX.md) — which PDF page maps to which file

## Files

| File | Purpose |
|------|---------|
| [`../../scripts/caldeira-build/sources/jan2024Rows.ts`](../../scripts/caldeira-build/sources/jan2024Rows.ts) | Diamond drill collars from ASX **02766588** Table 2 (UTM) |
| `appendix_02909601_agostinho_ac_collars.txt` | Raw lines from **02909601** Appendix 1 |
| `appendix_02909601_agostinho_intercepts.txt` | Raw lines from **02909601** Appendix 2 (intercept summary) |
| `dd_intercept_highlights.json` | Headline intercept copy for DD holes (JORC tables / prior UI) |
| `licence_metrics.csv` | Licence-level MRE notes from **02933327** Table 1 |

## Refresh

1. Add or edit staging files.
2. From repo root: `npm run build:caldeira-geojson`
3. Commit regenerated `src/data/geojson/caldeira-drillholes.geojson` and `caldeira-licenses.geojson`.
4. Update `docs/data/caldeira/DATA_SOURCES.md` dates.
