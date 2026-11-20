import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { createEditionReader, defaultEdition } from '../server/news/storage.ts'

const npm = process.env.npm_execpath
if (!npm) throw new Error('Run npm run build:vercel to prepare the hosted release.')
const build = spawnSync(process.execPath, [npm, 'run', 'build'], {
  env: { ...process.env, VITE_STORY_PROVIDER: 'api' }, stdio: 'inherit',
})
if (build.error) throw build.error
if (build.status !== 0) process.exit(build.status ?? 1)

const target = 'vercel-release'
const stories = createEditionReader(defaultEdition)()
if (stories.length !== 5) throw new Error('The hosted release requires its five reviewed stories.')

rmSync(target, { recursive: true, force: true })
cpSync('dist', target, { recursive: true, filter: path => basename(path) !== '.encodings' })
mkdirSync(join(target, 'api'))
const handler = readFileSync(new URL('../server/hosted-api.cjs', import.meta.url), 'utf8')
writeFileSync(join(target, 'api/read-only.js'), handler + '\nmodule.exports = module.exports(' + JSON.stringify(stories) + ')\n')

const config = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(self)' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' blob:; style-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'" },
      ],
    },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
  rewrites: [
    { source: '/api/:segments*', destination: '/api/read-only?__matalensRoute=:segments*' },
    { source: '/((?!api/|api$|assets/|assets$|sw\\.js$|manifest\\.webmanifest$|mark\\.svg$|icon-192\\.png$|icon-512\\.png$).*)', destination: '/index.html' },
  ],
}
writeFileSync(join(target, 'vercel.json'), JSON.stringify(config, null, 2) + '\n')
console.log('Packaged Vercel web assets and the read-only five-story API.')
