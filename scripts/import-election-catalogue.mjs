import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'

const input = new URL('../data/election-source-records.json', import.meta.url)
const output = new URL('../src/election-data.json', import.meta.url)
const { sources, offices, partyNames, contests } = JSON.parse(readFileSync(input, 'utf8'))
const people = {}
const candidacies = []
const elections = {}
const races = {}
const results = {}
const usedIds = new Set()
const usedParties = new Set()

export const slug = (text) => text.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const nameCase = (value) => value.toLowerCase().replace(/(^|[\s-])\p{L}/gu, character => character.toUpperCase()).replace(/\b[a-z]\./g, initial => initial.toUpperCase())
// Only merge spellings with separately reviewed identity links; party is candidacy-specific.
const knownIdentities = {
  'sowore-omoyele-stephen': ['sowore-omoyele', 'Omoyele Sowore'],
  'sowore-omoyele': ['sowore-omoyele', 'Omoyele Sowore'],
  'abubakar-atiku': ['abubakar-atiku', 'Atiku Abubakar'],
  'tinubu-bola-ahmed': ['tinubu-bola-ahmed', 'Bola Ahmed Tinubu'],
  'shettima-kashim': ['shettima-kashim', 'Kashim Shettima'],
  'amaechi-chibuike-rotimi': ['amaechi-chibuike-rotimi', 'Rotimi Amaechi'],
  'obi-peter-gregory': ['obi-peter-gregory', 'Peter Obi'],
  'musa-mohammed-rabiu-kwankwaso': ['musa-mohammed-rabiu-kwankwaso', 'Rabiu Kwankwaso'],
  'duke-donald': ['duke-donald', 'Donald Duke'],
  'adenuga-sunday': ['adenuga-sunday', 'Sunday Adenuga'],
  'adenuga-sunday-oluwafemi': ['adenuga-sunday', 'Sunday Adenuga'],
  'makinde-oluseyi-abiodun': ['makinde-oluseyi-abiodun', 'Seyi Makinde'],
}
const currentOffices = Object.fromEntries(Object.entries(offices).map(([id, [label, scope, date]]) => [id, { label, scope, date }]))
for (const [id, source] of Object.entries(sources)) {
  assert.equal(new URL(source.url).protocol, 'https:', id)
  assert.match(source.reviewed, /^\d{4}-\d{2}-\d{2}$/, id)
}
const addPerson = (listedName, contestId) => {
  const key = slug(listedName)
  const [personId, name] = knownIdentities[key] ?? [
    contestId.endsWith('-president') ? 'national-' + key : contestId + '-' + key,
    nameCase(listedName),
  ]
  people[personId] ??= { id: personId, name }
  return personId
}
for (const contest of contests) {
  const { id, office, label, state, sourceId, listingSourceId = sourceId, expected, rows, notes = [], publisherPage = null, year = 2027, declaration } = contest
  const officeRecord = currentOffices[office]
  const date = contest.date ?? officeRecord?.date
  assert.ok(!races[id] && officeRecord && sources[sourceId] && sources[listingSourceId] && date, id)
  assert.equal(Boolean(state), officeRecord.scope !== 'national', id)
  assert.equal(rows.length, expected, id)
  const electionId = String(year)
  elections[electionId] ??= { id: electionId, year, calendarSourceId: year === 2027 ? 'calendar' : sourceId }
  const usedRows = new Set()
  const contestParties = new Set()
  const entries = []
  const pages = []
  for (const [index, row] of rows.entries()) {
    const { number, party, name, qual, age, mate, mateQual, votes, listingNumber = number, listingName = name, mateNumber = mate ? number : null } = row
    assert.ok(Number.isInteger(number) && !usedRows.has(number), `${id}: source row ${number}`)
    if (index > 0) assert.equal(number - 1, rows[index - 1].number, `${id}: unexpected source gap`)
    assert.ok(partyNames[party] && name && !contestParties.has(party), `${id}: party ${party}`)
    assert.ok(age === null || (Number.isInteger(age) && age > 0 && age < 120), `${id}: invalid age`)
    assert.ok(!mate || (mate !== name && ['governor', 'president'].includes(office)), id)
    if (['governor', 'president'].includes(office)) {
      assert.ok(mate && Number.isInteger(mateNumber), id)
      if (declaration) {
        assert.equal(listingNumber, number * 2 - 1, id)
        assert.equal(mateNumber, listingNumber + 1, id)
        assert.equal(slug(listingName), slug(name), `${id}: listing/declaration identity mismatch, ${name}`)
      }
    }
    usedRows.add(number)
    contestParties.add(party)
    usedParties.add(party)
    const personId = addPerson(name, id)
    const candidateId = row.id ?? `${id}-${party.toLowerCase()}`
    const page = slug(name)
    assert.ok(!usedIds.has(candidateId) && !pages.includes(page), candidateId)
    usedIds.add(candidateId)
    pages.push(page)
    candidacies.push({
      id: candidateId, personId, contestId: id, party, number, listingNumber, listedName: nameCase(listingName), page, mateNumber,
      qualification: qual.trim(), age, mateId: mate ? addPerson(mate, id) : null, mateListedName: mate ? nameCase(mate) : null,
      mateQualification: mateQual?.trim() || null,
    })
    if (declaration) {
      assert.ok(Number.isSafeInteger(votes) && votes >= 0, candidateId)
      entries.push({ candidateId, votes })
    } else assert.equal(votes, undefined, candidateId)
  }
  if (declaration) {
    assert.equal(entries.reduce((sum, row) => sum + row.votes, 0), declaration.valid, id)
    assert.ok(declaration.rejected >= 0 && contestParties.has(declaration.electedParty), id)
    results[id] = { ...declaration, entries }
  }
  races[id] = { id, electionId, year, office, label, state, sourceId, listingSourceId, date, status: declaration ? 'declared' : 'listed', notes, publisherPage }
}
const parties = Object.fromEntries([...usedParties].sort().map(code => [code, { code, name: partyNames[code], sourceId: 'register' }]))
const geography = Object.fromEntries([...new Set(contests.map(contest => contest.state).filter(Boolean))].sort().map(state => [
  state, { name: state, constituencies: Object.values(races).filter(contest => contest.state === state && currentOffices[contest.office].scope.includes('constituency')).map(contest => contest.id), districts: Object.values(races).filter(contest => contest.state === state && contest.office === 'senate').map(contest => contest.id) },
]))
const rendered = JSON.stringify({ sources, offices: currentOffices, elections, geography, races, parties, people, candidacies, results }) + '\n'
if (process.argv.includes('--check')) assert.equal(readFileSync(output, 'utf8').replace(/\r\n/g, '\n'), rendered, 'Run npm run data:import to regenerate the catalogue.')
else writeFileSync(output, rendered)
console.log(`${candidacies.length} candidacies · ${Object.keys(races).length} contests · ${Object.keys(parties).length} parties`)
