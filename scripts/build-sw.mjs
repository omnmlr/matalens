import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, join } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

const paths = ['/', '/mark.svg', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png',
  ...readdirSync('dist/assets').map(name => `/assets/${name}`)]
const hash = createHash('sha256')
for (const path of paths) hash.update(readFileSync(join('dist', path === '/' ? 'index.html' : path)))
const cache = `matalens-${hash.digest('hex').slice(0, 16)}`
writeFileSync('dist/sw.js', `
const cacheName = ${JSON.stringify(cache)}
const paths = ${JSON.stringify(paths)}
const cachedPaths = new Set(paths)
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(paths)))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('matalens-') && key !== cacheName).map(key => caches.delete(key))
  )).then(() => self.clients.claim()))
})
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(cacheName).then(cache => cache.match('/'))))
  } else if (cachedPaths.has(url.pathname)) {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(url.pathname)).then(hit => hit || fetch(event.request)))
  }
})
`)

// Precompress the versioned text assets once. The service worker uses their normal URLs.
const encodingDir = 'dist/.encodings'
mkdirSync(encodingDir, { recursive: true })
for (const path of paths.filter(path => /\.(js|css)$/.test(path))) {
  const original = readFileSync(join('dist', path))
  const name = basename(path)
  writeFileSync(join(encodingDir, name + '.br'), brotliCompressSync(original, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 7 },
  }))
  writeFileSync(join(encodingDir, name + '.gzip'), gzipSync(original, { level: 9 }))
}
