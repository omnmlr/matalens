import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contestPath, presidential, rosterFor } from './catalogue'
import { FollowedPeople } from './follow'
import { dailyLesson } from './learning-data'
import { DailyLesson, type Progress } from './learning'
import type { Follows } from './people'
import { nigeriaDate } from './state'
import { storyPath } from './stories'
import { FeedNotice, SampleLabel, StoryList, StoryMeta, type StoryFeed } from './story-ui'
import { ActionLink } from './ui'

const editionDate = new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', weekday: 'long', day: 'numeric', month: 'long' })
const ticketCount = rosterFor(presidential).length

export function HomePage({ feed, follows, progress }: { feed: StoryFeed; follows: Follows; progress: Progress }) {
  const lesson = dailyLesson()
  const [lead, ...otherStories] = feed.stories
  const related = feed.stories.filter(story => follows.followed.some(id => story.personIds.includes(id)))

  return <div className="wrap editorial-home">
    <section className="briefing-hero" aria-labelledby="briefing-heading">
      <div className="briefing-intro">
        <p className="editorial-kicker">The Nigeria briefing</p>
        <h1 id="briefing-heading">Politics in <em>focus.</em></h1>
        <p>Follow the people shaping public life. Understand what happened, then go straight to the source.</p>
        <ActionLink href="#briefing" down>Read the briefing</ActionLink>
      </div>
      <a className="election-cover" href={contestPath(presidential)}>
        <span className="cover-art" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="cover-kicker">Election guide <ArrowUpRight size={23} aria-hidden="true" /></span>
        <strong>2027<br />Presidential<br />election</strong>
        <span className="cover-bottom"><time dateTime={presidential.date}>{nigeriaDate(presidential.date, { day: 'numeric', month: 'long', year: 'numeric' })}</time><span>{ticketCount} named tickets</span></span>
      </a>
    </section>

    <section className="editorial-section home-briefing" id="briefing" aria-labelledby="updates-heading">
      <div className="editorial-section-head">
        <div><p className="editorial-kicker">{editionDate.format(new Date())}</p><h2 id="updates-heading">The briefing</h2></div>
        {feed.sample && <SampleLabel />}
      </div>
      <FeedNotice feed={feed} />
      {lead ? <div className="headline-grid">
        <article className="lead-story">
          <StoryMeta story={lead} />
          <h3><a href={storyPath(lead.id)}>{lead.title}</a></h3>
          <p>{lead.explanation}</p>
          <a className="text-link" href={storyPath(lead.id)}>Read the story <ArrowRight size={16} aria-hidden="true" /></a>
        </article>
        <StoryList stories={otherStories.slice(0, 2)} />
      </div> : feed.online && feed.status === 'ready' && <p className="editorial-note">There are no published updates yet.</p>}
      <a className="text-link section-more" href="/stories">All political updates <ArrowRight size={16} aria-hidden="true" /></a>
    </section>

    <section className="editorial-section following-section" id="following" aria-labelledby="following-heading">
      <div className="editorial-section-head"><h2 id="following-heading">Your following</h2><a className="text-link" href="/desk">My Desk <ArrowRight size={16} aria-hidden="true" /></a></div>
      <div className={follows.followed.length ? 'following-grid' : undefined}>
        <FollowedPeople {...follows} limit={4} />
        {follows.followed.length > 0 && <div className="following-updates">
          <h3>Updates for you</h3>
          <FeedNotice feed={feed} />
          {related.length ? <StoryList stories={related.slice(0, 3)} compact /> : feed.online && feed.status === 'ready' && <p className="editorial-note">There are no updates about the people you follow yet.</p>}
        </div>}
      </div>
    </section>

    <DailyLesson key={lesson.id} lesson={lesson} {...progress} />
  </div>
}
