# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (current) | Yes |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please report it responsibly.

**Email:** security@vero.earth

**Response SLA:**
- Acknowledgement within 48 hours
- Initial assessment within 5 business days
- Resolution timeline communicated within 10 business days

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

**Do not:**
- Disclose publicly before we have addressed the issue
- Access or modify data belonging to other users
- Perform denial-of-service attacks

## Security Architecture

### Current Controls

| Control | Implementation |
|---------|---------------|
| **Authentication** | API key (`x-api-key` header) on ingest, chat, alert, and WebSocket endpoints |
| **Rate Limiting** | Global 120 req/min; route-specific limits on ingest (60/min), chat (10/min), upload (5/min) |
| **CSP** | Content Security Policy headers via deployment configuration |
| **CORS** | Configurable allowlist; production defaults to explicit origins |
| **Audit Trail** | SHA-256 append-only hash chain with integrity verification (`/api/audit/verify-chain`) |
| **Error Handling** | Stack traces stripped in production (status >= 500) |
| **Input Validation** | Fastify schema validation on route parameters; multipart size limits (10 MB) |
| **Dependency Scanning** | Syft SBOM generation + Grype vulnerability scanning in CI |
| **WebSocket** | Token-based authentication; connection limits (100 max) |

### Known Boundaries

These are intentional architectural decisions at the current stage, not oversights:

- **Database:** SQLite (single-file, no native encryption at rest). Suitable for pilot deployments; Postgres migration planned for production multi-tenant.
- **RBAC:** Not yet implemented. All authenticated endpoints use shared API keys. Role-based access control architecture is designed (see `docs/architecture/rbac-design.md`) and gated on first enterprise deployment.
- **Encryption at rest:** Not currently implemented at the application layer. Deployment-level volume encryption (e.g., AWS EBS, Azure Disk) is recommended.
- **TLS:** Terminated at the reverse proxy / load balancer level, not at the Node.js application layer.

### Compliance Roadmap

| Framework | Status | Target |
|-----------|--------|--------|
| NIST 800-53 Rev 5 | Controls mapped | See `docs/compliance/nist-800-53-mapping.md` |
| CMMC Level 2 | Practices mapped | See `docs/compliance/cmmc-level2-mapping.md` |
| SOC 2 Type I | Planned | Post Series A fundraise |
| FedRAMP | Architecture designed | Requires FedRAMP-authorized cloud partner |
| ISO 27001 | Planned | Post SOC 2 |

### Dependency Management

- Dependencies are audited in CI on every push (`npm audit --audit-level=high`)
- SBOM (CycloneDX format) generated via Syft on every CI build
- Vulnerability scanning via Grype on every CI build
- Automated dependency updates via Dependabot

## Responsible Disclosure

We follow a coordinated disclosure process. After a fix is available, we will:

1. Credit the reporter (unless anonymity is preferred)
2. Publish a security advisory if the issue affects deployed instances
3. Update the SBOM and dependency chain as needed

Thank you for helping keep Vero and our users safe.
