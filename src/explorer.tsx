import { useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, ExternalLink, FileText, GitCompareArrows, MapPin, Share2 } from 'lucide-react'
import { candidatePath, catalogueRace as race, comparePath, findCandidates, partyPath, publicRecords, racePath, roster, type Candidate } from './catalogue'
import { dates, links, partyNames, states } from './content'
import { CandidateRows, DirectoryFinder } from './directory'
import { daysUntilNigeria, nigeriaDate, type Plan } from './state'
import { ActionLink, External } from './ui'

export type PlanProps = { plan: Plan; updatePlan: (value: Partial<Plan>) => boolean }

const officeOptions = ['President', 'Senate', 'House of Representatives', 'Governor', 'State House of Assembly']

function ElectionLinks({ ballot = true }: { ballot?: boolean }) {
  return <nav className="record-nav" aria-label="Election tools">
    {ballot && <a href="/my-ballot"><MapPin size={18} aria-hidden="true" /> My Ballot</a>}
    <a href="/parties"><FileText size={17} aria-hidden="true" /> Parties</a>
    <a href="/results"><CalendarDays size={17} aria-hidden="true" /> Results archive</a>
    <a href="/election#polling-unit"><MapPin size={17} aria-hidden="true" /> Polling-unit guidance</a>
  </nav>
}

export function Explorer() {
  const initial = new URLSearchParams(window.location.search)
  const [year, setYear] = useState(initial.get('year') === '2023' ? '2023' : '2027')
  const [office, setOffice] = useState(initial.get('office') ?? '')
  const archived = year === '2023'
  const available = !office || office === race.office

  function updateFilter(key: 'year' | 'office', value: string) {
    const url = new URL(window.location.href)
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
    history.replaceState(history.state, '', url)
    if (key === 'year') setYear(value)
    else setOffice(value)
  }

  return <section className="wrap standard-page">
    <div className="catalogue-title"><p className="kicker">Nigeria · Election records</p><h1>Explore elections</h1><p>Find published races, read the INEC candidate list and prepare for your own ballot.</p></div>
    <ElectionLinks />
    <div className="catalogue-filters">
      <label className="directory-label">Election year<select value={year} onChange={event => updateFilter('year', event.target.value)}><option>2027</option><option>2023</option></select></label>
      <label className="directory-label">Office<select value={office} onChange={event => updateFilter('office', event.target.value)}><option value="">All offices</option>{officeOptions.map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    {archived ? <div className="directory-note">
      <h2>{!office || office === 'President' ? '2023 presidential election' : 'No archived records for this office'}</h2>
      <p>MataLens’ results archive covers the 2023 presidential declaration.</p><ActionLink href="/results">Open results archive</ActionLink>
    </div> : available ? <DirectoryFinder explorer /> : <div className="directory-note"><h2>{office}</h2><p>MataLens hasn’t published candidate records for this office yet.</p><External href={links.updates}>Find official publications at INEC</External></div>}
    {!archived && <section className="catalogue-schedule">
      <div className="field-section-head"><h2>Election dates</h2><External href={links.calendar}>INEC calendar</External></div>
      {dates.map(item => {
        const days = daysUntilNigeria(item.date)
        return <article key={item.date}><time dateTime={item.date}>{nigeriaDate(item.date)}</time><div><h3>{item.title}</h3><p>{item.scope}</p></div><small>{days > 0 ? 'Scheduled' : days === 0 ? 'Scheduled for today' : 'Scheduled date passed'}</small></article>
      })}
    </section>}
  </section>
}

export function RacePage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const matches = findCandidates(query)

  function updateSearch(value: string) {
    setQuery(value)
    const url = new URL(window.location.href)
    if (value) url.searchParams.set('q', value)
    else url.searchParams.delete('q')
    history.replaceState(history.state, '', url)
  }
  return <section className="wrap standard-page">
    <a className="text-link back-link" href="/elections"><ArrowLeft size={16} /> All elections</a>
    <div className="catalogue-title"><p className="kicker">{race.year} · {race.state}</p><h1>{race.constituency}</h1><p>{race.office} · <time dateTime={race.date}>{nigeriaDate(race.date, { dateStyle: 'long' })}</time></p></div>
    <div className="record-grid">
      <div>
        <div className="field-section-head"><h2>Candidate register</h2><a className="text-link" href={comparePath}><GitCompareArrows size={16} /> Compare candidates</a></div>
        <label className="directory-label race-search">Search by name or party<input type="search" value={query} onChange={event => updateSearch(event.target.value)} maxLength={120} /></label>
        <p className="directory-caption" role="status">{matches.length} of {roster.length} candidates · Alphabetical by name</p>
        {matches.length ? <CandidateRows people={matches} /> : <div className="directory-note"><p>No published candidates match.</p><button className="link-button" type="button" onClick={() => updateSearch('')}>Clear search</button></div>}
      </div>
      <aside className="source-rail" aria-label="Coverage and preparation">
        <h2>Official listing</h2><p>Surulere I, Lagos. Check INEC for the latest amendments and other constituencies.</p>
        <External href={race.source.href}>INEC list · page {race.source.page}, rows 171–178</External>
        <p>Source checked <time dateTime={race.source.checked}>{nigeriaDate(race.source.checked)}</time></p>
        <a className="text-link" href="/my-ballot">Start My Ballot <ArrowRight size={16} /></a>
        <a className="text-link" href="/election#polling-unit">Prepare for election day <ArrowRight size={16} /></a>
      </aside>
    </div>
  </section>
}

