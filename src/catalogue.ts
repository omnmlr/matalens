import { candidates, dates, links, partyNames, race, reviewed } from './content'

export const catalogueRace = {
  ...race, id: '2027-lagos-surulere-i-house', year: 2027, date: dates[0].date,
  source: { label: 'INEC Lagos House candidate list', href: links.race, page: 14, checked: reviewed },
}
export const racePath = '/elections/' + catalogueRace.id
export const comparePath = racePath + '/compare'
const candidateSlugs: Record<string, string> = {
  'ndc-176': 'adebayo-adefolaseye-adebomi',
  'nrm-177': 'adepitan-olusegun-olatunji',
  'adc-172': 'adeshina-riliwan-kofoworola',
  'app-175': 'ishaaq-tunde-kazeem',
  'apc-173': 'laguda-fuad-kayode',
  'aac-171': 'odebunmi-obafemi-babatunde',
  'apm-174': 'oworu-olumide-abiodun',
  'pdp-178': 'ugbah-ozo-brown-lewis',
}
export const candidatePath = (id: string) => racePath + '/candidates/' + candidateSlugs[id]
export const partyPath = (party: string) => '/parties/' + party.toLowerCase()

export type Candidate = (typeof candidates)[number]
export const roster = [...candidates].sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))
const searchable = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

export function findCandidates(query: string, includeRace = false) {
  const terms = searchable(query).split(/\s+/).filter(Boolean)
  return roster.filter(candidate => {
    const record = searchable([
      candidate.name, candidate.party, partyNames[candidate.party],
      ...(includeRace ? [catalogueRace.office, catalogueRace.state, catalogueRace.constituency] : []),
    ].join(' '))
    return terms.every(term => record.includes(term))
  })
}

export const actLink = 'https://nass.gov.ng/documents/download/11248'
export const contactLink = 'https://www.inecnigeria.org/contact'
export const irevLink = 'https://irev.inecnigeria.org/'

type Right = {
  slug: string
  topic: string
  title: string
  situation: string
  summary: string
  action: string
  steps: string[]
  section: string
}
export const rights: Right[] = [
  {
    slug: 'ballot-secrecy', topic: 'Ballot secrecy', title: 'Your ballot is private.',
    situation: 'What if someone asks to see my vote?',
    summary: 'Keep your marked ballot private. INEC elections covered by the Electoral Act use a secret ballot.',
    action: 'Keep your marked ballot out of view. Move away if engaging would be unsafe.',
    steps: ['Use the private space provided at the polling unit to mark your ballot.', 'Do not take or share a photo of a marked ballot.', 'If it is safe to do so, raise a concern with a polling official or use the official contact page.'],
    section: 'Sections 50 and 126',
  },
  {
    slug: 'voting-assistance', topic: 'Voting assistance', title: 'Ask for voting assistance.',
    situation: 'What if I need help marking my ballot?',
    summary: 'The Electoral Act provides for voting assistance for eligible voters, subject to its rules.',
    action: 'Tell the Presiding Officer what assistance you need.',
    steps: ['Ask what accessible materials or support are available at your polling unit.', 'Under section 54, a voter who meets the conditions for assistance may choose a person to help. The person must inform the Presiding Officer. A candidate, party agent or party official cannot accompany the voter into the voting compartment.'],
    section: 'Section 54',
  },
  {
    slug: 'assigned-polling-unit', topic: 'Your polling unit', title: 'Check where you are registered.',
    situation: 'What if the closest polling unit is a different one?',
    summary: 'Use INEC’s official lookup to check your assigned polling unit before you set out.',
    action: 'Check your assigned polling unit with INEC. Section 56 requires voting at the unit allotted to you.',
    steps: ['Save the public unit name or code in your private plan if it helps you prepare.', 'If you cannot confirm your details, use the official INEC contact page for guidance.'],
    section: 'Section 56',
  },
]

export const publicRecords: Record<string, { date: string; fact: string; source: string; label: string }[]> = {
  'apc-173': [
    {
      date: '2024-02-29',
      fact: 'House proceedings record his appointment as chair of the Committee on Federal Polytechnics and Higher Technical Education.',
      source: 'https://placng.org/i/wp-content/uploads/2024/04/House-of-Reps-votes-and-proceedings-Thursday-29-February-2024.pdf',
      label: 'House of Representatives · Votes and Proceedings, page 2266',
    },
    {
      date: '2025-02-11',
      fact: 'House proceedings record him presenting a committee report on the National Vocational Centre bill (HB. 510).',
      source: 'https://nass.gov.ng/documents/download/11179',
      label: 'House of Representatives · Votes and Proceedings, no. 103',
    },
  ],
}
