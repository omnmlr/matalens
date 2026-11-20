import type { Story, StoryCommitment, StoryQuiz, StoryRepository, StorySource } from './story-contract'
import { fixtures } from './story-fixtures'

export const usingFixtures = import.meta.env.VITE_STORY_PROVIDER !== 'api'
export const storyPath = (id: string) => '/stories/' + id
export const storyIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

type RecordValue = Record<string, unknown>
const isRecord = (value: unknown): value is RecordValue => typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const isDate = (value: unknown): value is string => typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}.*)?$/.test(value) && Number.isFinite(Date.parse(value))
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(isText)
const optional = (value: unknown, check: (candidate: unknown) => boolean) => value === undefined || check(value)

function webUrl(value: unknown) {
  if (!isText(value)) return false
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function isSource(value: unknown): value is StorySource {
  return isRecord(value) && isText(value.id) && isText(value.title) && isText(value.publisher) &&
    webUrl(value.url) && optional(value.publishedAt, isDate) && optional(value.evidence, isText)
}

const isMonth = (value: unknown) => typeof value === 'string' && /^\d{4}-(?:0[1-9]|1[0-2])$/.test(value)

function isCommitment(value: unknown): value is StoryCommitment {
  return isRecord(value) && isText(value.title) && (value.kind === 'manifesto' || value.kind === 'public-statement') &&
    (isDate(value.date) || isMonth(value.date)) && isText(value.personId) && isText(value.sourceId) && isText(value.comparison)
}

function isQuiz(value: unknown): value is StoryQuiz {
  return isRecord(value) && isText(value.id) && isText(value.prompt) && strings(value.options) &&
    typeof value.correct === 'number' && Number.isInteger(value.correct) && value.options.length > 1 &&
    value.correct >= 0 && value.correct < value.options.length && isText(value.explanation) &&
    strings(value.sourceIds) && value.sourceIds.length > 0
}

function isStory(value: unknown): value is Story {
  if (!isRecord(value) || !isText(value.id) || !storyIdPattern.test(value.id) || !isText(value.title) ||
    !isDate(value.publishedAt) || !optional(value.updatedAt, isDate) || !isDate(value.reviewedAt) ||
    !['reviewed', 'pending', 'withdrawn'].includes(String(value.reviewStatus)) || !isText(value.topic) ||
    !strings(value.personIds) || !strings(value.partyCodes) || !Array.isArray(value.sources) ||
    !value.sources.length || !value.sources.every(isSource) || !isText(value.explanation) ||
    !isText(value.context) || !isText(value.significance) || !optional(value.openQuestion, isText) ||
    !Array.isArray(value.commitments) || !value.commitments.every(isCommitment)) return false
  const sources = new Set(value.sources.map(source => source.id))
  const people = new Set(value.personIds)
  return sources.size === value.sources.length &&
    value.commitments.every(item => sources.has(item.sourceId) && people.has(item.personId)) &&
    (value.quiz === undefined || isQuiz(value.quiz) && value.quiz.sourceIds.every(id => sources.has(id)))
}

const reviewed = (story: Story) => story.reviewStatus === 'reviewed'

const fixtureRepository: StoryRepository = {
  async list({ personId } = {}) {
    return fixtures.filter(story => reviewed(story) && (!personId || story.personIds.includes(personId)))
  },
  async get(id) {
    return fixtures.find(story => story.id === id && reviewed(story)) ?? null
  },
}

async function readJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const timeout = AbortSignal.timeout(12_000)
  const response = await fetch(path, {
    headers: { Accept: 'application/json' }, credentials: 'omit', redirect: 'error',
    cache: 'no-store', signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (response.status === 404 && path.startsWith('/api/stories/')) return null
  if (!response.ok) throw new Error('Story service unavailable')
  return response.json()
}

const apiRepository: StoryRepository = {
  async list({ personId, signal } = {}) {
    const suffix = personId ? '?' + new URLSearchParams({ personId }) : ''
    const response = await readJson('/api/stories' + suffix, signal)
    if (!Array.isArray(response)) throw new Error('Invalid story collection')
    const valid = response.filter(isStory)
    if (valid.length !== response.length) throw new Error('Invalid story record')
    return [...new Map(valid.filter(reviewed).map(story => [story.id, story])).values()]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  },
  async get(id, signal) {
    if (!storyIdPattern.test(id)) return null
    const response = await readJson('/api/stories/' + encodeURIComponent(id), signal)
    if (response === null) return null
    if (!isStory(response) || response.id !== id) throw new Error('Invalid story record')
    return reviewed(response) ? response : null
  },
}

export const storyRepository = usingFixtures ? fixtureRepository : apiRepository
