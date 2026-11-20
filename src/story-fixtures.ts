import { presidential, rosterFor, sources } from './catalogue'
import { links } from './content'
import type { Story, StorySource } from './story-contract'

const reviewedAt = '2026-11-20'
const roster = rosterFor(presidential)
const inec = 'Independent National Electoral Commission (INEC)'
const officialList = sources[presidential.listingSourceId]
const rosterSource: StorySource = {
  id: 'presidential-pdf', title: 'Final List – Presidential', publisher: inec,
  url: officialList.url, publishedAt: officialList.published ?? undefined,
  evidence: 'The table lists the nominees on each party ticket. The Accord row is marked “COURT ORDER” and gives no nominee names.',
}
const calendar: StorySource = {
  id: 'calendar', title: 'INEC election calendar', publisher: inec, url: links.calendar,
  evidence: 'The calendar identifies the scheduled dates and offices for each round of the general election.',
}
const campaignSource: StorySource = {
  id: 'von-interview', title: '2027 Election: SDP Candidate Prioritises Security', publisher: 'Voice of Nigeria',
  url: 'https://von.gov.ng/2027-election-sdp-candidate-prioritises-security/', publishedAt: '2026-08-06',
  evidence: 'The report attributes the security pledge to Adebayo’s remarks at a summit in Kaduna.',
}
const apcManifesto: StorySource = {
  id: 'apc-manifesto', title: 'From Reforms to Prosperity · APC manifesto for the 2027 presidential election',
  publisher: 'All Progressives Congress', url: 'https://renewedhope02.com/manifesto',
  evidence: 'The October 2026 campaign document describes plans for affordable housing and mortgages, including publication of handover and mortgage counts.',
}
const securityCommitment = {
  title: 'Prioritise national security if elected', kind: 'public-statement',
  date: '2026-08-06', personId: 'national-adebayo-adewole-ebenezer', sourceId: campaignSource.id,
  comparison: 'The INEC list establishes his candidacy. His earlier remarks give a stated priority. Measuring delivery would require a specific action, a timeline and a public record of implementation.',
} as const

