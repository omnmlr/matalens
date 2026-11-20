import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Check, ChevronDown, CircleCheck, FileText, Fingerprint, GraduationCap, Landmark, ListChecks, LockKeyhole, MapPin, ScanLine, Search, Vote } from 'lucide-react'
import { candidates, dates, links, partyNames, procedures, race, recognition, reviewed, states, steps, updates } from './content'
import { contestPath, presidential } from './catalogue'
import { daysUntilNigeria, downloadReminder, nigeriaDate, type Plan } from './state'
import { ActionLink, CheckRow, External, PageTitle } from './ui'

type PlanProps = { plan: Plan; updatePlan: (value: Partial<Plan>) => boolean }

export function Election({ plan, updatePlan }: PlanProps) {
  return <div className="wrap standard-page election-page">
    <PageTitle eyebrow="ELECTION PREPARATION" title="My Election" icon={Vote}>Explore your ballot, check where you vote and keep your preparation in one place.</PageTitle>
    <nav className="election-jump" aria-label="On this page">
      <a href="#candidates"><Landmark size={17} /> Candidates</a>
      <a href="#polling-unit"><MapPin size={17} /> Polling unit</a>
      <a href="#polling-plan"><ListChecks size={17} /> My plan</a>
    </nav>
    <div className="prep-jump"><a className="text-link" href={contestPath(presidential)}>Presidential candidates <ArrowRight size={16} /></a><a className="text-link" href="/my-ballot">Find my other contests <ArrowRight size={16} /></a></div>
    <div className="page-grid election-grid">
      <div className="main-column">
        <section className="editorial-section" id="polling-unit">
          <div className="section-head"><div><p className="eyebrow">Official guidance</p><h2>Find your polling unit</h2></div><MapPin className="section-icon" size={24} /></div>
          <p>Look up where you’re registered to vote. You can bring the public polling-unit name or code back to your private plan.</p>
          <External href={links.polling} className="button">Open INEC polling-unit finder</External>
          <div className="guide-steps">
            <article><h3>Check your registration</h3><p>Confirm that your details appear on the voter register. Bring your physical Permanent Voter Card (PVC) for accreditation.</p><External href={links.voterStatus}>Check voter status with INEC</External></article>
            <article><h3>Know what happens at the polls</h3><p>Officials check your registration and accredit you with BVAS before issuing a ballot. Mark your choice in the private cubicle.</p><External href={links.education}>Read INEC voter guidance</External></article>
          </div>
        </section>
        <PollingPlan plan={plan} updatePlan={updatePlan} />
        <CandidateRace plan={plan} updatePlan={updatePlan} />
      </div>
      <aside className="side-column election-sidebar" aria-label="Election dates and preparation">
        <section className="rail-section" id="election-dates">
          <div className="rail-heading"><CalendarDays size={18} /><h2>Election dates</h2></div>
          <div className="date-list">
            {dates.map(item => {
              const days = daysUntilNigeria(item.date)
              return <article className="date-entry" key={item.date}>
                <time className="date-tile" dateTime={item.date}><strong>{nigeriaDate(item.date, { day: 'numeric' })}</strong><span>{nigeriaDate(item.date, { month: 'short' })}</span></time>
                <div><h3>{item.title}</h3><p>{item.scope}</p><p>{days === 0 ? 'Today' : days > 0 ? `${days} days away` : nigeriaDate(item.date, { year: 'numeric' })}</p>
                  <button className="link-button" onClick={() => downloadReminder(item.date, item.title, `Check the latest date and local details with INEC. ${links.calendar}`)}>Download calendar event <ArrowUpRight size={14} /></button>
                </div>
              </article>
            })}
          </div>
          <External href={links.calendar}>Check the INEC calendar</External>
        </section>
        <section className="rail-section checklist-section" aria-label="Your checklist">
          <div className="rail-heading"><ListChecks size={18} /><h2>My checklist</h2></div>
          <p>{plan.checklist.length} of {steps.length} done · Saved on this device</p>
          <progress className="progress" max={steps.length} value={plan.checklist.length} aria-label="Checklist progress" />
          <div className="checklist">
            {steps.map(step => <CheckRow key={step.id} checked={plan.checklist.includes(step.id)} onChange={() => updatePlan({ checklist: plan.checklist.includes(step.id) ? plan.checklist.filter(item => item !== step.id) : [...plan.checklist, step.id] })}>{step.label}</CheckRow>)}
          </div>
        </section>
        <a className="utility-row practice-shortcut" href="/practice"><GraduationCap size={23} /><span><strong>Start practice</strong><small>Rehearse election day</small></span><ArrowRight size={17} /></a>
      </aside>
    </div>
  </div>
}

