import { test, expect } from '@playwright/test'

/**
 * Marketing homepage smoke: head tags + shell affordances.
 * Uses the same `webServer` as other e2e specs (`playwright.config.ts`).
 */
test.describe('Marketing homepage', () => {
  test('document has description and Open Graph meta', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /VeroChain|Vero|field/i,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /VeroChain/i,
    )
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https?:\/\/.+\/$/)
  })

  test('skip link and story scroll target exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('a.marketing-skip-to-story[href="#marketing-main-scroll"]')).toHaveCount(1)
    await expect(page.locator('#marketing-main-scroll[data-scroll-container]')).toHaveCount(1)
  })

  test('chapter rail shows six beats', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const rail = page.locator('nav[aria-label="Story chapters"]')
    await expect(rail).toBeVisible()
    await expect(rail.locator('button[aria-label^="Go to chapter"]')).toHaveCount(6)
  })

  test('reduced motion: provenance chip dot is not animated', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const anim = await page.getByTestId('provenance-chip-dot').evaluate((el) => getComputedStyle(el).animationName)
    expect(anim === 'none' || anim === '').toBeTruthy()
  })
})
