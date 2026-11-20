import data from './election-data.json'
import { daysUntilNigeria } from './state'

export const sources = data.sources as Record<string, { label: string; url: string; publisher: string; published: string | null; reviewed: string }>
export const offices = data.offices as Record<string, { label: string; scope: string; date: string }>
export const parties = data.parties as Record<string, { code: string; name: string; sourceId: string }>
export const partyNames = Object.fromEntries(Object.values(parties).map(party => [party.code, party.name]))
export type Contest = {
  id: string; electionId: string; year: number; office: string; label: string; state: string | null
  sourceId: string; listingSourceId: string; date: string; status: 'listed' | 'declared'; notes: string[]; publisherPage: string | null
}
export const contests = Object.values(data.races) as Contest[]
export const contestById = new Map(contests.map(race => [race.id, race]))
export const contestPath = (race: Contest) => '/elections/' + race.id
export const legacyRace = contestById.get('2027-lagos-surulere-i-house')!
export const presidential = contestById.get('2027-president')!
export const presidentialArchive = contestById.get('2023-president')!
export const racePath = contestPath(legacyRace)
export const partyPath = (party: string) => '/parties/' + party.toLowerCase()
export const raceStatus = (race: Contest) => race.status === 'declared' ? 'Declared' : daysUntilNigeria(race.date) >= 0 ? 'Scheduled' : 'Listed · check INEC'
export const constituency = (race: Contest) => race.state ? [race.label, race.state].filter((name, index) => index === 0 || !race.label.startsWith(name)).join(', ') : 'Nationwide'

