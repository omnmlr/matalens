/** Public, read-only story payload shared with the news service. */
export type StorySource = {
  id: string
  title: string
  publisher: string
  url: string
  publishedAt?: string
  evidence?: string
}

export type StoryQuiz = {
  id: string
  prompt: string
  options: string[]
  correct: number
  explanation: string
  sourceIds: string[]
}

export type StoryCommitment = {
  title: string
  kind: 'manifesto' | 'public-statement'
  date: string
  personId: string
  sourceId: string
  comparison: string
  document?: { url: string; section: string }
}

export type StorySourceComparison = {
  summary: string
  sourceIds: [string, string, ...string[]]
}

export type StoryTimelineEntry = {
  id: string
  date: string
  kind: 'reported' | 'published' | 'scheduled'
  title: string
  summary: string
  sourceIds: string[]
}

export type Story = {
  id: string
  title: string
  publishedAt: string
  updatedAt?: string
  reviewedAt: string
  reviewStatus: 'reviewed' | 'pending' | 'withdrawn'
  topic: string
  personIds: string[]
  partyCodes: string[]
  sources: [StorySource, ...StorySource[]]
  explanation: string
  context: string
  significance: string
  commitments: StoryCommitment[]
  sourceComparisons?: StorySourceComparison[]
  timeline?: StoryTimelineEntry[]
  openQuestion?: string
  quiz?: StoryQuiz
}

export interface StoryRepository {
  list(options?: { personId?: string; signal?: AbortSignal }): Promise<Story[]>
  get(id: string, signal?: AbortSignal): Promise<Story | null>
}
