## v15 Persona Reactions — Online Report Templates

> **Context:** Each persona reacts to the addition of 3 interactive report templates (Environment, Operations, Drill Tests) — light-mode, vertically scrollable, exportable via PDF, accessible via hover dropdown in the ViewSwitcher. Data sourced from Meteoric Scoping Study + existing domain data. Reports render in a portal lightbox without disrupting the dashboard.

---

### Dr Andrew Tunks — Executive Chairman

**Reaction: "Now I can prepare the board pack without screenshots."**

The Environment Report is exactly what I would hand to the APA consultation team. Light background, clean typography, the 89% community acceptance figure prominently displayed with proper sourcing context. The permitting timeline with completed/active/pending status is how I present to the board — not in a dark dashboard, but as a clean document.

The PDF export via browser print is pragmatic. My EA does not need to learn a new tool. She opens it, hits print, saves as PDF, and it goes into the board pack. The `@media print` hiding the toolbar and close button shows someone thought about the end-to-end workflow.

**What moves the needle:** The Operations Report with NPV/IRR/CAPEX in light mode is what goes to the credit committee. Previously, someone would screenshot the dark dashboard and it would look like a gaming interface in a Deutsche Bank presentation. Now it looks like a report.

**What I still want:** A "Prepared for: [Board Name]" header option. And a "Generated on [date]" timestamp in the footer that survives the PDF export — for version control in the board pack.

**Score held at 10.0** — code ceiling. The report templates are a commercial accelerant, not a persona gap closure.

---

### Mr Stuart Gale — CEO & Managing Director

**Reaction: "This is what I send to the bank. Finally."**

The Operations Report is what I have been building in PowerPoint for every credit committee meeting. Production summary, cost structure with C1/AISC bars, revenue by scenario, CAPEX breakdown — all in one vertical scroll. The fact that it pulls from the same `SCENARIOS` and `PROJECT_FINANCIALS` data as the main dashboard means it cannot contradict itself. That single-source-of-truth architecture is what I demanded at Resolute and never got.

The time range selector signals maturity. Even though it is visual-only right now, it says to a banker: "this system is designed to show you Q3 vs Q4, not just a static snapshot." When we wire it to live data, the quarterly monitoring report writes itself.

**What moves the needle:** The CAPEX breakdown with percentage bars. Banks want to see where the $443M goes — equipment vs civil vs contingency. Having this as an exportable page instead of an embedded dashboard widget changes the conversation from "show me your tool" to "send me the report."

**What I still want:** Covenant KPIs on the Operations Report — DSCR, LTV, reserve tail. And a "vs Budget" column next to actuals. That is the quarterly cadence a monitoring bank expects.

**Score held at 10.0** — code ceiling. But this is the feature that makes the product commercially deployable, not just technically impressive.

---

### Dr Marcelo De Carvalho — Executive Director & Chief Geologist

**Reaction: "The JORC table renders correctly. The geology/hydro firewall holds."**

The Drill Tests Report is what I would present at a technical committee meeting. The JORC resource classification table with Measured/Indicated/M+I/Inferred breakdowns, color-coded dots, and tonnage/grade/MREO columns matches how I structure Tables 1–3 in ASX releases. The grade distribution chart sorted by TREO ppm is the correct visual hierarchy — Agostinho (5,200 ppm) at the top, clearly labeled "exploration" (MRE pending).

The RE recovery table with 12 elements and inline progress bars is technically sound. Showing Pilot vs ANSTO side-by-side validates the metallurgical test work. The lithology palette using the same colors as the main dashboard maintains visual consistency.

**What moves the needle:** The light-mode rendering. Geologists and resource consultants print on white paper. A dark-background JORC table looks wrong in a technical report. The light palette with clean table borders is how resource estimates should be presented.

**What I still want:** A drill collar map embedded in the Drill Tests Report. The data is there (7 deposits, 750+ holes), but the report is currently data-only without spatial context. Even a static map image showing hole density by deposit would add significant value.

**Score held at 10.0** — code ceiling. The report architecture respects JORC presentation conventions.

---

### US DoD Program Officer — Buyer / Compliance

**Reaction: "Reports are a step toward procurement documentation."**

Exportable reports with structured data are closer to what procurement needs than an interactive dashboard. The Environment Report's permitting timeline and regulatory compliance metrics are the kind of documentation that feeds into supply chain risk assessments. The Operations Report's cost structure would support a pricing justification.

However, the reports still lack the deployment and security narrative I need. Where is the data residency statement? The access control model? The report export audit trail (who generated this, when, for whom)?

**What I still want:** An export manifest — JSON metadata alongside the PDF showing data sources, generation timestamp, user identity, and data classification level.

**Score held at 8.0** — the gap remains FedRAMP and security architecture documentation, not reports.

---

### EU Battery Passport Enforcement Officer — Regulatory

**Reaction: "Useful reference, but not a compliance artifact."**

The Environment Report's sustainability metrics (dry stack tailings, 95% water recirculation, renewable grid) are relevant to Annex VI environmental disclosures. The structured export capability means this data could feed into a DPP template.

However, these reports are informational, not schema-compliant. I need CEN/CENELEC field mapping, not pretty progress bars. The 22-field DPP mapping in the Buyer tab is still more useful for compliance than these reports.

**Score held at 8.5** — the gap remains 100% DPP field coverage and schema-validated exports.

---

