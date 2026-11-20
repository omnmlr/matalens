import { candidatePath, identities, roster, type Candidate } from './catalogue'

export const candidaciesByPerson = new Map<string, Candidate[]>()
export const ticketsByMate = new Map<string, Candidate[]>()
for (const candidate of roster) {
  const candidacies = candidaciesByPerson.get(candidate.personId) ?? []
  candidaciesByPerson.set(candidate.personId, [...candidacies, candidate])
  if (candidate.mateId) {
    const tickets = ticketsByMate.get(candidate.mateId) ?? []
    ticketsByMate.set(candidate.mateId, [...tickets, candidate])
  }
}

export const personPath = (id: string) => {
  const candidate = candidaciesByPerson.get(id)?.[0]
  return candidate ? candidatePath(candidate.id) : '/people/' + id
}

export const mateRoutes = new Map([...ticketsByMate.keys()].filter(id => !candidaciesByPerson.has(id)).map(id => [personPath(id), identities[id]]))

export type Follows = { followed: string[]; toggleFollow: (id: string) => void }