function PollingPlan({ plan, updatePlan }: PlanProps) {
  const [feedback, setFeedback] = useState('')
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const saved = updatePlan({
      state: String(values.get('state') ?? ''),
      lga: String(values.get('lga') ?? '').trim(),
      pollingUnit: String(values.get('pollingUnit') ?? '').trim(),
      notes: String(values.get('notes') ?? '').trim(),
      reminder: String(values.get('reminder') ?? ''),
    })
    setFeedback(saved ? 'Your plan is updated on this device.' : '')
  }
  return <section className="editorial-section" id="polling-plan">
    <div className="section-head"><div><p className="eyebrow">Saved on this device</p><h2>Make a private plan</h2></div><LockKeyhole className="section-icon" size={23} /></div>
    <p>Fill in whatever helps you get there. Every field is optional.</p>
    <form className="field-stack" onSubmit={save} onChange={() => setFeedback('')}>
      <div className="field-grid">
        <label>State<select name="state" defaultValue={plan.state}><option value="">Choose a state</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
        <label>Local government area<input name="lga" defaultValue={plan.lga} maxLength={80} placeholder="e.g. Surulere" /></label>
      </div>
      <label>Polling-unit name or code<input name="pollingUnit" defaultValue={plan.pollingUnit} maxLength={120} placeholder="Copy the details from INEC" /></label>
      <label>Preparation notes<textarea name="notes" defaultValue={plan.notes} maxLength={600} rows={3} placeholder="Directions, what to bring or when to leave" /></label>
      <label>Personal reminder date<input type="date" name="reminder" defaultValue={plan.reminder} min="2020-01-01" max="2100-12-31" /><span className="field-help">Save a date here, then export it to your calendar for an alert.</span></label>
      <div className="button-row"><button className="button" type="submit">Save my plan <Check size={17} /></button>{plan.reminder && <button className="button button-secondary" type="button" onClick={() => downloadReminder(plan.reminder, 'Election preparation', 'Open MataLens to review your private preparation.')}>Export reminder <CalendarDays size={16} /></button>}</div>
      <p className="field-feedback" role="status">{feedback}</p>
    </form>
  </section>
}

