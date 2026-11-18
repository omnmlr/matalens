import express from 'express'
import { createHash, randomUUID } from 'node:crypto'
import { expireReports, findReport, openStore, publicReport, retentionDays, setStatus } from './store.mjs'
import { readUpload, RequestError, validateUpload } from './upload.mjs'

const evidenceCapacity = 512 * 1024 * 1024
const receiptFormat = /^[a-f0-9]{64}$/
const hash = (data) => createHash('sha256').update(data).digest('hex')

function rateLimiter(limit, windowMs, message) {
  const entries = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const ip = req.ip
    let entry = entries.get(ip)
    if (entries.size >= 4096) {
      for (const [key, value] of entries) if (value.until <= now) entries.delete(key)
    }
    if (!entry || entry.until <= now) {
      if (entries.size >= 4096 && !entries.has(ip)) {
        res.set('Retry-After', '60')
        return next(new RequestError(429, message))
      }
      entry = { count: 0, until: now + windowMs }
      entries.set(ip, entry)
    }
    if (++entry.count > limit) {
      res.set('Retry-After', String(Math.ceil((entry.until - now) / 1000)))
      return next(new RequestError(429, message))
    }
    next()
  }
}

export function createApp({ directory, uploadsEnabled = false, origin, trustLoopbackProxy = false } = {}) {
  const app = express()
  const db = openStore(directory)
  app.disable('x-powered-by')
  if (trustLoopbackProxy) app.set('trust proxy', 'loopback')
  let activeUploads = 0

  expireReports(db)
  const expiry = setInterval(() => {
    try { expireReports(db) } catch { console.error('MataLens retention sweep failed.') }
  }, 3_600_000)
  expiry.unref()

  app.use((req, res, next) => {
    res.set({
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(self)',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' blob:; style-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'",
    })
    next()
  })
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    if (req.get('sec-fetch-site') === 'cross-site') return next(new RequestError(403, 'Open this action directly in MataLens.'))
    if (['POST', 'DELETE'].includes(req.method)) {
      const allowed = origin ?? `${req.protocol}://${req.get('host')}`
      if (req.get('origin') !== allowed) return next(new RequestError(403, 'Open this action directly in MataLens.'))
    }
    next()
  })
  app.get('/api/intake', (req, res) => res.json({ uploadsEnabled, retentionDays }))

  const writeLimit = rateLimiter(8, 10 * 60_000, 'Too many upload attempts. Wait a few minutes and try again.')
  const readLimit = rateLimiter(90, 10 * 60_000, 'Too many receipt requests. Wait a few minutes and try again.')
  const authorize = (req, _res, next) => {
    const code = req.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
    if (!code || !receiptFormat.test(code)) return next(new RequestError(401, 'Enter a valid private receipt code.'))
    req.receiptHash = hash(code)
    next()
  }

  app.post('/api/reports', writeLimit, authorize, async (req, res) => {
    expireReports(db)
    const previous = findReport(db, req.receiptHash)
    if (previous) return res.json(publicReport(previous))
    if (!uploadsEnabled) throw new RequestError(503, 'Photo intake is unavailable on this copy of MataLens.')
    if (activeUploads >= 3) {
      res.set('Retry-After', '10')
      throw new RequestError(503, 'Photo intake is busy. Try again in a moment.')
    }
    activeUploads++
    try {
      const image = await validateUpload(await readUpload(req))
      db.exec('BEGIN IMMEDIATE')
      try {
        const existing = findReport(db, req.receiptHash)
        if (existing) {
          db.exec('COMMIT')
          return res.json(publicReport(existing))
        }
        const usedBytes = db.prepare('SELECT total(length(original) + length(preview)) AS bytes FROM evidence').get().bytes
        if (usedBytes + image.original.length + image.preview.length > evidenceCapacity) {
          throw new RequestError(503, 'Photo storage is full. Please try again later.')
        }
        const id = randomUUID()
        db.prepare(`
          INSERT INTO reports (id, receipt_hash, kind, category, description, location, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, req.receiptHash, image.kind, image.category, image.description, image.location, Date.now())
        db.prepare('INSERT INTO evidence (report_id, original, sha256, preview) VALUES (?, ?, ?, ?)')
          .run(id, image.original, hash(image.original), image.preview)
        db.exec('COMMIT')
      } catch (error) {
        if (db.isTransaction) db.exec('ROLLBACK')
        throw error
      }
      return res.status(201).json(publicReport(findReport(db, req.receiptHash)))
    } finally {
      activeUploads--
    }
  })

  const requireReport = (req, _res, next) => {
    expireReports(db)
    req.report = findReport(db, req.receiptHash)
    if (!req.report) return next(new RequestError(404, 'No active report was found for that receipt. Check the code or its expiry.'))
    next()
  }
  app.get('/api/receipt', readLimit, authorize, requireReport, (req, res) => {
    res.json(publicReport(req.report))
  })
  app.get('/api/receipt/photo', readLimit, authorize, requireReport, (req, res) => {
    const photo = db.prepare('SELECT preview FROM evidence WHERE report_id = ?').get(req.report.id)
    if (!photo) throw new RequestError(404, 'This photo is no longer available.')
    res.type('image/webp').send(Buffer.from(photo.preview))
  })
  app.delete('/api/receipt', readLimit, authorize, requireReport, (req, res) => {
    setStatus(db, req.report.id, 'withdrawn')
    res.json(publicReport(findReport(db, req.receiptHash)))
  })
  app.use('/api', (_req, _res, next) => next(new RequestError(404, 'This MataLens action is unavailable.')))
  app.use((error, _req, res, _next) => {
    if (res.headersSent) return
    if (error instanceof RequestError) return res.status(error.status).json({ error: error.message })
    console.error('MataLens request failed.', error.code ?? error.name)
    res.status(500).json({ error: 'MataLens could not complete this action. Please try again.' })
  })

  return { app, db, close: () => { clearInterval(expiry); db.close() } }
}
