/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

function gitSha(): string {
  try { return execSync('git rev-parse HEAD').toString().trim() } catch { return 'unknown' }
}

export default defineConfig({
  resolve: {
    alias: {
      shared: resolve(__dirname, 'shared'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
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
