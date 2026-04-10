# Engine Sandbox

Each subdirectory is a self-contained dashboard ("franchise mode").

## Structure

```
sandbox/
  <name>/
    data.json             — Dashboard content & KPIs (single source of truth)
    <Name>Page.tsx        — Dedicated page component
    <name>.module.css     — Scoped styles (uses var(--w-*) tokens)
    assets/               — Logos, images, custom icons
```

Presets are registered in `src/engine/presets/` as TypeScript manifests.

## How to create a new sandbox

1. Copy an existing sandbox folder (e.g. `prefeitura/`)
2. Create a `data.json` with your dashboard content
3. Build a `<Name>Page.tsx` component
4. Register the preset in `src/engine/presets/`
5. Access at `/view/<manifest-id>`

## Example sandboxes

- **prefeitura/** — Public dashboard for Prefeitura de Poços de Caldas partnership
