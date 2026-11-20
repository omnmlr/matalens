import { useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, CircleAlert, ExternalLink, FileText, GitCompareArrows, MapPin, Share2, Vote } from 'lucide-react'
import { campaignStatements, candidatePath, candidateStatus, constituency, contests, contestPath, declaration, offices, partyNames, partyPath, photoReferences, presidential, publicRecords, raceStatus, roster, rosterFor, scopeLabel, sources, type Candidate, type Contest } from './catalogue'
import { dates, links, states } from './content'
import { CandidateSearch, Portrait, useQueryField } from './directory'
import { nigeriaDate, type Plan } from './state'
import { ActionLink, External } from './ui'
import { FollowButton } from './follow'
import { personPath, type Follows } from './people'
import { ProfileLearning, PublicRecordList } from './profile-learning'
import type { StoryFeed } from './story-ui'

export type PlanProps = { plan: Plan; updatePlan: (value: Partial<Plan>) => boolean }

function ElectionLinks() {
  return <nav className="record-nav" aria-label="Election tools">
    <a href="/my-ballot"><MapPin size={17} aria-hidden="true" /> My Ballot</a>
    <a href="/parties"><FileText size={17} aria-hidden="true" /> Parties</a>
    <a href="/results"><CalendarDays size={17} aria-hidden="true" /> Results archive</a>
    <a href="/election#polling-unit"><Vote size={17} aria-hidden="true" /> Polling-unit guidance</a>
  </nav>
}

export function ContestList({ races }: { races: Contest[] }) {
  return <ul className="contest-list">{races.map(race => <li key={race.id}><a href={contestPath(race)}>
    <span><small>{offices[race.office].label} · {race.state ?? 'National'}</small><strong>{race.label}</strong></span>
    <span className="contest-list-meta"><time dateTime={race.date}>{nigeriaDate(race.date)}</time><small>{rosterFor(race).length} candidates · {raceStatus(race)}</small></span>
    <ArrowRight size={17} aria-hidden="true" />
  </a></li>)}</ul>
}

export function ElectionCalendar() {
  return <div className="calendar-list">{dates.map(item => {
    const day = nigeriaDate(item.date, { day: 'numeric' })
    const month = nigeriaDate(item.date, { month: 'short' })
    return <article key={item.date}><time dateTime={item.date}><strong>{day}</strong><span>{month} 2027</span></time><div><h3><a href={`/elections?year=2027&date=${item.date}`}>{item.title}</a></h3><p>{item.scope}</p></div><ArrowRight size={16} aria-hidden="true" /></article>
  })}</div>
}