export function CandidatePage({ person, plan, updatePlan }: { person: Candidate } & PlanProps) {
  const [feedback, setFeedback] = useState('')
  const [undo, setUndo] = useState(false)
  const [previous, setPrevious] = useState(false)
  const saved = plan.candidates.includes(person.id)
  const row = person.id.split('-').at(-1)
  const records = publicRecords[person.id]

  function setSaved(next: boolean) {
    const stored = updatePlan({ candidates: next ? [...new Set([...plan.candidates, person.id])] : plan.candidates.filter(id => id !== person.id) })
    setFeedback(stored ? next ? 'Saved on this device.' : 'Bookmark removed.' : next ? 'Saved for this visit.' : 'Bookmark removed for this visit.')
  }

  async function share() {
    const url = new URL(candidatePath(person.id), window.location.origin).href
    setUndo(false)
    try {
      await navigator.clipboard.writeText(url)
      setFeedback('Public candidate link copied.')
    } catch {
      setFeedback('Copy the public link from your address bar.')
    }
  }

  return <article className="wrap standard-page">
    <a className="text-link back-link" href={racePath}><ArrowLeft size={16} /> {race.constituency}</a>
    <div className="catalogue-title"><p className="kicker">{race.office} · {race.state}</p><h1>{person.name}</h1><a className="text-link" href={partyPath(person.party)}>{partyNames[person.party]} ({person.party}) <ArrowRight size={15} /></a></div>
    <div className="record-grid">
      <div>
        <div className="button-row candidate-actions">
          <button className="button" aria-pressed={saved} onClick={() => { setPrevious(saved); setSaved(!saved); setUndo(true) }}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save privately'}</button>
          <button className="button button-secondary" onClick={() => void share()}><Share2 size={17} /> Copy public link</button>
          <a className="text-link" href={comparePath}><GitCompareArrows size={17} /> Compare in this race</a>
        </div>
        <div className="record-feedback"><p role="status">{feedback}</p>{undo && <button className="link-button" onClick={() => { setSaved(previous); setUndo(false) }}>Undo</button>}</div>
        <section className="record-section"><h2>Current candidacy</h2>
          <External href={race.source.href}>INEC list · row {row}</External>
          <dl><div><dt>Office</dt><dd>{race.office}</dd></div><div><dt>Constituency</dt><dd>{race.constituency}, {race.state}</dd></div><div><dt>Listing status</dt><dd>Listed by INEC</dd></div><div><dt>Age on the list</dt><dd>{person.age}</dd></div><div><dt>Qualifications as listed</dt><dd>{person.qualification}</dd></div></dl>
        </section>
        {records && <section className="record-section"><h2>Legislative record</h2>
          <ul className="field-updates">{records.map(item => <li key={item.date}><p><time dateTime={item.date}>{nigeriaDate(item.date)}</time></p><div>{item.fact}</div><External href={item.source}>{item.label}</External></li>)}</ul>
        </section>}
      </div>
      <aside className="source-rail" aria-label="Record coverage">
        <h2>Record coverage</h2><p>{records ? "This profile covers the official candidate listing and the public proceedings cited here." : "This profile covers the official candidate listing for Surulere I."}</p>
        <External href={race.source.href}>{race.source.label} · page {race.source.page}</External>
        <p>Source checked <time dateTime={race.source.checked}>{nigeriaDate(race.source.checked)}</time></p>
        <a className="text-link" href={`/corrections?record=${encodeURIComponent(person.id)}`}>Flag a factual error <ArrowRight size={16} /></a>
      </aside>
    </div>
  </article>
}

const articles = [
  { label: 'Party', get: (item: Candidate) => `${partyNames[item.party]} (${item.party})` },
  { label: 'Listing status', get: () => 'Listed by INEC' },
  { label: 'Qualifications as listed', get: (item: Candidate) => item.qualification },
]