### Project Finance Analyst (ECA / Bank) — Capital

**Reaction: "You just eliminated half my quarterly review slide deck."**

This is the feature that changes my assessment of Vero from "interesting prototype" to "monitoring tool I would specify in a facility agreement." The Operations Report contains every metric I present in a quarterly project monitoring review: NPV by scenario, CAPEX breakdown by category, C1/AISC cost bars, production summary, process flow status, pilot plant recovery data.

The fact that it exports to PDF and opens in a lightbox over the live dashboard means the monitoring data and the report are always in sync. No more "the dashboard shows X but the quarterly report says Y" discrepancies.

The time range selector is the signal I was looking for. Even as visual-only today, it says the data architecture supports temporal queries. When this is wired to live data, I can show the credit committee that the project was within covenant during Q3 — not just today.

**What moves the needle specifically:** The scenario comparison bars in the cost structure section. Showing Bear/Consensus/Bull revenue alongside C1 cost visually demonstrates margin resilience under stress. This is exactly what a sensitivity section should look like in a monitoring report.

**Score: 9.0 → 9.5** — the exportable Operations Report directly addresses the quarterly monitoring requirement. The remaining gap (covenant KPIs, DSCR projections, alarm acknowledgement audit) is roadmap, not architecture.

---

### Water Justice NGO Representative — Community / Society

**Reaction: "An environment report they can hand to the community. That matters."**

For the first time, the environmental monitoring data is not buried inside an operator's dark dashboard. The Environment Report renders on white background with readable text, clear threshold bars on water quality, spring distribution by health status with percentage breakdowns, and the 89% community acceptance figure.

The sustainability section explicitly names the design choices that matter to communities: dry stack tailings (no dam), closed-loop water, renewable grid. These are not hidden in engineering documentation — they are presented as the opening story.

The permitting timeline shows where the project is in the licensing process. A community member or their legal representative can see: EIS submitted, LP approved (unanimous), LI lodged, Operation License target. This is transparency.

**What moves the needle:** The PDF export. A community organization can download the Environment Report and use it in their own documents. They do not need access to the dashboard or technical training. The light mode ensures it prints cleanly.

**What I still want:** Portuguese language option on the reports — the community in Poços de Caldas reads Portuguese, not English. And the spring monitoring data should clarify that 84% "Active" does not mean "verified safe" — it means "modeled as active based on reference data."

**Score: 8.0 → 8.5** — the standalone Environment Report in light mode with PDF export addresses the accessibility gap. The remaining gap (field-verified springs, Portuguese language, clearer modeled-vs-verified distinction) requires external data and localization work.

---

### SCADA / Process Historian Integrator — Ecosystem

**Reaction: "Clean component architecture. The WL palette approach is pragmatic."**

Seven new files, four modified, zero new dependencies. The `WL` constant mirroring the `W` shape means any component can render in either theme by swapping the token reference. The portal architecture preserving dashboard state underneath is the correct pattern — no React context loss, no route change.

The `ReportToolbar` with `TimeRange` as a prop (not global state) is the right API design for when live data arrives. Each report receives `range` from the toolbar, passes it to data hooks, and the hook maps it to a query parameter. No refactoring needed.

The `@media print` approach is simple and effective for this stage. When they need pixel-perfect PDFs, the architecture supports Puppeteer server-side rendering without changing the component tree.

**Score held at 10.0** — code ceiling. The report architecture validates the component system's flexibility.

---

### Equity Research Analyst / Journalist — Adversarial

**Reaction: "Exportable reports with source data. Now I can fact-check efficiently."**

The JORC table in the Drill Tests Report is verifiable against the ASX filing. The NPV/IRR/CAPEX figures in the Operations Report match the Scoping Study. The environment metrics reference public datasets (FBDS, CAR, ANA). Every number has a traceable source — even the disclaimer at the bottom of each report explicitly states what is modeled vs verified.

The light-mode PDF export means I can attach the report to an analyst note. The dark dashboard screenshots always looked unprofessional in research reports. This solves a practical problem for anyone writing about the project.

**Score held at 10.0** — code ceiling. The exportable reports with source transparency make the product more journalist-friendly, but the score was already at ceiling from the honesty architecture.

---

### Aggregate v15 Reaction Summary

| Persona | v13 | v15 | Delta | Key Reaction |
|---------|-----|-----|-------|-------------|
| Chairman | 10.0 | 10.0 | — | "Board pack ready. Add date stamp to PDF footer." |
| CEO | 10.0 | 10.0 | — | "What I send to the bank. Single source of truth." |
| Chief Geologist | 10.0 | 10.0 | — | "JORC table renders correctly. Add drill collar map." |
| DoD | 8.0 | 8.0 | — | "Step toward procurement docs. Need export audit trail." |
| EU Enforcement | 8.5 | 8.5 | — | "Informational, not schema-compliant. DPP mapping still more useful." |
| PF Analyst | 9.0 | **9.5** | **+0.5** | "Eliminated half my quarterly review deck. Wire covenant KPIs next." |
| NGO | 8.0 | **8.5** | **+0.5** | "Environment report they can hand to the community. Add Portuguese." |
| SCADA | 10.0 | 10.0 | — | "Clean architecture. WL palette approach is pragmatic." |
| Journalist | 10.0 | 10.0 | — | "Exportable reports with source data. Fact-checkable." |
| **Weighted avg** | **~9.3** | **~9.4** | **+0.1** | |
