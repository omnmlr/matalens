import { ArrowRight, Bookmark, Camera, FileCheck2 } from 'lucide-react'
import { WatchlistPeople } from './watchlist'
import { lessons, lessonPath } from './learning-data'
import { ExerciseStatusLabel, storyExerciseId, type Progress } from './learning'
import type { Watchlist } from './people'
import { PreparationPanel } from './preparation'
import type { Plan, ReceiptEntry } from './state'
import { storyPath } from './stories'
import { FeedNotice, type StoryFeed, type StorySaves } from './story-ui'

export function DeskPage({ watchlist, saves, progress, plan, receipts, feed }: {
  watchlist: Watchlist; saves: StorySaves; progress: Progress; plan: Plan; receipts: ReceiptEntry[]; feed: StoryFeed
}) {
  const saved = saves.savedStories.map(id => ({ id, story: feed.stories.find(item => item.id === id) }))
  const lessonProgress = lessons.filter(lesson => progress.outcomes[lesson.id])
  const storyExercises = feed.stories.flatMap(story => {
    const outcome = story.quiz && progress.outcomes[storyExerciseId(story.id, story.quiz)]
    return outcome ? [{ story, outcome }] : []
  })
  return <section className="wrap standard-page editorial-page desk-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Private to this browser</p><h1>My Desk</h1><p>Return to the people, sources and exercises you saved on this device.</p></div>
    <div className="desk-grid">
      <div>
        <section className="desk-section">
          <div className="editorial-section-head"><h2>Watchlist</h2><a className="text-link" href="/discover">Browse candidates <ArrowRight size={16} aria-hidden="true" /></a></div>
          <WatchlistPeople {...watchlist} stories={feed.stories} />
        </section>
        <section className="desk-section">
          <div className="editorial-section-head"><h2>Saved stories</h2><Bookmark size={20} strokeWidth={1.5} aria-hidden="true" /></div>
          {saved.length ? <>
            <FeedNotice feed={feed} />
            <ul className="desk-list">{saved.map(({ id, story }) => <li key={id}>
              <a href={storyPath(id)}>{story?.title ?? 'Open saved story'}</a>
              <button type="button" className="link-button" aria-label={story ? `Remove ${story.title} from saved stories` : 'Remove saved story'} onClick={() => saves.toggleStory(id)}>Remove</button>
            </li>)}</ul>
          </> : <div className="editorial-empty"><p>Save a story to come back to its sources and context.</p><a className="text-link" href="/stories">Browse updates <ArrowRight size={16} aria-hidden="true" /></a></div>}
        </section>
        <section className="desk-section">
          <div className="editorial-section-head"><h2>Learning progress</h2><a href="/learn" className="text-link">All lessons <ArrowRight size={16} aria-hidden="true" /></a></div>
          {lessonProgress.length || storyExercises.length ? <ul className="desk-list">
            {lessonProgress.map(lesson => <li key={lesson.id}><a href={lessonPath(lesson.id)}>{lesson.title}</a><ExerciseStatusLabel status={progress.outcomes[lesson.id]} /></li>)}
            {storyExercises.map(({ story, outcome }) => <li key={story.id}><a href={storyPath(story.id)}>{story.title} exercise</a><ExerciseStatusLabel status={outcome} /></li>)}
          </ul> : <p className="editorial-note">Your exercise attempts and correct answers will appear here.</p>}
        </section>
      </div>
      <aside className="desk-side" aria-label="Private civic tools">
        <PreparationPanel plan={plan} />
        <section className="panel desk-camera">
          <h2>Civic Camera</h2><p>Review photo intake availability and private evidence guidance.</p>
          <a className="text-link" href="/camera"><Camera size={17} aria-hidden="true" /> Open Civic Camera</a>
          <a className="text-link" href="/actions"><FileCheck2 size={17} aria-hidden="true" /> {receipts.length ? `Open saved receipts (${receipts.length})` : 'Open or recover receipts'}</a>
        </section>
      </aside>
    </div>
  </section>
}
