import { test, expect } from '@playwright/test'
import { navigateToPreset, type MapPresetKey } from './helpers/mapPresetFixture'

const MAP_PRESETS: MapPresetKey[] = [
  'field-ops',
  'field-env',
  'buyer',
  'deck-cover',
  'deck-geology',
  'deck-hydro',
  'story-map',
  'traceability',
]

test.describe('Map surface visual smoke tests', () => {
  for (const preset of MAP_PRESETS) {
    test(`${preset} renders without visual regression`, async ({ page }) => {
      await navigateToPreset(page, preset)
      await expect(page).toHaveScreenshot(`${preset}.png`, {
        maxDiffPixelRatio: 0.003,
        fullPage: true,
      })
    })
  }
})
