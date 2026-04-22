/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

function gitSha(): string {
  try { return execSync('git rev-parse HEAD').toString().trim() } catch { return 'unknown' }
}

/**
 * Injects `og:url` (and any future `__VITE_PUBLIC_SITE_URL__` placeholders) from env.
 * Set `VITE_PUBLIC_SITE_URL` for preview/staging (e.g. `https://my-app.vercel.app`).
 * Default: `https://verochain.co` (trailing slash added in output).
 */
function publicSiteUrlPlugin(): Plugin {
  return {
    name: 'public-site-url-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const mode =
          ctx.server?.config?.mode ??
          (process.env.NODE_ENV === 'development' ? 'development' : 'production')
        const env = loadEnv(mode, process.cwd(), '')
        let site = (env.VITE_PUBLIC_SITE_URL || '').trim()
        if (!site) site = 'https://verochain.co'
        const origin = site.replace(/\/+$/, '')
        return html.replace(/__VITE_PUBLIC_SITE_URL__/g, `${origin}/`)
      },
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      shared: resolve(__dirname, 'shared'),
    },
  },
  plugins: [publicSiteUrlPlugin(), react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  define: {
    __BUILD_SHA__: JSON.stringify(gitSha()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:3001',
      '/ingest': 'http://localhost:3001',
      '/ws': { target: 'ws://localhost:3001', ws: true },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
  },
})
