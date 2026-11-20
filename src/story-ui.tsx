import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, ChevronDown, FileText } from 'lucide-react'
import { identities, partyNames, partyPath } from './catalogue'
import { personPath } from './people'
import { RecruitmentComparison, recruitmentComparison } from './evidence'
import { QuickCheck, storyExerciseId, type Progress } from './learning'
import { nigeriaDate } from './state'
import { fixtures } from './story-fixtures'
import { storyPath, storyRepository, usingFixtures } from './stories'
import type { Story, StoryTimelineEntry } from './story-contract'
import { External } from './ui'

type LoadStatus = 'loading' | 'ready' | 'error'
export type StoryFeed = {
  stories: Story[]; status: LoadStatus; sample: boolean; online: boolean; retry: () => void
}
export type StorySaves = { savedStories: string[]; toggleStory: (id: string) => void }

export function useStoryFeed(online: boolean, enabled: boolean): StoryFeed {
  const [data, setData] = useState<{ stories: Story[]; status: LoadStatus }>(
    () => ({ stories: usingFixtures ? fixtures : [], status: usingFixtures ? 'ready' : 'loading' }),
  )
  const [attempt, retry] = useState(0)
  useEffect(() => {
    if (usingFixtures || !online || !enabled) return
    const controller = new AbortController()
    setData(previous => ({ ...previous, status: 'loading' }))
    storyRepository.list({ signal: controller.signal }).then(
      stories => { if (!controller.signal.aborted) setData({ stories, status: 'ready' }) },
      () => { if (!controller.signal.aborted) setData(previous => ({ ...previous, status: 'error' })) },
    )
    return () => controller.abort()
  }, [attempt, enabled, online])
  return { ...data, online, sample: usingFixtures, retry: () => retry(previous => previous + 1) }
}

export function SampleLabel() {
  return <span className="sample-label"><span aria-hidden="true" /> Editorial sample</span>
}

export function FeedNotice({ feed }: { feed: StoryFeed }) {
  if (!feed.online && !feed.sample) return <p className="editorial-note" role="status">You’re offline. Reconnect to get updates.</p>
  if (feed.status === 'loading') return <p className="editorial-note" role="status">Loading updates…</p>
  if (feed.status === 'error') return <div className="editorial-note" role="status">
    <p>Updates are temporarily unavailable.</p><button className="link-button" onClick={feed.retry}>Try again</button>
  </div>
  return null
}

export function StoryMeta({ story }: { story: Story }) {
  return <p className="story-meta"><span>{story.topic}</span><time dateTime={story.publishedAt}>{nigeriaDate(story.publishedAt)}</time></p>
}

export function StoryList({ stories, compact = false }: { stories: Story[]; compact?: boolean }) {
  return <ul className={compact ? 'brief-list brief-list-compact' : 'brief-list'}>{stories.map(story => <li key={story.id}>
    <StoryMeta story={story} />
    <h3><a href={storyPath(story.id)}>{story.title} <ArrowRight size={17} aria-hidden="true" /></a></h3>
    {!compact && <p>{story.explanation}</p>}
  </li>)}</ul>
}

export function UpdatesPage({ feed }: { feed: StoryFeed }) {
  return <section className="wrap standard-page editorial-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Published in 2026</p><h1>Current Developments</h1><p>Reviewed announcements and political statements concerning Nigeria’s 2027 elections. Each date shows when the development was published.</p></div>
    {feed.sample && <SampleLabel />}
    <FeedNotice feed={feed} />
    {feed.stories.length ? <StoryList stories={feed.stories} /> : feed.online && feed.status === 'ready' && <p className="editorial-note">There are no published updates yet.</p>}
  </section>
}

function Evidence({ label, children }: { label: string; children: ReactNode }) {
  return <details className="editorial-details"><summary>{label} <ChevronDown size={18} aria-hidden="true" /></summary><div>{children}</div></details>
}

