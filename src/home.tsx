import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Files, UsersRound } from 'lucide-react'
import { contestPath, presidential, rosterFor } from './catalogue'
import { dates, links } from './content'
import { RecruitmentComparison, recruitmentComparison, recruitmentStoryId } from './evidence'
import { dailyLesson, lessonPath } from './learning-data'
import { nigeriaDate } from './state'
import { storyPath } from './stories'
import { FeedNotice, SampleLabel, StoryList, type StoryFeed } from './story-ui'
import { ActionLink, External } from './ui'

const ticketCount = rosterFor(presidential).length

export function HomePage({ feed }: { feed: StoryFeed }) {
  const evidence = feed.stories.find(story => story.id === recruitmentStoryId)
  const featured = evidence && recruitmentComparison(evidence) ? evidence : undefined
  const developments = feed.stories.filter(story => story.id !== featured?.id).slice(0, 2)
  const lesson = dailyLesson()

  return <div className="wrap guide-home">
    <section className="guide-hero" aria-labelledby="guide-heading">
      <div className="guide-intro">
        <p className="editorial-kicker"><span className="flag" aria-hidden="true" /> Nigeria’s 2027 election guide</p>
        <h1 id="guide-heading">Know the candidates.<br /><em>Question the claims.</em></h1>
        <p>Find who’s contesting, follow what’s happening, and go straight to the records behind it.</p>
        <div className="guide-actions">
          <ActionLink href="/elections">Explore 2027 elections</ActionLink>
          <ActionLink href={featured ? storyPath(featured.id) + '#source-comparison' : '/stories'} secondary>See the evidence</ActionLink>
        </div>
      </div>
      <aside className="guide-dates" aria-labelledby="guide-dates-title">
        <div className="guide-dates-head"><CalendarDays size={19} aria-hidden="true" /><h2 id="guide-dates-title">Scheduled election dates</h2></div>
        {dates.map(({ date, title }) => <a key={date} href={`/elections?date=${date}`}>
          <time dateTime={date}><strong>{nigeriaDate(date, { day: 'numeric' })}</strong><span>{nigeriaDate(date, { month: 'short' })} 2027</span></time>
          <span>{title}</span><ArrowUpRight size={17} aria-hidden="true" />
        </a>)}
        <External href={links.calendar}>Check the INEC calendar</External>
      </aside>
    </section>

    <nav className="guide-route-strip" aria-label="Election records">
      <a href={contestPath(presidential)}><CalendarDays aria-hidden="true" /><span><strong>2027 Presidential election</strong><small>{ticketCount} named tickets</small></span><ArrowRight aria-hidden="true" /></a>
      <a href="/discover"><UsersRound aria-hidden="true" /><span><strong>Find candidates and parties</strong><small>Search published records</small></span><ArrowRight aria-hidden="true" /></a>
      <a href="/archive"><Files aria-hidden="true" /><span><strong>2023 Election Archive</strong><small>Past candidates and official results</small></span><ArrowRight aria-hidden="true" /></a>
    </nav>

    {feed.sample && <SampleLabel />}
    {featured && <RecruitmentComparison story={featured} compact />}
    <section className="editorial-section home-developments" aria-labelledby="updates-heading">
      <div className="editorial-section-head"><div><p className="editorial-kicker">Published in 2026</p><h2 id="updates-heading">Current Developments</h2></div><a className="text-link" href="/stories">View developments <ArrowRight size={16} aria-hidden="true" /></a></div>
      <FeedNotice feed={feed} />
      {developments.length ? <StoryList stories={developments} /> : feed.online && feed.status === 'ready' && <p className="editorial-note">There are no other published developments in this edition.</p>}
    </section>

    <section className="guide-learn" aria-labelledby="guide-learn-title">
      <div><BookOpen size={22} aria-hidden="true" /><h2 id="guide-learn-title">Practise before election day</h2><p>{lesson.introduction}</p></div>
      <div className="guide-learn-actions"><ActionLink href={lessonPath(lesson.id)}>{lesson.title}</ActionLink><a className="text-link" href="/learn">All civic lessons <ArrowRight size={16} aria-hidden="true" /></a></div>
    </section>
  </div>
}
