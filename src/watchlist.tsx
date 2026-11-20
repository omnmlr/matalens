import { ArrowRight, Bookmark, Check } from 'lucide-react'
import { candidatePath, contestPath, identities, offices, partyPath } from './catalogue'
import { candidaciesByPerson, personPath, ticketsByMate, type Watchlist } from './people'
import type { Story } from './story-contract'
import { storyPath } from './stories'

export function WatchButton({ id, savedPeople, togglePerson, compact = false }: { id: string; compact?: boolean } & Watchlist) {
  const active = savedPeople.includes(id)
  return <button type="button" className={compact ? 'button button-secondary watch-button' : 'button watch-button'} aria-pressed={active} aria-label={`Save ${identities[id]?.name ?? 'politician'} to watchlist`} onClick={() => togglePerson(id)}>
    {active ? <Check size={17} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />} {active ? 'Saved' : compact ? 'Save' : 'Save to watchlist'}
  </button>
}

export function WatchlistPeople({ stories, ...watchlist }: Watchlist & { stories: Story[] }) {
  const people = watchlist.savedPeople.flatMap(id => {
    if (!identities[id]) return []
    const records = [...(candidaciesByPerson.get(id) ?? []), ...(ticketsByMate.get(id) ?? [])]
      .sort((first, second) => second.race.year - first.race.year)
    return records.length ? [{ id, records }] : []
  })
  if (!people.length) return <div className="editorial-empty">
    <p>Save a person to return to their candidacy, party and available public records.</p>
    <a className="text-link" href="/discover">Find candidates <ArrowRight size={15} aria-hidden="true" /></a>
  </div>
  return <ul className="watch-list">{people.map(({ id, records }) => {
    const [record] = records
    const historical = record.race.year < 2027
    const earlier = records.find(item => item.personId === id && item.race.year < record.race.year)
    const development = stories.find(story => story.personIds.length === 1 && story.personIds[0] === id)
    const manifesto = stories.some(story => story.commitments.some(item => item.personId === id && item.kind === 'manifesto'))
    return <li key={id}>
      <div className="watch-details">
        <a className="person-name" href={personPath(id, record.race.year)}>{identities[id].name}</a>
        <small>{historical ? '2023 archive' : '2027 elections'} · {record.personId === id ? offices[record.race.office].label : 'Running mate'} · <a href={partyPath(record.party) + (historical ? '?year=2023' : '')}>{record.party}</a></small>
        <div className="watch-links">
          <a className="text-link" href={contestPath(record.race)}>{record.race.label} <ArrowRight size={14} aria-hidden="true" /></a>
          {earlier && <a className="text-link" href={candidatePath(earlier.id)}>Earlier candidacy <ArrowRight size={14} aria-hidden="true" /></a>}
          {manifesto && !historical && <a className="text-link" href={personPath(id, record.race.year) + '#manifestos'}>Manifesto evidence <ArrowRight size={14} aria-hidden="true" /></a>}
          {development && <a className="text-link" href={storyPath(development.id)}>{development.title} <ArrowRight size={14} aria-hidden="true" /></a>}
        </div>
      </div>
      <WatchButton id={id} {...watchlist} compact />
    </li>
  })}</ul>
}
