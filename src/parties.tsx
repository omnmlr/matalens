import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Bird, BrushCleaning, Check, CircleCheck, Flag, Handshake, Star, Umbrella, UsersRound } from 'lucide-react'
import { contests, contestPath, matchWords, parties, partyNames, partyPath, presidential, roster, rosterFor, sources } from './catalogue'
import { CandidateRows, SearchField, useElectionYear, useQueryField } from './directory'
import { ContestList, type PlanProps } from './explorer'
import { ActionLink, External } from './ui'

const symbolSource = 'https://wp1.inecnigeria.org/wp-content/uploads/2024/02/2023-GENERAL-ELECTION-REPORT-1.pdf'
const symbols = [
  { party: 'AA', label: 'A star', icon: Star, registered: '29 May 2005' },
  { party: 'ADC', label: 'A handshake', icon: Handshake, registered: '22 March 2006' },
  { party: 'APC', label: 'A broom', icon: BrushCleaning, registered: '31 July 2012' },
  { party: 'APGA', label: 'A rooster', icon: Bird },
  { party: 'LP', label: 'People inside a wheel', icon: UsersRound, source: 'https://www.inecnigeria.org/wp-content/uploads/2019/02/LP-Constitution.pdf' },
  { party: 'PDP', label: 'An umbrella', icon: Umbrella, source: 'https://www.inecnigeria.org/documents/resources/downloads/REPORT-OF-THE-2019-GENERAL-ELECTION.pdf' },
]
type Mode = 'symbols' | 'candidates'
type Question = { prompt: string; clue: string; options: string[]; answer: string; source: string; icon?: typeof Flag }

function shuffle<T>(values: T[]) {
  const items = [...values]
  for (let index = items.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[items[index], items[other]] = [items[other], items[index]]
  }
  return items
}

function makeQuestions(mode: Mode): Question[] {
  if (mode === 'symbols') return shuffle(symbols).map(({ party, icon, label, source }) => ({
    prompt: 'Which party uses this symbol?',
    clue: label, icon, answer: party,
    options: shuffle([party, ...shuffle(symbols.map(item => item.party).filter(code => code !== party)).slice(0, 3)]),
    source: source ?? symbolSource,
  }))
  const tickets = rosterFor(presidential)
  return shuffle(tickets).slice(0, 6).map(person => ({
    prompt: 'Which party listed this 2027 presidential candidate?',
    clue: person.name, answer: person.party,
    options: shuffle([person.party, ...shuffle(tickets.map(item => item.party).filter(code => code !== person.party)).slice(0, 3)]),
    source: sources[presidential.sourceId].url,
  }))
}

export function PartyPractice() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const question = questions[index]
  const Symbol = question?.icon

  useEffect(() => { if (mode) heading.current?.focus() }, [mode, index])
  useEffect(() => { if (answered) feedback.current?.focus() }, [answered])

  function start(next: Mode | null) {
    setMode(next)
    setQuestions(next ? makeQuestions(next) : [])
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setScore(0)
  }
  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || answered) return
    if (selected === question.answer) setScore(count => count + 1)
    setAnswered(true)
  }
  function advance() {
    setIndex(index + 1)
    setSelected('')
    setAnswered(false)
  }

  return <section className="wrap standard-page party-practice">
    <a className="text-link back-link" href="/parties"><ArrowLeft size={16} /> Party directory</a>
    <div className="catalogue-title"><p className="kicker">Voter education / Recognition</p><h1>Know your party</h1><p>Learn to recognize party names, symbols and election-specific candidate records.</p></div>
    {!mode ? <div className="module-options">
      <button type="button" onClick={() => start('symbols')}><Flag size={27} strokeWidth={1.5} /><span><strong>Recognize party symbols</strong><small>Match illustrated clues to symbols documented by INEC.</small></span><ArrowRight size={19} /></button>
      <button type="button" onClick={() => start('candidates')}><UsersRound size={27} strokeWidth={1.5} /><span><strong>Match a candidate to a party</strong><small>Practise with the official 2027 presidential list.</small></span><ArrowRight size={19} /></button>
    </div> : <div className="practice-shell">
      <button className="link-button practice-back" type="button" onClick={() => start(null)}><ArrowLeft size={16} /> All exercises</button>
      {!question ? <div className="panel success-panel"><CircleCheck size={28} aria-hidden="true" /><h2 ref={heading} tabIndex={-1}>You got {score} of {questions.length} right.</h2><p>{score === questions.length ? 'You matched every clue.' : 'Try another round to revisit these associations.'} Each round shuffles the questions and choices.</p><button type="button" className="button" onClick={() => start(mode)}>Try again <ArrowRight size={16} /></button></div> :
        <form className="panel quiz-panel" onSubmit={check}>
          <div className="quiz-meta"><span>{mode === 'symbols' ? 'Symbol recognition' : '2027 presidential list'}</span><span>{index + 1} / {questions.length}</span></div>
          <progress className="progress" max={questions.length} value={index + Number(answered)} aria-label="Exercise progress" />
          <h2 ref={heading} tabIndex={-1} id="party-question">{question.prompt}</h2>
          <div className="party-clue" data-symbol={mode === 'symbols' ? question.answer : undefined}>{Symbol && <Symbol size={48} strokeWidth={1.35} aria-hidden="true" />}<strong>{question.clue}</strong>{Symbol && <small>Illustrated symbol clue</small>}</div>
          <fieldset className="quiz-options" disabled={answered} aria-labelledby="party-question">
            {question.options.map(option => <label key={option} className={answered && question.answer === option ? 'correct-option' : ''}><input type="radio" name="party" checked={selected === option} onChange={() => setSelected(option)} /><span>{partyNames[option]} ({option})</span>{answered && question.answer === option && <Check size={18} aria-hidden="true" />}</label>)}
          </fieldset>
          {answered && <div className="quiz-feedback" tabIndex={-1} ref={feedback} role="status"><strong>{selected === question.answer ? 'That’s right.' : 'Here’s the correct answer.'}</strong><p>{mode === 'symbols' ? `${partyNames[question.answer]} uses this motif in the INEC source.` : `INEC lists ${question.clue} under ${partyNames[question.answer]} for the 2027 presidential election.`}</p><External href={question.source}>Read the source</External></div>}
          {answered ? <button key="advance" className="button" type="button" onClick={advance}>{index + 1 === questions.length ? 'See my score' : 'Next question'} <ArrowRight size={16} /></button> : <button key="check" className="button" type="submit" disabled={!selected}>Check answer <ArrowRight size={16} /></button>}
        </form>}
    </div>}
  </section>
}

