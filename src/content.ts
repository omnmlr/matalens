export const reviewed = '2026-11-18'
export const links = {
  calendar: 'https://www.inecnigeria.org/elections/calendar',
  education: 'https://www.inecnigeria.org/voters/education',
  guidelines: 'https://www.inecnigeria.org/elections/guidelines',
  polling: 'https://cvr.inecnigeria.org/pu',
  voterStatus: 'https://cvr.inecnigeria.org/vvs',
  pollingGuide: 'https://www.inecnigeria.org/polling-units',
  updates: 'https://www.inecnigeria.org/press/2027-general-elections-update',
  race: 'https://www.inecnigeria.org/documents/uploads/2026/10/b7e9758b-56ae-4068-89c0-8a4b38dd5d35-final-list-lagos-house-of-representatives.pdf#page=14',
  parties: 'https://www.inecnigeria.org/parties',
  allHouse: 'https://www.inecnigeria.org/press/updated-list-of-candidates-for-jan-2027-national-assembly-elections',
  assembly: 'https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-state-houses-of-assembly-elections',
  mock: 'https://inecnigeria.org/press/inec-sets-28th-november-2026-for-nationwide-mock-accreditation-exercise',
}
export const dates = [
  { date: '2027-01-16', title: 'Presidential and National Assembly elections', shortLabel: 'Next general election', scope: 'Nationwide · President, Senate and House of Representatives' },
  { date: '2027-02-06', title: 'Governorship and State House of Assembly elections', shortLabel: 'Next general election', scope: 'Participating states and constituencies' },
]

export const states = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const steps = [
  { id: 'status', label: 'Check my voter registration' },
  { id: 'unit', label: 'Confirm where I vote' },
  { id: 'ballot', label: 'Read my ballot information' },
  { id: 'pvc', label: 'Set aside my PVC for election day' },
]

export const race = { constituency: 'Surulere I', state: 'Lagos', office: 'House of Representatives' }
export const partyNames: Record<string, string> = {
  AAC: 'African Action Congress', ADC: 'African Democratic Congress', APC: 'All Progressives Congress',
  APM: 'Allied Peoples Movement', APP: 'Action Peoples Party', NDC: 'Nigeria Democratic Congress',
  NRM: 'National Rescue Movement', PDP: 'Peoples Democratic Party',
}
export const candidates = [
  { id: 'ndc-176', name: 'Adebayo Adefolaseye Adebomi', party: 'NDC', age: 53, qualification: 'PSCE, SSCE, MBChB, FWACS, FMC-OP' },
  { id: 'nrm-177', name: 'Adepitan Olusegun Olatunji', party: 'NRM', age: 60, qualification: 'Primary School Leaving Certificate, WAEC, BSc' },
  { id: 'adc-172', name: 'Adeshina Riliwan Kofoworola', party: 'ADC', age: 37, qualification: 'Primary school testimonial, WAEC, HND' },
  { id: 'app-175', name: 'Ishaaq Tunde Kazeem', party: 'APP', age: 49, qualification: 'WASSCE' },
  { id: 'apc-173', name: 'Laguda Fuad Kayode', party: 'APC', age: 49, qualification: 'FSLC, SSCE, BSc' },
  { id: 'aac-171', name: 'Odebunmi Obafemi Babatunde', party: 'AAC', age: 37, qualification: 'FSLC, SSCE, BSc' },
  { id: 'apm-174', name: 'Oworu Olumide Abiodun', party: 'APM', age: 31, qualification: 'First School Leaving, SSCE, BSc' },
  { id: 'pdp-178', name: 'Ugbah Ozo-Brown Lewis', party: 'PDP', age: 54, qualification: 'First School Leaving Certificate, WAEC, BSc Political Science' },
]

export const updates = [
  { title: 'Updated State House of Assembly candidate lists', date: '2026-11-14', href: links.assembly, detail: 'INEC published final lists by state for the 2027 State House of Assembly elections.' },
  { title: 'Mock accreditation announced for 28 November', date: '2026-11-13', href: links.mock, detail: 'INEC announced a nationwide exercise to test accreditation and electronic result transmission. See the notice for context.' },
]

export type Question = { prompt: string; options: string[]; correct: number; explanation: string }
export const procedures: Question[] = [
  { prompt: 'Before leaving home, how do you check where to vote?', options: ['Go to the nearest voting location', 'Check my assigned polling unit with INEC', 'Ask which queue moves fastest'], correct: 1, explanation: 'You vote at the polling unit where you are registered. Use the INEC lookup ahead of time.' },
  { prompt: 'You’ve arrived at your polling unit. What do you bring out for accreditation?', options: ['A photo of my PVC', 'My national ID card', 'My physical Permanent Voter Card (PVC)'], correct: 2, explanation: 'Bring your physical PVC. Officials check the voter register and verify you using the Bimodal Voter Accreditation System (BVAS).' },
  { prompt: 'An official hands you a ballot paper. Where do you mark your choice?', options: ['In the private voting cubicle', 'In front of the queue', 'At home later'], correct: 0, explanation: 'The voting cubicle protects the secrecy of your vote. Keep your marked ballot private.' },
  { prompt: 'What should you do after marking your ballot?', options: ['Show the marked ballot to a friend', 'Fold it inward and place it in the designated ballot box', 'Hand the marked ballot to a party agent'], correct: 1, explanation: 'Fold the ballot inward so your choice stays private, then put it in the designated ballot box.' },
]

export const recognition: Question[] = candidates.map((candidate, index) => {
  const options = [candidate.party, candidates[(index + 2) % candidates.length].party, candidates[(index + 5) % candidates.length].party].sort()
  return {
    prompt: `Which party abbreviation is listed for ${candidate.name}?`,
    options, correct: options.indexOf(candidate.party),
    explanation: `The INEC list shows ${candidate.party} beside ${candidate.name} for Surulere I.`,
  }
})