export function Explorer(props: PlanProps) {
  const [year, setYear] = useQueryField('year')
  const [date, setDate] = useQueryField('date')
  const [office, setOffice] = useQueryField('office')
  const [state, setState] = useQueryField('place')
  const [district, setDistrict] = useQueryField('district')
  const [query, setQuery] = useQueryField('q')
  const [view, setView] = useQueryField('view', new URLSearchParams(location.search).has('q') ? 'candidates' : 'contests')
  const filtered = contests.filter(race => (!year || String(race.year) === year) && (!date || race.date === date) && (!office || offices[race.office].label === office) && (!state || state === 'National' && !race.state || race.state === state))
  const districts = filtered.filter(race => ['district', 'federal constituency', 'state constituency'].includes(offices[race.office].scope))
  const visible = district ? filtered.filter(race => race.id === district) : filtered
  const people = roster.filter(person => visible.some(race => race.id === person.contestId))
  function reset() { setYear(''); setDate(''); setOffice(''); setState(''); setDistrict(''); setQuery('') }
  return <section className="wrap standard-page explorer-page">
    <div className="catalogue-title"><p className="kicker">Election records / Nigeria</p><h1>Explore elections</h1><p>Find a contest, open the official candidate list and see who is standing for office.</p></div>
    <ElectionLinks />
    <div className="catalogue-filters explorer-filters">
      <label className="directory-label">Election year<select value={year} onChange={event => { setYear(event.target.value); setDate(''); setDistrict('') }}><option value="">All years</option><option>2027</option><option>2023</option></select></label>
      <label className="directory-label">Office<select value={office} onChange={event => { setOffice(event.target.value); setDistrict('') }}><option value="">All offices</option>{Object.values(offices).map(value => <option key={value.label}>{value.label}</option>)}</select></label>
      <label className="directory-label">Geography<select value={state} onChange={event => { setState(event.target.value); setDistrict('') }}><option value="">All places</option><option>National</option>{states.map(place => <option key={place}>{place}</option>)}</select></label>
      {year !== '2023' && <label className="directory-label">Election date<select value={date} onChange={event => { setDate(event.target.value); setDistrict('') }}><option value="">All dates</option>{dates.map(item => <option key={item.date} value={item.date}>{nigeriaDate(item.date)}</option>)}</select></label>}
      {districts.length > 0 && <label className="directory-label">District or constituency<select value={district} onChange={event => setDistrict(event.target.value)}><option value="">All in view</option>{districts.map(race => <option key={race.id} value={race.id}>{race.label} · {offices[race.office].label}</option>)}</select></label>}
    </div>
    <div className="record-grid">
      <div>
        <div className="directory-modes view-tabs" role="group" aria-label="Election explorer view">
          <button type="button" aria-pressed={view !== 'candidates'} onClick={() => setView('contests')}>Contests</button>
          <button type="button" aria-pressed={view === 'candidates'} onClick={() => setView('candidates')}>Candidates</button>
        </div>
        {visible.length ? view === 'candidates' ? <CandidateSearch people={people} query={query} update={setQuery} withRace {...props} /> : <>
          <p className="directory-caption" role="status">{visible.length} published {visible.length === 1 ? 'contest' : 'contests'}</p><ContestList races={visible} />
        </> : <div className="directory-note" role="status">
          <h2>No published records for this selection</h2><p>Try All offices or check INEC’s lists. You can still explore the nationwide presidential election.</p>
          <div className="inline-actions"><button className="link-button" onClick={reset}>Reset filters</button><a className="text-link" href={contestPath(presidential)}>Open presidential roster <ArrowRight size={16} /></a></div>
        </div>}
      </div>
      <aside className="source-rail"><h2>About this coverage</h2><p>National presidential records and selected contests in Edo, Lagos and Oyo. District and constituency boundaries determine which ballot applies.</p><External href={links.allHouse}>INEC National Assembly lists</External><External href={links.assembly}>INEC State Assembly lists</External><External href={links.polling}>Find your polling unit</External></aside>
    </div>
  </section>
}

export function RacePage({ race, ...props }: { race: Contest } & PlanProps) {
  const [query, setQuery] = useQueryField('q')
  const entries = rosterFor(race)
  const source = sources[race.listingSourceId]
  return <section className="wrap standard-page">
    <a className="text-link back-link" href="/elections"><ArrowLeft size={16} /> All elections</a>
    <div className="race-masthead">
      <div className="catalogue-title"><p className="kicker">{race.year} / {scopeLabel(race)}{race.state && ` · ${race.state}`}</p><h1>{race.label}</h1><p>{offices[race.office].label} · <time dateTime={race.date}>{nigeriaDate(race.date, { dateStyle: 'long' })}</time> · {raceStatus(race)}</p></div>
      <div className="race-count"><strong>{entries.length}</strong><span>{race.office === 'president' && race.year === 2027 ? 'Named tickets' : 'Named candidates'}</span></div>
    </div>
    {race.notes.length > 0 && <details className="race-listing-note"><summary><CircleAlert size={17} aria-hidden="true" /> Why the INEC list shows {entries.length + 1} party entries</summary>{race.notes.map(note => <p key={note}>{note}</p>)}<External href={source.url}>Read the INEC final list</External></details>}
    <div className="record-grid">
      <div>
        <div className="field-section-head"><h2>Candidate register</h2><a className="text-link" href={contestPath(race) + '/compare'}><GitCompareArrows size={16} /> Compare candidates</a></div>
        <CandidateSearch people={entries} query={query} update={setQuery} {...props} />
      </div>
      <aside className="source-rail" aria-label="Coverage and preparation">
        <h2>Official candidate list</h2>
        <External href={source.url}>{source.label}</External>
        {race.sourceId !== race.listingSourceId && <External href={sources[race.sourceId].url}>INEC national declaration</External>}
        {race.publisherPage && <External href={race.publisherPage}>INEC publication and updates</External>}
        {source.published && <p>Published {source.published.length === 10 ? nigeriaDate(source.published) : source.published}</p>}
        <p>Source reviewed <time dateTime={source.reviewed}>{nigeriaDate(source.reviewed)}</time></p>
        {race.office === 'president' && <a className="text-link" href="/results">2023 presidential results <ArrowRight size={16} /></a>}
        <a className="text-link" href="/my-ballot">Start My Ballot <ArrowRight size={16} /></a>
        <a className="text-link" href="/election#polling-unit">Prepare for election day <ArrowRight size={16} /></a>
      </aside>
    </div>
  </section>
}

