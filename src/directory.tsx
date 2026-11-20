import { useRef, useState, type ReactNode } from 'react'
import { ArrowRight, Bookmark, ChevronDown, GitCompareArrows, Search, UserRound } from 'lucide-react'
import { candidatePath, candidateStatus, findCandidates, offices, partyNames, partyPath, publicRecords, sources, type Candidate } from './catalogue'
import type { PlanProps } from './explorer'
import { External } from './ui'
import { FollowButton } from './follow'
import type { Follows } from './people'

export function useQueryField(key: string, fallback = '') {
  const [value, setValue] = useState(() => new URLSearchParams(window.location.search).get(key) ?? fallback)
  return [value, (next: string) => {
    const url = new URL(window.location.href)
    if (next && next !== fallback) url.searchParams.set(key, next)
    else url.searchParams.delete(key)
    history.replaceState(history.state, '', url)
    setValue(next)
  }] as const
}

export function useElectionYear() {
  const [year, setYear] = useQueryField('year', '2027')
  return [year === '2023' ? 2023 : 2027, setYear] as const
}

export function SearchField({ label, value, update, placeholder, inputRef }: { label: string; value: string; update: (value: string) => void; placeholder?: string; inputRef?: React.Ref<HTMLInputElement> }) {
  return <label className="directory-label search-field">{label}<span><Search aria-hidden="true" size={18} /><input ref={inputRef} type="search" value={value} onChange={event => update(event.target.value)} placeholder={placeholder} maxLength={120} /></span></label>
}

export function Portrait({ person, large = false }: { person: Candidate; large?: boolean }) {
  return <span className={`portrait ${large ? 'portrait-large' : ''}`} aria-hidden="true"><UserRound strokeWidth={1.35} size={large ? 54 : 20} /></span>
}

function Disclosure({ person, children }: { person: Candidate; children: ReactNode }) {
  const url = window.location.pathname + window.location.search
  const entry = history.state?.openRows
  const [open, setOpen] = useState(() => Boolean(entry?.url === url && entry.ids.includes(person.id)))
  function handleToggle(event: React.SyntheticEvent<HTMLDetailsElement>) {
    const next = event.currentTarget.open
    if (next === open) return
    setOpen(next)
    const state = history.state?.openRows
    const ids: string[] = state?.url === url ? state.ids : []
    history.replaceState({ ...history.state, openRows: { url, ids: next ? [...new Set([...ids, person.id])] : ids.filter(id => id !== person.id) } }, '')
  }
  return <details className="registry-disclosure" open={open} onToggle={handleToggle}>
    <summary><span className="party-mark">{person.party}</span><span><strong>{person.name}</strong><small>{partyNames[person.party]} · {person.race.year}</small></span><ChevronDown size={19} aria-hidden="true" /></summary>
    {children}
  </details>
}

export function CandidateRows({ people, withRace = false, plan, updatePlan, follows }: { people: Candidate[]; withRace?: boolean; follows?: Follows } & Partial<PlanProps>) {
  const [notice, setNotice] = useState('')
  return <><p className="sr-only" role="status">{notice}</p><ul className="directory-rows registry-list">
    {people.map(person => {
      const source = sources[person.race.listingSourceId]
      const saved = !!plan?.candidates.includes(person.id)
      const record = publicRecords[person.personId]?.[0] ?? publicRecords[person.id]?.[0]
      return <li key={person.id}><Disclosure person={person}>
        <div className="candidate-preview">
          <Portrait person={person} />
          <div>
            <p className="kicker">{candidateStatus(person.race)}{withRace && ` · ${person.race.label}`}</p>
            <p>{offices[person.race.office].label} · {person.race.state ?? 'Nationwide'}</p>
            {person.mate && <p><strong>Running mate</strong> {person.mate.name}</p>}
            {person.qualification && <p><strong>Qualifications listed by INEC</strong> {person.qualification}</p>}
            {record && <p>{record.fact} <External href={record.source}>Read the record</External></p>}
            <div className="inline-actions">
              {follows && <FollowButton id={person.personId} {...follows} />}
              <a className="text-link" href={candidatePath(person.id)}>View full profile <ArrowRight size={15} /></a>
              {plan && updatePlan && <button className="link-button" aria-pressed={saved} type="button" onClick={() => {
                const stored = updatePlan({ candidates: saved ? plan.candidates.filter(id => id !== person.id) : [...new Set([...plan.candidates, person.id])] })
                setNotice(saved ? `${person.name}: bookmark removed.` : `${person.name}: ${stored ? 'saved on this device' : 'saved for this visit'}.`)
              }}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save privately'}</button>}
              <a className="text-link" href={`/elections/${person.race.id}/compare`} data-compare-id={person.id}><GitCompareArrows size={16} /> Compare</a>
              <a className="text-link" href={partyPath(person.party)}>Party record</a>
            </div>
            <External href={source.url}>{source.label} · row {person.listingNumber}</External>
          </div>
        </div>
      </Disclosure></li>
    })}
  </ul></>
}

export function CandidateSearch({ people, query, update, withRace, plan, updatePlan, follows }: { people: Candidate[]; query: string; update: (query: string) => void; withRace?: boolean; follows?: Follows } & Partial<PlanProps>) {
  const queryKey = window.location.pathname + window.location.search
  const [shown, setShown] = useState(() => history.state?.directoryLimit?.url === queryKey ? Number(history.state.directoryLimit.shown) : 25)
  const search = useRef<HTMLInputElement>(null)
  function showMore() {
    const next = shown + 25
    setShown(next)
    history.replaceState({ ...history.state, directoryLimit: { url: queryKey, shown: next } }, '')
  }
  const matches = findCandidates(query, people)
  return <>
    <SearchField label="Candidate or party search" value={query} update={value => { update(value); setShown(25) }} placeholder="Name, party or running mate" inputRef={search} />
    <p className="directory-caption" role="status">{matches.length} of {people.length} candidate records · Alphabetical by name</p>
    {matches.length > 0 ? <CandidateRows people={matches.slice(0, shown)} withRace={withRace} plan={plan} updatePlan={updatePlan} follows={follows} /> : <div className="directory-note">
      <p>No published candidates match this search.</p><button className="link-button" type="button" onClick={() => { update(''); search.current?.focus() }}>Clear search</button>
    </div>}
    {matches.length > shown && <button type="button" className="button button-secondary more-results" onClick={showMore}>Show {Math.min(25, matches.length - shown)} more candidates</button>}
  </>
}
