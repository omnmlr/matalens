import { ArrowRight, Bookmark, Camera, Check, FileCheck2 } from 'lucide-react'
import { FollowedPeople } from './follow'
import { lessons, lessonPath } from './learning-data'
import { storyExerciseId, type Progress } from './learning'
import type { Follows } from './people'
import { PreparationPanel } from './preparation'
import type { Plan, ReceiptEntry } from './state'
import { storyPath } from './stories'
import { FeedNotice, type StoryFeed, type StorySaves } from './story-ui'

export function DeskPage({ follows, saves, progress, plan, receipts, feed }: {
  follows: Follows; saves: StorySaves; progress: Progress; plan: Plan; receipts: ReceiptEntry[]; feed: StoryFeed
}) {
  const saved = saves.savedStories.map(id => ({ id, story: feed.stories.find(item => item.id === id) }))
  const completedLessons = lessons.filter(lesson => progress.completed.includes(lesson.id))
  const storyExercises = feed.stories.filter(story => story.quiz && progress.completed.includes(storyExerciseId(story.id, story.quiz)))
  return <section className="wrap standard-page editorial-page desk-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Private to this browser</p><h1>My Desk</h1><p>Your following, reading list, lessons and election preparation.</p></div>
    <div className="desk-grid">
      <div>
        <section className="desk-section">
          <div className="editorial-section-head"><h2>Following</h2><a className="text-link" href="/#following">Your briefing <ArrowRight size={16} aria-hidden="true" /></a></div>
          <FollowedPeople {...follows} />
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
          <div className="editorial-section-head"><h2>Completed learning</h2><a href="/learn" className="text-link">All lessons <ArrowRight size={16} aria-hidden="true" /></a></div>
          {completedLessons.length || storyExercises.length ? <ul className="desk-list">
            {completedLessons.map(lesson => <li key={lesson.id}><a href={lessonPath(lesson.id)}>{lesson.title}</a><Check size={18} aria-label="Completed" /></li>)}
            {storyExercises.map(story => <li key={story.id}><a href={storyPath(story.id)}>{story.title} exercise</a><Check size={18} aria-label="Completed" /></li>)}
          </ul> : <p className="editorial-note">Your completed lessons and story exercises will appear here.</p>}
        </section>
      </div>
      <aside className="desk-side" aria-label="Private civic tools">
        <PreparationPanel plan={plan} />
        <section className="panel desk-camera">
          <h2>Civic Camera</h2><p>Document a community issue or a publicly displayed result sheet.</p>
          <a className="text-link" href="/camera"><Camera size={17} aria-hidden="true" /> Start a report</a>
          <a className="text-link" href="/actions"><FileCheck2 size={17} aria-hidden="true" /> {receipts.length ? `Open saved receipts (${receipts.length})` : 'Open or recover receipts'}</a>
        </section>
      </aside>
    </div>
  </section>
}