export function Parties({ party, ...props }: { party?: string } & PlanProps) {
  const [query, setQuery] = useQueryField('q')
  const [year] = useElectionYear()
  const cycleRecords = roster.filter(record => record.race.year === year)
  const partyCodes = new Set(cycleRecords.map(record => record.party))
  const cycleQuery = year === 2023 ? '?year=2023' : ''
  const records = Object.values(parties).filter(record => partyCodes.has(record.code)).sort((a, b) => a.name.localeCompare(b.name, 'en-NG'))
  const shown = records.filter(record => matchWords(record.code + ' ' + record.name, query))
  const people = party ? cycleRecords.filter(item => item.party === party) : []
  const symbol = symbols.find(item => item.party === party)
  const Symbol = symbol?.icon
  return <section className="wrap standard-page party-page">
    {party && <a className="text-link back-link" href={'/parties' + cycleQuery}><ArrowLeft size={16} /> {year} parties</a>}
    <div className="catalogue-title"><p className="kicker">{party ? `${party} · ${year} Election records` : `${year} Election records`}</p><h1>{party ? partyNames[party] : 'Political parties'}</h1><p>{party ? 'Explore the party’s candidates and contests by election year.' : 'Learn party names and abbreviations, and see which candidates INEC lists for each party.'}</p></div>
    <nav className="cycle-links" aria-label="Party record cycle">
      <a className="text-link" href={party ? partyPath(party) : '/parties'} aria-current={year === 2027 ? 'page' : undefined}>2027 elections</a>
      <a className="text-link" href={(party ? partyPath(party) : '/parties') + '?year=2023'} aria-current={year === 2023 ? 'page' : undefined}>2023 archive</a>
    </nav>
    {!party && <div className="party-directory-actions"><ActionLink href="/parties/practice">Start Know Your Party</ActionLink><External href={sources.register.url}>INEC party register</External></div>}
    <div className="record-grid">
      <div>
        {party ? <>
          <h2>{year} candidate records</h2>{people.length ? <CandidateRows people={people} withRace {...props} /> : <p>MataLens has no candidate listing for this party in the selected election cycle.</p>}
          {people.length > 0 && <section className="record-section"><h2>Contests in this catalogue</h2><ContestList races={contests.filter(race => people.some(person => person.contestId === race.id))} /></section>}
        </> : <>
          <SearchField label="Party name or abbreviation" value={query} update={setQuery} placeholder="e.g. Labour Party" />
          <p className="directory-caption" role="status">{shown.length} {shown.length === 1 ? 'party' : 'parties'} in these records</p>
          <ul className="party-directory">{shown.map(record => {
            const item = symbols.find(symbol => symbol.party === record.code)
            const Icon = item?.icon
            return <li key={record.code}><a href={partyPath(record.code) + cycleQuery}><span className="party-mark">{Icon ? <Icon size={23} aria-hidden="true" /> : record.code}</span><span><strong>{record.name}</strong><small>{record.code}{item && ` · Symbol clue: ${item.label.toLowerCase()}`}</small></span><ArrowRight size={16} aria-hidden="true" /></a></li>
          })}</ul>
          {!shown.length && <div className="directory-note"><p>No parties match this search.</p><button className="link-button" type="button" onClick={() => setQuery('')}>Clear search</button></div>}
        </>}
      </div>
      <aside className="source-rail party-rail">
        {Symbol && <div className="party-clue" data-symbol={party}><Symbol size={44} aria-hidden="true" /><strong>{symbol?.label}</strong><small>Illustrated symbol clue</small></div>}
        <h2>{party ? 'Registration and sources' : 'About this directory'}</h2>
        {symbol?.registered && <p>INEC records a registration date of {symbol.registered}.</p>}
        {symbol && <External href={symbol.source ?? symbolSource}>Source for the symbol</External>}
        {party ? <><ActionLink href="/parties/practice" secondary>Try party practice</ActionLink><External href={sources.register.url}>INEC party register</External></> : <p>Party names and abbreviations link to the elections in which they appear in the MataLens catalogue.</p>}
        <a className="text-link" href={year === 2023 ? '/archive' : contestPath(presidential)}>{year === 2023 ? '2023 Election Archive' : '2027 presidential candidates'} <ArrowRight size={16} /></a>
      </aside>
    </div>
  </section>
}
