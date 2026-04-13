# Vero — Brand Bible

**Purpose:** Single source of truth for all brand decisions — identity, voice, visual system, and usage rules. Every piece of external-facing communication (website, deck, demos, PDFs, emails) must align with this document.

**Last updated:** 2026-04-10  
**Cross-references:** [`STYLING.md`](STYLING.md) (technical token contract), [`strategy.md`](strategy.md) (GTM), [`messaging-strategy.md`](messaging-strategy.md), [`personas/core-personas.md`](personas/core-personas.md)

---

## 1. Brand Identity

### Name

**Vero** — from Latin *verus*, meaning "true." The name encodes the product's core promise: verified truth across the critical mineral supply chain. Short, global, memorable, legally defensible.

**Internal codename:** `aether-os` (codebase and repo only — never in external materials).

### Tagline

> **The trust layer for critical mineral supply chains.**

Use as the primary descriptor in all contexts where a one-line explanation is needed. Do not abbreviate or paraphrase.

### Positioning Statement

Vero is a B2B SaaS platform that aligns field operations, compliance evidence, and board-level metrics for critical mineral supply chains. It exists because no unified platform currently provides defensible provenance for the rare earth supply chain — the backbone of EVs, defense systems, and clean energy.

### Brand Promise

**One platform. Three truths.** Every stakeholder — operator, buyer, investor, regulator, community — sees verified, auditable, always-current data aligned to their decision rhythm.

---

## 2. Voice & Tone

### Core Principles

| Principle | What it means | Example |
|-----------|---------------|---------|
| **Technical confidence** | State capabilities precisely. No hedging, no hyperbole. | "Controls mapped to NIST 800-53 Rev 5 — 8 families, code-referenced" — not "rigorously tested" |
| **Honest boundaries** | Always disclose what is simulated, modeled, or demo-only. | "Demo environment — simulated telemetry until LAPOC instruments connect" |
| **Military brevity** | Short sentences. Active voice. No filler. Say it once. | "Vero aligns field and board." — not "Vero helps bridge the gap between..." |
| **Evidence over assertion** | Show the number, the screenshot, the citation. Never "best-in-class." | "9.3/10 persona-weighted score" — not "industry-leading stakeholder satisfaction" |
| **Never overclaim** | Never say "AI replaces X" or "fully compliant." Position as evidence design. | "Evidence repository design" — not "compliance certification" |

### Forbidden Language

These words and phrases must never appear in Vero external communications:

| Forbidden | Use instead |
|-----------|-------------|
| "AI replaces legal opinion / IE report" | "AI-assisted analysis — verify with counsel" |
| "Fully compliant" / "Certified" | "Aligned to [standard]" / "Evidence design for [standard]" |
| "Best-in-class" / "World-class" (about Vero) | Cite the specific metric instead |
| "Real-time" (for simulated data) | "Simulated telemetry" / "Illustrative time series" |
| "Blockchain-secured" (without context) | "SHA-256 append-only audit chain — demo narrative; production key custody roadmap" |
| "Proves the deposit" | "Monitoring + scenario communication" (geology ≠ hydro) |
| "Live" (for mock data) | "Demo data" / "Presentation mode" |
| "Guarantees" / "Ensures" | "Supports" / "Enables" / "Designed for" |

### Tone by Audience

| Audience | Tone | Example opening |
|----------|------|-----------------|
| Investor / board | Confident, precise, metric-forward | "Zero TypeScript errors. NIST 800-53 mapped. $5–7M pre-money." |
| Operator / technical | Peer-level, architecture-aware | "Three-process architecture. Fastify API, simulation engine, Vite frontend." |
| Buyer / compliance | Evidence-first, schema-aware | "22 CEN/CENELEC DPP fields mapped. Schema-validated JSON export." |
| Regulator | Factual, cautious, boundary-clear | "Evidence repository design — not certification. Verify against filed instruments." |
| Community / NGO | Respectful, bilingual, listening-first | "Monitoring plan with grievance path. Modeled until field-verified." |
| Media / researcher | Transparent, source-linked, disclaimer-visible | "Demo mixes public-reference data, disclosure-aligned scenarios, and simulated time series." |

---

## 3. Visual Identity

### Color System

Vero uses a dark-first palette built on deep indigo-black backgrounds with accent colors that carry semantic meaning.

#### Primary Palette

| Role | Token | Hex / Value | Usage |
|------|-------|-------------|-------|
| **Background** | `W.bg` | `#07070E` | Page background, app shell |
| **Canvas** | `W.canvas` | `#060610` | Map backgrounds, deep surfaces |
| **Panel** | `W.panel` | `#0D0D1C` | Side panels, cards |
| **Surface** | `W.surface` | `#121228` | Elevated card backgrounds |
| **Surface High** | `W.surfaceHigh` | `#181834` | Hover states, active surfaces |

#### Text Hierarchy

