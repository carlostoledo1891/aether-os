# Staging schema — Caldeira build

## `jan2024Rows.ts` (`JAN_2024_DD_ROWS`)

Typed tuple rows expanded at build time to collar records:

| Field | Type | Description |
|-------|------|-------------|
| `target` | string | Prospect name as in ASX appendix (used to derive `deposit` slug) |
| `holeType` | `"DD"` | Drill type |
| `holeId` | string | Hole ID (canonical form) |
| `depthM` | number | Total depth (m) |
| `easting` | number | UTM easting (m), no commas |
| `northing` | number | UTM northing (m) |
| `elevationM` | number | Collar RL (m) |
| `asxStatus` | string | e.g. `This Release`, `Previously Reported` |

Build adds `sourceDoc: 02766588` and `publishedDate: 2024-01-30` for all rows.

**CRS:** SIRGAS 2000 / UTM zone 23S → transformed with **EPSG:31983** to WGS84 for GeoJSON.

## `appendix_02909601_agostinho_ac_collars.txt`

One record per line, space-separated fields (from PDF text extraction):

`Agostinho AC AGOAC#### <Easting> <Northing> <Elevation> <Depth> -90 360`

- Easting/northing may include commas (`335,776`).

## `appendix_02909601_agostinho_intercepts.txt`

Lines matching:

`Agostinho AGOAC#### <from> <to> <interval> <TREO> <MREO> <pct%> <summary text>`

- TREO/MREO may include commas.

## `dd_intercept_highlights.json`

Array of:

| Field | Type |
|-------|------|
| `holeId` | string (canonical) |
| `deposit` | slug (`capao-do-mel`, …) |
| `treo_ppm` | number |
| `mreo_pct` | number (0–100) |
| `depth_m` | number (reported mineralised interval or EOH as in UI) |
| `intercept` | string |
| `including` | string (optional) |
| `campaign` | `2022-infill` \| `2023-infill` \| `2024-resource` \| `2025-pfs` \| `2025-discovery` |

## `licence_metrics.csv`

Header:

```text
licence_id,note,resource_category,total_mt,as_of,source_ref
```

- `licence_id` must match `properties.id` in `caldeira-licenses.geojson` (e.g. `LIC-CDM-01`).
- Empty lines and `#` comments allowed (skipped by builder).

## Hole ID normalisation

1. Uppercase.
2. Remove hyphens and spaces.
3. Aliases: `CVSDD001` → `CVSDD0001` (historic press table variant).

Duplicate `holeId` after normalisation: **last row wins** when sorted by `(publishedDate, sourceDoc)`.

## `source_document` (conceptual)

Every collar row carries `sourceDoc` + `publishedDate` for merge ordering. Intercepts use the same hole id to join.
