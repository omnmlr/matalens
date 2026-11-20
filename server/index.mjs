import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createApp } from './app.mjs'
import { serveClient } from './client.mjs'

if (existsSync('.env')) process.loadEnvFile()
const mode = process.env.MATALENS_MODE
const directory = process.env.MATALENS_DATA_DIR || (mode === 'dev' ? resolve('.matalens') : undefined)
const origin = process.env.MATALENS_ORIGIN
if (origin && new URL(origin).origin !== origin) throw new Error('MATALENS_ORIGIN must contain only the scheme and host.')
const uploadsEnabled = mode === 'dev'
  ? process.env.MATALENS_ENABLE_UPLOADS !== '0'
  : Boolean(process.env.MATALENS_ENABLE_UPLOADS === '1' && directory && origin && new URL(origin).protocol === 'https:')
const { app, uploadsEnabled: intakeEnabled } = createApp({
  directory, uploadsEnabled, origin, newsEdition: process.env.MATALENS_NEWS_EDITION,
  trustLoopbackProxy: process.env.MATALENS_TRUST_LOOPBACK_PROXY === '1',
})
if (mode !== 'dev') serveClient(app)

const host = process.env.MATALENS_HOST || '127.0.0.1'
const port = Number(process.env.MATALENS_PORT ?? 3000)
const server = app.listen(port, host, () => console.log(`MataLens on http://${host}:${port} (photo intake ${intakeEnabled ? 'enabled' : 'disabled'})`))
server.requestTimeout = 60_000
server.headersTimeout = 15_000
