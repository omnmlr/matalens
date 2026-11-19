import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { candidatePath, catalogueRace, findCandidates, racePath, roster, type Candidate } from './catalogue'
import { links, partyNames, states } from './content'
import { External } from './ui'

export function CandidateRows({ people, withRace = false }: { people: Candidate[]; withRace?: boolean }) {
  return <ul className="directory-rows">
    {people.map(person => <li key={person.id}>
      <a href={candidatePath(person.id)}>
        <span className="directory-code" title={partyNames[person.party]}>{person.party}</span>
        <span><strong>{person.name}</strong><small>{withRace ? `${partyNames[person.party]} · ${catalogueRace.constituency}` : partyNames[person.party]}</small></span>
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </li>)}
  </ul>
}

export function DirectoryFinder({ explorer = false }: { explorer?: boolean }) {
  const initial = new URLSearchParams(window.location.search)
  const previous = history.state?.homeFinder
  const [mode, setMode] = useState<'place' | 'name'>(() => (explorer ? initial.has('q') : previous?.mode === 'name') ? 'name' : 'place')
  const [place, setPlace] = useState<string>(() => (explorer ? initial.get('place') : previous?.place) ?? '')
  const [input, setInput] = useState<string>(() => (explorer ? initial.get('q') : previous?.input) ?? '')
  const [query, setQuery] = useState(input.trim())
  const searchField = useRef<HTMLInputElement>(null)
  const uncovered = place !== '' && place !== catalogueRace.state
  const isSearch = mode === 'name' && Boolean(query)
  const matches = isSearch ? findCandidates(query, explorer) : roster
  const shown = explorer ? matches : matches.slice(0, 3)

  function saveFilters(nextMode: typeof mode, nextPlace: string, nextQuery: string) {
    if (!explorer) {
      history.replaceState({ ...history.state, homeFinder: { mode: nextMode, place: nextPlace, input: nextQuery } }, '')
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    url.searchParams.delete('place')
    if (nextMode === 'name') url.searchParams.set('q', nextQuery)
    else if (nextPlace) url.searchParams.set('place', nextPlace)
    window.history.replaceState(window.history.state, '', url)
  }

  function selectMode(nextMode: typeof mode) {
    setMode(nextMode)
    saveFilters(nextMode, place, query)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuery(input.trim())
    saveFilters('name', place, input.trim())
  }

  return <div className="field-directory">
    <div className="directory-form">
      <h3>Find a race</h3>
      <div className="directory-modes" role="group" aria-label="Find a race by place or name">
        <button type="button" aria-pressed={mode === 'place'} onClick={() => selectMode('place')}>By place</button>
        <button type="button" aria-pressed={mode === 'name'} onClick={() => selectMode('name')}>By name</button>
      </div>
      {mode === 'place' ? <label className="directory-label">State or FCT
        <select value={place} onChange={event => { setPlace(event.target.value); saveFilters('place', event.target.value, query) }}>
          <option value="">All covered places</option>
          {states.map(state => <option key={state}>{state}</option>)}
        </select>
      </label> : <form className="directory-search" onSubmit={submit}>
        <label className="directory-label">{explorer ? 'Candidate, party, office or place' : 'Candidate or party name'}
          <input ref={searchField} type="search" value={input} onChange={event => setInput(event.target.value)} maxLength={120} />
        </label>
        <button className="button" type="submit"><Search size={17} aria-hidden="true" /> Search</button>
      </form>}
      <p>Search the records MataLens has published.</p>
      <External href={links.allHouse}>Browse INEC candidate lists</External>
    </div>
    <div className="directory-results">
      <p className="sr-only" role="status">{mode === 'place' && uncovered ? `No records published for ${place}.` : `${matches.length} candidate records available.`}</p>
      {mode === 'place' && uncovered ? <div className="directory-note">
        <h3>{place}</h3><p>MataLens hasn’t published candidate records for this area yet.</p>
        <External href={links.allHouse}>Check official lists at INEC</External>
        <button className="link-button" type="button" onClick={() => { setPlace(''); saveFilters('place', '', query) }}>Browse covered races <ArrowRight size={16} /></button>
      </div> : <>
        <div className="directory-result-head">
          <div><p className="kicker">{isSearch ? 'Published records' : `${catalogueRace.state} · ${catalogueRace.office}`}</p>
            <h3>{isSearch ? 'Search results' : catalogueRace.constituency}</h3></div>
          {isSearch ? <span>{matches.length} {matches.length === 1 ? 'match' : 'matches'}</span> : <External href={links.race}>INEC candidate list</External>}
        </div>
        {shown.length > 0 ? <CandidateRows people={shown} withRace={isSearch} /> : <div className="directory-note">
          <p>No published candidates match that search.</p>
          <button className="link-button" type="button" onClick={() => { setInput(''); setQuery(''); saveFilters('name', place, ''); searchField.current?.focus() }}>Clear search</button>
        </div>}
        {!isSearch && <a className="text-link" href={racePath}>See all {roster.length} candidates <ArrowRight size={16} /></a>}
        {isSearch && !explorer && matches.length > shown.length && <a className="text-link" href={`/elections?q=${encodeURIComponent(query)}`}>See all {matches.length} matches <ArrowRight size={16} /></a>}
      </>}
    </div>
  </div>
}
