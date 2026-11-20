import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import express from 'express'
import createReadOnlyApi from '../server/hosted-api.cjs'
import { createEditionReader, defaultEdition } from '../server/news/storage.ts'

test('hosted read-only API serves the authoritative edition and rejects evidence access', async t => {
  const stories = createEditionReader(defaultEdition)()
  const app = express().use(createReadOnlyApi(stories))
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const root = 'http://127.0.0.1:' + server.address().port
  const request = (path, options) => fetch(root + path, options)
  const feed = await request('/api/stories')
  assert.deepEqual(await feed.json(), stories)
  assert.equal(feed.headers.get('cache-control'), 'no-store')
  const id = 'presidential-roster-2027'
  assert.deepEqual(await (await request('/api/stories/' + id)).json(), stories.find(story => story.id === id))
  assert.deepEqual(await (await request('/api/read-only?__matalensRoute=stories%2F' + id)).json(), stories.find(story => story.id === id))
  assert.equal((await request('/api/read-only?__matalensRoute=receipt%2Fphoto')).status, 503)
  assert.equal((await request('/api/read-only?__matalensRoute=stories&__matalensRoute=receipt')).status, 404)
  assert.deepEqual((await (await request('/api/stories?personId=tinubu-bola-ahmed')).json()).map(story => story.id), [id])
  assert.equal((await request('/api/stories?personId=a&personId=b')).status, 400)
  assert.equal((await request('/api/stories/missing')).status, 404)
  assert.equal((await request('/api/stories', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403)
  assert.deepEqual(await (await request('/api/intake')).json(), {
    uploadsEnabled: false, retentionDays: 30, reason: 'persistent-storage-unavailable',
  })
  for (const [path, method] of [['/api/reports', 'POST'], ['/api/receipt', 'GET'], ['/api/receipt', 'DELETE'], ['/api/receipt/photo', 'GET']]) {
    const response = await request(path, { method })
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
})
