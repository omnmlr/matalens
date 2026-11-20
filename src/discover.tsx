import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { identities, matchWords, offices, parties, partyNames, partyPath, roster, sources, type Candidate } from './catalogue'
import { CandidateSearch, Portrait, SearchField, useElectionYear, useQueryField } from './directory'
import type { PlanProps } from './explorer'
import { WatchButton } from './watchlist'
import { candidaciesByPerson, personPath, ticketsByMate, type Watchlist } from './people'
import { External } from './ui'

const profiles = Object.values(identities)
  .filter(person => candidaciesByPerson.has(person.id) || ticketsByMate.has(person.id))
  .sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))
const partyDirectory = Object.values(parties).sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))

function profileRecords(id: string) {
  return [...(candidaciesByPerson.get(id) ?? []), ...(ticketsByMate.get(id) ?? [])]
}

export function DiscoverPage({ watchlist, ...plan }: { watchlist: Watchlist } & PlanProps) {
  const mode = new URLSearchParams(window.location.search).get('view') ?? 'people'
  const [query, setQuery] = useQueryField('q')
  const [year] = useElectionYear()
  const [office, setOffice] = useQueryField('office')
  const [place, setPlace] = useQueryField('place')
  const [shown, setShown] = useState(24)
  const cycleRecords = roster.filter(record => record.race.year === year)
  const locations = [...new Set(cycleRecords.map(record => record.race.state ?? 'National'))].sort()
  const roles = [...new Set(cycleRecords.map(record => record.race.office))]
  const inScope = (record: Candidate) => record.race.year === year && (!office || record.race.office === office) && (!place || (record.race.state ?? 'National') === place)
  const people = profiles.flatMap(person => {
    const records = profileRecords(person.id).filter(inScope)
    const terms = [person.name, ...records.flatMap(record => [partyNames[record.party], record.party, record.race.label])]
    return records.length && matchWords(terms.join(' '), query) ? [{ ...person, records }] : []
  })
  const partyCodes = new Set(cycleRecords.map(record => record.party))
  const matchingParties = partyDirectory.filter(party => partyCodes.has(party.code) && matchWords(party.name + ' ' + party.code, query))
  const cycleQuery = year === 2023 ? '?year=2023' : ''
  const viewQuery = (view: string) => '/discover?' + new URLSearchParams({ view, ...(year === 2023 && { year: '2023' }) })

  function updateSearch(value: string) { setQuery(value); setShown(24) }
  function affiliation(id: string, record: Candidate) {
    return `${record.race.year} · ${record.party} · ${record.personId === id ? offices[record.race.office].label : 'Running mate'}`
  }

  return <section className="wrap standard-page editorial-page discover-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">{year === 2023 ? '2023 Election Archive' : '2027 Elections'}</p><h1>Find candidates and parties</h1><p>{year === 2023 ? 'Search historical presidential records from INEC.' : 'Search by name or party, then narrow to an office or electoral area.'}</p></div>
    <nav className="discover-tabs" aria-label="Discover views">
      <a href={'/discover' + cycleQuery} aria-current={mode === 'people' ? 'page' : undefined}>People</a>
      <a href={viewQuery('candidates')} aria-current={mode === 'candidates' ? 'page' : undefined}>Candidate records</a>
      <a href={viewQuery('parties')} aria-current={mode === 'parties' ? 'page' : undefined}>Parties</a>
      <a href={year === 2023 ? '/archive' : '/elections'}>{year === 2023 ? '2023 Election Archive' : 'Explore contests'} <ArrowRight size={15} aria-hidden="true" /></a>
    </nav>
    <div className="record-grid">
      <div>
        <nav className="cycle-links" aria-label="Election cycle">
          {[2027, 2023].map(cycle => <a key={cycle} className="text-link" aria-current={year === cycle ? 'page' : undefined}
            href={'/discover?' + new URLSearchParams({ view: mode, ...(cycle === 2023 && { year: '2023' }) })}>{cycle === 2027 ? '2027 elections' : '2023 archive'}</a>)}
        </nav>
        {mode !== 'parties' && <div className="discovery-filters">
          <label className="directory-label">Office<select value={office} onChange={event => { setOffice(event.target.value); setShown(24) }}><option value="">All offices</option>{roles.map(role => <option key={role} value={role}>{offices[role].label}</option>)}</select></label>
          <label className="directory-label">Electoral area<select value={place} onChange={event => { setPlace(event.target.value); setShown(24) }}><option value="">All areas</option>{locations.map(area => <option key={area}>{area}</option>)}</select></label>
        </div>}
        {mode === 'candidates' ? <CandidateSearch key={year} people={cycleRecords.filter(inScope)} query={query} update={updateSearch} withRace watchlist={watchlist} {...plan} /> : <>
          <SearchField label={mode === 'parties' ? 'Party search' : 'Politician search'} value={query} update={updateSearch} placeholder={mode === 'parties' ? 'Party name or abbreviation' : 'Name or party'} />
          {mode === 'parties' ? <>
            <p className="directory-caption" role="status">{matchingParties.length} party records</p>
            {matchingParties.length ? <ul className="discover-list">{matchingParties.map(party => <li key={party.code}>
              <span className="party-mark">{party.code}</span><a href={partyPath(party.code) + cycleQuery}>{party.name} <ArrowRight size={16} aria-hidden="true" /></a>
            </li>)}</ul> : <p className="editorial-note">No parties match this search.</p>}
          </> : <>
            <p className="directory-caption" role="status">{people.length} {people.length === 1 ? 'profile' : 'profiles'} · Alphabetical by name</p>
            {people.length ? <ul className="discover-list">{people.slice(0, shown).map(person => <li key={person.id}>
              <Portrait person={person} />
              <div className="discover-person"><a href={personPath(person.id, year)}>{person.name}</a><small>{[...new Set(person.records.map(record => affiliation(person.id, record)))].join(' / ')}</small></div>
              <WatchButton id={person.id} {...watchlist} compact />
            </li>)}</ul> : <div className="editorial-note"><p>No people match this search and election cycle.</p>{(office || place) && <button type="button" className="link-button" onClick={() => { setOffice(''); setPlace(''); setShown(24) }}>Clear office and area filters</button>}</div>}
            {people.length > shown && <button type="button" className="button button-secondary more-results" onClick={() => setShown(shown + 24)}>Show {Math.min(24, people.length - shown)} more profiles</button>}
          </>}
          {query && (mode === 'parties' ? matchingParties.length === 0 : people.length === 0) && <button className="link-button" onClick={() => updateSearch('')}>Clear search</button>}
        </>}
      </div>
      <aside className="source-rail">
        <h2>{mode === 'parties' ? 'About party records' : 'Reading the records'}</h2>
        <p>{mode === 'parties' ? 'Party pages show register details, published candidate tickets and historical results where available.' : 'Party and office labels come from the candidate record for each election year. The 2027 catalogue covers the national presidential roster and selected contests in Edo, Lagos and Oyo.'}</p>
        {mode === 'parties' ? <External href={sources.register.url}>{sources.register.label}</External> : <a className="text-link" href={year === 2023 ? '/archive' : '/elections'}>Explore official election records <ArrowRight size={15} aria-hidden="true" /></a>}
      </aside>
    </div>
  </section>
}
