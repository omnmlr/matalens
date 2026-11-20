import { ArrowRight, Check, Plus } from 'lucide-react'
import { identities, partyPath } from './catalogue'
import { candidaciesByPerson, personPath, ticketsByMate, type Follows } from './people'

export function FollowButton({ id, followed, toggleFollow }: { id: string } & Follows) {
  const active = followed.includes(id)
  return <button type="button" className="button button-secondary follow-button" aria-pressed={active} aria-label={`Follow ${identities[id]?.name ?? "politician"}`} onClick={() => toggleFollow(id)}>
    {active ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />} {active ? 'Following' : 'Follow'}
  </button>
}

export function FollowedPeople({ followed, toggleFollow, limit }: Follows & { limit?: number }) {
  const known = followed.filter(id => identities[id])
  return known.length ? <ul className="follow-list">
    {known.slice(0, limit).map(id => {
      const record = candidaciesByPerson.get(id)?.[0] ?? ticketsByMate.get(id)?.[0]
      return <li key={id}>
        <div><a className="person-name" href={personPath(id)}>{identities[id].name}</a>
          {record && <small><a href={partyPath(record.party)}>{record.party}</a> · {record.race.year}{!candidaciesByPerson.has(id) && ' running mate'}</small>}
        </div>
        <FollowButton id={id} followed={followed} toggleFollow={toggleFollow} />
      </li>
    })}
  </ul> : <div className="editorial-empty"><p>Follow politicians to see relevant updates here. Your follows stay in this browser.</p><a className="text-link" href="/discover">Find people to follow <ArrowRight size={15} aria-hidden="true" /></a></div>
}