export function CandidatePage({ person, plan, updatePlan, follows, feed }: { person: Candidate; follows: Follows; feed: StoryFeed } & PlanProps) {
  const [feedback, setFeedback] = useState('')
  const [undo, setUndo] = useState(false)
  const saved = plan.candidates.includes(person.id)
  const race = person.race
  const source = sources[race.listingSourceId]
  const history = roster.filter(record => record.personId === person.personId && record.id !== person.id)
  const mateHistory = roster.filter(record => record.personId === person.mateId)
  const mateRecord = person.mateId ? publicRecords[person.mateId]?.[0] : null
  const records = publicRecords[person.personId] ?? publicRecords[person.id] ?? []
  const portrait = photoReferences[person.personId]
  const statements = campaignStatements[person.id] ?? []
  const voteCount = declaration.entries.find(entry => entry.candidateId === person.id)?.votes

  function setSaved(next: boolean) {
    const stored = updatePlan({ candidates: next ? [...new Set([...plan.candidates, person.id])] : plan.candidates.filter(id => id !== person.id) })
    setFeedback(next ? stored ? 'Saved on this device.' : 'Saved for this visit.' : 'Bookmark removed.')
  }
  async function share() {
    setUndo(false)
    try {
      await navigator.clipboard.writeText(new URL(candidatePath(person.id), window.location.origin).href)
      setFeedback('Public candidate link copied.')
    } catch {
      setFeedback('Copy the public link from your address bar.')
    }
  }

  return <article className="wrap standard-page profile-page editorial-page">
    <a className="text-link back-link" href={contestPath(race)}><ArrowLeft size={16} /> {race.label}</a>
    <div className="profile-masthead editorial-profile-head"><Portrait person={person} large /><div className="catalogue-title editorial-title"><p className="editorial-kicker">Politician profile · {race.year} · {offices[race.office].label}</p><h1>{person.name}</h1><a className="text-link" href={partyPath(person.party)}>{partyNames[person.party]} ({person.party}) <ArrowRight size={15} /></a></div><FollowButton id={person.personId} {...follows} /></div>
    <div className="record-grid profile-grid">
      <div>
        <div className="button-row candidate-actions">
          <button className="button" aria-pressed={saved} onClick={() => { setSaved(!saved); setUndo(true) }}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save privately'}</button>
          <button className="button button-secondary" onClick={() => void share()}><Share2 size={17} /> Copy public link</button>
          <a className="text-link" href={contestPath(race) + '/compare'} data-compare-id={person.id}><GitCompareArrows size={17} /> Compare in this race</a>
        </div>
        <div className="record-feedback"><p role="status">{feedback}</p>{undo && <button className="link-button" onClick={() => { setSaved(!saved); setUndo(false) }}>Undo</button>}</div>
        <section className="record-section profile-section"><h2>Biography</h2>
          {records.length ? <PublicRecordList records={records.slice(0, 1)} /> : <p>The verified candidacy below is the biographical record currently available for this profile.</p>}
        </section>
        {person.mate && <section className="ticket-summary"><div><p className="kicker">On the ticket</p><h2>Running mate</h2><strong><a className="text-link" href={personPath(person.mate.id)}>{person.mate.name} <ArrowRight size={15} aria-hidden="true" /></a></strong></div><details><summary>Ticket details</summary>{person.mateQualification && <p>Qualifications listed by INEC: {person.mateQualification}</p>}{mateRecord && <p>{mateRecord.fact} <External href={mateRecord.source}>{mateRecord.label}</External></p>}{mateHistory.map(item => <p key={item.id}><a className="text-link" href={candidatePath(item.id)}>{item.race.label} · {item.party} <ArrowRight size={15} /></a></p>)}<External href={source.url}>{source.label} · row {person.mateNumber}</External></details></section>}
        <section className="record-section profile-section"><p className="editorial-kicker">Verified election record</p><h2>{race.status === 'declared' ? 'Archived candidacy' : 'Official candidacy'}</h2>
          <dl><div><dt>Name on INEC record</dt><dd>{person.listedName}</dd></div><div><dt>Office</dt><dd>{offices[race.office].label}</dd></div><div><dt>Electoral area</dt><dd>{constituency(race)}</dd></div><div><dt>Listing status</dt><dd>{candidateStatus(race)}</dd></div>
          {person.age && <div><dt>Age on the list</dt><dd>{person.age}</dd></div>}
          <div><dt>Qualifications as listed</dt><dd>{person.qualification || 'Unavailable in this record'}</dd></div>
          {voteCount !== undefined && <div><dt>Official votes</dt><dd><a className="text-link" href="/results">{voteCount.toLocaleString('en-NG')} votes <ArrowRight size={15} /></a></dd></div>}</dl>
        </section>
        <section className="record-section profile-section"><h2>Election affiliations</h2><ul className="history-list">
          <li><strong>{race.year} · {person.party}</strong> · {race.label}</li>
          {history.map(record => <li key={record.id}><a className="text-link" href={candidatePath(record.id)}>{record.race.label} · {record.party} <ArrowRight size={15} /></a></li>)}
        </ul></section>
        <section className="record-section profile-section"><h2>Public records</h2>
          <a className="text-link" href={voteCount !== undefined ? '/results' : contestPath(race)}>{voteCount !== undefined ? 'Read the national declaration' : 'Inspect the official contest record'} <ArrowRight size={15} /></a>
          {records.length > 1 && <PublicRecordList records={records.slice(1)} />}
        </section>
        <section className="record-section profile-section"><h2>Attributed claims</h2>
          {statements.length ? <PublicRecordList records={statements} /> : <p>There are no sourced campaign statements in this profile yet.</p>}
        </section>
        <ProfileLearning id={person.personId} feed={feed} />
      </div>
      <aside className="source-rail" aria-label="Record coverage">
        <h2>Record sources</h2><External href={source.url}>{source.label} · row {person.listingNumber}</External>
        {race.sourceId !== race.listingSourceId && <External href={sources[race.sourceId].url}>INEC national declaration</External>}
        {portrait && <><External href={portrait.href}>View a licensed photograph</External><p>{portrait.credit}</p></>}
        <p>Qualifications are transcribed from the official record. Source reviewed <time dateTime={source.reviewed}>{nigeriaDate(source.reviewed)}</time>.</p>
        <a className="text-link" href={`/corrections?record=${encodeURIComponent(person.id)}`}>Flag a factual error <ArrowRight size={16} /></a>
      </aside>
    </div>
  </article>
}

