# Deck Templates

Every deck in this directory follows the same contract. A deck is any outbound content artifact rendered by the Deck Engine — pitch decks, public dashboards, compliance snapshots, investor summaries.

## Template Contract

Each deck directory contains:

| File | Required | Description |
|------|----------|-------------|
| `*Deck.tsx` | Yes | Default-exported component that renders `<DeckRunner manifest={...} />` |
| `data.json` | No | Editable content data (titles, metrics, labels) |
| `*.module.css` | No | Deck-specific styles (CSS Modules) |
| `overrides.css` | No | CSS variable overrides for white-labeling |

## Creating a New Deck

1. Create a directory under `src/pages/decks/<deck-id>/`
2. Create the main component file with a `DeckManifest`:

```tsx
import { DeckRunner } from '../../../components/deck/DeckRunner'
import type { DeckManifest } from '../../../components/deck/types'

const MANIFEST: DeckManifest = {
  id: 'my-deck',
  title: 'My Deck Title',
  mode: 'dashboard',  // 'slides' | 'dashboard' | 'report'
  theme: 'dark',      // 'dark' | 'light'
  children: <MyContent />,
}

export default function MyDeck() {
  return <DeckRunner manifest={MANIFEST} />
}
```

3. Add a route in `App.tsx`: `/deck/<deck-id>`

## DeckManifest Modes

| Mode | Use Case | Chrome |
|------|----------|--------|
| `slides` | Pitch decks, presentations | Keyboard nav, progress bar, dot pager, transitions |
| `dashboard` | Public dashboards, exec summaries | Full-page scroll, no navigation chrome |
| `report` | Compliance reports, audits | Portal lightbox, time range selector, print styles |

## White-Label Pattern

Every deck template should use `W.*` tokens (dark) or `WL.*` tokens (light) for colors. To customize branding per client, create an `overrides.css` that redefines CSS variables:

```css
:root {
  --w-violet: #1E40AF;
  --w-green: #059669;
}
```

Base chrome comes from the design system. The deck only customizes accent colors, logo, and fonts.

## Current Templates

| ID | Mode | Description | Route |
|----|------|-------------|-------|
| `prefeitura` | dashboard | Portuguese-language public dashboard for Poços de Caldas | `/deck/prefeitura` |
| `caldeira-exec` | dashboard | Investor executive summary with metrics and timeline | `/deck/caldeira-exec` |
| `compliance-snapshot` | dashboard | ESG coverage, DPP readiness, batch tracking | `/deck/compliance-snapshot` |
| `meteoric` | slides | 18-slide Meteoric pitch deck | `/deck/meteoric` |
| `founders` | slides | 22-slide Founders pitch deck | `/deck/founders` |
