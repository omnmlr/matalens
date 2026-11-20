import { existsSync, mkdirSync, realpathSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { createApp } from './app.mjs'
import { serveClient } from './client.mjs'

if (existsSync('.env')) process.loadEnvFile()
const mode = process.env.MATALENS_MODE
const directory = process.env.MATALENS_DATA_DIR || (mode === 'dev' ? resolve('.matalens') : undefined)
if (directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 })
  const dataPath = realpathSync(directory)
  for (const folder of ['public', 'dist']) {
    if (!existsSync(folder)) continue
    const publicPath = realpathSync(folder)
    if (dataPath === publicPath || dataPath.startsWith(publicPath + sep)) {
      throw new Error('MATALENS_DATA_DIR must be outside public and dist.')
    }
  }
}

const origin = process.env.MATALENS_ORIGIN
if (origin && new URL(origin).origin !== origin) throw new Error('MATALENS_ORIGIN must contain only the scheme and host.')
const uploadsEnabled = mode === 'dev'
  ? process.env.MATALENS_ENABLE_UPLOADS !== '0'
  : Boolean(process.env.MATALENS_ENABLE_UPLOADS === '1' && directory && origin && new URL(origin).protocol === 'https:')
const { app } = createApp({ directory, uploadsEnabled, origin, trustLoopbackProxy: process.env.MATALENS_TRUST_LOOPBACK_PROXY === '1' })
if (mode !== 'dev') serveClient(app)

const host = process.env.MATALENS_HOST || '127.0.0.1'
const port = Number(process.env.MATALENS_PORT ?? 3000)
const server = app.listen(port, host, () => console.log(`MataLens on http://${host}:${port} (photo intake ${uploadsEnabled ? 'enabled' : 'disabled'})`))
server.requestTimeout = 60_000
server.headersTimeout = 15_000
