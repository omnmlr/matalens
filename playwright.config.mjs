import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const port = process.env.MATALENS_BROWSER_PORT ?? '4173'
const browserPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined)

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    launchOptions: { executablePath: browserPath },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && node tests/serve.mjs',
    url: `http://127.0.0.1:${port}/api/intake`,
    timeout: 90_000,
  },
})
