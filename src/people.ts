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

export const personPath = (id: string, year?: number) => {
  const candidacies = candidaciesByPerson.get(id) ?? []
  const tickets = ticketsByMate.get(id) ?? []
  const cycle = year ?? Math.max(0, ...[...candidacies, ...tickets].map(record => record.race.year))
  const candidate = candidacies.find(record => record.race.year === cycle)
  return candidate ? candidatePath(candidate.id) : '/people/' + id + (cycle === 2023 ? '?year=2023' : '')
}

export const mateRoutes = new Map([...ticketsByMate.keys()].map(id => ['/people/' + id, identities[id]]))

export type Watchlist = { savedPeople: string[]; togglePerson: (id: string) => void }
