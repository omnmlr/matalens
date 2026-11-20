import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { candidatePath, partyNames, partyPath, publicRecords, sources } from './catalogue'
import { WatchButton } from './watchlist'
import { Portrait } from './directory'
import { lessonPath } from './learning-data'
import { ticketsByMate, type Watchlist } from './people'
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
  const linked = feed.stories.filter(story => story.personIds.includes(id))
  const developments = linked.filter(story => story.personIds.length === 1)
  const electionRecords = linked.filter(story => story.personIds.length > 1)
  const manifestos = [...new Map(linked.flatMap(story => story.commitments
    .filter(item => item.personId === id && item.kind === 'manifesto')
    .map(item => ({ item, source: story.sources.find(source => source.id === item.sourceId) })))
    .map(entry => [`${entry.source?.url}/${entry.item.title}`, entry])).values()]
  const hasManifesto = manifestos.length > 0
  useEffect(() => {
    if (hasManifesto && window.location.hash === '#manifestos') {
      document.getElementById('manifestos')?.scrollIntoView()
    }
  }, [hasManifesto])
  return <>
    {hasManifesto && <section className="record-section profile-section" id="manifestos">
      <h2>Published manifesto commitments</h2>
      <ul className="profile-evidence">{manifestos.map(({ item, source }) => <li key={item.title}>
        <time dateTime={item.date}>{nigeriaDate(item.date, item.date.length === 7 ? { month: 'long', year: 'numeric' } : undefined)}</time>
        <p><strong>{item.title}</strong></p><p>{item.comparison}</p>
        {item.document && <p><External href={item.document.url}>{item.document.section}</External></p>}
        {source && <External href={source.url}>{source.title}</External>}
      </li>)}</ul>
    </section>}
    <section className="record-section profile-section">
      <h2>Reviewed developments</h2>
      <FeedNotice feed={feed} />
      {feed.sample && linked.length > 0 && <SampleLabel />}
      {developments.length > 0 ? <StoryList stories={developments} compact /> : feed.status === 'ready' && <p>There is no reviewed development specific to this person in the current edition.</p>}
      {electionRecords.length > 0 && <div className="related-election-records"><h3>Related election records</h3><StoryList stories={electionRecords} compact /></div>}
    </section>
    <section className="record-section profile-section">
      <h2>Learn to read the record</h2>
      <a href={lessonPath('read-a-ticket')} className="text-link">Read a presidential ticket <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  </>
}

export function RunningMatePage({ person, watchlist, feed }: {
  person: { id: string; name: string }; watchlist: Watchlist; feed: StoryFeed
}) {
  const allTickets = ticketsByMate.get(person.id) ?? []
  const selectedYear = new URLSearchParams(window.location.search).get('year') === '2023' ? 2023 : Math.max(...allTickets.map(ticket => ticket.race.year))
  const tickets = allTickets.filter(ticket => ticket.race.year === selectedYear)
  const cycleQuery = selectedYear === 2023 ? '?year=2023' : ''
  const records = publicRecords[person.id] ?? []
  return <article className="wrap standard-page profile-page editorial-page">
    <a className="text-link back-link" href={'/discover' + cycleQuery}><ArrowLeft size={16} aria-hidden="true" /> Discover people</a>
    <div className="profile-masthead editorial-profile-head"><Portrait person={person} large />
      <div className="catalogue-title editorial-title"><p className="editorial-kicker">{selectedYear === 2023 ? '2023 Election Archive' : '2027 Elections'}</p><h1>{person.name}</h1><p>{selectedYear} · Running mate</p></div>
      <WatchButton id={person.id} {...watchlist} />
    </div>
    <div className="record-grid">
      <div>
        <section className="record-section profile-section"><h2>Biography and public records</h2>
          {records.length ? <PublicRecordList records={records} /> : <p>This profile currently has published ticket records.</p>}
        </section>
        <section className="record-section profile-section"><h2>Election affiliations</h2>
          {!tickets.length && <p>There is no published ticket record for this person in the selected election cycle.</p>}
          <ul className="profile-evidence">{tickets.map(ticket => {
            const source = sources[ticket.race.listingSourceId]
            return <li key={ticket.id}><p className="story-meta"><span>{ticket.race.year}</span><span>INEC listing</span></p>
              <p><a className="text-link" href={partyPath(ticket.party) + cycleQuery}>{partyNames[ticket.party]} ({ticket.party})</a></p>
              <p><a className="text-link" href={candidatePath(ticket.id)}>Running mate to {ticket.name} <ArrowRight size={15} aria-hidden="true" /></a></p>
              <External href={source.url}>{source.label} · row {ticket.mateNumber}</External>
            </li>
          })}</ul>
          {allTickets.some(ticket => ticket.race.year !== selectedYear) && <a className="text-link" href={window.location.pathname + (selectedYear === 2023 ? '' : '?year=2023')}>See {selectedYear === 2023 ? 2027 : 2023} ticket records <ArrowRight size={15} aria-hidden="true" /></a>}
        </section>
        {selectedYear === 2027 && <ProfileLearning id={person.id} feed={feed} />}
      </div>
      <aside className="source-rail"><h2>About this record</h2><details className="editorial-details"><summary>How we label affiliations <ChevronDown size={17} aria-hidden="true" /></summary><div><p>Each party label refers to the relevant election listing.</p></div></details></aside>
    </div>
  </article>
}
