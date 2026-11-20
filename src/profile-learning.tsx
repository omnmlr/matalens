import { ArrowLeft, ArrowRight, ChevronDown, UserRound } from 'lucide-react'
import { candidatePath, partyNames, partyPath, publicRecords, sources } from './catalogue'
import { FollowButton } from './follow'
import { lessonPath } from './learning-data'
import { ticketsByMate, type Follows } from './people'
import { nigeriaDate } from './state'
import { FeedNotice, SampleLabel, StoryList, type StoryFeed } from './story-ui'
import { External } from './ui'

export function PublicRecordList({ records }: { records: typeof publicRecords[string] }) {
  return <ul className="profile-evidence">{records.map(record => <li key={record.source}>
    <time dateTime={record.date}>{nigeriaDate(record.date, record.date.length === 7 ? { month: 'long', year: 'numeric' } : undefined)}</time>
    <p>{record.fact}</p><External href={record.source}>{record.label}</External>
  </li>)}</ul>
}

export function ProfileLearning({ id, feed }: { id: string; feed: StoryFeed }) {
  const developments = feed.stories.filter(story => story.personIds.includes(id))
  const manifestos = [...new Map(developments.flatMap(story => story.commitments
    .filter(item => item.personId === id && item.kind === 'manifesto')
    .map(item => ({ item, source: story.sources.find(source => source.id === item.sourceId) })))
    .map(entry => [`${entry.source?.url}/${entry.item.title}`, entry])).values()]
  return <>
    <section className="record-section profile-section"><h2>Manifestos</h2>
      {manifestos.length ? <ul className="profile-evidence">{manifestos.map(({ item, source }) => <li key={item.title}>
        <time dateTime={item.date}>{nigeriaDate(item.date, item.date.length === 7 ? { month: 'long', year: 'numeric' } : undefined)}</time>
        <p>{item.title}</p><p>{item.comparison}</p>
        {item.document && <p><External href={item.document.url}>{item.document.section}</External></p>}
        {source && <External href={source.url}>{source.title}</External>}
      </li>)}</ul> : feed.status === 'ready' && <p>There is no sourced manifesto excerpt in this profile yet.</p>}
      <FeedNotice feed={feed} />
    </section>
    <section className="record-section profile-section"><h2>Relevant developments</h2>
      {!manifestos.length && feed.status === 'ready' && developments.length === 0 && <p>There are no published updates linked to this profile yet.</p>}
      {developments.length > 0 && <>{feed.sample && <SampleLabel />}<StoryList stories={developments} compact /></>}
    </section>
    <section className="record-section profile-section">
      <h2>Open questions</h2>
      {manifestos.length ? <p>What later implementation records show progress on the published targets?</p> : <p>Which additional primary documents would establish the person’s policy positions or public record?</p>}
    </section>
    <section className="record-section profile-section">
      <h2>Learn to read the record</h2>
      <a href={lessonPath('read-a-ticket')} className="text-link">Read a presidential ticket <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  </>
}

export function RunningMatePage({ person, follows, feed }: {
  person: { id: string; name: string }; follows: Follows; feed: StoryFeed
}) {
  const tickets = ticketsByMate.get(person.id) ?? []
  const records = publicRecords[person.id] ?? []
  return <article className="wrap standard-page profile-page editorial-page">
    <a className="text-link back-link" href="/discover"><ArrowLeft size={16} aria-hidden="true" /> Discover people</a>
    <div className="profile-masthead editorial-profile-head"><span className="portrait portrait-large" aria-hidden="true"><UserRound strokeWidth={1.35} size={54} /></span>
      <div className="catalogue-title editorial-title"><p className="editorial-kicker">Politician profile</p><h1>{person.name}</h1><p>Running mate · {tickets.map(ticket => ticket.race.year).join(' / ')}</p></div>
      <FollowButton id={person.id} {...follows} />
    </div>
    <div className="record-grid">
      <div>
        <section className="record-section profile-section"><h2>Biography and public records</h2>
          {records.length ? <PublicRecordList records={records} /> : <p>This profile currently has published ticket records.</p>}
        </section>
        <section className="record-section profile-section"><h2>Election affiliations</h2>
          <ul className="profile-evidence">{tickets.map(ticket => {
            const source = sources[ticket.race.listingSourceId]
            return <li key={ticket.id}><p className="story-meta"><span>{ticket.race.year}</span><span>INEC listing</span></p>
              <p><a className="text-link" href={partyPath(ticket.party)}>{partyNames[ticket.party]} ({ticket.party})</a></p>
              <p><a className="text-link" href={candidatePath(ticket.id)}>Running mate to {ticket.name} <ArrowRight size={15} aria-hidden="true" /></a></p>
              <External href={source.url}>{source.label} · row {ticket.mateNumber}</External>
            </li>
          })}</ul>
        </section>
        <section className="record-section profile-section"><h2>Attributed claims</h2><p>There are no sourced campaign statements in this profile yet.</p></section>
        <ProfileLearning id={person.id} feed={feed} />
      </div>
      <aside className="source-rail"><h2>About this record</h2><details className="editorial-details"><summary>How we label affiliations <ChevronDown size={17} aria-hidden="true" /></summary><div><p>Each party label refers to the relevant election listing.</p></div></details></aside>
    </div>
  </article>
}
