import type { Recipe, SourceConfig } from './model.ts'

const inec = 'Independent National Electoral Commission (INEC)'

export const sourceConfigs: SourceConfig[] = [
  {
    id: 'recruitment-notice', title: 'INEC Updates Closing Date for INECPRESS Ad-Hoc Staff Recruitment',
    publisher: inec, url: 'https://inecnigeria.org/press/inec-updates-closing-date-for-inecpress-ad-hoc-staff-recruitment',
    publishedAt: '2026-11-19', kind: 'html',
    evidence: {
      deadline: {
        terms: [['ad hoc staff recruitment'], ['18th november'], ['2nd december'], ['2026'], ['extended']],
        summary: 'INEC extended the application deadline for ad hoc election staff from 18 November to 2 December 2026.',
      },
      window: {
        terms: [['18th november'], ['2nd december'], ['extended']],
        summary: 'The original 18 November cutoff was replaced by a date two weeks later.',
      },
    },
  },
  {
    id: 'recruitment-statement', title: 'Extension of deadline for the registration of ad hoc staff on the INECPRES portal',
    publisher: 'Press Release Naija · INEC statement', url: 'https://pressreleasenaija.com.ng/extension-of-deadline-for-the-registration-of-ad-hoc-staff-on-the-inecpres-portal/',
    publishedAt: '2026-11-19', kind: 'html',
    evidence: {
      portal: {
        terms: [['inecpres'], ['2027 general election']],
        summary: 'The republished statement identifies INECPRES as the recruitment portal for temporary staff for the 2027 general election.',
      },
      cutoff: {
        terms: [['3rd december 2026', 'december 3 2026'], ['portal will now close']],
        summary: 'The statement republished by Press Release Naija gives 3 December 2026 as the new cutoff.',
      },
    },
  },
  {
    id: 'assembly-notice', title: 'Updated list of candidates for 2027 State Houses of Assembly elections',
    publisher: inec, url: 'https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-state-houses-of-assembly-elections',
    publishedAt: '2026-11-14', kind: 'html',
    evidence: {
      lists: {
        terms: [['state houses of assembly elections'], ['lagos'], ['oyo']],
        summary: 'INEC published updated lists for the 2027 State House of Assembly elections, with documents organised by state.',
      },
      navigation: {
        terms: [['lagos'], ['oyo']],
        summary: 'Separate files are listed for Lagos and Oyo. Open the state file first, then find the constituency heading.',
      },
    },
  },
  {
    id: 'election-calendar', title: 'Full Election Calendar & Timetable', publisher: inec,
    url: 'https://www.inecnigeria.org/elections/calendar', kind: 'html',
    evidence: {
      assembly: {
        terms: [['house of assembly', 'houses of assembly'], ['2027'], ['6 february 2027', '6th february 2027', 'february 6 2027', '06 february 2027', '6 feb 2027']],
        summary: 'The published calendar schedules the state assembly elections alongside governorship elections on 6 February 2027.',
      },
      presidential: {
        terms: [['presidential'], ['national assembly'], ['16 january 2027', '16th january 2027', 'january 16 2027', '16 jan 2027'], ['2027']],
        summary: 'The calendar schedules the presidential and National Assembly elections for 16 January 2027.',
      },
    },
  },
  {
    id: 'mock-notice', title: 'INEC sets 28th November, 2026 for nationwide mock accreditation exercise',
    publisher: inec, url: 'https://inecnigeria.org/press/inec-sets-28th-november-2026-for-nationwide-mock-accreditation-exercise',
    publishedAt: '2026-11-13', kind: 'html',
    evidence: {
      exercise: {
        terms: [['mock accreditation'], ['november 28', '28th november'], ['2026'], ['electronic result transmission']],
        summary: 'INEC announced a nationwide mock accreditation exercise for 28 November 2026 to test voter accreditation and electronic result transmission.',
      },
    },
  },
  {
    id: 'mock-report', title: 'INEC Fixes Nov 28 For Nationwide Mock Accreditation Ahead Of 2027 General Elections',
    publisher: 'Channels Television', url: 'https://www.channelstv.com/2026/11/12/inec-fixes-nov-28-for-nationwide-mock-accreditation-ahead-of-2027-general-elections/',
    publishedAt: '2026-11-12', kind: 'html',
    evidence: {
      announcement: {
        terms: [['mock accreditation'], ['nov 28', 'november 28'], ['chatham house']],
        summary: 'Channels Television reported that INEC chair Joash Amupitan announced the rehearsal during a dialogue at Chatham House on 12 November.',
      },
    },
  },
  {
    id: 'voter-education', title: 'Voter Education & Guidelines', publisher: inec,
    url: 'https://www.inecnigeria.org/voters/education', kind: 'html',
    evidence: {
      accreditation: {
        terms: [['accreditation'], ['permanent voter card', 'pvc'], ['polling unit'], ['bvas']],
        summary: 'Accreditation is the part of the polling process when officials confirm a voter’s eligibility at the polling unit.',
      },
    },
  },
  {
    id: 'presidential-notice', title: 'Updated list of candidates for 2027 presidential election',
    publisher: inec, url: 'https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-presidential-election',
    publishedAt: '2026-10-31', kind: 'html',
    evidence: {
      list: {
        terms: [['2027 presidential election'], ['final list presidential']],
        summary: 'INEC’s publication page links to the final presidential candidate list for the 2027 election.',
      },
    },
  },
  {
    id: 'presidential-pdf', title: 'Final List – Presidential', publisher: inec,
    url: 'https://inecnigeria.org/documents/uploads/2026/10/b5af9099-864c-4d5e-924d-e1a2c771c529-final-list-presidential.pdf',
    publishedAt: '2026-10-31', kind: 'catalogue',
    evidence: {
      tickets: {
        terms: [['18 named tickets'], ['accord'], ['court order']],
        summary: 'The INEC list names 18 presidential tickets. It also includes an Accord entry marked “COURT ORDER” with neither nominee named.',
      },
      pairing: {
        terms: [['presidential or vice presidential names'], ['bola ahmed tinubu'], ['kashim shettima']],
        summary: 'The presidential list pairs a candidate for president and a running mate on each named party ticket.',
      },
      sdp: {
        terms: [['adebayo adewole ebenezer'], ['sdp']],
        summary: 'The later INEC roster lists Adebayo Adewole Ebenezer as the SDP’s presidential candidate.',
      },
    },
  },
  {
    id: 'sdp-statement', title: '2027 Election: SDP Candidate Prioritises Security', publisher: 'Voice of Nigeria',
    url: 'https://von.gov.ng/2027-election-sdp-candidate-prioritises-security/',
    publishedAt: '2026-08-06', kind: 'html',
    evidence: {
      security: {
        terms: [['adewole adebayo'], ['prioritise the countrys security', 'prioritise national security'], ['if elected']],
        summary: 'Voice of Nigeria reported that Adewole Adebayo said he would prioritise national security if elected.',
      },
      summit: {
        terms: [['arewa awareness summit'], ['kaduna state']],
        summary: 'Voice of Nigeria attributes the remarks to a summit on insecurity in Kaduna State.',
      },
    },
  },
  {
    id: 'apc-manifesto', title: 'The Manifesto', publisher: 'All Progressives Congress · Renewed Hope',
    url: 'https://renewedhope02.com/manifesto', kind: 'html',
    evidence: {
      housing: {
        terms: [['october 2026'], ['housing'], ['mortgaged', 'mortgages'], ['handed over', 'handover'], ['public dashboard']],
        summary: 'The APC’s October 2026 manifesto proposes expanding social housing and affordable mortgages. It proposes tracking homes handed over and mortgaged.',
      },
    },
  },
]

