import { useState } from 'react'
import { ArrowRight, UserRound } from 'lucide-react'
import { identities, matchWords, offices, parties, partyNames, partyPath, roster, sources, type Candidate } from './catalogue'
import { CandidateSearch, SearchField, useQueryField } from './directory'
import type { PlanProps } from './explorer'
import { FollowButton } from './follow'
import { candidaciesByPerson, personPath, ticketsByMate, type Follows } from './people'
import { External } from './ui'

const profiles = Object.values(identities)
  .filter(person => candidaciesByPerson.has(person.id) || ticketsByMate.has(person.id))
  .sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))
const partyDirectory = Object.values(parties).sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))

function profileRecords(id: string) {
  return [...(candidaciesByPerson.get(id) ?? []), ...(ticketsByMate.get(id) ?? [])]
}

export function DiscoverPage({ follows, ...plan }: { follows: Follows } & PlanProps) {
  const mode = new URLSearchParams(window.location.search).get('view') ?? 'people'
  const [query, setQuery] = useQueryField('q')
  const [year, setYear] = useQueryField('year')
  const [shown, setShown] = useState(24)
  const people = profiles.flatMap(person => {
    const records = profileRecords(person.id).filter(record => !year || String(record.race.year) === year)
    const terms = [person.name, ...records.flatMap(record => [partyNames[record.party], record.party, record.race.label])]
    return records.length && matchWords(terms.join(' '), query) ? [{ ...person, records }] : []
  })
  const matchingParties = partyDirectory.filter(party => matchWords(party.name + ' ' + party.code, query))

  function updateSearch(value: string) { setQuery(value); setShown(24) }
  function affiliation(id: string, record: Candidate) {
    return `${record.race.year} · ${record.party} · ${record.personId === id ? offices[record.race.office].label : 'Running mate'}`
  }

  return <section className="wrap standard-page editorial-page discover-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Discover</p><h1>People, parties and elections.</h1><p>Explore public profiles and official candidate records. Follow people to see their updates in your briefing.</p></div>
    <nav className="discover-tabs" aria-label="Discover views">
      <a href="/discover" aria-current={mode === 'people' ? 'page' : undefined}>Politicians</a>
      <a href="/discover?view=candidates" aria-current={mode === 'candidates' ? 'page' : undefined}>Candidates</a>
      <a href="/discover?view=parties" aria-current={mode === 'parties' ? 'page' : undefined}>Parties</a>
      <a href="/elections">Election explorer <ArrowRight size={15} aria-hidden="true" /></a>
    </nav>
    <div className="record-grid">
      <div>
        {mode !== 'parties' && <label className="directory-label discover-year">Election year<select value={year} onChange={event => { setYear(event.target.value); setShown(24) }}><option value="">All years</option><option>2027</option><option>2023</option></select></label>}
        {mode === 'candidates' ? <CandidateSearch key={year} people={roster.filter(record => !year || String(record.race.year) === year)} query={query} update={updateSearch} withRace follows={follows} {...plan} /> : <>
          <SearchField label={mode === 'parties' ? 'Party search' : 'Politician search'} value={query} update={updateSearch} placeholder={mode === 'parties' ? 'Party name or abbreviation' : 'Name or party'} />
          {mode === 'parties' ? <>
            <p className="directory-caption" role="status">{matchingParties.length} party records</p>
            {matchingParties.length ? <ul className="discover-list">{matchingParties.map(party => <li key={party.code}>
              <span className="party-mark">{party.code}</span><a href={partyPath(party.code)}>{party.name} <ArrowRight size={16} aria-hidden="true" /></a>
            </li>)}</ul> : <p className="editorial-note">No parties match this search.</p>}
          </> : <>
            <p className="directory-caption" role="status">{people.length} profiles · Alphabetical by name</p>
            {people.length ? <ul className="discover-list">{people.slice(0, shown).map(person => <li key={person.id}>
              <span className="portrait" aria-hidden="true"><UserRound size={21} strokeWidth={1.5} /></span>
              <div className="discover-person"><a href={personPath(person.id)}>{person.name}</a><small>{[...new Set(person.records.map(record => affiliation(person.id, record)))].join(' / ')}</small></div>
              <FollowButton id={person.id} {...follows} />
            </li>)}</ul> : <p className="editorial-note">No people match these filters.</p>}
            {people.length > shown && <button type="button" className="button button-secondary more-results" onClick={() => setShown(shown + 24)}>Show {Math.min(24, people.length - shown)} more profiles</button>}
          </>}
          {query && (mode === 'parties' ? matchingParties.length === 0 : people.length === 0) && <button className="link-button" onClick={() => updateSearch('')}>Clear search</button>}
        </>}
      </div>
      <aside className="source-rail">
        <h2>{mode === 'parties' ? 'About party records' : 'Reading the records'}</h2>
        <p>{mode === 'parties' ? 'Party pages show register details, published candidate tickets and historical results where available.' : 'Party and office labels come from the candidate record for each election year. Coverage includes both presidential rosters and selected local contests.'}</p>
        {mode === 'parties' ? <External href={sources.register.url}>{sources.register.label}</External> : <a className="text-link" href="/elections">Explore official election records <ArrowRight size={15} aria-hidden="true" /></a>}
      </aside>
    </div>
  </section>
}
