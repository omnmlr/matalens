import { readFileSync } from 'node:fs'
import type { Capture } from './model.ts'

type Catalogue = {
  people: Record<string, { id: string; name: string }>
  parties: Record<string, { code: string }>
  races: Record<string, { notes: string[]; date: string }>
  candidacies: { contestId: string; personId: string; mateId: string | null; party: string }[]
}

const catalogue: Catalogue = JSON.parse(readFileSync(new URL('../../src/election-data.json', import.meta.url), 'utf8'))
export const knownPerson = (id: string) => Object.hasOwn(catalogue.people, id)
export const knownParty = (code: string) => Object.hasOwn(catalogue.parties, code)

export function contestLinks(id: string) {
  if (!Object.hasOwn(catalogue.races, id)) throw new Error(`Unknown contest: ${id}`)
  const tickets = catalogue.candidacies.filter(candidate => candidate.contestId === id)
  return {
    people: tickets.flatMap(ticket => ticket.mateId ? [ticket.personId, ticket.mateId] : [ticket.personId]),
    parties: tickets.map(ticket => ticket.party),
    tickets,
    race: catalogue.races[id],
  }
}

export function catalogueCapture(id: string, title: string, retrievedAt: string): Capture {
  const { tickets, race } = contestLinks(id)
  const rows = tickets.map(({ personId, mateId, party }) => [catalogue.people[personId].name, mateId && catalogue.people[mateId].name, party].filter(Boolean).join(' / '))
  return {
    title,
    text: [`${tickets.length} named tickets`, ...race.notes, ...rows].join('\n'),
    retrievedAt,
    provenance: 'catalogue',
  }
}