| Level | Token | Hex | Usage |
|-------|-------|-----|-------|
| **Primary** | `W.text1` | `#ECECF8` | Headlines, primary content |
| **Secondary** | `W.text2` | `#A0A0C8` | Body text, descriptions |
| **Tertiary** | `W.text3` | `#8888B8` | Supporting copy, captions |
| **Muted** | `W.text4` | `#7878B0` | Labels, footnotes, hints |

#### Accent Colors — Semantic Mapping

Each accent color maps to a domain meaning. Never use an accent color outside its domain.

| Color | Token | Hex | Domain | Persona Association |
|-------|-------|-----|--------|---------------------|
| **Violet** | `W.violet` | `#7C5CFC` | Brand, authority, executive | Chairman, CEO, Investors |
| **Cyan** | `W.cyan` | `#00D4C8` | Operations, field data, engineering | Operators, Geologists, SCADA |
| **Green** | `W.green` | `#22D68A` | Compliance, growth, status OK | Buyers, EU Enforcement |
| **Amber** | `W.amber` | `#F5A623` | Warnings, caution, attention | Risk indicators, PF Analyst |
| **Red** | `W.red` | `#FF4D4D` | Problems, gaps, critical alerts | Problem statements, NGO concerns |

Each color has three intensity levels for UI layering:
- **Glow** (`W.*Glow`, 22% opacity) — hover highlights, active states
- **Subtle** (`W.*Subtle`, 10% opacity) — card backgrounds, section tints
- **Solid** — text, accents, icons, progress bars

#### Glass Morphism

The signature Vero visual effect. Transparent layers with blur create depth hierarchy.

| Token | Opacity | Usage |
|-------|---------|-------|
| `W.glass02` | 2% | Barely-there dividers |
| `W.glass04` | 4% | Card backgrounds (primary) |
| `W.glass06` | 6% | Card borders (primary) |
| `W.glass08` | 8% | Elevated borders |
| `W.glass12` | 12% | Active/hover borders, secondary CTAs |
| `W.overlay88` | 88% | Full modal overlays |

### Typography

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| **UI / Body** | Inter | 400–800 | All interface text, headlines, body copy |
| **Data / Mono** | JetBrains Mono | 400–700 | Numbers, metrics, stat values, code, timestamps |

#### Type Scale (LP Hero Reference)

| Element | Size | Weight | Special |
|---------|------|--------|---------|
| Hero H1 | `clamp(36px, 6.5vw, 72px)` | 800 | Gradient text (text1 → violet) |
| Section H2 | `clamp(28px, 4vw, 44px)` | 700 | Solid text1 |
| Body | 17px | 400 | text3, line-height 1.7 |
| Eyebrow label | 11px | 400 | Uppercase, 0.25em tracking, accent color |
| Stat value | 20–28px | 700–800 | Mono, accent color |
| Stat caption | 10px | 400 | text4, 0.04em tracking |

### Logo

