import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { chmod, mkdir, mkdtemp, rm, stat } from 'node:fs/promises'
import { once } from 'node:events'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { createApp } from '../server/app.mjs'
import { expireReports, openStore, retentionDays, setStatus } from '../server/store.mjs'
import { maxBytes } from '../server/upload.mjs'

const photo = await sharp({ create: { width: 20, height: 20, channels: 3, background: 'forestgreen' } })
  .withExif({ IFD0: { Artist: 'Synthetic test fixture' } }).jpeg().toBuffer()
const receipt = () => randomBytes(32).toString('hex')

async function service(t, options = {}) {
  const application = createApp({ uploadsEnabled: true, ...options })
  const server = application.app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  let open = true
  async function close() {
    if (!open) return
    open = false
    await new Promise(resolve => server.close(resolve))
    application.close()
  }
  t.after(close)
  return { ...application, origin, close }
}

function body(overrides = {}, photoBuffer = photo, mime = 'image/jpeg') {
  const data = new FormData()
  const values = { kind: 'community', category: 'Road or pavement', description: 'A deep hole beside the public footpath.', location: 'Public entrance', consent: 'yes', ...overrides }
  for (const [name, value] of Object.entries(values)) if (value !== undefined) data.set(name, value)
  data.set('photo', new Blob([photoBuffer], { type: mime }), 'fixture.jpg')
  return data
}

function submit(origin, code, data = body(), from = origin) {
  return fetch(`${origin}/api/reports`, { method: 'POST', headers: { Origin: from, Authorization: `Bearer ${code}` }, body: data })
}

function recover(origin, code, path = '/api/receipt', method = 'GET') {
  return fetch(`${origin}${path}`, { method, headers: { Origin: origin, Authorization: `Bearer ${code}` } })
}

