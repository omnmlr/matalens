import express from 'express'
import { existsSync } from 'node:fs'
import { extname, resolve } from 'node:path'

const assetCache = 'public, max-age=31536000, immutable'

export function serveClient(app) {
  app.get('/assets/:name', (req, res, next) => {
    const name = req.params.name
    if (!/^[a-z0-9_-]+\.(js|css)$/i.test(name)) return next()

    res.vary('Accept-Encoding')
    const encoding = req.acceptsEncodings('br', 'gzip', 'identity')
    if (req.get('range') || (encoding !== 'br' && encoding !== 'gzip')) return next()
    const path = resolve('dist/.encodings', name + '.' + encoding)
    if (!existsSync(path)) return next()

    res.type(extname(name))
    res.set('Content-Encoding', encoding)
    res.set('Cache-Control', assetCache)
    res.sendFile(path, { dotfiles: 'allow' })
  })
  app.use(express.static('dist', {
    setHeaders(response, path) {
      response.setHeader('Cache-Control', path.startsWith(resolve('dist/assets')) ? assetCache : 'no-cache')
    },
  }))
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/index.html')))
}
