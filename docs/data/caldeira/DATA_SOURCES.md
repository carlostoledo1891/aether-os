# Caldeira digital twin — data source registry

Single index for GeoJSON layers and issuer metrics. Extend this table when adding datasets or changing geometry.

| dataset_id | geometry / data | primary_source | retrieved_on | CRS | confidence | notes |
|------------|------------------|----------------|--------------|-----|------------|-------|
| `ops_reality_master` | Mixed | User-authored terrain master FeatureCollection (licences, plants, drills, APA, pit, dump, alkaline complex) | 2026-04-07 | EPSG:4326 | georeferenced_figure | Split into thematic GeoJSON in `src/data/geojson/`; rectangles schematic until ANM vectors. |
| `ops_reality_tenements` | Polygon | Same — per-block mining licence/resource narrative | 2026-04-07 | EPSG:4326 | georeferenced_figure | LIC-* blocks; status narrative (LP/LI/exploration). |
| `ops_reality_collars` | Point | Same — named DD/AC intercepts | 2026-04-07 | EPSG:4326 | georeferenced_figure | Replace collars from ASX CSV appendices when extracted. |
| `ops_reality_plant_sites` | Point | Same — pilot + commercial plant collars | 2026-04-07 | EPSG:4326 | georeferenced_figure | Distinct from logistics rehearsal mesh in `caldeira-infrastructure.geojson`. |
| `ultimate_v1_access_road` | LineString | `Caldeira_Project_Ultimate_v1` (Downloads merge) | 2026-04-07 | EPSG:4326 | approximate | Concept polyline only — not surveyed road centreline. |
| `ultimate_v1_licence_union` | Polygon | Same — 193 km² envelope | 2026-04-07 | EPSG:4326 | georeferenced_figure | Context behind per-LIC polygons; optional map layer. |
| `tenements_southern_lp` | Polygon | COPAM LP narrative + illustrative consolidation | 2026-04-07 | EPSG:4326 | illustrative | Replace with ANM export per concession code when available. |
| `tenements_southern_acquired` | Polygon | Issuer M&A / land package descriptions | 2026-04-07 | EPSG:4326 | illustrative | Align vertices to `anm_tenements` when sourced. |
| `tenements_northern` | Polygon | Northern exploration block narrative | 2026-04-07 | EPSG:4326 | illustrative | |
| `apa_pedra_branca` | Polygon | IEF/APA references; MPF discussion | 2026-04-07 | EPSG:4326 | approximate | Prefer official IEF polygon when obtained. |
| `apa_buffer_3km` | Polygon | Regulatory buffer narrative | 2026-04-07 | EPSG:4326 | approximate | Ring geometry for UI only until official buffer file imported. |
| `water_monitoring_zone` | Polygon | Hydro twin rehearsal | 2026-04-07 | EPSG:4326 | illustrative | |
| `pfs_pit_capao_mel` | Polygon | [Caldeira PFS PDF](https://minedocs.com/29/Caldeira-PFS-07212025.pdf) figures | 2026-04-07 | EPSG:4326 | georeferenced_figure | Georeferenced to basemap + deposit outline. |
| `pfs_processing_plant` | Polygon | PFS site layout figures | 2026-04-07 | EPSG:4326 | georeferenced_figure | Commercial plant footprint — not pilot. |
| `pfs_spent_clay` | Polygon | PFS dry-stack / spent clay layout | 2026-04-07 | EPSG:4326 | georeferenced_figure | |
| `pilot_plant_pocos` | Point | Issuer pilot address + geocode | 2026-04-07 | EPSG:4326 | approximate | Validate against latest investor deck. |
| `udc_inb_reference` | Point | MPF article coordinates narrative | 2026-04-07 | EPSG:4326 | approximate | Reference marker for proximity context — not INB survey. |
| `urban_pocos_caldas` | Polygon | OSM / urban envelope approximation | 2026-04-07 | EPSG:4326 | approximate | Town context for stakeholder maps. |
| `drillholes_caldeira` | Point | ASX/JORC table rehearsal + collar inference | 2026-04-07 | EPSG:4326 | mixed | `hole_type` DD/AC; replace collars from CSV appendices when extracted. |
| `issuer_snapshot_financials` | Scalar metrics | PFS Jul 2025 sensitivity alignment in app | 2026-04-07 | n/a | issuer_attested | Cross-check each release against [ASX/WebLink MEI](https://wcsecure.weblink.com.au/pdf/MEI/02969122.pdf) and subsequent announcements. |
| `issuer_snapshot_resource` | Scalar metrics | Public resource statements | 2026-04-07 | n/a | issuer_attested | **Rule:** latest ASX mineral resource announcement overrides press articles (e.g. older trade press figures). |
| `regulatory_lp_2025_12` | Row | [Minera Brasil — LP Dec 2025](https://minerabrasil.com.br/copam-concede-licenca-previa-a-projetos-de-terras-raras-da-viridis-e-meteoric-no-sul-de-minas-gerais/2025/12/22/) | 2026-04-07 | n/a | public_record | |
| `mpf_recommendation_2025_11` | Row | [MPF MG](https://www.mpf.mp.br/o-mpf/unidades/pr-mg/noticias/mpf-recomenda-a-retirada-de-pauta-de-votacao-de-processos-de-licenciamento-sobre-terras-raras-em-mg) | 2026-04-07 | n/a | public_record | Stakeholder risk context — not a license decision. |

## Key URLs (deduped)

- Meteoric project narrative: https://meteoric.com.au/pt-pt/projeto-calderia/
- PFS (third-party host): https://minedocs.com/29/Caldeira-PFS-07212025.pdf
- WebLink PDFs: `https://wcsecure.weblink.com.au/pdf/MEI/` (multiple announcement IDs)
- CETEM / seminar PDF: `https://www.gov.br/cetem/pt-br/assuntos/VI-Seminario-Brasileiro-de-Terras-Raras/MeteoricProjetoCaldeira_CTEM.pdf`
- Simexmin 2024: https://simexmin.org.br/2024/wp-content/uploads/2024/06/10h10-Simexmin-2024.pdf

## Refresh checklist

1. New ASX resource → update `issuerSnapshot.resource` + `RESOURCE_CLASSIFICATION` if wired.
2. New ANM shapefile → replace `caldeira-licenses.geojson` or add `caldeira-anm-tenements.geojson` and point `LicenseOverlay` at it.
3. New FEAM/COPAM map → re-georeference APA/pits/plant; bump `retrieved_on` and `confidence` here.
