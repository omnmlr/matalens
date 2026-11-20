import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createApp } from '../server/app.mjs'
import { sourceConfigs } from '../server/news/desk.ts'
import { generateDrafts } from '../server/news/pipeline.ts'
import { createEditionReader, defaultEdition, recordDecision, saveDraftBatch } from '../server/news/storage.ts'

const now = new Date('2026-11-20T12:00:00+01:00')
const captureFile = new URL('../data/news/source-captures.json', import.meta.url)
const recordings = JSON.parse(await readFile(captureFile, 'utf8')).captures
const emptyEdition = JSON.stringify({ version: 1, entries: [] })

async function openApi(t, editionPath) {
  const { app, close } = createApp({ newsEdition: editionPath })
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => {
    await new Promise(resolve => server.close(resolve))
    close()
  })
  const base = 'http://127.0.0.1:' + server.address().port
  return (path, options) => fetch(base + path, options)
}

test('recorded public evidence builds reviewed, source-linked reading and learning candidates', async () => {
  const batch = await generateDrafts({ mode: 'recorded', now })
  const second = await generateDrafts({ mode: 'recorded', now: new Date(now.valueOf() + 1000) })
  assert.deepEqual(batch.issues, [])
  assert.equal(batch.drafts.length, 5)
  assert.deepEqual(batch.drafts.map(draft => draft.revision), second.drafts.map(draft => draft.revision))

  const mock = batch.drafts.find(({ story }) => story.id === 'mock-accreditation-2026')
  assert.deepEqual(mock.cluster, ['mock-notice', 'mock-report'])
  assert.deepEqual(mock.story.sources.slice(0, 2).map(source => source.publishedAt), ['2026-11-13', '2026-11-12'])
  assert.equal(mock.story.quiz.options[mock.story.quiz.correct], 'Accreditation and electronic result transmission')
  assert.deepEqual(mock.story.quiz.sourceIds, ['mock-notice'])
  assert.match(mock.story.context, /Chatham House/)
  assert.equal(mock.story.reviewStatus, undefined)

  const roster = batch.drafts.find(({ story }) => story.id === 'presidential-roster-2027').story
  assert.equal(roster.personIds.length, 36)
  assert.ok(roster.personIds.includes('tinubu-bola-ahmed'))
  assert.ok(roster.personIds.includes('shettima-kashim'))
  assert.ok(roster.partyCodes.includes('A'))
  assert.equal(roster.commitments[0].kind, 'manifesto')
  assert.equal(roster.commitments[0].date, '2026-10')
  assert.ok(roster.sources.some(source => source.id === roster.commitments[0].sourceId))

  const bundled = createEditionReader(defaultEdition)()
  assert.deepEqual(bundled.map(story => story.id), batch.drafts.map(draft => draft.story.id))
  assert.ok(bundled.every(story => story.reviewStatus === 'reviewed'))
})

test('live collection parses publisher HTML and keeps unrelated or unconfirmed claims out of drafts', async () => {
  const replies = new Map(sourceConfigs.filter(source => source.kind === 'html').map(source => [source.url, recordings[source.id]]))
  const requested = []
  const request = async url => {
    requested.push(url.href)
    const source = replies.get(url.href)
    if (url.hostname === 'renewedhope02.com') return new Response(null, { status: 302, headers: { Location: 'https://unregistered.example/manifesto' } })
    if (!source) return new Response(null, { status: 404 })
    const text = url.pathname.includes('nationwide-mock-accreditation-exercise')
      ? '<p>INEC released a media notice on 28th November 2026.</p><aside>Mock accreditation and electronic result transmission.</aside>'
      : '<p>' + source.text + '</p>'
    const html = '<html><head><title>' + source.title.replaceAll('&', '&amp;') + '</title></head><body><main><article><h1>' +
      source.title.replaceAll('&', '&amp;') + '</h1>' + text + '</article></main></body></html>'
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
  const batch = await generateDrafts({ mode: 'live', now, request })
  assert.equal(requested.length, replies.size)
  assert.ok(!requested.some(url => url.includes('unregistered.example')))
  assert.ok(batch.issues.some(issue => issue.id === 'apc-manifesto' && issue.reason.includes('redirected')))
  assert.ok(batch.issues.some(issue => issue.id === 'mock-notice' && issue.reason.includes('evidence')))
  assert.ok(!batch.drafts.some(draft => draft.story.id === 'mock-accreditation-2026'))
  const roster = batch.drafts.find(draft => draft.story.id === 'presidential-roster-2027')
  assert.deepEqual(roster.story.commitments, [])
  assert.ok(roster.provenance.every(source => source.mode === 'live' || source.mode === 'catalogue'))
})

test('public HTTP endpoints only expose approved revisions and update on editorial withdrawal', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'matalens-news-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const batchPath = join(dir, 'pending.json')
  const editionPath = join(dir, 'reviewed.json')
  const batch = await generateDrafts({ mode: 'recorded', now })
  saveDraftBatch(batchPath, batch)
  await writeFile(editionPath, emptyEdition)
  const request = await openApi(t, editionPath)

  const id = 'presidential-roster-2027'
  const draft = batch.drafts.find(item => item.story.id === id)
  const detail = '/api/stories/' + id
  assert.deepEqual(await (await request('/api/stories')).json(), [])
  assert.equal((await request(detail)).status, 404)
  const decide = (decision, revision = draft.revision) => recordDecision({
    batchPath, editionPath, id, revision, reviewer: 'Test editorial review', decision, now,
  })
  assert.throws(() => decide('approve', '0'.repeat(64)), /does not match/)
  assert.equal((await request(detail)).status, 404)

  decide('approve')
  const detailResponse = await request(detail)
  assert.equal(detailResponse.status, 200)
  assert.equal(detailResponse.headers.get('cache-control'), 'no-store')
  const published = await detailResponse.json()
  assert.deepEqual(published, { ...draft.story, reviewStatus: 'reviewed', reviewedAt: '2026-11-20' })
  assert.equal(published.reviewer, undefined)
  assert.deepEqual(await (await request('/api/stories?personId=tinubu-bola-ahmed')).json(), [published])
  assert.deepEqual(await (await request('/api/stories?personId=unknown-person')).json(), [])
  assert.equal((await request('/api/stories?personId=tinubu-bola-ahmed&personId=another-person')).status, 400)
  assert.equal((await request('/api/stories/%2Fetc%2Fpasswd')).status, 404)
  assert.equal((await request('/api/stories', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403)

  decide('withdraw')
  assert.equal((await request(detail)).status, 404)
  assert.deepEqual(await (await request('/api/stories')).json(), [])
  await writeFile(editionPath, '{broken')
  assert.equal((await request('/api/stories')).status, 503)
  assert.equal((await request('/api/intake')).status, 200)
})

test('the shipped edition is available through the normal application entry point', async t => {
  const request = await openApi(t)
  const response = await request('/api/stories')
  assert.equal(response.status, 200)
  const stories = await response.json()
  assert.equal(stories.length, 5)
  assert.equal(stories[0].id, 'inec-recruitment-deadline-2027')
  assert.ok(stories.every((story, index) => index === 0 || story.publishedAt <= stories[index - 1].publishedAt))
  const relevant = await (await request('/api/stories?personId=national-adebayo-adewole-ebenezer')).json()
  assert.deepEqual(relevant.map(story => story.id), ['presidential-roster-2027', 'adebayo-security-statement'])
})
