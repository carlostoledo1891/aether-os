# Statement of Work — Meteoric Resources Growth Tier Pilot

**Status:** DRAFT v0.1 — pre-send. Attorney review before signature.
**Owner:** Carlos Toledo (Vero)
**Counterparty:** Meteoric Resources Ltd (ASX: MEI)
**Effective date:** [signature date]
**Term:** 12 months, auto-renewing with 60 days notice.

---

## 1. Parties

| Party | Legal name | Primary signatory | Primary contact |
|-------|------------|--------------------|-----------------|
| Vendor | Vero Technologies (legal entity TBC) | Carlos Toledo, Founder | carlos@[domain] |
| Customer | Meteoric Resources Ltd | Stuart Gale, CEO | [Gale's address] |

Dr. Paulo Sérgio de Souza Caponi (LAPOC) is named in **Annex A** as the scientific liaison for field instrument integration. He is not a party to this agreement; his engagement with Vero is governed by a separate advisory letter.

---

## 2. Scope (what Vero delivers by end of 90-day pilot window)

Everything below is **demonstrable on `/app`** before signature and operational within the 90-day pilot window. No vaporware.

### 2.1 Deployed platform

- Single-tenant Vero workspace at `meteoric.[domain]` (subdomain + TLS) — deferred until branded-domain sprint; pilot runs on `verochain.co/app` with tenant banner.
- `UnitPage` with six operational lenses (Field, Compliance, Environmental, Executive, Buyer Room, Everything).
- `DataModeBanner` surfaces data provenance at all times. Disclosure Mode toggle available per deployment (`VITE_DISCLOSURE_MODE`).

### 2.2 Data surfaces (demo-gating, in place at signature)

- **Geological units** with JORC classification chips, source document deeplinks, and verifier attribution (QP / LAPOC).
- **Drillhole units** with provenance chips for at least the nominated demo drillholes (CDMDD0001, SBBDD0001, FIGDD0001).
- **Milestones, risks, offtakes, permit conditions** surfaced on the Executive lens with KPIs `risk.open`, `milestone.at_risk`, `offtake.binding`.
- **Board Pack** export: one-click signed JSON bundle rooted at the Caldeira site, including narrative and chain proof. PDF export is deferred to the next commercial tier.

### 2.3 Data pipelines (operational by end of pilot)

- **LAPOC instrument ingestion** — piezometer readings, water quality samples, field observations (see **Annex A**). CSV ingestion live at signature via `npm run ingest:lapoc`; direct instrument push is a Week 2-4 deliverable gated on Caponi handover.
- **Engine simulation** continues to emit synthetic telemetry tagged `source: 'lapoc-simulated'` until real LAPOC data arrives, at which point the synthetic stream yields automatically.
- **Public-record enrichers** — ASX releases, BCB FX, USGS seismic, Open-Meteo weather, continue operating.

### 2.4 API access

- Authenticated REST access to `/api/units`, `/api/bundles`, `/api/bundles/preset`, `/api/telemetry/current`, `/api/telemetry/history`.
- One issued ingest key for Meteoric / LAPOC to POST against `/ingest/lapoc`.
- OpenAPI spec at `/api/docs`.

### 2.5 Support

- One 90-minute onboarding session with Gale's team in Week 0.
- One 60-minute DFS presentation rehearsal in Week 6.
- Slack / email response SLA: 1 business day.

---

## 3. Out of scope (explicit deferrals)

The following are **not** included in this pilot and require a written change order to add:

- Branded / white-label domain beyond the pilot tenant banner.
- PDF rendering of the Board Pack (JSON bundle only).
- SCADA / DCS integration beyond LAPOC instruments.
- SFTP polling, enterprise SSO, retry/backoff on the LAPOC ingest seam.
- Custom lens authoring or inspector section authoring UI for Meteoric users.
- On-premise deployment or air-gapped variant.

---

## 4. Fees

| Item | Amount | Billing |
|------|--------|---------|
| Growth tier license | **USD 102,000 / year** | Monthly (USD 8,500) or annual (single invoice, 5% discount) |
| One-time onboarding | USD 0 | Included for this pilot |
| Change orders | T&M at USD 250 / hour | Invoiced monthly |

Payment terms: Net 30 from invoice date. Late fee: 1.5% / month.

---

## 5. Data ownership and confidentiality

- Meteoric retains full ownership of all operational data ingested into the platform.
- Vero retains ownership of the platform code, models, and aggregated (de-identified) benchmarking metrics.
- Both parties treat non-public data as Confidential Information; survives termination 3 years.
- Data export: on termination, Meteoric receives a signed JSON bundle of all units + evidence within 14 days, no fee.

---

## 6. Security and compliance

- All data in transit encrypted via TLS 1.2+.
- At-rest encryption for SQLite database and audit chain.
- Rate-limited ingest endpoints, API-key authentication, audit trail on every mutation.
- NIST 800-53 / CMMC L2 control mapping available on request (see `docs/compliance/`).
- Incident response plan: 4-hour acknowledgement, 24-hour initial triage.

---

## 7. Acceptance criteria

The pilot is considered successfully delivered if, at the end of the 90-day window:

1. `/app` is reachable by Meteoric on authenticated session, with the banner correctly labelling data provenance.
2. At least one LAPOC CSV import has flowed end-to-end from Dr. Caponi's files into the workspace, visible in the Environmental lens.
3. Gale has generated at least one Board Pack bundle for internal use.
4. De Carvalho has clicked at least one deposit and one drillhole and seen the JORC / source / verifier chips.

Failure of any criterion triggers a written remediation plan within 10 business days at no additional cost.

---

## 8. Renewal and termination

- Auto-renews annually at the then-prevailing Growth tier rate.
- Either party may terminate for convenience with 60 days notice.
- Either party may terminate for material breach with 30 days cure period.

---

## 9. Signatures

| Meteoric Resources Ltd | Vero Technologies |
|------------------------|-------------------|
| ___________________ | ___________________ |
| Stuart Gale, CEO | Carlos Toledo, Founder |
| Date: _____________ | Date: _____________ |

---

## Annex A — Dr. Caponi Scientific Liaison Engagement

This annex describes the engagement between Vero Technologies and Dr. Paulo Sérgio de Souza Caponi (LAPOC / UFMG) as scientific liaison for the Meteoric pilot. It is referenced by — but not legally part of — the master SOW above.

### Role

**Scientific Advisor (LAPOC integration)** — external to both Vero and Meteoric.

### Scope

Dr. Caponi will:

1. Provide Vero with access to LAPOC piezometer, water quality, and field observation datasets relevant to the Caldeira Project.
2. Review Vero's data-provenance model against LAPOC quality-control practice, and sign off on the classification labels shown in the `UnitInspector` (JORC Measured, Indicated, Inferred; verifier = "Dr. Caponi, LAPOC").
3. Meet with Vero's engineering team up to once per month during the pilot window for a 60-minute technical review.
4. Co-sign any public communication that cites LAPOC data.

### Deliverables

- Initial CSV handover (piezometer + water quality + field observations) within 30 days of execution.
- Written sign-off that the shapes in `data/lapoc/sample-*.csv` accurately reflect LAPOC instrument exports.
- Monthly review notes, captured in a shared Vero-LAPOC channel.

### Term and compensation

- **Term:** 12 months, co-terminous with the Meteoric pilot.
- **Compensation:** Advisory equity grant, **0.5–1.0%** of Vero Technologies common stock, vesting monthly over 24 months with a 6-month cliff. Cash stipend only by mutual agreement for out-of-pocket expenses.

### Intellectual property

- Dr. Caponi retains all rights to the underlying LAPOC instruments and raw datasets.
- Vero holds a non-exclusive, perpetual, royalty-free licence to the data flowed through the ingest seam for the purpose of operating the Meteoric workspace.
- Any derivative research publications require Dr. Caponi's written consent.

### Confidentiality

- Same terms as Section 5 of the master SOW apply, with Dr. Caponi as an additional Confidentiality obligor.

### Signatures

| Dr. Paulo Sérgio de Souza Caponi | Vero Technologies |
|----------------------------------|-------------------|
| ___________________ | ___________________ |
| Date: _____________ | Date: _____________ |

---

## Send checklist (internal, do not ship)

- [ ] Legal entity for Vero Technologies is finalised before Section 1 is populated.
- [ ] Attorney review of Sections 5, 6, 8 before sending.
- [ ] Confirm Growth tier pricing with Toledo (USD 102k baseline, no discount below USD 80k per `docs/strategy.md`).
- [ ] Confirm Annex A equity range (0.5-1.0%) with Toledo.
- [ ] Include signed PDF of Meteoric's latest ASX MRE announcement as a referenced exhibit.
- [ ] Send to Gale via the same thread as the demo-access email. CC Tunks.