const timelineLabels: Record<StoryTimelineEntry['kind'], string> = {
  reported: 'Reported',
  published: 'Published',
  scheduled: 'Scheduled',
}

function EvidenceLinks({ ids, sources }: { ids: string[]; sources: Story['sources'] }) {
  return <ul className="evidence-links">{ids.map(id => {
    const source = sources.find(item => item.id === id)
    return source && <li key={id}><External href={source.url}>{source.title}</External></li>
  })}</ul>
}

function StoryEvidence({ story, featured }: { story: Story; featured: boolean }) {
  return <>
    {!featured && Boolean(story.sourceComparisons?.length) && <section aria-labelledby="source-comparison">
      <h2 id="source-comparison">Compare sources</h2>
      {story.sourceComparisons?.map(item => <div className="comparison-note" key={item.sourceIds.join('/')}>
        <p>{item.summary}</p>
        <EvidenceLinks ids={item.sourceIds} sources={story.sources} />
      </div>)}
    </section>}
    {Boolean(story.timeline?.length) && <section aria-labelledby="story-timeline">
      <h2 id="story-timeline">Timeline</h2>
      <ol className="story-timeline">{story.timeline?.map(item => <li key={item.id}>
        <p className="story-meta"><span>{timelineLabels[item.kind]}</span><time dateTime={item.date}>{nigeriaDate(item.date)}</time></p>
        <h3>{item.title}</h3><p>{item.summary}</p>
        <EvidenceLinks ids={item.sourceIds} sources={story.sources} />
      </li>)}</ol>
    </section>}
  </>
}