export const fixtures: Story[] = [
  {
    id: 'state-assembly-lists-2027', title: 'INEC publishes state assembly candidate lists',
    publishedAt: '2026-11-14', reviewedAt, reviewStatus: 'reviewed', topic: 'Candidate records', personIds: [], partyCodes: [],
    sources: [
      { id: 'state-notice', title: 'Updated list of candidates for 2027 State Houses of Assembly elections', publisher: inec, url: links.assembly, publishedAt: '2026-11-14', evidence: 'Open your state’s document, then look for the constituency and the candidates listed under it.' },
      calendar,
    ],
    explanation: 'INEC published state-by-state candidate lists for the 2027 State House of Assembly elections.',
    context: 'State assembly contests are organised by state constituency. Look for the constituency heading before reading the names and party abbreviations.',
    significance: 'The constituency heading tells you which list applies to your ballot. Check the commission’s publication for subsequent updates.',
    commitments: [],
    quiz: {
      id: 'state-constituency', prompt: 'What should you find before reading a state assembly candidate list?',
      options: ['The first party in the table', 'Your state constituency', 'The nationwide presidential roster'],
      correct: 1, explanation: 'State assembly lists group candidates by constituency. Start with the relevant constituency heading.',
      sourceIds: ['state-notice'],
    },
  },
  {
    id: 'mock-accreditation-2026', title: 'What INEC’s mock accreditation will test',
    publishedAt: '2026-11-13', reviewedAt, reviewStatus: 'reviewed', topic: 'Election process', personIds: [], partyCodes: [],
    sources: [
      { id: 'mock-notice', title: 'INEC sets 28th November, 2026 for nationwide mock accreditation exercise', publisher: inec, url: links.mock, publishedAt: '2026-11-13', evidence: 'The chair said the exercise would test accreditation and electronic result transmission.' },
      { id: 'voter-guide', title: 'Voter education', publisher: inec, url: links.education, evidence: 'The guide explains how accreditation fits into the polling-day procedure.' },
      calendar,
    ],
    explanation: 'INEC announced a nationwide mock accreditation exercise for 28 November 2026 to test voter accreditation and electronic result transmission before the general election.',
    context: 'Accreditation is the step in which polling officials confirm a voter’s eligibility at the polling unit. Electronic result transmission is a separate step in handling polling-unit results.',
    significance: 'A mock exercise lets officials test procedures and equipment ahead of polling day. Its announcement establishes the plan for the exercise.',
    openQuestion: 'What did INEC find during the test? Look for a dated follow-up from the commission after the exercise.',
    commitments: [],
    quiz: {
      id: 'mock-purpose', prompt: 'What did INEC say it would test during the mock exercise?',
      options: ['Campaign spending limits', 'Accreditation and electronic result transmission', 'The order of names on the ballot'],
      correct: 1, explanation: 'INEC named voter accreditation and electronic result transmission as the two parts of the test.',
      sourceIds: ['mock-notice'],
    },
  },
  {
    id: 'presidential-roster-2027', title: 'The 2027 presidential candidate list is out',
    publishedAt: '2026-10-31', reviewedAt, reviewStatus: 'reviewed', topic: 'Presidential election',
    personIds: roster.flatMap(person => person.mateId ? [person.personId, person.mateId] : [person.personId]),
    partyCodes: [...new Set([...roster.map(person => person.party), 'A'])],
    sources: [
      { id: 'presidential-notice', title: 'Updated list of candidates for 2027 presidential election', publisher: inec, url: presidential.publisherPage!, publishedAt: '2026-10-31', evidence: 'The notice links directly to the final presidential candidate list.' },
      rosterSource, calendar, campaignSource, apcManifesto,
    ],
    explanation: 'INEC’s published roster names 18 presidential tickets. A separate Accord entry is marked “COURT ORDER” and names neither a presidential nor a vice-presidential nominee.',
    context: 'A presidential ticket pairs a candidate for president with a running mate. The roster records the party and nominees for this election year. Earlier rosters have their own records.',
    significance: 'The list is the starting point for identifying who is listed for the contest. The publication page is where INEC links the source document.',
    openQuestion: 'Will INEC publish a revised entry for the Accord ticket? Check for a later official notice.',
    commitments: [securityCommitment, {
      title: 'Expand social housing and affordable mortgages', kind: 'manifesto', date: '2026-10',
      personId: 'tinubu-bola-ahmed', sourceId: apcManifesto.id,
      comparison: 'The nomination list records Tinubu’s APC candidacy. The APC’s October 2026 manifesto sets out a housing programme for 2027–2031. Its pledge to track homes handed over and mortgaged gives readers specific measures to check in later public records.',
    }],
    quiz: {
      id: 'read-roster', prompt: 'Which source should you open to confirm the names on a 2027 presidential ticket?',
      options: ['INEC’s 2027 final presidential list', 'The 2023 vote totals', 'A party abbreviation on its own'],
      correct: 0, explanation: 'The 2027 final list names the nominees and groups them by party in the relevant election year.',
      sourceIds: ['presidential-pdf'],
    },
  },
  {
    id: 'adebayo-security-statement', title: 'Adewole Adebayo names security as a priority',
    publishedAt: '2026-08-06', reviewedAt, reviewStatus: 'reviewed', topic: 'Campaign statement',
    personIds: [securityCommitment.personId], partyCodes: ['SDP'],
    sources: [campaignSource, rosterSource],
    explanation: 'Voice of Nigeria reported that Adewole Adebayo pledged to prioritise national security if elected, speaking at a summit in Kaduna.',
    context: 'The remarks are a campaign statement attributed to Adebayo. INEC’s later 2027 presidential list records his SDP nomination.',
    significance: 'A stated priority gives readers a reference point for evaluating later plans and public records.',
    commitments: [{ ...securityCommitment, comparison: 'Voice of Nigeria reports the stated priority. To assess any later delivery, look for a policy document that names a targeted action and a record that shows what was done.' }],
    openQuestion: 'What actions, funding and timing would put this priority into practice?',
    quiz: {
      id: 'pledge-evidence', prompt: 'What does the Voice of Nigeria report directly establish?',
      options: ['A new security budget passed', 'A security programme was completed', 'A candidate stated a priority'],
      correct: 2, explanation: 'It reports what the candidate said at the summit. Budget passage and programme delivery require separate records.',
      sourceIds: ['von-interview'],
    },
  },
]