export function Compare({ race }: { race: Contest }) {
  const [first, setFirst] = useState<string>(() => history.state?.comparison?.first ?? '')
  const [second, setSecond] = useState<string>(() => history.state?.comparison?.second ?? '')
  function setComparison(key: 'first' | 'second', value: string) {
    history.replaceState({ ...history.state, comparison: { first, second, [key]: value } }, '')
    if (key === 'first') setFirst(value)
    else setSecond(value)
  }
  const people = rosterFor(race)
  const selected = people.filter(item => item.id === first || item.id === second)
  const fields: { label: string; value: (person: Candidate) => string }[] = [
    { label: 'Party', value: item => partyNames[item.party] },
    { label: 'Listing status', value: item => candidateStatus(item.race) },
    { label: 'Qualifications', value: item => item.qualification || 'Unavailable' },
    ...(people.some(item => item.mate) ? [{ label: 'Running mate', value: (item: Candidate) => item.mate?.name ?? 'Unavailable' }] : []),
  ]
  return <section className="wrap standard-page">
    <a className="text-link back-link" href={contestPath(race)}><ArrowLeft size={16} /> {race.label}</a>
    <div className="catalogue-title"><p className="kicker">{race.label} / {offices[race.office].label}</p><h1>Compare candidates</h1><p>Choose two people in this race to read the same official fields side by side.</p></div>
    <div className="catalogue-filters">{([
      { key: 'first', value: first, other: second, title: 'First candidate' },
      { key: 'second', value: second, other: first, title: 'Second candidate' },
    ] as const).map(({ key, value, other, title }) => <label className="directory-label" key={key}>{title}<select value={value} onChange={event => setComparison(key, event.target.value)}><option value="">Choose a candidate</option>{people.map(person => <option key={person.id} value={person.id} disabled={person.id === other}>{person.name}</option>)}</select></label>)}</div>
    <p className="directory-caption" role="status">{selected.length === 2 ? 'Two records · Alphabetical by name' : 'Choose two distinct candidates to start.'}</p>
    {selected.length === 2 && <div className="compare-records">
      {fields.map(field => <section key={field.label}><h2>{field.label}</h2>{selected.map(person => <div key={person.id}><a className="text-link" href={candidatePath(person.id)}>{person.name}</a><p>{field.value(person)}</p><External href={sources[race.listingSourceId].url}>INEC row {person.listingNumber}</External></div>)}</section>)}
    </div>}
  </section>
}

