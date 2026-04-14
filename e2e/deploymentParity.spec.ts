import { test, expect } from '@playwright/test'

const expectedApiBaseUrl = process.env.EXPECTED_API_BASE_URL
const expectedWsUrl = process.env.EXPECTED_WS_URL
const forbiddenApiBaseUrl = process.env.FORBIDDEN_API_BASE_URL

test.describe('Deployment parity smoke', () => {
  test.skip(!expectedApiBaseUrl, 'Set EXPECTED_API_BASE_URL for deployed smoke checks.')

  test('exposes the expected runtime backend targets', async ({ page }) => {
    await page.goto('/')

    const runtimeConfig = await page.evaluate(() => {
      return (window as Window & {
        __VERO_RUNTIME_CONFIG__?: {
          apiBaseUrl?: string
          wsBaseUrl?: string
          dataMode?: string
        }
      }).__VERO_RUNTIME_CONFIG__
    })

    expect(runtimeConfig?.dataMode).toBe('live')
    expect(runtimeConfig?.apiBaseUrl).toBe(expectedApiBaseUrl)
    if (expectedWsUrl) {
      expect(runtimeConfig?.wsBaseUrl).toBe(expectedWsUrl)
    }
    if (forbiddenApiBaseUrl) {
      expect(runtimeConfig?.apiBaseUrl).not.toBe(forbiddenApiBaseUrl)
    }
  })

  test('can reach the configured backend health endpoint', async ({ page }) => {
    const health = await page.evaluate(async (apiBaseUrl) => {
      const res = await fetch(`${apiBaseUrl}/api/health`)
      const json = await res.json()
      return { ok: res.ok, json }
    }, expectedApiBaseUrl)

    expect(health.ok).toBe(true)
    expect(typeof health.json?.status).toBe('string')
  })
})
