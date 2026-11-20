import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import type { Story, StorySource } from '../../src/story-contract.ts'
import { knownParty, knownPerson } from './catalogue.ts'
import { digest, isDay, isId, isMonth, type DraftBatch, type DraftStory, type ReviewedEntry } from './model.ts'

const maxFileBytes = 2 * 1024 * 1024
const sha256 = /^[a-f0-9]{64}$/
export const defaultEdition = fileURLToPath(new URL('../../data/news/reviewed-edition.json', import.meta.url))

type Edition = { version: 1; entries: ReviewedEntry[] }

function readJson(path: string): unknown {
  if (statSync(path).size > maxFileBytes) throw new Error('Editorial file exceeds the size limit')
  return JSON.parse(readFileSync(path, 'utf8'))
}

function withFileLock<T>(path: string, act: () => T): T {
  mkdirSync(dirname(path), { mode: 0o700, recursive: true })
  const lock = path + '.lock'
  try {
    mkdirSync(lock, { mode: 0o700 })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      throw new Error('Another editorial write is in progress')
    }
    throw error
  }
  try {
    return act()
  } finally {
    rmSync(lock, { recursive: true, force: true })
  }
}

function writeJson(path: string, value: unknown) {
  const temporary = path + '.' + randomUUID() + '.tmp'
  const json = JSON.stringify(value, null, 2) + '\n'
  if (Buffer.byteLength(json) > maxFileBytes) throw new Error('Editorial file exceeds the size limit')
  const fd = openSync(temporary, 'wx', 0o600)
  try {
    try {
      writeFileSync(fd, json, 'utf8')
      fsyncSync(fd)
    } finally {
      closeSync(fd)
    }
    renameSync(temporary, path)
  } finally {
    rmSync(temporary, { force: true })
  }
}

const nonempty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(nonempty)

function validSource(source: StorySource) {
  if (!source || !isId(source.id) || !nonempty(source.title) || !nonempty(source.publisher) ||
    (source.publishedAt !== undefined && !isDay(source.publishedAt)) ||
    (source.evidence !== undefined && !nonempty(source.evidence))) return false
  return isHttpsUrl(source.url)
}

