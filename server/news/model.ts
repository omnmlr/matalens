import { createHash } from 'node:crypto'
import type { Story, StoryCommitment, StorySourceComparison, StoryTimelineEntry } from '../../src/story-contract.ts'

export const digest = (record: unknown) => createHash('sha256').update(JSON.stringify(record)).digest('hex')

export const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const isId = (value: unknown): value is string => typeof value === 'string' && value.length <= 120 && idPattern.test(value)

export function isDay(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export const isMonth = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)

export type Evidence = {
  /** Each group requires at least one of its terms in the original source. */
  terms: string[][]
  summary: string
}

export type SourceConfig = {
  id: string
  title: string
  publisher: string
  url: string
  publishedAt?: string
  kind: 'html' | 'catalogue'
  evidence: Record<string, Evidence>
}

export type Capture = {
  title: string
  text: string
  retrievedAt: string
  provenance: 'live' | 'recorded' | 'catalogue'
}

export type SourceRecord = {
  config: SourceConfig
  capture: Capture
  facts: Record<string, string>
}

export type EvidenceRef = { sourceId: string; fact: string }

export type Recipe = {
  id: string
  title: string
  topic: string
  primary: string
  match: { from: string; through: string; terms: string[][] }
  supporting?: string[]
  explanation: EvidenceRef[]
  context: EvidenceRef[]
  significance: EvidenceRef[]
  people?: string[]
  parties?: string[]
  contest?: string
  commitment?: EvidenceRef & {
    title: string; kind: StoryCommitment['kind']; personId: string; date: string; comparison: string
    document?: StoryCommitment['document']
  }
  sourceComparisons?: {
    summary: StorySourceComparison['summary']
    evidence: [EvidenceRef, EvidenceRef, ...EvidenceRef[]]
  }[]
  timeline?: (Pick<StoryTimelineEntry, 'id' | 'kind' | 'title' | 'date'> & { evidence: EvidenceRef[] })[]
  openQuestion?: string
  quiz: EvidenceRef & { id: string; prompt: string; answer: string; distractors: [string, string] }
}

export type DraftStory = Omit<Story, 'reviewStatus' | 'reviewedAt'>

export type Draft = {
  revision: string
  story: DraftStory
  cluster: string[]
  provenance: { sourceId: string; retrievedAt: string; mode: Capture['provenance'] }[]
}

export type DraftBatch = {
  collectedAt: string
  mode: 'recorded' | 'live'
  drafts: Draft[]
  issues: { id: string; reason: string }[]
}

export type ReviewedEntry = {
  revision: string
  story: Story & { reviewStatus: 'reviewed' | 'withdrawn' }
  reviewer: string
}
