# Vero — Integration Guide

**Purpose:** Technical guide for partners integrating with the Vero platform API. Covers authentication, endpoint catalog, WebSocket lifecycle, error handling, and LAPOC as a reference implementation.

**API Base URL:** `https://your-instance.vero.earth` (or `http://localhost:3001` in development)  
**OpenAPI Spec:** `{base}/api/docs` (Swagger UI) | `{base}/api/docs/json` (raw spec)  
**Last updated:** 2026-04-13

---

## 1. Authentication

### API Key Authentication

All protected endpoints require an `x-api-key` header.

```http
GET /api/telemetry/current HTTP/1.1
Host: api.vero.earth
x-api-key: your-api-key-here
```

### Key Types

| Key | Environment Variable | Scope | Required In |
|-----|---------------------|-------|------------|
| **Ingest** | `INGEST_API_KEY` | `POST /ingest/*` endpoints | Production (fails closed if unset) |
| **Chat** | `CHAT_API_KEY` | `POST /api/chat`, `POST /api/chat/upload` | Production |
| **Admin** | `ADMIN_API_KEY` | `POST /api/alerts/dismiss/*` | When set (optional) |
| **WebSocket** | `WS_API_KEY` | `GET /ws/telemetry` | Production (falls back to `INGEST_API_KEY`) |

### WebSocket Authentication

Connect with a token query parameter or `x-api-key` header upgrade:

```
ws://api.vero.earth/ws/telemetry?token=your-ws-api-key
```

In development (non-production), WebSocket connections are accepted without authentication.

### Future: OAuth2 / OIDC

RBAC with JWT/OIDC is on the roadmap. See `docs/architecture/rbac-design.md` for the planned scope model. When implemented, API keys will be supplemented (not replaced) by bearer tokens with scope-based access.

---

## 2. Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| **Global** | 120 requests | 1 minute |
| **Ingest** | 60 requests | 1 minute |
| **Chat** | 10 requests | 1 minute |
| **Chat Upload** | 5 requests | 1 minute |
| **Historical Weather Ingest** | 10 requests | 1 minute |

Rate limit headers are returned on every response:

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 118
X-RateLimit-Reset: 1713024060
```

When rate-limited, you receive `429 Too Many Requests`. Retry with exponential backoff.

---

## 3. Endpoint Catalog

### Health

```http
GET /api/health
```

Returns server uptime, version, and database status. No authentication required.

### Telemetry (Real-Time)

```http
GET /api/telemetry/current
GET /api/telemetry/history?range=24h|7d|30d
GET /api/telemetry/channels
```

Returns current plant/environmental telemetry, historical time series, and sensor channel metadata.

### Domain Data

```http
GET /api/batches                    # All compliance batches
GET /api/batches/:id                # Single batch
GET /api/risks                      # Risk register
GET /api/incidents                  # Incident log
GET /api/regulatory                 # Regulatory log
GET /api/esg                        # ESG framework coverage
GET /api/benchmarks                 # Competitive benchmarks
GET /api/stakeholders               # Stakeholder register
GET /api/offtakers                  # Off-taker pipeline
```

### Project Data

```http
GET /api/project/financials         # Project financials (PFS-aligned)
GET /api/project/deposits           # Deposit data
GET /api/project/resources          # JORC resource classification
GET /api/project/hydrology          # Hydrology scenarios
GET /api/project/plant-performance  # Pilot plant performance
GET /api/project/safety             # U/Th radioactivity safety
GET /api/project/thresholds         # Environmental thresholds
GET /api/project/springs/count      # Spring monitoring count
GET /api/project/hardware-sensors   # Sensor inventory
GET /api/project/cyber-pillars      # Cybersecurity posture
GET /api/project/scope3             # Scope 3 emissions
```

### Financial Scenarios

```http
GET /api/financials/scenario/bear
GET /api/financials/scenario/consensus
GET /api/financials/scenario/bull
GET /api/financials/sensitivity     # NPV sensitivity table
GET /api/capital                    # Capital tracker
GET /api/capital/dscr               # DSCR projections
GET /api/capital/drawdown           # Drawdown schedule
GET /api/pricing                    # Pricing model
GET /api/market-sizing              # TAM/SAM/SOM
```

### Enricher Data (External Sources)

```http
GET /api/weather/current            # Open-Meteo current weather
GET /api/weather/forecast           # 16-day forecast
GET /api/weather/historical         # ERA5 climate history
GET /api/market/fx                  # BRL/USD (BCB PTAX)
GET /api/market/stock               # MEI.AX (Alpha Vantage)
GET /api/seismic/recent             # USGS seismic events
GET /api/lapoc/latest               # LAPOC field instruments
```

Source governance policy for map layers:
- **Geology:** GeoSGB, SIGMINE, ANM
- **Hydrology:** SNIRH Hidroweb, CNEN/LAPOC
- **Weather:** INMET, OpenWeather, Open-Meteo
- Deprecated geology overlays (Macrostrat, USGS REE) are no longer part of supported integrations.
- The frontend should consume Caldeira geology/hydrology overlays from normalized local snapshots, not direct browser WMS/ArcGIS requests.
- Where richer inspection is required, the app may issue server-proxied ArcGIS identify/query requests for approved layers while keeping the rendered layer snapshot-backed.
- External layer capabilities now live in the shared Caldeira layer manifest: render mode, identify mode, legend metadata, and snapshot source ids are declared per layer.
- If an upstream refresh fails, keep serving the last successful snapshot instead of falling back to the live provider.
- Refresh the current external layer snapshots with `npm run build:caldeira-external-snapshots`.

### Audit & Integrity

```http
GET /api/audit                      # All audit events (filterable: ?type=)
GET /api/audit/:eventId             # Single audit event
GET /api/audit/verify-chain         # Verify SHA-256 chain integrity
GET /api/audit/export               # Full chain download (JSON)
```

### Exports

```http
GET /api/export/dpp/:batchId        # EU DPP export (CEN/CENELEC schema)
GET /api/export/regulatory          # Regulatory bundle (JSON)
GET /api/dpp/validate               # DPP schema validation
```

### Context & Provenance

```http
GET /api/context                    # Data mode, banner, active sources
GET /api/provenance                 # Provenance profile per data area
GET /api/issuer-snapshot            # Issuer snapshot (ASX citation)
GET /api/spatial-insights           # Spatial analysis (APA overlap)
GET /api/security/sbom-summary      # SBOM summary
```

### Ingest (Engine → API)

All ingest endpoints require `INGEST_API_KEY`:

```http
POST /ingest/telemetry              # Plant + env telemetry
POST /ingest/weather                # Open-Meteo weather data
POST /ingest/forecast               # Open-Meteo 16-day forecast
POST /ingest/historical-weather     # ERA5 historical data
POST /ingest/market                 # Market data (FX, stock)
POST /ingest/seismic                # USGS seismic events
POST /ingest/lapoc                  # LAPOC field instrument data
```

---

## 4. WebSocket — Real-Time Telemetry

### Connection

```javascript
const ws = new WebSocket('ws://api.vero.earth/ws/telemetry?token=YOUR_KEY')

