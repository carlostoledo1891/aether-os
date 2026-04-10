# Engine Sandbox

Each subdirectory is a self-contained dashboard configuration ("franchise mode").

## Structure

```
sandbox/
  <name>/
    manifest.json     — ViewManifest config (drives the page)
    overrides.css     — Theme / branding overrides
    assets/           — Logos, images, custom icons
```

## How to create a new sandbox

1. Copy an existing sandbox folder (e.g. `prefeitura/`)
2. Edit `manifest.json` to define your sections and widgets
3. Customize `overrides.css` for branding
4. Add assets to `assets/`
5. Access at `/view/<manifest-id>`

## Example sandboxes

- **prefeitura/** — Public dashboard for Prefeitura de Poços de Caldas partnership
