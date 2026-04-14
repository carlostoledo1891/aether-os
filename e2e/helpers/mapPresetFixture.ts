import type { Page } from '@playwright/test'

export type MapPresetKey =
  | 'field-ops'
  | 'field-env'
  | 'buyer'
  | 'deck-cover'
  | 'deck-geology'
  | 'deck-hydro'
  | 'story-map'
  | 'traceability'

interface PresetRoute {
  url: string
  setup?: (page: Page) => Promise<void>
}

/**
 * Maps each MapPresetKey to the route + any tab/state switching needed.
 *
 * The /app route starts in "operator" view (field-ops). Switching to buyer
 * or other views requires clicking the header tabs.
 */
export function getPresetRoute(key: MapPresetKey): PresetRoute {
  switch (key) {
    case 'field-ops':
      return { url: '/app' }
    case 'field-env':
      return {
        url: '/app',
        setup: async (page) => {
          const envTab = page.getByRole('tab', { name: /hydro|env/i }).first()
          if (await envTab.isVisible()) await envTab.click()
        },
      }
    case 'buyer':
      return {
        url: '/app',
        setup: async (page) => {
          const buyerTab = page.getByRole('tab', { name: /buyer/i }).first()
            .or(page.locator('button:has-text("Buyer")').first())
          if (await buyerTab.isVisible()) await buyerTab.click()
        },
      }
    case 'deck-cover':
    case 'deck-geology':
    case 'deck-hydro':
    case 'story-map':
      return { url: '/deck/meteoric' }
    case 'traceability':
      return {
        url: '/app',
        setup: async (page) => {
          const buyerTab = page.getByRole('tab', { name: /buyer/i }).first()
            .or(page.locator('button:has-text("Buyer")').first())
          if (await buyerTab.isVisible()) await buyerTab.click()
        },
      }
    default:
      return { url: '/app' }
  }
}

/**
 * Navigate to the correct route for a preset, perform any setup,
 * and wait for the map to reach idle state.
 */
export async function navigateToPreset(page: Page, key: MapPresetKey): Promise<void> {
  const route = getPresetRoute(key)
  await page.goto(route.url, { waitUntil: 'networkidle' })

  await page.waitForTimeout(2000)

  if (route.setup) {
    await route.setup(page)
    await page.waitForTimeout(1000)
  }

  try {
    await page.waitForSelector('[data-testid="map-idle"]', { timeout: 15_000 })
  } catch {
    // Map may not have tiles to load (e.g. deck-cover with no overlays)
    await page.waitForTimeout(3000)
  }
}