type Identity = { id: string; name: string }
export const identities = data.people as Record<string, Identity>
export type Candidate = (typeof data.candidacies)[number] & { name: string; race: Contest; mate: Identity | null }
export const roster: Candidate[] = data.candidacies.map(candidate => ({
  ...candidate, name: identities[candidate.personId].name,
  race: contestById.get(candidate.contestId)!, mate: candidate.mateId ? identities[candidate.mateId] : null,
})).sort((a, b) => a.name.localeCompare(b.name, 'en-NG') || b.race.year - a.race.year)
export const candidateById = new Map(roster.map(person => [person.id, person]))
export const candidatePath = (id: string) => {
  const person = candidateById.get(id)
  return person ? contestPath(person.race) + '/candidates/' + person.page : racePath
}
export const rosterFor = (race: Contest) => roster.filter(person => person.contestId === race.id)
export const searchable = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
export const matchWords = (value: string, query: string) => searchable(query).split(/\s+/).every(term => searchable(value).includes(term))
export const findCandidates = (query: string, people = roster) => people.filter(person => matchWords(
  [person.name, person.listedName, person.mate?.name, person.party, partyNames[person.party], person.race.label, person.race.state, offices[person.race.office].label, person.race.year].join(' '), query,
))
export const declaration = data.results['2023-president']
export const scopeLabel = (race: Contest) => race.state ? offices[race.office].scope : 'National'
export const candidateStatus = (race: Contest) => race.status === 'declared' ? 'Historical candidate' : 'Listed by INEC'
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
  concern?: string
}
export const rights: Right[] = [
  {
    slug: 'ballot-secrecy', topic: 'Ballot secrecy', title: 'Your ballot is private.',
    situation: 'What if someone asks to see my vote?',
    summary: 'Keep your marked ballot private. INEC elections covered by the Electoral Act use a secret ballot.',
    concern: 'A person interfering with a voter as they mark their ballot or trying to find out their vote may breach ballot secrecy.',
    action: 'Keep your marked ballot out of view. Move away if engaging would be unsafe.',
    steps: ['Use the private space provided at the polling unit to mark your ballot.', 'Do not take or share a photo of a marked ballot.', 'If it is safe to do so, raise a concern with a polling official or use the official contact page.'],
    section: 'Sections 50 and 126',
  },
  {
    slug: 'voting-assistance', topic: 'Voting assistance', title: 'Ask for voting assistance.',
    situation: 'What if I need help marking my ballot?',
    summary: 'The Electoral Act provides for voting assistance for eligible voters, subject to its rules.',
    concern: 'If you are refused assistance that the Act permits, ask the Presiding Officer to explain the procedure.',
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
  {
    slug: 'intimidation', topic: 'Voter safety', title: 'You can make your own choice.',
    situation: 'Someone threatens me if I vote or if I refuse to vote their way.',
    summary: 'The Electoral Act prohibits certain threats and coercion used to influence how someone votes or whether they vote.',
    concern: 'A threat of harm intended to change your vote or stop you voting may amount to undue influence.',
    action: 'Move to a safer place. Avoid confrontation.',
    steps: ['If it is safe, tell a polling official. For official election guidance use INEC’s contact page.', 'Only record basic details if you can do so safely. Keep other people’s identities and marked ballots private.'],
    section: 'Sections 131 and 132',
  },
  {
    slug: 'vote-buying', topic: 'Vote buying', title: 'Your vote cannot be bought.',
    situation: 'Someone offers me money or a gift in exchange for my vote.',
    summary: 'Offering or accepting money or other benefits in exchange for voting a certain way or abstaining can be an electoral offence.',
    concern: 'A gift offered on condition that you vote or abstain is different from an unconditional gift.',
    action: 'If you can do so safely, disengage and alert a polling official.',
    steps: ['Do not put yourself at risk to gather proof.', 'Use the official INEC contact page to seek guidance on where to report a concern.'],
    section: 'Section 125',
  },

]

export const photoReferences: Record<string, { href: string; credit: string }> = {
  'tinubu-bola-ahmed': { href: 'https://commons.wikimedia.org/wiki/File:Bola_Tinubu_portrait.jpg', credit: 'Nosa Asemota · CC BY-SA 4.0' },
  'abubakar-atiku': { href: 'https://commons.wikimedia.org/wiki/File:Atiku_Abubakar-2010.jpg', credit: 'Atiku Abubakar · CC BY 2.0 · photograph from 2010' },
  'obi-peter-gregory': { href: 'https://commons.wikimedia.org/wiki/File:Peter_Obi.png', credit: 'Plus TV Africa · CC BY 3.0' },
}

export const campaignStatements: Record<string, { date: string; fact: string; source: string; label: string }[]> = {
  '2027-president-sdp': [
    { date: '2026-08-06', fact: 'Adewole Adebayo told Voice of Nigeria he would prioritise national security if elected.', source: 'https://von.gov.ng/2027-election-sdp-candidate-prioritises-security/', label: 'Voice of Nigeria · Candidate statement' },
  ],
}

export const publicRecords: Record<string, { date: string; fact: string; source: string; label: string }[]> = {
  'tinubu-bola-ahmed': [
    { date: '2026-11-20', fact: 'The State House records his service as Lagos State governor from 1999 to 2007 and his earlier accounting career at Mobil Oil Producing Nigeria.', source: 'https://statehouse.gov.ng/team/bola-ahmed-tinubu/', label: 'State House · Official biography (reviewed 20 November 2026)' },
  ],
  'shettima-kashim': [
    { date: '2026-11-20', fact: 'The State House records his time as governor of Borno from 2011 to 2019, his election as Borno Central senator in 2019 and his accession to the vice presidency in 2023.', source: 'https://statehouse.gov.ng/team/kashim-shettima/', label: 'State House · Official biography (reviewed 20 November 2026)' },
  ],
  'abubakar-atiku': [
    { date: '2022-12-29', fact: 'Served as Nigeria’s vice president from 1999 to 2007. Radio Nigeria records his selection as the PDP presidential candidate in 2022 for the 2023 election.', source: 'https://radionigeriaibadan.gov.ng/2022/12/29/retrospect-the-bangs-on-nigerias-political-landscape/', label: 'Radio Nigeria · 2022 political retrospective' },
  ],
  'obi-peter-gregory': [
    { date: '2026-11-20', fact: 'Anambra State’s public history records his service as governor and the court ruling on the 2003 governorship election.', source: 'https://anambrastate.gov.ng/anambra-at-35-a-journey-of-leadership-legacy-and-progress/', label: 'Anambra State Government · Public history (reviewed 20 November 2026)' },
    { date: '2018-10', fact: 'Radio Nigeria reported that he was named as Atiku Abubakar’s running mate for the 2019 presidential election.', source: 'https://radionigeriaenugu.gov.ng/2018/10/gov-ugwuanyi-and-nnia-nwodo-support-peter-obis-vice-presidential-candidacy/', label: 'Radio Nigeria · 2019 presidential ticket' },
  ],
  'makinde-oluseyi-abiodun': [
    { date: '2026-11-20', fact: 'The Oyo State government biography records his election as governor in 2019 and his earlier work in engineering and business.', source: 'https://oyostate.gov.ng/meet-gov-seyi-makinde/', label: 'Oyo State Government · Official biography (reviewed 20 November 2026)' },
  ],
  'sowore-omoyele': [
    { date: '2019-12', fact: 'The Committee to Protect Journalists identifies him as the founder of Sahara Reporters and documents his work as a journalist.', source: 'https://cpj.org/2019/12/nigeria-ethiopia-free-expression-crackdown/', label: 'Committee to Protect Journalists · Reporting' },
    { date: '2026-11-20', fact: 'A report by the American Bar Association describes his presidential candidacy in the 2019 election.', source: 'https://dev.americanbar.org/groups/human_rights/reports/prelim_report_omoyele_sowore_nigeria/', label: 'American Bar Association · Background (reviewed 20 November 2026)' },
  ],
  'duke-donald': [
    { date: '2026-11-20', fact: 'The Cross River State Bureau of Statistics lists Donald Etim Duke as governor from 1999 to 2007.', source: 'https://www.crossriverstate.gov.ng/download/Bureau%20of%20Statistics/formatted%20Personal%20F%26F%20FINAL%20PRINT-1.pdf', label: 'Cross River State Bureau of Statistics · Table 2.2 (reviewed 20 November 2026)' },
  ],
  'national-onor-sandy-ojang': [
    { date: '2020-05-12', fact: 'The National Assembly records that he represented Cross River Central in the Senate and sponsored a bill proposing an Advanced Healthcare Development Fund.', source: 'https://nass.gov.ng/news/item/1513', label: 'National Assembly · Senate report' },
  ],
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
