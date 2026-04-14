# Caldeira layer snapshots

Raw third-party layer downloads live here before normalization.

Guidelines:
- Store provider-specific payloads under a provider subdirectory such as `geosgb/`, `sigmine/`, `anm/`, or `snirh/`.
- Keep the latest raw response plus lightweight metadata about fetch time, upstream URL, and any request parameters.
- Do not import files from this directory directly into the frontend.
- Normalize raw payloads into stable frontend-ready files under `src/data/geojson/external/`.

Suggested layout:

```text
data/caldeira/snapshots/
  geosgb/
    latest.raw.json
    latest.meta.json
  sigmine/
    latest.raw.json
    latest.meta.json
  anm/
    latest.raw.json
    latest.meta.json
  snirh/
    latest.raw.json
    latest.meta.json
```
