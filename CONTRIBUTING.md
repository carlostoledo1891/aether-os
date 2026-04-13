# Contributing to Vero

Thank you for your interest in contributing to Vero. This document provides guidelines for contributing to the project.

## Development Setup

```bash
npm run install:all    # Install dependencies for all 3 packages
npm run dev:all        # Start API + engine + frontend concurrently
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Frontend only (Vite, port 5175) |
| `npm run server` | API only (Fastify, port 3001) |
| `npm run engine` | Simulation engine only |
| `npm run dev:all` | All three processes concurrently |

## Quality Gates

All contributions must pass the following before merge:

```bash
npx tsc --noEmit           # 0 TypeScript errors (strict mode)
npm run lint               # ESLint clean (a11y + unused-imports)
npm run test:run           # All tests pass, no regressions
cd server && npm test      # Server tests pass
cd engine && npm test      # Engine tests pass
```

Pre-commit hooks enforce lint and type checks on staged files.

## Code Standards

### TypeScript
- Strict mode is enforced across all packages
- No `any` types without explicit justification
- All new functions, thresholds, and data transformations require tests

### Styling
- All colors use `W.*` tokens from `canvasTheme.ts` or `var(--w-*)` CSS variables
- Layout uses CSS Modules; inline styles only for truly dynamic values
- No raw hex values or magic numbers for spacing/radii

### Components
- Views are "dumb" — they render data from hooks, business logic lives in services
- All interactive elements require ARIA attributes and `type="button"`
- Lazy-load heavy views with `React.lazy()` + `Suspense`

### Data
- All data flows through `AetherDataService` — never import mock data directly in views
- The mock/live boundary is sacred: env flags control behavior, never shortcuts

## Architecture Principles

| Principle | Rule |
|-----------|------|
| Data flows through `AetherDataService` | Never import `mockData` directly in views |
| Views are dumb | Business logic in services and utilities |
| Tokens are law | No raw hex; add to `canvasTheme.ts` + `theme.css` first |
| Tests are documentation | Every new function gets a test |
| Accessibility is not optional | Ships with the feature, not as follow-up |
| CSS Modules for layout | Inline styles only for dynamic values |

## Commit Messages

Use concise, descriptive commit messages. Focus on "why" rather than "what."

## Security

- Never commit secrets, API keys, or credentials
- See [SECURITY.md](SECURITY.md) for vulnerability reporting
- All dependencies must pass `npm audit --audit-level=high`

## Code Review

All changes require review before merge. Reviewers check for:

1. TypeScript strict compliance
2. Test coverage for new functionality
3. Design token usage (no raw colors/spacing)
4. Accessibility attributes on interactive elements
5. Data honesty — simulated paths explicitly labeled
6. No scope creep without documented justification