**Mark:** The letter **V** in white (#FFFFFF) centered in a violet (#7C5CFC) rounded square (border-radius: 6px at 28px size).

**Text mark:** "Vero" in Inter Bold (700), 15px, letter-spacing -0.02em. Appears next to the monogram.

**Usage rules:**
- No image logo file — the monogram is always rendered in code/CSS for pixel-perfect scaling
- Monogram minimum size: 24px
- Always maintain the violet fill — never grayscale the monogram in digital contexts
- Sufficient clearance: at least 1x monogram width on all sides

### Card Design

The signature Vero card pattern — used across LP, deck, and dashboard:

```
background: W.glass04 (rgba 255,255,255,0.04)
border:     1px solid W.glass06 (rgba 255,255,255,0.06)
radius:     16px
padding:    28px 24px
overflow:   hidden
```

Optional accent: 3px colored bar at the top edge (accent color at 70% opacity).

### Radial Glow

Signature background treatment for hero and spotlight sections:

```
Pulsing violet blob:
  background: radial-gradient(circle, violet + 14 opacity, transparent 70%)
  width/height: 55vw, positioned offset
  filter: blur(80px)
  animation: opacity 0.35 → 0.55 → 0.35, 6s infinite

Section tint:
  background: radial-gradient(ellipse at 50% 50%, accent + 06 opacity, transparent 60%)
  full-width, behind content
```

### Navigation Chrome

```
Fixed top bar:
  background: rgba(7,7,14,0.88) + blur(20px)
  border-bottom: 1px solid glass06
  height: 56px
```

---

## 4. Product Naming

### Views (External Names)

| Internal Code | External Name | Do NOT call it |
|---------------|---------------|----------------|
| `operator` | **Field Operations** | "Operator View", "Ops Dashboard" |
| `buyer` | **Compliance & Traceability** | "Buyer View", "Compliance Dashboard" |
| `executive` | **Executive Overview** | "Exec View", "C-Suite Dashboard" |

### Feature Names

| Feature | Official Name | Never call it |
|---------|---------------|---------------|
| Pilot Plant Digital Twin | **Control Room** | "SCADA", "HMI", "Digital Twin" (alone) |
| Spring monitoring | **Hydro Twin** | "Water dashboard", "Spring tracker" |
| Batch tracking | **Molecular-to-Magnet Ledger** | "Blockchain", "Crypto tracking" |
| Public dashboards | **Mini Engine** (internal only) | "CMS", "Page builder" |
| AI chat | **Vero Intelligence** | "ChatGPT", "AI Assistant" |

### Company Names

| Context | Use |
|---------|-----|
| The SaaS product | **Vero** |
| The codebase | `aether-os` (internal only) |
| The company (future) | **Vero Technologies** or **Vero Pty Ltd** (TBD at incorporation) |
| The flagship customer | **Meteoric Resources** (ASX: MEI) |
| The flagship project | **Caldeira Project** (Poços de Caldas, MG, Brazil) |

---

## 5. Disclaimer Patterns

### Data Honesty Modes

Every Vero session displays a data context banner. The copy patterns:

| Mode | Banner Label | Detail |
|------|-------------|--------|
| **Mock** (default) | Demo data | Simulated plant/env time series; bundled GeoJSON |
| **Presentation** | Stakeholder session — illustrative run | Agency briefing structure; replace with instrumented feeds for production |
| **Disclosure** | Disclosure mode — board-approved facts only | IR-safe: simulated/illustrative layers hidden |
| **Live, connected** | Live pipeline — Vero Simulation Engine | Telemetry via API + WebSocket. Plant/env synthetic until LAPOC connects |
| **Live, degraded** | Backend unreachable — showing cached data | Amber banner, stale data served |
| **Live, offline** | Backend offline — reconnecting... | Red banner, no data, exponential backoff |

### Standard Disclaimer (Deck / Website)

> This demo mixes three kinds of information: (1) public-reference geometry and citations where noted, (2) illustrative scenarios and dashboards aligned to disclosed materials where labeled, and (3) simulated plant and environmental time series for UX rehearsal — not a substitute for IMS, permit registers, competent-person sign-off, or filed instruments.

### Geology / Hydro Firewall

Resource, reserve, and exploration data lives in **Executive → Assets**. Hydro Twin is **monitoring + scenario communication** — never imply the digital twin proves the deposit. These are two separate data domains.

---

## 6. Photography & Imagery

### Do Use
- Satellite/terrain map screenshots from the actual platform
- Data-dense dashboard screenshots showing real UI
- Caldeira aerial photography (public domain / Meteoric press)
- Technical diagrams (architecture, data flow)

### Do Not Use
- Stock photography of miners, hard hats, or generic landscapes
- Abstract "tech" illustrations (nodes, neural networks, abstract waves)
- Competitor product screenshots
- AI-generated imagery of people or places

### Screenshot Guidelines
- Always use the dark theme (the only theme currently)
- Capture at 2x resolution minimum
- Include the data honesty banner if visible — it demonstrates transparency
- Prefer screenshots with data loaded, not loading skeletons

---

## 7. Deck & Presentation Style

### Slide Design Language

Follow the LP hero style for all presentation materials:

- **Dark background** (`W.bg`) — never white slides
- **Gradient text** on titles (text1 → violet at 135deg)
- **Glowing accent dots** as bullet markers (6px, accent color, box-shadow glow)
- **Glass cards** for stats and feature groups
- **Mono numbers** (JetBrains Mono) for all statistics in accent color
- **Radial glow** behind section titles (subtle, accent + 0A opacity)
- **Progress bar** gradient (accent → violet) at top edge
- **Minimal chrome** — no heavy borders, no drop shadows, no gradients on backgrounds

### Slide Types

1. **Cover** — Large V monogram, gradient title, subtitle, eyebrow
2. **Content** — Title + left-aligned bullets with glowing dot markers
3. **Stats** — Grid of glass cards with mono numbers
4. **CTA** — Gradient title + value props + dual buttons (violet primary + glass secondary)

---

## 8. Brand Application Checklist

Before any external-facing material goes out:

- [ ] Product is called "Vero" (not Aether, not aether-os)
- [ ] Tagline is "The trust layer for critical mineral supply chains"
- [ ] Views use external names (Field Operations, Compliance & Traceability, Executive Overview)
- [ ] No forbidden language (see Section 2)
- [ ] Disclaimer pattern included where data is shown
- [ ] Color accents match their semantic domain
- [ ] Dark theme only — no white/light backgrounds
- [ ] Trust signals are current (NIST 800-53, SHA-256 audit chain, 9.4 persona score, CI quality gates)
- [ ] Meteoric/Caldeira references include "ASX: MEI" on first mention
- [ ] No overclaiming on compliance, blockchain, or AI capabilities

---

*Vero. Verified Origin. Trusted Supply.*