export function StoryPage({ id, feed, progress, saves }: { id: string; feed: StoryFeed; progress: Progress; saves: StorySaves }) {
  const bundled = feed.sample ? feed.stories.find(story => story.id === id) : undefined
  const [detail, setDetail] = useState<{ story?: Story | null; status: LoadStatus }>({ status: 'loading' })
  const [attempt, retry] = useState(0)
  const cached = feed.stories.find(story => story.id === id)

  useEffect(() => {
    if (feed.sample || !feed.online) return
    const controller = new AbortController()
    setDetail(previous => ({ ...previous, status: 'loading' }))
    storyRepository.get(id, controller.signal).then(
      story => { if (!controller.signal.aborted) setDetail({ story, status: 'ready' }) },
      () => { if (!controller.signal.aborted) setDetail(previous => ({ ...previous, status: 'error' })) },
    )
    return () => controller.abort()
  }, [attempt, feed.online, feed.sample, id])

  const story = feed.sample ? bundled : detail.story === undefined ? cached : detail.story
  const ready = feed.sample || detail.status === 'ready'
  const featured = Boolean(story && recruitmentComparison(story))

  useEffect(() => {
    if (featured && window.location.hash === '#source-comparison') {
      const heading = document.getElementById('case-title')
      heading?.focus({ preventScroll: true })
      document.getElementById('source-comparison')?.scrollIntoView()
    }
  }, [featured])
  if (!story) return <section className="wrap standard-page editorial-page">
    <a className="text-link back-link" href="/stories"><ArrowLeft size={16} aria-hidden="true" /> Current Developments</a>
    <h1>{ready ? 'Story unavailable' : 'Political update'}</h1>
    {ready ? <p>This story is unavailable in the briefing.</p> : <FeedNotice feed={{ ...feed, status: detail.status, retry: () => retry(previous => previous + 1) }} />}
  </section>

  const [original] = story.sources
  const personLinks = [...new Set(story.personIds)].filter(personId => identities[personId])
  const partyLinks = [...new Set(story.partyCodes)].filter(code => partyNames[code])
  const saved = saves.savedStories.includes(id)
  const quiz = story.quiz
  return <article className="wrap standard-page editorial-page story-page" data-evidence={featured || undefined}>
    <a className="text-link back-link" href="/stories"><ArrowLeft size={16} aria-hidden="true" /> Current Developments</a>
    <header className="story-masthead">
      <StoryMeta story={story} />
      <h1>{story.title}</h1>
      <p className="story-deck">{story.explanation}</p>
      <div className="story-byline">
        <div><span>Lead source · {original.publisher}</span><External href={original.url}>{original.title}</External></div>
        <button type="button" className="button button-secondary story-save" aria-pressed={saved} aria-label="Save story" onClick={() => saves.toggleStory(id)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /> {saved ? 'Saved' : 'Save story'}</button>
      </div>
    </header>
    <div className="story-layout">
      <div className="story-body">
        {!feed.sample && detail.status === 'error' && <FeedNotice feed={{ ...feed, status: 'error', retry: () => retry(previous => previous + 1) }} />}
        {featured && <RecruitmentComparison story={story} />}
        <section aria-labelledby="story-explanation"><h2 id="story-explanation">Why it matters</h2><p>{story.significance}</p>
          <Evidence label="Read the context"><p>{story.context}</p></Evidence>
        </section>
        {!featured && <section aria-labelledby="story-evidence"><h2 id="story-evidence">Original sources</h2>
          <ol className="evidence-list">{story.sources.map(source => <li key={source.id}>
            <FileText size={20} strokeWidth={1.5} aria-hidden="true" /><div>
              <p className="story-meta"><span>{source.publisher}</span>{source.publishedAt && <time dateTime={source.publishedAt}>{nigeriaDate(source.publishedAt)}</time>}</p>
              <External href={source.url}>{source.title}</External>
              {source.evidence && <Evidence label="What this source shows"><p>{source.evidence}</p></Evidence>}
            </div>
          </li>)}</ol>
        </section>}
        <StoryEvidence story={story} featured={featured} />
        {story.commitments.length > 0 && <section className="story-commitments"><h2>Compare with commitments</h2>
          {story.commitments.map((item, index) => {
            const source = story.sources.find(source => source.id === item.sourceId)
            return <Evidence key={index} label={item.title}>
              <p className="story-meta"><span>{item.kind === 'manifesto' ? 'Manifesto' : 'Attributed campaign statement'}</span>
                <time dateTime={item.date}>{nigeriaDate(item.date, item.date.length === 7 ? { month: 'long', year: 'numeric' } : undefined)}</time></p>
              {identities[item.personId] && <p><a className="text-link" href={personPath(item.personId)}>{identities[item.personId].name}</a></p>}
              <p>{item.comparison}</p>
              {item.document && <p><External href={item.document.url}>{item.document.section}</External></p>}
              {source && <External href={source.url}>{source.title}</External>}
            </Evidence>
          })}
        </section>}
        {story.openQuestion && !featured && <section className="open-question"><h2>Open question</h2><p>{story.openQuestion}</p></section>}
        {quiz && <section className="story-check"><h2>Check your understanding</h2>
          <QuickCheck key={quiz.id} quiz={quiz} sources={story.sources} status={progress.outcomes[storyExerciseId(id, quiz)]} submitAnswer={correct => progress.recordAttempt(storyExerciseId(id, quiz), correct)} />
        </section>}
        <a className="text-link lesson-return" href="/stories">Browse more developments <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
      <aside className="story-aside" aria-label="Story record">
        {feed.sample && <SampleLabel />}
        <p>Reviewed <time dateTime={story.reviewedAt}>{nigeriaDate(story.reviewedAt)}</time></p>
        {story.updatedAt && <p>Updated <time dateTime={story.updatedAt}>{nigeriaDate(story.updatedAt)}</time></p>}
        {personLinks.length > 0 && <Evidence label={`People in this story (${personLinks.length})`}><ul>{personLinks.map(personId => <li key={personId}><a href={personPath(personId)}>{identities[personId].name}</a></li>)}</ul></Evidence>}
        {partyLinks.length > 0 && <Evidence label={`Related parties (${partyLinks.length})`}><ul>{partyLinks.map(code => <li key={code}><a href={partyPath(code)}>{partyNames[code]} ({code})</a></li>)}</ul></Evidence>}
      </aside>
    </div>
  </article>
}
