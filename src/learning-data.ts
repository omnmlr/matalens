import { offices, presidential, rosterFor, sources } from './catalogue'
import { links } from './content'
import type { StoryQuiz, StorySource } from './story-contract'

export type Lesson = {
  id: string
  topic: string
  title: string
  introduction: string
  quiz: StoryQuiz
  sources: StorySource[]
}

const inec = 'Independent National Electoral Commission (INEC)'
const tickets = rosterFor(presidential)
const candidate = tickets.find(item => item.id === '2027-president-sdp')!
const otherParties = tickets.filter(item => item.party !== candidate.party).slice(0, 2).map(item => item.party)
const options = [candidate.party, ...otherParties].sort()
const source = sources[presidential.listingSourceId]

export const lessons: Lesson[] = [
  {
    id: 'read-a-ticket', topic: 'Candidate and party recognition', title: 'Read a presidential ticket',
    introduction: 'A presidential ticket pairs the nominee for president with the nominee for vice president. In the INEC list, check the contest year and the party abbreviation alongside both names.',
    sources: [{ id: 'roster', title: source.label, publisher: inec, url: source.url, publishedAt: source.published ?? undefined }],
    quiz: {
      id: 'ticket-party', prompt: `Which party is listed for ${candidate.name} in the 2027 ${offices[presidential.office].label.toLowerCase()} contest?`,
      options, correct: options.indexOf(candidate.party),
      explanation: `INEC lists ${candidate.party} in the party column for this ticket. His running mate appears on the same row.`,
      sourceIds: ['roster'],
    },
  },
  {
    id: 'read-a-budget', topic: 'Policy concepts', title: 'What a budget can tell you',
    introduction: 'A budget sets out planned revenue and spending. To check whether spending happened, look for budget implementation reports and identify the period they cover.',
    sources: [
      { id: 'implementation', title: 'Budget implementation reports', publisher: 'Budget Office of the Federation', url: 'https://budgetoffice.gov.ng/index.php/resources/internal-resources/reports/quarterly-budget-implementation/2026-budget-implementation-reports?layout=default' },
    ],
    quiz: {
      id: 'budget-evidence', prompt: 'Which record would help you check how much a ministry actually spent in a quarter?',
      options: ['Its proposed annual budget', 'A campaign speech', 'The quarterly budget implementation report'], correct: 2,
      explanation: 'Implementation reports track budget performance during a stated period. They help you compare spending with the original plan.',
      sourceIds: ['implementation'],
    },
  },
  {
    id: 'polling-unit-check', topic: 'Election process', title: 'Find your polling unit',
    introduction: 'Before election day, use INEC’s official service to find the polling unit assigned to your registration. Keep the unit name or public code handy for your own planning.',
    sources: [{ id: 'polling', title: 'INEC polling-unit finder', publisher: inec, url: links.polling }],
    quiz: {
      id: 'assigned-unit', prompt: 'Which polling unit should you check before election day?',
      options: ['The one assigned to my registration', 'The one nearest to my home', 'Any unit in the same state'], correct: 0,
      explanation: 'Start with the polling unit assigned to your registration. Confirm its details with INEC before you leave.',
      sourceIds: ['polling'],
    },
  },
]

export const lessonPath = (id: string) => '/learn/' + id

export function dailyLesson(now = Date.now()) {
  const dayInNigeria = Math.floor((now + 3_600_000) / 86_400_000)
  return lessons[dayInNigeria % lessons.length]
}