test('guest submission survives restart and keeps the evidence private', async t => {
  const root = await mkdtemp(join(tmpdir(), 'matalens-api-'))
  const directory = join(root, 'private-reports')
  try {
    const first = await service(t, { directory })
    const code = receipt()
    const response = await submit(first.origin, code)
    assert.equal(response.status, 201)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const report = await response.json()
    assert.equal(report.status, 'pending')
    assert.equal(report.hasPhoto, true)
    assert.equal(report.receipt_hash, undefined)
    const row = first.db.prepare('SELECT receipt_hash FROM reports WHERE id = ?').get(report.id)
    assert.equal(row.receipt_hash, createHash('sha256').update(code).digest('hex'))
    const evidence = first.db.prepare('SELECT original, sha256 FROM evidence WHERE report_id = ?').get(report.id)
    assert.deepEqual(Buffer.from(evidence.original), photo)
    assert.ok((await sharp(photo).metadata()).exif)
    assert.equal(evidence.sha256, createHash('sha256').update(photo).digest('hex'))
    assert.equal((await recover(first.origin, report.id)).status, 401)
    assert.equal((await recover(first.origin, receipt())).status, 404)
    await first.close()

    const restarted = await service(t, { directory, uploadsEnabled: false })
    assert.equal((await (await fetch(`${restarted.origin}/api/intake`)).json()).uploadsEnabled, false)
    assert.equal((await submit(restarted.origin, receipt())).status, 503)
    const recovered = await recover(restarted.origin, code)
    assert.deepEqual(await recovered.json(), report)
    const preview = await recover(restarted.origin, code, '/api/receipt/photo')
    assert.equal(preview.headers.get('content-type'), 'image/webp')
    assert.equal(preview.headers.get('cache-control'), 'no-store')
    const metadata = await sharp(Buffer.from(await preview.arrayBuffer())).metadata()
    assert.equal(metadata.exif, undefined)
    assert.equal(setStatus(restarted.db, report.id, 'reviewed'), true)
    assert.equal((await (await recover(restarted.origin, code)).json()).status, 'reviewed')
    const withdrawn = await (await recover(restarted.origin, code, '/api/receipt', 'DELETE')).json()
    assert.equal(withdrawn.status, 'withdrawn')
    assert.equal(withdrawn.hasPhoto, false)
    assert.equal(withdrawn.description, '')
    assert.equal(withdrawn.location, '')
    assert.equal((await recover(restarted.origin, code, '/api/receipt/photo')).status, 404)
    assert.equal(restarted.db.prepare('SELECT count(*) AS count FROM evidence').get().count, 0)
    await restarted.close()
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('duplicate retries share a stable receipt and public results require polling-unit details', async t => {
  const { origin, db } = await service(t)
  const code = receipt()
  assert.equal((await submit(origin, code, body({ kind: 'result', location: '' }))).status, 400)
  const valid = () => body({ kind: 'result', category: undefined, description: '', location: '24/12/01/001' })
  const results = await Promise.all([submit(origin, code, valid()), submit(origin, code, valid())])
  assert.deepEqual(results.map(result => result.status).sort(), [200, 201])
  const [first, second] = await Promise.all(results.map(result => result.json()))
  assert.deepEqual(first, second)
  assert.equal(first.category, 'Public result sheet')
  assert.equal(db.prepare('SELECT count(*) AS count FROM evidence').get().count, 1)
  assert.equal(setStatus(db, first.id, 'declined'), true)
  assert.equal((await (await recover(origin, code)).json()).status, 'declined')
  assert.equal(db.prepare('SELECT count(*) AS count FROM evidence').get().count, 0)
  expireReports(db, Date.now() + retentionDays * 86_400_000)
  assert.equal((await recover(origin, code)).status, 404)
})

test('origin, media, size, consent and network abuse safeguards reject invalid uploads', async t => {
  const { origin, db } = await service(t)
  assert.equal((await submit(origin, receipt(), body(), 'https://elsewhere.example')).status, 403)
  assert.equal((await submit(origin, receipt(), body({ consent: 'no' }))).status, 400)
  assert.equal((await submit(origin, receipt(), body({ website: 'filled' }))).status, 400)
  assert.equal((await submit(origin, receipt(), body({}, Buffer.from('not a photo')))).status, 415)
  assert.equal((await submit(origin, receipt(), body({}, photo, 'image/png'))).status, 415)
  assert.equal((await submit(origin, receipt(), body({}, Buffer.alloc(maxBytes + 1)))).status, 413)
  for (let attempt = 0; attempt < 3; attempt++) {
    assert.equal((await submit(origin, receipt(), body({ kind: 'other' }))).status, 400)
  }
  const limited = await submit(origin, receipt())
  assert.equal(limited.status, 429)
  assert.ok(Number(limited.headers.get('retry-after')) > 0)
  assert.equal(db.prepare('SELECT count(*) AS count FROM reports').get().count, 0)
})


test('persistent report storage refuses a directory with unverified permissions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'matalens-permissions-'))
  try {
    const privateParent = join(root, 'private-parent')
    openStore(privateParent).close()
    const unverified = join(privateParent, 'unverified')
    await mkdir(unverified)
    if (process.platform !== 'win32') await chmod(unverified, 0o755)
    assert.throws(() => openStore(unverified), /private (directory|Windows storage)/)
    await assert.rejects(stat(join(unverified, 'cases.sqlite')), { code: 'ENOENT' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('unavailable image sanitization closes uploads and leaves reviewed stories online', async () => {
  await promisify(execFile)(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict'
    import { once } from 'node:events'
    import { registerHooks } from 'node:module'
    registerHooks({
      resolve(name, context, nextResolve) {
        if (name === 'sharp') throw new Error('Simulated native dependency loading failure')
        return nextResolve(name, context)
      },
    })
    const { createApp } = await import('./server/app.mjs')
    const service = createApp({ uploadsEnabled: true })
    const server = service.app.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const origin = 'http://127.0.0.1:' + server.address().port
    try {
      const intake = await fetch(origin + '/api/intake')
      assert.equal((await intake.json()).uploadsEnabled, false)
      assert.equal(service.uploadsEnabled, false)
      const reviewed = await fetch(origin + '/api/stories')
      assert.equal(reviewed.status, 200)
      assert.equal((await reviewed.json()).length, 5)
      const data = new FormData()
      data.set('kind', 'community')
      data.set('category', 'Road or pavement')
      data.set('description', 'Synthetic test for disabled image processing.')
      data.set('consent', 'yes')
      const image = Buffer.from('${photo.toString('base64')}', 'base64')
      data.set('photo', new Blob([image], { type: 'image/jpeg' }), 'fixture.jpg')
      const submit = await fetch(origin + '/api/reports', {
        method: 'POST',
        headers: { Origin: origin, Authorization: 'Bearer ' + 'a'.repeat(64) },
        body: data,
      })
      assert.equal(submit.status, 503)
      assert.equal(service.db.prepare('SELECT count(*) AS count FROM reports').get().count, 0)
      assert.equal(service.db.prepare('SELECT count(*) AS count FROM evidence').get().count, 0)
    } finally {
      await new Promise(resolve => server.close(resolve))
      service.close()
    }
  `], { cwd: new URL('../', import.meta.url), timeout: 15_000 })
})
