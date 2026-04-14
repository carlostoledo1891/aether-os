import { defineConfig, devices } from '@playwright/test'

const deployedBaseUrl = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60_000,

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.003,
    },
  },

  use: {
    baseURL: deployedBaseUrl ?? 'http://localhost:5175',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  webServer: deployedBaseUrl
    ? undefined
    : {
        command: 'npm run dev:all',
        url: 'http://localhost:5175',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