function CandidateRace({ plan, updatePlan }: PlanProps) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const matches = candidates.filter(item => `${item.name} ${item.party} ${partyNames[item.party]}`.toLowerCase().includes(query))
  const list = useRef<HTMLUListElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    function openLinkedCandidate() {
      const id = window.location.hash.slice(1)
      if (!id.startsWith('candidate-')) return
      const row = document.getElementById(id)
      const details = row && list.current?.contains(row) ? row.querySelector('details') : null
      if (details) details.open = true
    }
    openLinkedCandidate()
    window.addEventListener('hashchange', openLinkedCandidate)
    return () => window.removeEventListener('hashchange', openLinkedCandidate)
  }, [])

  function clearSearch() {
    setSearch('')
    searchInput.current?.focus()
  }

  return <section className="candidate-section" id="candidates" aria-labelledby="constituency-title">
    <div className="constituency-head">
      <div className="constituency-copy"><p className="eyebrow"><MapPin size={14} /> {race.state} · Federal constituency</p><h2 id="constituency-title">{race.constituency}</h2><p>{race.office}</p></div>
      <div className="constituency-source"><time dateTime={dates[0].date}>{nigeriaDate(dates[0].date, { dateStyle: 'long' })}</time><External href={links.race}>INEC list, rows 171–178</External><small>Source checked {nigeriaDate(reviewed)}</small></div>
    </div>
    <div className="roster-toolbar">
      <div><h3>Candidate register</h3><p>{candidates.length} candidates on the INEC list</p></div>
      <label className="candidate-search"><span className="sr-only">Search by name or party</span><Search size={18} /><input ref={searchInput} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name or party" /></label>
    </div>
    <p className="roster-caption" aria-live="polite">{query ? `${matches.length} of ${candidates.length} candidates` : 'Listed alphabetically'}</p>
    <ul className="candidate-list" ref={list}>
      {matches.map(candidate => {
        const saved = plan.candidates.includes(candidate.id)
        const party = partyNames[candidate.party]
        return <li className="candidate" key={candidate.id} id={`candidate-${candidate.id}`}>
          <details>
            <summary aria-label={`Candidate details for ${candidate.name}`}>
              <span className="party-code">{candidate.party}</span>
              <span className="candidate-identity"><strong>{candidate.name}</strong><span>{party}</span></span>
              <span className="candidate-disclosure"><span className="when-closed">View details</span><span className="when-open">Hide details</span><ChevronDown size={17} /></span>
            </summary>
            <div className="candidate-facts">
              <dl><div><dt>Office</dt><dd>{race.office}</dd></div><div><dt>Constituency</dt><dd>{race.constituency}, {race.state}</dd></div><div><dt>Age on INEC list</dt><dd>{candidate.age}</dd></div><div><dt>Listed qualifications</dt><dd>{candidate.qualification}</dd></div></dl>
              <External href={links.race}>INEC source · row {candidate.id.split('-')[1]}</External>
            </div>
          </details>
          <button className="icon-button bookmark" type="button" aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${candidate.name}${saved ? ' from' : ' to'} my preparation`} title={saved ? 'Remove private bookmark' : 'Save privately'} onClick={() => updatePlan({ candidates: saved ? plan.candidates.filter(id => id !== candidate.id) : [...plan.candidates, candidate.id] })}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button>
        </li>
      })}
    </ul>
    {!matches.length && <div className="empty-inline"><p>No candidates match that search.</p><button className="link-button" type="button" onClick={clearSearch}>Clear search</button></div>}
    <div className="roster-footer" id="coverage"><p><LockKeyhole size={15} /> Bookmarks stay in this browser.</p><p>This register covers Surulere I. <External href={links.allHouse}>Find other House of Representatives lists</External></p><p><a className="text-link" href="/elections">Explore more published contests</a></p></div>
  </section>
}

export function Practice({ complete }: { complete: () => void }) {
  const [mode, setMode] = useState<'procedures' | 'recognition' | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const questions = mode === 'recognition' ? recognition : procedures
  const question = questions[index]
  const finished = mode && index >= questions.length
  const source = mode === 'recognition' ? links.race : links.education

  useEffect(() => { if (mode) heading.current?.focus({ preventScroll: true }) }, [mode, index])
  useEffect(() => { if (answered) feedback.current?.focus({ preventScroll: true }) }, [answered])

  function restart(next: typeof mode) {
    setMode(next)
    setIndex(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
  }

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selected === null || answered) return
    if (selected === question.correct) setScore(score + 1)
    setAnswered(true)
  }

  function advance() {
    if (index + 1 === questions.length && mode === 'procedures') complete()
    setIndex(index + 1)
    setSelected(null)
    setAnswered(false)
  }

  return <section className="wrap standard-page practice-page">
    {mode ? <div className="task-heading"><GraduationCap size={20} /><h1>Practice</h1></div> :
      <PageTitle eyebrow="ELECTION PREPARATION" title="Practise election day" icon={ScanLine}>Get familiar with polling-day steps and learn to read a candidate list.</PageTitle>}
    {!mode && <div className="journey-grid practice-options">
      <button className="journey-card mint" onClick={() => restart('procedures')}><span className="card-icon"><Vote size={23} /></span><span className="card-arrow"><ArrowUpRight size={20} /></span><h2>Election day</h2><p>Four everyday decisions, from finding your unit to casting your ballot.</p><span className="card-link">Start rehearsal <ArrowRight size={16} /></span></button>
      <button className="journey-card sand" onClick={() => restart('recognition')}><span className="card-icon"><Landmark size={23} /></span><span className="card-arrow"><ArrowUpRight size={20} /></span><h2>Read a candidate list</h2><p>Match all eight Surulere I candidates to the abbreviations on the INEC list.</p><span className="card-link">Start recognition <ArrowRight size={16} /></span></button>
    </div>}
    {!mode && <div className="prep-jump"><a className="text-link" href="/parties/practice">Practise party symbols and presidential tickets <ArrowRight size={16} /></a></div>}
    {mode && <div className="practice-shell">
      <button className="link-button practice-back" onClick={() => restart(null)}><ArrowLeft size={16} /> All exercises</button>
      {finished ? <div className="panel success-panel"><span className="success-icon"><CircleCheck size={29} /></span><p className="eyebrow">EXERCISE COMPLETE</p><h2 tabIndex={-1} ref={heading}>You got {score} of {questions.length} right.</h2><p>Revisit the source or go through the exercise again at your pace.</p><div className="button-row"><button className="button" onClick={() => restart(mode)}>Try again <ArrowRight size={17} /></button><External href={source}>Read the INEC source</External></div></div> : <form className="panel quiz-panel" onSubmit={check}>
        <div className="quiz-meta"><span>{mode === 'recognition' ? 'SURULERE I CANDIDATE LIST' : 'ELECTION DAY REHEARSAL'}</span><span>{index + 1} / {questions.length}</span></div>
        <progress className="progress" max={questions.length} value={index + Number(answered)} aria-label="Exercise progress" />
        <h2 tabIndex={-1} ref={heading} id="question-title">{question.prompt}</h2>
        <fieldset className="quiz-options" aria-labelledby="question-title" disabled={answered}>
          {question.options.map((option, optionIndex) => <label key={option} className={answered && optionIndex === question.correct ? 'correct-option' : ''}>
            <input type="radio" name="option" checked={selected === optionIndex} onChange={() => setSelected(optionIndex)} />
            <span>{option}</span>{answered && optionIndex === question.correct && <Check size={19} />}
          </label>)}
        </fieldset>
        {answered && <div className="quiz-feedback" ref={feedback} tabIndex={-1} role="status"><strong>{selected === question.correct ? 'That’s right.' : 'Here’s the correct answer.'}</strong><p>{question.explanation}</p><External href={source}>INEC source</External></div>}
        <div className="button-row">{answered ? <button key="advance" className="button" type="button" onClick={advance}>{index + 1 === questions.length ? 'See my score' : 'Next question'} <ArrowRight size={17} /></button> : <button key="check" className="button" type="submit" disabled={selected === null}>Check answer <ArrowRight size={17} /></button>}</div>
      </form>}
    </div>}
  </section>
}

export function Sources() {
  return <section className="wrap standard-page narrow">
    <PageTitle eyebrow="INFORMATION & ATTRIBUTION" title="Sources & updates" icon={FileText}>Dated announcements and the official references behind MataLens.</PageTitle>
    <div className="panel">
      <h2>Recent INEC notices</h2>
      <div className="source-list">{updates.map(item => <article key={item.href}><p className="eyebrow">INEC · {nigeriaDate(item.date)}</p><h3>{item.title}</h3><p>{item.detail}</p><External href={item.href}>Read the notice</External></article>)}</div>
      <External href={links.updates}>Find newer updates at INEC</External>
    </div>
    <div className="panel prose">
      <h2>Where our guides come from</h2>
      <p>We checked the sources below on {nigeriaDate(reviewed, { dateStyle: 'long' })}. MataLens is an independent civic project. Check the original source for changes, especially before travelling to vote.</p>
      <ul>
        <li><External href={links.calendar}>INEC election dates</External></li>
        <li><External href={links.education}>INEC voter education and procedures</External></li>
        <li><External href={links.guidelines}>INEC regulations and guidelines</External></li>
        <li><External href={links.pollingGuide}>INEC polling-unit guidance</External></li>
        <li><External href={links.parties}>INEC political party register</External></li>
        <li><External href={links.race}>INEC list used for Surulere I candidate records</External></li>
      </ul>
    </div>
  </section>
}