const from = (sourceId: string, fact: string) => ({ sourceId, fact })
const milestone = (id: string, date: string, kind: 'reported' | 'published' | 'scheduled', title: string, sourceId: string, fact: string) =>
  ({ id, date, kind, title, evidence: [from(sourceId, fact)] })

export const recipes: Recipe[] = [
  {
    id: 'inec-recruitment-deadline-2027', title: 'INEC extends the election staff application deadline', topic: 'Election administration',
    primary: 'recruitment-notice',
    match: { from: '2026-11-18', through: '2026-11-21', terms: [['ad hoc staff recruitment', 'registration of ad hoc staff'], ['inecpress', 'inecpres'], ['2nd december', 'december 2']] },
    supporting: ['recruitment-statement'],
    explanation: [from('recruitment-notice', 'deadline')],
    context: [from('recruitment-statement', 'portal')],
    significance: [from('recruitment-notice', 'window')],
    sourceComparisons: [{
      evidence: [from('recruitment-notice', 'deadline'), from('recruitment-statement', 'cutoff')],
      summary: 'INEC’s own notice gives 2 December. The version republished by Press Release Naija gives 3 December. If applying, check INEC’s current notice or the official recruitment portal.',
    }],
    timeline: [
      milestone('recruitment-update', '2026-11-19', 'published', 'INEC publishes its deadline update', 'recruitment-notice', 'deadline'),
      milestone('revised-cutoff', '2026-12-02', 'scheduled', 'Revised cutoff stated in INEC’s own notice', 'recruitment-notice', 'deadline'),
    ],
    openQuestion: 'Has INEC clarified the difference between the two published dates?',
    quiz: {
      ...from('recruitment-notice', 'deadline'), id: 'recruitment-window',
      prompt: 'Which revised deadline appears in INEC’s own recruitment notice?',
      answer: '2 December 2026', distractors: ['18 November 2026', '3 December 2026'],
    },
  },
  {
    id: 'state-assembly-lists-2027', title: 'INEC publishes state assembly candidate lists', topic: 'Candidate records',
    primary: 'assembly-notice',
    match: { from: '2026-11-13', through: '2026-11-16', terms: [['state houses of assembly'], ['2027'], ['candidates']] },
    supporting: ['election-calendar'],
    explanation: [from('assembly-notice', 'lists')],
    context: [from('assembly-notice', 'navigation')],
    significance: [from('election-calendar', 'assembly')],
    sourceComparisons: [{
      evidence: [from('assembly-notice', 'lists'), from('election-calendar', 'assembly')],
      summary: 'INEC’s state-by-state lists identify the nominees. Its election calendar gives the scheduled voting date.',
    }],
    timeline: [
      milestone('assembly-lists-posted', '2026-11-14', 'published', 'INEC posts updated state assembly lists', 'assembly-notice', 'lists'),
      milestone('assembly-election-date', '2027-02-06', 'scheduled', 'State assembly elections scheduled', 'election-calendar', 'assembly'),
    ],
    quiz: {
      ...from('election-calendar', 'assembly'), id: 'state-election-date',
      prompt: 'When did the published INEC calendar schedule state assembly elections?',
      answer: '6 February 2027', distractors: ['16 January 2027', '28 November 2026'],
    },
  },
  {
    id: 'mock-accreditation-2026', title: 'What INEC’s mock accreditation will test', topic: 'Election process',
    primary: 'mock-notice',
    match: { from: '2026-11-11', through: '2026-11-14', terms: [['mock accreditation'], ['november 28', '28th november', 'nov 28'], ['electronic result transmission']] },
    supporting: ['voter-education', 'election-calendar'],
    explanation: [from('mock-notice', 'exercise')],
    context: [from('mock-report', 'announcement'), from('voter-education', 'accreditation')],
    significance: [from('election-calendar', 'presidential')],
    sourceComparisons: [{
      evidence: [from('mock-report', 'announcement'), from('mock-notice', 'exercise')],
      summary: 'Channels Television reported the announcement at Chatham House on 12 November. INEC’s notice the next day recorded the planned date and tests. Both concern the announcement of the same exercise.',
    }],
    timeline: [
      milestone('chatham-house-report', '2026-11-12', 'reported', 'Channels Television reports the announcement', 'mock-report', 'announcement'),
      milestone('mock-notice-posted', '2026-11-13', 'published', 'INEC publishes its notice', 'mock-notice', 'exercise'),
      milestone('mock-exercise-date', '2026-11-28', 'scheduled', 'Mock accreditation scheduled', 'mock-notice', 'exercise'),
    ],
    openQuestion: 'What did INEC find during the exercise? Look for a dated follow-up from the commission.',
    quiz: {
      ...from('mock-notice', 'exercise'), id: 'mock-purpose',
      prompt: 'What did INEC say the exercise would test?',
      answer: 'Accreditation and electronic result transmission', distractors: ['Campaign spending limits', 'The order of names on the ballot'],
    },
  },
  {
    id: 'presidential-roster-2027', title: 'The 2027 presidential candidate list is out', topic: 'Presidential election',
    primary: 'presidential-notice',
    match: { from: '2026-10-30', through: '2026-11-03', terms: [['2027 presidential election'], ['final list presidential']] },
    supporting: ['presidential-pdf', 'election-calendar', 'apc-manifesto'],
    contest: '2027-president', parties: ['A'],
    explanation: [from('presidential-pdf', 'tickets')],
    context: [from('presidential-pdf', 'pairing')],
    significance: [from('election-calendar', 'presidential')],
    commitment: {
      ...from('apc-manifesto', 'housing'), title: 'Expand social housing and affordable mortgages',
      kind: 'manifesto', personId: 'tinubu-bola-ahmed', date: '2026-10',
      comparison: 'The INEC list identifies Tinubu’s APC candidacy. The manifesto proposes a public dashboard counting homes handed over and mortgaged. Published handover and mortgage figures would help assess delivery.',
      document: {
        url: 'https://apc.com.ng/apc-2027-manifesto.pdf',
        section: '2027–2031 commitments · Pillar 2 · Mass social housing, affordable mortgages and secured land titles',
      },
    },
    sourceComparisons: [{
      evidence: [from('presidential-notice', 'list'), from('presidential-pdf', 'tickets')],
      summary: 'INEC’s notice introduces the roster. Its attached PDF records the 18 named tickets and the separate Accord entry. The notice and PDF are parts of the same publication.',
    }],
    timeline: [
      milestone('presidential-list-posted', '2026-10-31', 'published', 'INEC publishes its presidential list', 'presidential-notice', 'list'),
      milestone('presidential-election-date', '2027-01-16', 'scheduled', 'Presidential and National Assembly elections scheduled', 'election-calendar', 'presidential'),
    ],
    openQuestion: 'Has INEC published a revised entry for the Accord ticket?',
    quiz: {
      ...from('presidential-pdf', 'tickets'), id: 'named-tickets',
      prompt: 'How many presidential tickets name both nominees in the published 2027 list?',
      answer: '18', distractors: ['19', '20'],
    },
  },
  {
    id: 'adebayo-security-statement', title: 'Adewole Adebayo names security as a priority', topic: 'Campaign statement',
    primary: 'sdp-statement',
    match: { from: '2026-08-05', through: '2026-08-08', terms: [['adewole adebayo'], ['security'], ['if elected'], ['kaduna']] },
    supporting: ['presidential-pdf'], people: ['national-adebayo-adewole-ebenezer'], parties: ['SDP'],
    explanation: [from('sdp-statement', 'security')],
    context: [from('sdp-statement', 'summit')],
    significance: [from('presidential-pdf', 'sdp')],
    commitment: {
      ...from('sdp-statement', 'security'), title: 'Prioritise national security if elected',
      kind: 'public-statement', personId: 'national-adebayo-adewole-ebenezer', date: '2026-08-06',
      comparison: 'The later roster establishes the nomination. Assessing delivery would require a documented action, a timeline and relevant implementation records.',
    },
    sourceComparisons: [{
      evidence: [from('sdp-statement', 'security'), from('presidential-pdf', 'sdp')],
      summary: 'Voice of Nigeria reports Adebayo’s campaign statement. The later INEC roster confirms his SDP nomination. The roster is evidence of candidacy and the report is evidence of the stated priority.',
    }],
    timeline: [
      milestone('security-priority-reported', '2026-08-06', 'reported', 'Voice of Nigeria reports Adebayo’s remarks', 'sdp-statement', 'security'),
      milestone('sdp-candidacy-listed', '2026-10-31', 'published', 'INEC lists Adebayo as the SDP nominee', 'presidential-pdf', 'sdp'),
    ],
    openQuestion: 'What actions, funding and timing would put this priority into practice?',
    quiz: {
      ...from('sdp-statement', 'security'), id: 'sdp-security-priority',
      prompt: 'What priority did Voice of Nigeria report that Adebayo named?',
      answer: 'National security', distractors: ['Tax collection', 'Housing construction'],
    },
  },
]

export const catalogueSources = new Map([['presidential-pdf', '2027-president']])