export function Compare() {
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const selected = roster.filter(person => [first, second].includes(person.id))
  return <section className="wrap standard-page">
    <a className="text-link back-link" href={racePath}><ArrowLeft size={16} /> {race.constituency} candidate register</a>
    <div className="catalogue-title"><p className="kicker">{race.constituency} · {race.office}</p><h1>Compare candidates</h1><p>Choose two candidates from this race to read the same published fields side by side.</p></div>
    <div className="catalogue-filters">
      <label className="directory-label">First candidate<select value={first} onChange={event => setFirst(event.target.value)}><option value="">Choose a candidate</option>{roster.map(person => <option key={person.id} value={person.id} disabled={person.id === second}>{person.name}</option>)}</select></label>
      <label className="directory-label">Second candidate<select value={second} onChange={event => setSecond(event.target.value)}><option value="">Choose a candidate</option>{roster.map(person => <option key={person.id} value={person.id} disabled={person.id === first}>{person.name}</option>)}</select></label>
    </div>
    <p role="status" className="directory-caption">{selected.length === 2 ? 'Two records · Alphabetical by name' : 'Choose two distinct candidates to start.'}</p>
    {selected.length === 2 && <div className="compare-records">
      {articles.map(field => <section key={field.label}><h2>{field.label}</h2>
        {selected.map(person => <div key={person.id}><a className="text-link" href={candidatePath(person.id)}>{person.name}</a><p>{field.get(person)}</p><External href={race.source.href}>INEC row {person.id.split('-').at(-1)}</External></div>)}
      </section>)}
    </div>}
  </section>
}

export function Parties({ party }: { party?: string }) {
  const [query, setQuery] = useState('')
  const records = Object.entries(partyNames).sort(([, first], [, second]) => first.localeCompare(second, 'en-NG'))
  const shown = records.filter(([code, name]) => `${code} ${name}`.toLowerCase().includes(query.toLowerCase().trim()))
  return <section className="wrap standard-page">
    {party && <a className="text-link back-link" href="/parties"><ArrowLeft size={16} /> All parties</a>}
    <div className="catalogue-title"><p className="kicker">Reviewed candidate records</p><h1>{party ? partyNames[party] : 'Political parties'}</h1><p>{party ? `${party} · ${race.constituency}, ${race.state}` : 'Browse the parties named in MataLens’ reviewed candidate register.'}</p></div>
    <div className="record-grid">
      <div>
        {party ? <><div className="field-section-head"><h2>Published candidates</h2><a className="text-link" href={racePath}>Open race <ArrowRight size={16} /></a></div><CandidateRows people={roster.filter(item => item.party === party)} /></> : <>
          <label className="directory-label race-search">Party name or abbreviation<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <p className="directory-caption" role="status">{shown.length} parties in these records</p>
          <ul className="directory-rows">{shown.map(([code, name]) => <li key={code}><a href={partyPath(code)}><span className="directory-code">{code}</span><strong>{name}</strong><ArrowRight size={16} aria-hidden="true" /></a></li>)}</ul>
        </>}
      </div>
      <aside className="source-rail" aria-label="Party source"><h2>Official sources</h2><External href={links.parties}>Open INEC party register</External><External href={links.race}>Open constituency listing</External><p>This directory covers parties listed for {race.constituency}.</p></aside>
    </div>
  </section>
}

export function Ballot({ plan, updatePlan }: PlanProps) {
  const place = plan.ballot?.place ?? ''
  const stage = plan.ballot?.stage ?? 'place'
  const hasCoverage = place === race.state
  function go(nextPlace: string, nextStage: 'place' | 'race') {
    updatePlan({ ballot: { place: nextPlace, stage: nextStage } })
    requestAnimationFrame(() => document.getElementById('ballot-step')?.focus())
  }

  return <section className="wrap standard-page ballot-page">
    <a className="text-link back-link" href="/elections"><ArrowLeft size={16} /> All elections</a>
    <div className="catalogue-title"><p className="kicker">Private preparation</p><h1>My Ballot</h1><p>Find a race you can research and make a plan for election day. Your progress stays on this device.</p></div>
    <section className="guide-callout">
      <p className="kicker">Step {stage === 'place' ? '1' : '2'} of 2</p>
      {stage === 'place' ? <>
        <h2 id="ballot-step" tabIndex={-1}>Where do you vote?</h2>
        <label className="directory-label">State or FCT<select value={place} onChange={event => updatePlan({ ballot: { place: event.target.value, stage: 'place' } })}><option value="">Choose a state or FCT</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
        <div className="button-row"><button className="button" disabled={!place} onClick={() => go(place, 'race')}>Continue <ArrowRight size={16} /></button><a className="text-link" href="/election#polling-unit">I’m not sure <ExternalLink size={16} /></a></div>
      </> : <>
        <h2 id="ballot-step" tabIndex={-1}>{place}</h2>
        {hasCoverage ? <><p>One covered race in Lagos. Use INEC’s official finder to confirm that the constituency applies to you.</p><ActionLink href={racePath}>View Surulere I candidates</ActionLink></> : <><p>MataLens hasn’t published candidate records for this area yet.</p><External href={links.allHouse}>See official candidate lists at INEC</External></>}
        <button className="link-button ballot-back" onClick={() => go(place, 'place')}><ArrowLeft size={16} /> Change place</button>
      </>}
    </section>
    <div className="button-row ballot-actions"><ActionLink href="/election#polling-plan" secondary>Make my plan</ActionLink><a className="text-link" href="/actions">Finish later <ArrowRight size={16} /></a></div>
  </section>
}