function isHttpsUrl(value: unknown) {
  if (!nonempty(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

function validDraft(story: DraftStory) {
  if (!story || !isId(story.id) || !isDay(story.publishedAt) ||
    (story.updatedAt !== undefined && !isDay(story.updatedAt)) ||
    ![story.title, story.topic, story.explanation, story.context, story.significance].every(nonempty) ||
    (story.openQuestion !== undefined && !nonempty(story.openQuestion)) ||
    !strings(story.personIds) || !story.personIds.every(knownPerson) || !strings(story.partyCodes) || !story.partyCodes.every(knownParty) ||
    !Array.isArray(story.sources) || !story.sources.length || !story.sources.every(validSource) ||
    !Array.isArray(story.commitments)) return false

  const ids = new Set(story.sources.map(source => source.id))
  const validSourceIds = (sourceIds: unknown, minimum: number) =>
    strings(sourceIds) && sourceIds.length >= minimum && new Set(sourceIds).size === sourceIds.length && sourceIds.every(id => ids.has(id))
  if (ids.size !== story.sources.length || !story.commitments.every(item => item &&
    (isDay(item.date) || isMonth(item.date)) && nonempty(item.title) && nonempty(item.comparison) &&
    (item.kind === 'manifesto' || item.kind === 'public-statement') && story.personIds.includes(item.personId) &&
    ids.has(item.sourceId) && (item.document === undefined || item.kind === 'manifesto' && item.document &&
      isHttpsUrl(item.document.url) && nonempty(item.document.section)))) return false

  if (story.sourceComparisons !== undefined && (!Array.isArray(story.sourceComparisons) ||
    !story.sourceComparisons.every(item => item && nonempty(item.summary) && validSourceIds(item.sourceIds, 2)))) return false

  const timelineIds = new Set<string>()
  if (story.timeline !== undefined && (!Array.isArray(story.timeline) || !story.timeline.every((item, index, timeline) => {
    if (!item || !isId(item.id) || timelineIds.has(item.id) || !isDay(item.date) ||
      !['reported', 'published', 'scheduled'].includes(item.kind) || !nonempty(item.title) || !nonempty(item.summary) ||
      !validSourceIds(item.sourceIds, 1) || (index > 0 && timeline[index - 1].date > item.date)) return false
    timelineIds.add(item.id)
    return true
  }))) return false

  const quiz = story.quiz
  return quiz === undefined || Boolean(quiz && isId(quiz.id) && nonempty(quiz.prompt) && strings(quiz.options) &&
    quiz.options.length > 1 && Number.isInteger(quiz.correct) && quiz.correct >= 0 && quiz.correct < quiz.options.length &&
    nonempty(quiz.explanation) && strings(quiz.sourceIds) && quiz.sourceIds.length && quiz.sourceIds.every(id => ids.has(id)))
}

function validateEdition(value: unknown): Edition {
  const edition = value as Edition
  if (edition?.version !== 1 || !Array.isArray(edition.entries)) throw new Error('Invalid reviewed edition')
  const ids = new Set()
  for (const entry of edition.entries) {
    if (!entry?.story || !nonempty(entry.reviewer) || !isDay(entry.story.reviewedAt) ||
      !['reviewed', 'withdrawn'].includes(entry.story.reviewStatus) || !sha256.test(entry.revision)) {
      throw new Error('Invalid editorial decision')
    }
    const { reviewStatus: _status, reviewedAt: _date, ...draft } = entry.story
    if (!validDraft(draft) || entry.story.reviewedAt < draft.publishedAt || entry.revision !== digest(draft) || ids.has(draft.id)) {
      throw new Error('Invalid edition story or revision')
    }
    ids.add(draft.id)
  }
  return edition
}

export function saveDraftBatch(path: string, batch: DraftBatch) {
  withFileLock(path, () => {
    if (existsSync(path) && (readJson(path) as DraftBatch).collectedAt > batch.collectedAt) throw new Error('A newer collection already exists')
    writeJson(path, batch)
  })
}

export const readDraftBatch = (path: string) => readJson(path) as DraftBatch

export function recordDecision({
  batchPath, editionPath, id, revision, reviewer, decision, now = new Date(),
}: {
  batchPath: string; editionPath: string; id: string; revision: string; reviewer: string
  decision: 'approve' | 'withdraw'; now?: Date
}) {
  if (!isId(id) || !sha256.test(revision) || !nonempty(reviewer) || reviewer.length > 80) {
    throw new Error('Provide a story ID, full revision and reviewer label')
  }
  return withFileLock(editionPath, () => {
    const edition: Edition = existsSync(editionPath) ? validateEdition(readJson(editionPath)) : { version: 1, entries: [] }
    const previous = edition.entries.find(entry => entry.story.id === id)
    let draft: DraftStory
    if (decision === 'withdraw') {
      if (previous?.revision !== revision || previous.story.reviewStatus !== 'reviewed') throw new Error('No matching published revision')
      const { reviewStatus: _status, reviewedAt: _date, ...published } = previous.story
      draft = published
    } else {
      const proposal = readDraftBatch(batchPath).drafts.find(item => item.story.id === id)
      if (!proposal || proposal.revision !== revision || digest(proposal.story) !== revision || !validDraft(proposal.story)) {
        throw new Error('The staged story does not match that revision')
      }
      if (previous?.revision === revision && previous.story.reviewStatus === 'reviewed') return previous
      draft = proposal.story
    }
    const reviewedAt = new Date(now.getTime() + 3_600_000).toISOString().slice(0, 10)
    if (reviewedAt < draft.publishedAt) throw new Error('A story cannot be approved before publication')
    const status = decision === 'approve' ? 'reviewed' : 'withdrawn'
    const entry: ReviewedEntry = { revision, reviewer, story: { ...draft, reviewStatus: status, reviewedAt } }
    edition.entries = [...edition.entries.filter(item => item.story.id !== id), entry]
      .sort((a, b) => b.story.publishedAt.localeCompare(a.story.publishedAt) || a.story.id.localeCompare(b.story.id))
    writeJson(editionPath, edition)
    return entry
  })
}

export function createEditionReader(path: string) {
  let stamp: string | undefined
  let published: Story[] = []
  return () => {
    const stat = statSync(path, { bigint: true })
    const nextStamp = [stat.ino, stat.mtimeNs, stat.size].join('/')
    if (stamp !== nextStamp) {
      const entries = validateEdition(readJson(path)).entries
      published = entries.filter(entry => entry.story.reviewStatus === 'reviewed').map(entry => entry.story)
      stamp = nextStamp
    }
    return published
  }
}
