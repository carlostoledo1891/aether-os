# Vero — RBAC Architecture Design

**Purpose:** Defines the planned role-based access control system for Vero. Currently, all endpoints use shared API keys. This document specifies the architecture for scope-based access when enterprise deployments require per-user identity.

**Status:** Design document — implementation gated on first enterprise deployment requirements  
**Last updated:** 2026-04-13  
**Cross-reference:** `docs/architecture/overview.md` (section: "Future: credential scopes")

---

## 1. Design Principles

1. **One UI, scoped data.** The same React frontend serves all roles. The `AetherDataService` implementation filters or redacts data based on the authenticated user's scopes. Views remain "dumb."
2. **Progressive adoption.** API keys continue to work. JWT/OIDC is additive, not a replacement. Existing integrations (engine, LAPOC adapter) keep using API keys.
3. **Fail-closed.** Unknown scopes get no data. Scopes must be explicitly granted. Default is deny.
4. **Backend enforcement.** Scopes are checked in Fastify middleware and service/DTO layers. Frontend may hide UI elements for UX, but the backend is the authority.

---

## 2. Proposed Scopes

| Scope | Typical Role | Access |
|-------|-------------|--------|
| `issuer.internal` | Operator team, engineering, IR | Full platform: all telemetry, financials, draft data, simulated streams, risk register, capital tracker |
| `issuer.executive` | Board members, C-suite | Executive tabs + reports. Financial scenarios, risk register, DFS. No raw telemetry or engineering detail |
| `buyer.compliance` | OEM, defense buyer, compliance officer | Buyer view: batches, FEOC, DPP export, traceability, carbon intensity. No operator internals |
| `regulator.read` | FEAM, IBAMA, MPF, COPAM | Agency matrix, monitoring annex, submitted documents, public geometry. No draft financials, no unreleased lab data |
| `community.public` | NGO, community members, public | High-level monitoring narrative, spring status (labeled "modeled"), grievance entry points. No competitive detail |
| `integrator.api` | SCADA vendor, system integrator | API access: telemetry channels, equipment catalog, OpenAPI spec. No financial or compliance data |
| `admin.system` | Platform admin (Vero team) | All scopes + user management, audit chain, ingest configuration |

---

## 3. Authentication Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│  Client   │────>│  OIDC Provider │────>│  Vero API    │
│  (React)  │<────│  (Auth0/Okta) │<────│  (Fastify)   │
└──────────┘     └───────────────┘     └──────────────┘
     │                                        │
     │  1. Login redirect                     │
     │  2. ID token + access token            │
     │  3. API calls with Bearer token        │
     │  4. Fastify validates JWT              │
     │  5. Scopes extracted from claims       │
     │  6. Middleware enforces scope per route │
```

### Token Structure (JWT Claims)

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "org": "meteoric-resources",
  "scopes": ["issuer.internal", "issuer.executive"],
  "site": "caldeira",
  "iat": 1713024000,
  "exp": 1713110400
}
```

### Backward Compatibility

| Auth Method | Behavior |
|------------|---------|
| `x-api-key` (existing) | Continues to work. Maps to `admin.system` scope (or configurable scope per key) |
| Bearer JWT | New. Scopes from claims. |
| No auth (dev) | Returns mock data with `issuer.internal` scope. Dev-only behavior. |

---

## 4. Middleware Design

```typescript
// Proposed Fastify plugin
async function rbacPlugin(app: FastifyInstance) {
  app.decorateRequest('userScopes', [])

  app.addHook('onRequest', async (req) => {
    const bearer = req.headers.authorization?.replace('Bearer ', '')
    const apiKey = req.headers['x-api-key'] as string | undefined

    if (bearer) {
      const claims = await verifyJwt(bearer)
      req.userScopes = claims.scopes
    } else if (apiKey) {
      req.userScopes = resolveApiKeyScopes(apiKey)
    }
    // No auth = empty scopes (fail-closed unless route allows public)
  })
}

// Route-level scope guard
function requireScope(...scopes: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const hasScope = scopes.some(s => req.userScopes.includes(s))
    if (!hasScope) {
      return reply.code(403).send({ error: 'Insufficient scope' })
    }
  }
}

// Usage
app.get('/api/batches', {
  preHandler: requireScope('buyer.compliance', 'issuer.internal', 'admin.system'),
}, async (req) => { /* ... */ })
```

---

## 5. Route Scope Matrix

| Endpoint Group | `issuer.internal` | `issuer.executive` | `buyer.compliance` | `regulator.read` | `community.public` | `integrator.api` |
|---------------|:-:|:-:|:-:|:-:|:-:|:-:|
| `/api/telemetry/*` | R | — | — | — | — | R |
| `/api/project/*` | R | R | partial | partial | — | — |
| `/api/financials/*` | R | R | — | — | — | — |
| `/api/batches` | R | R | R | — | — | — |
| `/api/risks` | R | R | — | — | — | — |
| `/api/regulatory` | R | R | — | R | — | — |
| `/api/esg` | R | R | partial | partial | — | — |
| `/api/audit` | R | R | R | R | — | — |
| `/api/export/dpp/*` | R | R | R | — | — | — |
| `/api/export/regulatory` | R | R | — | R | — | — |
| `/api/weather/*` | R | R | R | R | R | R |
| `/api/springs/*` | R | R | — | R | R | — |
| `/api/context` | R | R | R | R | R | R |
| `/ingest/*` | — | — | — | — | — | — |

`R` = read access, `partial` = filtered fields, `—` = denied

---

## 6. Data Filtering by Scope

For scopes with `partial` access, the service layer filters response data:

```typescript
function filterForScope(data: ProjectFinancials, scopes: string[]): Partial<ProjectFinancials> {
  if (scopes.includes('issuer.internal')) return data

  if (scopes.includes('regulator.read')) {
    // Regulators see compliance metrics, not financial projections
    return {
      permitting: data.permitting,
      environmental: data.environmental,
      // Omit: npv, irr, capex, scenarios
    }
  }

  if (scopes.includes('community.public')) {
    return {
      environmental: {
        springs_monitored: data.environmental.springs_monitored,
        water_quality_status: data.environmental.water_quality_status,
        // Omit: specific ppm values, sensor IDs
      },
    }
  }

  return {} // fail-closed
}
```

---

## 7. Implementation Timeline

| Phase | Activities | Timeline | Dependencies |
|-------|-----------|----------|-------------|
| **Current** | API key auth (per-function) | Done | — |
| **Phase 1** | RBAC design document (this doc) | Done | — |
| **Phase 2** | Fastify RBAC plugin + middleware | Q3 2026 | Enterprise customer requiring user identity |
| **Phase 3** | OIDC provider integration (Auth0/Okta) | Q3 2026 | Phase 2 |
| **Phase 4** | Frontend scope-aware rendering | Q4 2026 | Phase 3 |
| **Phase 5** | Audit trail with user identity | Q4 2026 | Phase 3 |

**Key message:** RBAC is architecturally designed, with implementation gated on first enterprise deployment requirements. The current API key system provides functional access control for pilot-stage deployments.

---

## 8. Multi-Tenancy Considerations

When Vero serves multiple sites (beyond Caldeira):

- JWT claims include `site` field
- Database queries scoped to site
- Site-specific thresholds and configurations loaded from `SiteConfig`
- Cross-site access requires explicit `admin.system` scope
- Each site can have its own OIDC provider or share a central one