export function Ballot({ plan, updatePlan }: PlanProps) {
  const place = plan.ballot?.place ?? ''
  const stage = plan.ballot?.stage ?? 'place'
  const localRaces = contests.filter(race => race.year === 2027 && race.state === place)
  const [specific, setSpecific] = useState('')
  function go(nextPlace: string, nextStage: 'place' | 'race') {
    setSpecific('')
    updatePlan({ ballot: { place: nextPlace, stage: nextStage } })
    requestAnimationFrame(() => document.getElementById('ballot-step')?.focus())
  }
  return <section className="wrap standard-page ballot-page">
    <a className="text-link back-link" href="/elections"><ArrowLeft size={16} /> All elections</a>
    <div className="catalogue-title"><p className="kicker">Private preparation</p><h1>My Ballot</h1><p>Find the records you need and make an election-day plan. Your progress stays on this device.</p></div>
    <section className="guide-callout ballot-step">
      <p className="kicker">Step {stage === 'place' ? '1' : '2'} of 2</p>
      {stage === 'place' ? <>
        <h2 id="ballot-step" tabIndex={-1}>Where do you vote?</h2>
        <label className="directory-label">State or FCT<select value={place} onChange={event => updatePlan({ ballot: { place: event.target.value, stage: 'place' } })}><option value="">Choose a state or FCT</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
        <div className="button-row"><button className="button" disabled={!place} onClick={() => go(place, 'race')}>Continue <ArrowRight size={16} /></button><a className="text-link" href="/election#polling-unit">I’m not sure <ExternalLink size={16} /></a></div>
      </> : <>
        <h2 id="ballot-step" tabIndex={-1}>Your 2027 election research · {place}</h2>
        <p>Confirm your polling unit and electoral areas with INEC before choosing a local contest.</p>
        <button className="link-button ballot-back" onClick={() => go(place, 'place')}><ArrowLeft size={16} /> Change place</button>
        {!!localRaces.length && <label className="directory-label race-search">Find a covered local contest<select value={specific} onChange={event => setSpecific(event.target.value)}><option value="">All covered contests</option>{localRaces.map(race => <option key={race.id} value={race.id}>{race.label} · {offices[race.office].label}</option>)}</select></label>}
        {!localRaces.length && <p>MataLens has yet to publish local rosters for {place}. <External href={links.allHouse}>Check official lists</External></p>}
        <ContestList races={[presidential, ...localRaces.filter(race => !specific || race.id === specific)]} />
      </>}
    </section>
    <div className="button-row ballot-actions"><ActionLink href="/election#polling-plan" secondary>Make my plan</ActionLink><a className="text-link" href="/actions">Finish later <ArrowRight size={16} /></a></div>
  </section>
}
