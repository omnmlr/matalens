import express from 'express'
import { resolve } from 'node:path'

export function serveClient(app) {
  app.use(express.static('dist', {
    setHeaders(response, path) {
      response.setHeader('Cache-Control', path.startsWith(resolve('dist/assets')) ? 'public, max-age=31536000, immutable' : 'no-cache')
    },
  }))
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/index.html')))
}