ws.onmessage = (event) => {
  const tick = JSON.parse(event.data)
  // tick contains: { plant, env, esg, alerts, timestamp, source, provenance }
}

ws.onclose = (event) => {
  if (event.code === 4401) console.error('Unauthorized')
  if (event.code === 1013) console.warn('Max connections reached')
  // Implement exponential backoff reconnect
}
```

### Message Format

Every 2 seconds, the server broadcasts a telemetry tick:

```json
{
  "source": "engine",
  "provenance": "simulated",
  "timestamp": "2026-04-13T18:30:00Z",
  "plant": {
    "timestamp": "...",
    "flow_metrics": { "in_liters_sec": 145, "out_liters_sec": 142, "recirculation_pct": 95.2 },
    "leaching_circuit": { "ph_level": 4.3, "ammonium_sulfate_ml_min": 12.5 },
    "fjh_separation": { "power_draw_kw": 85, "energy_savings_pct": 87 },
    "output": { "treo_grade_pct": 91.2, "mrec_kg_hr": 2.1, "ndpr_ratio_pct": 24.5 }
  },
  "env": {
    "timestamp": "...",
    "aquifer": { "sensors": [...] },
    "water_quality": { "sulfate_ppm": 180, "nitrate_ppm": 32, "ph_groundwater": 6.8 },
    "legacy_infrastructure": { "radiation_usv_h": 0.14, "udc_status": "Normal" },
    "springs": [...]
  },
  "esg": { "overall": 85, "operator": 88, "regulator": 82, "buyer": 86 },
  "alerts": [...]
}
```

### Connection Limits

- Maximum 100 concurrent WebSocket connections per server instance
- Connections exceeding the limit receive close code `1013`

---

## 5. Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 401 | Unauthorized | Check API key |
| 404 | Not found | Verify endpoint/parameter |
| 429 | Rate limited | Backoff and retry |
| 503 | Service unavailable | Data not yet ingested; retry later |
| 500 | Server error | Report to support |

### Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

In production, 500 errors return a generic message without stack traces.

### WebSocket Close Codes

| Code | Meaning |
|------|---------|
| 1013 | Max connections reached |
| 4401 | Unauthorized (invalid token) |

---

## 6. Reference Implementation: LAPOC Integration

The LAPOC (Laboratorio de Pesquisas do Alcalino de Pocos de Caldas) integration demonstrates the pattern for connecting real field instruments.

See `docs/data/caldeira/LAPOC_INGESTION.md` for the full payload specification.

### Ingestion Flow

```
LAPOC Instrument → CSV/JSON → Adapter Script → POST /ingest/lapoc → API stores → WebSocket broadcast
```

### Key Design Decisions

1. **Adapter pattern:** The adapter normalizes instrument output to the `LapocTelemetryPayload` interface
2. **Provenance tagging:** Real instrument data is tagged `provenance: "verified_real"`, synthetic is tagged `"simulated"`
3. **Automatic UI upgrade:** When real data flows, the provenance system automatically updates the banner and badges — no frontend changes needed
4. **Fallback:** If the instrument goes offline, the engine can resume synthetic generation transparently

---

## 7. Development Environment Setup

### Prerequisites

- Node.js 22+
- npm 10+

### Quick Start

```bash
git clone <repo-url>
npm run install:all       # Install all 3 packages
npm run dev:all           # Start API + engine + frontend

# API: http://localhost:3001
# Frontend: http://localhost:5175
# OpenAPI: http://localhost:3001/api/docs
```

### Environment Variables

Copy `server/.env.example` and configure:

```env
INGEST_API_KEY=your-ingest-key
CHAT_API_KEY=your-chat-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
CORS_ORIGIN=http://localhost:5175
```

---

## 8. Versioning & Stability

- **Current API version:** `0.1.0` (pre-1.0, breaking changes possible)
- **Versioning strategy:** Semantic versioning. Breaking changes will be communicated 30 days in advance post-1.0
- **Deprecation policy:** Deprecated endpoints will return a `Deprecation` header for 90 days before removal
