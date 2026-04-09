# Vero — Integration Guide

> For SCADA integrators, process historians, and OT engineers connecting plant telemetry to the Vero platform.

## Architecture Overview

Vero ingests telemetry from industrial sources through a unidirectional HTTP REST API. The platform is designed as a **read-only consumer** of plant data — it never writes back to control systems or modifies historian records.

## Data Flow

```
┌─────────────────────┐     HTTP POST      ┌──────────────────┐
│  Historian / SCADA   │ ──────────────────▶ │  Vero Ingest API │
│  (OSIsoft PI, etc.)  │   /ingest/telemetry │  (Fastify)       │
└─────────────────────┘                     └────────┬─────────┘
                                                     │
                                             ┌───────▼─────────┐
                                             │ Simulation Engine│
                                             │ (enrichment)     │
                                             └───────┬─────────┘
                                                     │
                                             ┌───────▼─────────┐
                                             │ Frontend (React) │
                                             │ WebSocket / Poll │
                                             └─────────────────┘
```

## Endpoints

### Health Check
`GET /api/health`

Returns system status, uptime, channel states, and integration connectivity.

### Channel Inventory
`GET /api/telemetry/channels`

Lists all telemetry channels with units, precision, sample rates, and current status.

### Telemetry Ingestion
`POST /ingest/telemetry`

Accepts a JSON payload with plant and environmental telemetry. Channel names follow the nested path convention (e.g., `leaching_circuit.ph_level`).

**Payload schema:**
```json
{
  "plant": { "... PlantTelemetry object ..." },
  "env": { "... EnvTelemetry object ..." },
  "provenance": "simulated | live",
  "timestamp": "ISO 8601"
}
```

## Channel Metadata

Each channel carries metadata:

| Field | Type | Description |
|-------|------|-------------|
| `unit` | string | Engineering unit (pH, mg/L, %, kW, etc.) |
| `precision` | number | Decimal places for display |
| `sample_rate_hz` | number | Expected sample frequency |
| `staleness_threshold_ms` | number | Max age before channel is flagged stale |

## Protocol Roadmap

| Phase | Protocol | Timeline | Status |
|-------|----------|----------|--------|
| Current | HTTP REST (JSON) | Now | Active |
| Phase 2 | OPC-UA bridge (read-only) | Q3 2026 | Planned |
| Phase 3 | MQTT subscription | Q4 2026 | Planned |

## OPC-UA Integration (Planned)

The OPC-UA bridge will:
- Connect as an OPC-UA client to the plant historian
- Subscribe to configured channel nodes
- Transform OPC-UA data types to Vero channel schema
- Forward to the ingest API at configured intervals

**Expected configuration:**
```yaml
opcua:
  endpoint: opc.tcp://historian:4840
  security_mode: SignAndEncrypt
  channels:
    - node_id: ns=2;s=Leach.pH
      vero_channel: leaching_circuit.ph_level
      sample_rate_hz: 0.5
```

## Security

- All endpoints require API key authentication (header: `X-Vero-Api-Key`)
- TLS 1.3 required for production
- No write-back capability — Vero is read-only
- Audit trail logs all ingestion events with SHA-256 hash chain

## Getting Started

1. Verify connectivity: `GET /api/health`
2. List available channels: `GET /api/telemetry/channels`
3. Configure historian export to `POST /ingest/telemetry`
4. Monitor ingestion: check channel `last_tick_ms` in health endpoint
